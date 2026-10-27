import React,{useState,useRef,useEffect} from 'react';import {createRoot} from 'react-dom/client';
// Shared deterministic rules. No DOM, network, storage or platform globals.
const VERSION = 1;
const ITEMS = {note:'찢어진 근무표',key:'자료실 열쇠',ledger:'출입 기록부'};
const NAMES = {guard:'경비원',detective:'조사관'};
function initialState(){return {v:VERSION,revision:0,scene:'hall',x:1,y:1,minute:545,items:[],speaker:'guard',face:'happy',text:'먼저 복도 끝의 근무표를 확인해 보십시오.',log:[]};}
function validateState(raw){
 const s=typeof raw==='string'?JSON.parse(raw):raw;
 if(!s||s.v!==VERSION)throw Error('지원하지 않는 저장 버전입니다.');
 if(!['hall','archive'].includes(s.scene)||!Number.isInteger(s.x)||s.x<0||s.x>4||!Number.isInteger(s.y)||s.y<0||s.y>2)throw Error('위치가 올바르지 않습니다.');
 if(!Number.isInteger(s.minute)||s.minute<545||s.minute>1440||!Number.isInteger(s.revision)||s.revision<0)throw Error('시간 또는 리비전이 올바르지 않습니다.');
 if(!Array.isArray(s.items)||s.items.some(i=>!Object.hasOwn(ITEMS,i))||new Set(s.items).size!==s.items.length)throw Error('소지품이 올바르지 않습니다.');
 if(s.items.includes('key')&&!s.items.includes('note')||s.items.includes('ledger')&&!s.items.includes('key')||s.scene==='archive'&&!s.items.includes('key'))throw Error('해금 순서가 맞지 않습니다.');
 if(!Object.hasOwn(NAMES,s.speaker)||!['happy','angry'].includes(s.face)||typeof s.text!=='string'||Array.from(s.text).length>180)throw Error('장면 정보가 올바르지 않습니다.');
 if(!Array.isArray(s.log)||s.log.length>30||s.log.some(x=>typeof x!=='string'||x.length>180))throw Error('기록 형식이 올바르지 않습니다.');
 return {v:1,revision:s.revision,scene:s.scene,x:s.x,y:s.y,minute:s.minute,items:[...s.items],speaker:s.speaker,face:s.face,text:s.text,log:[...s.log]};
}
function clock(s){return String(Math.floor(s.minute/60)).padStart(2,'0')+':'+String(s.minute%60).padStart(2,'0');}
function objects(s){return s.scene==='hall'?[{id:'note',x:4,y:0,label:'근무표'},{id:'guard',x:0,y:0,label:'경비원'},{id:'door',x:4,y:2,label:'자료실 문'}]:[{id:'ledger',x:4,y:0,label:'기록부'},{id:'exit',x:0,y:2,label:'복도'}];}
function applyAction(state,a){
 const s=validateState(state); let cost=0, message='';
 if(a.type==='MOVE'){
  if(!Number.isInteger(a.dx)||!Number.isInteger(a.dy)||Math.abs(a.dx)>1||Math.abs(a.dy)>1||(!a.dx&&!a.dy))throw Error('잘못된 이동');
  const x=s.x+a.dx,y=s.y+a.dy;if(x<0||x>4||y<0||y>2)return {state:s,message:'벽에 막혔습니다.'};s.x=x;s.y=y;cost=1;message='이동했습니다.';
 }else if(a.type==='INSPECT'){
  const o=objects(s).find(o=>o.id===a.id);if(!o||Math.max(Math.abs(o.x-s.x),Math.abs(o.y-s.y))>1)return {state:s,message:'대상 옆으로 이동하십시오.'};
  if(a.id==='note'||a.id==='ledger'){
   if(s.items.includes(a.id))return {state:s,message:'이미 확보한 증거입니다.'};
   s.items.push(a.id);cost=2;s.speaker='detective';s.face='angry';s.text=a.id==='note'?'근무표의 시간이 지워져 있다. 경비원에게 보여주자.':'기록부와 근무표의 시간이 다르다. 이제 이 모순을 질문할 수 있다.';message=ITEMS[a.id]+' 획득';
  }else if(a.id==='guard'){
   s.speaker='guard';cost=1;
   if(s.items.includes('note')&&!s.items.includes('key')){s.items.push('key');s.face='angry';s.text='그 종이는 어디서 찾았습니까… 자료실 열쇠를 드리겠습니다.';message='자료실 열쇠 획득';}
   else {s.face='happy';s.text=s.items.includes('key')?'자료실에서 출입 기록을 확인하십시오.':'저는 그 시간에 복도를 지키고 있었습니다.';message='경비원과 대화';}
  }else if(a.id==='door'){
   if(!s.items.includes('key'))return {state:s,message:'잠겨 있습니다. 경비원의 열쇠가 필요합니다.'};
   s.scene='archive';s.x=1;s.y=1;cost=1;message='자료실 입장';s.text='먼지 쌓인 책상 위에 출입 기록부가 놓여 있다.';
  }else {s.scene='hall';s.x=3;s.y=2;cost=1;message='복도로 이동';s.text='다시 복도로 돌아왔다.';}
 }else if(a.type==='PORTRAIT'){
  if(!Object.hasOwn(NAMES,a.speaker)||!['happy','angry'].includes(a.face))throw Error('잘못된 인물');s.speaker=a.speaker;s.face=a.face;message='표시 인물 변경';
 }else if(a.type==='TEXT'){s.text=Array.from(String(a.text||'')).slice(0,180).join('');message='대사 변경';}
 else throw Error('지원하지 않는 행동');
 if(s.minute+cost>1440)return {state:state,message:'하루의 조사 시간이 끝났습니다. AI에게 인계하십시오.'};
 s.minute+=cost;s.revision++;s.log=[...s.log,clock(s)+' '+message].slice(-30);return {state:s,message};
}
function checkpoint(s){return JSON.stringify(validateState(s));}
function handoff(s,user=''){return {protocol:'MYSTERY_LAB_V1',event:'HANDOFF',state:validateState(s),seenText:s.text,user:String(user).slice(0,500),futureIsCanon:false};}
function wrapText(text,max=32){let lines=[''],width=0;for(const c of Array.from(text)){const n=/[\x00-\x7F]/.test(c)?0.55:1;if(c==='\n'||width+n>max){lines.push('');width=0;if(c==='\n')continue;}lines[lines.length-1]+=c;width+=n;}return lines;}

// Registered UUMMAI component: IntegrationScene13. Generated standalone file includes core above.
function IntegrationScene13({initial='',assetBase='https://raw.githubusercontent.com/LEEJWOO/mystery-chatbot-lab/main/assets/',workerBase='',onHandoff}) {
 const [state,setState]=useState(()=>{try{return initial?validateState(initial):initialState()}catch{return initialState()}});
 const live=useRef(state), locked=useRef(false);
 const [notice,setNotice]=useState(initial?'초기 상태를 불러왔습니다. 잘못된 형식이면 기본 상태로 시작합니다.':'근무표 → 경비원 → 자료실 → 기록부 순으로 조사해 보세요.');
 const [input,setInput]=useState(''),[user,setUser]=useState(''),[sent,setSent]=useState(false),[busy,setBusy]=useState(false),[tab,setTab]=useState('scene'),[assetError,setAssetError]=useState(false);
 function act(a){if(locked.current)return;try{const r=applyAction(live.current,a);live.current=r.state;setState(r.state);setNotice(r.message)}catch(e){setNotice(e.message)}}
 function restore(){if(locked.current)return;try{const s=validateState(input);live.current=s;setState(s);setNotice('체크포인트 복원 완료')}catch(e){setNotice('복원 실패: '+e.message)}}
 async function submit(){if(locked.current)return;locked.current=true;setBusy(true);try{const payload='MYSTERY_LAB_V1 '+JSON.stringify(handoff(live.current,user));const send=onHandoff||(typeof sendMessage==='function'?sendMessage:null);if(!send)throw Error('전송 함수가 없습니다. 상태 탭에서 JSON을 복사하십시오.');await send(payload);setSent(true);setNotice('AI에게 인계했습니다. 새 패널에서 이어서 진행하십시오.')}catch(e){locked.current=false;setNotice('전송 실패: '+e.message)}finally{setBusy(false)}}
 const b={border:'1px solid #495368',background:'#233046',color:'#ecf3ff',borderRadius:7,padding:'9px 12px',cursor:'pointer',fontSize:12};
 const full={boxSizing:'border-box',width:'100%',background:'#0d1421',border:'1px solid #495368',borderRadius:6,color:'#e0e9fa',padding:10};
 const layer={position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'contain',pointerEvents:'none'};
 const activeObj=objects(state), assets=assetBase.replace(/\/?$/,'/');
 const bgURL=assets+'lab13-'+state.scene+'.svg';
 const portrait=(id,left)=><div key={id} style={{position:'absolute',left,bottom:0,width:'45%',height:'98%',opacity:state.speaker===id?1:.4,transition:'opacity 150ms'}}>{['body.svg','expression-'+(state.speaker===id?state.face:'happy')+'.png','hair-'+(id==='guard'?'black':'gold')+'.svg','outfit-'+(id==='guard'?'blue':'red')+'.svg'].map(file=><img key={file} src={assets+file} alt='' style={layer} onError={()=>setAssetError(true)}/>)}</div>;
 const workerOK=/^https:\/\/[^\s]+$/.test(workerBase);
 const imageURL=workerOK?workerBase.replace(/\/$/,'')+'/render.svg?state='+encodeURIComponent(checkpoint(state)):'';
 return <div style={{maxWidth:720,margin:'auto',fontFamily:'system-ui,sans-serif',background:'#111927',color:'#e8eef7',border:'1px solid #3b4960',borderRadius:14,overflow:'hidden'}}>
  <header style={{padding:16,display:'flex',justifyContent:'space-between',gap:10}}><div><small style={{color:'#c3a677'}}>MYSTERY / INTEGRATION 13</small><h3 style={{margin:'5px 0'}}>조사 기록실</h3></div><div style={{textAlign:'right'}}>{clock(state)}<br/><small>{state.scene==='hall'?'서쪽 복도':'자료실'} · #{state.revision}</small></div></header>
  <nav style={{display:'flex',gap:6,padding:'0 16px 12px'}}>{[['scene','조사'],['inventory','증거 수첩'],['state','저장 · 연결']].map(([id,label])=><button key={id} style={{...b,background:tab===id?'#725c38':'#233046'}} onClick={()=>setTab(id)}>{label}</button>)}</nav>
  <div style={{height:220,position:'relative',background:state.scene==='hall'?'#566274':'#35383f',overflow:'hidden'}}><img src={bgURL} alt='' style={{...layer,objectFit:'cover'}} onError={()=>setAssetError(true)}/>{portrait('guard','3%')}{portrait('detective','51%')}<span style={{position:'absolute',left:12,top:12,background:'#101827bb',padding:6,fontSize:11}}>인물·표정·의상·배경 레이어</span></div>
  <div style={{padding:'14px 18px',background:'#1b2940',borderBottom:'1px solid #42526a'}}><strong style={{color:'#efcc8e'}}>{NAMES[state.speaker]}</strong><p style={{margin:'8px 0',lineHeight:1.7,whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{state.text}</p></div>
  {assetError&&<p role='alert' style={{padding:12,color:'#ffc98e'}}>이미지 일부를 불러오지 못했습니다. 이미지 허용 도메인과 에셋 주소를 확인하십시오.</p>}
  <div role='status' style={{padding:'10px 16px',color:'#c7d4e8',fontSize:12}}>{notice}</div>
  <fieldset disabled={sent||busy} style={{border:0,padding:'0 16px 16px',margin:0,minWidth:0}}>
  {tab==='scene'&&<div>
   <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:5}}>{Array.from({length:15},(_,i)=>{const x=i%5,y=Math.floor(i/5),o=activeObj.find(o=>o.x===x&&o.y===y),here=state.x===x&&state.y===y;return <div key={i} style={{minHeight:45,padding:5,boxSizing:'border-box',background:here?'#806637':'#1c293c',border:'1px solid #3f4b60',borderRadius:5,fontSize:11,textAlign:'center'}}>{here?'● 나 ':''}{o&&<button style={{...b,padding:4,fontSize:10}} onClick={()=>act({type:'INSPECT',id:o.id})}>{o.label}{o.id==='door'&&!state.items.includes('key')?' 🔒':''}</button>}</div>})}</div>
   <div style={{display:'flex',gap:16,alignItems:'center',marginTop:12}}><div style={{display:'grid',gridTemplateColumns:'repeat(3,44px)',gap:4}}>{[[-1,-1,'↖'],[0,-1,'↑'],[1,-1,'↗'],[-1,0,'←'],[0,0,'·'],[1,0,'→'],[-1,1,'↙'],[0,1,'↓'],[1,1,'↘']].map(([dx,dy,label])=><button key={label} style={b} aria-label={'이동 '+label} disabled={!dx&&!dy} onClick={()=>act({type:'MOVE',dx,dy})}>{label}</button>)}</div><small style={{color:'#a3b1c9',lineHeight:1.7}}>8방향 이동 · 1분/칸<br/>대상 옆에서 이름 클릭<br/>증거 중복 획득 시 시간 소비 없음</small></div>
   <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:12}}>{['guard','detective'].map(s=><button key={s} style={b} onClick={()=>act({type:'PORTRAIT',speaker:s,face:state.face})}>{NAMES[s]}</button>)}{['happy','angry'].map(f=><button key={f} style={b} onClick={()=>act({type:'PORTRAIT',speaker:state.speaker,face:f})}>{f==='happy'?'평온':'경계'}</button>)}</div>
  </div>}
  {tab==='inventory'&&<div><h4>확보한 증거</h4>{state.items.length?state.items.map(id=><p key={id}>✓ {ITEMS[id]}</p>):<p>아직 증거가 없습니다.</p>}<p>자료실: {state.items.includes('key')?'해금됨':'잠김'}</p><p>시간 모순 질문: {state.items.includes('ledger')?'해금됨':'기록부 필요'}</p><details><summary>행동 기록</summary>{state.log.map((line,i)=><p key={i} style={{fontSize:12}}>{line}</p>)}</details></div>}
  {tab==='state'&&<div><p style={{fontSize:12}}>이 패널은 브라우저 저장소 없이 동작합니다. 아래 JSON을 보관하거나 AI 인계 결과를 다음 패널의 initial 인자로 전달하십시오.</p><label>현재 체크포인트<textarea aria-label='현재 체크포인트' readOnly value={checkpoint(state)} rows={5} style={full}/></label><label>복원할 체크포인트<textarea aria-label='복원할 체크포인트' value={input} onChange={e=>setInput(e.target.value)} rows={3} style={full}/></label><button style={b} onClick={restore}>JSON 복원</button><label style={{display:'block',marginTop:12}}>표시 대사 (최대 180자)<textarea value={state.text} onChange={e=>act({type:'TEXT',text:e.target.value})} style={full}/></label><p style={{fontSize:12}}>완성 SVG 이미지 URL: Worker 배포 후 workerBase 인자로 연결합니다. URL에는 현재 대사가 포함됩니다.</p>{imageURL?<textarea readOnly value={'![]('+imageURL+')'} rows={3} style={full}/>:<p style={{color:'#d8b879'}}>Worker 미연결 · JSX 조사 기능은 독립적으로 동작</p>}</div>}
  <div style={{marginTop:18,borderTop:'1px solid #3b4960',paddingTop:12}}><input aria-label='AI에게 전달할 말' placeholder='예: 이 근무표와 기록부의 모순을 추궁한다.' value={user} onChange={e=>setUser(e.target.value)} maxLength={500} style={full}/><button style={{...b,background:'#b4945a',color:'#101827',fontWeight:'bold',width:'100%',marginTop:8}} onClick={submit}>{busy?'인계 중…':sent?'인계 완료':'현재 상태로 AI에게 인계'}</button></div>
  </fieldset>
 </div>;
}

function App(){const [result,setResult]=useState('');return <main><IntegrationScene13 assetBase="./assets/" onHandoff={m=>setResult(m)}/><section style={{maxWidth:720,margin:'20px auto',color:'#ccd5e4',fontFamily:'sans-serif'}}><h3>호스트 수신 결과</h3><p>아래 메시지가 UUMMAI에서는 실제 채팅으로 전송됩니다.</p><textarea aria-label="호스트 수신 결과" readOnly value={result} style={{width:'100%',height:180,boxSizing:'border-box'}}/></section></main>}createRoot(document.getElementById('root')).render(<App/>);