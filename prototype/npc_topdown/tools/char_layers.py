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

files = sorted(glob.glob(os.path.join(SRC, '*.png')))
pat = re.compile(r'^\d+-[a-z]+-(default|think|point|crossed)-([a-z]+)\.png$')
table = json.load(open(TABLE, encoding='utf-8'))
ch = table.setdefault('chars', {}).get(CID) or {}
ch.setdefault('poses', {}); ch['fit'] = {'s': FIT}
total = 0
for f in files:
    m = pat.match(os.path.basename(f))
    if not m or m.group(2) != 'neutral': continue
    pose = m.group(1); im = Image.open(f).convert('RGBA'); name, n = save(im); total += n
    e = eyes(im); P = ch['poses'].get(pose, {}); P.update({'src': name, 'w': im.width, 'h': im.height, 'def': '기본'})
    if e: P['eye'], P['ed'] = e
    P.setdefault('faces', {}); ch['poses'][pose] = P
    for g in files:
        mm = pat.match(os.path.basename(g))
        if not mm or mm.group(1) != pose or mm.group(2) == 'neutral' or mm.group(2) not in KO: continue
        mask = g[:-4] + '-mask.png'
        if not os.path.exists(mask): print('마스크 없음:', os.path.basename(g)); continue
        patch, box = extract(f, g, mask, eye=True)
        pn, n = save(patch); total += n
        P['faces'][KO[mm.group(2)]] = {'src': pn, 'x': box[0], 'y': box[1], 'w': box[2] - box[0], 'h': box[3] - box[1]}
    print(pose, '표정', len(P['faces']), '눈', P.get('eye'), P.get('ed'))
table['chars'][CID] = ch
json.dump(table, open(TABLE, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(CID, '합계', total // 1024, 'KB')
