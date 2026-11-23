/* Troemerei NPC simulation core v0.5 — 결정적 NPC 일정·경로·기억. DOM/네트워크/LLM 의존 없음. */
const TroemereiNPC = (() => {
  const abs = Math.abs;
  const posKey = (x,y) => x+','+y;
  const manhattan = (a,b) => abs(a.x-b.x)+abs(a.y-b.y);
  const clone = obj => JSON.parse(JSON.stringify(obj));
  const clock = n => String(Math.floor(n/3600)%24).padStart(2,'0')+':'+String(Math.floor(n/60)%60).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
  const secs = time => { const [h,m] = time.split(':').map(Number); return h*3600+m*60; };
  const random = s => {let x=s.rng|0; x^=x<<13; x^=x>>>17; x^=x<<5; s.rng=x>>>0;return (s.rng>>>0)/4294967296;};
  const inBounds = (w,x,y) => x>=0 && y>=0 && x<w.map.width && y<w.map.height;
  const walkable = (w,x,y) => inBounds(w,x,y) && w.map.rows[y][x] !== '#';
  const node = (s,id) => s.npcs.find(n=>n.id===id);
  const landmark = (w,id) => w.map.landmarks.find(x=>x.id===id);
  const DAY=86400;
  const josa=(w,a,b)=>{const c=String(w).charCodeAt(String(w).length-1)-0xac00;return w+(c>=0&&c<11172&&c%28?a:b);};
  // 방 번호(-1은 통로). 같은 방이고 6칸 이내면 서로 보인다(통로끼리는 3칸).
  function areaOf(w,x,y){return w.map.areas.findIndex(a=>x>=a.x0&&x<=a.x1&&y>=a.y0&&y<=a.y1);}
  function sees(w,a,b){const ra=areaOf(w,a.x,a.y),rb=areaOf(w,b.x,b.y);if(ra!==rb)return false;return manhattan(a,b)<=(ra<0?3:6);}
  // 기억: [사실ID, 역할, 시각]. 역할 0 직접 · 1 목격 · 2+i 인물 i에게 들음(증언). 인물당 최근 12개.
  function learn(target,factId,role,time){
    if(!target.mem)target.mem=[];
    if(target.mem.some(m=>m[0]===factId&&m[1]===role))return;
    target.mem.push([factId,role,time]);if(target.mem.length>12)target.mem.shift();
  }
  function witness(w,s,actor,factId,direct){
    for(const id of direct){const m=node(s,id);if(m)learn(m,factId,0,s.clock);}
    for(const o of s.npcs)if(!direct.includes(o.id)&&sees(w,o,actor))learn(o,factId,1,s.clock);
    if(sees(w,s.player,actor))learn(s.player,factId,1,s.clock);
  }
  function updateSeen(w,s){
    for(const n of s.npcs)if(sees(w,s.player,n))s.player.seen[n.id]=[areaOf(w,n.x,n.y),s.clock];
  }
  // 로그 공개는 시야 판정(sees)과 같은 기준을 쓴다.
  function addLog(w,s,text,type='world',at=null) {
    const visible=type==='player'||!at||sees(w,s.player,at);
    s.logs.push({time:s.clock,text,type,visible});
    if(s.logs.length>100)s.logs.shift();
  }
  function createWorld(w,seed=246813579){
    const s={schema:'TROEMEREI_NPC_V1',version:1,worldId:w.map.id,day:1,clock:9*3600,
      rng:seed>>>0 || 1, player:{x:w.player.x,y:w.player.y,route:[],nextMoveAt:0,mem:[],seen:{},items:{}},
      npcs:w.npcs.map((n,i)=>({id:n.id,x:n.x,y:n.y,mode:'idle',intent:null,route:[],
        nextMoveAt:9*3600+10+i*4,busyUntil:0,blockedSince:null,completed:[],
        excluded:[],lastTask:'',lastCompleted:{},queued:[],meetings:[],followOffset:0,mem:[]})),
      flags:Object.fromEntries((w.flagNames||[]).map(f=>[f,false])),
      logs:[],revision:0,pend:null,pk:'',pc:0};
    addLog(w,s,'시뮬레이션이 시작되었다. NPC들은 각자의 일정에 따라 행동한다.','player');
    // Decisions exist from the first frame; the player can cancel a planned visit before movement.
    for(const n of s.npcs)decide(w,s,n);
    updateSeen(w,s);
    return s;
  }
  function route(w,s,from,to,{ignorePlayer=false,ignoreNpc=null}={}){
    if (!walkable(w,to.x,to.y))return [];
    const occupied=new Set(s.npcs.filter(n=>n.id!==ignoreNpc && !(n.id===from.id)).map(n=>posKey(n.x,n.y)));
    if(!ignorePlayer)occupied.add(posKey(s.player.x,s.player.y));
    const q=[{x:from.x,y:from.y}],prev=new Map([[posKey(from.x,from.y),null]]),v=new Map([[posKey(from.x,from.y),q[0]]]);
    for(let i=0;i<q.length;i++){
      const p=q[i], k=posKey(p.x,p.y);
      if(p.x===to.x&&p.y===to.y){const out=[];let curr=k;while(prev.get(curr)!==null){out.push(v.get(curr));curr=prev.get(curr);}return out.reverse();}
      for(const [dx,dy] of [[1,0],[0,1],[-1,0],[0,-1]]){
        const nx=p.x+dx,ny=p.y+dy,nk=posKey(nx,ny);
        if(walkable(w,nx,ny)&&!prev.has(nk)&&(!occupied.has(nk)||(nx===from.x&&ny===from.y))){
          const point={x:nx,y:ny};prev.set(nk,k);v.set(nk,point);q.push(point);
        }
      }
    }
    return [];
  }
  function goalOf(w,s,task){
    if(task.targetNpc){const n=node(s,task.targetNpc);return n?{target:n,goal:{x:n.x,y:n.y}}:null;}
    const p=landmark(w,task.landmark);return p?{target:null,goal:{x:p.x,y:p.y}}:null;
  }
  function routeFor(w,s,n,task){
    const g=goalOf(w,s,task);if(!g)return null;
    if(g.target){
      const endpoints=[[1,0],[0,1],[-1,0],[0,-1]].map(([dx,dy])=>({x:g.goal.x+dx,y:g.goal.y+dy})).filter(p=>walkable(w,p.x,p.y));
      let best=null;
      for(const p of endpoints){const r=route(w,s,n,p,{ignoreNpc:n.id});
        if((r.length||manhattan(n,p)===0) && (!best||r.length<best.length)) best=r;
      }
      return best;
    }
    const direct=route(w,s,n,g.goal,{ignoreNpc:n.id});
    if(direct.length || manhattan(n,g.goal)===0)return direct;
    // A point of interest can be occupied by another NPC; approach its free side.
    const occupied=s.npcs.some(other=>other.id!==n.id&&other.x===g.goal.x&&other.y===g.goal.y);
    if(occupied){
      let best=null;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
        const p={x:g.goal.x+dx,y:g.goal.y+dy};if(!walkable(w,p.x,p.y))continue;
        const r=route(w,s,n,p,{ignoreNpc:n.id});
        if((r.length||manhattan(n,p)===0)&&(!best||r.length<best.length))best=r;
      }
      return best;
    }
    return direct;
  }
  function weightedPick(s,entries){
    const total=entries.reduce((acc,x)=>acc+x.score,0);let v=random(s)*total;
    for(const x of entries){v-=x.score;if(v<0)return x.task;}return entries[entries.length-1].task;
  }
  function isAvailable(s,n,t){
    if(n.excluded.includes(t.id)||n.completed.includes(t.id)&&t.once)return false;
    const tod=s.clock%DAY; // 일정 시각은 '그날 기준'으로 비교한다(자정이 지나도 다음 날 다시 선택).
    if(tod<secs(t.from||'00:00') ||tod>=secs(t.until||'23:59'))return false;
    if(n.lastCompleted[t.id] && s.clock-n.lastCompleted[t.id]<(t.cooldownSeconds||0))return false;
    return true;
  }
  function decide(w,s,n){
    const spec=w.npcs.find(x=>x.id===n.id);
    const queue=n.queued.filter(t=>!n.completed.includes(t.id));
    const candidates=queue.length?queue:spec.agenda.filter(t=>isAvailable(s,n,t));
    if(!candidates.length){n.nextMoveAt=s.clock+25;return;}
    const maxP=Math.max(...candidates.map(t=>t.priority||0));
    const choices=candidates.filter(t=>(t.priority||0)===maxP).map(t=>({task:t,
      score:Math.max(0.05,(t.weight||1)*(t.id===n.lastTask?0.2:1))}));
    const task=clone(weightedPick(s,choices));
    const way=routeFor(w,s,n,task);
    if(way===null ||(!way.length&&!hasReached(w,s,n,task))){
      n.nextMoveAt=s.clock+20;return;
    }
    n.intent=task;n.mode='moving';n.route=way;n.nextMoveAt=s.clock+(spec.stepSeconds||7);n.blockedSince=null;
    addLog(w,s,spec.name+'이(가) 새로운 목적지를 향해 움직이기 시작했다.','npc',n);
    if(!way.length)arrive(w,s,n);
  }
  function hasReached(w,s,n,task){
    const g=goalOf(w,s,task);
    if(!g)return false;
    if(g.target)return manhattan(n,g.target)===1;
    if(manhattan(n,g.goal)===0)return true;
    const occupied=s.npcs.some(other=>other.id!==n.id&&other.x===g.goal.x&&other.y===g.goal.y);
    return occupied&&manhattan(n,g.goal)===1;
  }
  function arrive(w,s,n){
    const spec=w.npcs.find(x=>x.id===n.id),task=n.intent;
    if(!task){n.mode='idle';return;}
    if(!hasReached(w,s,n,task)){
      const r=routeFor(w,s,n,task);n.route=r||[];n.nextMoveAt=s.clock+6;return;
    }
    if(task.targetNpc){
      // 만남: 상대가 동행 중이거나 다른 일에 묶여 있으면 시작하지 않고 잠시 뒤 다시 본다.
      const m=node(s,task.targetNpc);
      if(!m||m.mode==='accompany'||m.mode==='busy'){n.route=[];n.nextMoveAt=s.clock+20;return;}
      // 상대도 만남이 끝날 때까지 붙잡아 둔다(멈춤). 일정은 유지되므로 끝나면 하던 일을 계속한다.
      m.mode='paused';m.busyUntil=Math.max(m.busyUntil||0,s.clock+(task.durationSeconds||30));m.nextMoveAt=m.busyUntil;m.route=[];
    }
    n.mode='busy';n.route=[];n.busyUntil=s.clock+(task.durationSeconds||30);n.nextMoveAt=n.busyUntil;
    addLog(w,s,spec.name+'이(가) '+(task.kind==='meet'?'다른 인물과 대화를 시작했다.':'목적지에서 행동을 시작했다.'),'npc',n);
  }
  function complete(w,s,n){
    const task=n.intent;if(!task){n.mode='idle';return;}
    const spec=w.npcs.find(x=>x.id===n.id);
    if(task.targetNpc){
      // 끝나는 순간에도 상대가 곁에 있어야 만남이 성립한다(도중에 데려가면 무산 → 다시 찾아간다).
      const m=node(s,task.targetNpc);
      if(!m||m.mode==='accompany'||manhattan(n,m)!==1){
        n.mode='moving';n.route=[];n.busyUntil=0;n.nextMoveAt=s.clock+5;
        addLog(w,s,spec.name+'의 만남이 중간에 끊겼다.','npc',n);return;
      }
    }
    n.completed.push(task.id);n.lastCompleted[task.id]=s.clock;n.lastTask=task.id;
    n.queued=n.queued.filter(t=>t.id!==task.id);
    addLog(w,s,spec.name+'이(가) '+(task.kind==='meet'?'만남':'활동')+'을 마쳤다.','npc',n);
    for(const r of w.onComplete||[]){
      if(r.when.npc===n.id&&r.when.task===task.id&&(!r.when.targetNpc||r.when.targetNpc===task.targetNpc)){
        if(r.setFlag)s.flags[r.setFlag]=true;
        if(r.queueTask)n.queued.push(clone(r.queueTask));
        if(r.publicLog)addLog(w,s,r.publicLog,'world',n);
        if(r.fact)witness(w,s,n,r.fact,[n.id,r.when.targetNpc].filter(Boolean));
      }
    }
    if(task.onCompleteFlag)s.flags[task.onCompleteFlag]=true;
    if(task.onCompleteFact)witness(w,s,n,task.onCompleteFact,[n.id]);
    n.mode='idle';n.intent=null;n.route=[];n.nextMoveAt=s.clock+5;n.busyUntil=0;
  }
  function npcStep(w,s,n){
    if(n.mode==='accompany')return;
    if(n.mode==='busy'){
      if(s.clock>=n.busyUntil)complete(w,s,n);return;
    }
    if(n.mode==='paused'){
      if(s.clock>=n.busyUntil){n.mode=n.intent?'moving':'idle';n.nextMoveAt=s.clock+4;}
      return;
    }
    if(n.mode==='idle'){decide(w,s,n);return;}
    if(n.mode!=='moving')return;
    if(!n.intent){n.mode='idle';n.nextMoveAt=s.clock+5;return;}
    if(hasReached(w,s,n,n.intent)){arrive(w,s,n);return;}
    if(!n.route.length || !isStepNext(n,n.route[0])){
      const r=routeFor(w,s,n,n.intent);n.route=r||[];
      if(!n.route.length){n.nextMoveAt=s.clock+12;return;}
    }
    const next=n.route[0];const blocker=posKey(next.x,next.y);
    const blockedByPlayer=blocker===posKey(s.player.x,s.player.y);
    const blockedByNpc=s.npcs.some(other=>other.id!==n.id&&blocker===posKey(other.x,other.y));
    if(blockedByPlayer||blockedByNpc){
      if(n.blockedSince===null)n.blockedSince=s.clock;
      if(s.clock-n.blockedSince>=8){
        const alternate=routeFor(w,s,n,n.intent);
        if(alternate&&alternate.length&&posKey(alternate[0].x,alternate[0].y)!==blocker){
          n.route=alternate;n.blockedSince=null;
          addLog(w,s,w.npcs.find(x=>x.id===n.id).name+'이(가) 막힌 통로를 피해 우회했다.','npc',n);
        }else if(s.clock-n.blockedSince>=35){
          n.intent=null;n.mode='idle';n.route=[];n.nextMoveAt=s.clock+30;n.blockedSince=null;
          addLog(w,s,w.npcs.find(x=>x.id===n.id).name+'이(가) 이동 계획을 잠시 보류했다.','npc',n);
        }
      }
      n.nextMoveAt=s.clock+4;return;
    }
    n.x=next.x;n.y=next.y;n.route.shift();n.blockedSince=null;
    n.nextMoveAt=s.clock+(w.npcs.find(x=>x.id===n.id).stepSeconds||7);
    if(hasReached(w,s,n,n.intent))arrive(w,s,n);
  }
  const isStepNext=(n,to)=>manhattan(n,to)===1;
  function stepPlayer(w,s){
    if(!s.player.route.length)return;
    let next=s.player.route[0];
    const occupied=s.npcs.some(n=>n.x===next.x&&n.y===next.y);
    if(!isStepNext(s.player,next)||occupied){
      const dest=s.player.route[s.player.route.length-1];
      const reroute=route(w,s,s.player,dest,{ignorePlayer:true});
      s.player.route=reroute;
      if(!reroute.length){s.player.nextMoveAt=0;return;}
      next=reroute[0];
    }
    const old={x:s.player.x,y:s.player.y};
    s.player.x=next.x;s.player.y=next.y;s.player.route.shift();
    s.player.nextMoveAt=s.player.route.length?s.clock+(w.player.moveSeconds||4):0;
    for(const n of s.npcs.filter(n=>n.mode==='accompany')){n.x=old.x;n.y=old.y;}
  }
  // 다음 예정 행동 시각으로 바로 건너뛴다(그 사이엔 아무도 움직이지 않으므로 1초씩 도는 것과 결과가 같다).
  // 긴 대기에서도 계산량이 '행동 횟수'에만 비례해 UUMMAI의 5초 실행 제한에 걸리지 않는다.
  function nextDue(s){
    let t=Infinity;
    if(s.player.route.length)t=Math.min(t,Math.max(s.player.nextMoveAt,s.clock+1));
    for(const n of s.npcs)if(n.mode!=='accompany')t=Math.min(t,Math.max(n.nextMoveAt,s.clock+1));
    return t;
  }
  function advance(w,state,seconds){
    const s=clone(state),end=s.clock+Math.max(0,Math.min(7200,Math.floor(seconds)));
    while(s.clock<end){
      const t=nextDue(s);
      if(t>end){s.clock=end;updateSeen(w,s);break;}
      if(t-1>s.clock){s.clock=t-1;updateSeen(w,s);} // 직전 초까지 보이던 인물의 '마지막으로 본 시각'
      s.clock=t;
      if(s.player.route.length&&s.player.nextMoveAt<=s.clock)stepPlayer(w,s);
      for(const n of s.npcs){if(n.mode!=='accompany'&&n.nextMoveAt<=s.clock)npcStep(w,s,n);}
      updateSeen(w,s);
    }
    s.day=1+Math.floor(s.clock/DAY);
    s.revision++;
    return s;
  }
  // 시간 건너뛰기: 최대 2일. stop(s)가 참이 되는 순간(사건 단위) 멈춘다 → {state, stopped}.
  function advanceUntil(w,state,seconds,stop){
    const s=clone(state),end=s.clock+Math.max(0,Math.min(2*DAY,Math.floor(seconds)));let stopped=false;
    while(s.clock<end){
      const t=nextDue(s);
      if(t>end){s.clock=end;updateSeen(w,s);break;}
      if(t-1>s.clock){s.clock=t-1;updateSeen(w,s);}
      s.clock=t;
      if(s.player.route.length&&s.player.nextMoveAt<=s.clock)stepPlayer(w,s);
      for(const n of s.npcs){if(n.mode!=='accompany'&&n.nextMoveAt<=s.clock)npcStep(w,s,n);}
      updateSeen(w,s);
      if(stop&&stop(s)){stopped=true;break;}
    }
    s.day=1+Math.floor(s.clock/DAY);s.revision++;
    return {state:s,stopped};
  }
  // 절대 시각(초) ← '2일 06:00' 또는 '06:00'(1일)
  function absTime(v){if(typeof v==='number')return v;const m=/^(?:(\d+)일\s*)?(\d{1,2}):(\d{2})$/.exec(String(v||'').trim());return m?((+(m[1]||1))-1)*DAY+(+m[2])*3600+(+m[3])*60:0;}
  // 물건: 등장 조건(시각 from·플래그 flag)이 맞고 아직 아무도 가져가지 않았을 때만 그 자리에 있다.
  function itemsAt(w,s,lmId){
    return (w.items||[]).filter(it=>it.at===lmId&&!(s.player.items||{})[it.id]&&(!it.from||s.clock>=absTime(it.from))&&(!it.flag||s.flags[it.flag]));
  }
  // 시간대(아침·오후·저녁·밤)와 날짜. 첫 시간대 이전(새벽)은 전날 밤으로 본다.
  function slotOf(w,s){
    const slots=w.slots||[];if(!slots.length)return null;
    const tod=s.clock%DAY;let day=1+Math.floor(s.clock/DAY),i=-1;
    slots.forEach((sl,k)=>{if(tod>=absTime(sl.from))i=k;});
    if(i<0){i=slots.length-1;day--;}
    return {day,index:i,name:slots[i].name,start:(day-1)*DAY+absTime(slots[i].from)};
  }
  // 이전 방식(1초씩). 테스트에서 결과 동일성 비교용.
  function advanceSlow(w,state,seconds){
    const s=clone(state),end=s.clock+Math.max(0,Math.min(7200,Math.floor(seconds)));
    for(;s.clock<end;){
      s.clock++;
      if(s.player.route.length&&s.player.nextMoveAt<=s.clock)stepPlayer(w,s);
      for(const n of s.npcs){if(n.mode!=='accompany'&&n.nextMoveAt<=s.clock)npcStep(w,s,n);}
      updateSeen(w,s);
    }
    s.day=1+Math.floor(s.clock/DAY);
    s.revision++;
    return s;
  }
  // AI가 붙인 사건 코드(e)는 조건을 검사한 뒤에만 인정한다. 대화가 반영되기 전(pend가 남아 있을 때) 호출.
  function applyEvent(w,state,e){
    const code=String(e||'').trim().toUpperCase();
    if(!code)return {state,accepted:false,reason:''};
    const rule=(w.events||{})[code];
    if(!rule)return {state,accepted:false,reason:'알 수 없는 사건 코드'};
    const kinds=rule.kinds||(rule.kind?[rule.kind]:null);
    if(kinds&&!kinds.includes(state.pk))return {state,accepted:false,reason:'대화 종류가 맞지 않음'};
    if(rule.npcs&&!rule.npcs.includes(state.pend))return {state,accepted:false,reason:'이 인물에게는 인정되지 않음'};
    if(rule.flag&&state.flags[rule.flag])return {state,accepted:false,reason:'이미 기록됨'};
    const s=clone(state);
    if(rule.flag)s.flags[rule.flag]=true;
    addLog(w,s,rule.log||('사건 '+code+' 기록'),'world');
    return {state:s,accepted:true,reason:''};
  }
  // 증언(k): AI가 '대상이 대사로 말한 기억'의 코드를 적으면, 대상이 정말 그 기억을 가졌을 때만
  // 플레이어 단서에 '○○에게 들음'으로 기록한다. 사실이 참이라고 확정하지는 않는다(주장으로만 보관).
  function factCode(w,id){const i=(w.facts||[]).findIndex(f=>f.id===id);return i<0?'':'기억'+String(i+1).padStart(3,'0');}
  function hearFacts(w,state,k){
    const out={state,accepted:[],rejected:[]};
    const codes=[...new Set((String(k||'').match(/\d{1,3}/g)||[]).map(Number))];
    if(!codes.length)return out;
    const n=state.pend&&node(state,state.pend);
    if(!n){out.rejected=codes.map(c=>[c,'대화 상대가 없음']);return out;}
    const s=clone(state),m=node(s,n.id),idx=w.npcs.findIndex(x=>x.id===n.id);
    for(const c of codes){
      const f=(w.facts||[])[c-1];
      if(!f){out.rejected.push([c,'없는 기억 번호']);continue;}
      if(!(m.mem||[]).some(x=>x[0]===f.id)){out.rejected.push([c,'이 인물은 모르는 일']);continue;}
      learn(s.player,f.id,2+idx,s.clock);out.accepted.push(c);
    }
    out.state=s;return out;
  }
  // 로어북을 켜는 표식. 화면이 매 메시지 머리말에 붙인다(검색 범위 '현재 유저 입력만' 항목용).
  function markers(w,s){
    const out=['#장'+(w.chapter||1)];
    // 시간대 갈래 표식: #1일저녁A. A는 인라인(메인), 조건이 맞으면 B·C…(어느 갈래인지는 화면이 판정)
    const sl=slotOf(w,s);
    if(sl){const b=(w.branches||[]).find(b=>(!b.flag||s.flags[b.flag])&&(!b.slot||b.slot===sl.day+'일'+sl.name));out.push('#'+sl.day+'일'+sl.name+(b?b.letter:'A'));}
    for(const m of w.markers||[])if(s.flags[m.flag])out.push(m.token);
    return out;
  }
  function dispatch(w,state,action){
    let s=clone(state);const player=s.player;
    if(action.type==='MOVE_TO'||action.type==='MOVE_ONE'){
      const target=action.type==='MOVE_ONE'?{x:player.x+action.dx,y:player.y+action.dy}:{x:action.x,y:action.y};
      if(!walkable(w,target.x,target.y)){addLog(w,s,'그곳으로는 이동할 수 없다.','player');return s;}
      const p=route(w,s,player,target,{ignorePlayer:true});
      if(!p.length&&manhattan(player,target)>0){addLog(w,s,'갈 수 있는 경로가 없다.','player');return s;}
      player.route=p;player.nextMoveAt=s.clock+(w.player.moveSeconds||4);
      addLog(w,s,p.length?'목적지로 이동을 시작했다.':'이미 그곳에 있다.','player');
    }else if(action.type==='ACCOMPANY'){
      const n=node(s,action.npcId);
      if(!n||manhattan(player,n)>1){addLog(w,s,'동행하려면 해당 인물 가까이 있어야 한다.','player');return s;}
      if(n.mode==='busy'||n.mode==='accompany'||(n.intent&&!n.intent.interruptible)){
        addLog(w,s,'지금은 동행할 수 없다.','player');return s;
      }
      if(n.intent){
        // onAccompany: 'cancel'(기본, 이번 일정은 다시 고르지 않음) / 'postpone'(동행이 끝나면 다시 고를 수 있음)
        if(n.intent.onAccompany!=='postpone')n.excluded.push(n.intent.id);
        if(n.intent.onInterrupt)s.flags[n.intent.onInterrupt]=true;
        if(n.intent.onInterruptFact)learn(n,n.intent.onInterruptFact,0,s.clock);
      }
      n.mode='accompany';n.intent=null;n.route=[];n.nextMoveAt=0;n.busyUntil=0;n.blockedSince=null;
      addLog(w,s,w.npcs.find(x=>x.id===n.id).name+'이(가) 동행을 수락했다. 기존 방문 일정은 취소됐다.','player');
    }else if(action.type==='RELEASE'){
      const n=node(s,action.npcId);
      if(n&&n.mode==='accompany'){n.mode='idle';n.nextMoveAt=s.clock+5; n.route=[];
        addLog(w,s,w.npcs.find(x=>x.id===n.id).name+'이(가) 다시 독립 행동을 시작했다.','player');}
    }else if(action.type==='TALK_REQUEST'){
      // 대화는 AI가 응답한 뒤 applyTalk()로 시간을 반영한다. 여기서는 대상만 잠근다.
      const n=node(s,action.npcId);
      if(!n||manhattan(player,n)>1){addLog(w,s,'대화하려면 인물에게 접근해야 한다.','player');return s;}
      if(n.mode==='busy'){addLog(w,s,'현재 진행 중인 행동이 있어 대화를 나누기 어렵다.','player');return s;}
      s.pend=n.id;s.pk=action.kind||'T';s.pc=Math.max(0,Math.min(2000,action.chars|0));player.route=[];player.nextMoveAt=0;
    }else if(action.type==='WAIT')return advance(w,s,action.seconds||60);
    else if(action.type==='SEARCH'){
      // 조사: 랜드마크 자리나 그 가구 칸 바로 옆에서. 시간이 든다. 있으면 소지품으로.
      const l=landmark(w,action.landmark);
      if(!l)return s;
      const spots=[{x:l.x,y:l.y},...(l.hit||[]).map(h=>({x:h[0],y:h[1]}))];
      if(!spots.some(p=>manhattan(player,p)<=1)){addLog(w,s,'조사하려면 '+l.name+' 가까이 가야 한다.','player');return s;}
      const t=advance(w,s,w.searchSeconds||20);s=t;
      const found=itemsAt(w,s,l.id);
      if(!s.player.items)s.player.items={};
      for(const it of found)s.player.items[it.id]=s.clock;
      addLog(w,s,found.length?l.name+'에서 '+josa(found.map(i=>i.name).join(', '),'을','를')+' 찾았다.':l.name+' 주변을 뒤졌지만 아무것도 없었다.','player');
      return s;
    }else if(action.type==='GO_HOME'){
      // 객실로 귀환: 꿈(노멀 루트)에서만. 현실(진엔딩)에서는 쓸 수 없다.
      if(s.flags[w.realityFlag||'true_route']){addLog(w,s,'지금은 쓸 수 없다.','player');return s;}
      const h=w.player.home||w.player;player.x=h.x;player.y=h.y;player.route=[];player.nextMoveAt=0;
      for(const n of s.npcs.filter(n=>n.mode==='accompany')){n.mode='idle';n.nextMoveAt=s.clock+5;}
      addLog(w,s,'눈을 감았다 뜨니 객실이었다.','player');
    }
    else if(action.type==='CLEAR_ROUTE'){s.player.route=[];s.player.nextMoveAt=0;addLog(w,s,'이동을 멈췄다.','player');}
    s.revision++;return s;
  }
  // AI 응답의 경과 시간(초)을 반영한다. 같은 체크포인트에서 다시 마운트해도 결과가 같다.
  function applyTalk(w,state,seconds){
    const sec=Math.max(0,Math.min(900,Math.floor(Number(seconds)||0)));
    let s=clone(state);
    if(s.pend===undefined)s.pend=null;
    const n=s.pend?node(s,s.pend):null;
    if(n&&n.mode!=='accompany'){n.mode='paused';n.busyUntil=s.clock+sec;n.nextMoveAt=n.busyUntil;}
    s.player.route=[];s.player.nextMoveAt=0;s.pend=null;s.pk='';s.pc=0;
    if(sec>0){addLog(w,s,(n?w.npcs.find(x=>x.id===n.id).name+'와(과) ':'')+'대화하며 '+sec+'초가 지났다.','player');s=advance(w,s,sec);}
    else s.revision++;
    return s;
  }
  // 대화 시간은 AI가 정하지 않고 글자 수로 계산한다(초당 약 6자 + 기본 4초).
  function talkSeconds(userChars,replyChars){return Math.max(5,Math.min(600,Math.ceil(((userChars|0)+(replyChars|0))/6)+4));}
  // NPC가 스스로 아는 현재 행동을 짧은 말로.
  function describe(w,s,n){
    const name=id=>(w.npcs.find(x=>x.id===id)||{}).name||id, place=id=>(landmark(w,id)||{}).name||'어딘가';
    if(n.mode==='accompany')return '플레이어와 동행 중';
    if(n.mode==='busy'&&n.intent)return n.intent.targetNpc?name(n.intent.targetNpc)+'와 이야기하는 중':place(n.intent.landmark)+'에서 일하는 중';
    if(n.intent)return n.intent.targetNpc?name(n.intent.targetNpc)+'에게 가는 중':place(n.intent.landmark)+' 쪽으로 가는 중';
    return '한가함';
  }
  function diagnostics(w,s){
    return s.npcs.map(n=>({id:n.id,name:w.npcs.find(x=>x.id===n.id).name,mode:n.mode,
      pos:`(${n.x},${n.y})`,plan:n.intent?.id||null,nextMoveAt:n.nextMoveAt,remaining:n.route.length,
      completed:n.completed.join(',')||'—',excluded:n.excluded.join(',')||'—'}));
  }
  function validate(w,s){
    if(s.schema!=='TROEMEREI_NPC_V1'||s.worldId!==w.map.id)throw Error('Invalid checkpoint schema/world');
    for(const x of [s.player,...s.npcs])if(!walkable(w,x.x,x.y))throw Error('Invalid position '+x.x+','+x.y);
    return true;
  }
  return {createWorld, advance, advanceUntil, absTime, itemsAt, slotOf, advanceSlow, applyEvent, hearFacts, factCode, markers, dispatch, applyTalk, talkSeconds, describe, areaOf, sees, route, walkable, clock, diagnostics, validate, clone};
})();
if(typeof module!=='undefined')module.exports=TroemereiNPC;
