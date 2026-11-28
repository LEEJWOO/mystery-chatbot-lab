"""표정 연결표 생성: 36종 표정 이름 × 11명 → 실제로 보이는 그림(없으면 대체 표정). 결과: docs/plan/EXPRESSION_TABLE.md

사용: python3 tools/expr_table.py   (src/assets.web.json · src/component.jsx의 TR_FACES/TR_FB를 읽는다)
"""
import json, os, re
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
src = open(os.path.join(ROOT, 'src', 'component.jsx'), encoding='utf-8').read()
core = re.findall(r"'([^']+)'", re.search(r"const TR_FACES = \[([^\]]+)\]", src).group(1))
fb = dict(re.findall(r"'?([가-힣 ]+)'?: '([가-힣]+)'", re.search(r"const TR_FB = \{(.+?)\};", src, re.S).group(1)))
A = json.load(open(os.path.join(ROOT, 'src', 'assets.web.json'), encoding='utf-8'))['chars']
NAMES = {'suzune': '스즈네', 'mei': '메이벨', 'ruoxi': '루오시', 'seoha': '서하', 'clara': '클라라', 'odile': '오딜', 'varun': '바룬', 'justin': '저스틴', 'freddie': '프레디', 'killian': '킬리언', 'karim': '카림'}
allf = core + [k for k in fb if k not in core]
def shown(P, f):
    have = set((P.get('faces') or {})) | {P.get('def', '기본')}
    if f in have: return f, True
    g = fb.get(f, '기본')
    return (g if g in have else '기본'), False
lines = ['# 표정 연결표 (자동 생성: tools/expr_table.py)', '',
         '대본에는 아래 36종 이름을 그대로 쓴다. ● = 그 인물의 실제 그림, 다른 이름 = 그림이 없어 대신 보이는 표정.', '',
         '| 표정 | ' + ' | '.join(NAMES[c] for c in NAMES) + ' |', '|---|' + '---|' * len(NAMES)]
for f in allf:
    row = []
    for c in NAMES:
        P = (A.get(c, {}).get('poses') or {}).get('default') or {}
        g, own = shown(P, f); row.append('●' if own else g)
    lines.append('| %s%s | ' % (f, '' if f in core else ' (추가)') + ' | '.join(row) + ' |')
lines += ['', '## 인물별 실제 그림 (원본 파일 이름 = 번호-표정.png)', '']
for c in NAMES:
    P = (A.get(c, {}).get('poses') or {}).get('default') or {}
    fs = sorted(P.get('faces') or {})
    lines.append('- **%s**: %s' % (NAMES[c], ', '.join(fs) if fs else '기본 1장뿐(표정 그림 대기 — 모두 기본으로 보임)'))
lines += ['', '- 원본 파일의 `눈감음`·`수줍은미소`·`눈물참기`는 화면 이름 `눈 감음`·`수줍은 미소`·`눈물 참기`로 읽는다.',
          '- 대체 규칙(TR_FB): ' + ', '.join('%s→%s' % kv for kv in fb.items())]
open(os.path.join(ROOT, '..', '..', 'docs', 'plan', 'EXPRESSION_TABLE.md'), 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
print('\n'.join(lines[:12]))
