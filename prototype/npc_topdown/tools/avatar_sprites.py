"""플레이어 걷기 도트(외형 조립용) — 회색조 층 시트를 만든다.
- 조합: 머리 모양 4(short·messy·bob·long) × 옷 실루엣 2(pants·skirt) = 시트 8장
- 시트 한 장 = 5줄(층) × 20칸(하·상·좌·우 × [정지, 걷기 4]):
    0 base(윤곽·눈·신발, 색 고정) / 1 hair / 2 top / 3 bottom / 4 skin  (1~4는 회색조 → 화면이 고른 색을 곱해 입힌다)
- 각 층은 같은 그림을 색만 바꿔 두 번 그려 달라진 칸을 그 부위로 본다(그림이 겹쳐 가려진 칸은 자동으로 빠짐).
- 결과: assets/pub/<해시>.webp + src/assets.web.json 의 "avatar" 항목(다른 항목은 그대로 둔다)
사용: python3 tools/avatar_sprites.py <assets/pub> <src/assets.web.json>
"""
import hashlib, io, json, os, sys
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
import pixelart as P

STYLES = ['short', 'messy', 'bob', 'long']
OUTFITS = ['pants', 'skirt']
LAYERS = ['base', 'hair', 'top', 'bottom', 'skin']
G1, G2 = '#dcdcdc', '#3c8c3c'          # 회색조 기준색(밝게 둬야 곱했을 때 원래 색에 가깝다) / 차이 검출용 색

def render(style, outfit, swap=None):
    look = dict(hair=G1, style=style, top=G1, bottom=G1)
    if outfit == 'skirt': look['legs'] = G1
    skin = G1
    if swap == 'hair': look['hair'] = G2
    if swap == 'top': look['top'] = G2
    if swap == 'bottom': look['bottom'] = G2
    if swap == 'skin':
        skin = G2
        if outfit == 'skirt': look['legs'] = G2   # 치마 아래 다리는 피부로 친다
    P.SKIN = skin
    frames = []
    for view in P.DIRS:
        for phase in P.PHASES:
            im = P.chibi(look, 'left' if view == 'right' else view, phase)
            if view == 'right': im = im.transpose(Image.FLIP_LEFT_RIGHT)
            frames.append(im)
    return frames

def sheet(style, outfit):
    base = render(style, outfit)
    diffs = {k: render(style, outfit, k) for k in LAYERS[1:]}
    n = len(base); out = Image.new('RGBA', (P.CW * n, P.CH * len(LAYERS)))
    for f in range(n):
        b = base[f].load(); W, H = base[f].size
        layers = {k: Image.new('RGBA', (W, H)) for k in LAYERS}
        for y in range(H):
            for x in range(W):
                px = b[x, y]
                if px[3] == 0: continue
                part = next((k for k in LAYERS[1:] if diffs[k][f].getpixel((x, y)) != px), 'base')
                if part == 'base': layers['base'].putpixel((x, y), px)
                else: g = px[0]; layers[part].putpixel((x, y), (g, g, g, px[3]))   # 회색조(밝기만)
        for r, k in enumerate(LAYERS): out.alpha_composite(layers[k], (f * P.CW, r * P.CH))
    return out.resize((out.width * P.UP, out.height * P.UP), Image.NEAREST)

def save(im, out_dir):
    buf = io.BytesIO(); im.save(buf, 'WEBP', lossless=True); data = buf.getvalue()
    name = hashlib.sha1(data).hexdigest()[:12] + '.webp'
    open(os.path.join(out_dir, name), 'wb').write(data); return name

if __name__ == '__main__':
    out_dir, table = sys.argv[1], sys.argv[2]
    sheets = {f'{s}_{o}': save(sheet(s, o), out_dir) for s in STYLES for o in OUTFITS}
    per = len(P.PHASES)
    dirs = {v: {'idle': di * per, 'walk': list(range(di * per + 1, di * per + per))} for di, v in enumerate(P.DIRS)}
    t = json.load(open(table, encoding='utf-8'))
    t['avatar'] = {'cw': P.CW * P.UP, 'ch': P.CH * P.UP, 'layers': LAYERS, 'dirs': dirs, 'sheets': sheets}
    json.dump(t, open(table, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('시트', len(sheets), '장 →', out_dir)
