# v0.9 확인: 먼저 말 걸기(휴식 중 찾아옴 → 돌아본다), 자유 행동의 '함께 있는 사람' 줄
import sys, json, re
from playwright.sync_api import sync_playwright
html='file://'+sys.argv[1]; out=sys.argv[2]; errors=[]; R={}
shot=lambda pg,n: pg.locator('.tr-card').screenshot(path=out+'/'+n)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--allow-file-access-from-files'])
    pg=b.new_page(viewport={'width':393,'height':852},device_scale_factor=2); pg.on('pageerror',lambda e:errors.append(str(e)))
    pg.goto(html); pg.wait_for_timeout(500)
    # 자유 행동(P)
    pg.get_by_role('button',name='메뉴').click(); pg.get_by_role('button',name='자유 행동 · 추리 입력').click(); pg.wait_for_timeout(100)
    pg.fill('textarea.tr-ta','주변을 둘러본다'); pg.get_by_role('button',name='행동 전달').click(); pg.wait_for_timeout(150)
    R['P_msg']=pg.evaluate('window.__lastSent')
    pg.evaluate("window.__mountTag('')"); pg.wait_for_timeout(200)
    for _ in range(6):
        pg.get_by_role('button',name='휴식').click(); pg.wait_for_timeout(120)
        pg.get_by_role('button',name='10',exact=True).click(); pg.get_by_role('button',name=':30',exact=True).click()
        pg.get_by_role('button',name='10:30까지 건너뛰기').click(); pg.wait_for_timeout(200)
        if pg.locator('.tr-call').count(): break
    R['toast']=pg.inner_text('.tr-toast'); R['call']=pg.inner_text('.tr-call') if pg.locator('.tr-call').count() else ''
    shot(pg,'v10_01_call.png')
    if R['call']:
        pg.get_by_role('button',name='돌아본다').click(); pg.wait_for_timeout(200)
        R['call_msg']=pg.evaluate('window.__lastSent'); shot(pg,'v10_02_sent.png')
        code=re.search(r's=([A-Za-z0-9_-]+)',R['call_msg']).group(1)
        pg.evaluate('t => window.__mountTag(t)',"<Troemerei s='%s' d='*누군가 어깨를 흔든다.|태수(웃음):여기서 자면 감기 걸려요!' />"%code); pg.wait_for_timeout(400)
        pg.locator('.tr-box').first.click(); pg.wait_for_timeout(500); pg.locator('.tr-box').first.click(); pg.wait_for_timeout(200)
        shot(pg,'v10_03_taesu.png')
    b.close()
R['errors']=errors; print(json.dumps(R,ensure_ascii=False,indent=1))
