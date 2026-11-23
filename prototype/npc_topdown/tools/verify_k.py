import json,re
from playwright.sync_api import sync_playwright
html='file:///home/claude/mystery-chatbot-lab/prototype/npc_topdown/dist/Troemerei_Standalone.html'; R={}
long='가'*40+' '+'나'*40+' '+'다'*30
tag="<Troemerei s='BpjSCwYBAZSEAtUiPnAFAQEFDQ0AAAAAAAAAqAUAAAAEBgAExgEEiQIODQEDCQMAAAsAAAQA5AUIugQC7QIBKAAAAgIAAOQFAgC6BBgEAAAAHcgLAAAAAAABAADkBQgHAQUIBRUNAAACAzUEgAIAAAQAFAgBBg1VqqoCDQAAAgXkAgY3AAAHAFHu' d='유리:안녕.|유리:"+long+"|유리:사실 아까 도윤 씨한테 메모를 줬어.' k='기억K3R8@3' />"
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']); pg=b.new_page(viewport={'width':393,'height':852})
    pg.goto(html); pg.wait_for_timeout(300)
    # 1) 두 번째 줄 2페이지에서 끼어들기
    pg.evaluate('t=>window.__mountTag(t)',tag); pg.wait_for_timeout(200)
    for _ in range(3): pg.locator('.tr-box').first.click(); pg.wait_for_timeout(60)
    pg.locator('.tr-box').first.click(); pg.wait_for_timeout(100)
    R['page']=pg.inner_text('.tr-name')
    pg.get_by_role('button',name='끼어들기').click(); pg.fill('textarea.tr-ta','잠깐'); pg.get_by_role('button',name='보내기').click(); pg.wait_for_timeout(150)
    sent=pg.evaluate('window.__lastSent'); R['cut']=sent.split('\n')[0]; R['clue_line']=[l for l in sent.split('\n') if l.startswith('내 단서')]
    # 2) 끝까지 듣고 대화 끝
    pg.evaluate('t=>window.__mountTag(t)',tag); pg.wait_for_timeout(200)
    for _ in range(12): pg.locator('.tr-box').first.click(); pg.wait_for_timeout(60)
    pg.get_by_role('button',name='대화 끝').first.click(); pg.wait_for_timeout(200); R['toast']=pg.inner_text('.tr-toast')
    b.close()
print(json.dumps(R,ensure_ascii=False))
