"""1장 호텔 레브리 지도 생성기 — 방 사각형·문·계단·숨은 공간 정의에서 world_ch1.json의 map을 만든다.

사용: python3 tools/build_ch1_map.py   (src/world.json을 바탕으로 src/world_ch1.json 생성)
- 층 5장(외부·1층·2층·옥상·지하)을 한 격자에 세로로 쌓는다. 층 사이는 벽으로 막히고 계단(map.links)으로만 이어진다.
- 방(areas): 이름·사각형. 문: 방 사이 벽에 뚫는 칸. 가구: 막힌 칸('#') + 조사 지점(landmarks).
- 숨은 공간(map.secrets): 벽 칸 하나 + 그 뒤 빈칸. 정해진 칸(from)에서 그 벽 쪽으로 한 번 더 이동하면 열린다.
- map.levels: 층 이름과 범위(팔찌 위치 조회의 층 축약 지도용).
"""
import json, os, copy

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
W_, H_ = 46, 108
grid = [['#'] * W_ for _ in range(H_)]
areas, landmarks, links, secrets, levels, doors = [], [], [], [], [], []

def room(name, x0, y0, x1, y1, color=None):
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1): grid[y][x] = '.'
    a = {'name': name, 'x0': x0, 'y0': y0, 'x1': x1, 'y1': y1}
    if color: a['color'] = color
    areas.append(a); return a

def door(x, y): grid[y][x] = '.'; doors.append((x, y))
def block(x0, y0, x1, y1):
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1): grid[y][x] = '#'
def lm(id_, name, x, y, icon, hit=()):
    for hx, hy in hit: grid[hy][hx] = '#'
    landmarks.append({'id': id_, 'name': name, 'x': x, 'y': y, 'icon': icon, 'hit': [list(h) for h in hit]})
def level(name, x0, y0, x1, y1): levels.append({'name': name, 'x0': x0, 'y0': y0, 'x1': x1, 'y1': y1})
def link(a, b, name): links.append({'a': list(a), 'b': list(b), 'name': name})

# ── 외부(섬) y 0~27 ────────────────────────────────────────────
O = 0
level('외부', 0, O, 39, O + 27)
room('정원', 1, O + 1, 12, O + 11, '#2d3a30')
room('앞마당', 14, O + 1, 25, O + 8, '#3a3a34')
room('수영장', 27, O + 1, 38, O + 11, '#24414f')
room('외벽 산책로', 14, O + 10, 25, O + 11, '#33302a')
room('탈의실', 27, O + 13, 33, O + 17, '#2c3550')
room('해변', 1, O + 13, 25, O + 20, '#4a4330')
room('선착장', 14, O + 22, 18, O + 26, '#3b3226')
room('바위 해안', 27, O + 19, 38, O + 26, '#2e3236')
# 전망 바위(옛 전망대 터): 오르는 길은 이끼 비탈 하나. 남쪽은 거의 수직인 바위벽(원래 밧줄 사다리), 그 아래 바위틈.
room('전망 바위', 35, O + 13, 38, O + 16, '#3a3e3a')
room('이끼 비탈', 37, O + 17, 38, O + 18, '#2f4a2f')
door(13, O + 10); door(13, O + 11); door(26, O + 10); door(26, O + 11)          # 정원·수영장 ↔ 산책로
door(19, O + 9); door(20, O + 9)                                              # 앞마당 ↔ 산책로
door(10, O + 12); door(20, O + 12)                                            # 정원·산책로 ↔ 해변
door(30, O + 12); door(16, O + 21)                                            # 수영장 ↔ 탈의실, 해변 ↔ 선착장
door(26, O + 19); door(26, O + 20)                                            # 해변 ↔ 바위 해안
lm('fountain', '분수', 6, O + 7, '⛲', [(5, O + 5), (6, O + 5), (7, O + 5), (5, O + 6), (6, O + 6), (7, O + 6)])
lm('pool', '수영장', 32, O + 8, '≈', [(x, y) for x in range(29, 37) for y in range(O + 3, O + 7)])
lm('diving', '다이빙대', 37, O + 3, '⇡', [(38, O + 2)])
lm('lockers', '사물함', 32, O + 14, '▤', [(32, O + 13), (33, O + 13)])
lm('dock_end', '선착장 끝', 16, O + 25, '⚓')
lm('tide_sign', '물때 표지판', 30, O + 21, '⚑', [(30, O + 20)])
lm('view_site', '옛 전망대 터', 36, O + 14, '⌖', [(35, O + 13)])
lm('rock_edge', '바위 끝(아래가 내려다보임)', 36, O + 16, '⤓')
lm('moss_slope', '이끼 비탈', 37, O + 18, '≋')
lm('rope_spot', '밧줄 사다리를 걸던 자리', 36, O + 19, '⫶')
lm('crevice', '바위벽 아래 바위틈', 35, O + 19, '◣')
ENTRANCE_OUT = (19, O + 1)                                                    # 호텔 정문(밖)

# ── 1층 y 30~51 ────────────────────────────────────────────────
F1 = 30
level('1층', 0, F1, 39, F1 + 21)
room('화장실', 1, F1 + 1, 6, F1 + 8, '#2b3540')
room('지배인실', 8, F1 + 1, 13, F1 + 8, '#2a2430')
room('계단홀', 15, F1 + 1, 25, F1 + 8, '#2f2c3a')
room('주방', 27, F1 + 1, 38, F1 + 8, '#33362e')
room('1층 복도', 1, F1 + 10, 38, F1 + 11, '#2a2a33')
room('라운지 바', 1, F1 + 13, 12, F1 + 20, '#25344a')
room('로비', 14, F1 + 13, 25, F1 + 20, '#3a3026')
room('연회장', 27, F1 + 13, 38, F1 + 20, '#3a2a2a')
door(3, F1 + 9); door(20, F1 + 9); door(32, F1 + 9)                           # 화장실·계단홀·주방 ↔ 복도 (지배인실 문은 잠김)
door(6, F1 + 12); door(19, F1 + 12); door(20, F1 + 12); door(32, F1 + 12)    # 복도 ↔ 라운지·로비·연회장
door(13, F1 + 16); door(26, F1 + 16)                                          # 로비 ↔ 라운지·연회장
lm('office_door', '지배인실 문(잠김)', 10, F1 + 10, '🔒', [(10, F1 + 9)])
lm('case', '진열장', 16, F1 + 14, '▣', [(15, F1 + 13), (16, F1 + 13), (17, F1 + 13)])
lm('front', '프런트', 23, F1 + 16, '☎', [(24, F1 + 15), (24, F1 + 16), (24, F1 + 17)])
lm('piano', '그랜드 피아노', 3, F1 + 16, '♪', [(2, F1 + 14), (3, F1 + 14), (4, F1 + 14), (2, F1 + 15), (3, F1 + 15), (4, F1 + 15)])
lm('bar', '바 카운터', 10, F1 + 16, '🍸', [(11, F1 + 14), (11, F1 + 15), (11, F1 + 16), (11, F1 + 17)])
lm('table', '연회 테이블', 32, F1 + 18, '🍽', [(x, F1 + 16) for x in range(29, 37)])
lm('stove', '조리대', 32, F1 + 3, '🔥', [(x, F1 + 2) for x in range(29, 36)])
lm('eaves_view', '창밖 처마', 15, F1 + 19, '⌂')                                 # 숨김 장소 가(외벽 처마 위)가 보이는 창
ENTRANCE_IN = (19, F1 + 20)
link(ENTRANCE_IN, ENTRANCE_OUT, '정문')
ST1_UP, ST1_DN = (16, F1 + 2), (24, F1 + 2)

# ── 2층 객실층 y 54~70 ─────────────────────────────────────────
F2 = 54
level('2층', 0, F2, 45, F2 + 16)
room('2층 복도', 1, F2 + 7, 44, F2 + 9, '#2a2a33')
xs = [1, 7, 13, 19, 25, 31]
for i, x in enumerate(xs):
    room('객실 %d' % (201 + i), x, F2 + 1, x + 4, F2 + 5, '#2c3550'); door(x + 2, F2 + 6)
    room('객실 %d' % (207 + i), x, F2 + 11, x + 4, F2 + 15, '#2c3550'); door(x + 2, F2 + 10)
room('리넨실', 37, F2 + 1, 43, F2 + 5, '#353028'); door(40, F2 + 6)
room('휴게 코너', 37, F2 + 11, 43, F2 + 15, '#2f3a33'); door(40, F2 + 10)
lm('linen_shelf', '리넨 선반', 42, F2 + 2, '▥', [(42, F2 + 1), (43, F2 + 1)])
lm('roof_door', '옥상 문(잠김)', 44, F2 + 8, '🔒')
ST2 = (1, F2 + 8)
link(ST1_UP, ST2, '계단(1층↔2층)')
# 숨은 공간 라: 리넨실 오른쪽 아래 구석(43, F2+5)에서 오른쪽 벽(44)으로 한 번 더 → 틈(45)
grid[F2 + 5][45] = '.'
secrets.append({'id': 'linen_gap', 'x': 44, 'y': F2 + 5, 'from': [43, F2 + 5], 'flag': 'secret_linen', 'text': '선반 뒤 벽에 틈이 있다. 몸을 비틀면 들어갈 수 있을 것 같다.'})
lm('linen_nook', '선반 뒤 틈', 45, F2 + 5, '·')

# ── 옥상 y 73~84 (잠김: 계단 연결 없음) ─────────────────────────
R = 73
level('옥상', 0, R, 19, R + 11)
room('옥상', 1, R + 1, 18, R + 10, '#3a3f45')
lm('water_tank', '물탱크', 9, R + 7, '◉', [(x, y) for x in range(7, 12) for y in range(R + 3, R + 6)])
lm('antenna', '안테나', 15, R + 3, 'ψ', [(16, R + 2)])

# ── 지하 y 87~105 ──────────────────────────────────────────────
B = 87
level('지하', 0, B, 39, B + 18)
room('식료품 창고', 1, B + 1, 12, B + 6, '#2e2a24')
room('기관실', 14, B + 1, 25, B + 6, '#2a2e2e')
room('와인 저장고', 27, B + 1, 38, B + 6, '#2e2428')
room('지하 복도', 1, B + 8, 38, B + 9, '#24242c')
room('재판장 앞', 1, B + 11, 24, B + 16, '#26222e')
room('재판장', 27, B + 11, 38, B + 16, '#1e1a26')
door(6, B + 7); door(19, B + 7); door(32, B + 7); door(12, B + 10)
lm('generator', '발전기', 19, B + 4, '⚡', [(18, B + 2), (19, B + 2), (20, B + 2)])
lm('wine_rack', '와인 선반', 30, B + 3, '🍷', [(x, B + 1) for x in range(28, 34)])
lm('court_door', '재판장 문', 24, B + 12, '⚖')
grid[B + 13][25] = '.'; grid[B + 13][26] = '.'                                   # 문 칸은 열려 있되, 공지 전에는 지배인이 막는다(map.guards)
GUARDS = [{'id': 'court', 'cells': [[25, B + 13], [26, B + 13]], 'stand': [25, B + 13], 'area': '재판장 앞', 'open': 'court_open',
           'warn': ['court_warn1', 'court_warn2'], 'over': 'court_over', 'who': '지배인',
           'lines': ['손님, 그 문은 아직 열리지 않았습니다. 때가 되면 제가 직접 안내해 드리겠습니다.',
                     '다시 한번 말씀드리겠습니다. 그 문을 넘으시는 것은 규칙 위반입니다. 세 번째는 없습니다.',
                     '……유감입니다, 손님. 규칙은 규칙이니까요.']}]
ST_B = (1, B + 8)
link(ST1_DN, ST_B, '계단(1층↔지하)')
# 숨은 공간 마: 와인 저장고 오른쪽 위 구석(38, B+1)에서 위 벽(B+0)으로 → 틈(B-1)… 위는 층 경계라 오른쪽으로
grid[B + 1][40] = '.'
secrets.append({'id': 'wine_gap', 'x': 39, 'y': B + 1, 'from': [38, B + 1], 'flag': 'secret_wine', 'text': '선반 끝 벽돌 하나가 헐겁다. 그 뒤로 좁은 틈이 있다.'})
lm('wine_nook', '벽돌 뒤 틈', 40, B + 1, '·')

# 검사: 문이 가구로 막히지 않았는지(문 칸의 상하 또는 좌우 양쪽이 지나갈 수 있어야 함)
for x, y in doors:
    ok = (grid[y-1][x] != '#' and grid[y+1][x] != '#') or (grid[y][x-1] != '#' and grid[y][x+1] != '#')
    assert ok, ('막힌 문', x, y)
# 검사: 계단·숨은 공간 칸
for L in links:
    for p in (L['a'], L['b']): assert grid[p[1]][p[0]] != '#', L
for q in secrets: assert grid[q['y']][q['x']] == '#' and grid[q['from'][1]][q['from'][0]] != '#', q

rows = [''.join(r) for r in grid]
MAP = {'id': 'hotel_reverie_ch1', 'width': W_, 'height': H_, 'rows': rows, 'tileSeconds': 4, 'areas': areas,
       'landmarks': landmarks, 'props': [], 'floors': [], 'decor': [], 'links': links, 'secrets': secrets, 'levels': levels, 'guards': GUARDS}

if __name__ == '__main__':
    base = json.load(open(os.path.join(ROOT, 'src', 'world.json'), encoding='utf-8'))
    w = copy.deepcopy(base)
    w.update({'kind': 'troemerei-ch1', 'title': '몽환의 트로이메라이 1장 (뼈대)', 'chapter': 1, 'startTime': '18:00', 'map': MAP,
              'notes': '1장 뼈대: 지도·계단·숨은 공간만. 사건·일정·재판 데이터는 비어 있음.',
              'facts': [], 'events': {}, 'markers': [], 'items': [], 'notices': [], 'slots': [], 'branches': [], 'scenes': [],
              'trials': [], 'cases': [], 'debugTalk': [], 'onComplete': [], 'debugFlags': ['secret_linen', 'secret_wine', 'court_open', 'court_warn1', 'court_warn2', 'court_over'],
              'device': {'cellSeconds': 43200, 'cells': 8, 'graceSeconds': 60, 'cost': {'photo': 300, 'callMin': 600, 'locate': 10800}}})
    w['flagNames'] = sorted(set((base.get('flagNames') or []) + ['secret_linen', 'secret_wine', 'court_open', 'court_warn1', 'court_warn2', 'court_over']))
    def center(name):
        a = next(a for a in areas if a['name'] == name); return [(a['x0'] + a['x1']) // 2, (a['y0'] + a['y1']) // 2 + 1]
    w['player'] = dict(base['player'], x=21, y=F1 + 18)
    # 남성 5명(본편 정본). 일정은 3단계에서 채운다.
    MEN = [('varun', '바룬 가스파르', ['바룬', '가스파르'], '바', '#c0392b', '#9a9a9a', '#b8302a', '인도계 모리셔스 · 34 · 라이프가드 — 말수가 적고 수칙을 지킨다', '거기 지나간다. 비켜.'),
           ('justin', '저스틴 트루먼', ['저스틴', '트루먼'], '저', '#d9532c', '#c8442a', '#7a1f2a', '미국 · 22 · 쿼터백 — 별명을 붙이고 작전판처럼 본다', '헤이, 길 좀 터 줄래?'),
           ('freddie', '프레디 데이비스', ['프레디', '데이비스'], '프', '#c9c9d4', '#d8d8e0', '#2a3450', '영국 · 28 · 성우 — 조용히 빈정거린다', '……거기 서 있으면 방해되는데.'),
           ('killian', '킬리언 하퍼', ['킬리언', '하퍼'], '킬', '#2d4fa8', '#2a4fb0', '#6a6a50', '아일랜드 · 32 · 베이시스트 — 대화를 정리하고 중재한다', '잠깐 지나가도 될까요?'),
           ('karim', '카림 아타르', ['카림', '아타르'], '카', '#1f6f6a', '#22222a', '#1f5a5a', '레바논 · 25 · 셰프 — 붙임성 좋고 음식으로 사람을 모은다', '어이, 잠깐만 비켜 줘. 뜨거운 거 지나간다.')]
    tpl = base['npcs'][0]
    for id_, nm, call, sym, col, hair, cloth, prof, line in MEN:
        n = copy.deepcopy(tpl); n.update({'id': id_, 'name': nm, 'call': call, 'symbol': sym, 'color': col, 'hair': hair, 'cloth': cloth, 'sex': 'm',
                  'profile': prof, 'rel': {'trust': 50, 'affection': 50}, 'block': [[{'text': line, 'face': '기본'}]]})
        n.pop('alias', None); n['look'] = dict(n.get('look') or {}, g=0)
        w['npcs'].append(n)
    spots = {'suzune': '정원', 'mei': '로비', 'ruoxi': '라운지 바', 'seoha': '2층 복도', 'clara': '라운지 바', 'odile': '연회장',
             'varun': '수영장', 'justin': '로비', 'freddie': '라운지 바', 'killian': '연회장', 'karim': '주방'}
    used = set()
    for n in w['npcs']:
        x, y = center(spots.get(n['id'], '로비'))
        while (x, y) in used or rows[y][x] == '#' or (x, y) == (w['player']['x'], w['player']['y']): x += 1
        used.add((x, y)); n.update({'x': x, 'y': y, 'agenda': [], 'notes': [], 'knows': []})
        if n['id'] == 'mei': n['short'] = '메이'   # 정체를 밝힌 뒤 이름표
    # 시험용 재판 틀(X1): 체험판 재판 T1을 가져와 쓴다. 구절 짝짓기는 빼고, 동선은 1장 지도 좌표로, 반론은 개편 흐름(연설 → 입력)으로.
    # 1장 재판 대본이 정해지면 이 X1을 바꿔 끼운다. 체험판 데이터(world.json)는 건드리지 않는다.
    T = copy.deepcopy(base['trials'][0]); T.update({'code': 'X1', 'id': 'trial_x1', 'title': '(시험용) 재판 틀 — 체험판 대본 차용', 'flag': 'x1_done'})
    T['phases'] = [ph for ph in T['phases'] if ph['type'] != 'combine']
    for ph in T['phases']:
        if ph['type'] == 'route': ph.update({'start': [3, F1 + 16], 'end': [16, F1 + 14], 'via': [[13, F1 + 16]]})
        if ph['type'] == 'rebut':
            ph.update({'event': 'X1_R1', 'holdEvent': 'X1_R1H', 'title': '반론', 'guide': '반론자의 말에서 빈틈을 찾아 증거를 쏜다 — 맞히면 내 말로 반론한다',
                       'lines': [{'who': 'mei', 'text': '{마술사라면} {바에 있는 척하면서} 진열장까지 다녀올 수 있어요.', 'face': '격노', 'pose': 'point'},
                                 {'who': 'mei', 'text': '{손재주가 좋으니} {브로치쯤은 눈 깜짝할 새}랍니다.', 'face': '의심'},
                                 {'who': 'mei', 'text': '{바 장부에 이름이 있다고 해도} {그것부터 속임수}일지 모르죠!', 'face': '하라구로'}],
                       'answers': [{'at': [0, 1], 'ev': ['bar_log']}],
                       'miss': next(p2['miss'] for p2 in T['phases'] if p2['type'] == 'nonstop')})
    ri = next(i for i, ph in enumerate(T['phases']) if ph['type'] == 'rebut')
    w['trials'] = [T]
    w['events'] = {'X1_R1': {'kinds': ['R'], 'npcs': ['mei'], 'trial': 'X1', 'phase': ri}, 'X1_R1H': {'kinds': ['R'], 'npcs': ['mei'], 'trial': 'X1', 'phase': ri, 'hold': True}}
    w['items'] = [dict(it, at=None) for it in base['items'] if it['id'] in T['evidence']]
    w['flagNames'] = sorted(set(w['flagNames'] + ['x1_done']))
    json.dump(w, open(os.path.join(ROOT, 'src', 'world_ch1.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('world_ch1.json:', W_, 'x', H_, '방', len(areas), '조사 지점', len(landmarks), '계단', len(links), '숨은 공간', len(secrets))
