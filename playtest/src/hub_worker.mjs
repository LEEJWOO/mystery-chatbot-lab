import {HUB_WORLD} from './world.generated.mjs';
import {HUB_SPRITES} from './sprites.generated.mjs';
const HUB_CORS={
 'Access-Control-Allow-Origin':'*',
 'Access-Control-Allow-Methods':'GET, HEAD, PUT, OPTIONS',
 'Access-Control-Allow-Headers':'Content-Type, Authorization',
 'X-Content-Type-Options':'nosniff'
};
const reply=(body,type,status=200,cache='public, max-age=120')=>new Response(body,{status,headers:{...HUB_CORS,'Content-Type':type,'Cache-Control':cache}});
const json=(obj,status=200)=>reply(JSON.stringify(obj),'application/json; charset=utf-8',status,'no-store');
export async function hubFetch(request,env={}){
 const u=new URL(request.url),method=request.method,path=u.pathname;
 if(!path.startsWith('/hub/'))return null;
 if(method==='OPTIONS')return new Response(null,{status:204,headers:HUB_CORS});
 if(/^\/hub\/state\/[a-zA-Z0-9_-]{1,64}$/.test(path)){
  if(method!=='PUT'&&method!=='GET')return json({error:'GET or PUT only'},405);
  if(!env.HUB_SAVES)return json({error:'KV storage is not configured',storage:'unavailable'},503);
  const token=request.headers.get('Authorization')||'';
  if(!/^Bearer [a-zA-Z0-9_-]{24,128}$/.test(token))return json({error:'A long random bearer token is required'},401);
  const slot=path.slice('/hub/state/'.length);
  const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode('mystery-hub:v1:'+slot+':'+token.slice(7))));
  const key='hub:'+Array.from(digest,b=>b.toString(16).padStart(2,'0')).join('');
  if(method==='GET'){
   const value=await env.HUB_SAVES.get(key);
   return value?reply(value,'application/json; charset=utf-8',200,'no-store'):json({error:'Slot is empty'},404);
  }
  if(Number(request.headers.get('Content-Length')||0)>65536)return json({error:'Checkpoint too large'},413);
  const body=await request.text();
  if(body.length>60000)return json({error:'Checkpoint too large'},413);
  let state;try{state=JSON.parse(body);}catch{return json({error:'Invalid JSON'},400);}
  if(!state||state.protocol!=='MYSTERY_HUB_V1'||state.worldId!=='archive-night-v1'||!Number.isInteger(state.rev)||state.rev<0)return json({error:'Invalid checkpoint'},400);
  const previous=await env.HUB_SAVES.get(key);
  if(previous){try{const before=JSON.parse(previous);if(before.rev>state.rev)return json({error:'Stale checkpoint',currentRevision:before.rev},409);}catch{}}
  await env.HUB_SAVES.put(key,body,{expirationTtl:30*24*60*60});
  return json({ok:true,revision:state.rev,ttlDays:30});
 }
 if(method!=='GET'&&method!=='HEAD')return json({error:'read-only API'},405);
 let body='',type='application/json; charset=utf-8',status=200;
 if(path==='/hub/health')body=JSON.stringify({ok:true,protocol:'MYSTERY_HUB_V1',version:2,worker:'shared-lab13',storage:env.HUB_SAVES?'kv':'not-enabled'});
 else if(path==='/hub/world.json'){
  const world=JSON.parse(JSON.stringify(HUB_WORLD));
  world.objects=world.objects.map(o=>o.spriteId?{...o,sprites:Object.fromEntries(['front','front-right','right','back-right','back','back-left','left','front-left'].map(v=>[v,u.origin+'/hub/sprites/'+o.spriteId+'/'+v+'.svg']))}:o);
  body=JSON.stringify(world);
 }else if(path==='/hub/manifest.json')body=JSON.stringify({version:2,world:'/hub/world.json',spriteCount:Object.keys(HUB_SPRITES).length,storage:env.HUB_SAVES?'kv':'not-enabled'});
 else if(/^\/hub\/sprites\/[a-z-]+\/(front|front-right|right|back-right|back|back-left|left|front-left)\.svg$/.test(path)){
  const [,,,person,viewExt]=path.split('/'),view=viewExt.replace(/\.svg$/,'');
  const src=HUB_SPRITES[person+'-'+view];
  if(src){body=src;type='image/svg+xml; charset=utf-8';}
  else status=404;
 }else status=404;
 if(status===404)body=JSON.stringify({error:'Not found',path});
 return reply(method==='HEAD'?null:body,type,status);
}