"""1장 호텔 레브리 지도 생성기 — maps/ch1/*.txt(글자 지도)를 읽어 src/world_ch1.json을 만든다.

사용: python3 tools/build_ch1_map.py   (src/world.json을 바탕으로 src/world_ch1.json 생성)
지도 고치기: maps/ch1/의 층 파일만 고치면 된다(형식은 maps/README.md). 미리보기: python3 tools/render_map_preview.py
"""
import json, os, copy, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import textmap, ch1_schedule as SCH

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
MAP, META = textmap.build(os.path.join(ROOT, 'maps', 'ch1'))
MAP['id'] = 'hotel_reverie_ch1'; MAP['tileSeconds'] = 4
W_, H_ = MAP['width'], MAP['height']
areas, landmarks, links, secrets, rows = MAP['areas'], MAP['landmarks'], MAP['links'], MAP['secrets'], MAP['rows']
LV = {l['name']: l for l in MAP['levels']}
F1 = LV['1층']['y0']
GUARDS = MAP['guards']

if __name__ == '__main__':
    base = json.load(open(os.path.join(ROOT, 'src', 'world.json'), encoding='utf-8'))
    w = copy.deepcopy(base)
    w.update({'kind': 'troemerei-ch1', 'title': '몽환의 트로이메라이 1장 (뼈대)', 'chapter': 1, 'startTime': '18:00', 'map': MAP,
              'notes': '1장 뼈대: 지도·기본 루트 일정(tools/ch1_schedule.py)·임시 사건 대본. 재판은 1장 초안 K1(tools/ch1_trial.py).',
              'facts': [], 'events': {}, 'markers': [], 'items': [], 'notices': [], 'slots': [], 'branches': [], 'scenes': [],
              'trials': [], 'cases': [], 'debugTalk': [], 'onComplete': [], 'debugFlags': ['secret_linen', 'secret_wine', 'court_open', 'court_warn1', 'court_warn2', 'court_over', 'ladder_gone'],
              'device': {'cellSeconds': 43200, 'cells': 8, 'graceSeconds': 60, 'cost': {'photo': 300, 'callMin': 600, 'locate': 10800}}})
    w['flagNames'] = sorted(set((base.get('flagNames') or []) + ['secret_linen', 'secret_wine', 'court_open', 'court_warn1', 'court_warn2', 'court_over', 'ladder_gone']))
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
        used.add((x, y)); n.update({'x': x, 'y': y, 'agenda': SCH.agenda(n['id'], {l['id'] for l in landmarks}), 'notes': [], 'knows': []})
        if n['id'] in SCH.AVOID: n['avoid'] = SCH.AVOID[n['id']]
        if n['id'] == 'justin': n['band'] = {'flag': 'band_thrown', 'at': 'shore_ledge'}   # 위치 조회는 팔찌 자리를 가리킨다
        if n['id'] == 'mei': n['short'] = '메이'   # 정체를 밝힌 뒤 이름표
    # 본편 1장 재판(초안) — tools/ch1_trial.py. 체험판 데이터(world.json)는 건드리지 않는다.
    import ch1_trial as TRI
    LM = {l['id']: (l['x'], l['y']) for l in landmarks}
    K = TRI.trial(LM)
    rb = [i for i, ph in enumerate(K['phases']) if ph['type'] == 'rebut']
    w['trials'] = [K]
    w['events'] = {}
    for i in rb:
        ph = K['phases'][i]
        w['events'][ph['event']] = {'kinds': ['R'], 'npcs': [ph['npc']], 'trial': 'K1', 'phase': i}
        w['events'][ph['holdEvent']] = {'kinds': ['R'], 'npcs': [ph['npc']], 'trial': 'K1', 'phase': i, 'hold': True}
    w['flagNames'] = sorted(set(w['flagNames'] + ['k1_done']))
    w['items'] = [{'id': 'band_log', 'name': '저스틴의 팔찌 기록', 'at': None, 'desc': '06:00 전지 교체 · 18:00 전지 교체 · 18:40 해제 감지 (그 뒤 기록 없음)'}] + TRI.ITEMS
    # 기본 루트 일정·공지·물건·사건(시간표 v2.1)
    w['notices'] = SCH.NOTICES
    w['items'] += SCH.ITEMS
    w['cases'] = [SCH.CASE]
    w['trials'] = [SCH.CASE_TRIAL] + w['trials']
    SCH.CASE_TRIAL['then'] = [{'code': 'K1'}]; SCH.CASE_TRIAL['phases'][1]['grant'] = TRI.GRANT
    fl = ['spares_taken', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'spares_hidden', 'suzune_told', 'j_top', 'j_checked', 'justin_fell', 'band_thrown', 'justin_dead']
    w['flagNames'] = sorted(set(w['flagNames'] + fl)); w['debugFlags'] = w['debugFlags'] + fl
    json.dump(w, open(os.path.join(ROOT, 'src', 'world_ch1.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('world_ch1.json:', W_, 'x', H_, '방', len(areas), '조사 지점', len(landmarks), '계단', len(links), '숨은 공간', len(secrets))
