import sys, json, re
from playwright.sync_api import sync_playwright
html = 'file://' + sys.argv[1]
out = sys.argv[2]
errors = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    pg = b.new_page(viewport={'width': 1200, 'height': 900})
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    pg.goto(html); pg.wait_for_timeout(500)
    clock0 = pg.inner_text('.tn-clock')
    # 이동: 타일 클릭 후 경로 진행 확인
    pg.locator('svg rect').nth(12*30+3).click(); pg.wait_for_timeout(1500)
    clock1 = pg.inner_text('.tn-clock')
    # 처음 위치로 리셋 위해 다시 마운트
    pg.evaluate("window.__mountTag('')"); pg.wait_for_timeout(300)
    pg.get_by_role('button', name='대화', exact=True).click()
    pg.fill('textarea.tn-input', '혹시 아까 누구를 만나러 가던 길이었어?')
    pg.get_by_role('button', name='말 걸기 (AI 응답)').click(); pg.wait_for_timeout(300)
    sent = pg.evaluate('window.__lastSent')
    code = re.search(r's=([A-Za-z0-9_-]+)', sent).group(1)
    locked = pg.get_by_role('button', name='1분 대기').is_disabled()
    pg.screenshot(path=out + '/03_sent.png')
    reply = "<Troemerei s='%s' t='40' d='*유리는 발걸음을 멈추고 돌아보았다.|유리(당황):어, 응? 도윤 씨한테 잠깐 전할 게 있어서.|유리:별일 아니야. 금방 다녀올게.' />" % code
    pg.evaluate('t => window.__mountTag(t)', reply); pg.wait_for_timeout(400)
    vn1 = pg.inner_text('.tn-vn')
    pg.screenshot(path=out + '/04_dialogue.png')
    for i in range(6):
        pg.locator('.tn-vn').click(); pg.wait_for_timeout(250)
    pg.get_by_role('button', name='대화 종료').click(); pg.wait_for_timeout(300)
    clock2 = pg.inner_text('.tn-clock')
    # 끼어들기 흐름
    pg.evaluate('t => window.__mountTag(t)', reply); pg.wait_for_timeout(200)
    pg.locator('.tn-vn').click(); pg.wait_for_timeout(100)
    pg.locator('.tn-vn').click(); pg.wait_for_timeout(300)  # 2번째 줄 진행 중
    pg.get_by_role('button', name='끼어들기').click()
    pg.fill('textarea.tn-input', '잠깐, 도윤 씨한테 뭘 전하는데?')
    pg.get_by_role('button', name='AI에게 전달').click(); pg.wait_for_timeout(300)
    sent2 = pg.evaluate('window.__lastSent')
    # 손상 코드
    pg.evaluate("window.__mountTag(\"<Troemerei s='AAAAbbbbCCCC' t='5' d='' />\")"); pg.wait_for_timeout(300)
    err = pg.inner_text('.tn-error') if pg.locator('.tn-error').count() else ''
    pg.evaluate("window.__mountTag('')"); pg.wait_for_timeout(200)
    pg.screenshot(path=out + '/01_desktop.png', full_page=True)
    m = b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
    m.goto(html); m.wait_for_timeout(400)
    m.evaluate('t => window.__mountTag(t)', reply); m.wait_for_timeout(1200)
    m.screenshot(path=out + '/02_mobile.png')
    b.close()
print(json.dumps({'clock0': clock0, 'clock_after_move': clock1, 'sent': sent, 'locked_after_send': locked, 'vn_first': vn1, 'clock_after_talk': clock2, 'interrupt_sent': sent2, 'bad_code_error': err, 'errors': errors}, ensure_ascii=False, indent=1))
