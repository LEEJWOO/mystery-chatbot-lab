import sys, json, re
from playwright.sync_api import sync_playwright
html='file://'+sys.argv[1]; out=sys.argv[2]; errors=[]; R={}
def tile_xy(pg, x, y):
    return pg.evaluate('''([x,y]) => { const m=document.querySelector('.tr-map'), w=document.querySelector('.tr-world'); const r=m.getBoundingClientRect();
      const t=new DOMMatrix(getComputedStyle(w).transform), s=r.width/360; return [r.left+((x+.5)*36+t.e)*s, r.top+((y+.5)*36+t.f)*s]; }''', [x, y])
shot=lambda pg,n: pg.locator('.tr-card').screenshot(path=out+'/'+n)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--allow-file-access-from-files'])
    pg=b.new_page(viewport={'width':393,'height':852},device_scale_factor=2); pg.on('pageerror',lambda e:errors.append(str(e)))
    pg.goto(html); pg.wait_for_timeout(500)
    pg.get_by_role('button',name='노트').click(); pg.wait_for_timeout(150); shot(pg,'v9_01_notebook0.png')
    pg.get_by_role('button',name='✕').click()
    # 유리와 대화 → 응답
    pg.mouse.click(*tile_xy(pg,8,11)); pg.wait_for_timeout(150); pg.get_by_role('button',name='대화',exact=True).click()
    pg.fill('textarea.tr-ta','안녕하세요'); pg.get_by_role('button',name='보내기').click(); pg.wait_for_timeout(150)
    code=re.search(r's=([A-Za-z0-9_-]+)',pg.evaluate('window.__lastSent')).group(1)
    pg.evaluate('t => window.__mountTag(t)',"<Troemerei s='%s' d='유리(미소):안녕!' />"%code); pg.wait_for_timeout(300)
    pg.locator('.tr-box').first.click(); pg.wait_for_timeout(100); pg.get_by_role('button',name='대화 끝').first.click(); pg.wait_for_timeout(200)
    # 휴식으로 10:30까지(여러 번)
    for _ in range(8):
        if re.search(r'1일 1[0-9]:',pg.inner_text('.tr-time')): break
        pg.get_by_role('button',name='휴식').click(); pg.wait_for_timeout(120)
        pg.get_by_role('button',name='10',exact=True).click(); pg.get_by_role('button',name=':30',exact=True).click()
        pg.get_by_role('button',name='10:30까지 건너뛰기').click(); pg.wait_for_timeout(200)
    R['time']=pg.inner_text('.tr-time')
    pg.get_by_role('button',name='노트').click(); pg.wait_for_timeout(150); shot(pg,'v9_02_notebook.png')
    R['cards']=pg.inner_text('.tr-cards')
    pg.locator('.tr-card2').first.click(); pg.wait_for_timeout(200); shot(pg,'v9_03_yuri.png'); R['yuri']=pg.inner_text('.tr-nb-detail')
    pg.get_by_role('button',name='목격').click(); pg.wait_for_timeout(150); shot(pg,'v9_04_scenes.png'); R['scenes']=pg.inner_text('.tr-body')
    if pg.locator('button.tr-scene').count():
        pg.locator('button.tr-scene').first.click(); pg.wait_for_timeout(150); shot(pg,'v9_05_scene.png')
    pg.get_by_role('button',name='설정').click(); pg.wait_for_timeout(100); pg.get_by_role('button',name=re.compile('끼임 탈출')).click(); pg.wait_for_timeout(100); R['unstuck']=pg.inner_text('.tr-toast')
    b.close()
R['errors']=errors; print(json.dumps(R,ensure_ascii=False,indent=1))
