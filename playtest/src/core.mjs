import {HUB_WORLD as MH_DEMO} from './world.generated.mjs';
import {MH_LOCAL_SPRITES} from './local-sprites.generated.mjs';
const MH_PROTOCOL='MYSTERY_HUB_V1';
const MH_VERSION=1;
const MH_W=680,MH_H=408,MH_HORIZON=171,MH_EYE=1.56,MH_WALL=2.85;
const MH_FOV=106,MH_RANGE=10,MH_RAYS=68,MH_TILE_M=1.5,MH_WALK_SPEED=.95;
const MH_HEADINGS=['북','북동','동','남동','남','남서','서','북서'];
function mhclamp(v,a,b){return Math.max(a,Math.min(b,v));}
function mhdistance(a,b,c,d){return Math.hypot(a-c,b-d);}
function mhcell(x,y){return x+','+y;}
const MH_VIEWS=['front','front-right','right','back-right','back','back-left','left','front-left'];
function mhview(o,x,y){const rel=Math.atan2(y-o.y,x-o.x)-(o.yaw||0);return MH_VIEWS[((Math.round(rel/(Math.PI/4))%8)+8)%8];}
function mhobjects(w,s){return w.objects.map(o=>{const steps=o.schedule;if(!Array.isArray(steps)||!steps.length)return o;let pos=null;for(const p of steps){if(Number.isFinite(p.at)&&s.timeSec>=p.at)pos=p;}return pos?{...o,x:pos.x,y:pos.y,yaw:Number.isFinite(pos.yaw)?pos.yaw:o.yaw}:o;});}
function mhobject(w,s,id){return mhobjects(w,s).find(o=>o.id===id);}
function mhroomlight(w,s,x){const room=(w.rooms||[]).find(r=>x>=r.xMin&&x<=r.xMax);if(!room)return .94;return mhclamp(room.onFlag&&s.flags[room.onFlag]?room.onBrightness:room.brightness,.2,1);}
function mhtimeline(w,s,before){for(const e of w.events||[]){if(before<e.at&&s.timeSec>=e.at&&!s.flags[e.flag]){s.flags[e.flag]=true;s.log=[...s.log,{type:'WORLD_EVENT',id:e.id,text:e.text,at:e.at,cost:0}].slice(-96);s.lastWorldEvent=e.text;}}return s;}
function mhreply(w,s0,reply){
 const s=mhvalidate(w,s0),r=typeof reply==='string'?JSON.parse(reply):reply;
 if(!r||typeof r!=='object')throw Error('응답 형식 오류');
 const id=String(r.id||'');if(!/^[-_a-zA-Z0-9]{1,90}$/.test(id))throw Error('응답 ID가 없습니다.');
 if((s.appliedReplies||[]).includes(id))return s;
 const sec=r.elapsedSec;if(!Number.isInteger(sec)||sec<0||sec>900)throw Error('대화 경과시간은 0~900초 정수입니다.');
 if((s.appliedReplies||[]).length>=2048)throw Error('응답 기록 한도에 도달했습니다. 새 세션으로 인계하세요.');
 const old=s.timeSec;s.timeSec+=sec;s.rev++;s.appliedReplies=[...(s.appliedReplies||[]),id];
 s.log=[...s.log,{type:'NPC_REPLY',id,cost:sec,at:old}].slice(-96);mhtimeline(w,s,old);return mhvalidate(w,s);
}

function mhvector(h){const angle=h*Math.PI/4;return {x:Math.sin(angle),y:-Math.cos(angle)};}
function mhbearing(angle){return {x:Math.sin(angle),y:-Math.cos(angle)};}
function mhangleDelta(a,b){return Math.atan2(Math.sin(b-a),Math.cos(b-a));}
function mhworld(raw){
 if(!raw||typeof raw!=='object'||!Array.isArray(raw.rows))throw Error('맵의 rows 배열이 없습니다.');
 const rows=raw.rows,w=rows[0]?.length,h=rows.length;
 if(!raw.id||typeof raw.id!=='string'||raw.id.length>70||!Number.isInteger(w)||w<4||w>160||h<4||h>160||rows.some(r=>typeof r!=='string'||r.length!==w||!/^[.#D]+$/.test(r)))throw Error('맵 크기·타일 형식이 잘못되었습니다.');
 const objects=Array.isArray(raw.objects)?raw.objects:[];
 if(objects.length>500||objects.some(o=>!o||typeof o.id!=='string'||!/^[\w-]{1,55}$/.test(o.id)||typeof o.label!=='string'||o.label.length>90||!Number.isFinite(o.x)||!Number.isFinite(o.y)||!Number.isFinite(o.h)||o.h<=0||o.h>8||!['person','box','paper','switch','door'].includes(o.kind)||o.x<0||o.x>=w||o.y<0||o.y>=h)||new Set(objects.map(o=>o.id)).size!==objects.length)throw Error('맵 오브젝트 구조가 잘못되었습니다.');
 const start=raw.start||{x:2.5,y:2.5,heading:0};
 if(!Number.isFinite(start.x)||!Number.isFinite(start.y)||!Number.isInteger(start.heading)||start.heading<0||start.heading>7)throw Error('시작점 형식 오류');
 if(start.x<0||start.y<0||start.x>=w||start.y>=h||rows[Math.floor(start.y)][Math.floor(start.x)]!=='.')throw Error('시작점은 바닥 칸이어야 합니다.');
 return {...raw,rows,objects,w,h,start,events:Array.isArray(raw.events)?raw.events.slice(0,80):[],rooms:Array.isArray(raw.rooms)?raw.rooms.slice(0,50):[]};
}
function mhtile(world,x,y){return y>=0&&y<world.h&&x>=0&&x<world.w?world.rows[y][x]:'#';}
function mhblocked(world,s,x,y){
 const ch=mhtile(world,x,y);if(ch==='#')return true;if(ch!=='D')return false;
 const door=world.objects.find(o=>o.kind==='door'&&Math.floor(o.x)===x&&Math.floor(o.y)===y);
 return !(door?s.flags?.['door:'+door.id]:s.flags?.doorOpen);
}
function mhvalidPosition(world,s,x,y){return !mhblocked(world,s,Math.floor(x),Math.floor(y));}
function mhwalkCheck(w,s,dx,dy){
 const x=Math.floor(s.player.x),y=Math.floor(s.player.y),nx=x+dx,ny=y+dy;
 const target=mhtile(w,nx,ny);
 if(mhblocked(w,s,nx,ny))return {ok:false,kind:target==='D'?'door':'wall',nx,ny};
 if(dx&&dy&&mhblocked(w,s,x+dx,y)&&mhblocked(w,s,x,y+dy))return {ok:false,kind:'corner',nx,ny};
 return {ok:true,kind:'open',nx,ny};
}
function mhray(world,s,ox,oy,dx,dy,range=MH_RANGE){
 const magnitude=Math.hypot(dx,dy);if(magnitude<.00001)return null;dx/=magnitude;dy/=magnitude;
 let mx=Math.floor(ox),my=Math.floor(oy),sx=dx<0?-1:1,sy=dy<0?-1:1;
 let ux=Math.abs(dx)>1e-8?1/Math.abs(dx):Infinity,uy=Math.abs(dy)>1e-8?1/Math.abs(dy):Infinity;
 let tx=(dx<0?ox-mx:mx+1-ox)*ux,ty=(dy<0?oy-my:my+1-oy)*uy;
 for(let i=0;i<Math.max(20,world.w+world.h+8);i++){
  let dist,side;
  if(tx<ty){dist=tx;tx+=ux;mx+=sx;side='x';}else{dist=ty;ty+=uy;my+=sy;side='y';}
  if(dist>range)return null;
  if(mhblocked(world,s,mx,my))return {dist,x:mx,y:my,side,kind:mhtile(world,mx,my)==='D'?'door':'wall',hx:ox+dx*dist,hy:oy+dy*dist};
 }
 return null;
}
function mhlos(w,s,x,y,tx,ty){const d=mhdistance(x,y,tx,ty);if(d<.08)return true;const hit=mhray(w,s,x,y,tx-x,ty-y,d);return !hit||hit.dist>=d-.09;}
function mhbrightness(w,s,x,y){return mhroomlight(w,s,x);}
function mhvisible(w,s,o){
 if(s.taken?.includes(o.id)||(o.visibleIf&&!s.flags?.[o.visibleIf]))return false;
 const d=mhdistance(s.player.x,s.player.y,o.x,o.y);if(d>MH_RANGE)return false;
 if(o.kind==='person'&&d<.65)return true;
 const f=mhvector(s.player.heading),a=Math.atan2(o.y-s.player.y,o.x-s.player.x),front=Math.atan2(f.y,f.x),off=mhangleDelta(front,a);
 if(Math.abs(off)>MH_FOV*Math.PI/360+.12)return false;
 if(o.kind==='door'&&mhblocked(w,s,Math.floor(o.x),Math.floor(o.y))){const h=mhray(w,s,s.player.x,s.player.y,o.x-s.player.x,o.y-s.player.y,d);return !!h&&h.kind==='door'&&h.x===Math.floor(o.x)&&h.y===Math.floor(o.y);}
 return mhlos(w,s,s.player.x,s.player.y,o.x,o.y)&&mhbrightness(w,s,o.x,o.y)>=.16;
}
function mhseenNow(w,s){const found=[];
 for(let y=Math.max(0,Math.floor(s.player.y-MH_RANGE));y<Math.min(w.h,Math.ceil(s.player.y+MH_RANGE));y++)for(let x=Math.max(0,Math.floor(s.player.x-MH_RANGE));x<Math.min(w.w,Math.ceil(s.player.x+MH_RANGE));x++){
  if(mhtile(w,x,y)==='#')continue;
  const o={x:x+.5,y:y+.5,kind:mhtile(w,x,y)==='D'?'door':'box',id:'~tile'};
  if(mhvisible(w,s,o))found.push(mhcell(x,y));
 }
 found.push(mhcell(Math.floor(s.player.x),Math.floor(s.player.y)));
 return found;
}
function mhinitial(w){const s={protocol:MH_PROTOCOL,v:MH_VERSION,worldId:w.id,rev:0,player:{...w.start},timeSec:Number.isInteger(w.startTimeSec)?w.startTimeSec:32700,flags:{},appearance:{},seen:[],known:[],observed:[],taken:[],selected:null,log:[],appliedReplies:[]};s.seen=mhseenNow(w,s);s.known=mhobjects(w,s).filter(o=>mhvisible(w,s,o)).map(o=>o.id);return s;}
function mhvalidate(w,raw){
 const s=typeof raw==='string'?JSON.parse(raw):raw;
 if(!s||s.protocol!==MH_PROTOCOL||s.v!==MH_VERSION||s.worldId!==w.id)throw Error('체크포인트의 버전·맵 ID가 다릅니다.');
 if(!s.player||!Number.isFinite(s.player.x)||!Number.isFinite(s.player.y)||!Number.isInteger(s.player.heading)||s.player.heading<0||s.player.heading>7||!mhvalidPosition(w,s,s.player.x,s.player.y))throw Error('플레이어 위치/방향 오류');
 if(!Number.isSafeInteger(s.timeSec)||s.timeSec<0||s.timeSec>7*86400||!Number.isSafeInteger(s.rev)||s.rev<0)throw Error('시간/리비전 오류');
 if(!s.flags||typeof s.flags!=='object'||Array.isArray(s.flags)||s.appliedReplies&&!Array.isArray(s.appliedReplies))throw Error('월드 상태 오류');
 if(!Array.isArray(s.seen)||s.seen.length>w.w*w.h||s.seen.some(t=>typeof t!=='string'||!/^\d+,\d+$/.test(t))||!Array.isArray(s.known)||!Array.isArray(s.observed)||!Array.isArray(s.taken)||!Array.isArray(s.log)||s.log.length>120||s.appearance&&typeof s.appearance!=='object')throw Error('상태 목록 오류');
 if(s.selected!==null&&!w.objects.some(o=>o.id===s.selected))throw Error('선택 대상 오류');
 const ids=new Set(w.objects.map(o=>o.id));
 for(const key of ['known','observed','taken'])if(s[key].length>ids.size||new Set(s[key]).size!==s[key].length||s[key].some(id=>!ids.has(id)))throw Error('상태 대상 ID 오류');
 if(s.seen.some(k=>{const [x,y]=k.split(',').map(Number);return x>=w.w||y>=w.h;}))throw Error('발견 좌표 오류');
 if(s.appearance&&(Array.isArray(s.appearance)||s.appearance===null))throw Error('외형 상태 오류');
 if(s.appliedReplies&&(s.appliedReplies.length>2048||new Set(s.appliedReplies).size!==s.appliedReplies.length||s.appliedReplies.some(id=>typeof id!=='string'||!/^[-_a-zA-Z0-9]{1,90}$/.test(id))))throw Error('응답 기록 오류');
 if(s.log.some(e=>!e||typeof e!=='object'||typeof e.type!=='string'||!Number.isInteger(e.at)||e.at<0||e.at>s.timeSec))throw Error('행동 기록 오류');
 return JSON.parse(JSON.stringify(s));
}
function mhcompact(w,s){const a=mhvalidate(w,s);const indices=[...new Set(a.seen.map(k=>{const v=k.split(',').map(Number);return v[1]*w.w+v[0];}).filter(n=>Number.isInteger(n)&&n>=0&&n<w.w*w.h))].sort((x,y)=>x-y);
 const groups={};for(const n of indices){const chunk=Math.floor(n/32),bit=n%32;groups[chunk]=((groups[chunk]||0)|(1<<bit))>>>0;}
 const fog=Object.keys(groups).map(k=>Number(k).toString(36)+':'+groups[k].toString(36)).join('.');
 const {seen,...rest}=a;return {...rest,fog};
}
function mhhandoffState(w,s){
 const state=mhcompact(w,s),keep=new Map();
 for(const e of state.log){
  if(!['WORLD_EVENT','NPC_REPLY','TAKE','OPEN','PUZZLE','TOGGLE'].includes(e.type))continue;
  if(e.type==='PUZZLE'&&!e.success)continue;
  const key=e.type+':'+(e.objectId||e.id||'');
  const row={type:e.type};
  if(e.objectId)row.objectId=e.objectId;
  if(e.id)row.id=e.id;
  if(e.success===true)row.success=true;
  if(Number.isInteger(e.cost)&&e.cost>0)row.cost=e.cost;
  if(Number.isInteger(e.at))row.at=e.at;
  keep.set(key,row);
 }
 state.log=[...keep.values()].slice(-8);
 return state;
}
function mhexpand(w,raw){let obj=typeof raw==='string'?JSON.parse(raw):raw;
 if(obj&&typeof obj.fog==='string'&&!Array.isArray(obj.seen)){
  const seen=[];for(const group of obj.fog.split('.')){if(!group)continue;const [k,v]=group.split(':');const chunk=parseInt(k,36),value=parseInt(v,36),mask=value>>>0;if(!/^[0-9a-z]+:[0-9a-z]+$/.test(group)||!Number.isSafeInteger(chunk)||chunk<0||chunk>=Math.ceil(w.w*w.h/32)||!Number.isSafeInteger(value)||value<0||value>4294967295)throw Error('발견 지도 압축 오류');for(let i=0;i<32;i++)if(mask&(1<<i)){const n=chunk*32+i;if(n<w.w*w.h)seen.push(mhcell(n%w.w,Math.floor(n/w.w)));}}
  obj={...obj,seen};delete obj.fog;
 }
 return mhvalidate(w,obj);
}
function mhclock(n){const s=n%86400;return [Math.floor(s/3600),Math.floor(s/60)%60,s%60].map(x=>String(x).padStart(2,'0')).join(':');}
function mhcost(dx,dy){return Math.ceil(MH_TILE_M*Math.hypot(dx,dy)/MH_WALK_SPEED);}
function mhstep(h,forward,side){const f=mhvector(h),r={x:-f.y,y:f.x};return {dx:Math.round(f.x*forward+r.x*side),dy:Math.round(f.y*forward+r.y*side)};}
function mhmutate(w,s0,a){
 const s=mhvalidate(w,s0),before={...s.player},oldTime=s.timeSec;let notice='',effect=null,event=null;
 if(a.type==='TURN'){
  if(!Number.isInteger(a.delta)||a.delta===0||Math.abs(a.delta)>8)throw Error('회전량 오류');s.player.heading=(s.player.heading+a.delta+8)%8;
  effect={from:before,to:{...s.player},duration:Math.abs(a.delta)*115+115};notice=`${a.delta>0?'오른쪽':'왼쪽'} ${Math.abs(a.delta)*45}° 회전 · 0초`;
 }else if(a.type==='WALK'){
  const {dx,dy}=a.absolute?{dx:a.dx,dy:a.dy}:mhstep(before.heading,a.forward||0,a.side||0);
  if(!Number.isInteger(dx)||!Number.isInteger(dy)||Math.abs(dx)>1||Math.abs(dy)>1||(!dx&&!dy))throw Error('이동 벡터 오류');
  const move=mhwalkCheck(w,s,dx,dy),nx=move.nx,ny=move.ny;
  if(!move.ok){
   const notice=move.kind==='door'?'앞쪽에 닫힌 문이 있습니다. 문을 선택해 열어주세요. +0초':move.kind==='corner'?'양쪽 벽 사이의 좁은 모서리는 통과할 수 없습니다. +0초':'앞쪽 칸이 벽입니다. 시선을 돌려 다른 통로를 찾아보세요. +0초';
   return {state:s,notice,effect:null,changed:false,blocked:move.kind};
  }
  s.player.x=nx+.5;s.player.y=ny+.5;const sec=mhcost(dx,dy);s.timeSec+=sec;
  effect={from:before,to:{...s.player},duration:340};notice=`${sec}초 이동 · ${mhclock(s.timeSec)}`;event={type:'MOVE',dx,dy,cost:sec,at:oldTime};
 }else if(a.type==='LOOK'){
  const o=mhobjects(w,s).find(t=>t.id===a.id&&mhvisible(w,s,t));if(!o)return {state:s,notice:'현재 시야에서 보이는 대상이 아닙니다. +0초',changed:false};
  s.selected=o.id;
  notice=`${o.label} · 거리 ${mhdistance(s.player.x,s.player.y,o.x,o.y).toFixed(1)}칸 · 관찰 0초`;
  event={type:'LOOK',objectId:o.id,at:oldTime};
 }else if(a.type==='TALK_SEND'){
  const o=mhobjects(w,s).find(t=>t.id===a.id&&t.kind==='person'&&mhvisible(w,s,t));
  if(!o||mhdistance(s.player.x,s.player.y,o.x,o.y)>(o.talkRange||4.2))throw Error('현재 대상과 대화할 수 없습니다.');
  notice=`${o.label}와의 대화 인계 준비 · LLM 응답 후 시간 반영`;event={type:'TALK_REQUEST',objectId:o.id,cost:0,at:oldTime};
 }else if(a.type==='ACT'){
  const o=mhobjects(w,s).find(t=>t.id===a.id&&mhvisible(w,s,t));if(!o||o.id!==s.selected)return {state:s,notice:'현재 시야에서 대상을 다시 선택해 주세요. +0초',changed:false};
  const d=mhdistance(s.player.x,s.player.y,o.x,o.y);
  const range=a.verb==='TALK'?(o.talkRange||4.2):['EXAMINE','READ'].includes(a.verb)?3.1:a.verb==='PUZZLE'?2.25:1.9;
  if(d>range)return {state:s,notice:`거리가 ${d.toFixed(1)}칸입니다. ${a.verb==='TALK'?'대화':'행동'} 허용 거리 ${range.toFixed(1)}칸 이내로 이동하세요. +0초`,changed:false};
  if(!(o.verbs||[]).includes(a.verb))return {state:s,notice:'허용되지 않는 행동입니다. +0초',changed:false};
  let sec=0;
  if(a.verb==='TALK'){return {state:s,notice:'인물에게 할 말을 입력해 주세요. 대사는 AI가 생성합니다.',talkTo:o,changed:false};}
  if(a.verb==='READ'){sec=0;notice=o.readText||o.detailHint||o.label;if(o.evidenceId&&!s.observed.includes(o.id))s.observed.push(o.id);}
  if(a.verb==='PUZZLE'){if(o.puzzle?.successFlag&&s.flags[o.puzzle.successFlag])return {state:s,notice:'이미 해결한 장치입니다.',changed:false};return {state:s,notice:'장치를 조작할 수 있습니다.',puzzle:o,changed:false};}
  if(a.verb==='EXAMINE'){sec=o.examSec??20;notice=`${o.detailText||o.detailHint||o.label+'을 조사했습니다.'} (+${sec}초)`;if(o.evidenceId&&!s.observed.includes(o.id))s.observed.push(o.id);}
  if(a.verb==='OPEN'){const key='door:'+o.id;if(s.flags[key])return {state:s,notice:'이미 열린 문입니다. +0초',changed:false};if(o.requiresItem&&!s.taken.includes(o.requiresItem))return {state:s,notice:'잠긴 문입니다. 필요한 열쇠를 먼저 찾아야 합니다. +0초',changed:false};s.flags[key]=true;sec=4;notice=o.label+'을 열었습니다. +4초';}
  if(a.verb==='TOGGLE'){const key=o.flag||'switch:'+o.id;s.flags[key]=!s.flags[key];sec=1;notice=`${o.label} ${s.flags[key]?'켜짐':'꺼짐'} · +1초`;} 
  if(a.verb==='TAKE'){if(s.taken.includes(o.id))return {state:s,notice:'이미 획득했습니다. +0초',changed:false};s.taken.push(o.id);sec=5;notice=`${o.label} 획득 · +5초`;}
  s.timeSec+=sec;event={type:a.verb,objectId:o.id,cost:sec,at:oldTime};
 }else throw Error('알 수 없는 행동입니다.');
 s.rev++;if(event){s.log=[...s.log,event].slice(-96);}mhtimeline(w,s,oldTime);s.seen=[...new Set([...s.seen,...mhseenNow(w,s)])];s.known=[...new Set([...s.known,...mhobjects(w,s).filter(o=>mhvisible(w,s,o)).map(o=>o.id)])];
 return {state:mhvalidate(w,s),notice,effect,changed:true};
}
function mhrgb(c,m=1){const v=/^#[0-9a-f]{6}$/i.test(c||'')?c:'#7b8fa1',n=parseInt(v.slice(1),16),t=mhclamp(m,.1,1.35);return `rgb(${Math.round((n>>16&255)*t)},${Math.round((n>>8&255)*t)},${Math.round((n&255)*t)})`;}
function mhcamera(p){const a=p.angle;const f=mhbearing(a);const scale=MH_W/2/Math.tan(MH_FOV*Math.PI/360);return {...p,fx:f.x,fy:f.y,rx:Math.cos(a),ry:Math.sin(a),scale,horizon:MH_HORIZON+mhclamp(p.pitch||0,-.6,.6)*220};}
function mhproject(c,x,y,z=0){const vx=x-c.x,vy=y-c.y;const dep=vx*c.fx+vy*c.fy;if(dep<.12)return null;const sid=vx*c.rx+vy*c.ry;return {x:MH_W/2+sid*c.scale/dep,y:c.horizon+(MH_EYE-z)*c.scale/dep,dep};}
function mhpoly(points,fill){return {kind:'poly',points:points.map(p=>p.x.toFixed(1)+','+p.y.toFixed(1)).join(' '),fill};}
function mhbox(c,o,light){
 const theta=o.yaw||0,co=Math.cos(theta),si=Math.sin(theta),w=o.w||.7,d=o.d||.6;
 const pts=[[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]].map(([a,b])=>({x:o.x+a*co-b*si,y:o.y+a*si+b*co}));
 const bottom=pts.map(p=>mhproject(c,p.x,p.y,0)),top=pts.map(p=>mhproject(c,p.x,p.y,o.h));const arr=[];
 for(let i=0;i<4;i++){const j=(i+1)%4,dx=pts[j].x-pts[i].x,dy=pts[j].y-pts[i].y,mx=(pts[i].x+pts[j].x)/2,my=(pts[i].y+pts[j].y)/2;
  if((c.x-mx)*dy+(c.y-my)*(-dx)<0)continue;
  const v=[bottom[i],bottom[j],top[j],top[i]];if(v.some(t=>!t))continue;
  arr.push({dep:(v[0].dep+v[1].dep)/2,shape:mhpoly(v,mhrgb(o.color,light*(i%2?.72:.92)))});
 }
 if(top.every(Boolean))arr.push({dep:top.reduce((n,t)=>n+t.dep,0)/4,shape:mhpoly(top,mhrgb(o.color,light*1.08))});
 return arr.sort((a,b)=>b.dep-a.dep).map(t=>t.shape);
}
function mhrender(w,s,pose){
 const c=mhcamera(pose),strip=MH_W/MH_RAYS,field=MH_FOV*Math.PI/180,rays=[],objects=[];
 for(let i=0;i<MH_RAYS;i++){
  const off=(i+.5)/MH_RAYS-.5,a=c.angle+off*field,dir=mhbearing(a),hit=mhray(w,s,c.x,c.y,dir.x,dir.y);
  if(!hit){rays.push({x:i*strip,width:strip+.7,depth:Infinity});continue;}
  const depth=Math.max(.23,hit.dist*Math.cos(off*field)),top=c.horizon+(MH_EYE-MH_WALL)*c.scale/depth,bottom=c.horizon+MH_EYE*c.scale/depth;
  const lum=mhbrightness(w,s,hit.hx-dir.x*.03,hit.hy-dir.y*.03),shade=(hit.side==='x'?.82:1)*(.26+lum*.68);
  rays.push({x:i*strip,width:strip+.7,depth,y:mhclamp(top,-7000,7000),height:mhclamp(bottom-top,0,14000),fill:mhrgb(hit.kind==='door'?'#bd9266':'#829aaa',shade),kind:hit.kind});
 }
 const visible=mhobjects(w,s).filter(o=>{if(o.visibleIf&&!s.flags?.[o.visibleIf]||s.taken?.includes(o.id))return false;const d=mhdistance(c.x,c.y,o.x,o.y);if(d>MH_RANGE)return false;const direction=Math.atan2(o.x-c.x,-(o.y-c.y));if(Math.abs(mhangleDelta(c.angle,direction))>MH_FOV*Math.PI/360+.13)return false;if(o.kind==='door'&&mhblocked(w,s,Math.floor(o.x),Math.floor(o.y)))return false;return mhlos(w,s,c.x,c.y,o.x,o.y)&&mhbrightness(w,s,o.x,o.y)>=.16;});
 for(const o of visible){if(o.kind==='door')continue;
  const center=mhproject(c,o.x,o.y,o.h*.55);if(!center)continue;
  const lum=mhbrightness(w,s,o.x,o.y),dist=mhdistance(c.x,c.y,o.x,o.y),base=Math.max(.42,center.dep);
  const top=mhproject(c,o.x,o.y,o.h),bottom=mhproject(c,o.x,o.y,0);
  if(!top||!bottom)continue;
  let shapes=[];
  if(o.kind==='person'){
   const height=mhclamp(bottom.y-top.y,28,360),width=height*.39,cy=(bottom.y+top.y)/2;
   const sx=center.x-width/2,sy=cy-height/2;
   const key=mhview(o,c.x,c.y);
   const sprite=o.sprites?.[key]||o.sprites?.front||null;
   if(typeof sprite==='string'&&(/^https:\/\/[^\s]+$/i.test(sprite)||/^data:image\/svg\+xml;base64,[A-Za-z0-9+/=]+$/.test(sprite))){const a=Math.atan2(c.y-o.y,c.x-o.x)-(o.yaw||0);shapes=[{kind:'person',x:sx,y:sy,w:width,h:height,frontness:Math.cos(a),sideness:Math.sin(a),lit:lum},{kind:'sprite',x:sx-width*.55,y:sy-height*.02,w:width*2.1,h:height*1.04,href:sprite}];}
   else{const angle=Math.atan2(c.y-o.y,c.x-o.x)-(o.yaw||0);shapes=[{kind:'person',x:sx,y:sy,w:width,h:height,frontness:Math.cos(angle),sideness:Math.sin(angle),lit:lum}];}
    }else if(o.kind==='switch'){
   const size=mhclamp(c.scale/base*.18,7,28);
   shapes=[{kind:'switch',x:center.x,y:center.y,r:size,active:!!s.flags.archive}];
  }else if(o.kind==='paper'){
   const size=mhclamp(c.scale/base*.34,12,98);
   shapes=[{kind:'paper',x:center.x-size/2,y:center.y-size*.35,w:size,h:size*.72}];
  }else shapes=mhbox(c,o,.31+lum*.7);

  const mask=[];let run=-1;
  for(let i=0;i<=rays.length;i++){const ok=i<rays.length&&rays[i].depth>center.dep-.2;if(ok&&run<0)run=i;if(!ok&&run>=0){mask.push({x:run*strip,w:(i-run)*strip+1});run=-1;}}
  objects.push({id:o.id,dep:center.dep,dist,shapes,mask});
 }
 objects.sort((a,b)=>b.dep-a.dep);
 const floor=[];
 for(let y=Math.max(1,Math.floor(c.y-10));y<Math.min(w.h,Math.ceil(c.y+10));y++)for(let x=Math.max(1,Math.floor(c.x-10));x<Math.min(w.w,Math.ceil(c.x+10));x++){
  if(mhtile(w,x,y)==='#')continue;
  if(mhdistance(c.x,c.y,x,y)>9.5)continue;
  for(const [ax,ay,bx,by] of [[x,y,x+1,y],[x,y,x,y+1]]){
   const p=mhproject(c,ax,ay,0),q=mhproject(c,bx,by,0);
   if(p&&q&&p.y>c.horizon&&q.y>c.horizon&&Math.abs(p.x-q.x)<2000)floor.push({a:p,b:q});
  }
 }
 return {rays,objects,floor};
}
function mhScript(raw){
 if(!raw)return [];
 let data=raw;
 if(typeof raw==='string'){
  try{data=JSON.parse(raw);}catch{return [{speaker:'서술',text:raw.slice(0,2000)}];}
 }
 const lines=Array.isArray(data)?data:Array.isArray(data&&data.lines)?data.lines:[];
 return lines.slice(0,16).filter(x=>x&&typeof x==='object').map(x=>({
  speaker:String(x.speaker||x.s||'서술').slice(0,30),
  text:Array.from(String(x.text||x.t||'')).slice(0,800).join(''),
  color:/^#[\da-fA-F]{6}$/.test(x.color||'')?x.color:'#f1f5f9',
  speed:mhclamp(Number(x.speed)||36,10,120),
  shake:mhclamp(Number(x.shake)||0,0,5),
  size:mhclamp(Number(x.size)||19,14,25),
   id:String(x.id||'').slice(0,65),
   speakerId:String(x.speakerId||x.actorId||'').slice(0,55),
   expression:String(x.expression||x.face||'neutral').slice(0,30),
   pose:String(x.pose||'neutral').slice(0,30),
   outfit:String(x.outfit||'').slice(0,45)
 })).filter(x=>x.text);
}
function mhPages(raw,max=32,per=3){
 const pages=[];let text='',column=0,row=0;
 for(const char of Array.from(String(raw))){
  if(row>=per){pages.push(text);text='';column=0;row=0;}
  if(char!=='\n'&&column>=max){row++;column=0;if(row>=per){pages.push(text);text='';row=0;}}
  text+=char;if(char==='\n'){row++;column=0;}else column++;
 }
 if(text||!pages.length)pages.push(text);return pages;
}
// A replay cursor can move backwards; the disclosure ledger only moves forwards.
function mhDisclosure(lines,ledger,index,page,shown){
 const next=[...ledger];const line=lines[index];if(!line)return next;
 const pages=mhPages(line.text),count=pages.slice(0,page).reduce((n,t)=>n+Array.from(t).length,0)+Math.min(shown,Array.from(pages[page]||'').length);
 next[index]=Math.max(next[index]||0,count);return next;
}
function mhSeenSpeech(lines,ledger){return lines.flatMap((line,i)=>{
 const chars=Array.from(line.text),n=Math.min(chars.length,ledger[i]||0);
 return n?[{id:line.id||'cut-'+(i+1),speaker:line.speaker,text:chars.slice(0,n).join(''),complete:n===chars.length}]:[];
});}
function mhDialogueReply(w,state,reply,lines,ledger,partial){
 if(!reply||!lines.length)return state;
 const r=typeof reply==='string'?JSON.parse(reply):reply;
 if(!r||!Number.isInteger(r.elapsedSec)||r.elapsedSec<0||r.elapsedSec>900)throw Error('대화 시간값 오류');
 const full=lines.reduce((n,l)=>n+Array.from(l.text).length,0);
 const seen=mhSeenSpeech(lines,ledger).reduce((n,l)=>n+Array.from(l.text).length,0);
 return mhreply(w,state,{...r,elapsedSec:partial?Math.round(r.elapsedSec*(full?Math.min(seen/full,1):0)):r.elapsedSec});
}
function mhTurnDelta(angle,heading){const target=((Math.round(angle/(Math.PI/4))%8)+8)%8;return ((target-heading+12)%8)-4;}
function mhRestoreUnchanged(w,current,loaded,startedRevision){if(current.rev!==startedRevision)throw Error('복원 중 진행 상태가 변경되었습니다. 다시 복원하세요.');return mhexpand(w,loaded);}

async function mhFetchJSON(url,options={},timeoutMs=12000){
 const controller=typeof AbortController==='function'?new AbortController():null;
 const outer=options.signal,abort=()=>controller?.abort();outer?.addEventListener('abort',abort,{once:true});
 if(outer?.aborted)abort();let timer;
 try{return await Promise.race([
  (async()=>{const response=await fetch(url,{...options,...(controller?{signal:controller.signal}:{})});
   let body;try{body=await response.json();}catch{throw Error('서버 응답이 JSON 형식이 아닙니다.');}
   if(!response.ok)throw Error(body?.error||'HTTP '+response.status);return body;
  })(),
  new Promise((_,reject)=>{timer=setTimeout(()=>{reject(Error('서버 응답 시간 초과'));controller?.abort();},timeoutMs);})
 ]);}finally{clearTimeout(timer);outer?.removeEventListener('abort',abort);}
}

export {MH_DEMO,MH_LOCAL_SPRITES,MH_PROTOCOL,MH_VERSION,MH_W,MH_FOV,MH_HEADINGS,mhclamp,mhdistance,mhcell,MH_VIEWS,mhview,mhobjects,mhobject,mhroomlight,mhtimeline,mhreply,mhvector,mhbearing,mhangleDelta,mhworld,mhtile,mhblocked,mhvalidPosition,mhwalkCheck,mhray,mhlos,mhbrightness,mhvisible,mhseenNow,mhinitial,mhvalidate,mhcompact,mhhandoffState,mhexpand,mhclock,mhcost,mhstep,mhmutate,mhrgb,mhcamera,mhproject,mhpoly,mhbox,mhrender,mhScript,mhPages,mhDisclosure,mhSeenSpeech,mhDialogueReply,mhTurnDelta,mhRestoreUnchanged,mhFetchJSON};
