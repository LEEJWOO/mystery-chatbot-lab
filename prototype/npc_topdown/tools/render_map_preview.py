"""글자 지도 미리보기: maps/<장>/*.txt → 층별 PNG(방 이름·조사 지점·연결·숨은 공간·물때·시선 표시).

사용: python3 tools/render_map_preview.py [장=ch1] [출력 폴더=../../docs/plan/maps]
"""
import os, sys
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import textmap

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
CH = sys.argv[1] if len(sys.argv) > 1 else 'ch1'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, '..', '..', 'docs', 'plan', 'maps')
os.makedirs(OUT, exist_ok=True)
FONT = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
FB = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
f = lambda n, b=False: ImageFont.truetype(FB if b else FONT, n)
C = 22
TER = {'~': (23, 58, 87), '%': (42, 122, 146), '^': (74, 68, 60), '|': (106, 94, 78), '=': (90, 70, 54), '#': (15, 26, 39), '*': (58, 52, 70)}

MAP, META = textmap.build(os.path.join(ROOT, 'maps', CH))
hexc = lambda h: tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
tide = {tuple(c) for c in (MAP.get('tide') or {}).get('cells', [])}
for lv in MAP['levels']:
    x0, y0, x1, y1 = lv['x0'], lv['y0'], lv['x1'], lv['y1']
    gw, gh = (x1 - x0 + 1) * C, (y1 - y0 + 1) * C
    marks = [l for l in MAP['landmarks'] if y0 <= l['y'] <= y1]
    links = [(L, p) for L in MAP['links'] for p in (L['a'], L['b']) if y0 <= p[1] <= y1]
    secs = [q for q in MAP['secrets'] if y0 <= q['y'] <= y1]
    gds = [g for g in MAP['guards'] if y0 <= g['cells'][0][1] <= y1]
    legend = [('●', l['name']) for l in marks] + [('■', '연결: ' + L['name'] + (' (끊김: %s)' % L['off'] if L.get('off') else '')) for L, p in links if p == L['a'] or not (y0 <= L['a'][1] <= y1)]
    legend += [('◆', '숨은 공간: %s (플래그 %s)' % (q['id'], q['flag'])) for q in secs] + [('▲', '막는 칸: %s (%s, 열림 %s)' % (g['id'], g['who'], g['open'])) for g in gds]
    if any(y0 <= c[1] <= y1 for c in tide): legend.append(('▨', '물때 칸: 썰물(%s)에만 걸을 수 있음' % ', '.join(MAP['tide']['low'])))
    notes = [n for lvn, n in META['notes'] if lvn == lv['name']]
    sights = [s for s in META['sights'] if s['level'] == lv['name']]
    PW = 420
    H = max(gh + 60, 60 + 24 * (len(legend) + len(sights) + len(notes) * 2) + 40)
    im = Image.new('RGB', (gw + PW + 30, H + 10), (20, 18, 28)); d = ImageDraw.Draw(im)
    d.text((10, 8), '%s · %s (%d×%d칸)' % (CH, lv['name'], x1 - x0 + 1, y1 - y0 + 1), font=f(20, True), fill=(240, 220, 170))
    OX, OY = 10, 44
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            t = MAP['terrain'][y][x]; i = next((k for k, a in enumerate(MAP['areas']) if a['x0'] <= x <= a['x1'] and a['y0'] <= y <= a['y1']), -1)
            if MAP['rows'][y][x] == '#': col = TER.get(t, TER['#'])
            elif i >= 0: col = hexc(MAP['areas'][i].get('color') or '#3a4656')
            else: col = (70, 76, 90)
            X, Y = OX + (x - x0) * C, OY + (y - y0) * C
            d.rectangle([X, Y, X + C - 1, Y + C - 1], fill=col, outline=(255, 255, 255, 20) if False else tuple(min(255, c + 14) for c in col))
            if (x, y) in tide:
                for k in (0, 7, 14): d.line([X + k, Y + C - 1, X + C - 1, Y + k], fill=(120, 170, 160), width=1); d.line([X, Y + C - 1 - k, X + C - 1 - k, Y], fill=(120, 170, 160), width=1)
    bld = [(x, y) for y in range(y0, y1 + 1) for x in range(x0, x1 + 1) if MAP['terrain'][y][x] == '=']
    if bld:
        bx = (min(p[0] for p in bld) + max(p[0] for p in bld) + 1) / 2 - x0; by = (min(p[1] for p in bld) + max(p[1] for p in bld) + 1) / 2 - y0
        d.text((OX + bx * C, OY + by * C), '건물(호텔)', font=f(16, True), fill=(240, 220, 190), anchor='mm', stroke_width=3, stroke_fill=(0, 0, 0))
    for a in MAP['areas']:
        if not (y0 <= a['y0'] <= y1): continue
        cx, cy = OX + ((a['x0'] + a['x1'] + 1) / 2 - x0) * C, OY + ((a['y0'] + a['y1'] + 1) / 2 - y0) * C
        fs = 15 if (a['x1'] - a['x0']) >= 4 else 12
        d.text((cx, cy), a['name'], font=f(fs, True), fill=(255, 255, 255), anchor='mm', stroke_width=3, stroke_fill=(0, 0, 0))
    for s in sights:
        (ax, ay), (bx, by) = s['a'], s['b']; A = (OX + (ax - x0 + .5) * C, OY + (ay - y0 + .5) * C); B = (OX + (bx - x0 + .5) * C, OY + (by - y0 + .5) * C)
        n = int(max(abs(B[0] - A[0]), abs(B[1] - A[1])) // 8) or 1
        for k in range(0, n, 2): d.line([A[0] + (B[0] - A[0]) * k / n, A[1] + (B[1] - A[1]) * k / n, A[0] + (B[0] - A[0]) * (k + 1) / n, A[1] + (B[1] - A[1]) * (k + 1) / n], fill=(255, 210, 90), width=2)
    for k, l in enumerate(marks):
        X, Y = OX + (l['x'] - x0) * C, OY + (l['y'] - y0) * C
        for hx, hy in l['hit']: d.rectangle([OX + (hx - x0) * C + 2, OY + (hy - y0) * C + 2, OX + (hx - x0 + 1) * C - 3, OY + (hy - y0 + 1) * C - 3], outline=(224, 188, 120))
        d.ellipse([X + 2, Y + 2, X + C - 3, Y + C - 3], fill=(224, 188, 120)); d.text((X + C / 2, Y + C / 2), str(k + 1), font=f(11, True), fill=(30, 20, 10), anchor='mm')
    for L, p in links:
        X, Y = OX + (p[0] - x0) * C, OY + (p[1] - y0) * C; d.rectangle([X + 3, Y + 3, X + C - 4, Y + C - 4], fill=(242, 196, 109)); d.text((X + C / 2, Y + C / 2), '⇅', font=f(13, True), fill=(40, 30, 10), anchor='mm')
    for q in secs:
        X, Y = OX + (q['x'] - x0) * C, OY + (q['y'] - y0) * C; d.polygon([(X + C / 2, Y + 2), (X + C - 3, Y + C / 2), (X + C / 2, Y + C - 3), (X + 2, Y + C / 2)], fill=(190, 120, 255))
    for g in gds:
        for c in g['cells']:
            X, Y = OX + (c[0] - x0) * C, OY + (c[1] - y0) * C; d.polygon([(X + C / 2, Y + 3), (X + C - 3, Y + C - 4), (X + 3, Y + C - 4)], fill=(230, 80, 90))
    # 오른쪽 범례
    LX, LY = OX + gw + 20, OY; n = 0
    for sym, text in legend:
        if sym == '●': n += 1; d.ellipse([LX, LY + 3, LX + 16, LY + 19], fill=(224, 188, 120)); d.text((LX + 8, LY + 11), str(n), font=f(10, True), fill=(30, 20, 10), anchor='mm')
        else: d.text((LX + 8, LY + 11), sym, font=f(14, True), fill={'■': (242, 196, 109), '◆': (190, 120, 255), '▲': (230, 80, 90), '▨': (120, 170, 160)}[sym], anchor='mm')
        d.text((LX + 24, LY + 2), text, font=f(13), fill=(230, 228, 240)); LY += 24
    for s in sights: d.text((LX, LY + 2), '┄ ' + s['text'], font=f(13), fill=(255, 210, 90)); LY += 24
    for nt in notes:
        LY += 6; words, line = nt, ''
        for ch in words:
            if d.textlength(line + ch, font=f(12)) > PW - 10: d.text((LX, LY), line, font=f(12), fill=(170, 165, 190)); LY += 18; line = ''
            line += ch
        d.text((LX, LY), line, font=f(12), fill=(170, 165, 190)); LY += 18
    p = os.path.join(OUT, '%s_%d_%s.png' % (CH, MAP['levels'].index(lv) + 1, lv['name']))
    im.save(p); print(p)
