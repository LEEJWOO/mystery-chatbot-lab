#!/usr/bin/env python3
"""맨몸 기준판 반자동 도구. 옷 입은 기본 자세(얼굴 비운 그림)를 NovelAI 인페인트로 반복해 벗겨 나가는 작업을 돕는다.

하위 명령
  score     후보들을 '피부가 드러난 정도'와 '남은 옷'으로 순위 매김 → 다음 회차 원본을 고름
  nextmask  남은 옷 영역만 흰색으로 칠한 마스크(다음 회차 인페인트 범위 안내용)
  finish    마무리: 턱 위·바뀌지 않아야 할 곳을 원본으로 되돌림 + 흰 배경 투명화 + 점검표(남은 옷·얼룩 강조 보기)
  merge     후보 여러 장에서 부위(사각형)를 골라 한 장으로 섞기
  headfix   맨얼굴 마무리: 원본(얼굴 있는 착의)의 앞머리·윤곽·피부색 + 이목구비 자리만 빈 얼굴, 몸은 결과 그대로

  python3 -I body_base.py score    --orig 원본.png --cand 후보1.png 후보2.png ... [--out 점수.png]
  python3 -I body_base.py nextmask --orig 원본.png --cand 고른후보.png --out 다음마스크.png [--grow 12]
  python3 -I body_base.py finish   --orig 원본.png --cand 최종후보.png --out 결과폴더 [--chin Y]
  python3 -I body_base.py headfix  --orig 원본(얼굴 있음).png --cand 맨몸맨얼굴.png --out 결과.png [--chin Y]
  python3 -I body_base.py merge    --base 후보A.png --take 후보B.png:x0,y0,x1,y1 [--take ...] --out 합본.png [--feather 12]

공통 원칙: 크기·위치는 절대 바꾸지 않는다(표시 규칙). 원본과 후보는 같은 크기여야 하며 다르면 멈춘다.
'원본' = 옷 입은 기본 자세(얼굴 비운 그림, 투명 배경 권장). 이 그림의 머리·머리카락이 최종본에 그대로 남는다.
--zone = 첫 회차에 옷을 덮은 인페인트 마스크(흰색=옷). 있으면 훨씬 정확하다(머리카락·옷 색이 비슷한 인물은 사실상 필수).
       손·목처럼 원래 피부인 곳은 칠하지 않는다(안 바뀐 곳은 '남은 것'으로 센다).
--orig 는 회차가 바뀌어도 언제나 '첫 회차 원본'(옷 입은 그림)을 넣는다. 바뀐 곳을 이 그림과 비교해 판정한다.
"""
import argparse, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as nd
import matplotlib.colors as mc


def load(p):
    return np.asarray(Image.open(p).convert('RGBA')).astype(np.float32)


def same(a, b, pa, pb):
    if a.shape != b.shape:
        sys.exit(f'크기가 다름: {pb} {b.shape[1]}x{b.shape[0]} / {pa} {a.shape[1]}x{a.shape[0]} (보정하지 않음)')


def flat_rgb(X):
    """투명 부분을 흰색 위에 얹어 RGB로(NovelAI 결과와 같은 조건으로 비교)."""
    al = X[..., 3:4] / 255
    return X[..., :3] * al + 255 * (1 - al)


def skin_mask(X):
    h = mc.rgb_to_hsv(np.clip(X[..., :3], 0, 255) / 255)
    return (((h[..., 0] < .12) | (h[..., 0] > .9)) & (h[..., 1] > .07) & (h[..., 1] < .55) & (h[..., 2] > .62)
            & (X[..., 3] > 200))


def chin_y(O):
    """얼굴(가장 큰 위쪽 피부 덩어리)의 아래 끝 = 턱."""
    sk = nd.binary_opening(skin_mask(O), iterations=2)
    H = O.shape[0]
    lab, n = nd.label(sk[:H // 2])
    if not n:
        return None
    sizes = nd.sum(np.ones_like(lab), lab, range(1, n + 1))
    l = int(np.argmax(sizes)) + 1
    ys, xs = np.where(lab == l)
    cx = int(np.median(xs))
    col = sk[:, max(0, cx - 6):cx + 6].any(1)
    y = ys.max()
    # 얼굴 덩어리와 목이 이어져 있으면 폭이 가장 좁아지는 곳(턱 밑)을 찾는다
    widths = [(sk[r, :] & (np.abs(np.arange(sk.shape[1]) - cx) < 200)).sum() for r in range(ys.min(), min(H, ys.max() + 1))]
    if widths:
        top = ys.min() + int(len(widths) * .5)
        seg = widths[top - ys.min():]
        if seg:
            y = top + int(np.argmin(seg))
    return int(y)


def changed_region(O, C, chin):
    d = np.abs(flat_rgb(O) - flat_rgb(C)).sum(2) > 40
    d = nd.binary_opening(d, iterations=2)
    lab, n = nd.label(d)
    if n:
        sizes = nd.sum(np.ones_like(lab), lab, range(1, n + 1))
        keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 400])
        d = keep
    d = nd.binary_closing(d, iterations=6)
    d = nd.binary_fill_holes(d)
    d = nd.binary_dilation(d, iterations=3)
    if chin is not None:
        d[:chin - 1] = False
    return d


def palette(px, k=10, seed=0):
    from scipy.cluster.vq import kmeans2
    px = px.reshape(-1, 3)
    if len(px) > 20000:
        px = px[np.random.default_rng(seed).choice(len(px), 20000, replace=False)]
    if len(px) < k:
        return px.astype(np.float32)
    c, _ = kmeans2(px.astype(np.float64), k, minit='++', seed=seed)
    return c.astype(np.float32)


def nearest(rgb, pal):
    d = np.full(rgb.shape[:2], 1e9, np.float32)
    for c in pal:
        d = np.minimum(d, np.sqrt(((rgb - c) ** 2).sum(2)))
    return d


def zone_of(O, chin, zone_path=None):
    """옷 영역 Z. 첫 회차 인페인트 마스크(--zone)가 있으면 그대로, 없으면 추정(몸 가운데 띠의 피부 아닌 곳)."""
    if zone_path:
        z = np.asarray(Image.open(zone_path).convert('L')) > 127
        if z.shape != O.shape[:2]:
            sys.exit('마스크 크기가 원본과 다름 (보정하지 않음)')
        return z
    H, W = O.shape[:2]
    sk = skin_mask(O)
    ys, xs = np.where(sk[:H // 2])
    cx = int(np.median(xs)) if len(xs) else W // 2
    band = np.zeros((H, W), bool); band[(chin or 0) + 4:, max(0, cx - W // 4):cx + W // 4] = True
    z = band & ~sk & (O[..., 3] > 200)
    return nd.binary_fill_holes(nd.binary_closing(z, iterations=4))


class Classifier:
    """피부 / 머리카락 / 옷 팔레트로 가장 가까운 쪽을 고른다."""
    def __init__(self, O, Z, chin):
        H = O.shape[0]
        top = np.zeros(O.shape[:2], bool); top[:(chin or H // 3)] = True
        rgb = O[..., :3]
        hair_px = rgb[top & ~skin_mask(O) & (O[..., 3] > 200) & (rgb.mean(2) > 40)]
        outside_hair = rgb[~Z & ~skin_mask(O) & (O[..., 3] > 200) & (rgb.mean(2) > 40) & ~top]
        self.hair = palette(np.concatenate([hair_px, outside_hair]) if len(outside_hair) else hair_px, 12)
        self.cloth = palette(rgb[Z & ~skin_mask(O) & (O[..., 3] > 200)], 10, 1)
        below = np.broadcast_to(np.arange(H)[:, None] > (chin or H // 3), O.shape[:2])
        tail = rgb[~Z & below & ~skin_mask(O) & (O[..., 3] > 200) & (rgb.mean(2) > 40)]
        self.tail = palette(tail, 12, 2) if len(tail) > 50 else self.hair
        # 영역 밖에 같은 옷(예: 소매만 칠했을 때의 재킷)이 있으면 그 색은 머리카락 후보에서 뺀다
        keep = np.array([nearest(c[None, None, :], self.cloth)[0, 0] > 35 for c in self.tail])
        if keep.any():
            self.tail = self.tail[keep]

    def hair_in_zone(self, C, Z):
        """옷 영역 안의 머리카락 = 영역 밖 머리카락과 이어지고 색이 가까운 것(드레스 자리에 새로 드러난 뒷머리)."""
        rgb = C[..., :3]
        cand = (nearest(rgb, self.tail) < 30) & ~skin_mask(C) & (C[..., 3] > 128)
        lab, _ = nd.label(cand)
        keep = np.unique(lab[~Z & cand & (lab > 0)])
        return np.isin(lab, keep) & Z

    def classes(self, C, region):
        rgb = C[..., :3]
        sk = skin_mask(C)
        dh = nearest(rgb, self.hair); dc = nearest(rgb, self.cloth)
        white = rgb.min(2) > 238
        lum = rgb.mean(2)
        line = (lum < 60) & ~nd.binary_opening(lum < 60, iterations=2)
        cloth = region & ~sk & ~white & ~line & (C[..., 3] > 200) & (dc < dh) & (dc < 45)
        cloth = nd.binary_opening(cloth, iterations=1)
        hair = region & ~sk & ~cloth & (dh < 60)
        return sk & region, cloth, hair


def progress(O, C, Z, K):
    """옷 영역 Z 안을 '드러난 피부' / '남은 것'으로 나눈다.
    원본(첫 회차 원본)과 비교해 바뀌지 않은 곳은 색과 상관없이 아직 처리 안 된 옷으로 본다
    (아이보리 블라우스처럼 피부색과 비슷한 옷도 놓치지 않게)."""
    fo, fc = flat_rgb(O), flat_rgb(C)
    cd = np.abs(fo - fc).sum(2)
    def lstd(F):
        l = F.mean(2); m = nd.uniform_filter(l, 7); return np.sqrt(np.maximum(nd.uniform_filter(l * l, 7) - m * m, 0))
    # 색이 비슷해도(아이보리 옷 → 흰 피부) 무늬·주름이 사라졌으면 바뀐 것으로 본다
    d = (cd > 40) | ((cd > 12) & (np.abs(lstd(fo) - lstd(fc)) > 4))
    changed = nd.binary_closing(nd.binary_opening(d, iterations=1), iterations=2)
    sk_c = skin_mask(C)
    rgb = C[..., :3]
    revealed = Z & changed & sk_c
    # 남은 것 = 옷 영역 안에서 드러난 피부·머리카락·흰 배경·가는 선이 아닌 모든 것
    #  (안 바뀐 옷, 다시 그려진 옷, 회색 잔여물·무늬 같은 생성 결함 포함)
    hair = K.hair_in_zone(C, Z)
    white = rgb.min(2) > 238
    lum = rgb.mean(2)
    line = (lum < 60) & ~nd.binary_opening(lum < 60, iterations=2)
    unchanged = Z & ~changed & (O[..., 3] > 128)
    other = Z & changed & ~sk_c & ~hair & ~white & ~line & (C[..., 3] > 128)
    remaining = (unchanged | nd.binary_opening(other, iterations=1)) & ~revealed
    return revealed, remaining


def cmd_score(a):
    O = load(a.orig)
    chin = chin_y(O)
    Z = zone_of(O, chin, a.zone)
    K = Classifier(O, Z, chin)
    rows = []
    for p in a.cand:
        C = load(p); same(O, C, a.orig, p)
        sk, cl = progress(O, C, Z, K)
        base = max(1, (Z & (O[..., 3] > 128)).sum())
        rows.append((p, sk.sum() / base, cl.sum() / base, cl))
    rows.sort(key=lambda r: r[2] - r[1])   # 남은 것 - 피부 가 작을수록 앞
    print(f'턱 y={chin}')
    for i, (p, s, c, _) in enumerate(rows):
        print(f'{i + 1}. {os.path.basename(p)}  피부 {s * 100:5.1f}%  남은 옷 {c * 100:5.1f}%')
    if a.out:
        tiles = []
        for p, s, c, cl in rows:
            C = load(p); v = flat_rgb(C).copy(); v[cl] = v[cl] * .3 + np.array([40, 120, 255]) * .7
            im = Image.fromarray(v.astype(np.uint8)); im.thumbnail((360, 360))
            dr = ImageDraw.Draw(im); dr.rectangle((0, 0, im.width, 22), fill=(0, 0, 0))
            dr.text((4, 4), f'{os.path.basename(p)[:28]}  skin {s * 100:.0f}% cloth {c * 100:.0f}%', fill=(255, 255, 255))
            tiles.append(im)
        W = sum(t.width for t in tiles); H = max(t.height for t in tiles)
        sheet = Image.new('RGB', (W, H), (30, 30, 30)); x = 0
        for t in tiles: sheet.paste(t, (x, 0)); x += t.width
        sheet.save(a.out); print('점수표:', a.out, '(파랑 = 남은 옷)')


def cmd_nextmask(a):
    O = load(a.orig); C = load(a.cand[0]); same(O, C, a.orig, a.cand[0])
    chin = chin_y(O)
    below = np.broadcast_to(np.arange(O.shape[0])[:, None] > (chin or 0) + 4, O.shape[:2])
    Z = zone_of(O, chin, a.zone)
    sk, cl = progress(O, C, Z, Classifier(O, Z, chin))
    # 실제 인페인트 시험(소매 5회차) 결과: 마스크 경계가 옷 위에 놓이면 그 자리에 옷 색 띠가 남고,
    # 회차마다 띠가 쌓여 그물무늬가 된다 → 경계는 반드시 옷 바깥(피부·배경)에 놓이도록 넉넉히 넓힌다.
    m = nd.binary_dilation(cl, iterations=a.grow) if a.grow > 0 else cl.copy()   # iterations=0은 SciPy에서 '수렴까지'라 건너뜀
    m = nd.binary_closing(m, iterations=8) if a.grow > 0 else m
    lim = nd.binary_dilation(Z, iterations=a.grow) if a.grow > 0 else Z
    m &= lim & below               # 첫 마스크를 grow만큼 넘는 곳과 턱 위는 칠하지 않음(드러난 피부 위 경계는 허용)
    Image.fromarray((m * 255).astype(np.uint8)).save(a.out)
    print(f'남은 것 {cl.sum()}px → 마스크 {m.sum()}px 저장: {a.out}')


def cmd_finish(a):
    O = load(a.orig); C = load(a.cand[0]); same(O, C, a.orig, a.cand[0])
    os.makedirs(a.out, exist_ok=True)
    chin = a.chin if a.chin is not None else chin_y(O)
    reg = changed_region(O, C, chin)
    if a.zone:   # 인페인트 마스크 안은 언제나 후보를 쓴다(머리카락 경계 섞임 방지)
        reg = reg | nd.binary_dilation(zone_of(O, chin, a.zone), iterations=4)
        if chin is not None: reg[:chin - 1] = False
    soft = np.asarray(Image.fromarray((reg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))).astype(np.float32) / 255
    if chin is not None:
        soft[:chin - 1] = 0
    # 투명도: 바뀐 영역 안에서 바깥 투명 배경과 이어진 흰색은 지운다
    Crgb = C[..., :3]
    whiteness = smooth(Crgb.min(2), 225, 250)
    outside = O[..., 3] < 8
    near_white = (whiteness > .5)
    lab, _ = nd.label(near_white | outside)
    bg_labels = np.unique(lab[outside & (lab > 0)])
    bg = np.isin(lab, bg_labels) & reg
    alphaC = np.where(bg, (1 - whiteness) * 255, C[..., 3])
    if C[..., 3].min() < 250:            # 이미 투명 배경인 후보면 그 알파를 존중
        alphaC = np.minimum(alphaC, C[..., 3])
    R = O.copy()
    s = soft[..., None]
    R[..., :3] = O[..., :3] * (1 - s) + Crgb * s
    R[..., 3] = O[..., 3] * (1 - soft) + alphaC * soft
    name = os.path.splitext(os.path.basename(a.cand[0]))[0]
    Image.fromarray(R.astype(np.uint8)).save(os.path.join(a.out, f'{name}-base.png'))
    # 점검: 평평한 밝은 얼룩 / 남은 옷 / 원본 윤곽
    Z = zone_of(O, chin, a.zone) | reg
    sk, cl = progress(O, R, Z, Classifier(O, Z, chin))
    # 얼룩·이음매 강조 보기: 큰 흐림을 뺀 밝기 차이를 4배로 키움(사람 눈으로 찾기 쉽게)
    lum = R[..., :3].mean(2)
    hp = lum - nd.gaussian_filter(lum, 14)
    tint = R[..., :3] - R[..., :3].mean(2, keepdims=True)
    boost = np.clip(128 + hp[..., None] * 4 + tint * 3, 0, 255)
    boost[R[..., 3] < 128] = 30
    boxes = []
    view = flat_rgb(R)
    bgv = np.full(view.shape, 60.0); al = R[..., 3:4] / 255; view = R[..., :3] * al + bgv * (1 - al)
    edge = nd.binary_dilation(O[..., 3] > 128) ^ (O[..., 3] > 128)
    ov = view.copy(); ov[edge] = [255, 60, 60]
    fl = view.copy(); fl[cl] = fl[cl] * .3 + np.array([40, 120, 255]) * .7
    ims = [Image.fromarray(x.astype(np.uint8)) for x in (flat_rgb(O), view, ov, fl, boost)]
    if chin is not None:
        for im in ims: ImageDraw.Draw(im).line((0, chin, im.width, chin), fill=(0, 255, 120), width=2)
    W, H = ims[0].size
    sheet = Image.new('RGB', (W * len(ims), H), (20, 20, 20))
    for i, im in enumerate(ims): sheet.paste(im, (W * i, 0))
    sheet.thumbnail((2400, 2400)); sheet.save(os.path.join(a.out, f'{name}-check.png'))
    head_diff = (np.abs(R[:chin - 1, :, :3] - O[:chin - 1, :, :3]).sum(2) > 3).sum() if chin else -1
    print(f'턱 y={chin}  턱 위 원본과 다른 픽셀 {head_diff}  남은 것 {cl.sum()}px')
    print('점검표: 원본 | 결과 | 원본 윤곽(빨강) | 남은 옷(파랑) | 얼룩 강조(번진 면·이음매·색 얼룩이 도드라짐), 초록 선 = 턱')


def smooth(x, lo, hi):
    t = np.clip((x - lo) / (hi - lo), 0, 1)
    return t * t * (3 - 2 * t)


def cmd_headfix(a):
    """맨얼굴 마무리: 원본(얼굴 있는 착의)의 앞머리·윤곽·피부색을 살리고, 이목구비 자리만 빈 얼굴 결과로.
    턱 아래(몸)는 결과 그대로. 빈 얼굴의 잡티는 고르게, 피부색은 원본 볼 색에 맞춘다."""
    O = load(a.orig); F = load(a.cand[0]).copy(); same(O, F, a.orig, a.cand[0])
    H, W = O.shape[:2]
    chin = a.chin if a.chin is not None else chin_y(O)
    hO = mc.rgb_to_hsv(np.clip(O[..., :3], 0, 255) / 255); hF = mc.rgb_to_hsv(np.clip(F[..., :3], 0, 255) / 255)
    head = np.zeros((H, W), bool); head[:chin] = True
    pink = lambda h: (h[..., 0] > .9) | (h[..., 0] < .07)
    face = pink(hF) & (hF[..., 1] < .2) & (hF[..., 2] > .85) & (F[..., 3] > 200) & head
    face = nd.binary_opening(face, iterations=2)
    lab, n = nd.label(face)
    if not n:
        sys.exit('결과 그림에서 빈 얼굴을 찾지 못함')
    sizes = nd.sum(np.ones_like(lab), lab, range(1, n + 1))
    face = nd.binary_fill_holes(lab == int(np.argmax(sizes)) + 1)
    inner = nd.binary_erosion(face, iterations=3)
    med = np.stack([nd.median_filter(F[..., c], 7) for c in range(3)], -1)
    F[..., :3] = np.where(inner[..., None], med, F[..., :3])
    cm = nd.binary_erosion(face, iterations=8) & (hO[..., 1] < .2) & (hO[..., 2] > .9) & pink(hO)
    if cm.sum() > 50:
        shift = np.median(O[cm][:, :3], 0) - np.median(F[inner][:, :3], 0)
        F[..., :3] = np.where(inner[..., None], np.clip(F[..., :3] + shift, 0, 255), F[..., :3])
        print('피부색 보정', shift.round(1))
    # 눈·눈썹·입 상자(원본의 어두운 덩어리 주변)는 통째로 빈 얼굴 쪽
    dark = (hO[..., 2] < .5) & nd.binary_dilation(face, iterations=4)
    lab, _ = nd.label(nd.binary_dilation(dark, iterations=2))
    boxes = np.zeros((H, W), bool)
    for i, sl in enumerate(nd.find_objects(lab)):
        if sl is None or (lab[sl] == i + 1).sum() < 10: continue
        boxes[max(0, sl[0].start - 8):sl[0].stop + 8, max(0, sl[1].start - 8):sl[1].stop + 8] = True
    boxes &= nd.binary_dilation(face, iterations=14) & head
    # 원본 머리카락(얼굴 밖 머리 쪽 팔레트에 가까운 것)은 얼굴 안이라도 원본 유지
    ref = head & ~face & (O[..., 3] > 200) & (hO[..., 2] > .6) & (hO[..., 1] > .12)
    hairO = (nearest(O[..., :3], palette(O[ref][:, :3], 12, 3)) < 22) if ref.sum() > 100 else np.zeros((H, W), bool)
    useF = nd.binary_closing((face & ~hairO) | boxes, iterations=1)
    w = nd.gaussian_filter(useF.astype(np.float32), 1.0); w[~head] = 1
    for i in range(8):
        y = chin - 4 + i
        if 0 <= y < H: w[y] = np.maximum(w[y], i / 8)
    R = O * (1 - w[..., None]) + F * w[..., None]
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    Image.fromarray(np.clip(R, 0, 255).astype(np.uint8)).save(a.out)
    print(f'턱 y={chin}  얼굴 {face.sum()}px  이목구비 상자 {boxes.sum()}px  저장: {a.out}')


def cmd_merge(a):
    B = load(a.base); R = B.copy()
    for t in a.take:
        p, box = t.rsplit(':', 1)
        x0, y0, x1, y1 = map(int, box.split(','))
        C = load(p); same(B, C, a.base, p)
        m = np.zeros(B.shape[:2], np.float32); m[y0:y1, x0:x1] = 1
        m = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(a.feather))).astype(np.float32)[..., None] / 255
        R = R * (1 - m) + C * m
        print(f'{os.path.basename(p)} → ({x0},{y0})-({x1},{y1})')
    Image.fromarray(R.astype(np.uint8)).save(a.out); print('저장:', a.out)


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest='cmd', required=True)
    s = sp.add_parser('score'); s.add_argument('--orig', required=True); s.add_argument('--cand', nargs='+', required=True); s.add_argument('--out'); s.add_argument('--zone')
    s = sp.add_parser('nextmask'); s.add_argument('--orig', required=True); s.add_argument('--cand', nargs=1, required=True); s.add_argument('--out', required=True); s.add_argument('--grow', type=int, default=24); s.add_argument('--zone')
    s = sp.add_parser('finish'); s.add_argument('--orig', required=True); s.add_argument('--cand', nargs=1, required=True); s.add_argument('--out', required=True); s.add_argument('--chin', type=int); s.add_argument('--zone')
    s = sp.add_parser('headfix'); s.add_argument('--orig', required=True); s.add_argument('--cand', nargs=1, required=True); s.add_argument('--out', required=True); s.add_argument('--chin', type=int)
    s = sp.add_parser('merge'); s.add_argument('--base', required=True); s.add_argument('--take', action='append', required=True); s.add_argument('--out', required=True); s.add_argument('--feather', type=float, default=12)
    a = ap.parse_args()
    {'score': cmd_score, 'nextmask': cmd_nextmask, 'finish': cmd_finish, 'merge': cmd_merge, 'headfix': cmd_headfix}[a.cmd](a)
