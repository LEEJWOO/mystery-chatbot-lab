"""빈 얼굴(달걀귀신) 점검·마무리: 원본 자세 그림과 빈 얼굴을 비교해 ① 바뀐 범위 점검 ② 투명 바탕 ③ 자세 공통 마스크를 만든다.

  python3 -I tools/blank_kit.py <원본 폴더> <빈 얼굴 폴더> <출력 폴더> [--preview 확인.png]

- 원본 폴더: 번호-직업-자세-neutral.png (투명 배경 원본 자세 그림)
- 빈 얼굴 폴더: 번호-직업-자세-blank.png (NovelAI 인페인트 결과, 흰 배경이어도 됨)
- 출력: 번호-직업-자세-blank.png(원본 투명도를 입힌 바탕) + 번호-직업-자세-mask.png(표정 인페인트용 공통 마스크)
점검 기준
- 바뀐 픽셀(색 차이 24 넘음)이 얼굴 안쪽에만 있어야 한다. 바깥(머리 윤곽·몸)이 바뀌었으면 '바깥 변경'으로 경고.
- 얼굴 안쪽이 지저분한 건 괜찮다(표정 조각이 늘 덮는 자리).
마스크 = 바뀐 범위 + 입까지를 감싸는 볼록 다각형을 8px 넓히고, 턱 끝 14px 위에서 멈춘다(턱선은 칠하지 않음).
"""
import glob, os, re, sys
import numpy as np, cv2
from PIL import Image, ImageDraw
from scipy import ndimage as nd
import matplotlib.colors as mc

if len([a for a in sys.argv[1:] if not a.startswith('--')]) < 3: print(__doc__); sys.exit(1)
SRC, BLK, OUT = sys.argv[1:4]; os.makedirs(OUT, exist_ok=True)
PREV = sys.argv[sys.argv.index('--preview') + 1] if '--preview' in sys.argv else None

def chin_y(alpha_rgb, cx, ey, w):
    a = np.array(alpha_rgb).astype(float); h = mc.rgb_to_hsv(a[..., :3] / 255)
    skin = ((h[..., 0] < .11) | (h[..., 0] > .93)) & (h[..., 1] < .38) & (h[..., 2] > .72) & (a[..., 3] > 200)
    lab, _ = nd.label(nd.binary_opening(skin, iterations=2)); cx, cy = int(cx), int(ey + w * .4); l = lab[cy, cx]
    if not l: return None
    col = (lab == l)[:, cx - 10:cx + 10].any(1); y = cy
    while y < a.shape[0] - 1 and col[y]: y += 1
    return y

tiles = []
for bp in sorted(glob.glob(os.path.join(BLK, '*-blank.png'))):
    stem = os.path.basename(bp)[:-len('-blank.png')]; op = os.path.join(SRC, stem + '-neutral.png')
    if not os.path.exists(op): print('원본 없음:', stem); continue
    o = Image.open(op).convert('RGBA'); A = o.split()[3]
    white = Image.new('RGB', o.size, (255, 255, 255)); white.paste(o, mask=A)
    b = Image.open(bp).convert('RGB').resize(o.size)
    diff = np.abs(np.array(white).astype(int) - np.array(b).astype(int)).max(2) > 24
    diff = nd.binary_opening(diff, iterations=1)
    if diff.sum() < 500: print(stem, '바뀐 곳이 거의 없음(빈 얼굴이 아닌 듯)'); continue
    ys, xs = np.nonzero(diff); x0, x1 = np.percentile(xs, [2, 98]); ey = np.percentile(ys, 50); w = x1 - x0; cx = (x0 + x1) / 2
    c = chin_y(o, cx, ey, w) or int(ey + w * .6); bottom = c - 14
    yy, xx = np.mgrid[:diff.shape[0], :diff.shape[1]]
    outside = int((diff & ((yy > c) | (abs(xx - cx) > w * .75) | (yy < ey - w * .8))).sum())   # 턱 아래·얼굴 폭 밖·이마 위쪽 변경
    pts = np.vstack([np.argwhere(diff)[:, ::-1], [[cx - w * .22, bottom], [cx + w * .22, bottom], [cx - w * .36, (ey + bottom) / 2], [cx + w * .36, (ey + bottom) / 2]]]).astype(np.int32)
    m = np.zeros(diff.shape, np.uint8); cv2.fillPoly(m, [cv2.convexHull(pts)], 1)
    m = nd.binary_dilation(m.astype(bool), iterations=8) & (np.array(A) > 128); m[int(bottom) + 6:] = False
    t = b.copy(); t.putalpha(A); t.save(os.path.join(OUT, stem + '-blank.png'))
    Image.fromarray((m * 255).astype(np.uint8)).save(os.path.join(OUT, stem + '-mask.png'))
    print(stem, '바뀐 픽셀', int(diff.sum()), '· 바깥 변경', outside, '(경고)' if outside > 400 else '(정상)')
    if PREV:
        v = np.array(white).copy(); v[m] = (v[m] * .55 + np.array([255, 60, 60]) * .45).astype(int)
        tl = Image.fromarray(v.astype(np.uint8)).crop((int(cx - 170), int(ey - 130), int(cx + 170), int(ey + 210))).resize((170, 170))
        ImageDraw.Draw(tl).text((3, 3), stem, fill=(0, 0, 0)); tiles.append(tl)
if PREV and tiles:
    cols = 8; sh = Image.new('RGB', (170 * cols, 170 * ((len(tiles) + cols - 1) // cols)), (255, 255, 255))
    for i, t in enumerate(tiles): sh.paste(t, ((i % cols) * 170, (i // cols) * 170))
    sh.save(PREV); print('미리보기', PREV)
