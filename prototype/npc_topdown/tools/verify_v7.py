import sys, json
from playwright.sync_api import sync_playwright
html='file://'+sys.argv[1]; out=sys.argv[2]; errors=[]; R={}
def tile_xy(pg, x, y):
    return pg.evaluate('''([x,y]) => { const m=document.querySelector('.tr-map'), w=document.querySelector('.tr-world'); const r=m.getBoundingClientRect();
      const t=new DOMMatrix(getComputedStyle(w).transform), s=r.width/360; return [r.left+((x+.5)*36+t.e)*s, r.top+((y+.5)*36+t.f)*s]; }''', [x, y])
shot=lambda pg,n: pg.locator('.tr-card').screenshot(path=out+'/'+n)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--allow-file-access-from-files'])
    pg=b.new_page(viewport={'width':393,'height':852},device_scale_factor=2); pg.on('pageerror',lambda e:errors.append(str(e)))
    pg.goto(html); pg.wait_for_timeout(600); shot(pg,'v8_01_garden_room.png')
    R['area']=pg.inner_text('.tr-area'); R['toast0']=pg.inner_text('.tr-toast')
    # 벤치 조사(09:00 → 없음)
    pg.mouse.click(*tile_xy(pg,7,14)); pg.wait_for_timeout(200)
    pg.get_by_role('button',name='조사').click(); pg.wait_for_timeout(200); R['search1']=pg.inner_text('.tr-toast')
    # 휴식 패널 → 시각 지정 09:40
    pg.get_by_role('button',name='휴식').click(); pg.wait_for_timeout(200); shot(pg,'v8_02_rest.png')
    pg.get_by_role('button',name='09',exact=True).click(); pg.get_by_role('button',name=':40',exact=True).click(); pg.wait_for_timeout(100)
    R['prev']=pg.inner_text('.tr-prev'); shot(pg,'v8_03_rest_pick.png')
    pg.get_by_role('button',name='09:40까지 건너뛰기').click(); pg.wait_for_timeout(300); R['skip_toast']=pg.inner_text('.tr-toast'); R['time']=pg.inner_text('.tr-time')
    R['skips']=[]
    for _ in range(6):
        if '09:4' in pg.inner_text('.tr-time'): break
        pg.get_by_role('button',name='휴식').click(); pg.wait_for_timeout(150)
        pg.get_by_role('button',name='09',exact=True).click(); pg.get_by_role('button',name=':40',exact=True).click()
        pg.get_by_role('button',name='09:40까지 건너뛰기').click(); pg.wait_for_timeout(250); R['skips'].append(pg.inner_text('.tr-toast')+' @'+pg.inner_text('.tr-time'))
    # 조사 다시
    pg.mouse.click(*tile_xy(pg,7,14)); pg.wait_for_timeout(200)
    if pg.get_by_role('button',name='조사').count():
        pg.get_by_role('button',name='조사').click(); pg.wait_for_timeout(250)
    R['search2']=pg.inner_text('.tr-toast'); R['found']=pg.locator('.tr-found').count(); shot(pg,'v8_04_found.png')
    if R['found']: pg.locator('.tr-found').click()
    # 위쪽 문(8,8)으로 걸어가서 자료실 진입
    pg.evaluate("() => {}")
    pg.mouse.click(*tile_xy(pg,8,9)); pg.wait_for_timeout(150); pg.mouse.click(*tile_xy(pg,8,9)); pg.wait_for_timeout(2500)
    for _ in range(2):
        pg.locator('.tr-pad').nth(0).dispatch_event('pointerdown'); pg.wait_for_timeout(60); pg.locator('.tr-pad').nth(0).dispatch_event('pointerup'); pg.wait_for_timeout(120)
        shot(pg,'v8_05_mid.png'); pg.wait_for_timeout(200)
    R['area_after_up']=pg.inner_text('.tr-area'); shot(pg,'v8_05_after_up.png')
    pg.wait_for_timeout(300); shot(pg,'v8_06_library.png')
    # 노트 → 증거 탭
    pg.get_by_role('button',name='노트').click(); pg.get_by_role('button',name='증거').click(); pg.wait_for_timeout(100); R['items']=pg.inner_text('.tr-body')[:120]
    shot(pg,'v8_07_items.png')
    b.close()
R['errors']=errors; print(json.dumps(R,ensure_ascii=False,indent=1))
