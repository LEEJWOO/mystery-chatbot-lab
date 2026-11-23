import sys,json,re
from playwright.sync_api import sync_playwright
html='file://'+sys.argv[1]; R={}; errors=[]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']); pg=b.new_page(viewport={'width':393,'height':852}); pg.on('pageerror',lambda e:errors.append(str(e)))
    pg.goto(html); pg.wait_for_timeout(300)
    pg.get_by_role('button',name='메뉴').click(); pg.locator('.tr-grid.h button').nth(5).click(); pg.wait_for_timeout(200)
    pg.fill('textarea.tr-ta','받은 사람이 도윤이니 쓴 건 유리예요'); pg.get_by_role('button',name='반론하기').click(); pg.wait_for_timeout(150)
    code=re.search(r's=([A-Za-z0-9_-]+)',pg.evaluate('window.__lastSent')).group(1); R['head']=pg.evaluate('window.__lastSent').split('\n')[0]
    pg.evaluate('t=>window.__mountTag(t)',"<Troemerei s='%s' d='세린(놀람):그렇네요.' e='T1_R1' />"%code); pg.wait_for_timeout(300)
    pg.locator('.tr-tbox').click(); pg.wait_for_timeout(1200); R['phase']=pg.inner_text('.tr-thead').split('\n')[1]
    b.close()
R['errors']=errors; print(json.dumps(R,ensure_ascii=False))
