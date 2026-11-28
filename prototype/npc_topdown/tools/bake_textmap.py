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
    if s.startswith('cliff '): t = s.split(); return {'cliff': (t[1], int(t[2]), int(t[3]))}   # A4 벼랑: 윗면 자동 타일 + 아래가 낮으면 바위 면
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

TH = {'floor': {}, 'terrain': {}, 'wall': {}, 'object': {}, 'link': {}, 'guard': {}, 'overlay': {}, 'misc': {}, 'rug': {}, 'wallart': {}, 'ground': {}, 'patch': {}, 'dots': {}, 'walltop': {}}
for line in open(os.path.join(ROOT, 'maps', CH, 'theme.txt'), encoding='utf-8'):
    line = line.strip()
    if not line or line.startswith('#') or '=' not in line: continue
    kind, _, rest = line.partition(' ')
    if rest.startswith('= = '): name, right = '=', rest[4:]        # terrain = = …(건물)
    elif rest.startswith('= '): name, right = '', rest[2:]        # building_face = …
    else: i = rest.find(' = ', 1); name, right = rest[:i], rest[i + 3:]
    v = spec(right)
    if kind == 'rug':
        t = name.split(); TH['rug'][' '.join(t[:-4])] = TH['rug'].get(' '.join(t[:-4]), []) + [(tuple(int(q) for q in t[-4:]), v)]
    elif kind in ('patch', 'dots'):     # patch 방이름 밀도 크기 씨앗 = auto … / dots 방이름 밀도 씨앗 = tile …
        t = name.split(); n = 3 if kind == 'patch' else 2; TH[kind].setdefault(' '.join(t[:-n]), []).append((tuple(float(q) for q in t[-n:]), v))
    elif kind == 'wallart':
        t = name.split(); TH['wallart'][' '.join(t[:-1])] = (int(t[-1]), v)    # wallart 방이름 간격 = 조각
    elif kind in TH and name: TH[kind][name.strip()] = v
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

def hrand(x, y, seed=0):
    h = (x * 374761393 + y * 668265263 + int(seed) * 2246822519) & 0xffffffff
    h = ((h ^ (h >> 13)) * 1274126177) & 0xffffffff
    return ((h ^ (h >> 16)) & 0xffffff) / 0x1000000
def noise(x, y, seed=0, sc=3.0):
    """부드러운 값 잡음(0~1) — 덩어리 무늬용. sc = 덩어리 크기(칸)."""
    fx, fy = x / sc, y / sc; ix, iy = math.floor(fx), math.floor(fy); tx, ty = fx - ix, fy - iy
    sm = lambda t: t * t * (3 - 2 * t); tx, ty = sm(tx), sm(ty)
    a, b, c, d = hrand(ix, iy, seed), hrand(ix + 1, iy, seed), hrand(ix, iy + 1, seed), hrand(ix + 1, iy + 1, seed)
    return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty
ROCKY = {'바위 해안', '갯바위', '전망 바위', '이끼 비탈'}   # 이 방에 붙은 바다 칸에는 바위를 띄엄띄엄 놓는다
walk = lambda x, y: 0 <= x < W and 0 <= y < H and ROWS[y][x] != '#'
img = Image.new('RGBA', (W * T, H * T), (12, 10, 18, 255))
def put(im, x, y): img.alpha_composite(im, (int(round(x * T)), int(round(y * T))))
secret = {(q['x'], q['y']) for q in MAP['secrets']}
inlevel = lambda y: level_at(y) is not None

# 1) 바닥(걷는 칸 + 가구 밑). 층 바탕(ground)을 먼저 깔고, auto 바닥은 다른 바닥과 만나는 곳에 가장자리를 그린다.
land = lambda x, y: 0 <= x < W and 0 <= y < H and inlevel(y) and (walk(x, y) or TER[y][x] in '*^')
FK = [[None] * W for _ in range(H)]
for y in range(H):
    for x in range(W):
        if land(x, y): FK[y][x] = id(floor_im(near_area(x, y)))
def floor_at(f, x, y):
    if not f: return
    if 'auto' in f:
        k = FK[y][x]; put(autotile(*f['auto'], lambda dx, dy: not land(x + dx, y + dy) or FK[y + dy][x + dx] in (k, None)), x, y)
    else: put(f['im'], x, y)
def floor_full(f, x, y):      # 가장자리 없는 속(바다·벼랑 밑에 깔 때)
    if not f: return
    if 'auto' in f: put(autotile(*f['auto'], lambda dx, dy: True), x, y)
    else: put(f['im'], x, y)
for y in range(H):
    if not inlevel(y): continue
    gb = TH['ground'].get(level_at(y))
    for x in range(W):
        if land(x, y):
            if gb: floor_full(gb, x, y)
            floor_at(floor_im(near_area(x, y)), x, y)
# 1a) 덩어리 무늬(patch): 잡음으로 고른 칸에 자동 타일 — 같은 그림이 칸마다 되풀이되지 않게
taken = set()
for l in MAP['landmarks']: taken |= {tuple(c) for c in (l['hit'] or [])} | {(l['x'], l['y'])}
for pp in META['props']: taken |= {tuple(c) for c in pp['cells']}
for L_ in MAP['links']: taken |= {tuple(L_['a']), tuple(L_['b'])}
for a in areas:
    key = a['name'] if a['name'] in TH['patch'] else a['name'].rstrip('0123456789 ')
    for k, ((dens, sc, seed), v) in enumerate(TH['patch'].get(key, [])):
        if not v or 'auto' not in v: continue
        inp = lambda xx, yy: a['x0'] <= xx <= a['x1'] and a['y0'] <= yy <= a['y1'] and land(xx, yy) and noise(xx, yy, seed, sc) > 1 - dens
        for yy in range(a['y0'], a['y1'] + 1):
            for xx in range(a['x0'], a['x1'] + 1):
                if inp(xx, yy): put(autotile(*v['auto'], lambda dx, dy, xx=xx, yy=yy: inp(xx + dx, yy + dy)), xx, yy)
# 1c) 흩뿌림(dots): 걷는 칸에 작은 풀·꽃·자갈(막는 것처럼 보이는 건 쓰지 않는다)
for a in areas:
    key = a['name'] if a['name'] in TH['dots'] else a['name'].rstrip('0123456789 ')
    for (dens, seed), v in TH['dots'].get(key, []):
        if not v or 'im' not in v: continue
        got = set()
        for yy in range(a['y0'], a['y1'] + 1):
            for xx in range(a['x0'], a['x1'] + 1):
                if not walk(xx, yy) or (xx, yy) in taken or hrand(xx, yy, seed) >= dens or {(xx - 1, yy), (xx, yy - 1), (xx - 1, yy - 1), (xx + 1, yy - 1)} & got: continue
                got.add((xx, yy)); put(v['im'], xx, yy)
# 1b) 깔개(방 사각형 기준 위치·크기, 자동 타일 가장자리)
for a in areas:
    for (dx, dy, rw, rh), v in TH['rug'].get(a['name'], []):
        if not v or 'auto' not in v: continue
        X0, Y0 = a['x0'] + dx, a['y0'] + dy
        inside = lambda xx, yy: X0 <= xx < X0 + rw and Y0 <= yy < Y0 + rh
        for yy in range(Y0, Y0 + rh):
            for xx in range(X0, X0 + rw):
                if 0 <= xx < W and 0 <= yy < H and (walk(xx, yy) or TER[yy][xx] == '*'):
                    put(autotile(*v['auto'], lambda ddx, ddy, xx=xx, yy=yy: inside(xx + ddx, yy + ddy)), xx, yy)
# 2) 지형·벽
for y in range(H):
    if not inlevel(y): continue
    lv = level_at(y)
    for x in range(W):
        t = TER[y][x]
        if t in '~%|=' or t == '^':
            v = TH['terrain'].get(t)
            if v and 'cliff' in v:
                nm_, bx, by = v['cliff']; floor_full(floor_im(near_area(x, y)), x, y)
                low = y + 1 < H and TER[y + 1][x] not in '^|' and inlevel(y + 1)
                if low: put(piece(['face', nm_, bx, by + 3]), x, y)
                else: put(autotile(nm_, bx, by, lambda dx, dy, x=x, y=y: not (0 <= x + dx < W and 0 <= y + dy < H) or TER[y + dy][x + dx] in '^|'), x, y)
            elif v and 'auto' in v:
                if t == '~':          # 바다 가장자리 밑에는 이웃 땅의 바닥을 깐다
                    floor_full(floor_im(near_area(x, y)), x, y)
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
            else:
                wt = TH['walltop'].get(lv) or TH['misc'].get('wall_top')
                if wt and 'auto' in wt:
                    istop = lambda xx, yy: not (0 <= xx < W and 0 <= yy < H) or level_at(yy) != lv or (TER[yy][xx] == '#' and not (yy + 1 < H and (walk(xx, yy + 1) or TER[yy + 1][xx] == '*') and level_at(yy + 1) == lv))
                    put(TH['misc']['wall_fill']['im'], x, y) if TH['misc'].get('wall_fill') else None
                    put(autotile(*wt['auto'], lambda dx, dy: istop(x + dx, y + dy)), x, y)
                else: put(wt['im'], x, y)
# 그림자: 벽 바로 오른쪽 바닥의 왼쪽 반(알만툴 자동 그림자처럼)
SH = Image.new('RGBA', (T // 2, T), (0, 0, 0, 70))
for y in range(1, H):
    if not inlevel(y): continue
    for x in range(1, W):
        if (walk(x, y) or TER[y][x] == '*') and TER[y][x - 1] in '#=' and TER[y - 1][x - 1] in '#=' and level_at(y - 1) == level_at(y): put(SH, x, y)
# 벽 장식(창문·액자): 벽 아래 방 기준, 간격마다. 문 옆 칸은 건너뜀
for y in range(H):
    if not inlevel(y): continue
    for x in range(W):
        if not (TER[y][x] == '#' and y + 1 < H and walk(x, y + 1) and level_at(y + 1) == level_at(y)): continue
        a = area_at(x, y + 1)
        if not a or a['name'] not in TH['wallart'] and a['name'].rstrip('0123456789 ') not in TH['wallart']: continue
        step, v = TH['wallart'].get(a['name']) or TH['wallart'][a['name'].rstrip('0123456789 ')]
        if (x - a['x0']) % step != step // 2 or any(walk(x + d, y) for d in (-1, 1)) or any(TER[y][x + d] != '#' for d in (-1, 1)): continue
        put(v['im'], x, y + 1 - v['im'].height / T)
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
    # fit: 늘이거나 줄이지 않는다(도트가 뭉개짐) — 원래 크기로 덩어리 가운데에
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

# 깃발에 따라 보였다 사라지는 덧그림(예: 밧줄 사다리 — ladder_gone이면 숨김). 따로 저장하고 위치는 json으로.
OVER = []
for name, v in TH['overlay'].items():
    L_ = next((l for l in MAP['links'] if l['name'] == name), None)
    if not (v and L_): continue
    x0, y0, y1 = L_['a'][0], min(L_['a'][1], L_['b'][1]), max(L_['a'][1], L_['b'][1])
    hcell = y1 - y0 + 1; im = v['im'].resize((CELL, hcell * CELL), Image.LANCZOS)
    p = OUT.rsplit('.', 1)[0] + '_ov_%d.png' % len(OVER); im.save(p)
    OVER.append({'file': p, 'x': x0, 'y': y0, 'w': 1, 'h': hcell, 'unless': L_.get('off')})
import json as _j
_j.dump(OVER, open(OUT.rsplit('.', 1)[0] + '_overlays.json', 'w'), ensure_ascii=False)
small = img.resize((W * CELL, H * CELL), Image.LANCZOS).convert('RGB')
small.save(OUT); print('맵', OUT, small.size)
if PREV:
    os.makedirs(PREV, exist_ok=True)
    for i, L in enumerate(MAP['levels']):
        p = os.path.join(PREV, '%s_tiles_%d_%s.png' % (CH, i + 1, L['name']))
        small.crop((L['x0'] * CELL, L['y0'] * CELL, (L['x1'] + 1) * CELL, (L['y1'] + 1) * CELL)).save(p); print(p)
