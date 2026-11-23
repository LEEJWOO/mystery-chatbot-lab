# 360×540 화면 조작 확인 (Playwright + Chrome)
import sys, json, re
from playwright.sync_api import sync_playwright
html = 'file://' + sys.argv[1]; out = sys.argv[2]; errors = []
def tile_xy(pg, x, y):
    return pg.evaluate('''([x,y]) => { const s=document.querySelector('svg.tr-map'); const [cx,cy]=s.getAttribute('viewBox').split(' ').map(Number); const r=s.getBoundingClientRect();
      return [r.left+((x+.5)*36-cx)*r.width/360, r.top+((y+.5)*36-cy)*r.height/540]; }''', [x, y])
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    pg = b.new_page(viewport={'width': 393, 'height': 852}, device_scale_factor=2)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    pg.goto(html); pg.wait_for_timeout(500)
    R = {}
    R['card'] = pg.evaluate("(()=>{const r=document.querySelector('.tr-card').getBoundingClientRect();return [Math.round(r.width),Math.round(r.height)]})()")
    pg.locator('.tr-card').screenshot(path=out + '/v3_01_explore.png')
    t0 = pg.inner_text('.tr-time')
    pg.mouse.click(*tile_xy(pg, 8, 12)); pg.wait_for_timeout(200)
    R['menu'] = pg.inner_text('.tr-menu')
    pg.locator('.tr-card').screenshot(path=out + '/v3_02_menu.png')
    pg.get_by_role('button', name='대화', exact=True).click(); pg.wait_for_timeout(200)
    pg.locator('.tr-card').screenshot(path=out + '/v3_03_talk_input.png')
    pg.fill('textarea.tr-ta', '아까 누구 만나러 가던 길이었어?')
    pg.get_by_role('button', name='보내기').click(); pg.wait_for_timeout(200)
    sent = pg.evaluate('window.__lastSent'); R['sent'] = sent
    code = re.search(r's=([A-Za-z0-9_-]+)', sent).group(1)
    reply = "<Troemerei s='%s' d='*유리는 걸음을 멈추고 돌아보았다.|유리(당황):어, 응? 도윤 씨한테 잠깐 전할 게 있어서. 별일 아니야, 금방 다녀올게.|유리:근데 너는 왜 여기서 서성이고 있어?' />" % code
    pg.evaluate('t => window.__mountTag(t)', reply); pg.wait_for_timeout(250)
    pg.locator('.tr-box').click(); pg.wait_for_timeout(80); pg.locator('.tr-box').click(); pg.wait_for_timeout(1400)
    pg.locator('.tr-card').screenshot(path=out + '/v3_04_talk_read.png')
    for i in range(4): pg.locator('.tr-box').click(); pg.wait_for_timeout(150)
    pg.wait_for_timeout(800); pg.locator('.tr-box').click(); pg.wait_for_timeout(200)
    pg.locator('.tr-card').screenshot(path=out + '/v3_05_talk_last.png')
    pg.get_by_role('button', name='대화 끝').first.click(); pg.wait_for_timeout(200)
    R['time_before_after'] = [t0, pg.inner_text('.tr-time')]
    # 끼어들기
    pg.evaluate('t => window.__mountTag(t)', reply); pg.wait_for_timeout(200)
    pg.locator('.tr-box').click(); pg.wait_for_timeout(60); pg.locator('.tr-box').click(); pg.wait_for_timeout(300)
    pg.get_by_role('button', name='끼어들기').click(); pg.fill('textarea.tr-ta', '잠깐, 뭘 전하는데?')
    pg.locator('.tr-card').screenshot(path=out + '/v3_06_interrupt.png')
    pg.get_by_role('button', name='보내기').click(); pg.wait_for_timeout(200)
    R['interrupt'] = pg.evaluate('window.__lastSent').split('\n')[0]
    # 방향키 + 두 번 탭 이동
    pg.evaluate("window.__mountTag('')"); pg.wait_for_timeout(200)
    pg.locator('.tr-pad', has_text='↑').dispatch_event('pointerdown'); pg.wait_for_timeout(120); pg.locator('.tr-pad', has_text='↑').dispatch_event('pointerup'); pg.wait_for_timeout(200)
    R['after_up'] = pg.inner_text('.tr-time')
    pg.mouse.click(*tile_xy(pg, 3, 10)); pg.wait_for_timeout(150)
    R['preview'] = pg.inner_text('.tr-preview')
    pg.locator('.tr-card').screenshot(path=out + '/v3_07_preview.png')
    pg.mouse.click(*tile_xy(pg, 3, 10)); pg.wait_for_timeout(1500)
    R['after_route'] = pg.inner_text('.tr-time')
    pg.get_by_role('button', name='노트').click(); pg.wait_for_timeout(150)
    pg.get_by_role('button', name='인물').click(); pg.wait_for_timeout(100)
    pg.locator('.tr-card').screenshot(path=out + '/v3_08_notes.png')
    pg.evaluate("window.__mountTag(\"<Troemerei s='AAAAbbbbCCCC' d='' />\")"); pg.wait_for_timeout(200)
    R['bad'] = pg.inner_text('.tr-err')[:60]
    pg.locator('.tr-card').screenshot(path=out + '/v3_09_error.png')
    d = b.new_page(viewport={'width': 1280, 'height': 900}); d.goto(html); d.wait_for_timeout(300)
    d.evaluate("document.getElementById('root').style.maxWidth='560px'"); d.wait_for_timeout(300)
    R['desktop_card'] = d.evaluate("(()=>{const r=document.querySelector('.tr-card').getBoundingClientRect();return [Math.round(r.width),Math.round(r.height)]})()")
    b.close()
R['errors'] = errors
print(json.dumps(R, ensure_ascii=False, indent=1))
