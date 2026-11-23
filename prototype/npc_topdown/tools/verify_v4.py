# v0.4 추가 기능 확인: 사건 코드(e) 인정 → 표식, 초상화 표시, 자체 입력창 응답(대기 없는 장면)
import sys, json, re
from playwright.sync_api import sync_playwright
html = 'file://' + sys.argv[1]; out = sys.argv[2]; R = {}; errors = []
def tile_xy(pg, x, y):
    return pg.evaluate('''([x,y]) => { const s=document.querySelector('svg.tr-map'); const [cx,cy]=s.getAttribute('viewBox').split(' ').map(Number); const r=s.getBoundingClientRect();
      return [r.left+((x+.5)*36-cx)*r.width/360, r.top+((y+.5)*36-cy)*r.height/540]; }''', [x, y])
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    pg = b.new_page(viewport={'width': 393, 'height': 852}, device_scale_factor=2)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto(html); pg.wait_for_timeout(400)
    R['first_header'] = None
    pg.mouse.click(*tile_xy(pg, 8, 12)); pg.wait_for_timeout(150)
    pg.get_by_role('button', name='대화', exact=True).click()
    pg.fill('textarea.tr-ta', '계획 변경이에요'); pg.get_by_role('button', name='보내기').click(); pg.wait_for_timeout(150)
    sent = pg.evaluate('window.__lastSent'); R['first_header'] = sent.split('\n')[0]
    code = re.search(r's=([A-Za-z0-9_-]+)', sent).group(1)
    tag = "<Troemerei s='%s' d='*유리가 걸음을 멈춘다.|유리(놀람):계획 변경이라니요?' e='TRUE' />" % code
    pg.evaluate('t => window.__mountTag(t)', tag); pg.wait_for_timeout(300)
    R['portrait_src'] = pg.evaluate("(document.querySelector('.tr-talk img')||{}).src||''")
    R['toast_after_e'] = pg.inner_text('.tr-toast')
    pg.locator('.tr-card').screenshot(path=out + '/v4_01_talk_portrait.png')
    pg.get_by_role('button', name='대화 끝').first.click(); pg.wait_for_timeout(200)
    pg.get_by_role('button', name='≡').click(); pg.wait_for_timeout(100)
    R['sheet'] = [l for l in pg.inner_text('.tr-body').split('\n') if '사건 코드' in l or '표식' in l]
    pg.get_by_role('button', name='✕').click()
    pg.mouse.click(*tile_xy(pg, 8, 12)); pg.wait_for_timeout(150)
    pg.get_by_role('button', name='대화', exact=True).click()
    pg.fill('textarea.tr-ta', '잘 지내요?'); pg.get_by_role('button', name='보내기').click(); pg.wait_for_timeout(150)
    R['second_header'] = pg.evaluate('window.__lastSent').split('\n')[0]
    # 엉뚱한 인물에게 e='TRUE' → 거부
    plain_code = code
    bad = "<Troemerei s='%s' d='유리:네?' e='HACK' />" % code
    pg.evaluate('t => window.__mountTag(t)', bad); pg.wait_for_timeout(200)
    pg.get_by_role('button', name='대화 끝').first.click(); pg.wait_for_timeout(100)
    pg.get_by_role('button', name='≡').click(); pg.wait_for_timeout(100)
    R['bad_event'] = [l for l in pg.inner_text('.tr-body').split('\n') if '사건 코드' in l]
    # 자체 입력창 응답: 대기 없는 상태 코드 + 장면
    pg.evaluate("window.__mountTag('')"); pg.wait_for_timeout(150)
    pg.get_by_role('button', name='≡').click(); pg.wait_for_timeout(100)
    idle = pg.inner_text('.tr-mono')
    scene = "<Troemerei s='%s' d='*복도 끝에서 세린이 고개를 든다.|세린:네, 안녕하세요.|*세린은 서류를 고쳐 쥔다.' />" % idle.strip()
    pg.evaluate('t => window.__mountTag(t)', scene); pg.wait_for_timeout(300)
    R['scene_name'] = pg.inner_text('.tr-hud')
    pg.locator('.tr-box').click(); pg.wait_for_timeout(500); pg.locator('.tr-box').click(); pg.wait_for_timeout(500)
    R['scene_portrait'] = pg.evaluate("(document.querySelector('.tr-talk img')||{}).src||''")
    pg.locator('.tr-card').screenshot(path=out + '/v4_02_scene.png')
    b.close()
R['errors'] = errors
print(json.dumps(R, ensure_ascii=False, indent=1))
