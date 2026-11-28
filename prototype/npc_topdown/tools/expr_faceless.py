"""빈 얼굴(faceless) 방식 표정 세트 → 게임 레이어. 몸 = faceless 그림, 표정 = 표정 그림에서 faceless와 달라진 부분.

사용: python3 -I tools/expr_faceless.py <원본 폴더(인물별 하위 폴더)> <공개 출력 폴더> <표정 조각 PNG 출력 폴더>
- 인물 폴더: '<이름>/' 안에 faceless 그림(이름에 faceless) + '<이름> 감정 바리에이션/NN-표정.png'.
- 한 인물의 표정 조각은 모두 같은 사각형(모든 표정 차이의 합집합 + 여백)이라 위치가 흔들리지 않는다.
- 같은 인물의 그림은 배율·위치를 바꾸지 않는다(캔버스 그대로). 표시 배율·y는 assets.web.json의 disp 그대로 둔다.
"""
import glob, io, hashlib, json, os, sys, re
import numpy as np
from PIL import Image

SRC, PUB, PNG = sys.argv[1:4]
TABLE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'assets.web.json')
IDS = {'스즈네': 'suzune', '메이벨': 'mei', '루오시': 'ruoxi', '윤서하': 'seoha', '클라라': 'clara', '오딜': 'odile',
       '바룬': 'varun', '저스틴': 'justin', '프레디': 'freddie', '킬리언': 'killian', '카림': 'karim'}
NAME = {'눈감음': '눈 감음', '수줍은미소': '수줍은 미소', '눈물참기': '눈물 참기'}   # 화면 표정 이름(36종)과 맞춤
DIFF, PAD = 24, 8

def save(im, q=90, lossless=False):
    b = io.BytesIO(); im.save(b, 'WEBP', quality=q, method=6, lossless=lossless); d = b.getvalue()
    n = hashlib.sha1(d).hexdigest()[:12] + '.webp'; open(os.path.join(PUB, n), 'wb').write(d); return n, len(d)
def changed(A, B):
    pa = A[..., :3] * A[..., 3:4] // 255; pb = B[..., :3] * B[..., 3:4] // 255
    d = np.maximum(np.abs(pa - pb).max(2), np.abs(A[..., 3] - B[..., 3])); ys, xs = np.where(d > DIFF)
    return None if not len(ys) else (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)

table = json.load(open(TABLE, encoding='utf-8')); report = []
for folder in sorted(glob.glob(os.path.join(SRC, '*/'))):
    nm = os.path.basename(folder.rstrip('/')); cid = IDS.get(nm)
    if not cid: continue
    fl = sorted(f for f in glob.glob(folder + '*.png') if 'faceless' in os.path.basename(f).lower())
    ex = sorted(glob.glob(folder + '*감정*/*.png'))
    if not fl or not ex: report.append('%s: faceless 또는 표정 없음' % nm); continue
    faces = {}
    for f in ex:
        m = re.match(r'(\d+)-(.+)\.png$', os.path.basename(f)); k = NAME.get(m.group(2), m.group(2)) if m else os.path.basename(f)[:-4]
        faces[k] = np.asarray(Image.open(f).convert('RGBA')).astype(np.int32)
    # faceless가 둘 이상이면 표정과 가장 덜 다른 것(같은 몸)
    body_p = min(fl, key=lambda p: sum((lambda b: 0 if not b else (b[2] - b[0]) * (b[3] - b[1]))(changed(np.asarray(Image.open(p).convert('RGBA')).astype(np.int32), v)) for v in list(faces.values())[:3]))
    body = np.asarray(Image.open(body_p).convert('RGBA')).astype(np.int32); H, W = body.shape[:2]
    box = None
    for k, v in faces.items():
        assert v.shape == body.shape, (nm, k, v.shape)
        b = changed(body, v)
        if b: box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
    box = (max(0, box[0] - PAD), max(0, box[1] - PAD), min(W, box[2] + PAD), min(H, box[3] + PAD))
    area = (box[2] - box[0]) * (box[3] - box[1]) / (W * H)
    bsrc, bn = save(Image.fromarray(body.astype(np.uint8)), 88)
    os.makedirs(os.path.join(PNG, nm), exist_ok=True)
    P = {'src': bsrc, 'w': W, 'h': H, 'def': '기본', 'eye': [(box[0] + box[2]) // 2, int(box[1] + (box[3] - box[1]) * .42)], 'ed': round((box[2] - box[0]) * .5, 1), 'faces': {}}
    tot = 0
    for k, v in faces.items():
        crop = Image.fromarray(v.astype(np.uint8)).crop(box)
        s, n = save(crop, 92); tot += n
        P['faces'][k] = {'src': s, 'x': box[0], 'y': box[1], 'w': box[2] - box[0], 'h': box[3] - box[1]}
        crop.save(os.path.join(PNG, nm, os.path.basename([f for f in ex if NAME.get(re.match(r'\d+-(.+)\.png$', os.path.basename(f)).group(1), re.match(r'\d+-(.+)\.png$', os.path.basename(f)).group(1)) == k][0])), optimize=True)
    Image.fromarray(body.astype(np.uint8)).save(os.path.join(PNG, nm, '00-faceless(몸).png'), optimize=True)
    json.dump({'canvas': [W, H], 'box': list(box), 'faces': list(P['faces'])}, open(os.path.join(PNG, nm, '좌표.json'), 'w'), ensure_ascii=False, indent=1)
    c = table['chars'].setdefault(cid, {})
    c['poses'] = {'default': P}          # 시험판 시절 자세(팔짱·지목·생각)는 옛 그림이라 뺀다
    report.append('%s(%s): 몸 %s %dKB · 표정 %d개 %dKB · 조각 %dx%d (화면의 %.1f%%)%s' % (nm, os.path.basename(body_p), bsrc, bn // 1024, len(faces), tot // 1024,
                  box[2] - box[0], box[3] - box[1], area * 100, '  ⚠ 넓음' if area > .12 else ''))
json.dump(table, open(TABLE, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('\n'.join(report))
