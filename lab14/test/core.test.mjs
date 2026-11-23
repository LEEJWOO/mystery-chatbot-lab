import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,action,visibleObjects,canSeePoint,castRay,lightAt,validateState,checkpoint,handoff,moveCost,passable,observedCells,OBJECTS} from '../src/core.mjs';
import {renderWorld,boxMesh,camera,projectPoint} from '../src/render.mjs';
const find=(s,id)=>visibleObjects(s).some(o=>o.id===id);
const run=(s,a)=>action(s,a).state;
const start=()=>initialState();
test('T01 deterministic ray renderer has opaque wall depths + objects',()=>{
 const s=start(),a=renderWorld(s),b=renderWorld(s);
 assert.equal(a.rays.length,128);assert.equal(JSON.stringify(a),JSON.stringify(b));
 assert(a.rays.some(r=>r.hit));assert(a.objects.some(o=>o.id==='switch'));
});
test('T02 +45 x8 and +90 x4 preserve coordinates/time/inventory',()=>{
 let s=start();const save=[s.player.x,s.player.y,s.clockSec,JSON.stringify(s.inventory)];
 for(let i=0;i<8;i++)s=run(s,{type:'TURN',delta:1});assert.equal(s.player.heading,2);
 for(let i=0;i<4;i++)s=run(s,{type:'TURN',delta:2});assert.equal(s.player.heading,2);
 assert.deepEqual([s.player.x,s.player.y,s.clockSec,JSON.stringify(s.inventory)],save);
});
test('T03 broad FOV excludes rear target and admits flanking directions',()=>{
 let s=start();assert.equal(canSeePoint(s,s.player.x+1.5,s.player.y+.9),true);
 assert.equal(canSeePoint(s,s.player.x-1,s.player.y),false);
 assert.equal(canSeePoint(s,s.player.x+1.5,s.player.y-.9),true);
});
test('T04 perspective scale grows as distance shrinks',()=>{
 const s=start();let c=camera(s);const a=projectPoint(c,s.player.x+3,s.player.y,1.75),b=projectPoint(c,s.player.x+1,s.player.y,1.75);assert(Math.abs(b.y-175)>Math.abs(a.y-175));
});
test('T05 real box face visibility changes with viewpoint',()=>{
 let s=start();s.player={x:3.5,y:3.5,heading:2};let front=boxMesh(camera(s),OBJECTS.find(o=>o.id==='desk'),.9);
 s.player={x:4.5,y:4.5,heading:0};let side=boxMesh(camera(s),OBJECTS.find(o=>o.id==='desk'),.9);
 assert.notDeepEqual(front,side);assert(front.length>0&&side.length>0);
});
test('T06 closed door hides ledger and opening reveals ray passage',()=>{
 let s=start();assert.equal(find(s,'ledger'),false);const h1=castRay(s,3.5,4.5,1,0);
 assert.equal(h1.kind,'door');assert.equal(h1.x,6);
 s.doors.archiveOpen=true;const h2=castRay(s,3.5,4.5,1,0);
 assert.equal(h2.kind,'wall');assert(h2.distance>h1.distance);
 s.lights.archive=true;assert.equal(find(s,'ledger'),true);
});
test('T07 light toggle changes brightness and distant observations',()=>{
 let s=start();s.doors.archiveOpen=true;
 const before=lightAt(s,8.35,4.55);assert(!find(s,'ledger'));
 s.lights.archive=true;const after=lightAt(s,8.35,4.55);assert(after>before);assert(find(s,'ledger'));
});
test('T08 8 directions, closed door, diagonal corner and blocked move 0 time',()=>{
 let s=start();for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)if(dx||dy){assert(moveCost(dx,dy)>0);const q=action(s,{type:'MOVE',dx,dy});assert.equal(q.state.clockSec,s.clockSec+moveCost(dx,dy));}
 s.player={x:5.5,y:4.5,heading:2};const old=s.clockSec;
 let q=action(s,{type:'MOVE',dx:1,dy:0});assert.equal(q.changed,false);assert.equal(q.state.clockSec,old);
 q=action(s,{type:'MOVE',dx:1,dy:-1});assert.equal(q.changed,false);assert.equal(q.state.clockSec,old);
});
test('T09 observe is free, collecting and detailing have explicit cost',()=>{
 let s=start();assert(find(s,'switch'));
 const t=s.clockSec;s=run(s,{type:'OBSERVE',id:'switch'});assert.equal(s.clockSec,t);assert(s.observations.includes('switch'));
 let q=action(s,{type:'ACT',id:'switch',verb:'LIGHT'});assert.equal(q.state.clockSec,t+1);assert.equal(q.state.lights.archive,true);
 assert.equal(q.state.inventory.length,0);
});
test('T10 discovery does not leak all dark right-hand room cells',()=>{
 const s=start();assert(s.discovered.includes('3,4'));assert(!s.discovered.includes('9,7'));assert(s.discovered.length<40);
});
test('T11 checkpoint roundtrip after turn move light',()=>{
 let s=start();s=run(s,{type:'MOVE',dx:1,dy:0});s=run(s,{type:'TURN',delta:-1});s=run(s,{type:'TURN',delta:1});s=run(s,{type:'OBSERVE',id:'switch'});s=run(s,{type:'ACT',id:'switch',verb:'LIGHT'});
 const cp=checkpoint(s);assert.deepEqual(validateState(cp),s);
 assert.deepEqual(renderWorld(validateState(cp)),renderWorld(s));
});
test('T12 one payload preserves action path and user text',()=>{
 let s=start();s=run(s,{type:'MOVE',dx:1,dy:0});let p=handoff(s,'문을 확인한다');assert.equal(p.protocol,'PERSPECTIVE_V1');assert.equal(p.event,'HANDOFF');assert.equal(p.user,'문을 확인한다');assert.deepEqual(p.state,s);assert.deepEqual(p.state.actionLog[0].from,[3,4]);assert.deepEqual(p.state.actionLog[0].to,[4,4]);
});
test('T13 malformed JSON/version/coords rejected and distant hidden object cannot act',()=>{
 assert.throws(()=>validateState('{oops'));let s=start();assert.throws(()=>validateState(JSON.stringify({...s,v:999})));assert.throws(()=>validateState(JSON.stringify({...s,player:{x:-1,y:6,heading:2}})));
 const old=s.clockSec;let q=action(s,{type:'OBSERVE',id:'ledger'});assert.equal(q.changed,false);assert.equal(q.state.clockSec,old);
});