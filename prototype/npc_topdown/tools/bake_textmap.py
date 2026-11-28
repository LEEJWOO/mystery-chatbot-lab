"""글자 지도 + 테마 → 맵 그림 한 장(게임 칸 36px). 타일셋 원본은 저장소에 두지 않는다(TILESET_DIR).

사용: TILESET_DIR=/path/to/tiles python3 tools/bake_textmap.py [장=ch1] [출력.png] [층별 미리보기 폴더]
- 칸 판정은 글자 지도 그대로. 그림은 판정을 바꾸지 않는다(막힌 칸은 막혀 보이게, 걷는 칸은 걷는 칸답게).
- 자동 타일은 가장자리 없이 '속' 조각만 쓴다(대략 지도용). 바꿀 그림은 maps/<장>/theme.txt만 고치면 된다.
"""
import os, sys, math
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import textmap

T, CELL = 48, 36
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
CH = sys.argv[1] if len(sys.argv) > 1 else 'ch1'
OUT = sys.argv[2] if len(sys.argv) > 2 else '/tmp/map_%s.png' % CH
PREV = sys.argv[3] if len(sys.argv) > 3 else None
SRC = os.environ.get('TILESET_DIR', '/home/claude/local_assets/tilesets_src/x')
MAP, META = textmap.build(os.path.join(ROOT, 'maps', CH))
W, H, ROWS, TER = MAP['width'], MAP['height'], MAP['rows'], MAP['terrain']

_sheets = {}
def sheet(n):
    if n not in _sheets: _sheets[n] = Image.open(os.path.join(SRC, n + '.png')).convert('RGBA')
    return _sheets[n]
def piece(tok):
    k = tok[0]
    if k == 'color': return Image.new('RGBA', (T, T), tok[1])
    S, x, y = sheet(tok[1]), int(tok[2]), int(tok[3])
    if k == 'in': return S.crop((x * T + 24, y * T + 72, x * T + 72, y * T + 120))
    if k == 'a3': return S.crop((x * T + 24, y * T + 24, x * T + 72, y * T + 72))
    if k == 'face':
        t = Image.new('RGBA', (T, T)); t.paste(S.crop((x * T + 24, y * T, x * T + 72, y * T + 24)), (0, 0)); t.paste(S.crop((x * T + 24, y * T + 72, x * T + 72, y * T + 96)), (0, 24)); return t
    if k == 'tile':
        w, h = (int(tok[4]), int(tok[5])) if len(tok) > 5 else (1, 1)
        return S.crop((x * T, y * T, (x + w) * T, (y + h) * T))
    raise ValueError(tok)
def autotile(name, bx, by, same):
    """RPG Maker A1·A2 자동 타일 한 칸. same(dx,dy) = 이웃이 같은 종류인가. 반 칸(24px) 넷을 골라 붙인다."""
    S, X, Y, h = sheet(name), bx * T, by * T, 24
    q = lambda cx, cy: S.crop((X + cx * h, Y + cy * h, X + cx * h + h, Y + cy * h + h))
    out = Image.new('RGBA', (T, T))
    for qx, qy in ((0, 0), (1, 0), (0, 1), (1, 1)):
        sx, sy = (1 if qx else -1), (1 if qy else -1)
        hh, vv, dd = same(sx, 0), same(0, sy), same(sx, sy)
        if hh and vv: src = ({(0, 0): (2, 4), (1, 0): (1, 4), (0, 1): (2, 3), (1, 1): (1, 3)} if dd else {(0, 0): (2, 0), (1, 0): (3, 0), (0, 1): (2, 1), (1, 1): (3, 1)})[(qx, qy)]
        elif vv: src = {(0, 0): (0, 4), (1, 0): (3, 4), (0, 1): (0, 3), (1, 1): (3, 3)}[(qx, qy)]
        elif hh: src = {(0, 0): (2, 2), (1, 0): (1, 2), (0, 1): (2, 5), (1, 1): (1, 5)}[(qx, qy)]
        else: src = {(0, 0): (0, 2), (1, 0): (3, 2), (0, 1): (0, 5), (1, 1): (3, 5)}[(qx, qy)]
        out.alpha_composite(q(*src), (qx * h, qy * h))
    return out
def spec(s):
    s = s.strip()
    if s in ('none', ''): return None
    if s.startswith('draw '): return {'draw': s.split()[1]}
    if s.startswith('auto '): t = s.split(); return {'auto': (t[1], int(t[2]), int(t[3])), 'under': ' '.join(t[4:]) == 'under'}
    opts = {}
    parts = []
    for seg in s.split('+'):
        toks = seg.split()
        keep = []
        for t in toks:
            if t in ('fit', 'repeat', 'span'): opts[t] = True
            elif t.startswith('up='): opts['up'] = int(t[3:])
            else: keep.append(t)
        parts.append(piece(keep))
    im = parts[0].copy()
    for p in parts[1:]:
        if p.size == im.size: im.alpha_composite(p)
        else: im.alpha_composite(p, (0, im.height - p.height))
    return {'im': im, **opts}

TH = {'floor': {}, 'terrain': {}, 'wall': {}, 'object': {}, 'link': {}, 'guard': {}, 'misc': {}}
for line in open(os.path.join(ROOT, 'maps', CH, 'theme.txt'), encoding='utf-8'):
    line = line.strip()
    if not line or line.startswith('#') or '=' not in line: continue
    kind, _, rest = line.partition(' ')
    if rest.startswith('= = '): name, right = '=', rest[4:]        # terrain = = …(건물)
    elif rest.startswith('= '): name, right = '', rest[2:]        # building_face = …
    else: i = rest.find(' = ', 1); name, right = rest[:i], rest[i + 3:]
    v = spec(right)
    if kind in TH and name: TH[kind][name.strip()] = v
    else: TH['misc'][kind] = v

areas = MAP['areas']
def area_at(x, y):
    for a in areas:
        if a['x0'] <= x <= a['x1'] and a['y0'] <= y <= a['y1']: return a
def near_area(x, y):
    a = area_at(x, y)
    if a: return a
    for d in range(1, 5):
        for dx, dy in ((0, d), (0, -d), (d, 0), (-d, 0)):
            a = area_at(x + dx, y + dy)
            if a: return a
def level_at(y):
    for L in MAP['levels']:
        if L['y0'] <= y <= L['y1']: return L['name']
def floor_im(a):
    if not a: return TH['floor'].get('*')
    n = a['name']
    for key in (n, n.rstrip('0123456789 ')):
        if key in TH['floor']: return TH['floor'][key]
    return TH['floor'].get('*')

ROCKY = {'바위 해안', '갯바위', '전망 바위', '이끼 비탈'}   # 이 방에 붙은 바다 칸에는 바위를 띄엄띄엄 놓는다
walk = lambda x, y: 0 <= x < W and 0 <= y < H and ROWS[y][x] != '#'
img = Image.new('RGBA', (W * T, H * T), (12, 10, 18, 255))
def put(im, x, y): img.alpha_composite(im, (int(round(x * T)), int(round(y * T))))
secret = {(q['x'], q['y']) for q in MAP['secrets']}
inlevel = lambda y: level_at(y) is not None

# 1) 바닥(걷는 칸 + 가구 밑)
for y in range(H):
    if not inlevel(y): continue
    for x in range(W):
        t = TER[y][x]
        if walk(x, y) or t == '*' or t == '^':
            f = floor_im(near_area(x, y))
            if f: put(f['im'], x, y)
# 2) 지형·벽
for y in range(H):
    if not inlevel(y): continue
    lv = level_at(y)
    for x in range(W):
        t = TER[y][x]
        if t in '~%|=' or t == '^':
            v = TH['terrain'].get(t)
            if v and 'auto' in v:
                if t == '~':          # 바다 가장자리 밑에는 이웃 땅의 바닥을 깐다
                    f = floor_im(near_area(x, y)); put(f['im'], x, y) if f else None
                same = lambda dx, dy, t=t, x=x, y=y: not (0 <= x + dx < W and 0 <= y + dy < H) or TER[y + dy][x + dx] == t or not inlevel(y + dy)
                put(autotile(*v['auto'], same), x, y)
            elif v: put(v['im'], x, y)
            if t == '~' and TH['misc'].get('sea_rocks') and any(0 <= x + dx < W and 0 <= y + dy < H and (TER[y + dy][x + dx] in '^|' or (area_at(x + dx, y + dy) or {}).get('name') in ROCKY) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))) and (x * 7 + y * 3) % 3 == 0:
                put(TH['misc']['sea_rocks']['im'], x, y)
            if t == '=' and not (y + 1 < H and TER[y + 1][x] == '='):
                put(TH['misc']['building_face']['im'], x, y)
                if x % 3 == 1: put(TH['misc']['building_window']['im'], x, y)
        elif t == '#' or (x, y) in secret:
            below = y + 1 < H and (walk(x, y + 1) or TER[y + 1][x] == '*') and level_at(y + 1) == lv
            if below: rb = (near_area(x, y + 1) or {}).get('name'); put((TH['wall'].get(rb) or TH['wall'].get(lv) or TH['wall']['*'])['im'], x, y)
            else: put(TH['misc']['wall_top']['im'], x, y)
# 정문: 건물 아랫줄 가운데 문
for L_ in MAP['links']:
    if L_['name'] == '정문':
        for p in (L_['a'], L_['b']):
            if p[1] > 0 and TER[p[1] - 1][p[0]] == '=': put(TH['misc']['building_door']['im'], p[0] - .5, p[1] - 2)

# 3) 직접 그리는 것
D = ImageDraw.Draw(img)
def draw(kind, x0, y0, x1, y1):
    X0, Y0, X1, Y1 = x0 * T, y0 * T, (x1 + 1) * T, (y1 + 1) * T
    if kind == 'piano':
        PW, PH = X1 - X0, Y1 - Y0
        D.ellipse([X0 + 6, Y0 - 18, X1 - 4, Y0 + PH * .9], fill=(18, 16, 22, 255)); D.rectangle([X0 + 4, Y0 + PH * .45, X1 - 4, Y1 - 14], fill=(18, 16, 22, 255))
        D.ellipse([X0 + 18, Y0 - 6, X1 - 22, Y0 + PH * .6], outline=(70, 64, 86, 255), width=3)
        ky = Y1 - 26; D.rectangle([X0 + 8, ky, X1 - 8, ky + 14], fill=(240, 236, 228, 255))
        for i in range(X0 + 12, X1 - 10, 9): D.rectangle([i, ky, i + 4, ky + 8], fill=(20, 18, 24, 255))
    elif kind == 'diving':
        D.rectangle([X0 + 18, Y0 - 30, X0 + 30, Y1 - 4], fill=(200, 200, 205, 255)); D.rectangle([X0 - 30, Y0 - 34, X0 + 34, Y0 - 24], fill=(240, 240, 240, 255), outline=(90, 90, 100, 255))
        for k in range(4): D.line([X0 + 18, Y0 - 20 + k * 14, X0 + 30, Y0 - 20 + k * 14], fill=(90, 90, 100, 255), width=2)
    elif kind == 'door':
        D.rectangle([X0 + 8, Y0 + 4, X1 - 8, Y1], fill=(70, 46, 32, 255), outline=(30, 20, 14, 255), width=2); D.ellipse([X1 - 18, Y0 + 24, X1 - 12, Y0 + 30], fill=(220, 190, 90, 255))
    elif kind == 'tank':
        D.ellipse([X0 + 4, Y0 - 20, X1 - 4, Y1 - 4], fill=(150, 160, 170, 255), outline=(60, 66, 74, 255), width=3); D.ellipse([X0 + 30, Y0 - 6, X1 - 30, Y1 - 30], outline=(90, 98, 108, 255), width=3)
    elif kind == 'antenna':
        cx = (X0 + X1) / 2; D.line([cx, Y0 - 40, cx, Y1 - 4], fill=(70, 70, 80, 255), width=4)
        for k in range(3): D.line([cx - 16 + k * 3, Y0 - 30 + k * 12, cx + 16 - k * 3, Y0 - 30 + k * 12], fill=(70, 70, 80, 255), width=3)
    elif kind == 'generator':
        D.rectangle([X0 + 4, Y0 - 16, X1 - 4, Y1 - 4], fill=(60, 74, 66, 255), outline=(24, 30, 26, 255), width=3)
        for i in range(X0 + 14, X1 - 10, 12): D.line([i, Y0 - 6, i, Y1 - 14], fill=(34, 42, 38, 255), width=3)
        D.rectangle([X1 - 30, Y0 - 8, X1 - 12, Y0 + 6], fill=(220, 180, 60, 255))
    elif kind == 'podium':
        D.rectangle([X0 + 6, Y0 - 6, X1 - 6, Y1 - 4], fill=(58, 34, 40, 255), outline=(150, 110, 70, 255), width=3); D.rectangle([X0 + 10, Y0 - 12, X1 - 10, Y0 + 2], fill=(90, 56, 60, 255))
    elif kind == 'hostseat':
        D.rectangle([X0 + 4, Y0 - 26, X1 - 4, Y1 - 4], fill=(40, 20, 30, 255), outline=(200, 160, 80, 255), width=3); D.ellipse([X0 + 16, Y0 - 20, X1 - 16, Y0 + 2], fill=(200, 160, 80, 255))
    elif kind == 'stairs':
        D.rectangle([X0 + 2, Y0 + 2, X1 - 2, Y1 - 2], fill=(120, 96, 70, 255))
        for k in range(5): D.line([X0 + 4, Y0 + 6 + k * 9, X1 - 4, Y0 + 6 + k * 9], fill=(70, 52, 36, 255), width=3)
    elif kind == 'pit':
        D.ellipse([X0 + 8, Y0 + 8, X1 - 8, Y1 - 8], fill=(8, 10, 14, 255)); put(autotile('World_A1', 8, 6, lambda dx, dy: False), x0, y0)
    elif kind == 'crack':
        D.polygon([(X0 + 10, Y0 + 6), (X0 + 30, Y0 + 14), (X0 + 40, Y0 + 30), (X0 + 26, Y1 - 6), (X0 + 14, Y0 + 30)], fill=(10, 14, 18, 255))
    elif kind == 'posts':
        for px in (X0 + 6, X1 - 14): D.rectangle([px, Y0 + 14, px + 8, Y1 - 6], fill=(80, 56, 36, 255))
    elif kind == 'anchor':
        D.rectangle([X0 + 18, Y0 + 10, X0 + 30, Y1 - 8], fill=(110, 80, 50, 255)); D.arc([X0 + 8, Y0 + 20, X1 - 8, Y1 - 4], 0, 180, fill=(190, 170, 120, 255), width=3)

def place(v, cells):
    if not v: return
    xs, ys = [c[0] for c in cells], [c[1] for c in cells]
    x0, y0, x1, y1 = min(xs), min(ys), max(xs), max(ys)
    if 'draw' in v: draw(v['draw'], x0, y0, x1, y1); return
    im = v['im']
    if v.get('repeat'):
        for cx, cy in sorted(cells, key=lambda c: c[1]): put(im, cx + (1 - im.width / T) / 2, cy + 1 - im.height / T)
        return
    bw = x1 - x0 + 1
    if v.get('span'):                 # 왼쪽 끝 · 가운데(반복) · 오른쪽 끝
        n = im.width // T; L_, M_, R_ = im.crop((0, 0, T, im.height)), im.crop((T * (n // 2), 0, T * (n // 2 + 1), im.height)), im.crop((im.width - T, 0, im.width, im.height))
        top = y1 + 1 - im.height / T
        for i in range(bw): put(L_ if i == 0 else R_ if i == bw - 1 else M_, x0 + i, top)
        return
    if v.get('fit'):
        k = bw * T / im.width; im = im.resize((bw * T, max(1, int(im.height * k))), Image.LANCZOS)
    put(im, x0 + (bw - im.width / T) / 2, y1 + 1 - im.height / T)

jobs = []
for l in MAP['landmarks']:
    v = TH['object'].get(l['id'])
    if v: jobs.append((max([c[1] for c in l['hit']] or [l['y']]), v, l['hit'] or [[l['x'], l['y']]]))
for p in META['props']:
    v = TH['object'].get(p['name'])
    if v: jobs.append((max(c[1] for c in p['cells']), v, p['cells']))
for L_ in MAP['links']:
    key = next((k for k in TH['link'] if L_['name'].startswith(k)), None)
    if key and TH['link'][key]:
        for p in (L_['a'], L_['b']): jobs.append((p[1] - .5, TH['link'][key], [p]))
for g in MAP['guards']:
    v = TH['guard'].get(g['id'])
    if v: jobs.append((max(c[1] for c in g['cells']), v, g['cells']))
for _, v, cells in sorted(jobs, key=lambda j: j[0]): place(v, cells)

small = img.resize((W * CELL, H * CELL), Image.LANCZOS).convert('RGB')
small.save(OUT); print('맵', OUT, small.size)
if PREV:
    os.makedirs(PREV, exist_ok=True)
    for i, L in enumerate(MAP['levels']):
        p = os.path.join(PREV, '%s_tiles_%d_%s.png' % (CH, i + 1, L['name']))
        small.crop((L['x0'] * CELL, L['y0'] * CELL, (L['x1'] + 1) * CELL, (L['y1'] + 1) * CELL)).save(p); print(p)
