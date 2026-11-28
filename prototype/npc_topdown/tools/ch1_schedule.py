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
            (2, '19:40', '20:20', '바위 해안', 15, 60, {'spot': s}),              # 팔찌 발견 뒤 수색
            (2, '22:30', '23:59', '재판장 앞', 30, 40, {'spot': s})]
    for d, a, b in ((1, '20:30', '22:00'), (2, '08:00', '19:00')):
        for k, h in enumerate(HANG[id_]): rows.append((d, a, b, h, 25, 20, {'spot': s + k}))
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
        (2, '08:30', '08:55', '로비', 20, 80, {'once': 1, 'spot': 40}),                                # 면담(보이는 거리, 한 명씩): 카림–클라라 → 외벽 처마
        (2, '08:55', '09:15', '로비', 18, 80, {'once': 1, 'spot': 40, 'id': 'iv2'}),                   # 킬리언–오딜 → 와인 저장고
        (2, '09:15', '09:40', '정원', 20, 80, {'once': 1, 'spot': 5, 'id': 'iv3'}),                    # 메이벨–프레디 → 리넨실
        (2, '09:40', '09:55', '로비', 13, 80, {'once': 1, 'spot': 40, 'id': 'iv4', 'flag': 'suzune_told'}),  # 바룬–스즈네 → 전망 바위
        (2, '10:05', '10:30', '휴게 코너', 20, 80, {'once': 1, 'spot': 5, 'id': 'iv5'}),               # 루오시–서하 → 다이빙대
        (2, '11:00', '11:20', 'eaves', 10, 70, {'once': 1, 'id': 'chk_eaves'}),                         # 1차 확인
        (2, '11:20', '12:00', 'diving', 10, 70, {'once': 1, 'id': 'chk_diving'}),
        (2, '13:30', '14:10', 'linen_shelf', 10, 70, {'once': 1, 'id': 'chk_linen'}),                   # 2차 확인
        (2, '14:10', '15:00', 'wine_rack', 10, 70, {'once': 1, 'id': 'chk_wine'}),
        (2, '15:30', '16:10', 'wall_foot', 15, 95, {'once': 1, 'id': 'climb', 'warp': 'view_site', 'flag': 'j_top'}),   # 사다리 없음 → 맨손으로 오름
        (2, '15:30', '16:30', 'view_site', 10, 96, {'once': 1, 'id': 'check_top', 'if': 'j_top', 'flag': 'j_checked'}),
        (2, '15:30', '16:40', 'rock_edge', 3, 97, {'once': 1, 'id': 'fall', 'if': 'j_checked', 'warp': 'crevice', 'flag': 'justin_fell'}),  # 내려오다 무릎 → 바위틈
        (2, '16:00', '23:59', 'crevice', 147, 98, {'once': 1, 'id': 'stuck', 'if': 'justin_fell', 'flag': 'band_thrown'}),   # 18:40 무렵 팔찌·전지를 바위 해안 쪽으로
        (2, '16:00', '23:59', 'crevice', 7, 99, {'once': 1, 'id': 'drown', 'if': 'band_thrown', 'flag': 'justin_dead'}),
        (2, '16:00', '23:59', 'crevice', 999, 100, {'if': 'justin_dead', 'id': 'body'}),
        (3, '00:00', '23:59', 'crevice', 999, 100, {'if': 'justin_dead', 'id': 'body3'}),
    ],
    'varun': [
        (2, '09:40', '09:55', '로비', 13, 72, {'spot': 30}),                               # 스즈네 면담을 몇 걸음 떨어져 봄
        (2, '11:00', '12:40', 'slope_foot', 20, 70, {}),                                   # 전망 바위 둘레를 라이프가드 눈으로
        (2, '12:40', '13:10', 'rope_spot', 10, 85, {'once': 1, 'flag': 'ladder_gone'}),    # 12:50 사다리를 끌어 올려 걷음(비탈 자국)
        (2, '13:10', '19:00', 'bench', 350, 75, {}),                                       # 벤치에서 비탈 입구 감시
        (2, '20:00', '20:30', 'rock_edge', 25, 70, {}),                                    # 수색 — 바위 끝에서 내려다봄(20:20 발견)
    ],
    'suzune': [
        (2, '09:40', '09:55', '로비', 13, 72, {'spot': 41}),
        (2, '11:00', '12:40', '해안 산책로', 30, 70, {'spot': 2}),
        (2, '13:10', '19:00', 'bench', 350, 75, {}),                                       # 옆에서 비탈 쪽을 그림(시각 적음)
        (2, '20:00', '20:30', '전망 바위', 20, 70, {'spot': 3}),
    ],
    'killian': [(2, '08:55', '09:15', '로비', 18, 70, {'spot': 23}), (2, '20:00', '20:30', '전망 바위', 20, 65, {'spot': 1})],
    'clara': [(2, '08:30', '08:55', '로비', 20, 70, {'spot': 20})],
    'karim': [(2, '08:30', '08:55', '로비', 20, 70, {'spot': 21})],
    'odile': [(2, '08:55', '09:15', '로비', 18, 70, {'spot': 22})],
    'freddie': [(2, '09:15', '09:40', '정원', 20, 70, {'spot': 1})],
    'mei': [(2, '09:15', '09:40', '정원', 20, 70, {'spot': 2})],
    'seoha': [(2, '10:05', '10:30', '휴게 코너', 20, 70, {'spot': 1})],
    'ruoxi': [(2, '10:05', '10:30', '휴게 코너', 20, 70, {'spot': 2})],
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
        else: t['cooldownSeconds'] = 60
        if o.get('flag'): t['onCompleteFlag'] = o['flag']
        if o.get('warp'): t['onCompleteWarp'] = o['warp']
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
