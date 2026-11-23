import {initialState,validateState} from './core.mjs';
import {renderSVG} from './render.mjs';
import {ASSETS} from './assets.generated.mjs';
import {hubFetch} from '../../playtest/src/hub_worker.mjs';
export default {async fetch(request,env){
 const extra=await hubFetch(request,env);if(extra)return extra;
 const url=new URL(request.url),h={'Access-Control-Allow-Origin':'*','X-Content-Type-Options':'nosniff'};
 const json=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers:{...h,'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...h,'Access-Control-Allow-Methods':'GET, HEAD, OPTIONS'}});
 if(!['GET','HEAD'].includes(request.method))return json({error:'GET only'},405);
 if(url.pathname==='/health')return json({ok:true,version:1,storage:'none',render:'self-contained-svg'});
 if(url.pathname==='/manifest.json')return json({version:1,assets:Object.keys(ASSETS).map(file=>({file,url:url.origin+'/assets/'+file}))});
 if(url.pathname.startsWith('/assets/')){const key=url.pathname.slice(8);if(!ASSETS[key])return json({error:'Not found'},404);const data=ASSETS[key],mime=data.slice(5,data.indexOf(';')),bytes=Uint8Array.from(atob(data.split(',')[1]),c=>c.charCodeAt(0));return new Response(request.method==='HEAD'?null:bytes,{headers:{...h,'Content-Type':mime,'Cache-Control':'public, max-age=3600'}});}
 if(url.pathname!=='/render.svg')return json({error:'Use /health, /manifest.json, /render.svg or /assets/:file'},404);
 if(url.search.length>16000)return json({error:'State too large'},413);
 try{const s=url.searchParams.has('state')?validateState(url.searchParams.get('state')):initialState();const svg=renderSVG(s,ASSETS);return new Response(request.method==='HEAD'?null:svg,{headers:{...h,'Content-Type':'image/svg+xml; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'none'; img-src data:; style-src 'unsafe-inline'; sandbox"}})}catch{return json({error:'Invalid state'},400);}
}};