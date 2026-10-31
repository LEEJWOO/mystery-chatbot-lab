function mhAppearance(sh,key){
 if(sh.kind==='sprite')return <image key={key} href={sh.href} x={sh.x} y={sh.y} width={sh.w} height={sh.h} preserveAspectRatio="xMidYMax meet"/>;
 if(sh.kind==='poly')return <polygon key={key} points={sh.points} fill={sh.fill} stroke="#192938" strokeWidth=".9"/>;
 if(sh.kind==='switch')return <g key={key}><rect x={sh.x-sh.r*.8} y={sh.y-sh.r*1.3} width={sh.r*1.6} height={sh.r*2.6} rx="3" fill="#182f3b" stroke="#9dc2d2" strokeWidth="2"/><circle cx={sh.x} cy={sh.y} r={sh.r*.56} fill={sh.active?'#f8d68e':'#78b2ce'}/><path d={`M${sh.x-sh.r*.3} ${sh.y}h${sh.r*.6}`} stroke="#233e4b" strokeWidth="2"/></g>;
 if(sh.kind==='paper')return <g key={key}><rect x={sh.x+4} y={sh.y+5} width={sh.w} height={sh.h} rx="3" fill="#68594b"/><rect x={sh.x} y={sh.y} width={sh.w} height={sh.h} rx="3" fill="#f3ead2" stroke="#b7a98e" strokeWidth="2"/><path d={`M${sh.x+sh.w*.13} ${sh.y+sh.h*.27}h${sh.w*.69} M${sh.x+sh.w*.13} ${sh.y+sh.h*.47}h${sh.w*.54} M${sh.x+sh.w*.13} ${sh.y+sh.h*.67}h${sh.w*.61}`} stroke="#a9a5a0" strokeWidth="2"/></g>;
 if(sh.kind==='person'){
  const {x,y,w,h,frontness,sideness}=sh;
  const front=frontness>.36,back=frontness<-.36,side=!front&&!back;
  const face=front?'front':back?'back':sideness>0?'right':'left';
  const center=x+w*.5;
  return <g key={key}>
   <ellipse cx={center} cy={y+h*.974} rx={w*.43} ry={h*.025} fill="#000" opacity=".28"/>
   <path d={`M${x+w*.26} ${y+h*.67}L${x+w*.17} ${y+h*.953}Q${x+w*.13} ${y+h*.975} ${x+w*.43} ${y+h*.976}L${x+w*.51} ${y+h*.72}Z`} fill="#293c50" stroke="#1a2b3e" strokeWidth="2"/>
   <path d={`M${x+w*.5} ${y+h*.72}L${x+w*.56} ${y+h*.976}L${x+w*.88} ${y+h*.976}L${x+w*.72} ${y+h*.67}Z`} fill="#314c60" stroke="#1c2b41" strokeWidth="2"/>
   <path d={`M${x+w*.26} ${y+h*.302}Q${center} ${y+h*.24} ${x+w*.75} ${y+h*.302}L${x+w*.81} ${y+h*.7}Q${center} ${y+h*.75} ${x+w*.19} ${y+h*.7}Z`} fill={back?'#344f62':'#486d83'} stroke="#233e54" strokeWidth="2"/>
   <path d={`M${x+w*.25} ${y+h*.32}L${x+w*.035} ${y+h*.58}L${x+w*.08} ${y+h*.7}L${x+w*.26} ${y+h*.61} M${x+w*.75} ${y+h*.32}L${x+w*.97} ${y+h*.57}L${x+w*.91} ${y+h*.71}L${x+w*.74} ${y+h*.6}`} stroke="#416579" strokeWidth={Math.max(3,w*.13)} fill="none" strokeLinecap="round"/>
   <path d={`M${center} ${y+h*.3}V${y+h*.69}`} stroke="#c9dce4" strokeWidth="1.6" opacity=".8"/>
   {front?<g><path d={`M${x+w*.29} ${y+h*.315}L${center} ${y+h*.46}L${x+w*.7} ${y+h*.315}`} fill="none" stroke="#b7cad8" strokeWidth="2"/><path d={`M${center} ${y+h*.42}l${-w*.07} ${h*.16}l${w*.08} ${h*.045}l${w*.075} ${-h*.05}Z`} fill="#b8a4a2"/><rect x={x+w*.62} y={y+h*.49} width={w*.12} height={h*.05} rx="2" fill="#edcf90"/></g>:null}
   {back?<path d={`M${x+w*.28} ${y+h*.42}h${w*.44} M${x+w*.27} ${y+h*.58}h${w*.46}`} stroke="#7594a6" strokeWidth="1.6" opacity=".7"/>:null}
   <rect x={x+w*.4} y={y+h*.23} width={w*.2} height={h*.075} rx="3" fill="#d4b09c"/>
   <ellipse cx={center} cy={y+h*.155} rx={w*(side?.245:.275)} ry={h*.135} fill={back?'#29252c':'#e5c3ac'} stroke="#8e7367" strokeWidth="1.6"/>
   <path d={`M${x+w*.23} ${y+h*.13}Q${x+w*.18} ${y+h*.018} ${center} ${y+h*.014}Q${x+w*.82} ${y+h*.025} ${x+w*.77} ${y+h*.15}L${x+w*.7} ${y+h*.083}Q${center} ${y+h*.07} ${x+w*.3} ${y+h*.13}Z`} fill="#342e35"/>
   {back?<path d={`M${x+w*.245} ${y+h*.10}Q${center} ${y+h*.017} ${x+w*.75} ${y+h*.10}L${x+w*.73} ${y+h*.255}Q${center} ${y+h*.298} ${x+w*.26} ${y+h*.255}Z`} fill="#342e35"/>:null}
   {front?<g><path d={`M${x+w*.375} ${y+h*.155}h${w*.07} M${x+w*.56} ${y+h*.155}h${w*.07}`} stroke="#323037" strokeWidth="2.3" strokeLinecap="round"/><path d={`M${center} ${y+h*.17}l${-w*.025} ${h*.045}l${w*.05} ${h*.008}`} stroke="#a98173" strokeWidth="1.3" fill="none"/><path d={`M${x+w*.44} ${y+h*.25}q${w*.06} ${h*.016} ${w*.12} 0`} stroke="#915e53" strokeWidth="1.7" fill="none"/></g>:null}
   {side?<g><circle cx={center+(sideness>0?w*.08:-w*.08)} cy={y+h*.155} r={Math.max(1.6,w*.02)} fill="#28242b"/><path d={`M${center+(sideness>0?w*.12:-w*.12)} ${y+h*.19}l${(sideness>0?1:-1)*w*.09} ${h*.011}`} stroke="#a78077" strokeWidth="1.5"/></g>:null}
   <text x={center} y={y+h*.83} textAnchor="middle" fill="#dcebf3" fontSize={Math.max(9,w*.11)} opacity=".9">{face==='front'?'◆':face==='back'?'━':'▸'}</text>
  </g>;
 }
 return null;
}
function mhDemo(stage){return {...MH_DEMO,objects:MH_DEMO.objects.map(o=>o.spriteId?{...o,sprites:Object.fromEntries(MH_VIEWS.map(v=>[v,MH_LOCAL_SPRITES[o.spriteId+'-'+v]]))}:o)};}
function MysteryTestHub({stage=1,...props}){
 const match=/^([1-9]\d*)(?:차)?$/.exec(String(stage).trim());
 const n=match?Number(match[1]):NaN;
 if(!Number.isSafeInteger(n))return <div style={{padding:16,color:'#111',background:'#fff'}}>단계는 1 이상의 자연수여야 합니다.</div>;
 return <MysteryHubRuntime key={JSON.stringify([n,props.initial||'',props.reply||'',props.speech||'',props.worldUrl||'',props.worldData||''])} stage={n} {...props}/>;
}
function MHDialoguePortrait({actor,expression='neutral',pose='neutral',outfit=''}){
 const key=String(actor?.npcProfile||actor?.spriteId||actor?.id||'narrator');
 const isCurator=/curator/.test(key),isClerk=/clerk/.test(key),isArchivist=/archivist/.test(key);
 const faceColor=isClerk?'#f4cbb0':isArchivist?'#e9bb9d':'#f3d5b9';
 const hairColor=isClerk?'#44332e':isArchivist?'#2b2931':'#2b263c';
 const coat=outfit==='casual'?'#5b6b80':isClerk?'#76758a':isArchivist?'#50443e':'#293e5d';
 const trim=isArchivist?'#b4a090':'#d6e1e4';
 const angry=/angry|guarded|tense|분노|경계/.test(expression),happy=/happy|smile|relieved|기쁨|웃음/.test(expression),sad=/sad|worried|불안|슬픔/.test(expression);
 const poseShift=/lean|forward|전진/.test(pose)?10:/back|avoid|회피/.test(pose)?-9:0;
 const layers=actor?.portraitLayers||actor?.portrait?.layers;
 const parts=['base','body','outfit','face','hair','expression','accessories'];
 const selectLayer=(kind)=>{const value=layers?.[kind];if(typeof value==='string')return value;if(!value||typeof value!=='object')return '';const variant=kind==='outfit'?(outfit||actor?.portrait?.defaultOutfit||'default'):kind==='expression'?expression:kind==='body'?pose:'default';return value[variant]||value.default||value.neutral||'';};
 const urls=layers&&typeof layers==='object'?parts.map(k=>({k,url:selectLayer(k)})).filter(o=>/^https:\/\/|^data:image\//.test(o.url)):[];
 if(urls.length)return <div aria-label={(actor?.label||'인물')+' 대화 초상화'} style={{width:'100%',height:'100%',position:'relative',pointerEvents:'none'}}>{urls.map(x=><img key={x.k} src={x.url} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'contain',objectPosition:'center bottom'}}/>)}</div>;
 return <svg viewBox="0 0 340 440" width="100%" height="100%" role="img" aria-label={(actor?.label||'인물')+' 독립 대화용 2D 초상화'} preserveAspectRatio="xMidYMax meet" style={{overflow:'visible'}}>
  <defs>
   <linearGradient id={'mh-dialog-coat-'+key} x1="0" y1="0" x2="1" y2="1"><stop stopColor={coat}/><stop offset="1" stopColor="#1d2839"/></linearGradient>
   <linearGradient id={'mh-dialog-hair-'+key} x1="0" y1="0" x2="1" y2="1"><stop stopColor={hairColor}/><stop offset="1" stopColor="#151b28"/></linearGradient>
  </defs>
  <g transform={'translate(0 '+poseShift+')'}>
   <path d="M28 440Q30 330 77 292Q108 264 170 260Q232 267 267 295Q313 336 315 440Z" fill={'url(#mh-dialog-coat-'+key+')'} stroke="#1a2636" strokeWidth="4"/>
   <path d="M116 277L169 335L227 276L215 420H123Z" fill={isArchivist?'#d3c0ab':'#f3f1ed'} stroke="#8f9eaa" strokeWidth="2"/>
   <path d="M162 326L178 326L192 407L171 433L151 405Z" fill={isClerk?'#667e90':isArchivist?'#89765b':'#b2abb1'}/>
   <path d="M94 290L147 371L119 440H51Q51 343 94 290Z M248 288L197 369L222 440H293Q293 344 248 288Z" fill={coat} stroke={trim} strokeWidth="2"/>
   <path d="M151 261L190 261L189 299Q168 313 150 295Z" fill={faceColor}/>
   <ellipse cx="170" cy="179" rx="84" ry="109" fill={faceColor} stroke="#b78e7d" strokeWidth="2"/>
   <ellipse cx="91" cy="188" rx="11" ry="19" fill={faceColor}/><ellipse cx="250" cy="188" rx="11" ry="19" fill={faceColor}/>
   <path d="M90 159Q67 66 124 42Q188 1 238 64Q270 106 254 166L244 120Q227 85 206 80Q137 102 97 134Z" fill={'url(#mh-dialog-hair-'+key+')'} stroke="#242735" strokeWidth="3"/>
   <path d="M95 129Q124 73 166 90Q195 64 237 93Q225 119 182 127Q152 140 95 129Z" fill={hairColor}/>
   <path d={angry?'M113 170L148 178 M191 178L227 170':sad?'M114 177L148 168 M191 168L227 177':'M114 174Q132 167 148 172 M191 172Q211 168 227 174'} stroke={hairColor} strokeWidth="5" fill="none" strokeLinecap="round"/>
   <ellipse cx="134" cy="185" rx="17" ry="10" fill="#fff7f2"/><ellipse cx="209" cy="185" rx="17" ry="10" fill="#fff7f2"/>
   <ellipse cx="135" cy="185" rx="7" ry="9" fill={isCurator?'#705b82':'#63544a'}/><ellipse cx="208" cy="185" rx="7" ry="9" fill={isCurator?'#705b82':'#63544a'}/>
   <circle cx="137" cy="181" r="2.6" fill="#fff"/><circle cx="210" cy="181" r="2.6" fill="#fff"/>
   <path d="M170 191Q162 213 171 215" stroke="#bb8f82" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
   <path d={happy?'M149 231Q170 249 194 230':angry?'M151 239Q169 226 192 240':sad?'M152 245Q170 232 192 245':'M151 236Q171 240 191 236'} stroke="#a86c6e" strokeWidth="3" fill="none" strokeLinecap="round"/>
   {isArchivist?<g stroke="#584e47" strokeWidth="3" fill="none"><rect x="110" y="170" width="51" height="30" rx="10"/><rect x="181" y="170" width="51" height="30" rx="10"/><path d="M161 184Q171 177 181 184"/></g>:null}
   {isClerk?<path d="M89 146Q67 214 100 272L118 266Q100 204 112 170Z" fill={hairColor}/>:null}
   <path d="M76 290Q42 312 30 368L70 383L111 323Z" fill={coat} stroke="#243246" strokeWidth="3"/>
   <path d="M265 291Q297 315 313 366L275 384L230 323Z" fill={coat} stroke="#243246" strokeWidth="3"/>
   <rect x="237" y="344" width="33" height="14" rx="3" fill="#c3a676" stroke="#e7d7ba"/>
  </g>
 </svg>;
}
function MHDialogueBackdrop({room='lobby',brightness=.9,imageUrl=''}){
 const archive=/archive|자료|보관|기록/.test(room),dim=mhclamp(brightness,.3,1);
 if(/^https:\/\//.test(imageUrl))return <img src={imageUrl} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',filter:`brightness(${dim})`}}/>;
 return <svg viewBox="0 0 680 438" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0,filter:`brightness(${dim})`}} aria-hidden="true">
  <defs><linearGradient id="mh-db-wall" x1="0" y1="0" x2="0" y2="1"><stop stopColor={archive?'#283c4d':'#5b6570'}/><stop offset="1" stopColor="#18293b"/></linearGradient><linearGradient id="mh-db-floor" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#6b6060"/><stop offset="1" stopColor="#1b2b3b"/></linearGradient></defs>
  <rect width="680" height="438" fill="url(#mh-db-wall)"/>
  <path d="M0 340L180 270H503L680 338V438H0Z" fill="url(#mh-db-floor)"/>
  <path d="M0 0L185 65H505L680 0M185 65V290M505 65V289" stroke="#a3afbb" strokeOpacity=".18" strokeWidth="5" fill="none"/>
  {archive?<g><rect x="30" y="90" width="157" height="225" rx="3" fill="#343c44" stroke="#8d8175" strokeWidth="6"/><rect x="493" y="90" width="157" height="225" rx="3" fill="#343c44" stroke="#8d8175" strokeWidth="6"/>{[125,185,245].map(y=><g key={y}><path d={`M32 ${y}H182 M496 ${y}H648`} stroke="#9c8371" strokeWidth="6"/>{[45,65,86,109,132,154].map(x=><g key={x}><rect x={x} y={y-27} width="12" height="24" fill={x%2?'#9e8870':'#61748a'}/><rect x={x+462} y={y-27} width="12" height="24" fill="#89908c"/></g>)}</g>)}</g>:<g><rect x="28" y="126" width="132" height="175" rx="6" fill="#324b5c" stroke="#8b9ca9" strokeWidth="5"/><rect x="527" y="116" width="129" height="185" rx="6" fill="#344b57" stroke="#8b9ca9" strokeWidth="5"/><path d="M35 170H153 M535 160H649" stroke="#7b99a9" strokeWidth="4"/><rect x="281" y="68" width="117" height="188" fill="#4f5d68" stroke="#9db3bf" strokeWidth="6"/><path d="M339 70V253" stroke="#90a5b5" strokeWidth="3"/></g>}
  <rect x="188" y="277" width="306" height="21" rx="4" fill="#917762"/><path d="M201 297V384M479 297V384" stroke="#4f403f" strokeWidth="12"/>
  <rect x="0" y="0" width="680" height="438" fill="#08121c" opacity=".12"/>
 </svg>;
}
function MysteryHubRuntime({stage=1,initial='',speech='',reply='',worldUrl='',worldData='',appearance='',onHandoff}){
 const bootError=useRef('');
 const [world,setWorld]=useState(()=>{try{return mhworld(worldData?(typeof worldData==='string'?JSON.parse(worldData):worldData):mhDemo(stage));}catch(e){bootError.current=e.message;return mhworld(mhDemo(stage));}});
 const [worldStatus,setWorldStatus]=useState(worldUrl?'지도 연결 확인 중':'내장 지도');
 const [worldError,setWorldError]=useState('');
 const [loadingWorld,setLoadingWorld]=useState(!!worldUrl),[ioBusy,setIoBusy]=useState(false),[syncTick,setSyncTick]=useState(0);
 const ioRef=useRef(false),disclosureRef=useRef([]);
 const [state,setState]=useState(()=>{try{let value=initial?mhexpand(world,initial):mhinitial(world);if(reply&&!mhScript(speech).length)value=mhreply(world,value,reply);if(appearance){const a=typeof appearance==='string'?JSON.parse(appearance):appearance;if(a&&typeof a==='object'&&!Array.isArray(a))value.appearance={...value.appearance,...a};}return value;}catch(e){bootError.current=e.message;return mhinitial(world);}});
 const live=useRef(state),anim=useRef(null),poseRef=useRef({...state.player,angle:state.player.heading*Math.PI/4,pitch:0}),lockRef=useRef(false),sentRef=useRef(false);
 const [pose,setPose]=useState(poseRef.current),[busy,setBusy]=useState(false);
 const [notice,setNotice]=useState(bootError.current?'복원 대기/오류: '+bootError.current:'');
 const [tab,setTab]=useState('scene'),[message,setMessage]=useState(''),[restoreText,setRestoreText]=useState(''),[talkTarget,setTalkTarget]=useState(null),[saveSlot,setSaveSlot]=useState('playtest'),[saveToken,setSaveToken]=useState(''),[saveStatus,setSaveStatus]=useState('서버 저장은 선택 사항이며 KV 연동 후 사용 가능합니다.'),[autoSync,setAutoSync]=useState(false);
 const [sent,setSent]=useState(false),[pending,setPending]=useState(false),[activePuzzle,setActivePuzzle]=useState(null),[puzzleInput,setPuzzleInput]=useState(''),[puzzleSeconds,setPuzzleSeconds]=useState(null);
 const puzzleDeadline=useRef(null),puzzleExpired=useRef(false),lastSyncedRevision=useRef(-1);
 const [dialogueIndex,setDialogueIndex]=useState(0),[pageIndex,setPageIndex]=useState(0),[shown,setShown]=useState(0),[shakeTick,setShakeTick]=useState(0),[interruption,setInterruption]=useState(false),[dialogueExited,setDialogueExited]=useState(false),[dialogueHistory,setDialogueHistory]=useState(false);
 const drag=useRef(null),suppressClick=useRef(false),mapDrag=useRef(null),mapClickBlock=useRef(false);
 const [mapPan,setMapPan]=useState({x:0,y:0});const [actionPage,setActionPage]=useState(0);
 const lines=useMemo(()=>mhScript(speech),[speech]),line=lines[dialogueIndex]||null,dialoguePages=line?mhPages(line.text):[],pageText=dialoguePages[pageIndex]||'';
 const pageChars=Array.from(pageText),visibleText=pageChars.slice(0,shown).join(''),fullyShown=shown>=pageChars.length;
 const objectsNow=useMemo(()=>mhobjects(world,state),[world,state]);
 const present=objectsNow.filter(o=>mhvisible(world,state,o)).sort((a,b)=>mhdistance(state.player.x,state.player.y,a.x,a.y)-mhdistance(state.player.x,state.player.y,b.x,b.y));
 const selected=present.find(o=>o.id===state.selected)||null;
 const selectedDist=selected?mhdistance(state.player.x,state.player.y,selected.x,selected.y):Infinity;
 const stageTitle=world.title||'조사 현장',dialogueMode=(!dialogueExited&&lines.length>0)||!!talkTarget;
 const screenLocked=sent||pending||busy||loadingWorld||ioBusy||!!bootError.current|| (!!line&&!dialogueExited) || !!talkTarget, dialogueSendLocked=sent||pending||busy||loadingWorld||ioBusy||!!bootError.current;
 const frame=useMemo(()=>mhrender(world,state,pose),[world,state,pose]);
 const card={background:'#122636',border:'1px solid #304d60',borderRadius:10,color:'#e5f0f6'};
 const btn={background:'#193447',border:'1px solid #527386',borderRadius:9,padding:'9px 8px',fontSize:12,color:'#e9f2f7',fontFamily:'inherit',cursor:'pointer',minHeight:36};
 const box={padding:10,width:'100%',boxSizing:'border-box',background:'#0b1e2d',color:'#ecf3f8',border:'1px solid #506b7c',borderRadius:8,fontSize:13,fontFamily:'inherit'};
 const headingAngle=state.player.heading*Math.PI/4;
 const mapWidth=Math.min(9,world.w),mapHeight=Math.min(9,world.h);
 const mapBaseX=mhclamp(Math.floor(state.player.x)-Math.floor(mapWidth/2),0,world.w-mapWidth);
 const mapBaseY=mhclamp(Math.floor(state.player.y)-Math.floor(mapHeight/2),0,world.h-mapHeight);
 const mapStartX=mhclamp(mapBaseX+mapPan.x,0,world.w-mapWidth);
 const mapStartY=mhclamp(mapBaseY+mapPan.y,0,world.h-mapHeight);
 const forwardStep=mhstep(state.player.heading,1,0);
 const forwardCheck=mhwalkCheck(world,state,forwardStep.dx,forwardStep.dy);
 const known=new Set(state.seen),knownIds=new Set(state.known);
 const mapFound=(x,y)=>known.has(mhcell(x,y))||(mhtile(world,x,y)==='#'&&[[0,1],[0,-1],[1,0],[-1,0]].some(([dx,dy])=>known.has(mhcell(x+dx,y+dy))));
 const mapObjects=objectsNow.filter(o=>knownIds.has(o.id)&&mapFound(Math.floor(o.x),Math.floor(o.y))&&!state.taken.includes(o.id)&&(o.kind!=='person'||present.some(p=>p.id===o.id)));
 const mapCellmates=new Map();for(const o of mapObjects){const k=mhcell(Math.floor(o.x),Math.floor(o.y));if(!mapCellmates.has(k))mapCellmates.set(k,[]);mapCellmates.get(k).push(o.id);}
 const loadedWorldId=world.id;
 const room=world.rooms?.find(r=>state.player.x>=r.xMin&&state.player.x<=r.xMax)||null;
 const roomName=room?.label||({lobby:'로비',archive:'기록실',hall:'복도',storage:'창고'})[room?.id]||stageTitle;
 const dialogueActor=talkTarget?world.objects.find(o=>o.kind==='person'&&o.id===talkTarget):line&&!dialogueExited&&!['서술','narrator','system'].includes(line.speaker)?(world.objects.find(o=>o.kind==='person'&&(o.id===line.speakerId||o.label===line.speaker||o.label.split(' · ')[0]===line.speaker||o.label.includes(line.speaker)))||world.objects.find(o=>o.kind==='person'&&o.id===state.selected)):null;
 const finalCut=!!line&&dialogueIndex===lines.length-1&&pageIndex===dialoguePages.length-1&&fullyShown;
 const sceneBackground=world.dialogueBackgrounds?.[room?.id||'']||'';
 function stopAnim(){if(anim.current){if(anim.current.raf&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(anim.current.id);else clearTimeout(anim.current.id);anim.current=null;}lockRef.current=false;setBusy(false);}
 function animate(to,duration=260){
  stopAnim();lockRef.current=true;setBusy(true);
  const from={...poseRef.current},start=Date.now();
  function tick(){const p=mhclamp((Date.now()-start)/duration,0,1),ease=p*p*(3-2*p);
   const next={x:from.x+(to.x-from.x)*ease,y:from.y+(to.y-from.y)*ease,angle:from.angle+(to.angle-from.angle)*ease,pitch:(from.pitch||0)+((to.pitch||0)-(from.pitch||0))*ease};
   poseRef.current=next;setPose(next);
   if(p<1){if(typeof requestAnimationFrame==='function')anim.current={raf:true,id:requestAnimationFrame(tick)};else anim.current={raf:false,id:setTimeout(tick,30)};}
   else{anim.current=null;lockRef.current=false;setBusy(false);}
  }
  tick();
 }
 function execute(action){
  if(lockRef.current||sentRef.current||pending||loadingWorld||ioRef.current||bootError.current||dialogueMode||activePuzzle)return;
  try{
   const before=live.current.player,res=mhmutate(world,live.current,action);
   setNotice(res.state?.lastWorldEvent&&res.state.lastWorldEvent!==live.current.lastWorldEvent?res.state.lastWorldEvent:(res.notice||''));
   if(res.talkTo){setTalkTarget(res.talkTo.id);setMessage('');setTab('scene');return;}
   if(res.puzzle){const seconds=Number(res.puzzle.puzzle?.timeLimitSec)||0;puzzleDeadline.current=seconds>0?Date.now()+seconds*1000:null;puzzleExpired.current=false;setPuzzleSeconds(seconds>0?seconds:null);setActivePuzzle(res.puzzle.id);setPuzzleInput('');return;}
   if(!res.changed)return;
   live.current=res.state;setState(res.state);
   if(res.effect){const end={...res.state.player,angle:action.type==='TURN'?poseRef.current.angle+action.delta*Math.PI/4:poseRef.current.angle};
    animate(end,action.type==='TURN'?mhclamp(Math.abs(action.delta)*105+130,180,580):330);
   }
  }catch(e){setNotice('행동 불가: '+e.message);}
 }
 function onPointerDown(e){if(screenLocked||tab!=='scene'||activePuzzle||e.isPrimary===false)return;drag.current={x:e.clientX,y:e.clientY,angle:poseRef.current.angle,pitch:poseRef.current.pitch||0,moved:false};if(e.currentTarget?.setPointerCapture)try{e.currentTarget.setPointerCapture(e.pointerId);}catch{}}
 function onPointerMove(e){const d=drag.current;if(!d||e.isPrimary===false)return;
  const dx=e.clientX-d.x,dy=e.clientY-d.y;if(Math.hypot(dx,dy)>5)d.moved=true;
  if(!d.moved)return;
  const angle=d.angle+dx/85*Math.PI/4,pitch=mhclamp(d.pitch-dy/220,-.55,.55);
  poseRef.current={...poseRef.current,angle,pitch};setPose(poseRef.current);
 }
 function onPointerEnd(e){const d=drag.current;if(!d)return;drag.current=null;
  if(!d.moved)return;suppressClick.current=true;
  const current=poseRef.current,nearest=Math.round(current.angle/(Math.PI/4));
  const old=live.current.player.heading,delta=mhTurnDelta(current.angle,old);
  if(delta){const r=mhmutate(world,live.current,{type:'TURN',delta});live.current=r.state;setState(r.state);setNotice('');}
  animate({...live.current.player,angle:nearest*Math.PI/4,pitch:current.pitch},180);
 }
 function onSceneClick(e){if(suppressClick.current){suppressClick.current=false;e.stopPropagation();}}
 function onMapPointerDown(e){
  if(e.isPrimary===false)return;
  const r=e.currentTarget.getBoundingClientRect();
  const unit=Math.max(1,Math.min(r.width/mapWidth,r.height/mapHeight));
  mapDrag.current={x:e.clientX,y:e.clientY,startX:mapStartX,startY:mapStartY,unit,moved:false};
  mapClickBlock.current=false;
  if(e.currentTarget.setPointerCapture)try{e.currentTarget.setPointerCapture(e.pointerId);}catch{}
 }
 function onMapPointerMove(e){
  const d=mapDrag.current;if(!d||e.isPrimary===false)return;
  const dx=e.clientX-d.x,dy=e.clientY-d.y;
  if(Math.hypot(dx,dy)>5)d.moved=true;
  if(!d.moved)return;
  const x=mhclamp(d.startX-Math.round(dx/d.unit),0,world.w-mapWidth);
  const y=mhclamp(d.startY-Math.round(dy/d.unit),0,world.h-mapHeight);
  setMapPan({x:x-mapBaseX,y:y-mapBaseY});
 }
 function onMapPointerEnd(){
  if(!mapDrag.current)return;
  mapClickBlock.current=mapDrag.current.moved;
  mapDrag.current=null;
 }
 function select(id){
  execute({type:'LOOK',id});setActionPage(0);
  const o=mhobject(world,live.current,id);
  if(o&&(o.x<mapStartX||o.x>=mapStartX+mapWidth||o.y<mapStartY||o.y>=mapStartY+mapHeight)){
   const x=mhclamp(Math.floor(o.x)-Math.floor(mapWidth/2),0,world.w-mapWidth);
   const y=mhclamp(Math.floor(o.y)-Math.floor(mapHeight/2),0,world.h-mapHeight);
   setMapPan({x:x-mapBaseX,y:y-mapBaseY});
  }
 }
 function applyObject(verb){if(!selected)return;
  if(screenLocked||activePuzzle)return;
  if(verb==='CLEAR'){const next={...live.current,rev:live.current.rev+1,selected:null};live.current=next;setState(next);setNotice('대상 선택을 해제했습니다.');return;}
  if(verb==='LOOK'){select(selected.id);setNotice(selected.readText||selected.detailHint||selected.label);return;}
  execute({type:'ACT',id:selected.id,verb});
 }
 function actionList(){
  if(!selected)return [];
  const actions=[{verb:'LOOK',label:'관찰',time:'0초'}];
  for(const verb of selected.verbs||[]){
   const cost=verb==='READ'||verb==='TALK'?0:verb==='EXAMINE'?(selected.examSec??20):verb==='OPEN'?4:verb==='TOGGLE'?1:verb==='TAKE'?5:0;
   const labels={READ:'읽기',TALK:'대화',EXAMINE:'상세 조사',OPEN:'문 열기',TOGGLE:state.flags[selected.flag||('switch:'+selected.id)]?'끄기':'켜기',TAKE:'획득',PUZZLE:'장치 조작'};
   if(verb==='TAKE'&&state.taken.includes(selected.id))continue;
   if(verb==='OPEN'&&state.flags['door:'+selected.id])continue;
   if(verb==='READ'&&!selected.readText&&!selected.detailHint)continue;
   if(verb==='PUZZLE'&&selected.puzzle?.successFlag&&state.flags[selected.puzzle.successFlag])continue;
   const max=verb==='TALK'?(selected.talkRange||4.2):['EXAMINE','READ'].includes(verb)?3.1:verb==='PUZZLE'?2.25:1.9;
   actions.push({verb,label:labels[verb]||verb,time:cost?cost+'초':'0초',disabled:selectedDist>max});
  }
  actions.push({verb:'CLEAR',label:'선택 해제',time:''});
  return actions.slice(0,6);
 }
 const actions=actionList();const pageActions=actions.slice(actionPage*3,actionPage*3+3);
 function solvePuzzle(value){
  if(!activePuzzle||screenLocked||sentRef.current||ioRef.current)return;
  const obj=world.objects.find(o=>o.id===activePuzzle),p=obj&&obj.puzzle;
  if(!p)return;
  if(puzzleExpired.current)return;
  const timeout=value==='__TIMEOUT__'||puzzleDeadline.current!==null&&Date.now()>=puzzleDeadline.current;
  const correct=!timeout&&(p.type==='choice'?Number(value)===Number(p.answer):String(value).trim()===String(p.answer));
  const cur=live.current,sec=mhclamp(Number(p.costSec)||5,0,120);
  const next={...cur,timeSec:cur.timeSec+sec,rev:cur.rev+1,flags:{...cur.flags},log:[...cur.log,{type:'PUZZLE',objectId:obj.id,success:correct,cost:sec,at:cur.timeSec}].slice(-96)};
  if(correct&&p.successFlag)next.flags[p.successFlag]=true;mhtimeline(world,next,cur.timeSec);next.seen=[...new Set([...next.seen,...mhseenNow(world,next)])];next.known=[...new Set([...next.known,...mhobjects(world,next).filter(o=>mhvisible(world,next,o)).map(o=>o.id)])];
  if(!correct&&Number.isInteger(p.hearts)&&p.hearts>0){const key='hearts:'+obj.id;next.flags[key]=Math.max(0,(Number.isInteger(cur.flags[key])?cur.flags[key]:p.hearts)-1);}
  live.current=next;setState(next);
  setNotice(correct?`장치 해제 성공 · +${sec}초`:timeout?`시간 초과 · +${sec}초`:`판정 실패 · +${sec}초`);
  if(correct||timeout||Number.isInteger(p.hearts)&&next.flags['hearts:'+obj.id]===0){puzzleExpired.current=true;puzzleDeadline.current=null;setActivePuzzle(null);setPuzzleSeconds(null);}
  setPuzzleInput('');
 }
 useEffect(()=>{if(!activePuzzle||puzzleDeadline.current===null)return;const id=setInterval(()=>{const seconds=Math.max(0,Math.ceil((puzzleDeadline.current-Date.now())/1000));setPuzzleSeconds(seconds);if(seconds===0&&!puzzleExpired.current)solvePuzzle('__TIMEOUT__');},250);return()=>clearInterval(id);},[activePuzzle]);
 function recordDisclosure(){disclosureRef.current=mhDisclosure(lines,disclosureRef.current,dialogueIndex,pageIndex,shown);return disclosureRef.current;}
 useEffect(()=>{recordDisclosure();},[dialogueIndex,pageIndex,shown,speech]);
 function seenSpeech(){return mhSeenSpeech(lines,recordDisclosure());}
 function replayCut(){if(!line||interruption||sentRef.current)return;recordDisclosure();setPageIndex(0);setShown(0);}
 function previousCut(){if(!line||interruption||dialogueIndex<1||sentRef.current)return;recordDisclosure();setDialogueIndex(dialogueIndex-1);setPageIndex(0);setShown(0);}
 function nextSpeech(){if(!line||interruption||sentRef.current)return;
  recordDisclosure();
  if(!fullyShown){setShown(pageChars.length);return;}
  if(pageIndex<dialoguePages.length-1){setPageIndex(pageIndex+1);setShown(0);return;}
  if(dialogueIndex<lines.length-1){setDialogueIndex(dialogueIndex+1);setPageIndex(0);setShown(0);}
 }
 function pendingDialogueState(partial){
  try{return mhDialogueReply(world,live.current,reply,lines,recordDisclosure(),partial);}
  catch(e){setNotice('대화 상태 반영 실패: '+e.message);return null;}
 }
 function exitDialogue(){
  if(!finalCut||interruption||sentRef.current||dialogueSendLocked)return;
  const accepted=pendingDialogueState(false);if(!accepted)return;
  live.current=accepted;setState(accepted);setDialogueExited(true);setInterruption(false);setNotice('대화를 마쳤습니다. 탐색을 계속할 수 있습니다.');
 }
 function beginInterruption(){if(!line||sentRef.current||dialogueSendLocked)return;recordDisclosure();setInterruption(true);setMessage('');}
 useEffect(()=>{if(!line||interruption||fullyShown)return;
  const t=setInterval(()=>{setShown(v=>Math.min(pageChars.length,v+1));if(line.shake)setShakeTick(v=>v+1);},line.speed);
  return()=>clearInterval(t);
 },[dialogueIndex,pageIndex,line?.speed,fullyShown,interruption,pageChars.length]);
 useEffect(()=>()=>{if(anim.current){if(anim.current.raf&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(anim.current.id);else clearTimeout(anim.current.id);}},[]);
 useEffect(()=>{
  if(!worldUrl)return;let active=true;const controller=typeof AbortController==='function'?new AbortController():null;
  if(!/^https:\/\/[^\s]+$/i.test(worldUrl)||typeof fetch!=='function'){setWorldError('외부 지도 URL 또는 fetch 지원을 확인하세요.');setLoadingWorld(false);return;}
  setLoadingWorld(true);setWorldStatus('지도 불러오는 중');
  mhFetchJSON(worldUrl,{headers:{Accept:'application/json'},...(controller?{signal:controller.signal}:{})}).then(raw=>{
   if(!active)return;
   const w=mhworld(raw),origin=new URL(worldUrl).origin;
   w.objects=w.objects.map(o=>o.spriteId?{...o,sprites:Object.fromEntries(MH_VIEWS.map(v=>[v,origin+'/hub/sprites/'+o.spriteId+'/'+v+'.svg']))}:o);
   let next=initial?mhexpand(w,initial):mhinitial(w);if(reply&&!lines.length)next=mhreply(w,next,reply);
   if(appearance){const a=typeof appearance==='string'?JSON.parse(appearance):appearance;if(a&&typeof a==='object'&&!Array.isArray(a))next.appearance={...next.appearance,...a};}
   stopAnim();bootError.current='';live.current=next;setWorld(w);setState(next);setMapPan({x:0,y:0});
   poseRef.current={...next.player,angle:next.player.heading*Math.PI/4,pitch:0};setPose(poseRef.current);setNotice('');
   setWorldStatus('외부 지도 '+w.id);setWorldError('');
  }).catch(e=>{if(active){setWorldError(e.message);setWorldStatus(bootError.current?'체크포인트 보존 · 복원 중단':'내장 지도 유지');}}).finally(()=>{if(active)setLoadingWorld(false);});
  return()=>{active=false;controller?.abort();};
 },[worldUrl]);
 function makeSaveToken(){try{const bytes=new Uint8Array(24);crypto.getRandomValues(bytes);setSaveToken(Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join(''));setSaveStatus('생성한 복구 키는 별도로 안전하게 보관하세요. 다시 표시되지 않습니다.');}catch{setSaveStatus('보안 난수 생성이 지원되지 않습니다. 별도로 생성한 24자 이상의 임의 키를 입력하세요.');}}
 async function serverSave(mode){
  if(ioRef.current||sentRef.current||loadingWorld||bootError.current||activePuzzle)return;
  if(!worldUrl||typeof fetch!=='function'){setSaveStatus('외부 Worker가 연결되어 있지 않거나 fetch가 지원되지 않습니다.');return;}
  if(!/^[a-zA-Z0-9_-]{1,64}$/.test(saveSlot)||!/^[a-zA-Z0-9_-]{24,128}$/.test(saveToken)){setSaveStatus('저장 슬롯 ID와 24~128자의 보안 복구 키를 확인하세요.');return;}
  const origin=new URL(worldUrl).origin,url=origin+'/hub/state/'+saveSlot;
  const snapshot=mhcompact(world,live.current),syncKey=JSON.stringify([worldUrl,saveSlot,saveToken,snapshot.rev]);
  ioRef.current=true;setIoBusy(true);let success=false;
  try{
   setSaveStatus(mode==='load'?'서버 복원 중':'서버 저장 중');
   const result=await mhFetchJSON(url,{method:mode==='load'?'GET':'PUT',headers:{Authorization:'Bearer '+saveToken,...(mode==='load'?{}:{'Content-Type':'application/json'})},...(mode==='load'?{}:{body:JSON.stringify(snapshot)})});
   if(mode==='load'){
    const next=mhRestoreUnchanged(world,live.current,result,snapshot.rev);stopAnim();live.current=next;setState(next);setMapPan({x:0,y:0});
    poseRef.current={...next.player,angle:next.player.heading*Math.PI/4,pitch:0};setPose(poseRef.current);setNotice('서버 체크포인트를 복원했습니다.');setTab('scene');
   }else{if(result.ok!==true||result.revision!==snapshot.rev)throw Error('저장 확인 응답이 일치하지 않습니다.');lastSyncedRevision.current=syncKey;}
   success=true;setSaveStatus(mode==='load'?'서버 복원 완료':'서버 저장 완료 · revision '+result.revision);
  }catch(e){setSaveStatus('서버 작업 실패: '+e.message+' · 로컬 게임은 유지됩니다. 서버 저장으로 재시도할 수 있습니다.');}
  finally{ioRef.current=false;setIoBusy(false);if(success)setSyncTick(n=>n+1);}
 }
 useEffect(()=>{
  if(!autoSync||!worldUrl||ioRef.current||!/^([a-zA-Z0-9_-]{24,128})$/.test(saveToken))return;
  const key=JSON.stringify([worldUrl,saveSlot,saveToken,state.rev]);if(key===lastSyncedRevision.current)return;
  const recent=state.log[state.log.length-1];if(!recent||!['TAKE','OPEN','PUZZLE','WORLD_EVENT','NPC_REPLY'].includes(recent.type))return;
  serverSave('put');
 },[autoSync,worldUrl,saveToken,saveSlot,state.rev,syncTick]);
 function restore(){if(sentRef.current||pending||busy||loadingWorld||ioRef.current||activePuzzle)return;
  try{const s=mhexpand(world,restoreText);bootError.current='';stopAnim();live.current=s;setState(s);setMapPan({x:0,y:0});poseRef.current={...s.player,angle:s.player.heading*Math.PI/4,pitch:0};setPose(poseRef.current);setNotice('체크포인트 복원 완료');setTab('scene');}
  catch(e){setNotice('복원 실패: '+e.message);}
 }
 async function handoff(kindOverride){if(sentRef.current||dialogueSendLocked||ioRef.current||activePuzzle)return;
  const fn=onHandoff||(typeof sendMessage==='function'?sendMessage:null);
  if(!fn){setNotice('UUMMAI sendMessage를 찾을 수 없습니다.');return;}
  const actor=interruption?dialogueActor:talkTarget?mhobject(world,live.current,talkTarget):null;
  let after=live.current;
  try{
   if(interruption){after=pendingDialogueState(true);if(!after)return;}
   else if(actor)after=mhmutate(world,live.current,{type:'TALK_SEND',id:actor.id}).state;
   if(!message.trim()){setNotice('AI에게 전달할 말을 입력하세요.');return;}
   const payload={protocol:MH_PROTOCOL,event:'HANDOFF',stage,worldId:loadedWorldId,worldUrl:worldUrl||null,state:mhhandoffState(world,after),request:{kind:interruption?'INTERRUPT':actor?'NPC_DIALOGUE':typeof kindOverride==='string'?kindOverride:'PLAYER_INPUT',target:actor?{id:actor.id,name:actor.label,identityHint:actor.identityHint||''}:null,userText:message.trim().slice(0,800)},dialogue:{seen:lines.length?seenSpeech():[],futureIsCanon:false,cut:interruption?{index:dialogueIndex+1,total:lines.length,page:pageIndex+1,visibleChars:shown}:null},context:{visible:present.map(o=>o.id),publicScenario:world.scenario?.publicIntro||''}};
   sentRef.current=true;setPending(true);
   await Promise.resolve(fn(MH_PROTOCOL+' '+JSON.stringify(payload)));
   live.current=after;setState(after);setSent(true);setNotice('AI에 인계했습니다. 새 JSX에서 이어집니다.');
  }catch(e){sentRef.current=false;setNotice('전송 실패: '+e.message);}finally{setPending(false);}
 }
 const currentPuzzle=activePuzzle?world.objects.find(o=>o.id===activePuzzle):null;
 const currentPuzzleData=currentPuzzle&&currentPuzzle.puzzle;
 const inSpeech=!!line&&!dialogueExited;
 const dialogueLineText=line?visibleText:'';
 const mapTiles=Array.from({length:mapHeight},(_,y)=>Array.from({length:mapWidth},(_,x)=>{
  const xx=mapStartX+x,yy=mapStartY+y,found=mapFound(xx,yy),tile=mhtile(world,xx,yy),cx=x*18,cy=y*18;
  const door=tile==='D',walkable=tile!=='#';
  return <rect key={x+'_'+y} x={cx+1} y={cy+1} width="16" height="16" rx="2" fill={!found?'#101924':!walkable?'#273947':door&&mhblocked(world,state,xx,yy)?'#c3935b':'#65879b'}/>;
 }));
 return <div style={{boxSizing:'border-box',maxWidth:540,width:'100%',margin:'0 auto',background:'#091723',border:'1px solid #3a5869',borderRadius:12,overflow:'hidden',color:'#f1f6fa',fontFamily:'system-ui,sans-serif',fontSize:13}}>
  {(loadingWorld||bootError.current||worldError)?<div role="status" style={{padding:10,overflowWrap:'anywhere'}}>{loadingWorld?'지도 연결 확인 중…':bootError.current?'복원 중단: '+bootError.current:worldError+' · 내장 지도 유지'}</div>:null}
  {dialogueMode?<div>
   <div style={{position:'relative',width:'100%',height:'min(115vw,450px)',minHeight:330,maxHeight:450,background:'#293b4a',overflow:'hidden'}}>
    <MHDialogueBackdrop room={room?.id||'lobby'} brightness={mhroomlight(world,state,state.player.x)} imageUrl={sceneBackground}/>
    {dialogueActor?<div style={{position:'absolute',inset:'7% 9% 1%',pointerEvents:'none'}}><MHDialoguePortrait actor={dialogueActor} expression={line?.expression||'neutral'} pose={line?.pose||'neutral'} outfit={line?.outfit||''}/></div>:null}
    <div style={{position:'absolute',top:9,left:10,right:10,display:'flex',justifyContent:'space-between',gap:10,fontSize:11,color:'#f2f4f8',textShadow:'0 1px 4px #08131d'}}>
     <span>{roomName}</span><span>{mhclock(state.timeSec)}{inSpeech?' · '+(dialogueIndex+1)+'/'+lines.length:''}</span>
    </div>
    {inSpeech?<div onClick={nextSpeech} style={{position:'absolute',left:9,right:9,bottom:9,padding:'14px 14px 12px',minHeight:126,borderRadius:10,background:'rgba(7,18,31,.94)',border:'1px solid #68849a',boxShadow:'0 4px 20px #07111a8a',touchAction:'manipulation'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:6,marginBottom:8}}>
       <strong style={{color:'#f2d19f',fontSize:15}}>{line.speaker}</strong>
       <span style={{fontSize:10,color:'#96b3c7'}}>{interruption?'일시정지':fullyShown?'▼':'···'}</span>
      </div>
      <div style={{fontSize:`clamp(14px,3.5vw,${Math.min(line.size,21)}px)`,lineHeight:1.6,color:line.color,minHeight:90,maxHeight:190,overflowY:'auto',whiteSpace:'pre-wrap',overflowWrap:'anywhere',transform:line.shake?`translate(${Math.sin(shakeTick*2.6)*line.shake}px,${Math.cos(shakeTick*1.9)*line.shake}px)`:'none'}}>{dialogueLineText}</div>
     </div>:<div style={{position:'absolute',left:9,right:9,bottom:9,padding:14,borderRadius:10,background:'rgba(7,18,31,.93)',border:'1px solid #68849a',fontSize:14}}>{dialogueActor?.label||'대화 상대'}에게 하고 싶은 말을 입력하세요.</div>}
   </div>
   {inSpeech?<>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,padding:'8px 10px 5px'}}>
     <button style={{...btn,minHeight:43,background:'#284a60'}} onClick={replayCut} disabled={!!interruption||sent}>↺ 이번 컷 다시 듣기</button>
     {finalCut?<button style={{...btn,minHeight:43,background:'#356c78'}} onClick={exitDialogue} disabled={!!interruption||sent}>대화 종료</button>:<button style={{...btn,minHeight:43,background:'#534c60'}} onClick={beginInterruption} disabled={!!interruption||sent}>대사에 끼어들기</button>}
    </div>
    {!interruption?<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'2px 11px 9px',gap:8}}>
      <button onClick={previousCut} disabled={dialogueIndex<1} style={{...btn,padding:'5px 9px',minHeight:29,opacity:dialogueIndex?1:.4,fontSize:11}}>‹ 이전 컷</button>
      <span style={{color:'#a7bbc9',fontSize:10}}>{fullyShown?(finalCut?'마지막 컷':'화면 터치 또는 다음 컷'):'화면 터치로 즉시 완성'}</span>
      {!finalCut?<button onClick={nextSpeech} style={{...btn,padding:'5px 9px',minHeight:29,fontSize:11}}>다음 컷 ›</button>:<span style={{width:72}}/>}
    </div>:null}
   </>:null}
   {(!inSpeech||interruption)?<div style={{padding:'8px 11px 12px',background:'#0e2233'}}>
    <strong style={{fontSize:12,color:'#f1d9a4'}}>{interruption?'지금 끼어들기 · 연출 일시정지':(dialogueActor?.label||'인물')+'에게 말하기'}</strong>
    {interruption?<div style={{fontSize:11,color:'#a6becb',margin:'4px 0'}}>현재 컷을 여기서 중단합니다. 이 시점 이후 대사는 확정되지 않습니다.</div>:null}
    <textarea value={message} onChange={e=>setMessage(e.target.value.slice(0,800))} rows={3} placeholder="인물에게 직접 말하거나 행동을 입력하세요." style={{...box,marginTop:8,resize:'vertical'}}/>
    <div style={{display:'flex',gap:6,marginTop:7}}>
     <button onClick={()=>handoff()} disabled={dialogueSendLocked||!message.trim()} style={{...btn,flex:1,background:'#326e7e'}}>AI에게 전달</button>
     <button onClick={()=>{if(interruption){setInterruption(false);}else{setTalkTarget(null);setMessage('');}}} disabled={dialogueSendLocked} style={btn}>취소</button>
    </div>
   </div>:null}
   {notice?<div role="status" style={{padding:'8px 11px',overflowWrap:'anywhere'}}>{notice}</div>:null}
   {sent?<div style={{padding:'9px 11px',color:'#aacecf',fontSize:11}}>AI에 전송했습니다. 다음 JSX에서 대화가 이어집니다.</div>:null}
  </div>:<>
   {tab==='scene'?<>
    <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) minmax(125px,38%)',gap:6,padding:'5px 9px 4px',alignItems:'stretch'}}>
     <div style={{...card,height:84,minWidth:0,boxSizing:'border-box',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:5,padding:'5px 7px 4px',flexShrink:0,borderBottom:'1px solid #304d60'}}><strong style={{fontSize:12,color:'#eacb9d',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{roomName}</strong><span style={{color:'#bacfdb',fontSize:11,whiteSpace:'nowrap'}}>{mhclock(state.timeSec)}</span></div>
      <div style={{flex:'1 1 auto',minHeight:0,overflowY:'auto',overscrollBehavior:'contain',WebkitOverflowScrolling:'touch',touchAction:'pan-y',scrollbarWidth:'thin',padding:'0px 3px'}}>
       {present.length?present.map(o=><button key={o.id} onClick={()=>select(o.id)} disabled={screenLocked} style={{width:'100%',display:'flex',justifyContent:'space-between',gap:4,alignItems:'center',textAlign:'left',minHeight:26,padding:'1px 3px',lineHeight:1.05,border:0,borderRadius:5,background:state.selected===o.id?'#42697a':'transparent',color:'#e5eef4',fontSize:11,cursor:'pointer'}}><span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.kind==='person'?'● ':'◇ '}{o.label}</span><span style={{color:'#9db8c8',flexShrink:0,fontSize:10}}>{mhdistance(state.player.x,state.player.y,o.x,o.y).toFixed(1)}</span></button>):<span style={{fontSize:11,color:'#93aab8'}}>주변에 보이는 대상 없음</span>}
      </div>
     </div>
     <div style={{...card,height:84,boxSizing:'border-box',padding:4,minWidth:0,position:'relative'}}>
      <svg viewBox={`0 0 ${mapWidth*18} ${mapHeight*18}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-label="발견된 구역 지도. 드래그해 다른 구역 보기" style={{display:'block',background:'#0a1826',borderRadius:4,touchAction:'none',cursor:'grab'}} onPointerDown={onMapPointerDown} onPointerMove={onMapPointerMove} onPointerUp={onMapPointerEnd} onPointerCancel={onMapPointerEnd}>
       {mapTiles}
       {!forwardCheck.ok&&mapFound(forwardCheck.nx,forwardCheck.ny)&&forwardCheck.nx>=mapStartX&&forwardCheck.nx<mapStartX+mapWidth&&forwardCheck.ny>=mapStartY&&forwardCheck.ny<mapStartY+mapHeight?<rect x={(forwardCheck.nx-mapStartX)*18+1.8} y={(forwardCheck.ny-mapStartY)*18+1.8} width="14.4" height="14.4" rx="2" fill="none" stroke="#ff8e84" strokeWidth="2" strokeDasharray="3 2" pointerEvents="none"/>:null}
       {mapObjects.slice().sort((a,b)=>(a.id===state.selected?1:0)-(b.id===state.selected?1:0)).map(o=>{
        const chosen=o.id===state.selected;
        const cellmates=mapCellmates.get(mhcell(Math.floor(o.x),Math.floor(o.y)))||[];
        const i=cellmates.indexOf(o.id);
        const offset=cellmates.length>1?[[0,-3.3],[-3.3,1.9],[3.3,1.9],[0,3.3]][i%4]:[0,0];
        const x=(o.x-mapStartX)*18+offset[0],y=(o.y-mapStartY)*18+offset[1];
        return <g key={o.id} role="img" aria-label={(chosen?'선택 중: ':'발견 대상: ')+o.label} onClick={e=>{e.stopPropagation();const moved=mapClickBlock.current;mapClickBlock.current=false;if(!moved&&!screenLocked&&present.some(p=>p.id===o.id))select(o.id);}} style={{cursor:'pointer'}}>
         {chosen?<circle cx={x} cy={y} r="6.2" fill="none" stroke="#fff" strokeWidth="1.65"/>:null}
         <circle cx={x} cy={y} r={chosen?4.4:2.9} fill={chosen?'#ff4f9d':o.kind==='person'?'#84d4b5':'#e7c58a'} stroke={chosen?'#fff':'#15202a'} strokeWidth={chosen?1.2:.8}/>
        </g>;
       })}
       <g transform={`translate(${(state.player.x-mapStartX)*18},${(state.player.y-mapStartY)*18}) rotate(${pose.angle*180/Math.PI})`}><path d="M0 -8 L6 6 L0 3 L-6 6Z" fill="#ffe19b" stroke="#172533" strokeWidth="1.4"/></g>
      </svg>
      {(mapPan.x!==0||mapPan.y!==0)?<button aria-label="지도에서 내 위치로 돌아가기" onClick={()=>setMapPan({x:0,y:0})} style={{position:'absolute',right:6,bottom:6,width:22,height:22,minHeight:22,border:'1px solid #92b6cc',borderRadius:5,padding:0,color:'#e7f4ff',background:'#263f54de',fontSize:15,lineHeight:'20px',cursor:'pointer'}}>⌖</button>:null}
     </div>
    </div>
    <svg viewBox={`0 0 ${MH_W} ${MH_H}`} width="100%" role="img" aria-label="주변 탐색 시야" style={{display:'block',background:'#243544',touchAction:'none',userSelect:'none',cursor:'grab'}} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd} onClick={onSceneClick}>
     <defs>
      <linearGradient id="mh-ceiling" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#182f42"/><stop offset="1" stopColor="#536675"/></linearGradient>
      <linearGradient id="mh-floor" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#6c7378"/><stop offset=".5" stopColor="#3a4c5b"/><stop offset="1" stopColor="#172a37"/></linearGradient>
      {frame.objects.map(o=><clipPath key={o.id} id={'mhclip-'+stage+'-'+o.id}>{o.mask.map((m,i)=><rect key={i} x={m.x} y="0" width={m.w} height={MH_H}/>)}</clipPath>)}
     </defs>
     <rect x="0" y="0" width={MH_W} height={mhclamp(MH_HORIZON+(pose.pitch||0)*220,0,MH_H)} fill="url(#mh-ceiling)"/>
     <rect x="0" y={mhclamp(MH_HORIZON+(pose.pitch||0)*220,0,MH_H)} width={MH_W} height={MH_H-mhclamp(MH_HORIZON+(pose.pitch||0)*220,0,MH_H)} fill="url(#mh-floor)"/>
     {frame.floor.map((f,i)=><line key={i} x1={f.a.x} y1={f.a.y} x2={f.b.x} y2={f.b.y} stroke="#c6d6dc" strokeWidth=".7" opacity=".16"/>)}
     {frame.rays.map((r,i)=>r.fill?<rect key={i} x={r.x} y={r.y} width={r.width} height={r.height} fill={r.fill}/>:null)}
     {frame.objects.map(o=><g key={o.id} clipPath={'url(#mhclip-'+stage+'-'+o.id+')'} onClick={()=>!suppressClick.current&&select(o.id)} style={{cursor:'pointer'}}>{o.shapes.map((sh,i)=>mhAppearance(sh,i))}</g>)}
     <path d={`M${MH_W/2-7} ${MH_HORIZON}h14 M${MH_W/2} ${MH_HORIZON-7}v14`} stroke="#e9d6ae" strokeWidth="1.4" opacity=".56"/>
    </svg>
    <div style={{display:'grid',gridTemplateColumns:'1.05fr 1fr 1fr',gridTemplateRows:'repeat(2,minmax(36px,auto))',gap:4,padding:'7px 9px 6px'}}>
     <button onClick={()=>execute({type:'WALK',forward:1})} disabled={screenLocked||!!activePuzzle} style={{...btn,gridColumn:1,gridRow:'1 / 3',fontSize:17,fontWeight:700,background:'#356b7c',padding:'4px 4px'}}>↑ 전진</button>
     {[0,1,2].map(i=>{const a=pageActions[i];return <button key={i} disabled={screenLocked||!a||a.disabled} onClick={()=>applyObject(a.verb)} style={{...btn,gridColumn:i===1?3:2,gridRow:i===2?2:1,opacity:!a||a.disabled?.36:1,background:a&&!a.disabled?'#264b5c':'#172c3d',fontSize:11,padding:'3px 3px'}}>{a?a.label:'—'}{a&&a.time?<span style={{display:'block',fontSize:9,color:'#afcad5'}}>{a.time}</span>:null}</button>;})}
     <button onClick={()=>setActionPage(p=>p?0:1)} disabled={actions.length<=3||screenLocked} style={{...btn,gridColumn:3,gridRow:2,background:'#253c50',opacity:actions.length<=3?.35:1,padding:'3px 3px'}}>{actionPage?'‹ 이전':'다음 ›'}</button>
    </div>
    {(selected||notice)?<div role="status" style={{...card,margin:'1px 9px 6px',padding:'7px 9px',fontSize:11}}>
     {selected?<div><strong style={{color:'#f3d5a6'}}>{selected.label}</strong> <span style={{color:'#a4c1ce'}}>· {selectedDist.toFixed(1)}칸</span></div>:null}
     <div style={{marginTop:selected?3:0,color:'#b9ccd5',lineHeight:1.4,whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{notice&&notice!=='대상을 선택했습니다.'?notice:selected?.identityHint||selected?.observeText||notice||'대상을 선택했습니다.'}</div>
    </div>:null}
    {currentPuzzleData?<div style={{...card,margin:'7px 9px',padding:9}}><strong>{currentPuzzle.label} · {currentPuzzleData.question||'장치 조작'}</strong>
     {puzzleSeconds!==null?<div style={{color:'#f4d393',marginTop:5}}>남은 시간 {puzzleSeconds}초</div>:null}
     {Number.isInteger(currentPuzzleData.hearts)&&currentPuzzleData.hearts>0?<div style={{fontSize:11,color:'#bbceda',marginTop:4}}>남은 기회 {state.flags['hearts:'+currentPuzzle.id]??currentPuzzleData.hearts}회</div>:null}
     {currentPuzzleData.type==='choice'?<div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:5,marginTop:7}}>{(currentPuzzleData.choices||[]).map((c,i)=><button key={i} onClick={()=>solvePuzzle(i)} style={btn}>{c}</button>)}</div>:<div style={{display:'flex',gap:5,marginTop:7}}><input value={puzzleInput} onChange={e=>setPuzzleInput(e.target.value)} style={{...box,flex:1}} placeholder="정답 입력"/><button style={btn} onClick={()=>solvePuzzle(puzzleInput)}>확인</button></div>}
     <button onClick={()=>{puzzleDeadline.current=null;puzzleExpired.current=true;setActivePuzzle(null);setPuzzleSeconds(null);}} style={{...btn,marginTop:5}}>닫기</button>
    </div>:null}
   </>:null}
   {tab==='journal'?<div style={{padding:'8px 10px',display:'grid',gap:8}}>
    <div style={{...card,padding:10}}><strong>조사 및 소지품</strong><div style={{color:'#b7cbd5',marginTop:6,lineHeight:1.7}}>{state.observed.length?'조사: '+state.observed.map(id=>world.objects.find(o=>o.id===id)?.label||id).join(', '):'조사한 대상 없음'}<div>{state.taken.length?'소지품: '+state.taken.map(id=>world.objects.find(o=>o.id===id)?.label||id).join(', '):'소지품 없음'}</div></div></div>
    <div style={{...card,padding:10,display:'grid',gap:7}}><strong>자유 추리 제출</strong><textarea rows={2} value={message} onChange={e=>setMessage(e.target.value.slice(0,800))} placeholder="누가, 언제, 어떻게, 왜 문서를 옮겼는지 자유롭게 추론하세요." style={box}/><button onClick={()=>handoff('ACCUSATION')} disabled={screenLocked||!message.trim()} style={btn}>추리 제시 · AI 인계</button></div>
    <div style={{...card,padding:10}}><strong>최근 중요한 행동</strong>{state.log.filter(e=>!['LOOK','MOVE'].includes(e.type)).slice(-8).map((e,i)=><div key={i} style={{color:'#aac5d1',fontSize:11,marginTop:5}}>{mhclock(e.at)} · {e.type} {e.objectId||''} {e.cost?'+'+e.cost+'초':''}</div>)}</div>
   </div>:null}
   {tab==='save'?<div style={{padding:'8px 10px',display:'grid',gap:6}}>
    <strong style={{fontSize:12,color:'#d4e2eb'}}>상태 저장·인계</strong>
    <textarea rows={4} readOnly value={bootError.current?(typeof initial==='string'?initial:JSON.stringify(initial)):JSON.stringify(mhcompact(world,state))} style={box}/>
    <textarea rows={2} value={restoreText} onChange={e=>setRestoreText(e.target.value)} placeholder="체크포인트 JSON" style={box}/>
    <button onClick={restore} disabled={screenLocked} style={btn}>체크포인트 복원</button>
    <div style={{...card,padding:8,display:'grid',gap:6}}><strong style={{fontSize:12}}>Worker 저장 (개인 복구 키)</strong>
     <input value={saveSlot} onChange={e=>setSaveSlot(e.target.value.slice(0,64))} style={box} placeholder="저장 슬롯 ID"/>
     <input type="password" value={saveToken} onChange={e=>setSaveToken(e.target.value.slice(0,128))} style={box} placeholder="복구 키 · 24자 이상" autoComplete="off"/>
     <div style={{display:'flex',gap:5,flexWrap:'wrap'}}><button style={btn} onClick={makeSaveToken}>복구 키 생성</button><button style={btn} onClick={()=>serverSave('put')} disabled={screenLocked}>서버 저장</button><button style={btn} onClick={()=>serverSave('load')} disabled={screenLocked}>서버 복원</button></div>
     <label style={{fontSize:11,display:'flex',gap:6,alignItems:'center'}}><input type="checkbox" checked={autoSync} onChange={e=>setAutoSync(e.target.checked)}/>중요 행동 시 자동 동기화</label><div style={{fontSize:10,color:'#b6cad3'}}>{saveStatus}</div>
    </div>
    <div style={{fontSize:11,color:'#a8becd'}}>지도: {worldStatus}{worldError?' · 오류: '+worldError:''}</div>
    <textarea rows={2} value={message} onChange={e=>setMessage(e.target.value.slice(0,800))} placeholder="AI에게 전달할 요청" style={box}/>
    <button onClick={()=>handoff()} disabled={screenLocked||!message.trim()} style={{...btn,background:'#316d7c'}}>현재 상태와 요청 인계</button>
   </div>:null}
   {tab!=='scene'&&notice?<div role="status" style={{padding:'5px 10px',fontSize:11,color:'#b9d2db'}}>{notice}</div>:null}
   <div style={{display:'flex',gap:4,padding:'8px 9px',borderTop:'1px solid #2b4659',background:'#0c1c2c'}}>
    {[['scene','탐색'],['journal','기록'],['save','저장·인계']].map(([id,label])=><button key={id} onClick={()=>setTab(id)} style={{...btn,flex:1,padding:'6px 3px',minHeight:30,background:tab===id?'#31566b':'#142d3e',fontSize:11}}>{label}</button>)}
   </div>
  </>}
 </div>;
}
