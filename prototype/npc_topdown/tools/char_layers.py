"""인물 레이어 묶기: 자세 그림 + 표정 인페인트(+마스크) → 화면용 그림(webp)과 assets.web.json 'chars' 항목.

  python3 -I tools/char_layers.py <인물id> <원본 폴더> <출력 폴더> [--fresh] [--preview 미리보기.png] [--table 표.json] [--align-only]

두 방식을 모두 받는다.
  · 옛 방식: 자세마다 번호-직업-자세-neutral.png(바탕) + 표정.png + 표정-mask.png
  · 빈 얼굴(달걀귀신) 방식: 번호-직업-자세-blank.png(이목구비 없는 바탕) + 번호-직업-자세-mask.png(자세 공통 마스크)
    + neutral 포함 모든 표정.png. 표정별 마스크가 있으면 그것을 먼저 쓴다.
--preview: 자세·표정마다 얼굴을 잘라 한 장으로 늘어놓은 확인용 그림. --table: 결과를 다른 표에 적기(시험용).

원본 폴더의 파일 이름 규칙: 번호-직업-자세-표정.png (+ 표정본은 -mask.png 짝)
  자세: default / think / point / crossed, 평상시 = neutral (자세마다 1장, 투명 PNG)
- 표정 조각은 tools/expr_extract.py 로 뽑는다(경계 처리 + 눈 색 맞춤).
- 자세마다 두 눈 위치(eye, ed)를 적는다 — 작은 얼굴 썸네일 자르기·하라구로 그늘 위치용. 스탠딩 표시는 인물별 disp{s,y}만 쓴다(자동 맞춤 없음).
- 이미 있는 항목의 다른 자세·표정은 그대로 두고, 이번에 찾은 파일만 덮어쓴다.
"""
import glob, hashlib, io, json, os, re, sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd
import matplotlib.colors as mc
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from expr_extract import extract

if len([a for a in sys.argv[1:] if not a.startswith('--')]) < 3: print(__doc__); sys.exit(1)
CID, SRC, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(OUT, exist_ok=True)
FIT = float(sys.argv[sys.argv.index('--fit') + 1]) if '--fit' in sys.argv else 1.0
TABLE = sys.argv[sys.argv.index('--table') + 1] if '--table' in sys.argv else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'assets.web.json')
if not os.path.exists(TABLE): json.dump({'chars': {}}, open(TABLE, 'w'))   # 확인용 빈 표
KO = {'neutral': '기본', 'smile': '미소', 'laugh': '웃음', 'suspicious': '의심', 'surprised': '놀람', 'troubled': '곤란', 'embarrassed': '부끄러움',
      'annoyed': '불만', 'sad': '슬픔', 'furious': '격노', 'panic': '패닉', 'darksmile': '하라구로'}

def save(im, q=90):
    buf = io.BytesIO(); im.save(buf, 'WEBP', quality=q, method=6); data = buf.getvalue()
    name = hashlib.sha1(data).hexdigest()[:12] + '.webp'; open(os.path.join(OUT, name), 'wb').write(data); return name, len(data)

def eyes(im):
    """두 홍채(채도 있는 청·보라·청록 덩어리) 중 높이가 비슷하고 70~230px 떨어진 한 쌍을 고른다."""
    a = np.array(im.convert('RGBA')).astype(float); h = mc.rgb_to_hsv(a[..., :3] / 255)
    sel = (h[..., 0] > 0.42) & (h[..., 0] < 0.85) & (h[..., 1] > 0.12) & (h[..., 2] > 0.3) & (a[..., 3] > 200)
    sel[int(a.shape[0] * 0.42):] = False
    lab, n = nd.label(nd.binary_opening(sel, iterations=1))
    if n < 2: return None
    sizes = nd.sum(sel, lab, range(1, n + 1)); top = [i + 1 for i in np.argsort(sizes)[::-1][:10] if sizes[i] > 120]
    cs = {i: nd.center_of_mass(lab == i) for i in top}; best = None
    for x in top:
        for y in top:
            if x >= y: continue
            (ya, xa), (yb, xb) = cs[x], cs[y]; sa, sb = sizes[x - 1], sizes[y - 1]
            if abs(ya - yb) < 35 and 70 < abs(xa - xb) < 230 and min(sa, sb) / max(sa, sb) > 0.45:
                sc = sa + sb
                if not best or sc > best[0]: best = (sc, (xa + xb) / 2, (ya + yb) / 2, float(np.hypot(xa - xb, ya - yb)))
    return ([round(best[1]), round(best[2])], round(best[3], 1)) if best else None

import cv2
def face_box(pose):
    bs = []
    for g in glob.glob(os.path.join(SRC, '*-%s-*-mask.png' % pose)) + glob.glob(os.path.join(SRC, '*-%s-mask.png' % pose)):
        a = np.array(Image.open(g).convert('L')) > 127; ys, xs = np.nonzero(a); bs.append((xs.min(), ys.min(), xs.max(), ys.max()))
    return np.median(np.array(bs), 0) if bs else None
def gray(im):
    bg = Image.new('RGBA', im.size, (128, 128, 128, 255)); bg.alpha_composite(im); return np.array(bg.convert('L')).astype(np.float32)
def match(ref_im, box, pose_im):
    """기본 자세 얼굴 안쪽(마스크 상자 가로 12~88%, 세로 15~70%)을 다른 자세 그림에서 크기를 바꿔 가며 찾는다 → (점수, x, y, 배율, 기준 왼쪽 위)"""
    bw, bh = box[2] - box[0], box[3] - box[1]; x0, x1, y0, y1 = int(box[0] + bw * .12), int(box[0] + bw * .88), int(box[1] + bh * .15), int(box[1] + bh * .7)
    D = 2; T0 = gray(ref_im)[y0:y1, x0:x1]; P = gray(pose_im); P = cv2.resize(P, (P.shape[1] // D, P.shape[0] // D), interpolation=cv2.INTER_AREA)
    best = None
    for t in np.arange(0.8, 1.25, 0.01):
        T = cv2.resize(T0, (max(8, int(T0.shape[1] * t / D)), max(8, int(T0.shape[0] * t / D))), interpolation=cv2.INTER_AREA)
        if T.std() < 1e-3: continue
        r = np.nan_to_num(cv2.matchTemplate(P[: P.shape[0] * 3 // 4], T, cv2.TM_CCOEFF_NORMED), nan=-1, posinf=-1); _, v, _, loc = cv2.minMaxLoc(r)
        if not best or v > best[0]: best = (v, loc[0] * D, loc[1] * D, t)
    return best + ((x0, y0),)

def chin_y(im, ex, ey, ed):
    """얼굴 피부 덩어리의 턱 끝(눈 아래로 피부가 끊기는 곳) y"""
    a = np.array(im.convert('RGBA')).astype(float); h = mc.rgb_to_hsv(a[..., :3] / 255)
    skin = ((h[..., 0] < .11) | (h[..., 0] > .93)) & (h[..., 1] < .38) & (h[..., 2] > .72) & (a[..., 3] > 200)
    lab, _ = nd.label(nd.binary_opening(skin, iterations=2)); ex, cy = int(ex), int(ey + ed * .8); l = lab[cy, ex]
    if not l: return None
    col = (lab == l)[:, ex - 10:ex + 10].any(1); y = cy
    while y < a.shape[0] - 1 and col[y]: y += 1
    return y

files = sorted(glob.glob(os.path.join(SRC, '*.png')))
pat = re.compile(r'^\d+-[a-z]+-(default|think|point|crossed)-([a-z]+)\.png$')
table = json.load(open(TABLE, encoding='utf-8'))
ALIGN_ONLY = '--align-only' in sys.argv
ch = {} if '--fresh' in sys.argv and not ALIGN_ONLY else (table.setdefault('chars', {}).get(CID) or {})
table.setdefault('chars', {})
ch.setdefault('poses', {}); ch.setdefault('disp', {'s': 1.0, 'y': 0})   # 표시 배율·y는 줄 세우기로 정해 손으로 적는다(자동 맞춤 없음)
total = 0
def find(pose, expr):
    for f in files:
        m = pat.match(os.path.basename(f))
        if m and m.group(1) == pose and m.group(2) == expr: return f
    return None
def look_img(pose):
    """정렬용 그림: 빈 얼굴 방식이면 빈 얼굴의 윤곽(투명도) + 기본 표정 그림의 색, 아니면 기본 그림"""
    bl, ne = find(pose, 'blank'), find(pose, 'neutral')
    if bl and ne:
        a = Image.open(bl).convert('RGBA'); n = Image.open(ne).convert('RGB').resize(a.size); n.putalpha(a.split()[3]); return n
    return Image.open(ne or bl).convert('RGBA')
REF_BOX = face_box('default'); REF_IM = look_img('default')
REF_H = eyes(REF_IM)
if REF_H and not (REF_BOX[0] < REF_H[0][0] < REF_BOX[2] and REF_BOX[1] < REF_H[0][1] < REF_BOX[3]): REF_H = None
REF_E = ((REF_BOX[0] + REF_BOX[2]) / 2, REF_BOX[1] + (REF_BOX[3] - REF_BOX[1]) * .40); REF_D = (REF_BOX[2] - REF_BOX[0]) * .42
REF_C = chin_y(REF_IM, REF_E[0], REF_E[1], REF_D)
PV = []   # --preview 용 합성 그림
for pose in ['default', 'think', 'point', 'crossed']:
    blank = find(pose, 'blank'); neutral = find(pose, 'neutral'); f = blank or neutral
    if not f: continue
    egg = bool(blank)   # 빈 얼굴(달걀귀신) 방식: 바탕은 이목구비 없는 얼굴, 기본 표정까지 모두 조각
    im = Image.open(f).convert('RGBA'); lim = look_img(pose)
    if ALIGN_ONLY: name = ch['poses'][pose]['src']
    else: name, n = save(im); total += n
    P = ch['poses'].get(pose, {}); P.update({'src': name, 'w': im.width, 'h': im.height, 'def': '' if egg else '기본'})
    if pose == 'default': P['eye'], P['ed'] = [round(REF_E[0]), round(REF_E[1])], round(REF_D, 1)
    else:
        he = eyes(lim); E_ = match(REF_IM, REF_BOX, lim)
        if E_[0] < 0.6 and REF_H and he and 0.8 < he[1] / REF_H[1] < 1.25:   # 얼굴 맞추기 점수가 낮을 때(머리 모양이 자세마다 크게 다름)만 홍채 한 쌍으로
            t = he[1] / REF_H[1]; P['eye'] = [round(he[0][0] + (REF_E[0] - REF_H[0][0]) * t), round(he[0][1] + (REF_E[1] - REF_H[0][1]) * t)]; P['ed'] = round(REF_D * t, 1); P['fit'] = 'iris'
        else:
            v, mx, my, t, o = E_
            P['eye'] = [round(mx + (REF_E[0] - o[0]) * t), round(my + (REF_E[1] - o[1]) * t)]; P['ed'] = round(REF_D * t, 1); P['fit'] = 'face %.2f' % v
        # 눈과 턱의 절충: 자세 그림마다 얼굴 길이가 조금씩 달라(따로 생성) 눈만 맞추면 턱이, 턱만 맞추면 눈이 어긋난다.
        # → 배율은 '눈 사이'와 '눈~턱' 비율의 기하평균, 기준점은 눈과 턱의 가운데로 잡아 어긋남을 반씩 나눈다.
        cp = chin_y(lim, P['eye'][0], P['eye'][1], P['ed'])
        if REF_C and cp and cp > P['eye'][1]:
            r_ed = REF_D / P['ed']; r_h = (REF_C - REF_E[1]) / (cp - P['eye'][1])
            if 0.7 < r_h < 1.4:
                sm = (r_ed * r_h) ** .5; Mp = (P['eye'][1] + cp) / 2; Md = (REF_E[1] + REF_C) / 2
                P['eye'] = [P['eye'][0], round(Mp - (Md - REF_E[1]) / sm)]; P['ed'] = round(REF_D / sm, 1); P['fit'] += ' chin %.2f' % r_h
    if not ALIGN_ONLY: P['faces'] = {}
    P.setdefault('faces', {}); ch['poses'][pose] = P
    shared = [g for g in files if re.match(r'^\d+-[a-z]+-%s-mask\.png$' % pose, os.path.basename(g))]
    for g in ([] if ALIGN_ONLY else files):
        mm = pat.match(os.path.basename(g))
        if not mm or mm.group(1) != pose or mm.group(2) not in KO: continue
        if mm.group(2) == 'neutral' and not egg: continue      # 옛 방식: 기본 표정은 바탕 그림 자체
        mask = g[:-4] + '-mask.png'
        if not os.path.exists(mask): mask = shared[0] if shared else None   # 자세 공통 마스크(빈 얼굴 방식)
        if not mask: print('마스크 없음:', os.path.basename(g)); continue
        ref = neutral if egg and mm.group(2) != 'neutral' else None    # 눈 색 기준: 빈 얼굴 방식은 기본 표정 그림
        patch, box = extract(f, g, mask, eye=not (egg and mm.group(2) == 'neutral'), ref_p=ref)
        pn, n = save(patch); total += n
        P['faces'][KO[mm.group(2)]] = {'src': pn, 'x': box[0], 'y': box[1], 'w': box[2] - box[0], 'h': box[3] - box[1]}
        PV.append((pose, mm.group(2), im, patch, box, P))
    print(pose, '빈 얼굴' if egg else '', '표정', len(P['faces']), '눈', P.get('eye'), P.get('ed'), P.get('fit', ''))
table['chars'][CID] = ch
json.dump(table, open(TABLE, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(CID, '합계', total // 1024, 'KB')
if '--preview' in sys.argv:
    # 확인용 한 장: 자세·표정마다 얼굴 부분을 잘라 늘어놓는다(눈 위치 기준으로 같은 크기)
    from PIL import ImageDraw
    out = sys.argv[sys.argv.index('--preview') + 1]; T = 200; tiles = []
    for pose, ex_, im, patch, box, P in PV:
        c = im.copy(); c.alpha_composite(patch, (box[0], box[1])); k = 127.0 / P['ed']; x, y = P['eye']
        r = c.crop((int(x - 150 / k), int(y - 120 / k), int(x + 150 / k), int(y + 180 / k))).resize((T, T))
        bg = Image.new('RGB', (T, T + 16), (40, 36, 52)); bg.paste(r, (0, 16), r.split()[3]); ImageDraw.Draw(bg).text((4, 2), pose + ' / ' + ex_, fill=(255, 230, 120)); tiles.append(bg)
    cols = 6; sheet = Image.new('RGB', (cols * T, ((len(tiles) + cols - 1) // cols) * (T + 16)), (20, 18, 26))
    for i, t in enumerate(tiles): sheet.paste(t, ((i % cols) * T, (i // cols) * (T + 16)))
    sheet.save(out); print('미리보기', out)
