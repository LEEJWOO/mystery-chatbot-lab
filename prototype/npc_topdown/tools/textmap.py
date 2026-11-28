"""글자 지도(maps/<장>/*.txt) → 게임 지도(map) 변환기. 층 파일을 이름순으로 읽어 한 격자에 세로로 쌓는다.

층 파일 형식 (자세한 설명: maps/README.md)
  # 주석
  @level 1층            층 이름
  @pad ~                줄 길이가 모자랄 때 채울 글자(기본 #)
  @tide 2일 02:00~04:40, 2일 14:20~17:00   물때(썰물) 시간대 — tide 방은 이 시간에만 걸을 수 있다
  @grid                 아래 줄부터 지도
  @rooms                방: 글자 이름 [색] [tide]
  @marks                표시: 글자 종류/아이디 ...
  @sight a b 설명       미리보기용 시선(게임에는 영향 없음)
  @note 설명            미리보기 하단 메모

칸 글자
  A~Z 방 · a~z/0~9 표시 · # 벽 · ~ 바다 · % 물(수영장) · ^ 바위 · | 절벽(낭떠러지) · = 건물 · * 가구/물건 몸체 · + 통로(방 밖, 걸을 수 있음)
  막힌 칸: # ~ % ^ | = * (그리고 secret 표시). ~ % |는 시야를 막지 않는다(물 건너·절벽 아래가 보임).
표시 종류(@marks 한 줄)
  x id 이름 아이콘                      조사 지점(그 칸은 걸을 수 있음). 가까운 * % 덩어리가 몸체가 된다
  x link 이름 [off=플래그] [on=플래그]   연결 칸. 같은 이름의 표시 두 개가 서로 이어진다(계단·정문·사다리)
  x secret id flag=플래그 | 문장        숨은 공간 벽. 방 쪽 칸에서 그 벽으로 한 번 더 걸으면 열림. 반대편 칸이 틈
  x guard id open=… warn=a,b over=… who=… area=… | 대사1 | 대사2 | 대사3   막는 칸(같은 글자 칸 모두)
  1 prop 이름                           장식 가구(막힌 칸). 이어진 덩어리마다 그림 하나(theme.txt의 object 이름)
"""
import os, re, glob

BLOCK = set('#~%^=*|')
SEE_THROUGH = '~%|'
TERRAIN = set('~%^=*#|')


def _kv(s):
    return {k: v.strip() for k, v in re.findall(r'(\w+)=(.*?)(?=\s+\w+=|$)', s)}


def parse_level(path):
    L = {'file': os.path.basename(path), 'pad': '#', 'grid': [], 'rooms': {}, 'marks': {}, 'sights': [], 'notes': [], 'tide': []}
    sec = None
    for raw in open(path, encoding='utf-8').read().split('\n'):
        line = raw.rstrip()
        if sec != 'grid' and (not line.strip() or line.lstrip().startswith('#')): continue
        if line.startswith('@'):
            head, _, rest = line[1:].partition(' ')
            if head in ('grid', 'rooms', 'marks'): sec = head; continue
            sec = None
            if head == 'level': L['name'] = rest.strip()
            elif head == 'pad': L['pad'] = rest.strip()[:1] or '#'
            elif head == 'tide': L['tide'] = [t.strip() for t in rest.split(',') if t.strip()]
            elif head == 'sight': a, b, *d = rest.split(' '); L['sights'].append((a, b, ' '.join(d)))
            elif head == 'note': L['notes'].append(rest.strip())
            continue
        if sec == 'grid':
            if line: L['grid'].append(line)
        elif sec == 'rooms':
            ch, rest = line[0], line[2:].split(' ')
            opts = [t for t in rest if t.startswith('#') or t == 'tide']
            name = ' '.join(t for t in rest if t not in opts)
            L['rooms'][ch] = {'name': name, 'color': next((t for t in opts if t.startswith('#')), None), 'tide': 'tide' in opts}
        elif sec == 'marks':
            ch, rest = line[0], line[2:]
            body, *texts = [p.strip() for p in rest.split('|')]
            kind, _, tail = body.partition(' ')
            if kind == 'prop':
                L['marks'][ch] = {'kind': 'prop', 'name': tail.strip()}
            elif kind in ('link', 'secret', 'guard'):
                kv = _kv(tail); first = re.split(r'\s+\w+=', ' ' + tail)[0].strip()
                L['marks'][ch] = {'kind': kind, 'name': first, 'kv': kv, 'texts': texts}
            else:
                toks = tail.split(' ')
                L['marks'][ch] = {'kind': 'lm', 'id': kind, 'name': ' '.join(toks[:-1]) if len(toks) > 1 else toks[0], 'icon': toks[-1] if len(toks) > 1 else '·'}
    assert L.get('name'), path + ': @level 없음'
    return L


def build(folder, gap=2):
    files = sorted(f for f in glob.glob(os.path.join(folder, '*.txt')) if os.path.basename(f)[0].isdigit())  # 층 파일만(숫자로 시작)
    LV = [parse_level(f) for f in files]
    W = max(max(len(r) for r in L['grid']) for L in LV)
    rows, terrain, areas, landmarks, levels, secrets, guards, tide_rooms, tides = [], [], [], [], [], [], [], [], []
    ends, sights, notes, errs, props = {}, [], [], [], []
    y = 0
    for L in LV:
        H = len(L['grid']); G = [list(r.ljust(W, L['pad'])) for r in L['grid']]
        L['y0'] = y; levels.append({'name': L['name'], 'x0': 0, 'y0': y, 'x1': max(len(r) for r in L['grid']) - 1, 'y1': y + H - 1})
        tides += L['tide']
        # 방: 글자 칸들의 테두리 사각형. 사각형 안의 다른 방 글자는 오류(막힌 칸·표시는 괜찮음)
        box = {}
        for yy, r in enumerate(G):
            for xx, c in enumerate(r):
                if c.isupper() and c not in ('=',):
                    if c not in L['rooms']: errs.append('%s (%d,%d): 방 글자 %s가 @rooms에 없음' % (L['file'], xx, yy, c)); continue
                    b = box.setdefault(c, [xx, yy, xx, yy]); b[0] = min(b[0], xx); b[1] = min(b[1], yy); b[2] = max(b[2], xx); b[3] = max(b[3], yy)
        idx0 = len(areas)
        for c, (x0, y0, x1, y1) in box.items():
            for yy in range(y0, y1 + 1):
                for xx in range(x0, x1 + 1):
                    o = G[yy][xx]
                    if o.isupper() and o != c: errs.append('%s: 방 %s(%s)의 사각형 (%d,%d)~(%d,%d) 안에 다른 방 %s가 있음 (%d,%d)' % (L['file'], c, L['rooms'][c]['name'], x0, y0, x1, y1, o, xx, yy))
            R = L['rooms'][c]; a = {'name': R['name'], 'x0': x0, 'y0': y + y0, 'x1': x1, 'y1': y + y1}
            if R['color']: a['color'] = R['color']
            areas.append(a)
            if R['tide']: tide_rooms.append(len(areas) - 1)
        for c in L['rooms']:
            if c not in box: errs.append('%s: 방 %s(%s)가 지도에 없음' % (L['file'], c, L['rooms'][c]['name']))
        # 표시
        pos = {}
        for yy, r in enumerate(G):
            for xx, c in enumerate(r):
                if c.islower() or c.isdigit():
                    if c not in L['marks']: errs.append('%s (%d,%d): 표시 글자 %s가 @marks에 없음' % (L['file'], xx, yy, c)); continue
                    pos.setdefault(c, []).append((xx, yy))
        for c in L['marks']:
            if c not in pos: errs.append('%s: 표시 %s가 지도에 없음' % (L['file'], c))
        def room_at(xx, yy):
            for a in areas[idx0:]:
                if a['x0'] <= xx <= a['x1'] and a['y0'] - y <= yy <= a['y1'] - y: return a
        # 몸체(* %) 덩어리 → 가장 가까운 조사 지점(3칸 안)
        seen, bodies = set(), {}
        for yy, r in enumerate(G):
            for xx, c in enumerate(r):
                if c in '*%' and (xx, yy) not in seen:
                    comp, st = [], [(xx, yy)]; seen.add((xx, yy))
                    while st:
                        p = st.pop(); comp.append(p)
                        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                            q = (p[0] + dx, p[1] + dy)
                            if 0 <= q[1] < H and 0 <= q[0] < W and q not in seen and G[q[1]][q[0]] == c: seen.add(q); st.append(q)
                    best = None
                    for mc, ps in pos.items():
                        if L['marks'].get(mc, {}).get('kind') != 'lm': continue
                        d = min(abs(px - bx) + abs(py - by) for px, py in ps for bx, by in comp)
                        if d <= 3 and (best is None or d < best[0]): best = (d, mc)
                    if best: bodies.setdefault(best[1], []).extend(comp)
        for c, ps in pos.items():
            M = L['marks'].get(c)
            if not M: continue
            if M['kind'] == 'lm':
                (xx, yy), = ps[:1]
                if len(ps) > 1: errs.append('%s: 조사 지점 %s(%s)가 %d칸에 있음(한 칸만)' % (L['file'], c, M['name'], len(ps)))
                landmarks.append({'id': M['id'], 'name': M['name'], 'x': xx, 'y': y + yy, 'icon': M['icon'], 'hit': [[bx, y + by] for bx, by in bodies.get(c, [])]})
            elif M['kind'] == 'link':
                for xx, yy in ps: ends.setdefault(M['name'], []).append(((xx, y + yy), M['kv']))
            elif M['kind'] == 'secret':
                (xx, yy), = ps[:1]; frm = nook = None
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    a, b = (xx + dx, yy + dy), (xx - dx, yy - dy)
                    if 0 <= b[0] < W and 0 <= b[1] < H and room_at(*a) and G[b[1]][b[0]] not in BLOCK and not room_at(*b): frm, nook = a, b
                if not frm: errs.append('%s: 숨은 공간 %s — 한쪽은 방, 반대쪽은 걸을 수 있는 틈이어야 함' % (L['file'], M['name'])); continue
                secrets.append({'id': M['name'], 'x': xx, 'y': y + yy, 'from': [frm[0], y + frm[1]], 'flag': M['kv'].get('flag', 'secret_' + M['name']), 'text': (M['texts'] or [''])[0]})
            elif M['kind'] == 'guard':
                kv = M['kv']; cells = [[xx, y + yy] for xx, yy in ps]
                guards.append({'id': M['name'], 'cells': cells, 'stand': cells[0], 'area': kv.get('area', ''), 'open': kv.get('open', M['name'] + '_open'),
                               'warn': [s for s in kv.get('warn', '').split(',') if s], 'over': kv.get('over', M['name'] + '_over'), 'who': kv.get('who', ''), 'lines': M['texts']})
        for c, ps in pos.items():
            M = L['marks'].get(c)
            if not M or M['kind'] != 'prop': continue
            left = set(ps)
            while left:
                st = [left.pop()]; comp = []
                while st:
                    p = st.pop(); comp.append([p[0], y + p[1]])
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        q = (p[0] + dx, p[1] + dy)
                        if q in left: left.remove(q); st.append(q)
                props.append({'name': M['name'], 'cells': comp})
        for a, b, d in L['sights']:
            if a in pos and b in pos: sights.append({'a': [pos[a][0][0], y + pos[a][0][1]], 'b': [pos[b][0][0], y + pos[b][0][1]], 'text': d, 'level': L['name']})
            else: errs.append('%s: @sight %s %s — 표시를 찾을 수 없음' % (L['file'], a, b))
        notes += [(L['name'], n) for n in L['notes']]
        for r in G:
            kind = lambda c: L['marks'].get(c, {}).get('kind')
            rows.append(''.join('#' if (c in BLOCK or kind(c) in ('secret', 'prop')) else '.' for c in r))
            terrain.append(''.join(c if c in TERRAIN else '*' if kind(c) == 'prop' else '.' for c in r))
        y += H
        if L is not LV[-1]:
            for _ in range(gap): rows.append('#' * W); terrain.append('#' * W)
            y += gap
    links = []
    for name, es in ends.items():
        if len(es) != 2: errs.append('연결 %s: 끝이 %d개(두 개여야 함)' % (name, len(es))); continue
        L_ = {'a': list(es[0][0]), 'b': list(es[1][0]), 'name': name}
        kv = {**es[0][1], **es[1][1]}
        if kv.get('off'): L_['off'] = kv['off']
        if kv.get('on'): L_['on'] = kv['on']
        links.append(L_)
    tide_cells = [[x, yy] for i in tide_rooms for yy in range(areas[i]['y0'], areas[i]['y1'] + 1) for x in range(areas[i]['x0'], areas[i]['x1'] + 1) if rows[yy][x] != '#']
    for L_ in links:
        for p in (L_['a'], L_['b']):
            if rows[p[1]][p[0]] == '#': errs.append('연결 %s의 끝 %s가 막힌 칸' % (L_['name'], p))
    if errs: raise SystemExit('지도 오류:\n  ' + '\n  '.join(errs))
    MAP = {'width': W, 'height': len(rows), 'rows': rows, 'terrain': terrain, 'seeThrough': SEE_THROUGH, 'areas': areas, 'landmarks': landmarks,
           'props': [], 'floors': [], 'decor': [], 'links': links, 'secrets': secrets, 'levels': levels, 'guards': guards}
    if tide_cells: MAP['tide'] = {'cells': tide_cells, 'low': tides}
    # 낮은 가구(소파·탁자·침대…)는 시야를 막지 않는다(엔진 map.props의 low). 키 큰 것만 막는다.
    TALL = {'bookshelf', 'wardrobe', 'shelf', 'hedge', 'lockers', 'panel'}
    MAP['props'] = [{'x': c[0], 'y': c[1], 'w': 1, 'h': 1, 'low': True, 't': p['name']} for p in props if p['name'] not in TALL for c in p['cells']]
    TALL_LM = {'wine_rack', 'linen_shelf', 'lockers', 'water_tank', 'antenna', 'generator', 'stove', 'front', 'case'}   # 조사 지점 몸체 중 시야를 막는 것
    MAP['props'] += [{'x': c[0], 'y': c[1], 'w': 1, 'h': 1, 'low': True, 't': l['id']} for l in landmarks if l['id'] not in TALL_LM for c in l['hit']]
    return MAP, {'sights': sights, 'notes': notes, 'levels': LV, 'props': props}
