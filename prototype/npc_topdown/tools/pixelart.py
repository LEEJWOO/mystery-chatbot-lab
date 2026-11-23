"""시험용 도트 그래픽 생성기 — 전체 맵 이미지 + 인물 걷기 스프라이트.

사용: python3 -I tools/pixelart.py <world.json> <출력 폴더>
- map.png     : 칸당 18px 원본을 2배(칸당 36px)로 키운 전체 맵. 바닥·벽·가구를 world.json(rows·props·decor·floors)에서 그린다.
- sprites.png : 인물마다 한 줄, 하·상·좌·우 × [정지 1 + 걷기 4] = 20칸. 칸 18x27px 원본의 2배.
  화면은 sprites.json의 dirs(방향별 정지·걷기 칸 번호)를 따르므로 걷기 장수는 몇 장이든 된다.
- sprites.json: 줄 순서(인물 id) — tools/assets.py가 주소 표에 넣는다.
본편 그래픽이 오면 같은 규격(칸 크기·프레임 순서)의 그림으로 바꿔 끼우면 된다.
"""
import json, os, random, sys
from PIL import Image, ImageDraw

T = 18          # 원본 칸 크기
UP = 2          # 내보낼 때 배율
CW, CH = 18, 27  # 스프라이트 칸

def hexc(h, a=255):
    h = h.lstrip('#'); return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)

def shade(c, k):
    return tuple(max(0, min(255, int(v * k))) for v in c[:3]) + (c[3] if len(c) > 3 else 255,)

# ---------------------------------------------------------------- 맵
def floor_tile(kind, rnd, x, y):
    im = Image.new('RGBA', (T, T)); d = ImageDraw.Draw(im)
    if kind == 'parquet':      # 헤링본 느낌의 나무 바닥
        base = hexc('#9a6a44'); d.rectangle([0, 0, T, T], fill=base)
        for i in range(0, T, 6):
            o = (i // 6 + x + y) % 2 * 3
            d.line([(0, i), (T, i)], fill=shade(base, .78))
            for j in range(-o, T, 9):
                d.line([(j, i), (j, i + 5)], fill=shade(base, .82))
            d.line([(0, i + 1), (T, i + 1)], fill=shade(base, 1.08))
    elif kind == 'tile':       # 작업실: 회청색 타일
        base = hexc('#7d8b97'); d.rectangle([0, 0, T, T], fill=base)
        for i in (0, 9):
            d.line([(0, i), (T, i)], fill=shade(base, .8)); d.line([(i, 0), (i, T)], fill=shade(base, .8))
        d.point([(2, 2), (11, 11)], fill=shade(base, 1.12))
    elif kind == 'grass':
        base = hexc('#5f9a4c'); d.rectangle([0, 0, T, T], fill=base)
        for _ in range(14):
            px, py = rnd.randrange(T), rnd.randrange(T)
            d.point((px, py), fill=shade(base, rnd.choice([.82, .88, 1.14])))
            if rnd.random() < .3: d.line([(px, py), (px, py - 2)], fill=shade(base, .78))
    elif kind == 'cobble':
        base = hexc('#a7a29a'); d.rectangle([0, 0, T, T], fill=shade(base, .78))
        for cy in range(0, T, 6):
            off = (cy // 6) % 2 * 4
            for cx in range(-off, T, 8):
                d.rounded_rectangle([cx + 1, cy + 1, cx + 7, cy + 5], radius=2, fill=shade(base, rnd.choice([.95, 1, 1.06])))
    return im

def wall_face(rnd, deco):
    im = Image.new('RGBA', (T, T)); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, T, 4], fill=hexc('#3a2a22')); d.line([(0, 4), (T, 4)], fill=hexc('#5a4334'))
    d.rectangle([0, 5, T, T - 4], fill=hexc('#dcc59b'))
    for i in range(1, T, 3): d.line([(i, 5), (i, T - 5)], fill=hexc('#d0b88d'))
    d.rectangle([0, T - 4, T, T], fill=hexc('#7a5636')); d.line([(0, T - 4), (T, T - 4)], fill=hexc('#a07650'))
    if deco == 'frame':
        d.rectangle([4, 6, 13, 11], fill=hexc('#7a5636')); d.rectangle([5, 7, 12, 10], fill=hexc('#7fb7d8')); d.rectangle([5, 9, 12, 10], fill=hexc('#6aa053'))
    elif deco == 'clock':
        d.ellipse([5, 5, 12, 12], fill=hexc('#5a4334')); d.ellipse([6, 6, 11, 11], fill=hexc('#f3ead6')); d.line([(8, 8), (8, 6)], fill=hexc('#333333')); d.line([(8, 8), (10, 8)], fill=hexc('#333333'))
    elif deco == 'lamp':
        d.polygon([(6, 6), (11, 6), (12, 10), (5, 10)], fill=hexc('#f2d58a')); d.line([(8, 10), (8, 12)], fill=hexc('#7a5636'))
    return im

def wall_cap():
    im = Image.new('RGBA', (T, T)); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, T, T], fill=hexc('#2b1f1a'))
    for i in range(0, T, 6): d.line([(0, i), (T, i)], fill=hexc('#33261f'))
    return im

def outline(im, color=(28, 20, 18, 255)):
    """불투명 영역 바깥 1px 테두리."""
    w, h = im.size; px = im.load(); out = im.copy(); po = out.load()
    for y in range(h):
        for x in range(w):
            if px[x, y][3] == 0 and any(0 <= x + dx < w and 0 <= y + dy < h and px[x + dx, y + dy][3] > 0 for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                po[x, y] = color
    return out

def prop(kind, w, h, rnd):
    """가구 그림. 칸 위로 최대 6px 솟을 수 있게 위쪽 여백을 둔다."""
    PW, PH = w * T, h * T + 6
    im = Image.new('RGBA', (PW, PH)); d = ImageDraw.Draw(im); top = 6
    if kind == 'shelf':
        d.rectangle([1, 0, PW - 2, PH - 2], fill=hexc('#6b4630'))
        for r in range(3):
            y0 = 2 + r * 7
            d.rectangle([3, y0, PW - 4, y0 + 5], fill=hexc('#3e281c'))
            x = 3
            while x < PW - 4:
                bw = rnd.choice([1, 2, 2, 3]); col = hexc(rnd.choice(['#c0503f', '#3f6fb0', '#d9a441', '#5c9a5a', '#8a5aa8', '#e8e0cf']))
                d.rectangle([x, y0 + rnd.choice([0, 1]), min(PW - 4, x + bw - 1), y0 + 5], fill=col); x += bw + (1 if rnd.random() < .2 else 0)
    elif kind in ('table', 'desk'):
        d.rectangle([1, top + 2, PW - 2, top + 10], fill=hexc('#b07c4f')); d.line([(1, top + 2), (PW - 2, top + 2)], fill=hexc('#cf9a68'))
        d.rectangle([1, top + 11, PW - 2, top + 12], fill=hexc('#7a5236'))
        for lx in (2, PW - 4): d.rectangle([lx, top + 13, lx + 1, PH - 1], fill=hexc('#5e3e28'))
        if kind == 'desk':
            d.rectangle([4, top - 1, 10, top + 5], fill=hexc('#2f3b48')); d.rectangle([5, top, 9, top + 3], fill=hexc('#7fd0e6'))
            d.rectangle([PW - 12, top + 4, PW - 5, top + 8], fill=hexc('#f3ead6')); d.line([(PW - 11, top + 5), (PW - 6, top + 5)], fill=hexc('#9a9a9a'))
        else:
            d.rectangle([5, top + 4, 11, top + 8], fill=hexc('#e9dfc8')); d.ellipse([12, top + 3, 15, top + 6], fill=hexc('#f3ead6'))
    elif kind == 'cabinet':
        d.rectangle([1, 0, PW - 2, PH - 1], fill=hexc('#8693a0')); d.line([(1, 0), (PW - 2, 0)], fill=hexc('#a8b4bf'))
        for i in range(w):
            x0 = i * T + 2; d.rectangle([x0, 4, x0 + T - 5, PH - 4], fill=hexc('#76838f')); d.rectangle([x0 + T - 8, 12, x0 + T - 7, 15], fill=hexc('#d9dee3'))
    elif kind == 'crate':
        d.rectangle([2, top - 2, PW - 3, PH - 2], fill=hexc('#b08452'))
        d.rectangle([2, top - 2, PW - 3, PH - 2], outline=hexc('#7a5636'))
        d.line([(2, top - 2), (PW - 3, PH - 2)], fill=hexc('#8f6a40')); d.line([(PW - 3, top - 2), (2, PH - 2)], fill=hexc('#8f6a40'))
    elif kind == 'pot':
        d.ellipse([3, 0, PW - 4, 13], fill=hexc('#4f8f45')); d.ellipse([5, 2, PW - 7, 9], fill=hexc('#67ad59'))
        d.polygon([(5, 13), (PW - 6, 13), (PW - 7, PH - 2), (6, PH - 2)], fill=hexc('#b8643e'))
    elif kind == 'tree':
        d.rectangle([7, 13, 10, PH - 2], fill=hexc('#6b4630'))
        d.ellipse([0, 0, PW - 1, 17], fill=hexc('#3f7a3a')); d.ellipse([2, 1, PW - 4, 12], fill=hexc('#4f9446')); d.ellipse([5, 2, 10, 7], fill=hexc('#6fb25c'))
    elif kind == 'bench':
        for yy in (top + 3, top + 7): d.rectangle([1, yy, PW - 2, yy + 2], fill=hexc('#b07c4f')); d.line([(1, yy), (PW - 2, yy)], fill=hexc('#cf9a68'))
        for lx in (3, PW - 5): d.rectangle([lx, top + 10, lx + 1, PH - 2], fill=hexc('#4a3a30'))
    elif kind == 'board':
        d.rectangle([2, 0, PW - 3, 13], fill=hexc('#6b4630')); d.rectangle([3, 1, PW - 4, 12], fill=hexc('#c99a62'))
        for (x0, y0, c) in ((4, 2, '#f3ead6'), (10, 3, '#f2d58a'), (5, 8, '#e8b7b7'), (11, 8, '#f3ead6')):
            d.rectangle([x0, y0, x0 + 3, y0 + 3], fill=hexc(c))
        for lx in (4, PW - 6): d.rectangle([lx, 14, lx + 1, PH - 2], fill=hexc('#5e3e28'))
    elif kind == 'fountain':
        d.ellipse([1, 2, PW - 2, PH - 2], fill=hexc('#8f8a84')); d.ellipse([3, 4, PW - 4, PH - 5], fill=hexc('#bdb7ad'))
        d.ellipse([6, 7, PW - 7, PH - 8], fill=hexc('#4f9fd0')); d.ellipse([9, 10, PW - 10, PH - 12], fill=hexc('#79c1e6'))
        cx = PW // 2; d.rectangle([cx - 2, 4, cx + 1, 18], fill=hexc('#bdb7ad')); d.ellipse([cx - 4, 2, cx + 3, 7], fill=hexc('#d9d3c9'))
        for dx in (-5, 4): d.point((cx + dx, 9), fill=hexc('#d6f0fb'))
    elif kind == 'lamp':
        d.rectangle([8, 4, 9, PH - 3], fill=hexc('#3c3f45')); d.rectangle([5, PH - 3, 12, PH - 1], fill=hexc('#3c3f45'))
        d.rectangle([5, 0, 12, 5], fill=hexc('#3c3f45')); d.rectangle([6, 1, 11, 4], fill=hexc('#f6dd8c'))
    elif kind == 'planter':
        d.rectangle([2, top + 3, PW - 3, PH - 2], fill=hexc('#9c8f80')); d.rectangle([3, top + 1, PW - 4, top + 6], fill=hexc('#5f9a4c'))
        for (x0, c) in ((5, '#e26d6d'), (9, '#f2d58a'), (12, '#e8a3d0')): d.rectangle([x0, top, x0 + 1, top + 1], fill=hexc(c))
    return outline(im)

def build_map(world):
    m = world['map']; W, H = m['width'], m['height']; rnd = random.Random(7)
    img = Image.new('RGBA', (W * T, H * T), hexc('#1a1412'))
    rows = m['rows']; floors = m.get('floors', [])
    area_of = lambda x, y: next((i for i, a in enumerate(m['areas']) if a['x0'] <= x <= a['x1'] and a['y0'] <= y <= a['y1']), -1)
    near_floor = lambda x, y: next((floors[a] for a in [area_of(x, y + 1), area_of(x, y - 1), area_of(x + 1, y), area_of(x - 1, y)] if a >= 0), 'parquet')
    propcells = {(x, y) for p in m.get('props', []) for y in range(p['y'], p['y'] + p['h']) for x in range(p['x'], p['x'] + p['w'])}
    for y in range(H):
        for x in range(W):
            a = area_of(x, y)
            if rows[y][x] != '#' or (x, y) in propcells:          # 바닥(가구 밑 포함)
                img.alpha_composite(floor_tile(floors[a] if a >= 0 else near_floor(x, y), rnd, x, y), (x * T, y * T))
            elif y + 1 < H and rows[y + 1][x] != '#' or (y + 1 < H and (x, y + 1) in propcells):
                deco = rnd.choice([None, None, None, 'frame', 'clock', 'lamp']) if y == 0 or rnd.random() < .5 else None
                img.alpha_composite(wall_face(rnd, deco), (x * T, y * T))
            else:
                img.alpha_composite(wall_cap(), (x * T, y * T))
    d = ImageDraw.Draw(img)
    for dec in m.get('decor', []):
        if dec['t'] == 'rug':
            x0, y0 = dec['x'] * T + 2, dec['y'] * T + 2; x1, y1 = (dec['x'] + dec['w']) * T - 3, (dec['y'] + dec['h']) * T - 3
            d.rectangle([x0, y0, x1, y1], fill=hexc('#7a3b3b')); d.rectangle([x0 + 2, y0 + 2, x1 - 2, y1 - 2], outline=hexc('#d9a441'))
            d.rectangle([x0 + 5, y0 + 5, x1 - 5, y1 - 5], outline=hexc('#a25454'))
        for (cx, cy) in dec.get('cells', []):
            X, Y = cx * T, cy * T
            if dec['t'] == 'path':
                for (ox, oy) in ((2, 2), (10, 4), (4, 10), (11, 12)):
                    d.rounded_rectangle([X + ox, Y + oy, X + ox + 5, Y + oy + 4], radius=2, fill=hexc('#cbbd9e'))
            elif dec['t'] == 'flowers':
                for _ in range(4):
                    fx, fy = X + rnd.randrange(2, T - 3), Y + rnd.randrange(2, T - 3); c = hexc(rnd.choice(['#e26d6d', '#f2d58a', '#e8a3d0', '#f3ead6']))
                    d.point([(fx, fy), (fx + 1, fy), (fx, fy + 1), (fx + 1, fy + 1)], fill=c)
            elif dec['t'] == 'mat':
                d.rectangle([X + 2, Y + 3, X + T - 3, Y + T - 4], fill=hexc('#6b4630')); d.rectangle([X + 4, Y + 5, X + T - 5, Y + T - 6], fill=hexc('#8c6040'))
    for p in sorted(m.get('props', []), key=lambda p: p['y']):
        im = prop(p['t'], p['w'], p['h'], rnd)
        img.alpha_composite(im, (p['x'] * T, p['y'] * T - 6))
    return img.resize((W * T * UP, H * T * UP), Image.NEAREST)

# ---------------------------------------------------------------- 인물
# 대화 그림(인물 이미지)의 머리색·머리 모양·복장을 참고한 시험용 외형
#  hair, style(short/bob/long/messy), top, bottom, legs(치마일 때 다리 색, None이면 바지), inner(앞트임 안쪽 색), collar(깃·후드 색)
LOOKS = {
    'player':    dict(hair='#2b3350', style='short', top='#2f3f5f', bottom='#3a3a48'),
    'companion': dict(hair='#f0956c', style='long',  top='#ecdcb4', bottom='#3a3a46', legs='#f4f1ec', collar='#f6f2ea', tie='#8c2a2a', tip='#e86b8f'),
    'librarian': dict(hair='#eef0f4', style='bob',   top='#34314a', bottom='#2c2a38', legs='#1e1c26', collar='#f6f2ea', tie='#3fa58c'),
    'contact':   dict(hair='#e3dccb', style='short', top='#eee8dc', bottom='#26252b', inner='#2a292f'),
    'courier':   dict(hair='#9a6644', style='messy', top='#efe2cf', bottom='#2a3040', inner='#c0505a', collar='#2a292f'),
}
SKIN = '#f6d7c0'

PHASES = ['idle', 'stepA', 'pass', 'stepB', 'pass']   # 정지 1 + 걷기 4(한 걸음마다 2장씩 넘어감)
DIRS = ['down', 'up', 'left', 'right']

def chibi(look, view, phase):
    """view: down/up/left, phase: PHASES. 16x24를 18x27 칸 아래쪽 가운데에 그린다. 우(right)는 좌를 그린 뒤 뒤집는다."""
    L = {k: (hexc(v) if isinstance(v, str) and v.startswith('#') else v) for k, v in look.items()}
    hair, style, top, bottom = L['hair'], L['style'], L['top'], L['bottom']
    legs, inner, collar, tie, tip = L.get('legs'), L.get('inner'), L.get('collar'), L.get('tie'), L.get('tip')
    skin = hexc(SKIN); im = Image.new('RGBA', (CW, CH)); d = ImageDraw.Draw(im)
    bob = 1 if phase == 'pass' else 0
    ox, oy = 1, CH - 25 - bob
    P = lambda x0, y0, x1, y1, c: d.rectangle([ox + x0, oy + y0, ox + x1, oy + y1], fill=c)
    shoe = hexc('#2a2026'); legc = legs or bottom; far = shade(legc, .8)
    # 다리(치마면 다리색=스타킹, 바지면 바지색)
    if view in ('down', 'up'):
        Ly, Ry = (23, 22) if phase == 'stepA' else (22, 23) if phase == 'stepB' else (23 + bob, 23 + bob)
        P(5, 19, 6, Ly - 1, legc); P(5, Ly, 6, Ly, shoe); P(9, 19, 10, Ry - 1, legc); P(9, Ry, 10, Ry, shoe)
    else:
        if phase == 'stepA': P(9, 19, 10, 22, far); P(9, 23, 11, 23, shade(shoe, .9)); P(4, 19, 5, 22, legc); P(3, 23, 5, 23, shoe)
        elif phase == 'stepB': P(4, 19, 5, 22, far); P(3, 23, 5, 23, shade(shoe, .9)); P(9, 19, 10, 22, legc); P(9, 23, 11, 23, shoe)
        else: P(6, 19, 9, 22 + bob, legc); P(5, 23 + bob, 9, 23 + bob, shoe)
    # 긴 머리는 몸 뒤에
    if style == 'long' and view != 'up':
        hc = shade(hair, .9)
        if view == 'left': P(8, 6, 13, 16, hc); tip and P(9, 15, 13, 16, tip)
        else: P(2, 6, 13, 16, hc); tip and (P(2, 15, 3, 16, tip), P(12, 15, 13, 16, tip))
    # 몸통
    if view in ('down', 'up'):
        P(4, 12, 11, 18, top); P(4, 18, 11, 18, shade(top, .82))
        if legs: P(3, 17, 12, 19, bottom); P(3, 19, 12, 19, shade(bottom, .8))   # 치마
        else: P(4, 18, 11, 18, bottom)
        if view == 'down':
            if inner: P(7, 13, 8, 17, inner)                 # 앞트임(코트·후드 지퍼 안쪽)
            if collar: P(5, 12, 10, 12, collar)
            if tie: P(7, 13, 8, 14, tie)
        elif collar and style == 'messy': P(4, 12, 11, 13, collar)   # 후드 뒤쪽
        la, ra = (-1, 1) if phase == 'stepA' else (1, -1) if phase == 'stepB' else (0, 0)
        if view == 'up': la, ra = ra, la
        P(3, 12 + la, 3, 16 + la, shade(top, .88)); P(12, 12 + ra, 12, 16 + ra, shade(top, .88))
        P(3, 17 + la, 3, 17 + la, skin); P(12, 17 + ra, 12, 17 + ra, skin)
    else:
        P(5, 12, 10, 18, top); P(5, 18, 10, 18, shade(top, .82))
        if legs: P(4, 17, 11, 19, bottom)
        if inner: P(5, 13, 5, 17, inner)
        if collar: P(5, 12, 8, 12, collar)
        if phase == 'stepA': P(9, 13, 10, 15, shade(top, .88)); P(10, 16, 10, 16, skin)
        elif phase == 'stepB': P(4, 13, 5, 15, shade(top, .88)); P(4, 16, 4, 16, skin)
        else: P(7, 13, 8, 16, shade(top, .88)); P(7, 17, 8, 17, skin)
    # 머리
    d.ellipse([ox + 2, oy + 0, ox + 13, oy + 12], fill=hair)
    hl = shade(hair, 1.12)
    if view == 'down':
        P(4, 5, 11, 10, skin); P(4, 11, 11, 11, skin); P(5, 12, 10, 12, skin) if not collar else None
        P(3, 3, 12, 5, hair); P(4, 6, 4, 6, hair); P(11, 6, 11, 6, hair); P(5, 2, 8, 2, hl)
        eye = hexc('#2a2230'); P(5, 7, 5, 8, eye); P(10, 7, 10, 8, eye); P(5, 7, 5, 7, hexc('#6f8fd0')); P(10, 7, 10, 7, hexc('#6f8fd0'))
        P(4, 10, 4, 10, hexc('#f2a8a0')); P(11, 10, 11, 10, hexc('#f2a8a0'))
        if style in ('bob', 'long'): P(2, 6, 3, 11, hair); P(12, 6, 13, 11, hair)
        if style == 'messy': P(2, 1, 3, 2, hair); P(12, 1, 13, 3, hair); P(7, -1, 8, 0, hair)
    elif view == 'up':
        P(3, 10, 12, 12, shade(hair, .85)); P(5, 2, 9, 3, hl)
        if style == 'bob': P(2, 6, 13, 12, hair)
        if style == 'long': P(2, 6, 13, 16, hair); P(3, 16, 12, 16, shade(hair, .85)); tip and P(2, 14, 13, 16, tip)
        if style == 'messy': P(2, 1, 3, 2, hair); P(12, 1, 13, 3, hair); P(7, -1, 8, 0, hair)
    else:
        P(2, 5, 7, 10, skin); P(3, 11, 7, 11, skin); P(2, 3, 9, 5, hair); P(8, 4, 13, 11, hair); P(4, 2, 8, 2, hl)
        P(3, 7, 3, 8, hexc('#2a2230')); P(3, 7, 3, 7, hexc('#6f8fd0')); P(4, 10, 4, 10, hexc('#f2a8a0'))
        if style in ('bob', 'long'): P(8, 6, 12, 12, hair)
        if style == 'messy': P(11, 1, 13, 2, hair); P(1, 3, 2, 4, hair)
    return outline(im)

def build_sprites(ids):
    """인물마다 한 줄: 하·상·좌·우 순서로 각각 [정지, 걷기1~4]. 좌우는 따로 저장한다(시험 그림은 우=좌 뒤집기로 생성)."""
    per = len(PHASES); sheet = Image.new('RGBA', (CW * per * len(DIRS), CH * len(ids)))
    for r, cid in enumerate(ids):
        look = LOOKS.get(cid, LOOKS['player'])
        for di, view in enumerate(DIRS):
            for pi, phase in enumerate(PHASES):
                im = chibi(look, 'left' if view == 'right' else view, phase)
                if view == 'right': im = im.transpose(Image.FLIP_LEFT_RIGHT)
                sheet.alpha_composite(im, ((di * per + pi) * CW, r * CH))
    dirs = {v: {'idle': di * per, 'walk': list(range(di * per + 1, di * per + per))} for di, v in enumerate(DIRS)}
    return sheet.resize((sheet.width * UP, sheet.height * UP), Image.NEAREST), dirs

if __name__ == '__main__':
    world = json.load(open(sys.argv[1], encoding='utf-8')); out = sys.argv[2]; os.makedirs(out, exist_ok=True)
    build_map(world).save(os.path.join(out, 'map.png'))
    ids = ['player'] + [n['id'] for n in world['npcs']]
    sheet, dirs = build_sprites(ids); sheet.save(os.path.join(out, 'sprites.png'))
    json.dump({'ids': ids, 'cw': CW * UP, 'ch': CH * UP, 'tile': T * UP, 'dirs': dirs}, open(os.path.join(out, 'sprites.json'), 'w'))
    print('map', world['map']['width'] * T * UP, 'x', world['map']['height'] * T * UP, '/ sprites', len(ids), '명')
