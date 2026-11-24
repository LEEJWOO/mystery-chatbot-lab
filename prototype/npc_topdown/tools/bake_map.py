"""맵 배경 굽기: RPG Maker MV/MZ 48px 타일셋으로 world.json 의 맵을 한 장의 그림으로 만든다.

  python3 tools/bake_map.py <타일셋 폴더> [출력 png]

- 타일셋 원본은 저장소에 올리지 않는다(재배포 금지). 이 스크립트와, 다 그린 맵 한 장만 둔다.
- 48px 로 그린 뒤 화면 칸 크기(36px)로 줄인다. 자동 타일(A2·A4)은 가장자리 없이 '속' 조각만 쓴다.
- 칸 판정(벽·가구)은 world.json 그대로다. 그림은 판정을 바꾸지 않는다.
"""
import glob, json, os, sys
from PIL import Image, ImageDraw

T = 48
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = sys.argv[1] if len(sys.argv) > 1 else '/tmp/up/z3'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, '..', 'assets_src', 'test', 'map.png')
W = json.load(open(os.path.join(HERE, '..', 'src', 'world.json'), encoding='utf-8'))
M = W['map']; cols, rows_n = M['width'], M['height']; ROWS = M['rows']

_cache = {}
def sheet(key):
    if key not in _cache:
        _cache[key] = Image.open(glob.glob(os.path.join(SRC, '*' + key + '*'))[0]).convert('RGBA')
    return _cache[key]
def a2(key, bx, by):            # A2 자동 타일 블록의 속(가장자리 없는 칸)
    x, y = bx * 96, by * 144; return sheet(key).crop((x + 24, y + 72, x + 72, y + 120))
def a4top(key, bx, k):
    x, y = bx * 96, k * 240; return sheet(key).crop((x + 24, y + 72, x + 72, y + 120))
def a4side(key, bx, k):         # 벽면 한 칸: 위 가장자리 + 아래 가장자리
    x, y = bx * 96, k * 240 + 144; t = Image.new('RGBA', (T, T))
    t.paste(sheet(key).crop((x + 24, y, x + 72, y + 24)), (0, 0)); t.paste(sheet(key).crop((x + 24, y + 72, x + 72, y + 96)), (0, 24)); return t
def bt(key, c, r, w=1, h=1):    # B~E 시트 조각
    return sheet(key).crop((c * T, r * T, (c + w) * T, (r + h) * T))

FLOOR = {'자료실': a2('部屋床', 0, 0), '작업실': a2('図書館床', 1, 0), '정원': a2('Castle01_A2', 0, 0), '광장': a2('Castle01_A2', 6, 0)}
OUTDOOR = {'정원', '광장'}
WALL_TOP_IN, WALL_FACE_IN = a4top('部屋壁', 0, 1), a4side('部屋壁', 0, 0)
WALL_FACE_EXT = a4side('Castle01_A4', 2, 1)
HEDGE_TOP, HEDGE_FACE = a4top('Castle01_A4', 1, 0), a4side('Castle01_A4', 1, 0)

def area_of(x, y):
    for a in M['areas']:
        if a['x0'] <= x <= a['x1'] and a['y0'] <= y <= a['y1']: return a['name']
    return None
def near_area(x, y):            # 문·통로 칸은 가까운 방의 바닥을 쓴다
    for d in range(1, 4):
        for dx, dy in ((0, d), (0, -d), (d, 0), (-d, 0)):
            a = area_of(x + dx, y + dy)
            if a: return a
    return '광장'

prop_cells = {}
for p in M['props']:
    for yy in range(p['y'], p['y'] + p['h']):
        for xx in range(p['x'], p['x'] + p['w']): prop_cells[(xx, yy)] = p
wall = lambda x, y: not (0 <= x < cols and 0 <= y < rows_n) or (ROWS[y][x] == '#' and (x, y) not in prop_cells)

img = Image.new('RGBA', (cols * T, rows_n * T), (12, 10, 18, 255))
put = lambda tile, x, y: img.alpha_composite(tile, (int(x * T), int(y * T)))

# 1) 바닥
for y in range(rows_n):
    for x in range(cols):
        if not wall(x, y): put(FLOOR[area_of(x, y) or near_area(x, y)], x, y)
# 2) 장식(바닥 위)
deco = {'path': a2('Castle01_A2', 6, 3), 'flowers': a2('Castle01_A2', 5, 0)}
for d in M.get('decor', []):
    if d['t'] == 'rug':
        tile = a2('部屋床', 2, 1)
        for yy in range(d['y'], d['y'] + d['h']):
            for xx in range(d['x'], d['x'] + d['w']): put(tile, xx, yy)
        ImageDraw.Draw(img).rectangle([d['x'] * T + 2, d['y'] * T + 2, (d['x'] + d['w']) * T - 3, (d['y'] + d['h']) * T - 3], outline=(214, 180, 110, 255), width=3)
    elif d['t'] == 'mat':      # 문턱: 안쪽 문은 헤링본 마루, 바깥으로 난 문은 돌길
        for xx, yy in d['cells']: put(deco['path'] if yy >= 8 and (area_of(xx, yy + 1) or near_area(xx, yy + 1)) in OUTDOOR else a2('部屋床', 2, 0), xx, yy)
    elif d['t'] in deco:
        for xx, yy in d['cells']: put(deco[d['t']], xx, yy)
# 3) 벽: 아래가 바닥이면 벽면, 아니면 벽 윗면. 아래층(야외) 경계는 생울타리, 건물 남쪽 벽은 바깥벽.
for y in range(rows_n):
    for x in range(cols):
        if not wall(x, y): continue
        below = None if wall(x, y + 1) else (area_of(x, y + 1) or near_area(x, y + 1))
        out = y >= 9 or (y == 8 and below in OUTDOOR)
        if y >= 9 and not (y == rows_n - 1 or x in (0, cols - 1)):   # 정원·광장 사이 경계
            put(HEDGE_FACE if below else HEDGE_TOP, x, y)
        elif below:
            put(WALL_FACE_EXT if out else WALL_FACE_IN, x, y)
        else:
            put(HEDGE_TOP if y >= 9 else WALL_TOP_IN, x, y)
# 4) 가구: 아래쪽 것을 나중에(겹침). 키 큰 가구는 윗칸으로 솟는다.
def draw_prop(p):
    t, x, y, w, h = p['t'], p['x'], p['y'], p['w'], p['h']
    if t == 'shelf':
        for i in range(w): put(bt('Inside01_C', 2 + i % 3, 4, 1, 2), x + i, y - 1)
    elif t == 'cabinet':
        for i in range(w): put(bt('Inside01_C', i % 2, 4, 1, 2), x + i, y - 1)
    elif t == 'table': put(bt('Inside01_D1', 2, 12), x, y)
    elif t == 'desk':
        for i in range(w): put(bt('Inside01_D1', 4 + i % 2, 13), x + i, y)
    elif t == 'crate': put(bt('Inside01_D1', 14, 12), x, y)
    elif t == 'pot': put(bt('Inside01_C', 2, 13), x, y)
    elif t == 'tree': put(bt('Castle01_B', 0, 9, 2, 2), x - .5, y - 1)
    elif t == 'bench': put(bt('Castle01_B', 8, 4, 2, 1), x, y)
    elif t == 'board': put(bt('Castle01_B', 6, 0, 2, 2), x - .5, y - 1)
    elif t == 'fountain': put(bt('Castle01_E', 0, 6, 3, 3).resize((w * T, h * T), Image.LANCZOS), x, y)
    elif t == 'lamp': put(bt('Castle01_B', 9, 9, 1, 2), x, y - 1)
    elif t == 'planter': put(bt('Castle01_B', 4, 12), x, y)
for p in sorted(M['props'], key=lambda p: p['y'] + p['h']): draw_prop(p)

cell = 36
img.resize((cols * cell, rows_n * cell), Image.LANCZOS).convert('RGB').save(OUT)
print('맵', OUT, cols * cell, 'x', rows_n * cell)
