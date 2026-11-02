// UUMMAI lightweight compatibility probe. No import/fetch/storage/base64.
function MysteryVisualProbe({workerBase='',backgroundUrl='',portraitUrl=''}) {
 const kinds=['text','route','incident','evidence'],names=['텍스트','경로','사건','증거'];
 const [idx,setIdx]=useState(0),[revision,setRevision]=useState(0),[status,setStatus]=useState(''),[paused,setPaused]=useState(false);
 const kind=kinds[idx],bg=/^https:\/\//.test(backgroundUrl)?backgroundUrl:'',portrait=/^https:\/\//.test(portraitUrl)?portraitUrl:'';
 const worker=/^https:\/\//.test(workerBase)?workerBase.replace(/\/$/,'')+'/visual/v1/scene.svg?type='+kind+'&title='+encodeURIComponent('SVG '+names[idx]):'';
 const btn={background:'#203c50',border:'1px solid #597b90',borderRadius:8,color:'#eff5f8',padding:'7px 9px',fontSize:12};
 const path='M85 150 L170 150 L268 90 L398 90 L500 140';
 return <div style={{background:'#0b1d2a',color:'#f1f6fa',padding:12,borderRadius:12,maxWidth:650,fontFamily:'system-ui,sans-serif'}}>
  <strong>VISUAL_SCENE_V1 · 플랫폼 렌더 검사</strong>
  <div style={{display:'flex',flexWrap:'wrap',gap:5,margin:'10px 0'}}>
   {kinds.map((k,i)=><button key={k} style={{...btn,background:idx===i?'#3a6b84':'#203c50'}} onClick={()=>{setIdx(i);setRevision(v=>v+1)}}>{names[i]}</button>)}
   <button style={btn} onClick={()=>setPaused(v=>!v)}>{paused?'재생':'정지'}</button>
  </div>
  <div style={{position:'relative',aspectRatio:'640 / 250',background:'#10283b',borderRadius:8,overflow:'hidden'}}>
   {bg?<img src={bg} alt="" onError={()=>setStatus('배경 이미지 로딩 실패')} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>:null}
   {portrait?<img src={portrait} alt="" onError={()=>setStatus('인물 이미지 로딩 실패')} style={{position:'absolute',right:'10%',bottom:0,width:'24%',height:'80%',objectFit:'contain'}}/>:null}
   <svg key={idx+'-'+revision+'-'+paused} viewBox="0 0 640 250" width="100%" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
    <rect x="12" y="12" width="616" height="224" rx="9" stroke="#82b5ca" fill="none"/>
    <text x="25" y="36" fill="#eaf1f5" fontSize="18">{names[idx]} 효과</text>
    {kind==='text'?<text x="25" y="125" fill="#b2e1ef" fontSize="25" opacity={paused?1:0}>가변 텍스트 알림{!paused?<animate attributeName="opacity" from="0" to="1" dur="1s" fill="freeze"/>:null}</text>:null}
    {kind==='route'?<g><path d={path} stroke="#8ec8d1" strokeWidth="3" fill="none"/><circle r="8" fill="#eecb8c">{!paused?<animateMotion path={path} dur="5s" repeatCount="indefinite"/>:null}</circle></g>:null}
    {kind==='incident'?<g><circle cx="130" cy="130" r="26" fill="none" stroke="#93c1cf"/><circle cx="475" cy="130" r="26" fill="none" stroke="#93c1cf"/><path d="M160 130H445" stroke="#e6b188" strokeWidth="3" strokeDasharray="7 7">{!paused?<animate attributeName="stroke-dashoffset" from="70" to="0" dur="1s" repeatCount="indefinite"/>:null}</path></g>:null}
    {kind==='evidence'?<g><path d="M140 110L325 95L485 160" stroke="#91c3ce" strokeWidth="2" fill="none"/>{[[80,85,'목격'],[265,68,'증거'],[425,138,'모순']].map((n,i)=><g key={i}><rect x={n[0]} y={n[1]} width="120" height="48" rx="8" fill="#24465a" stroke={i===2?'#eca99e':'#8ec3ce'}/><text x={n[0]+60} y={n[1]+29} textAnchor="middle" fill="#e7f3f6" fontSize="15">{n[2]}</text></g>)}</g>:null}
    <defs><clipPath id="probe-clip"><rect x="24" y="198" width="592" height="28"/></clipPath></defs>
    <g clipPath="url(#probe-clip)"><text y="216" fontSize="12" fill="#e3eff6" transform="translate(650 0)">상황에 따라 텍스트가 옆으로 흐르는 연출 테스트{!paused?<animateTransform attributeName="transform" type="translate" from="650 0" to="-700 0" dur="15s" repeatCount="indefinite"/>:null}</text></g>
   </svg>
  </div>
  {worker?<div style={{marginTop:10}}><div style={{fontSize:11,color:'#b7d0df'}}>Worker 비상호작용 SVG (별도 이미지 출력)</div><img src={worker} alt="Worker SVG 검사" onLoad={()=>setStatus('Worker SVG 이미지 표시 성공')} onError={()=>setStatus('Worker SVG 이미지 로딩 실패')} style={{width:'100%',display:'block',marginTop:4}}/></div>:null}
  <div style={{fontSize:11,marginTop:7,color:'#c0d2dc'}}>{status||'무과금 UI 검사 · 이미지 실패 시 대체 이미지 없음'}</div>
 </div>;
}