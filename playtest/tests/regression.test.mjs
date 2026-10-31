import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as core from '../src/core.mjs';
import {hubFetch} from '../src/hub_worker.mjs';
const {MH_DEMO,mhworld,mhinitial,mhmutate,mhcompact,mhexpand,mhreply,mhPages,mhDisclosure,mhSeenSpeech,mhDialogueReply,mhTurnDelta,mhFetchJSON}=core;
const w=mhworld(MH_DEMO),initial=()=>mhinitial(w);
function room(rows=['#####','#...#','#...#','#...#','#####']){return mhworld({id:'test',rows,start:{x:2.5,y:2.5,heading:1},objects:[]});}
test('bundled executable and imported core produce identical actions',()=>{
 const code=fs.readFileSync(new URL('../MysteryTestHub.jsx',import.meta.url),'utf8').split('function mhAppearance')[0];
 const c=vm.createContext({});vm.runInContext(code+';globalThis.api={mhworld,mhinitial,mhmutate,MH_DEMO};',c);
 let a=initial(),b=c.api.mhinitial(c.api.mhworld(c.api.MH_DEMO));
 for(const action of [{type:'TURN',delta:1},{type:'WALK',forward:1},{type:'TURN',delta:-1},{type:'WALK',forward:1}]){
  a=mhmutate(w,a,action).state;b=c.api.mhmutate(w,b,action).state;assert.deepEqual(JSON.parse(JSON.stringify(b)),a);
 }
});
test('one blocked side allows diagonal, two blocked sides forbid corner cutting',()=>{
 for(const [rows,ok] of [[['#####','#.#.#','#...#','#...#','#####'],true],[['#####','#.#.#','#..##','#...#','#####'],false]]){
  const r=room(rows),s=mhinitial(r),out=mhmutate(r,s,{type:'WALK',forward:1});assert.equal(out.changed,ok);if(!ok)assert.equal(out.state.timeSec,s.timeSec);
 }
});
test('NPC tiles are traversable and a closed door is still solid',()=>{
 const r=room();r.objects=[{id:'npc',label:'인물',kind:'person',x:3.5,y:1.5,h:1.8}];let s=mhinitial(r);assert.equal(mhmutate(r,s,{type:'WALK',forward:1}).changed,true);
 const d=room(['#####','#..D#','#...#','#...#','#####']);assert.equal(mhmutate(d,mhinitial(d),{type:'WALK',forward:1}).changed,false);
});
test('reply ID remains idempotent after more than 40 other replies and restore',()=>{
 let s=initial();for(let i=0;i<70;i++)s=mhreply(w,s,{id:'r'+i,elapsedSec:1});s=mhexpand(w,mhcompact(w,s));assert.deepEqual(mhreply(w,s,{id:'r0',elapsedSec:500}),s);
});
test('reply and movement cannot cross the supported time boundary',()=>{
 const s=initial();s.timeSec=7*86400;assert.throws(()=>mhreply(w,s,{id:'limit',elapsedSec:1}));assert.throws(()=>mhmutate(w,s,{type:'WALK',forward:1}));assert.equal(s.timeSec,7*86400);
});
test('invalid state IDs, coordinates, reply lists, position and fog are rejected',()=>{
 for(const patch of [{taken:['fake']},{known:['curator','curator']},{seen:['999,1']},{appliedReplies:[null]},{player:{x:0,y:0,heading:0}}])assert.throws(()=>mhexpand(w,{...initial(),...patch}));
 for(const fog of ['0:NaN','0:!!!','0:1oops!','0:zzzzzzzzzz','-1:1','10000:1'])assert.throws(()=>mhexpand(w,{...mhcompact(w,initial()),fog}));
});
test('Unicode and explicit newlines survive pagination exactly',()=>{
 for(const text of ['가'.repeat(800),'🙂가'.repeat(300),'첫 줄\n\n'+('둘째 줄 '.repeat(100))+'\n'])assert.equal(mhPages(text).join(''),text);
 assert.deepEqual(core.mhScript('[null,3,{"text":"정상"}]').map(x=>x.text),['정상']);
});
test('replay and previous-cut navigation never erase disclosed speech or time',()=>{
 const lines=[{speaker:'A',text:'가'.repeat(200)},{speaker:'B',text:'나'.repeat(100)}];let ledger=[];
 ledger=mhDisclosure(lines,ledger,0,2,8);ledger=mhDisclosure(lines,ledger,1,0,40);
 const seen=mhSeenSpeech(lines,ledger),before=mhDialogueReply(w,initial(),{id:'r',elapsedSec:90},lines,ledger,true);
 ledger=mhDisclosure(lines,ledger,0,0,1);assert.deepEqual(mhSeenSpeech(lines,ledger),seen);
 assert.equal(mhDialogueReply(w,initial(),{id:'r',elapsedSec:90},lines,ledger,true).timeSec,before.timeSec);
 assert.equal(seen[1].text.length,40);assert.equal(seen[1].complete,false);
});
test('all 16 disclosed cuts are retained, unrevealed suffix is absent',()=>{
 const lines=Array.from({length:16},(_,i)=>({speaker:'A',text:'line'+i+'SECRET'}));const ledger=lines.map(x=>x.text.length);ledger[15]=4;
 const seen=mhSeenSpeech(lines,ledger);assert.equal(seen.length,16);assert.equal(seen.at(-1).text,'line');assert.equal(seen.at(-1).complete,false);
});
test('rotation remains aligned after multiple full pointer turns',()=>{
 for(const angle of [9,-9,25,-25].map(n=>n*Math.PI/4)){const delta=mhTurnDelta(angle,0),out=mhmutate(w,initial(),{type:'TURN',delta});assert.equal(out.state.player.heading,((Math.round(angle/(Math.PI/4))%8)+8)%8);assert.ok(Math.abs(delta)<=4);}
});
test('late server restore cannot overwrite newer local actions',()=>{
 const a=initial(),b=mhmutate(w,a,{type:'WALK',forward:1}).state;assert.throws(()=>core.mhRestoreUnchanged(w,b,mhcompact(w,a),a.rev));assert.deepEqual(core.mhRestoreUnchanged(w,a,mhcompact(w,a),a.rev).player,a.player);
});
test('network helper rejects HTTP, invalid JSON and hanging requests without mutating state',async()=>{
 const original=globalThis.fetch;
 try{
  globalThis.fetch=async()=>new Response('{"error":"offline"}',{status:503});await assert.rejects(mhFetchJSON('https://test'),/offline/);
  globalThis.fetch=async()=>new Response('<html>');await assert.rejects(mhFetchJSON('https://test'),/JSON/);
  globalThis.fetch=()=>new Promise(()=>{});await assert.rejects(mhFetchJSON('https://test',{},10),/시간 초과/);
 }finally{globalThis.fetch=original;}
});
test('Worker rejects corrupt full saves and equal-revision divergent writes; identical retry succeeds',async()=>{
 const data=new Map(),env={HUB_SAVES:{get:async k=>data.get(k)||null,put:async(k,v)=>data.set(k,v)}},url='https://test/hub/state/s';
 const put=s=>hubFetch(new Request(url,{method:'PUT',headers:{Authorization:'Bearer '+'x'.repeat(32)},body:JSON.stringify(s)}),env);
 const s=mhcompact(w,initial());assert.equal((await put({...s,player:{x:0,y:0,heading:0}})).status,400);
 assert.equal((await put(s)).status,200);assert.equal((await put(s)).status,200);assert.equal((await put({...s,timeSec:s.timeSec+1})).status,409);
});
