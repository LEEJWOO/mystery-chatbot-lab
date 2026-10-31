const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {buildSync}=require('esbuild'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'MysteryTestHub.jsx'),'utf8');
const js=buildSync({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';const {useState,useRef,useEffect,useMemo}=React;${source}\nconst root=createRoot(document.getElementById('root'));window.messages=[];window.failSend=false;window.renderHub=p=>root.render(<MysteryTestHub {...p} onHandoff={async text=>{window.calls=(window.calls||0)+1;if(window.failSend)throw Error('통신 끊김');await new Promise(r=>setTimeout(r,50));window.messages.push(JSON.parse(text.slice(text.indexOf(' ')+1)));}}/>);window.renderHub({});`,loader:'jsx',resolveDir:root},bundle:true,write:false,format:'iife',nodePaths:(process.env.NODE_PATH||'').split(path.delimiter).filter(Boolean)}).outputFiles[0].text;
const fontDir=path.dirname(require.resolve('@fontsource/noto-sans-kr/400.css'));
const fontCss=fs.readFileSync(path.join(fontDir,'400.css'),'utf8');
const server=http.createServer((req,res)=>{if(req.url.startsWith('/files/')){res.setHeader('Content-Type','font/woff2');res.end(fs.readFileSync(path.join(fontDir,req.url)));return;}res.setHeader('Content-Type','text/html');res.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+fontCss+' #root *{font-family: Noto Sans KR,sans-serif!important}body{margin:0}button,input,textarea{box-sizing:border-box}</style><div id="root"></div><script>'+js.replace(/<\/script/gi,'<\\/script')+'</script>');});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let executablePath=process.env.CHROMIUM_PATH,args=['--no-sandbox'];
 if(!executablePath){try{const mod=require('@sparticuz/chromium'),compact=mod.default||mod;executablePath=await compact.executablePath();args=compact.args;}catch{}}
 const browser=await chromium.launch({headless:true,executablePath,args}),page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url='http://127.0.0.1:'+server.address().port;
 const click=label=>page.getByRole('button',{name:label,exact:true}).click();
 const render=async props=>{await page.evaluate(p=>window.renderHub(p),props);await page.waitForTimeout(80);};
 const checkpoint=async()=>{await click('저장·인계');return JSON.parse(await page.locator('textarea[readonly]').inputValue());};
 const results=[];
 try{
  for(const width of [320,360,390,768]){
   await page.setViewportSize({width,height:844});await page.goto(url);await page.getByRole('button',{name:'↑ 전진',exact:true}).waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const s=await checkpoint();await click('탐색');
   await page.getByRole('button',{name:'↑ 전진',exact:true}).evaluate(b=>{b.click();b.click();b.click();});await page.waitForTimeout(400);
   const moved=await checkpoint();assert.equal(moved.player.y,s.player.y-1);assert.equal(moved.timeSec-s.timeSec,2);
   await page.getByPlaceholder('체크포인트 JSON').fill(JSON.stringify(s));await click('체크포인트 복원');const restored=await checkpoint();assert.deepEqual(restored,s);
   results.push('viewport '+width+': overflow, rapid movement and restore PASS');
  }
  await page.setViewportSize({width:320,height:844});
  const text='가나다라마바사아자차카타파하'.repeat(50)+'🙂';
  await render({speech:JSON.stringify({lines:[{speaker:'서술',text,speed:120},{speaker:'서술',text:'아직 공개하지 않은 대사'}]}),reply:JSON.stringify({id:'dialogue-1',elapsedSec:100})});
  await click('다음 컷 ›');await page.waitForTimeout(30);await page.getByRole('button',{name:'다음 컷 ›',exact:true}).evaluate(b=>{b.click();b.click();});await page.waitForTimeout(30);await click('다음 컷 ›');
  await page.screenshot({path:'/tmp/uummai-dialogue-320.png',fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await click('↺ 이번 컷 다시 듣기');await click('대사에 끼어들기');
  await page.getByPlaceholder('인물에게 직접 말하거나 행동을 입력하세요.').fill('잠깐');
  await page.evaluate(()=>window.failSend=true);await click('AI에게 전달');await page.getByRole('status').filter({hasText:'전송 실패'}).waitFor();
  assert.equal(await page.evaluate(()=>window.messages.length),0);await page.evaluate(()=>window.failSend=false);
  await page.getByRole('button',{name:'AI에게 전달',exact:true}).evaluate(b=>{b.click();b.click();});await page.waitForTimeout(100);
  const payload=await page.evaluate(()=>window.messages[0]);assert.equal(await page.evaluate(()=>window.messages.length),1);assert.equal(payload.dialogue.seen[0].text.length,192);assert.equal(payload.dialogue.seen.length,1);assert.equal(payload.dialogue.futureIsCanon,false);assert.ok(payload.state.timeSec>32700);
  results.push('long dialogue: replay disclosure, interrupt, failed send retry and rapid submit PASS');
  await render({reply:JSON.stringify({id:'new-props',elapsedSec:9})});const updated=await checkpoint();assert.equal(updated.timeSec,32709);results.push('same panel new props remount PASS');
  await render({initial:'invalid JSON'});await page.getByRole('status').filter({hasText:'복원 중단'}).first().waitFor();assert.ok(await page.getByRole('button',{name:'↑ 전진',exact:true}).isDisabled());results.push('invalid initial blocks silent reset PASS');
  // Slow world response must block movement until the actual world arrives.
  const world=JSON.parse(fs.readFileSync(path.join(root,'data/world.json'),'utf8'));
  await page.route('https://worker.test/hub/world.json',async route=>{await new Promise(r=>setTimeout(r,180));await route.fulfill({contentType:'application/json',body:JSON.stringify(world)});});
  await render({worldUrl:'https://worker.test/hub/world.json'});assert.ok(await page.getByRole('button',{name:'↑ 전진',exact:true}).isDisabled());await page.waitForTimeout(220);assert.equal(await page.getByRole('button',{name:'↑ 전진',exact:true}).isDisabled(),false);
  let failPut=true,puts=0,saved;
  await page.route('https://worker.test/hub/state/*',async route=>{if(route.request().method()==='PUT'){puts++;saved=JSON.parse(route.request().postData());await new Promise(r=>setTimeout(r,50));await route.fulfill({status:failPut?503:200,contentType:'application/json',body:JSON.stringify(failPut?{error:'temporary'}:{ok:true,revision:saved.rev})});}else await route.fulfill({contentType:'application/json',body:JSON.stringify(saved)});});
  await click('저장·인계');await page.getByPlaceholder('복구 키 · 24자 이상').fill('a'.repeat(32));
  await page.getByRole('button',{name:'서버 저장',exact:true}).evaluate(b=>{b.click();b.click();});await page.getByText(/서버 작업 실패:/).waitFor();assert.equal(puts,1);
  failPut=false;await click('서버 저장');await page.getByText(/서버 저장 완료/).waitFor();assert.equal(puts,2);await click('서버 복원');await page.getByRole('status').filter({hasText:'서버 체크포인트'}).waitFor();results.push('delayed world, duplicate saves, failed save retry, server restore PASS');
  await render({worldUrl:'https://worker.test/hub/world.json',reply:JSON.stringify({id:'auto-save',elapsedSec:5})});await page.waitForTimeout(240);
  await click('저장·인계');await page.getByPlaceholder('복구 키 · 24자 이상').fill('b'.repeat(32));failPut=true;
  await page.getByRole('checkbox').check();await page.getByText(/서버 작업 실패:/).waitFor();const failedCount=puts;
  failPut=false;await page.getByRole('checkbox').uncheck();await page.getByRole('checkbox').check();await page.getByText(/서버 저장 완료/).waitFor();assert.equal(puts,failedCount+1);results.push('failed autosync remains retryable at same revision PASS');
  await page.route('https://failed.test/hub/world.json',r=>r.fulfill({status:503,contentType:'application/json',body:'{"error":"offline"}'}));
  await render({worldUrl:'https://failed.test/hub/world.json'});await page.waitForTimeout(80);assert.equal(await page.getByRole('button',{name:'↑ 전진',exact:true}).isDisabled(),false);results.push('failed external world with no checkpoint retains usable built-in map PASS');
  const pairs=fs.readdirSync(path.join(root,'assets/npcs')).filter(n=>n.endsWith('.svg')).map(n=>{const a=fs.readFileSync(path.join(root,'assets/npcs',n),'utf8');return [n,a,a.replace(/>\s+</g,'><').trim()];});
  const equal=await page.evaluate(async pairs=>{async function pixels(svg){const img=new Image();img.src='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(svg)));await img.decode();const c=document.createElement('canvas');c.width=200;c.height=340;c.getContext('2d').drawImage(img,0,0,200,340);return c.toDataURL();}for(const [name,a,b]of pairs)if(await pixels(a)!==await pixels(b))return name;return true;},pairs);
  assert.equal(equal,true);results.push('24 SVG assets: whitespace optimization pixel-identical PASS');
  assert.deepEqual(errors,[]);results.push('browser runtime errors: 0');
  console.log(results.join('\n'));fs.mkdirSync(path.join(root,'test-output'),{recursive:true});fs.writeFileSync(path.join(root,'test-output/browser-results.json'),JSON.stringify(results,null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
