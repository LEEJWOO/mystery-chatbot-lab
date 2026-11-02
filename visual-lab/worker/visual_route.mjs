// Visual Scene Lab v1 — public sample SVG, no inline base64 or secret game state.
const TYPES=['text','route','incident','evidence'];
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function sample(type,title,ticker){
 const name=esc(title.slice(0,50)),message=esc(ticker.slice(0,140));
 const path='M70 178 L175 178 L275 105 L410 105 L520 80';
 const views={
  text:`<text x="32" y="124" font-size="25" fill="#b9e9ed" opacity="0">${name}<animate attributeName="opacity" from="0" to="1" dur="1s" fill="freeze"/></text>`,
  route:`<path d="${path}" stroke="#81bcd2" stroke-width="3" fill="none" stroke-dasharray="8 7"/><circle r="8" fill="#f5d18c"><animateMotion dur="6s" path="${path}" repeatCount="indefinite"/></circle>`,
  incident:'<circle cx="130" cy="150" r="25" fill="none" stroke="#86b6ce"/><circle cx="490" cy="150" r="25" fill="none" stroke="#86b6ce"/><path d="M160 150H460" stroke="#e9ba8b" stroke-width="3" stroke-dasharray="6 8"><animate attributeName="stroke-dashoffset" from="100" to="0" dur="1s" repeatCount="indefinite"/></path>',
  evidence:'<path d="M140 130L320 90L505 150" fill="none" stroke="#8dcec9" stroke-width="3"/><g stroke="#83b9cb" fill="#18394e"><rect x="80" y="110" width="120" height="42" rx="8"/><rect x="260" y="70" width="120" height="42" rx="8"/><rect x="445" y="130" width="120" height="42" rx="8"/></g><g font-size="14" text-anchor="middle" fill="#edf6fa"><text x="140" y="135">기록</text><text x="320" y="95">추측</text><text x="505" y="155">모순</text></g>'
 };
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" role="img" aria-label="${name}"><rect width="640" height="280" rx="13" fill="#112638"/><rect x="13" y="13" width="614" height="254" rx="11" stroke="#5d92ab" fill="none"/><text x="26" y="37" font-size="18" fill="#f0f4fa">${name}</text>${views[type]}<defs><clipPath id="vclip"><rect x="21" y="226" width="595" height="36"/></clipPath></defs><g clip-path="url(#vclip)"><text y="249" font-size="14" fill="#d9ecf8" transform="translate(640 0)">${message}<animateTransform attributeName="transform" type="translate" from="640 0" to="-1600 0" dur="20s" repeatCount="indefinite"/></text></g></svg>`;
}
export function visualRouteFetch(request){
 const url=new URL(request.url);
 if(!['/visual/v1/scene.svg','/visual/v1/health'].includes(url.pathname))return null;
 const h={'Access-Control-Allow-Origin':'*','X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=60'};
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...h,'Access-Control-Allow-Methods':'GET, HEAD, OPTIONS'}});
 if(!['GET','HEAD'].includes(request.method))return new Response('GET or HEAD',{status:405,headers:h});
 if(url.pathname.endsWith('/health'))return new Response(request.method==='HEAD'?null:JSON.stringify({ok:true,protocol:'VISUAL_SCENE_V1',types:TYPES}),{headers:{...h,'Content-Type':'application/json'}});
 if(url.search.length>1200)return new Response('Query too large',{status:413,headers:h});
 const type=url.searchParams.get('type')||'text';
 if(!TYPES.includes(type))return new Response('Unsupported scene',{status:400,headers:h});
 const svg=sample(type,url.searchParams.get('title')||'SVG 연출 테스트',url.searchParams.get('ticker')||'상황에 따른 텍스트 출력');
 return new Response(request.method==='HEAD'?null:svg,{headers:{...h,'Content-Type':'image/svg+xml; charset=utf-8','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; sandbox"}});
}
