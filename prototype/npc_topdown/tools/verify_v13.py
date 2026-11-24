# v1.3 확인: 진행자 표기·등장 조명, 반론 화면 분할, 체력 깨짐, 쟁점 카드 비행, 전원 투표+슬롯, 관계 변형·표시
import sys, json
from playwright.sync_api import sync_playwright
html='file://'+sys.argv[1]; out=sys.argv[2]; errors=[]; R={}
shot=lambda pg,n: pg.locator('.tr-card').screenshot(path=out+'/'+n)
def jump(pg,n,before=None):
    pg.evaluate("window.__mountTag('')"); pg.wait_for_timeout(200)
    pg.get_by_role('button',name='메뉴').click(); pg.wait_for_timeout(100)
    if before: before(pg)
    pg.locator('.tr-grid.h button').nth(n).click(); pg.wait_for_timeout(250)
def tap_until(pg, who, maxn=8):
    for _ in range(maxn):
        t=pg.inner_text('.tr-tbox2')
        if who in t.split('\n')[0]:
            pg.wait_for_timeout(1500); return pg.inner_text('.tr-tbox2')
        pg.locator('.tr-tbox2').click(); pg.wait_for_timeout(60); pg.locator('.tr-tbox2').click(); pg.wait_for_timeout(60)
    return pg.inner_text('.tr-tbox2')
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--allow-file-access-from-files'])
    pg=b.new_page(viewport={'width':393,'height':852},device_scale_factor=2); pg.on('pageerror',lambda e:errors.append(str(e)))
    pg.goto(html); pg.wait_for_timeout(400)
    jump(pg,0); pg.wait_for_timeout(400); shot(pg,'h1_spot_mid.png'); pg.wait_for_timeout(1300); shot(pg,'h2_spot_end.png')
    R['name']=pg.inner_text('.tr-name b'); R['baku_in_page']='바쿠' in pg.inner_text('body') or '獏' in pg.inner_text('body')
    R['doyun_default']=tap_until(pg,'도윤').split('\n')[-1]
    # 관계: 도윤 신뢰 +20 → 보통(3) → 다른 대사
    jump(pg,0,lambda q:(q.locator('.tr-relbox').nth(1).get_by_role('button',name='＋').click(),q.locator('.tr-relbox').nth(1).get_by_role('button',name='＋').click()))
    pg.wait_for_timeout(200); R['doyun_trust3']=tap_until(pg,'도윤').split('\n')[-1]
    jump(pg,6); pg.wait_for_timeout(250); shot(pg,'h3_split_in.png'); pg.wait_for_timeout(1000); shot(pg,'h4_split.png')
    # 쟁점 카드: 엇갈린 증언 정답 → 쟁점 둘 카드가 날아감
    jump(pg,10)
    pg.locator('.tr-wtabs button').nth(0).click(); pg.wait_for_timeout(300); pg.locator('.tr-part').nth(1).click(force=True); pg.locator('.tr-wtabs button').nth(1).click(); pg.wait_for_timeout(300); pg.locator('.tr-part').nth(2).click(force=True)
    pg.get_by_role('button',name='이 두 문장이 부딪친다').click(); pg.wait_for_timeout(1500); shot(pg,'h5_fly.png'); R['fly']=pg.locator('.tr-fly').inner_text() if pg.locator('.tr-fly').count() else ''
    pg.wait_for_timeout(1100); shot(pg,'h6_fly_end.png')
    # 투표 정답(유리)
    jump(pg,22); pg.locator('.tr-vote').nth(0).click(); pg.get_by_role('button',name='투표한다').click(); pg.wait_for_timeout(1700); shot(pg,'h7_voting.png')
    pg.wait_for_timeout(2400); shot(pg,'h8_reel_spin.png'); pg.wait_for_timeout(2300); shot(pg,'h9_reel_stop.png'); R['reel']=pg.inner_text('.tr-reel-name')
    pg.wait_for_timeout(2500); R['after_vote']=pg.inner_text('.tr-thead').split('\n')[1]
    # 투표 오답(도윤) → 다수결로 도윤 → 체력 깨짐
    jump(pg,22); pg.locator('.tr-vote').nth(1).click(); pg.get_by_role('button',name='투표한다').click(); pg.wait_for_timeout(7080); shot(pg,'h10_hpbreak.png'); R['hp_after_wrong']=pg.locator('.tr-hp i.on').count()
    pg.wait_for_timeout(900)
    # 수첩 관계 표시
    pg.get_by_role('button',name='중단').click(); pg.wait_for_timeout(200); pg.get_by_role('button',name='노트').click(); pg.wait_for_timeout(200)
    shot(pg,'h11_note.png')
    b.close()
R['errors']=errors; print(json.dumps(R,ensure_ascii=False,indent=1))
