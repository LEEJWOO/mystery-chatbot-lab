import fs from 'node:fs';import path from 'node:path';import {build} from 'esbuild';
fs.mkdirSync('dist',{recursive:true});
const files=fs.readdirSync('public/assets');const ASSETS={};for(const f of files){const type=f.endsWith('.png')?'image/png':'image/svg+xml';ASSETS[f]='data:'+type+';base64,'+fs.readFileSync('public/assets/'+f).toString('base64');}
fs.writeFileSync('src/assets.generated.mjs','export const ASSETS='+JSON.stringify(ASSETS)+';');
const core=fs.readFileSync('src/core.mjs','utf8').replace(/^export /gm,'');const view=fs.readFileSync('src/IntegrationScene13.view.jsx','utf8');
fs.writeFileSync('IntegrationScene13.jsx',core+'\n'+view);
fs.writeFileSync('src/browser.generated.jsx',`import React,{useState,useRef,useEffect} from 'react';import {createRoot} from 'react-dom/client';\n${core}\n${view}\nfunction App(){const [result,setResult]=useState('');return <main><IntegrationScene13 assetBase="./assets/" onHandoff={m=>setResult(m)}/><section style={{maxWidth:720,margin:'20px auto',color:'#ccd5e4',fontFamily:'sans-serif'}}><h3>호스트 수신 결과</h3><p>아래 메시지가 UUMMAI에서는 실제 채팅으로 전송됩니다.</p><textarea aria-label="호스트 수신 결과" readOnly value={result} style={{width:'100%',height:180,boxSizing:'border-box'}}/></section></main>}createRoot(document.getElementById('root')).render(<App/>);`);
await build({entryPoints:['src/browser.generated.jsx'],bundle:true,minify:true,outfile:'dist/app.js',define:{'process.env.NODE_ENV':'"production"'}});
await build({entryPoints:['src/worker.mjs'],bundle:true,format:'esm',platform:'browser',outfile:'worker.js'});
fs.cpSync('public/assets','dist/assets',{recursive:true});
fs.writeFileSync('dist/index.html','<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>조사 기록실 · 통합 테스트 13</title><body style="margin:0;background:#090f1a;padding:16px"><div id="root"></div><script src="./app.js"></script></body></html>');
fs.writeFileSync('standalone.html',fs.readFileSync('dist/index.html','utf8').replace('<script src="./app.js"></script>','<script>'+fs.readFileSync('dist/app.js','utf8').replace(/<\/script/gi,'<\\/script')+'</script>').replaceAll('assetBase:"./assets/"','assetBase:"https://raw.githubusercontent.com/LEEJWOO/mystery-chatbot-lab/main/assets/"'));
console.log('Built JSX, browser demo, bundled Worker');
