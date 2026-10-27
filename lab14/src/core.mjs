// PerspectiveScene14: deterministic world, camera, geometry and actions.
// No React, DOM, fetch, storage, third-party libraries or secrets.
export const PROTOCOL='PERSPECTIVE_V1';
export const VERSION=2;
export const W=11, H=9, TILE_METERS=1.5, WALK_METERS_PER_SECOND=.95;
export const FOV_DEGREES=120, VIEW_DISTANCE=9;
export const GRID=[
 '###########',
 '#.....#...#',
 '#.....#...#',
 '#.....#...#',
 '#.....D...#',
 '#.....#...#',
 '#.....#...#',
 '#.....#...#',
 '###########'
];
export const OBJECTS=[
 {id:'desk',kind:'box',label:'나무 책상',x:4.42,y:2.90,w:1.05,d:.65,h:.92,yaw:0,color:'#a77b4a',detail:'책상 표면에 긁힌 흔적이 보인다.',cost:35},
 {id:'note',kind:'paper',label:'접힌 종이',x:3.48,y:3.65,w:.48,d:.32,h:.35,color:'#d2b988',detail:'표면에는 시간이 지워진 근무표가 있다.',cost:25},
 {id:'switch',kind:'switch',label:'조명 스위치',x:5.38,y:4.35,w:.22,d:.15,h:.55,color:'#c7d7e6',detail:'자료실 조명과 연결된 스위치다.',cost:1},
 {id:'guard',kind:'person',label:'경비원 (시험 인물)',x:2.55,y:6.1,w:.40,d:.4,h:1.75,color:'#7995ab',detail:'복도를 지키는 경비원이다.',cost:0},
 {id:'cabinet',kind:'box',label:'수납장',x:8.75,y:2.88,w:.8,d:.85,h:1.9,yaw:0,color:'#567b8d',detail:'측면에 작은 손잡이가 달렸다.',cost:35},
 {id:'ledger',kind:'paper',label:'출입 기록부',x:8.35,y:4.55,w:.66,d:.47,h:.55,color:'#d7c38a',detail:'출입 시간과 이름을 기록한 장부다.',cost:40},
 {id:'door',kind:'door',label:'자료실 문',x:6.5,y:4.5,w:.96,d:.15,h:2.5,color:'#9d7953',detail:'복도와 자료실 사이의 문이다.',cost:4}
];
export function clamp(v,lo,hi){return Math.max(lo,Math.min(hi,v));}
export function headingVector(h){const a=h*Math.PI/4;return {x:Math.sin(a),y:-Math.cos(a)};}
export function tile(x,y){return y>=0&&y<H&&x>=0&&x<W?GRID[y][x]:'#';}
export function cellId(x,y){return x+','+y;}
export function isBlockingCell(s,x,y){const c=tile(x,y);return c==='#'||(c==='D'&&!s.doors.archiveOpen);}
export function passable(s,x,y){return tile(x,y)!=='#'&&!isBlockingCell(s,x,y);}
export function clockString(sec){let n=sec%86400;return [Math.floor(n/3600),Math.floor(n/60)%60,Math.floor(n%60)].map(x=>String(x).padStart(2,'0')).join(':');}
export function moveCost(dx,dy){return Math.ceil(TILE_METERS*Math.hypot(dx,dy)/WALK_METERS_PER_SECOND);}
export function pointDistance(x,y,u,v){return Math.hypot(x-u,y-v);}
// DDA stops at the *first* opaque cell, including the closed door.
export function castRay(s,ox,oy,dx,dy,maxRange=VIEW_DISTANCE){
 const len=Math.hypot(dx,dy);if(!len)return null;dx/=len;dy/=len;
 let mx=Math.floor(ox),my=Math.floor(oy);
 const sx=dx<0?-1:1, sy=dy<0?-1:1;
 const tdX=Math.abs(dx)>1e-10?Math.abs(1/dx):Infinity;
 const tdY=Math.abs(dy)>1e-10?Math.abs(1/dy):Infinity;
 let tX=tdX*(dx<0?ox-mx:mx+1-ox),tY=tdY*(dy<0?oy-my:my+1-oy);
 for(let i=0;i<40;i++){
  let distance,side;
  if(tX<tY){distance=tX;tX+=tdX;mx+=sx;side='x';}
  else {distance=tY;tY+=tdY;my+=sy;side='y';}
  if(distance>maxRange)return null;
  if(isBlockingCell(s,mx,my))return {distance,x:mx,y:my,kind:tile(mx,my)==='D'?'door':'wall',side,hitX:ox+dx*distance,hitY:oy+dy*distance};
 }
 return null;
}
export function lineOfSight(s,x,y,tx,ty){const d=pointDistance(x,y,tx,ty);if(d<.08)return true;const hit=castRay(s,x,y,tx-x,ty-y,d);return !hit||hit.distance>=d-.08;}
export function lightAt(s,x,y){
 let v=x>=7?.12:.43;
 const lights=[{x:3.3,y:2.4,on:true,power:.7,r:5.2},{x:8.2,y:2.6,on:s.lights.archive,power:.9,r:5.1}];
 for(const l of lights){if(!l.on)continue;const d=pointDistance(x,y,l.x,l.y);if(d>=l.r||!lineOfSight(s,l.x,l.y,x,y))continue;v+=l.power*Math.pow(1-d/l.r,1.45);}
 return clamp(v,0,1);
}
export function bearingDiff(s,x,y){const f=headingVector(s.player.heading),a=Math.atan2(y-s.player.y,x-s.player.x),front=Math.atan2(f.y,f.x);return Math.atan2(Math.sin(a-front),Math.cos(a-front));}
export function canSeePoint(s,x,y,opts={}){
 const d=pointDistance(s.player.x,s.player.y,x,y);
 if(d>VIEW_DISTANCE||Math.abs(bearingDiff(s,x,y))>FOV_DEGREES*Math.PI/360+.02)return false;
 if(opts.door&&tile(Math.floor(x),Math.floor(y))==='D'&&!s.doors.archiveOpen){
  const hit=castRay(s,s.player.x,s.player.y,x-s.player.x,y-s.player.y,d);
  return !!hit&&hit.kind==='door'&&hit.x===Math.floor(x)&&hit.y===Math.floor(y);
 }
 if(!lineOfSight(s,s.player.x,s.player.y,x,y))return false;
 return lightAt(s,x,y)>=.13;
}
export function visibleObjects(s){return OBJECTS.filter(o=>canSeePoint(s,o.x,o.y,{door:o.id==='door'}));}
export function observedCells(s){const out=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  if(tile(x,y)==='#')continue;
  const cx=x+.5,cy=y+.5;
  if(canSeePoint(s,cx,cy,{door:tile(x,y)==='D'}))out.push(cellId(x,y));
 }
 out.push(cellId(Math.floor(s.player.x),Math.floor(s.player.y)));
 return [...new Set(out)];
}
export function initialState(){let s={v:VERSION,protocol:PROTOCOL,revision:0,roomId:'test-wing',player:{x:3.5,y:4.5,heading:2},clockSec:9*3600+5*60,doors:{archiveOpen:false},lights:{archive:false},discovered:[],observations:[],inventory:[],selectedId:null,actionLog:[]};s.discovered=observedCells(s);return s;}
function plainObject(o){return !!o&&typeof o==='object'&&!Array.isArray(o);}
export function validateState(raw){
 let s=raw;
 if(typeof raw==='string'){
  if(raw.length>900000)throw Error('저장 JSON이 너무 깁니다.');
  try{s=JSON.parse(raw);}catch{throw Error('JSON 구문 오류입니다.');}
 }
 if(!plainObject(s)||s.v!==VERSION||s.protocol!==PROTOCOL)throw Error('지원되지 않는 상태 버전/프로토콜입니다.');
 if(!plainObject(s.player)||!Number.isFinite(s.player.x)||!Number.isFinite(s.player.y)||!Number.isInteger(s.player.heading)||s.player.heading<0||s.player.heading>7||!passable({doors:s.doors||{}},Math.floor(s.player.x),Math.floor(s.player.y)))throw Error('플레이어 좌표/방향 오류입니다.');
 if(!Number.isInteger(s.clockSec)||s.clockSec<0||s.clockSec>7*86400||!Number.isInteger(s.revision)||s.revision<0||s.roomId!=='test-wing')throw Error('시간/리비전/장소 ID 오류입니다.');
 if(!plainObject(s.doors)||typeof s.doors.archiveOpen!=='boolean'||!plainObject(s.lights)||typeof s.lights.archive!=='boolean')throw Error('문/조명 상태 오류입니다.');
 if(!Array.isArray(s.discovered)||s.discovered.length>W*H||s.discovered.some(t=>typeof t!=='string'||!/^\d+,\d+$/.test(t)||!((()=>{const [x,y]=t.split(',').map(Number);return x>=0&&x<W&&y>=0&&y<H&&tile(x,y)!=='#'})()))||new Set(s.discovered).size!==s.discovered.length)throw Error('발견 지도 데이터 오류입니다.');
 if(!Array.isArray(s.observations)||s.observations.some(x=>typeof x!=='string'||!OBJECTS.some(o=>o.id===x))||new Set(s.observations).size!==s.observations.length)throw Error('관찰 데이터 오류입니다.');
 if(!Array.isArray(s.inventory)||s.inventory.some(x=>x!=='note')||new Set(s.inventory).size!==s.inventory.length)throw Error('소지품 데이터 오류입니다.');
 if(s.selectedId!==null&&!OBJECTS.some(o=>o.id===s.selectedId))throw Error('선택 대상 오류입니다.');
 if(!Array.isArray(s.actionLog)||s.actionLog.length>10000||s.actionLog.some(e=>!plainObject(e)||!Number.isInteger(e.timeSec)||e.timeSec<0||typeof e.type!=='string'||e.type.length>30))throw Error('행동 이력 오류입니다.');
 return JSON.parse(JSON.stringify(s));
}
export function withDiscovery(s){s.discovered=[...new Set([...s.discovered,...observedCells(s)])];return s;}
export function action(s0,a){let s=validateState(s0),message='',changed=false,entry=null;
 const add=(type,fields)=>{entry={type,timeSec:s.clockSec,roomId:s.roomId,...fields};};
 if(a.type==='TURN'){
  if(!Number.isInteger(a.delta)||![1,-1,2,-2].includes(a.delta))throw Error('회전 각도 오류');
  s.player.heading=(s.player.heading+a.delta+8)%8;changed=true;message=(a.delta>0?'우':'좌')+'회전 '+Math.abs(a.delta)*45+'° · 0초';
 }else if(a.type==='MOVE'){
  const {dx,dy}=a;
  if(!Number.isInteger(dx)||!Number.isInteger(dy)||Math.abs(dx)>1||Math.abs(dy)>1||!(dx||dy))throw Error('이동 방향 오류');
  const from=[Math.floor(s.player.x),Math.floor(s.player.y)],tx=from[0]+dx,ty=from[1]+dy;
  if(!passable(s,tx,ty)||(dx&&dy&&(!passable(s,from[0]+dx,from[1])||!passable(s,from[0],from[1]+dy))))return {state:s,message:'벽·닫힌 문·모서리에 막혔습니다. +0초',changed:false};
  const sec=moveCost(dx,dy);const start=s.clockSec;
  s.player.x=tx+.5;s.player.y=ty+.5;s.clockSec+=sec;changed=true;message=`(${from.join(',')}) → (${tx},${ty}) 이동 · +${sec}초`;
  add('MOVE',{from,to:[tx,ty],fromSec:start,toSec:s.clockSec,dx,dy,costSec:sec});
 }else if(a.type==='OBSERVE'){
  const o=visibleObjects(s).find(o=>o.id===a.id);
  if(!o)return {state:s,message:'현재 시야에서 관찰할 수 없습니다. +0초',changed:false};
  s.selectedId=o.id;if(!s.observations.includes(o.id))s.observations.push(o.id);changed=true;
  let q=lightAt(s,o.x,o.y)>=.45&&Math.abs(bearingDiff(s,o.x,o.y))<.65?'정면에서 형태가 분명하다.':'주변부·어둠 때문에 세부 사항은 불분명하다.';
  message=`${o.label} 관찰 · 0초. ${q}`;
  add('OBSERVE',{objectId:o.id,position:[s.player.x,s.player.y],heading:s.player.heading,light:Math.round(lightAt(s,o.x,o.y)*100)/100,perceivedAs:o.label});
 }else if(a.type==='ACT'){
  const o=OBJECTS.find(o=>o.id===a.id);
  if(!o||s.selectedId!==o.id||!visibleObjects(s).some(v=>v.id===o.id))return {state:s,message:'대상을 다시 눈으로 확인해야 합니다. +0초',changed:false};
  const dist=pointDistance(s.player.x,s.player.y,o.x,o.y);
  if(dist>2.05)return {state:s,message:'대상에 더 접근해야 합니다. +0초',changed:false};
  if(a.verb==='DETAIL'&&o.id!=='door'&&o.id!=='guard'){
    s.clockSec+=o.cost;message=o.detail+` (+${o.cost}초)`;changed=true;add('DETAIL',{objectId:o.id,costSec:o.cost});
  }else if(a.verb==='OPEN'&&o.id==='door'){
    if(s.doors.archiveOpen)return {state:s,message:'이미 열린 문입니다. +0초',changed:false};
    s.doors.archiveOpen=true;s.clockSec+=4;message='자료실 문을 열었습니다. +4초';changed=true;add('OPEN_DOOR',{doorId:'archive',costSec:4});
  }else if(a.verb==='LIGHT'&&o.id==='switch'){
    s.lights.archive=!s.lights.archive;s.clockSec+=1;message=`자료실 조명 ${s.lights.archive?'켜짐':'꺼짐'} · +1초`;changed=true;add('TOGGLE_LIGHT',{lightId:'archive',on:s.lights.archive,costSec:1});
  }else if(a.verb==='TAKE'&&o.id==='note'){
    if(s.inventory.includes('note'))return {state:s,message:'이미 수집했습니다. +0초',changed:false};
    s.inventory.push('note');s.clockSec+=5;message='접힌 종이 수집 · +5초';changed=true;add('TAKE',{objectId:'note',costSec:5});
  }else return {state:s,message:'이 행동은 선택할 수 없습니다. +0초',changed:false};
 }else throw Error('지원되지 않는 행동');
 if(changed){s.revision++;if(entry)s.actionLog.push(entry);withDiscovery(s);}return {state:s,message,changed};
}
export function checkpoint(s){return JSON.stringify(validateState(s));}
export function handoff(s,user){const ss=validateState(s);return {protocol:PROTOCOL,event:'HANDOFF',state:ss,seenText:'',user:String(user||'').slice(0,500),futureIsCanon:false,changes:summary(ss)};}
export function summary(s){const log=s.actionLog;return {moveCount:log.filter(e=>e.type==='MOVE').length,observed:s.observations,inventory:s.inventory,latest:log.slice(-8).map(e=>({type:e.type,timeSec:e.timeSec,from:e.from,to:e.to,objectId:e.objectId}))};}