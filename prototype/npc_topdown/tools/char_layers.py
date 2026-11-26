"""인물 레이어 묶기: 자세 그림 + 표정 인페인트(+마스크) → 화면용 그림(webp)과 assets.web.json 'chars' 항목.

  python3 -I tools/char_layers.py <인물id> <원본 폴더> <출력 폴더> [--fit 1.0]

원본 폴더의 파일 이름 규칙: 번호-직업-자세-표정.png (+ 표정본은 -mask.png 짝)
  자세: default / think / point / crossed, 평상시 = neutral (자세마다 1장, 투명 PNG)
- 표정 조각은 tools/expr_extract.py 로 뽑는다(경계 처리 + 눈 색 맞춤).
- 자세마다 두 눈 위치를 찾아 eye=[x,y], ed=눈 사이 거리 로 적는다 → 화면이 자세를 바꿔도 머리 크기·위치를 맞춘다.
- 이미 있는 항목의 다른 자세·표정은 그대로 두고, 이번에 찾은 파일만 덮어쓴다.
"""
import glob, hashlib, io, json, os, re, sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd
import matplotlib.colors as mc
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from expr_extract import extract

CID, SRC, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
FIT = float(sys.argv[sys.argv.index('--fit') + 1]) if '--fit' in sys.argv else 1.0
TABLE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'assets.web.json')
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
    for g in glob.glob(os.path.join(SRC, '*-%s-*-mask.png' % pose)):
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

files = sorted(glob.glob(os.path.join(SRC, '*.png')))
pat = re.compile(r'^\d+-[a-z]+-(default|think|point|crossed)-([a-z]+)\.png$')
table = json.load(open(TABLE, encoding='utf-8'))
ALIGN_ONLY = '--align-only' in sys.argv
ch = {} if '--fresh' in sys.argv and not ALIGN_ONLY else (table.setdefault('chars', {}).get(CID) or {})
table.setdefault('chars', {})
ch.setdefault('poses', {}); ch['fit'] = {'s': FIT}
total = 0
REF_BOX = face_box('default'); REF_F = [f for f in files if re.search(r'-default-neutral\.png$', f)][0]; REF_IM = Image.open(REF_F).convert('RGBA')
REF_H = eyes(REF_IM)
if REF_H and not (REF_BOX[0] < REF_H[0][0] < REF_BOX[2] and REF_BOX[1] < REF_H[0][1] < REF_BOX[3]): REF_H = None
REF_E = ((REF_BOX[0] + REF_BOX[2]) / 2, REF_BOX[1] + (REF_BOX[3] - REF_BOX[1]) * .40); REF_D = (REF_BOX[2] - REF_BOX[0]) * .42
files.sort(key=lambda f: '-default-' not in f)
for f in files:
    m = pat.match(os.path.basename(f))
    if not m or m.group(2) != 'neutral': continue
    pose = m.group(1); im = Image.open(f).convert('RGBA')
    if ALIGN_ONLY: name = ch['poses'][pose]['src']
    else: name, n = save(im); total += n
    P = ch['poses'].get(pose, {}); P.update({'src': name, 'w': im.width, 'h': im.height, 'def': '기본'})
    # 눈 기준점: 기본 자세는 표정 마스크 상자에서(가로 가운데·위에서 40%, 눈 사이 = 상자 너비 × 0.42),
    # 다른 자세는 기본 자세 얼굴을 찾아 같은 점으로 옮긴다(눈 색과 무관).
    if pose == 'default': P['eye'], P['ed'] = [round(REF_E[0]), round(REF_E[1])], round(REF_D, 1)
    else:
        he = eyes(im); E_ = match(REF_IM, REF_BOX, im)
        if E_[0] < 0.6 and REF_H and he and 0.8 < he[1] / REF_H[1] < 1.25:   # 얼굴 맞추기 점수가 낮을 때(머리 모양이 자세마다 크게 다름)만 홍채 한 쌍으로
            t = he[1] / REF_H[1]; P['eye'] = [round(he[0][0] + (REF_E[0] - REF_H[0][0]) * t), round(he[0][1] + (REF_E[1] - REF_H[0][1]) * t)]; P['ed'] = round(REF_D * t, 1); P['fit'] = 'iris'
        else:
            v, mx, my, t, o = E_
            P['eye'] = [round(mx + (REF_E[0] - o[0]) * t), round(my + (REF_E[1] - o[1]) * t)]; P['ed'] = round(REF_D * t, 1); P['fit'] = 'face %.2f' % v
    P.setdefault('faces', {}); ch['poses'][pose] = P
    for g in ([] if ALIGN_ONLY else files):
        mm = pat.match(os.path.basename(g))
        if not mm or mm.group(1) != pose or mm.group(2) == 'neutral' or mm.group(2) not in KO: continue
        mask = g[:-4] + '-mask.png'
        if not os.path.exists(mask): print('마스크 없음:', os.path.basename(g)); continue
        patch, box = extract(f, g, mask, eye=True)
        pn, n = save(patch); total += n
        P['faces'][KO[mm.group(2)]] = {'src': pn, 'x': box[0], 'y': box[1], 'w': box[2] - box[0], 'h': box[3] - box[1]}
    print(pose, '표정', len(P['faces']), '눈', P.get('eye'), P.get('ed'), P.pop('fitScore', None) or P.get('fit', ''))
table['chars'][CID] = ch
json.dump(table, open(TABLE, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(CID, '합계', total // 1024, 'KB')
