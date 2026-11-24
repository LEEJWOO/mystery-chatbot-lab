"""플레이어 외형 파츠 묶음: 입식(立ち絵) 파츠로 체크인 초상, 컷인 파츠로 반론 컷인을 만든다.

  python3 -I tools/avatar_parts.py <입식 파츠 폴더> <컷인 파츠 폴더> <출력 폴더>

- 각 파츠를 보이는 부분만 잘라 한 장(webp)에 빽빽이 담고, 자리(초상·컷인 좌표)를 src/assets.web.json 'parts' 에 적는다.
- 머리·눈동자는 회색조로 담고 화면에서 SVG 필터(그라데이션 맵)로 칠한다. 피부는 원본 3톤.
- 몸 그림은 목·어깨 위쪽만 남긴다(아래는 화면이 옷을 그려 덮는다).
- 원본 파츠는 저장소에 올리지 않는다. 결과 묶음도 시험이 끝나면 R2로 옮기고 GitHub에서는 지운다.
"""
import glob, hashlib, io, json, os, sys
from PIL import Image, ImageOps

ST, CU, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
HERE = os.path.dirname(os.path.abspath(__file__))
TABLE = os.path.join(HERE, '..', 'src', 'assets.web.json')

def load(folder, name):
    for pat in (name + '.png', name + ' - 복사본.png', '*/' + name + '.png'):
        fs = glob.glob(os.path.join(folder, pat))
        if fs: return Image.open(fs[0]).convert('RGBA')
    raise SystemExit('없음: ' + name)
def grey(im):          # 밝기만 남긴다(색은 화면에서)
    g = ImageOps.grayscale(im); out = Image.merge('RGBA', (g, g, g, im.split()[3])); return out

# 고른 값 → 파츠 번호 (component.jsx 의 AV 순서와 같다)
FRONT = [1, 4, 6, 5, 2]                 # 일자 / 옆가르마 / 가운데 가르마 / 넘긴 머리 / 삐침
BACK = [None, 7, 10, 1, 3]              # 짧게 / 단발 / 긴 머리 / 포니테일 / 양갈래
EYE = [1, 4, 5, 3]                      # 둥근 / 올라간 / 처진 / 가는
SKIN = [1, 1, 2, 2, 3]                  # 5톤 → 원본 3톤(화면에서 밝기 보정)

parts = {}   # key → (image, dx, dy, tint)
# ---- 초상: 입식 캔버스(379×600)에서 x60~300, y10~290 을 쓴다
PX, PY, FACE, BH = 60, 10, (65, 8), (66, 20)
CF = (30, 36)   # 컷인: 틀 캔버스(409×238) 안 얼굴 캔버스(364×154) 자리
def add(key, im, ox, oy, tint=''):
    bb = im.getbbox()
    if not bb: return
    parts[key] = (im.crop(bb), ox + bb[0], oy + bb[1], tint)
for i in (1, 2, 3):
    body = load(ST, '立ち絵_身体_%d' % i).crop((PX, PY, PX + 240, PY + 280))
    body.paste((0, 0, 0, 0), (0, 262 - PY, 240, 280))          # 어깨 아래는 버린다
    add('p.skin%d' % i, body, 0, 0)
for k, n in enumerate(FRONT):
    add('p.f%d' % k, grey(load(ST, '立ち絵_前髪_%d' % n)), FACE[0] - PX, FACE[1] - PY, 'h')
    add('p.fs%d' % k, load(ST, '立ち絵_前髪影_%d' % n), FACE[0] - PX, FACE[1] - PY)
for k, n in enumerate(BACK):
    if n: add('p.b%d' % k, grey(load(ST, '立ち絵_後髪_%d' % n)), BH[0] - PX, BH[1] - PY, 'h')
import numpy as np
def centers(im, ox, oy):  # 흰자 두 덩어리의 가운데(눈동자 자리)
    a = np.array(im)[:, :, 3] > 0; cols = np.nonzero(a.any(0))[0]; gap = max(range(len(cols) - 1), key=lambda i: cols[i + 1] - cols[i])
    out = []
    for lo, hi in ((cols[0], cols[gap]), (cols[gap + 1], cols[-1])):
        ys = np.nonzero(a[:, lo:hi + 1].any(1))[0]; out.append([round((lo + hi) / 2 + ox, 1), round((ys[0] + ys[-1]) / 2 + oy, 1)])
    return out
EYEC = {'p': [], 'c': []}
for k, n in enumerate(EYE):
    EYEC['p'].append(centers(load(ST, '立ち絵_眼w_1_%d' % n), FACE[0] - PX, FACE[1] - PY))
    EYEC['c'].append(centers(load(CU, 'カットイン_眼w_1_%d' % min(n, 6)), *CF))
    add('p.ew%d' % k, load(ST, '立ち絵_眼w_1_%d' % n), FACE[0] - PX, FACE[1] - PY)
    add('p.el%d' % k, load(ST, '立ち絵_眼e_1_%d' % n), FACE[0] - PX, FACE[1] - PY)
add('p.iris', grey(load(ST, '瞳_1')), 0, 0, 'e'); add('p.hl', load(ST, 'ハイライト_0'), 0, 0)
add('p.brow0', grey(load(ST, '立ち絵_眉毛_1_1')), FACE[0] - PX, FACE[1] - PY, 'b')
add('p.brow1', grey(load(ST, '立ち絵_眉毛_2_4')), FACE[0] - PX, FACE[1] - PY, 'b')
add('p.mouth', load(ST, '立ち絵_口_1'), FACE[0] - PX, FACE[1] - PY)
# ---- 컷인
add('c.bg', load(CU, 'カットイン_枠3'), 0, 0); add('c.line', load(CU, 'カットイン_枠1'), 0, 0)
for i in (1, 2, 3):
    add('c.skin%d' % i, load(CU, 'カットイン_顔_%d' % i), *CF); add('c.ear%d' % i, load(CU, 'カットイン_耳_1_%d' % i), *CF)
for k, n in enumerate(FRONT):
    add('c.f%d' % k, grey(load(CU, 'カットイン_前髪_%d' % n)), *CF, 'h'); add('c.fs%d' % k, load(CU, 'カットイン_前髪影_%d' % n), *CF)
for k, n in enumerate(BACK):
    if n: add('c.b%d' % k, grey(load(CU, 'カットイン_後髪_%d' % n)), *CF, 'h')
for k, n in enumerate(EYE):
    n = min(n, 6); add('c.ew%d' % k, load(CU, 'カットイン_眼w_1_%d' % n), *CF); add('c.el%d' % k, load(CU, 'カットイン_眼e_1_%d' % n), *CF)
add('c.brow0', grey(load(CU, 'カットイン_眉_1_1')), *CF, 'b'); add('c.brow1', grey(load(CU, 'カットイン_眉_2_1')), *CF, 'b')
add('c.mouth', load(CU, 'カットイン_口_2_1'), *CF)

# ---- 한 장에 담기(높이순 선반 채우기)
W = 1024; x = y = row = 0; place = {}
for key in sorted(parts, key=lambda k: -parts[k][0].height):
    im = parts[key][0]
    if x + im.width > W: x, y, row = 0, y + row + 1, 0
    place[key] = (x, y); x += im.width + 1; row = max(row, im.height)
sheet = Image.new('RGBA', (W, y + row + 1))
for key, (sx, sy) in place.items(): sheet.alpha_composite(parts[key][0], (sx, sy))
buf = io.BytesIO(); sheet.save(buf, 'WEBP', quality=92, method=6); data = buf.getvalue()
name = hashlib.sha1(data).hexdigest()[:12] + '.webp'
open(os.path.join(OUT, name), 'wb').write(data)
t = json.load(open(TABLE, encoding='utf-8'))
t['parts'] = {'src': name, 'w': W, 'h': sheet.height, 'eyes': EYEC,
              'map': {k: [place[k][0], place[k][1], parts[k][0].width, parts[k][0].height, parts[k][1], parts[k][2], parts[k][3]] for k in sorted(parts)}}
json.dump(t, open(TABLE, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('파츠', len(parts), '개', W, 'x', sheet.height, len(data) // 1024, 'KB →', name)
