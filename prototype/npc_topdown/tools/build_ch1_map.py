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
              'notes': '1장 뼈대: 지도·기본 루트 일정(tools/ch1_schedule.py)·임시 사건 대본. 재판은 시험용 X1.',
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
    # 꿈 조각 문장형 시험(1장 사본만): 칸·조사로 문장을 만든다. 체험판 대본 이야기는 그대로.
    di = next(i for i, ph in enumerate(T['phases']) if ph['type'] == 'dream')
    T['phases'][di].update({'form': 'sentence', 'guide': '왼쪽 탭으로 전/후를 바꾸고, 점선 칸을 눌러 문장을 완성한다',
        'acts': ['꺼냈다', '쥐었다', '건넸다', '숨겼다', '벗었다', '내려놓았다', '남았다', '달려갔다'], 'times': ['19:46', '19:52', '19:53', '19:55', '19:58'],
        'rounds': [
            {'cap': '휴식 시간 · 라운지', 'a': {'bg': '라운지', 'who': 'clara', 'time': '19:52', 'at': '진열장', 'obj': 'brooch', 'act': '꺼냈다'},
             'b': {'bg': '라운지', 'who': 'clara', 'time': '19:53', 'obj': 'brooch', 'at': '손', 'act': '쥐었다'},
             'ask': [['a', 'who'], ['a', 'time'], ['b', 'act']]},
            {'cap': '19:55 · 라운지', 'a': {'bg': '라운지', 'who': 'clara', 'time': '19:55', 'obj': 'glove', 'at': '손', 'act': '벗었다'},
             'b': {'bg': '라운지', 'who': '', 'obj': 'glove', 'at': '피아노 의자', 'act': '남았다'},
             'sa': [['who', '가'], ['time', '에'], ['obj', '을'], ['act', '']], 'sb': [['obj', '가'], ['at', '에'], ['act', '']],
             'ask': [['a', 'obj'], ['b', 'at']]}]})
    # 1장 팔찌 반론 초안(2026-11-28): 해제 감지 시각 ≠ 집행. 반론자 메이벨(가정). 정답 = 셋째 문단 + 저스틴의 팔찌 기록.
    T['phases'][ri + 1:ri + 1] = [
        {'type': 'rebut', 'npc': 'mei', 'event': 'X1_R2', 'holdEvent': 'X1_R2H', 'title': '반론 · 팔찌가 알려 준 시각',
         'guide': '메이벨이 기록에서 읽은 사실과, 규칙을 보고 짐작한 일을 짚어 보자',
         'goal': "'팔찌 해제'와 '실제 처형 집행'은 별개라는 뜻이면 통과. 특정 시각·사인·바룬의 이름은 요구하지 않는다. '십 분 뒤잖아'처럼 계산만 말하면 부족.",
         'lines': [{'who': 'mei', 'text': '{팔찌가 풀린 시각은} {여섯 시 사십 분}. 이건 우리 모두 같은 기록을 보고 있지요?', 'face': '기본'},
                   {'who': 'mei', 'text': '{다시 차지 않으면} {십 분 뒤에 처형}이에요. {지배인이 우리에게 직접 읽어 준 규칙}이잖아요.', 'face': '진지'},
                   {'who': 'mei', 'text': '그러니 {저스틴이 여섯 시 오십 분에 처형됐다는 것까지}, {이 기록으로 확인된 셈}이에요.', 'face': '의심'}],
         'answers': [{'at': [2, 0], 'ev': ['band_log']}, {'at': [2, 1], 'ev': ['band_log']}],
         'miss': {'mei': {'text': '어느 대목이 그 증거와 어긋난다는 거죠?', 'face': '의심'}},
         'mono': ['같은 기록을 읽었는데, 메이벨은 거기서 어디까지 알아냈다는 거지?', '기록에 적힌 것과, 메이벨이 덧붙인 것. 그 경계가 어디지?', '……세 문장 중 하나는 기록이 아니라 짐작이야.'],
         'monoRb': ['시각 계산에는 이견이 없어. 확인해야 하는 건 그 시각에 무슨 일이 있었느냐야.', '기한을 안다고 해서, 그 기한에 무슨 일이 일어났는지까지 아는 건 아니야.', '팔찌가 알려 준 건 하나뿐이야. 나머지는 누구에게 물어야 하지?']},
        {'type': 'talk', 'lines': [{'who': 'me', 'text': '지배인. 열여덟 시 오십 분에, 저스틴에 대한 해제 벌칙을 집행했어?'},
                                   {'who': 'host', 'text': '집행하지 않았습니다.', 'fx': 'flash'}]}]
    w['trials'] = [T]
    w['events'] = {'X1_R1': {'kinds': ['R'], 'npcs': ['mei'], 'trial': 'X1', 'phase': ri}, 'X1_R1H': {'kinds': ['R'], 'npcs': ['mei'], 'trial': 'X1', 'phase': ri, 'hold': True}}
    w['events'].update({'X1_R2': {'kinds': ['R'], 'npcs': ['mei'], 'trial': 'X1', 'phase': ri + 1}, 'X1_R2H': {'kinds': ['R'], 'npcs': ['mei'], 'trial': 'X1', 'phase': ri + 1, 'hold': True}})
    T['evidence'] = T['evidence'] + ['band_log']
    w['items'] = [dict(it, at=None) for it in base['items'] if it['id'] in T['evidence']]
    w['items'].append({'id': 'band_log', 'name': '저스틴의 팔찌 기록', 'at': None, 'from': '2일 19:30', 'desc': '06:00 전지 교체 · 18:00 전지 교체 · 18:40 해제 감지 (그 뒤 기록 없음)'})
    w['flagNames'] = sorted(set(w['flagNames'] + ['x1_done']))
    # 기본 루트 일정·공지·물건·사건(시간표 v2.1)
    w['notices'] = SCH.NOTICES
    w['items'] += SCH.ITEMS
    w['cases'] = [SCH.CASE]
    w['trials'] = [SCH.CASE_TRIAL] + w['trials']
    for ev in w['events'].values(): ev['trial'] = 'X1'
    fl = ['spares_taken', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'spares_hidden', 'suzune_told', 'j_top', 'j_checked', 'justin_fell', 'band_thrown', 'justin_dead']
    w['flagNames'] = sorted(set(w['flagNames'] + fl)); w['debugFlags'] = w['debugFlags'] + fl
    json.dump(w, open(os.path.join(ROOT, 'src', 'world_ch1.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('world_ch1.json:', W_, 'x', H_, '방', len(areas), '조사 지점', len(landmarks), '계단', len(links), '숨은 공간', len(secrets))
