# 재판 연출 확인: 타자 출력·컷인/깨짐·쟁점 표시·전환 카드·엇갈린 증언(여러 명)·진상 결정(부채꼴)·되감기
import sys, json
from playwright.sync_api import sync_playwright
html='file://'+sys.argv[1]; out=sys.argv[2]; errors=[]; R={}
shot=lambda pg,n: pg.locator('.tr-card').screenshot(path=out+'/'+n)
def jump(pg,n):
    pg.evaluate("window.__mountTag('')"); pg.wait_for_timeout(200)
    pg.get_by_role('button',name='메뉴').click(); pg.wait_for_timeout(100)
    pg.locator('.tr-grid.h button').nth(n).click(); pg.wait_for_timeout(250)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--allow-file-access-from-files'])
    pg=b.new_page(viewport={'width':393,'height':852},device_scale_factor=2); pg.on('pageerror',lambda e:errors.append(str(e)))
    pg.goto(html); pg.wait_for_timeout(400)
    jump(pg,0); pg.wait_for_timeout(250); shot(pg,'n01_typing.png'); R['typing']=pg.inner_text('.tr-ttext')
    pg.wait_for_timeout(2500); shot(pg,'n02_baku_full.png')
    pg.locator('.tr-tbox2').click(); pg.wait_for_timeout(100); pg.locator('.tr-tbox2').click(); pg.wait_for_timeout(100); pg.locator('.tr-tbox2').click(); pg.wait_for_timeout(1500); shot(pg,'n03_taesu.png')
    jump(pg,1); shot(pg,'n04_trans.png')
    jump(pg,5); pg.wait_for_timeout(500); shot(pg,'n05_cutin.png'); pg.wait_for_timeout(1500); shot(pg,'n06_after_cut.png')
    jump(pg,10); cols=None
    pg.locator('.tr-wtabs button').nth(0).click(); pg.wait_for_timeout(300); pg.locator('.tr-part').nth(0).click(force=True)
    pg.locator('.tr-wtabs button').nth(2).click(); pg.wait_for_timeout(300); pg.locator('.tr-part').nth(2).click(force=True); pg.wait_for_timeout(100); shot(pg,'n07_pairs.png')
    pg.get_by_role('button',name='이 두 문장이 부딪친다').click(); pg.wait_for_timeout(200); R['pairs_hp']=pg.locator('.tr-hp i.on').count(); pg.wait_for_timeout(800)
    pg.locator('.tr-wtabs button').nth(0).click(); pg.wait_for_timeout(300); pg.locator('.tr-part').nth(1).click(force=True); pg.locator('.tr-wtabs button').nth(1).click(); pg.wait_for_timeout(300); pg.locator('.tr-part').nth(2).click(force=True)
    pg.get_by_role('button',name='이 두 문장이 부딪친다').click(); pg.wait_for_timeout(250); shot(pg,'n08_contradiction.png'); pg.wait_for_timeout(1400); R['after_pairs']=pg.inner_text('.tr-thead').split('\n')[1]
    jump(pg,21); pg.locator('.tr-face').nth(0).click(); pg.wait_for_timeout(450); shot(pg,'n09_fan.png')
    for i,c in enumerate(['유리','업무 메모를 건넸다','아침 9시 무렵','작업실','오후 작업 순서를 알리려고']):
        (i and pg.locator('.tr-face').nth(i).click()); pg.wait_for_timeout(350); pg.locator('.tr-fancard',has_text=c).first.click(force=True); pg.wait_for_timeout(80)
    shot(pg,'n10_crys_full.png'); pg.get_by_role('button',name='진상을 굳힌다').click(); pg.wait_for_timeout(900); shot(pg,'n11_crys_win.png'); pg.wait_for_timeout(1400); R['after_crys']=pg.inner_text('.tr-thead').split('\n')[1]
    # 되감기: 투표 오답 5번
    jump(pg,22)
    for _ in range(5):
        pg.locator('.tr-vote').nth(1).click(); pg.get_by_role('button',name='투표한다').click(); pg.wait_for_timeout(1300)
    pg.wait_for_timeout(1500); shot(pg,'n12_rewind.png'); R['rewind']=pg.locator('.tr-whisper').inner_text() if pg.locator('.tr-whisper').count() else ''
    b.close()
R['errors']=errors; print(json.dumps(R,ensure_ascii=False,indent=1))
