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