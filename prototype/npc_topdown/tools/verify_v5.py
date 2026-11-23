# v0.5 확인: 배경·인물 레이어·표정 전환, 긴 대사 페이지, 증언(k), 화면 밖 대화(f), 끼어들기 cut, 전송 함수 없음
import sys, json, re
from playwright.sync_api import sync_playwright
html = 'file://' + sys.argv[1]; out = sys.argv[2]; R = {}; errors = []
def tile_xy(pg, x, y):
    return pg.evaluate('''([x,y]) => { const s=document.querySelector('svg.tr-map'); const [cx,cy]=s.getAttribute('viewBox').split(' ').map(Number); const r=s.getBoundingClientRect();
      return [r.left+((x+.5)*36-cx)*r.width/360, r.top+((y+.5)*36-cy)*r.height/540]; }''', [x, y])
def imgs(pg):
    return pg.evaluate("[...document.querySelectorAll('.tr-talk img')].map(i=>[i.src.split('/').pop(), i.naturalWidth>0])")
def finish_typing(pg):
    pg.locator('.tr-box').first.click(); pg.wait_for_timeout(120)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 393, 'height': 852}, device_scale_factor=2)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto(html); pg.wait_for_timeout(400)
    pg.mouse.click(*tile_xy(pg, 8, 12)); pg.wait_for_timeout(150)
    pg.get_by_role('button', name='대화', exact=True).click()
    pg.fill('textarea.tr-ta', '안녕하세요'); pg.get_by_role('button', name='보내기').click(); pg.wait_for_timeout(150)
    sent = pg.evaluate('window.__lastSent'); code = re.search(r's=([A-Za-z0-9_-]+)', sent).group(1)
    long = '오늘 아침에는 정원 오솔길을 따라 걷다가 이상한 걸 봤어요. 작업실 창문이 반쯤 열려 있었고, 누군가 급하게 나간 것처럼 의자가 넘어져 있었거든요. 도윤 씨는 그런 걸 그냥 두는 사람이 아닌데 말이에요.'
    tag = "<Troemerei s='%s' d='*유리가 돌아본다.|유리(미소):안녕! 좋은 아침.|유리(당황):%s|유리:그럼 이만.' />" % (code, long)
    pg.evaluate('t => window.__mountTag(t)', tag); pg.wait_for_timeout(300)
    R['pages'] = pg.inner_text('.tr-name')
    R['narr_imgs'] = imgs(pg); pg.locator('.tr-card').screenshot(path=out + '/v5_01_narr_default.png')
    finish_typing(pg); pg.locator('.tr-box').first.click(); pg.wait_for_timeout(700); finish_typing(pg)
    R['smile_imgs'] = imgs(pg); pg.locator('.tr-card').screenshot(path=out + '/v5_02_smile.png')
    pg.locator('.tr-box').first.click(); pg.wait_for_timeout(200); finish_typing(pg)
    R['surprise_imgs'] = imgs(pg); R['surprise_text'] = pg.inner_text('.tr-line'); pg.locator('.tr-card').screenshot(path=out + '/v5_03_surprise_page1.png')
    pg.locator('.tr-box').first.click(); pg.wait_for_timeout(200); finish_typing(pg)
    R['page2_text'] = pg.inner_text('.tr-line'); R['page2_name'] = pg.inner_text('.tr-name')
    # 되감기 후 끼어들기: cut은 가장 멀리 읽은 위치
    pg.get_by_role('button', name='‹').click(); pg.wait_for_timeout(100)
    pg.get_by_role('button', name='‹').click(); pg.wait_for_timeout(100)
    pg.get_by_role('button', name='끼어들기').click(); pg.fill('textarea.tr-ta', '잠깐만요'); pg.get_by_role('button', name='보내기').click(); pg.wait_for_timeout(150)
    sent2 = pg.evaluate('window.__lastSent'); R['cut_header'] = sent2.split('\n')[0]; R['mem_line'] = [l for l in sent2.split('\n') if '기억' in l]
    code2 = re.search(r's=([A-Za-z0-9_-]+)', sent2).group(1)
    # 세린 자료실 + k 거부(모르는 일)
    pg.evaluate("t => window.__mountTag(t)", "<Troemerei s='%s' d='유리(뾰로통):흥.' k='기억001' />" % code2); pg.wait_for_timeout(200)
    R['k_toast'] = pg.inner_text('.tr-toast')
    # 화면 밖 대화(f)
    pg.evaluate("t => window.__mountTag(t)", "<Troemerei s='%s' d='*멀리서 발소리가 들린다.|세린(놀람):누, 누구세요?' f='1' />" % code2); pg.wait_for_timeout(200)
    R['f_toast'] = pg.inner_text('.tr-toast'); R['f_hud'] = pg.inner_text('.tr-hud')
    finish_typing(pg); pg.locator('.tr-box').first.click(); pg.wait_for_timeout(400); finish_typing(pg)
    R['f_imgs'] = imgs(pg); pg.locator('.tr-card').screenshot(path=out + '/v5_04_scene_serin_unknown_bg.png')
    # 세린을 자료실에서: 처음부터 새 세계 → 자료실로 이동은 길어서 디버그 대신 상태 직접 조작 불가 → 위 화면(정원 배경) 확인으로 대체
    # 전송 함수 없음 → 수동 전송 상자
    pg.evaluate("window.__mountTag('')"); pg.wait_for_timeout(150)
    pg.evaluate("() => { window.sendMessage = undefined; }")
    pg.mouse.click(*tile_xy(pg, 8, 12)); pg.wait_for_timeout(150)
    pg.get_by_role('button', name='대화', exact=True).click()
    pg.fill('textarea.tr-ta', '테스트'); pg.get_by_role('button', name='보내기').click(); pg.wait_for_timeout(150)
    R['manual'] = pg.evaluate("(document.querySelector('textarea[readonly]')||{}).value||''")[:40]
    pg.evaluate("() => { window.sendMessage = () => Promise.reject(new Error('네트워크')); }")
    pg.get_by_role('button', name='닫기').click(); pg.get_by_role('button', name='보내기').click(); pg.wait_for_timeout(200)
    R['async_fail_toast'] = pg.inner_text('.tr-toast'); R['async_fail_input_back'] = pg.locator('textarea.tr-ta').count()
    b.close()
R['errors'] = errors
print(json.dumps(R, ensure_ascii=False, indent=1))
