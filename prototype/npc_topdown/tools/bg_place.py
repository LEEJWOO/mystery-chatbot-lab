"""대화 배경 배치 도구 — 후보 그림 비교(밀착 시트)와 세로 2:3 자르기·등록.

1) 비교:  python3 tools/bg_place.py sheet 로비 후보1.png 후보2.png ... --out /tmp/lobby_sheet.png
   각 후보에 화면에 보일 2:3 범위(가운데 기준)와 대사창이 덮는 아래 1/3을 표시해 한 장으로 붙인다.
2) 배치:  python3 tools/bg_place.py place 로비 후보.png [--focus 0.5,0.45] [--zoom 1.0] --pub ../../assets/pub
   - focus: 잘라 낼 중심(가로·세로 0~1). 기본 가운데. zoom: 1보다 크면 더 확대해서 자른다.
   - 720×1080 webp(q88)로 저장(화면 360×540의 2배, 고해상도 화면용), 이름은 내용 해시.
   - src/assets.web.json 의 bgCh1[방 이름]에 등록(1장 빌드가 bg로 쓴다). 객실은 '객실' 하나로 201~212 공용.
"""
import sys, os, io, json, hashlib, argparse
from PIL import Image, ImageDraw

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
W, H = 720, 1080

def crop_box(im, focus=(.5, .5), zoom=1.0):
    iw, ih = im.size; r = W / H
    cw, ch = (ih * r, ih) if iw / ih > r else (iw, iw / r)
    cw, ch = cw / zoom, ch / zoom
    x0 = min(max(focus[0] * iw - cw / 2, 0), iw - cw); y0 = min(max(focus[1] * ih - ch / 2, 0), ih - ch)
    return (round(x0), round(y0), round(x0 + cw), round(y0 + ch))

def sheet(room, files, out):
    tiles = []
    for f in files:
        im = Image.open(f).convert('RGB'); t = im.copy(); t.thumbnail((360, 360)); k = t.width / im.width
        d = ImageDraw.Draw(t, 'RGBA'); x0, y0, x1, y1 = [v * k for v in crop_box(im)]
        x1, y1 = min(x1, t.width), min(y1, t.height)
        for r in ([0, 0, t.width, y0], [0, y1, t.width, t.height], [0, y0, x0, y1], [x1, y0, t.width, y1]):
            if r[2] > r[0] and r[3] > r[1]: d.rectangle(r, fill=(0, 0, 0, 110))
        d.rectangle([x0, y0 + (y1 - y0) * 2 / 3, x1, y1], fill=(40, 60, 120, 70))   # 대사창 영역
        d.rectangle([x0, y0, x1, y1], outline=(255, 210, 120, 255), width=2)
        d.text((4, 4), '%s  %dx%d' % (os.path.basename(f)[:28], im.width, im.height), fill=(255, 255, 255, 255))
        tiles.append(t)
    cols = 3; tw = max(t.width for t in tiles); th = max(t.height for t in tiles); rows = (len(tiles) + cols - 1) // cols
    S = Image.new('RGB', (cols * (tw + 6), rows * (th + 6) + 20), (24, 22, 30)); ImageDraw.Draw(S).text((4, 4), room, fill=(255, 220, 160))
    for i, t in enumerate(tiles): S.paste(t, ((i % cols) * (tw + 6), 20 + (i // cols) * (th + 6)))
    S.save(out); print('sheet', out)

def place(room, f, focus, zoom, pub):
    im = Image.open(f).convert('RGB'); b = crop_box(im, focus, zoom)
    out = im.crop(b).resize((W, H), Image.LANCZOS)
    buf = io.BytesIO(); out.save(buf, 'WEBP', quality=88, method=6); data = buf.getvalue()
    name = hashlib.sha1(data).hexdigest()[:12] + '.webp'
    os.makedirs(pub, exist_ok=True); open(os.path.join(pub, name), 'wb').write(data)
    p = os.path.join(ROOT, 'src', 'assets.web.json'); A = json.load(open(p, encoding='utf-8'))
    A.setdefault('bgCh1', {})[room] = name; json.dump(A, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(room, '←', os.path.basename(f), 'crop', b, '→', name, len(data), 'bytes')

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('cmd'); ap.add_argument('room'); ap.add_argument('files', nargs='+')
    ap.add_argument('--out', default='/tmp/bg_sheet.png'); ap.add_argument('--focus', default='0.5,0.5'); ap.add_argument('--zoom', type=float, default=1.0)
    ap.add_argument('--pub', default=os.path.join(ROOT, '..', '..', 'assets', 'pub'))
    a = ap.parse_args()
    if a.cmd == 'sheet': sheet(a.room, a.files, a.out)
    else: place(a.room, a.files[0], tuple(float(v) for v in a.focus.split(',')), a.zoom, a.pub)
