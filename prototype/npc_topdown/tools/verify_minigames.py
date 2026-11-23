# 재판 미니게임 확인: 설정 › 단계 바로가기로 각 단계를 열어 오답 1회 + 정답 풀이, 화면 저장
import sys, json, re
from playwright.sync_api import sync_playwright
html='file://'+sys.argv[1]; out=sys.argv[2]; path=json.load(open(sys.argv[3])); errors=[]; R={}
shot=lambda pg,n: pg.locator('.tr-card').screenshot(path=out+'/'+n)
hp=lambda pg: pg.locator('.tr-hp i.on').count()
def jump(pg,n):
    pg.evaluate("window.__mountTag('')"); pg.wait_for_timeout(200)
    pg.get_by_role('button',name='메뉴').click(); pg.wait_for_timeout(100)
    pg.locator('.tr-grid.h button').nth(n).click(); pg.wait_for_timeout(250)
def phase(pg): return pg.inner_text('.tr-thead').split('\n')[1] if pg.locator('.tr-thead').count() else 'out'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--allow-file-access-from-files'])
    pg=b.new_page(viewport={'width':393,'height':852},device_scale_factor=2); pg.on('pageerror',lambda e:errors.append(str(e)))
    pg.goto(html); pg.wait_for_timeout(400)
    # 엇갈린 두 증언 (4)
    jump(pg,3); cols=pg.locator('.tr-col')
    cols.nth(0).locator('.tr-part').nth(0).click(); cols.nth(1).locator('.tr-part').nth(0).click(); pg.get_by_role('button',name='이 두 구절이 부딪친다').click(); pg.wait_for_timeout(300); R['pairs_wrong_hp']=hp(pg); pg.wait_for_timeout(700)
    cols.nth(0).locator('.tr-part').nth(1).click(); cols.nth(1).locator('.tr-part').nth(1).click(); shot(pg,'m01_pairs.png'); pg.get_by_role('button',name='이 두 구절이 부딪친다').click(); pg.wait_for_timeout(1200); R['after_pairs']=phase(pg)
    # 구절 짝짓기 (5)
    docs=pg.locator('.tr-doc')
    for a,b2 in [((0,0),(2,0)),((0,2),(1,2))]:
        docs.nth(a[0]).locator('.tr-part').nth(a[1]).click(); docs.nth(b2[0]).locator('.tr-part').nth(b2[1]).click(); pg.get_by_role('button',name='맞대 보기').click(); pg.wait_for_timeout(900)
    shot(pg,'m02_combine.png')
    docs.nth(1).locator('.tr-part').nth(1).click(); docs.nth(2).locator('.tr-part').nth(1).click(); pg.get_by_role('button',name='맞대 보기').click(); pg.wait_for_timeout(1200); R['after_combine']=phase(pg)
    # 기억 현상 (7)
    jump(pg,6); shot(pg,'m03_develop_blur.png')
    pg.locator('.tr-spot').nth(0).click(force=True); pg.locator('.tr-evi',has_text='메모 사본').click(); pg.wait_for_timeout(300)
    pg.locator('.tr-spot').nth(0).click(force=True); pg.locator('.tr-evi',has_text='떨어진 단추').click(); pg.wait_for_timeout(700); shot(pg,'m04_develop_clear.png')
    pg.get_by_role('button',name='기억을 굳힌다').click(); pg.wait_for_timeout(1100); R['after_develop']=phase(pg)
    # 동선 재현 (8)
    box=pg.locator('.tr-mini').bounding_box(); cw=box['width']/30; ch=box['height']/18
    for x,y in path[1:]: pg.mouse.click(box['x']+(x+.5)*cw, box['y']+(y+.5)*ch); pg.wait_for_timeout(20)
    shot(pg,'m05_route.png'); pg.get_by_role('button',name='이 길이었다').click(); pg.wait_for_timeout(1200); R['after_route']=phase(pg)
    # 실 엮기 (9)
    pins={n:pg.locator('.tr-pin',has_text=n) for n in ['유리','도윤','세린','메모 사본','작업 순서표','자료실 선반','작업실 탁자']}
    for a,c in [('유리','메모 사본'),('메모 사본','자료실 선반'),('도윤','작업 순서표'),('작업 순서표','작업실 탁자'),('유리','도윤')]:
        pins[a].click(); pins[c].click(); pg.wait_for_timeout(40)
    shot(pg,'m06_strings.png'); pg.get_by_role('button',name='이렇게 이어진다').click(); pg.wait_for_timeout(1200); R['after_strings']=phase(pg)
    # 진상 결정 (11)
    jump(pg,10)
    for c in ['유리','업무 메모를 건넸다','아침 9시 무렵','작업실','오후 작업 순서를 알리려고']:
        pg.locator('.tr-chips button',has_text=c).first.click(); pg.wait_for_timeout(40)
    shot(pg,'m07_crystal.png'); pg.get_by_role('button',name='진상을 굳힌다').click(); pg.wait_for_timeout(1200); R['after_crystal']=phase(pg)
    b.close()
R['errors']=errors; print(json.dumps(R,ensure_ascii=False,indent=1))
