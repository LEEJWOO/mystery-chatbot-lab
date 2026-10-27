// PERSPECTIVE V1 / SINGLE COMPONENT, UUMMAI registration name: PerspectiveScene14

// No import/export/fetch/localStorage, uses UUMMAI React hooks.

// PerspectiveScene14: deterministic world, camera, geometry and actions.
// No React, DOM, fetch, storage, third-party libraries or secrets.
const PROTOCOL='PERSPECTIVE_V1';
const VERSION=2;
const W=11, H=9, TILE_METERS=1.5, WALK_METERS_PER_SECOND=.95;
const FOV_DEGREES=120, VIEW_DISTANCE=9;
const GRID=[
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
const OBJECTS=[
 {id:'desk',kind:'box',label:'나무 책상',x:4.42,y:2.90,w:1.05,d:.65,h:.92,yaw:0,color:'#a77b4a',detail:'책상 표면에 긁힌 흔적이 보인다.',cost:35},
 {id:'note',kind:'paper',label:'접힌 종이',x:3.48,y:3.65,w:.48,d:.32,h:.35,color:'#d2b988',detail:'표면에는 시간이 지워진 근무표가 있다.',cost:25},
 {id:'switch',kind:'switch',label:'조명 스위치',x:5.38,y:4.35,w:.22,d:.15,h:.55,color:'#c7d7e6',detail:'자료실 조명과 연결된 스위치다.',cost:1},
 {id:'guard',kind:'person',label:'경비원 (시험 인물)',x:2.55,y:6.1,w:.40,d:.4,h:1.75,color:'#7995ab',detail:'복도를 지키는 경비원이다.',cost:0},
 {id:'cabinet',kind:'box',label:'수납장',x:8.75,y:2.88,w:.8,d:.85,h:1.9,yaw:0,color:'#567b8d',detail:'측면에 작은 손잡이가 달렸다.',cost:35},
 {id:'ledger',kind:'paper',label:'출입 기록부',x:8.35,y:4.55,w:.66,d:.47,h:.55,color:'#d7c38a',detail:'출입 시간과 이름을 기록한 장부다.',cost:40},
 {id:'door',kind:'door',label:'자료실 문',x:6.5,y:4.5,w:.96,d:.15,h:2.5,color:'#9d7953',detail:'복도와 자료실 사이의 문이다.',cost:4}
];
function clamp(v,lo,hi){return Math.max(lo,Math.min(hi,v));}
function headingVector(h){const a=h*Math.PI/4;return {x:Math.sin(a),y:-Math.cos(a)};}
function tile(x,y){return y>=0&&y<H&&x>=0&&x<W?GRID[y][x]:'#';}
function cellId(x,y){return x+','+y;}
function isBlockingCell(s,x,y){const c=tile(x,y);return c==='#'||(c==='D'&&!s.doors.archiveOpen);}
function passable(s,x,y){return tile(x,y)!=='#'&&!isBlockingCell(s,x,y);}
function clockString(sec){let n=sec%86400;return [Math.floor(n/3600),Math.floor(n/60)%60,Math.floor(n%60)].map(x=>String(x).padStart(2,'0')).join(':');}
function moveCost(dx,dy){return Math.ceil(TILE_METERS*Math.hypot(dx,dy)/WALK_METERS_PER_SECOND);}
function pointDistance(x,y,u,v){return Math.hypot(x-u,y-v);}
// DDA stops at the *first* opaque cell, including the closed door.
function castRay(s,ox,oy,dx,dy,maxRange=VIEW_DISTANCE){
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
function lineOfSight(s,x,y,tx,ty){const d=pointDistance(x,y,tx,ty);if(d<.08)return true;const hit=castRay(s,x,y,tx-x,ty-y,d);return !hit||hit.distance>=d-.08;}
function lightAt(s,x,y){
 let v=x>=7?.12:.43;
 const lights=[{x:3.3,y:2.4,on:true,power:.7,r:5.2},{x:8.2,y:2.6,on:s.lights.archive,power:.9,r:5.1}];
 for(const l of lights){if(!l.on)continue;const d=pointDistance(x,y,l.x,l.y);if(d>=l.r||!lineOfSight(s,l.x,l.y,x,y))continue;v+=l.power*Math.pow(1-d/l.r,1.45);}
 return clamp(v,0,1);
}
function bearingDiff(s,x,y){const f=headingVector(s.player.heading),a=Math.atan2(y-s.player.y,x-s.player.x),front=Math.atan2(f.y,f.x);return Math.atan2(Math.sin(a-front),Math.cos(a-front));}
function canSeePoint(s,x,y,opts={}){
 const d=pointDistance(s.player.x,s.player.y,x,y);
 if(d>VIEW_DISTANCE||Math.abs(bearingDiff(s,x,y))>FOV_DEGREES*Math.PI/360+.02)return false;
 if(opts.door&&tile(Math.floor(x),Math.floor(y))==='D'&&!s.doors.archiveOpen){
  const hit=castRay(s,s.player.x,s.player.y,x-s.player.x,y-s.player.y,d);
  return !!hit&&hit.kind==='door'&&hit.x===Math.floor(x)&&hit.y===Math.floor(y);
 }
 if(!lineOfSight(s,s.player.x,s.player.y,x,y))return false;
 return lightAt(s,x,y)>=.13;
}
function visibleObjects(s){return OBJECTS.filter(o=>canSeePoint(s,o.x,o.y,{door:o.id==='door'}));}
function observedCells(s){const out=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  if(tile(x,y)==='#')continue;
  const cx=x+.5,cy=y+.5;
  if(canSeePoint(s,cx,cy,{door:tile(x,y)==='D'}))out.push(cellId(x,y));
 }
 out.push(cellId(Math.floor(s.player.x),Math.floor(s.player.y)));
 return [...new Set(out)];
}
function initialState(){let s={v:VERSION,protocol:PROTOCOL,revision:0,roomId:'test-wing',player:{x:3.5,y:4.5,heading:2},clockSec:9*3600+5*60,doors:{archiveOpen:false},lights:{archive:false},discovered:[],observations:[],inventory:[],selectedId:null,actionLog:[]};s.discovered=observedCells(s);return s;}
function plainObject(o){return !!o&&typeof o==='object'&&!Array.isArray(o);}
function validateState(raw){
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
function withDiscovery(s){s.discovered=[...new Set([...s.discovered,...observedCells(s)])];return s;}
function action(s0,a){let s=validateState(s0),message='',changed=false,entry=null;
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
function checkpoint(s){return JSON.stringify(validateState(s));}
function handoff(s,user){const ss=validateState(s);return {protocol:PROTOCOL,event:'HANDOFF',state:ss,seenText:'',user:String(user||'').slice(0,500),futureIsCanon:false,changes:summary(ss)};}
function summary(s){const log=s.actionLog;return {moveCount:log.filter(e=>e.type==='MOVE').length,observed:s.observations,inventory:s.inventory,latest:log.slice(-8).map(e=>({type:e.type,timeSec:e.timeSec,from:e.from,to:e.to,objectId:e.objectId}))};}


const VIEW_W=640,VIEW_H=370,VIEW_HORIZON=175, EYE_HEIGHT=1.55,WALL_HEIGHT=2.7,RAY_COUNT=128;
const RAD=Math.PI/180;
function camera(s){const h=s.player.heading*Math.PI/4;const f=headingVector(s.player.heading);return {x:s.player.x,y:s.player.y,fx:f.x,fy:f.y,rx:Math.cos(h),ry:Math.sin(h),scale:VIEW_W/2/Math.tan(FOV_DEGREES*RAD/2)};}
function projectPoint(c,x,y,z=0){const dx=x-c.x,dy=y-c.y,forward=dx*c.fx+dy*c.fy;if(forward<=.11)return null;const sideways=dx*c.rx+dy*c.ry;return {x:VIEW_W/2+sideways*c.scale/forward,y:VIEW_HORIZON+(EYE_HEIGHT-z)*c.scale/forward,depth:forward};}
function rgb(hex,light=1){const s=hex.replace('#','');const n=parseInt(s,16);const k=clamp(light,0.08,1.3);return `rgb(${Math.floor(((n>>16)&255)*k)},${Math.floor(((n>>8)&255)*k)},${Math.floor((n&255)*k)})`;}
const polygon=(verts,fill,stroke='rgba(255,255,255,.17)')=>({kind:'polygon',points:verts.map(p=>p.x.toFixed(1)+','+p.y.toFixed(1)).join(' '),fill,stroke});
function boxMesh(c,o,lum){
 const yaw=o.yaw||0,co=Math.cos(yaw),si=Math.sin(yaw);
 const local=[[-o.w/2,-o.d/2],[o.w/2,-o.d/2],[o.w/2,o.d/2],[-o.w/2,o.d/2]];
 const pts=local.map(([a,b])=>({x:o.x+a*co-b*si,y:o.y+a*si+b*co}));
 const lo=pts.map(p=>projectPoint(c,p.x,p.y,0)),hi=pts.map(p=>projectPoint(c,p.x,p.y,o.h));
 const faces=[];
 for(let i=0;i<4;i++){
  const j=(i+1)%4, ex=pts[j].x-pts[i].x,ey=pts[j].y-pts[i].y;
  const mx=(pts[i].x+pts[j].x)/2,my=(pts[i].y+pts[j].y)/2;
  if((c.x-mx)*ey+(c.y-my)*(-ex)<0)continue;
  const p=[lo[i],lo[j],hi[j],hi[i]];if(p.some(v=>!v))continue;
  faces.push({depth:(p[0].depth+p[1].depth)/2,shape:polygon(p,rgb(o.color,lum*(i%2?.83:.98)))});
 }
 if(hi.every(Boolean))faces.push({depth:hi.reduce((n,p)=>n+p.depth,0)/4,shape:polygon(hi,rgb(o.color,lum*1.12))});
 return faces.sort((a,b)=>b.depth-a.depth).map(f=>f.shape);
}
function renderWorld(s){
 const c=camera(s),fov=FOV_DEGREES*RAD,sz=VIEW_W/RAY_COUNT;
 const rays=[];
 for(let i=0;i<RAY_COUNT;i++){
  const off=(i+.5)/RAY_COUNT-.5,a=s.player.heading*Math.PI/4+off*fov,dx=Math.sin(a),dy=-Math.cos(a);
  const hit=castRay(s,c.x,c.y,dx,dy,VIEW_DISTANCE);
  if(!hit){rays.push({x:i*sz,width:sz+.7,hit:null,depth:Infinity});continue;}
  const depth=Math.max(.12,hit.distance*Math.cos(off*fov));
  const top=VIEW_HORIZON+(EYE_HEIGHT-WALL_HEIGHT)*c.scale/depth;
  const bottom=VIEW_HORIZON+EYE_HEIGHT*c.scale/depth;
  let lum=lightAt(s,hit.hitX-dx*.01,hit.hitY-dy*.01);
  let base=hit.kind==='door'?'#b78b59':'#758798';
  let shade=(hit.side==='x'?.83:1)*(.25+lum*.78);
  let seam=hit.kind==='door'?'#473628':undefined;
  rays.push({x:i*sz,width:sz+.7,y:clamp(top,-3000,3000),height:clamp(bottom-top,0,6000),depth,hit,fill:rgb(base,shade),seam});
 }
 const objects=[];
 for(const o of visibleObjects(s)){
  if(o.id==='door')continue; // closed door is represented by opaque ray columns; open portal stays clear
  if(o.id==='note'&&s.inventory.includes('note'))continue;
  const center=projectPoint(c,o.x,o.y,o.h/2);if(!center)continue;
  const distance=pointDistance(o.x,o.y,c.x,c.y),light=lightAt(s,o.x,o.y);
  const quality=light>=.4?'clear':'dim';
  let shapes=[];
  if(o.kind==='person'){
   const bottom=projectPoint(c,o.x,o.y,0),top=projectPoint(c,o.x,o.y,o.h);
   if(!top||!bottom)continue;const bh=bottom.y-top.y,bw=Math.max(6,bh*.29);
   shapes=[{kind:'person',x:top.x-bw/2,y:top.y,width:bw,height:bh,fill:rgb(o.color,.25+light*.85)}];
  }else if(o.kind==='switch'){
   const p=projectPoint(c,o.x,o.y,o.h);if(!p)continue;
   const size=Math.min(42,c.scale/center.depth*.22);
   shapes=[{kind:'circle',cx:p.x,cy:p.y,r:Math.max(3,size),fill:s.lights.archive?'#bceae4':'#ced4d8'}];
  }else shapes=boxMesh(c,o,.25+light*.85);
  objects.push({id:o.id,label:o.label,distance,depth:center.depth,x:center.x,y:center.y,quality,shapes,clipDepth:Math.max(.1,center.depth-.17)});
 }
 objects.sort((a,b)=>b.depth-a.depth);
 return {camera:c,rays,objects};
}


// UUMMAI single registered component. Hooks are host globals, no import/fetch/storage.
function PerspectiveScene14({initial='',onHandoff}) {
 const boot=()=>{try{return {state:initial?validateState(initial):initialState(),error:''};}catch(e){return {state:initialState(),error:'복원 거부: '+e.message+' (초기 시험 상태 표시 중)';}}};
 const [first]=useState(boot);
 const [state,setState]=useState(first.state),live=useRef(first.state),busyRef=useRef(false);
 const [notice,setNotice]=useState(first.error||'제자리 회전은 0초입니다. 멀리 있는 물건은 가까이 가서 조사하세요.');
 const [selectedTab,setTab]=useState('scene'),[restoreText,setRestoreText]=useState('');
 const [user,setUser]=useState(''),[sent,setSent]=useState(false),[busy,setBusy]=useState(false);
 const view=renderWorld(state);
 const sel=OBJECTS.find(o=>o.id===state.selectedId);
 const visible=visibleObjects(state).some(o=>o.id===state.selectedId);
 const nearby=sel&&pointDistance(state.player.x,state.player.y,sel.x,sel.y)<=2.05;
 const costLabels=[[-1,-1,'↖'],[0,-1,'↑'],[1,-1,'↗'],[-1,0,'←'],[0,0,'·'],[1,0,'→'],[-1,1,'↙'],[0,1,'↓'],[1,1,'↘']];
 const palette={background:'#142230',color:'#edf2f7',border:'1px solid #43546a',borderRadius:8,padding:'9px 10px',fontSize:12,cursor:'pointer'};
 const subtle={background:'#172737',borderRadius:8,padding:10,border:'1px solid #304559'};
 const area={width:'100%',boxSizing:'border-box',padding:10,borderRadius:7,background:'#0b1623',color:'#e5edf5',border:'1px solid #58708a',fontSize:12};
 const label=sel?(visible?sel.label:'선택한 대상은 현재 시야 밖입니다.'):'대상을 클릭하면 무료로 관찰합니다.';
 function act(a){if(busyRef.current)return;try{const out=action(live.current,a);live.current=out.state;setState(out.state);setNotice(out.message);}catch(e){setNotice('행동 거부: '+e.message)}}
 function restore(){if(busyRef.current)return;try{const s=validateState(restoreText);live.current=s;setState(s);setNotice('PERSPECTIVE_V1 상태를 손실 없이 복원했습니다.');setTab('scene');}catch(e){setNotice('복원 거부: '+e.message)}}
 async function submit(){if(busyRef.current)return;busyRef.current=true;setBusy(true);
  try{const fn=onHandoff||(typeof sendMessage==='function'?sendMessage:null);if(!fn)throw Error('sendMessage 또는 onHandoff가 없습니다. JSON을 복사해 수동으로 인계하세요.');
   await Promise.resolve(fn(PROTOCOL+' '+JSON.stringify(handoff(live.current,user))));setSent(true);setNotice('인계 완료. 이전 패널을 잠갔습니다.');
  }catch(e){busyRef.current=false;setNotice('인계 실패: '+e.message);}finally{setBusy(false)}
 }
 const drawShape=(sh,k)=>{
  if(sh.kind==='polygon')return <polygon key={k} points={sh.points} fill={sh.fill} stroke={sh.stroke} strokeWidth="1.4"/>;
  if(sh.kind==='circle')return <circle key={k} cx={sh.cx} cy={sh.cy} r={sh.r} fill={sh.fill} stroke="#cad7e5" strokeWidth="1.5"/>;
  if(sh.kind==='person')return <g key={k}><ellipse cx={sh.x+sh.width/2} cy={sh.y+sh.height*.11} rx={sh.width*.34} ry={sh.height*.11} fill="#c5b9aa"/><rect x={sh.x} y={sh.y+sh.height*.23} width={sh.width} height={sh.height*.55} rx="5" fill={sh.fill}/><path d={`M${sh.x+sh.width*.25} ${sh.y+sh.height*.72}v${sh.height*.28} M${sh.x+sh.width*.75} ${sh.y+sh.height*.72}v${sh.height*.28}`} stroke={sh.fill} strokeWidth={Math.max(3,sh.width*.19)}/></g>;
  return null;
 };
 return <div style={{width:'100%',maxWidth:760,boxSizing:'border-box',margin:'0 auto',fontFamily:'system-ui,sans-serif',background:'#0b1521',color:'#e5edf7',border:'1px solid #43566d',borderRadius:12,overflow:'hidden'}}>
  <div style={{display:'flex',justifyContent:'space-between',padding:'13px 14px 7px',gap:8}}><div><div style={{color:'#a9c1cf',fontSize:10,letterSpacing:1}}>MYSTERY / PERSPECTIVE 14</div><strong style={{fontSize:16}}>시야 기반 조사 테스트</strong></div><div style={{fontSize:12,textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{clockString(state.clockSec)}<div style={{color:'#9bc2cc'}}>위치 {Math.floor(state.player.x)},{Math.floor(state.player.y)} · 향함 {['북','북동','동','남동','남','남서','서','북서'][state.player.heading]}</div></div></div>
  <div style={{display:'flex',gap:5,padding:'5px 13px 10px'}}>{[['scene','탐색'],['note','기록'],['state','저장·인계']].map(([id,t])=><button key={id} onClick={()=>setTab(id)} style={{...palette,background:selectedTab===id?'#42657b':'#152536'}}>{t}</button>)}</div>
  {selectedTab==='scene'&&<div>
   <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} style={{width:'100%',height:'auto',display:'block',background:'#111820',touchAction:'manipulation'}} aria-label="1인칭 2.5D 장면: 사물이나 문을 누르면 0초 관찰">
    <defs><linearGradient id="p14-ceiling" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#111926"/><stop offset="1" stopColor="#3e4d5d"/></linearGradient><linearGradient id="p14-floor" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#424649"/><stop offset="1" stopColor="#151d28"/></linearGradient>
    {view.objects.map(o=><clipPath id={'p14-clip-'+o.id} key={'clip-'+o.id}>{view.rays.filter(r=>r.depth>o.clipDepth).map((r,i)=><rect key={i} x={r.x} y="0" width={r.width+.8} height={VIEW_H}/>)}</clipPath>)}
    </defs>
    <rect x="0" y="0" width={VIEW_W} height={VIEW_HORIZON} fill="url(#p14-ceiling)"/><rect x="0" y={VIEW_HORIZON} width={VIEW_W} height={VIEW_H-VIEW_HORIZON} fill="url(#p14-floor)"/>
    {view.rays.map((r,i)=>r.hit?<rect key={i} x={r.x} y={r.y} width={r.width} height={r.height} fill={r.fill} stroke={r.seam||'none'} strokeWidth={r.hit.kind==='door'?.5:0} onClick={r.hit.kind==='door'?()=>act({type:'OBSERVE',id:'door'}):undefined} style={{cursor:r.hit.kind==='door'?'pointer':'default'}}/>:null)}
    {view.objects.map(o=><g key={o.id} clipPath={'url(#p14-clip-'+o.id+')'} onClick={()=>act({type:'OBSERVE',id:o.id})} style={{cursor:'pointer',opacity:o.quality==='dim'?.64:1}}>{o.shapes.map((sh,i)=>drawShape(sh,i))}{o.depth<5?<text x={o.x} y={Math.min(VIEW_H-12,o.y+40)} fill="#f6f1df" stroke="#0b1724" strokeWidth="3" paintOrder="stroke" textAnchor="middle" fontSize={Math.max(12,15/o.depth*2.8)}>{o.label}</text>:null}</g>)}
    <path d={`M ${VIEW_W/2-7} ${VIEW_HORIZON}h14 M${VIEW_W/2} ${VIEW_HORIZON-7}v14`} stroke="#d1eff7" strokeWidth="1.5" opacity=".65"/>
    <text x="12" y="24" fill="#e7ebdc" fontSize="13" stroke="#182332" strokeWidth="3" paintOrder="stroke">수평 시야 {FOV_DEGREES}° · 오른쪽 수평선 원근투영 · 문/물체 터치</text>
   </svg>
   <div style={{display:'flex',justifyContent:'space-between',gap:8,flexWrap:'wrap',alignItems:'start',padding:'12px 13px 0'}}>
    <div style={{flex:'1 1 158px'}}><div style={{fontSize:11,color:'#aabec9',marginBottom:5}}>8방향 이동 (행동 전 시간 표시)</div><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:5}}>{costLabels.map(([dx,dy,txt])=><button key={txt} disabled={(!dx&&!dy)||sent||busy} onClick={()=>act({type:'MOVE',dx,dy})} style={{...palette,minHeight:40,padding:'5px 3px',opacity:(!dx&&!dy)?.35:1}}>{txt}{(dx||dy)?<span style={{fontSize:9,display:'block',color:'#adc7d6'}}>+{moveCost(dx,dy)}초</span>:null}</button>)}</div></div>
    <div style={{flex:'1 1 165px'}}><div style={{fontSize:11,color:'#aabec9',marginBottom:5}}>무료 제자리 회전</div><div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:5}}>{[[-2,'↶ 90°'],[2,'90° ↷'],[-1,'↶ 45°'],[1,'45° ↷']].map(([delta,t])=><button key={t} disabled={sent||busy} style={{...palette,background:'#243e4b',minHeight:46}} onClick={()=>act({type:'TURN',delta})}>{t}<span style={{fontSize:10,display:'block'}}>0초</span></button>)}</div></div>
    <div style={{...subtle,flex:'0 0 auto'}}><div style={{fontSize:11,color:'#bfd4dc',paddingBottom:6}}>발견된 구역만 표시</div><div style={{display:'grid',gridTemplateColumns:`repeat(${W},12px)`,gap:2}}>{GRID.map((line,y)=>line.split('').map((c,x)=>{const known=state.discovered.includes(cellId(x,y)),here=Math.floor(state.player.x)===x&&Math.floor(state.player.y)===y;const color=here?'#ffd77c':!known?'#131b25':c==='D'?'#b99063':c==='#'?'#17212c':'#5f7886';return <div key={cellId(x,y)} style={{width:12,height:12,borderRadius:2,background:color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:'#13222b'}}>{here?'▲':''}</div>}))}</div><div style={{fontSize:10,color:'#8199a7',marginTop:5}}>▲ 나 · 미탐색=검정</div></div>
   </div>
   <div style={{...subtle,margin:'12px 13px'}}><div style={{fontSize:12,fontWeight:'bold',color:'#f4d2a0'}}>{label}</div><div style={{fontSize:12,color:'#c4d3e1',margin:'7px 0'}}>{visible&&sel?`거리 ${pointDistance(state.player.x,state.player.y,sel.x,sel.y).toFixed(1)}칸 · 상세 행동은 근접 시 가능`: '관찰은 0초, 이동과 세부 행동만 시간이 흐릅니다.'}</div>
    <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>{sel&&visible&&nearby&&sel.id==='door'&&!state.doors.archiveOpen?<button style={palette} disabled={sent||busy} onClick={()=>act({type:'ACT',id:sel.id,verb:'OPEN'})}>문 열기 +4초</button>:null}{sel&&visible&&nearby&&sel.id==='switch'?<button style={palette} disabled={sent||busy} onClick={()=>act({type:'ACT',id:sel.id,verb:'LIGHT'})}>자료실 조명 {state.lights.archive?'끄기':'켜기'} +1초</button>:null}{sel&&visible&&nearby&&sel.id==='note'&&!state.inventory.includes('note')?<button style={palette} disabled={sent||busy} onClick={()=>act({type:'ACT',id:sel.id,verb:'TAKE'})}>종이 수집 +5초</button>:null}{sel&&visible&&nearby&&!['door','guard'].includes(sel.id)?<button style={palette} disabled={sent||busy} onClick={()=>act({type:'ACT',id:sel.id,verb:'DETAIL'})}>자세히 조사 +{sel.cost}초</button>:null}</div>
   </div>
  </div>}
  {selectedTab==='note'&&<div style={{padding:14,fontSize:12}}><h4 style={{margin:'0 0 10px'}}>관찰 기록과 소지품</h4>{state.observations.length?state.observations.map(id=><div key={id} style={{...subtle,marginBottom:5}}>{OBJECTS.find(o=>o.id===id)?.label} · 관찰됨 (획득과 별개)</div>):'아직 관찰한 대상 없음'}<div style={{marginTop:14}}>가방: {state.inventory.length?state.inventory.join(', '):'비어 있음'}</div><div style={{marginTop:12}}>행동 이력 (이동의 정확한 출발·도착·시간 보존): {state.actionLog.length}건</div><div style={{maxHeight:180,overflowY:'auto'}}>{state.actionLog.slice(-15).map((e,i)=><div key={i} style={{padding:4,color:'#b8cedb'}}>{clockString(e.timeSec)} {e.type} {e.from?.join(',')||''} {e.to?.join(',')||''} {e.objectId||''}</div>)}</div></div>}
  {selectedTab==='state'&&<div style={{padding:14,fontSize:12}}><div style={{marginBottom:8}}>체크포인트 (v2, 읽기 전용). 수동 복사 후 다른 패널에서 복원하세요.</div><textarea readOnly rows={5} value={checkpoint(state)} style={area}/><div style={{margin:'12px 0 6px'}}>복원할 JSON</div><textarea rows={4} value={restoreText} onChange={e=>setRestoreText(e.target.value)} style={area}/><button onClick={restore} disabled={sent||busy} style={{...palette,marginTop:7}}>유효성 검사 후 복원</button></div>}
  <div style={{background:'#172636',padding:'11px 13px',fontSize:12,color:'#d8e6ed',borderTop:'1px solid #3b5262'}} role="status">{notice}</div>
  <div style={{padding:'12px 13px'}}><textarea value={user} onChange={e=>setUser(e.target.value.slice(0,500))} placeholder="AI에게 전달할 말 (현재 상태와 하나의 메시지로 전송)" rows={2} style={area} disabled={sent||busy}/><button onClick={submit} disabled={sent||busy} style={{...palette,background:'#9c7950',color:'#fff',width:'100%',marginTop:6,fontWeight:'bold'}}>{sent?'인계됨':busy?'인계 중':'현 상태와 사용자 발화를 AI에 1회 인계'}</button></div>
 </div>;
}