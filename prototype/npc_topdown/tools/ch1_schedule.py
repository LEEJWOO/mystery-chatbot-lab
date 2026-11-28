"""1장 기본 루트 일정(시간표 v2.1 기준) — build_ch1_map.py가 읽는다.

한 줄 = (날, 시작, 끝, 어디, 분, 우선순위, 옵션)
- 어디: 조사 지점 아이디(fountain…) / 방 이름('객실 202') / '@인물'(그 사람을 찾아가 이야기)
- 분: 머무는 시간. 우선순위가 높은 일이 먼저. 옵션: once, flag=…(끝나면 켬), warp=…(끝나면 그 자리로 옮김: 맨손 등반·추락), spot=n(방 안 n번째 칸), unless=…/if=…
- 일정이 겹치면 우선순위가 높은 것만 고른다. 같은 우선순위끼리는 무작위(씨앗 고정).
대사·심리는 여기 없다(로어북). 화면에 보이는 이동만.
"""
ROOMS = {'suzune': '객실 202', 'mei': '객실 203', 'ruoxi': '객실 204', 'seoha': '객실 205', 'clara': '객실 206', 'odile': '객실 207',
         'varun': '객실 208', 'justin': '객실 209', 'freddie': '객실 210', 'killian': '객실 211', 'karim': '객실 212'}
# 조별 낮 시간 머무는 곳(번갈아 감)
HANG = {'varun': ['수영장', '해변'], 'suzune': ['수영장', '해변'], 'karim': ['주방', '라운지 바'], 'clara': ['라운지 바', '로비'],
        'killian': ['라운지 바', '로비'], 'odile': ['로비', '앞마당'], 'mei': ['정원', '로비'], 'freddie': ['정원', '휴게 코너'],
        'ruoxi': ['휴게 코너', '1층 복도'], 'seoha': ['1층 복도', '휴게 코너'], 'justin': ['로비', '앞마당']}
SPOT = {k: i for i, k in enumerate(ROOMS)}
AVOID = {'justin': ['이끼 비탈']}   # 저스틴은 비탈에 자국을 남기지 않으려고 비탈을 피한다   # 같은 방에 모일 때 서로 다른 칸


def common(id_):
    r, s = ROOMS[id_], SPOT[id_]
    rows = [(1, '18:00', '18:30', '로비', 20, 30, {'spot': s}),
            (1, '18:30', '19:00', '연회장', 30, 50, {'spot': s, 'once': 1}),      # 규칙 공지
            (1, '19:00', '20:30', '연회장', 30, 50, {'spot': s}),                 # 저녁
            (1, '22:00', '23:59', r, 30, 40, {}),                                   # 잠(짧게 끊어 두어야 밤일이 끼어들 수 있음)
            (2, '00:00', '07:00', r, 30, 40, {}),
            (2, '07:00', '08:00', '연회장', 30, 50, {'spot': s}),                 # 아침
            (2, '12:00', '12:40', '연회장', 30, 45, {'spot': s, 'skip': ('varun', 'suzune')}),   # 점심(감시하는 둘은 거름)
            (2, '19:00', '19:30', '연회장', 30, 50, {'spot': s}),                 # 저녁(저스틴 불참)
            (2, '19:40', '20:10', '바위 해안', 15, 60, {'spot': s}),              # 팔찌 발견 뒤 수색
            (2, '22:30', '23:59', '재판장 앞', 30, 40, {'spot': s})]
    for d, a, b in ((1, '20:30', '22:00'), (2, '08:00', '19:00')):
        for k, h in enumerate(HANG[id_]): rows.append((d, a, b, h, 10, 20, {'spot': s + k}))   # 짧게 끊어야 정해진 일이 제때 끼어든다
    return rows


SPECIAL = {
    'justin': [   # 순서가 중요한 일은 앞 일이 켠 깃발(if)로 잇는다
        (1, '23:20', '23:59', 'case', 5, 90, {'once': 1, 'flag': 'spares_taken'}),                     # 진열장 예비 4개
        (2, '02:20', '04:00', 'diving', 5, 90, {'once': 1, 'if': 'spares_taken', 'flag': 'h1'}),      # 다이빙대 꼭대기
        (2, '02:20', '04:00', 'eaves', 5, 90, {'once': 1, 'if': 'h1', 'flag': 'h2'}),                 # 외벽 처마
        (2, '02:20', '04:00', 'linen_shelf', 5, 90, {'once': 1, 'if': 'h2', 'flag': 'h3'}),           # 리넨실 틈
        (2, '02:20', '04:00', 'wine_rack', 5, 90, {'once': 1, 'if': 'h3', 'flag': 'h4'}),             # 와인 저장고 틈
        (2, '02:20', '04:30', 'wall_foot', 3, 90, {'once': 1, 'if': 'h4', 'flag': 'h5'}),             # 썰물 · 갯바위
        (2, '02:20', '04:30', 'view_site', 5, 91, {'once': 1, 'if': 'h5', 'flag': 'spares_hidden'}),  # 사다리로 올라 전망 바위(자기 몫)
        (2, '02:20', '04:40', 'wall_foot', 3, 92, {'once': 1, 'if': 'spares_hidden', 'id': 'down1', 'flag': 'h6'}),  # 사다리로 내려옴(비탈 자국 없음)
        (2, '08:30', '08:55', '로비', 20, 80, {'once': 1, 'spot': 40, 'fact': 'tell_clara', 'with': ['clara']}),                                # 면담(보이는 거리, 한 명씩): 카림–클라라 → 외벽 처마
        (2, '08:55', '09:15', '로비', 18, 80, {'once': 1, 'spot': 40, 'id': 'iv2', 'fact': 'tell_killian', 'with': ['killian']}),                   # 킬리언–오딜 → 와인 저장고
        (2, '09:15', '09:40', '정원', 20, 80, {'once': 1, 'spot': 5, 'id': 'iv3', 'fact': 'tell_freddie', 'with': ['freddie']}),                    # 메이벨–프레디 → 리넨실
        (2, '09:40', '09:55', '로비', 13, 80, {'once': 1, 'spot': 40, 'id': 'iv4', 'flag': 'suzune_told', 'fact': 'tell_suzune', 'with': ['suzune']}),  # 바룬–스즈네 → 전망 바위
        (2, '10:05', '10:30', '휴게 코너', 20, 80, {'once': 1, 'spot': 5, 'id': 'iv5', 'fact': 'tell_seoha', 'with': ['seoha']}),               # 루오시–서하 → 다이빙대
        (2, '11:00', '11:20', 'eaves', 10, 70, {'once': 1, 'id': 'chk_eaves'}),                         # 1차 확인
        (2, '11:20', '12:00', 'diving', 10, 70, {'once': 1, 'id': 'chk_diving'}),
        (2, '13:30', '14:10', 'linen_shelf', 10, 70, {'once': 1, 'id': 'chk_linen'}),                   # 2차 확인
        (2, '14:10', '15:00', 'wine_rack', 10, 70, {'once': 1, 'id': 'chk_wine'}),
        (2, '15:30', '16:10', 'wall_foot', 15, 95, {'once': 1, 'id': 'climb', 'warp': 'view_site', 'flag': 'j_top'}),   # 사다리 없음 → 맨손으로 오름
        (2, '15:30', '16:30', 'view_site', 10, 96, {'once': 1, 'id': 'check_top', 'if': 'j_top', 'flag': 'j_checked'}),
        (2, '15:30', '16:40', 'rock_edge', 3, 97, {'once': 1, 'id': 'fall', 'if': 'j_checked', 'warp': 'crevice', 'flag': 'justin_fell'}),  # 내려오다 무릎 → 바위틈
        (2, '16:00', '18:40', 'crevice', 2, 98, {'if': 'justin_fell', 'id': 'stuck', 'cool': 0}),                    # 바위틈에서 발버둥(짧게 끊어 18:40에 맞춘다)
        (2, '18:40', '18:55', 'crevice', 1, 99, {'once': 1, 'id': 'throw', 'if': 'justin_fell', 'flag': 'band_thrown'}),   # 18:40 팔찌·전지를 바위 해안 쪽으로
        (2, '18:41', '19:10', 'crevice', 6, 99, {'once': 1, 'id': 'drown', 'if': 'band_thrown', 'flag': 'justin_dead'}),     # 18:47 무렵
        (2, '16:00', '23:59', 'crevice', 999, 100, {'if': 'justin_dead', 'id': 'body', 'cool': 0}),
        (3, '00:00', '23:59', 'crevice', 999, 100, {'if': 'justin_dead', 'id': 'body3'}),
    ],
    'varun': [
        (2, '09:40', '09:55', '로비', 13, 72, {'spot': 30}),                               # 스즈네 면담을 몇 걸음 떨어져 봄
        (2, '11:00', '12:40', 'slope_foot', 20, 70, {}),                                   # 전망 바위 둘레를 라이프가드 눈으로
        (2, '12:40', '13:10', 'rope_spot', 10, 85, {'once': 1, 'flag': 'ladder_gone', 'fact': 'varun_ladder'}),    # 12:50 사다리를 끌어 올려 걷음(비탈 자국)
        (2, '13:10', '19:00', 'bench', 350, 75, {'fact': 'varun_watch'}),                  # 벤치에서 비탈 입구 감시
        (2, '20:10', '20:40', 'rock_edge', 25, 70, {}),          # 20:10 비탈 입구 자국 확인 뒤 오름                                    # 수색 — 바위 끝에서 내려다봄(20:20 발견)
    ],
    'suzune': [
        (2, '09:40', '09:55', '로비', 13, 72, {'spot': 41}),
        (2, '09:55', '10:05', '해안 산책로', 8, 72, {'once': 1, 'spot': 2, 'fact': 'suzune_shared', 'with': ['varun']}),   # 걸으며 바룬에게 전함
        (2, '11:00', '12:40', '해안 산책로', 30, 70, {'spot': 2}),
        (2, '13:10', '19:00', 'bench', 350, 75, {'fact': 'suzune_sketch'}),                # 옆에서 비탈 쪽을 그림(시각 적음)
        (2, '20:10', '20:40', '전망 바위', 20, 70, {'spot': 3}),
    ],
    'killian': [(2, '08:55', '09:15', '로비', 24, 70, {'spot': 23}), (2, '20:10', '20:40', '전망 바위', 20, 65, {'spot': 1})],
    'clara': [(2, '08:30', '08:55', '로비', 26, 70, {'spot': 20})],
    'karim': [(2, '08:30', '08:55', '로비', 26, 70, {'spot': 21})],
    'odile': [(2, '08:55', '09:15', '로비', 24, 70, {'spot': 22})],
    'freddie': [(2, '09:15', '09:40', '정원', 26, 70, {'spot': 1}),
                (2, '16:00', '16:10', '정원', 6, 85, {'once': 1, 'spot': 1, 'fact': 'freddie_locate'})],   # 16:04 일찍 교체 · 16:05 저스틴 위치 조회
    'mei': [(2, '09:15', '09:40', '정원', 26, 70, {'spot': 2})],
    'seoha': [(2, '10:05', '10:30', '휴게 코너', 26, 70, {'spot': 1})],
    'ruoxi': [(2, '10:05', '10:30', '휴게 코너', 26, 70, {'spot': 2})],
}


def agenda(id_, landmark_ids):
    out = []
    for i, (d, a, b, where, mins, prio, o) in enumerate(common(id_) + SPECIAL.get(id_, [])):
        if id_ in o.get('skip', ()): continue
        t = {'id': o.get('id') or '%s_%d_%s' % (id_, d, a.replace(':', '')) + ('_%d' % i), 'kind': 'visit', 'day': d, 'from': a, 'until': b,
             'durationSeconds': mins * 60, 'priority': prio, 'weight': 1, 'interruptible': prio < 80}
        if where.startswith('@'): t.update({'kind': 'meet', 'targetNpc': where[1:]})
        elif where in landmark_ids: t['landmark'] = where
        else: t['area'] = where
        if 'spot' in o: t['spot'] = o['spot']
        if o.get('once'): t['once'] = True
        else: t['cooldownSeconds'] = o.get('cool', 60)
        if o.get('flag'): t['onCompleteFlag'] = o['flag']
        if o.get('warp'): t['onCompleteWarp'] = o['warp']
        if o.get('fact'): t['onCompleteFact'] = o['fact']
        if o.get('with'): t['factWith'] = o['with']
        if o.get('if'): t['ifFlag'] = o['if']
        if o.get('unless'): t['unlessFlag'] = o['unless']
        out.append(t)
    return out


NOTICES = [{'day': 1, 'time': '18:30', 'text': '연회장 집합 — 지배인의 규칙 공지', 'place': '연회장'},
           {'day': 1, 'time': '19:00', 'text': '저녁 식사', 'place': '연회장'},
           {'day': 2, 'time': '07:00', 'text': '아침 식사 · 진열장 예비 전지 4개가 사라진 것이 알려진다', 'place': '연회장'},
           {'day': 2, 'time': '08:30', 'text': '저스틴의 조별 면담(한 조씩)', 'place': '로비'},
           {'day': 2, 'time': '12:00', 'text': '점심', 'place': '연회장'},
           {'day': 2, 'time': '19:00', 'text': '저녁 식사', 'place': '연회장'},
           {'day': 2, 'time': '19:30', 'text': '바위 해안에서 저스틴의 팔찌와 전지가 발견됐다 — 수색', 'place': '바위 해안'}]

ITEMS = [{'id': 'justin_band', 'name': '저스틴의 팔찌와 전지 5개', 'at': 'shore_ledge', 'from': '2일 18:40', 'flag': 'band_thrown', 'desc': '물가 바위턱에 떨어져 있던 팔찌와, 끼운 것 1개를 포함한 전지 5개.'},
         {'id': 'spare_view', 'name': '전망 바위의 전지', 'at': 'view_site', 'from': '2일 03:20', 'flag': 'spares_hidden', 'desc': '옛 전망대 터 돌 틈에 끼워 둔 전지 1개.'},
         {'id': 'spare_linen', 'name': '리넨실 틈의 전지', 'at': 'linen_nook', 'from': '2일 03:00', 'flag': 'spares_taken', 'desc': '선반 뒤 틈에 숨겨 둔 전지 1개.'},
         {'id': 'spare_wine', 'name': '와인 저장고 틈의 전지', 'at': 'wine_nook', 'from': '2일 03:10', 'flag': 'spares_taken', 'desc': '헐거운 벽돌 뒤에 숨겨 둔 전지 1개.'}]

CASE = {'id': 'J1', 'flag': 'justin_dead', 'spot': 'rock_edge',   # 바위 끝에서 내려다볼 때 발견(바위틈은 다른 구역이라 보는 판정은 바위 끝 기준)
         'from': '20:20', 'watchers': ['varun', 'suzune', 'killian'], 'trial': 'J1', 'wait': 600,
        'notice': '전망 바위 끝에서 손전등으로 내려다보던 수색대가 바위틈의 저스틴을 발견했다.',
        'task': {'id': 'gather_J1', 'kind': 'visit', 'area': '전망 바위', 'durationSeconds': 1800, 'priority': 300, 'weight': 1, 'interruptible': False, 'once': True}}

CASE_TRIAL = {'id': 'case_j1', 'code': 'J1', 'kind': 'case', 'title': '(임시) 바위틈의 저스틴', 'stage': '전망 바위', 'hp': 5, 'evidence': [], 'issues': [], 'then': [{'code': 'X1'}],
              'phases': [{'type': 'talk', 'lines': [
                  {'who': 'host', 'text': '(임시 대본) 손님 여러분, 시신이 발견되었습니다. 지금부터 조사 시간입니다.', 'fx': 'flash'},
                  {'who': 'host', 'text': '(임시 대본) 23시에 지하 재판장을 열겠습니다.', 'speed': 0.8}]},
                  {'type': 'investigate', 'grant': [], 'declare': True, 'afterFound': 150},
                  {'type': 'talk', 'lines': [{'who': 'host', 'text': '(임시 대본) 시간이 되었습니다. 재판장으로 모여 주십시오.', 'fx': 'flash', 'speed': 0.8}]}]}


# 사실(누가 무엇을 겪었나/보았나) — 대화 AI에게 넘기는 인물의 기억. self = 직접 겪은 사람의 말, seen = 옆에서 본 사람, player = 플레이어가 보았을 때.
FACTS = [
    {'id': 'tell_clara', 'code': 'K1C1', 'self': {'clara': '2일 08:30 로비에서 저스틴이 "앞마당에서 올려다봐. 외벽 처마에 예비 전지가 있어. 내가 한 번 더 확인할 때까진 우리끼리만"이라고 했다'},
     'seen': '2일 08:30쯤 로비에서 클라라가 저스틴과 단둘이 이야기하는 걸 봤다(내용은 못 들음)', 'player': '로비에서 저스틴이 클라라와 단둘이 이야기했다'},
    {'id': 'tell_killian', 'code': 'K1C2', 'self': {'killian': '2일 08:55 로비에서 저스틴이 와인 저장고 헐거운 벽돌 뒤에 예비 전지가 있다고, 우리끼리만 알자고 했다'},
     'seen': '2일 08:55쯤 로비에서 킬리언이 저스틴과 단둘이 이야기하는 걸 봤다(내용은 못 들음)', 'player': '로비에서 저스틴이 킬리언과 단둘이 이야기했다'},
    {'id': 'tell_freddie', 'code': 'K1C3', 'self': {'freddie': '2일 09:15 정원에서 저스틴이 리넨실 선반 뒤 틈에 예비 전지가 있다고, "내가 한 번 더 확인할 때까진 우리끼리만"이라고 했다'},
     'seen': '2일 09:15쯤 정원에서 프레디가 저스틴과 단둘이 이야기하는 걸 봤다(내용은 못 들음)', 'player': '정원에서 저스틴이 프레디와 단둘이 이야기했다'},
    {'id': 'tell_suzune', 'code': 'K1C4', 'self': {'suzune': '2일 09:40 로비에서 저스틴이 "전망 바위 위에서 예비 전지를 봤다. 내가 한 번 더 확인할 때까진 우리끼리만"이라고 했다'},
     'seen': '2일 09:40쯤 로비에서 스즈네가 저스틴과 단둘이 이야기하는 걸 몇 걸음 떨어져 봤다(내용은 못 들음)', 'player': '로비에서 저스틴이 스즈네와 단둘이 이야기했다'},
    {'id': 'tell_seoha', 'code': 'K1C5', 'self': {'seoha': '2일 10:05 휴게 코너에서 저스틴이 다이빙대 꼭대기에 예비 전지가 있다고, 우리끼리만 알자고 했다'},
     'seen': '2일 10:05쯤 2층 휴게 코너에서 서하가 저스틴과 단둘이 이야기하는 걸 봤다(내용은 못 들음)', 'player': '2층 휴게 코너에서 저스틴이 서하와 단둘이 이야기했다'},
    {'id': 'suzune_shared', 'code': 'K1C6', 'self': {'suzune': '2일 09:55 걸으며 바룬 씨에게 저스틴이 전망 바위 위에서 전지를 봤다고 한 말을 전했다(같이 다니는 파트너라서)', 'varun': '2일 09:55 스즈네에게서, 저스틴이 전망 바위 위에서 예비 전지를 봤다고 했다는 말을 들었다'},
     'seen': '2일 아침 스즈네와 바룬이 산책로를 걸으며 무언가 이야기했다', 'player': '스즈네와 바룬이 산책로를 걸으며 이야기했다'},
    {'id': 'varun_ladder', 'code': 'K1C7', 'self': {'varun': '2일 12:50 비탈로 전망 바위에 올라가 바다 쪽 바위벽의 밧줄 사다리를 끌어 올려 걷었다. 가지러 오는 사람이 비탈로, 내 앞으로 오게 하려고(재판 전에는 말하지 않는다)'},
     'seen': '2일 점심 무렵 바룬이 전망 바위 위에서 바다 쪽을 내려다보고 있었다', 'player': '바룬이 전망 바위 위에서 바다 쪽을 내려다보고 있었다'},
    {'id': 'varun_watch', 'code': 'K1C8', 'self': {'varun': '2일 13:10부터 19:00까지 산책로 벤치에서 이끼 비탈 입구를 지켜봤다. 내려온 사람은 없었다'},
     'seen': '2일 오후 내내 바룬이 산책로 벤치에 앉아 비탈 쪽을 보고 있었다', 'player': '바룬이 오후 내내 산책로 벤치에서 비탈 쪽을 보고 있었다'},
    {'id': 'suzune_sketch', 'code': 'K1C9', 'self': {'suzune': '2일 오후 바룬 씨 옆에서 비탈 쪽을 그리며 그림마다 시각을 적었다. 그리는 동안 지나간 사람을 다 봤다고는 못 한다'},
     'seen': '2일 오후 스즈네가 벤치에서 그림을 그리고 있었다', 'player': '스즈네가 벤치에서 그림을 그리고 있었다'},
    {'id': 'freddie_locate', 'code': 'K1D1', 'self': {'freddie': '2일 16:04 전지를 일찍 갈아 끼우고(남은 1시간 55분은 버림) 16:05 저스틴 위치를 조회했다. 리넨실이 아니라 외부, 전망 바위 위였다'},
     'seen': '2일 오후 4시쯤 프레디가 정원에서 팔찌를 만지작거렸다', 'player': '프레디가 정원에서 팔찌를 만지작거렸다'},
    {'id': 'odile_ladder', 'code': 'K1D2', 'self': {'odile': '1일 17:30 배에서 내려 선착장 끝에 섰을 때, 바다 건너 전망 바위 바위벽에 밧줄 사다리가 걸려 있는 걸 봤다'},
     'seen': '오딜이 선착장 끝에서 바다 건너를 한참 봤다', 'player': '오딜이 선착장 끝에서 바다 건너를 봤다'},
]
KNOWS = {'odile': ['odile_ladder']}
