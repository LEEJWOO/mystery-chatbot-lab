# 재판 시제품 확인: 개정 → 논쟁(오답·정답) → 반론(AI 응답 모의: 실패 1회·성공) → 꿈 조각 → 투표 → 폐정, 되감기
import sys, json, re
from playwright.sync_api import sync_playwright
html='file://'+sys.argv[1]; out=sys.argv[2]; errors=[]; R={'hp':[]}
shot=lambda pg,n: pg.locator('.tr-card').screenshot(path=out+'/'+n)
hp=lambda pg: pg.locator('.tr-hp i.on').count()
def taps(pg, n):
    for _ in range(n): pg.locator('.tr-tbox').click(); pg.wait_for_timeout(80)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--allow-file-access-from-files'])
    pg=b.new_page(viewport={'width':393,'height':852},device_scale_factor=2); pg.on('pageerror',lambda e:errors.append(str(e)))
    pg.goto(html); pg.wait_for_timeout(400)
    pg.get_by_role('button',name='메뉴').click(); pg.get_by_role('button',name=re.compile('재판 시제품 시작')).click(); pg.wait_for_timeout(200)
    shot(pg,'t01_open.png'); taps(pg,3); pg.wait_for_timeout(200)
    # 논쟁: 첫 증언(태수)에 메모 사본 → 오답
    pg.get_by_role('button',name='이 증언에 증거 제시').click(); shot(pg,'t02_debate_drawer.png')
    pg.locator('.tr-evi').first.click(); pg.wait_for_timeout(200); shot(pg,'t03_wrong.png'); R['hp'].append(hp(pg)); pg.wait_for_timeout(800)
    pg.get_by_role('button',name='다음 ›').click(); pg.wait_for_timeout(150)
    pg.get_by_role('button',name='이 증언에 증거 제시').click(); pg.locator('.tr-evi',has_text='메모 사본').click(); pg.wait_for_timeout(200); shot(pg,'t04_contradiction.png'); pg.wait_for_timeout(1000)
    taps(pg,1); pg.wait_for_timeout(200)
    # 반론
    pg.locator('.tr-chips button',has_text='메모 사본').click(); pg.fill('textarea.tr-ta','사본은 유리 씨가 직접 선반에 뒀어요. 원본도 같은 날 유리 씨가 도윤 씨에게 건넸고요.')
    shot(pg,'t05_rebut.png'); pg.get_by_role('button',name='반론하기').click(); pg.wait_for_timeout(200)
    sent=pg.evaluate('window.__lastSent'); R['rebut_msg']=sent; code=re.search(r's=([A-Za-z0-9_-]+)',sent).group(1)
    # 모의 AI: 1차 실패(코드 없음)
    pg.evaluate('t=>window.__mountTag(t)',"<Troemerei s='%s' d='세린(웃음):그건 정황일 뿐이에요. 직접 본 사람이 있나요?' />"%code); pg.wait_for_timeout(300)
    taps(pg,1); pg.wait_for_timeout(150); R['hp_after_fail']=hp(pg); R['phase_after_fail']=pg.inner_text('.tr-thead')
    pg.wait_for_timeout(900)
    pg.fill('textarea.tr-ta','도윤 씨는 메모를 받았다고 했어요. 받은 사람이 직접 쓴 건 아니죠.'); pg.get_by_role('button',name='반론하기').click(); pg.wait_for_timeout(200)
    code=re.search(r's=([A-Za-z0-9_-]+)',pg.evaluate('window.__lastSent')).group(1)
    pg.evaluate('t=>window.__mountTag(t)',"<Troemerei s='%s' d='세린(놀람):……받은 쪽이 쓸 리는 없네요.|세린:제가 틀렸어요.' e='T1_R1' />"%code); pg.wait_for_timeout(300)
    taps(pg,2); pg.wait_for_timeout(200); shot(pg,'t06_rebut_ok.png'); pg.wait_for_timeout(1000)
    R['phase_dream']=pg.inner_text('.tr-thead'); shot(pg,'t07_dream.png')
    pieces=["유리가 정원에서 작업실로 향한다","유리가 도윤에게 메모를 건넨다","도윤이 순서표에 메모를 붙인다","유리가 자료실 선반에 사본을 둔다"]
    for i,pc in enumerate(pieces):
        pg.locator('.tr-bub',has_text=pc).click(force=True); pg.wait_for_timeout(250)
        if i==1: shot(pg,'t08_dream_mid.png')
    pg.wait_for_timeout(1000); shot(pg,'t09_vote.png')
    pg.locator('.tr-vote',has_text='유리').click(); pg.get_by_role('button',name='투표한다').click(); pg.wait_for_timeout(900); shot(pg,'t10_voting.png'); pg.wait_for_timeout(1300)
    taps(pg,4); pg.wait_for_timeout(300); R['after']=pg.locator('.tr-area').inner_text() if pg.locator('.tr-area').count() else 'still trial'
    b.close()
R['errors']=errors; print(json.dumps(R,ensure_ascii=False,indent=1))
