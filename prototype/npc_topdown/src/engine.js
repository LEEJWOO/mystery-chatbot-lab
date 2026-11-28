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
  // 숨은 공간: map.secrets의 칸은 벽('#')이지만, 그 플래그가 켜진 뒤에는(상태 s를 넘긴 경우) 지나갈 수 있다.
  const secretAt = (w,x,y) => (w.map.secrets||[]).find(q=>q.x===x&&q.y===y);
  // 막는 칸(map.guards): 열림 플래그가 꺼져 있으면 지나갈 수 없다(예: 공지 전 재판장 문 — 지배인이 막는다).
  const guardAt = (w,x,y) => (w.map.guards||[]).find(G=>G.cells.some(c=>c[0]===x&&c[1]===y));
  const guarded = (w,x,y,s) => { const G=guardAt(w,x,y); return !!G&&!(s&&s.flags&&s.flags[G.open]); };
  const walkable = (w,x,y,s) => { if(!inBounds(w,x,y))return false; if(guarded(w,x,y,s))return false; if(w.map.rows[y][x]!=='#')return true; const q=s&&secretAt(w,x,y); return !!(q&&s.flags&&s.flags[q.flag]); };
  // 계단 등 연결 칸: map.links [{a:[x,y], b:[x,y], name}]. 한 칸에서 다른 칸으로 한 걸음에 이어진다(층 사이 이동).
  const linkOf = (w,x,y) => { for(const L of w.map.links||[]){ if(L.a[0]===x&&L.a[1]===y)return {x:L.b[0],y:L.b[1],L}; if(L.b[0]===x&&L.b[1]===y)return {x:L.a[0],y:L.a[1],L}; } return null; };
  const linked = (w,p,q) => { const o=linkOf(w,p.x,p.y); return !!o&&o.x===q.x&&o.y===q.y; };
  const node = (s,id) => s.npcs.find(n=>n.id===id);
  const landmark = (w,id) => w.map.landmarks.find(x=>x.id===id);
  const DAY=86400;
  const josa=(w,a,b)=>{const c=String(w).charCodeAt(String(w).length-1)-0xac00;return w+(c>=0&&c<11172&&c%28?a:b);};
  // 방 번호(-1은 통로). 같은 방이고 6칸 이내면 서로 보인다(통로끼리는 3칸).
  function areaOf(w,x,y){return w.map.areas.findIndex(a=>x>=a.x0&&x<=a.x1&&y>=a.y0&&y<=a.y1);}
  // 시선을 막는 칸: 벽과 키 큰 가구('#'). 낮은 가구(low: 책상·벤치·상자·분수 등)는 막지 않는다.
  const blockCache=new WeakMap();
  function blockers(w){
    let b=blockCache.get(w);if(b)return b;
    const low=new Set();for(const p of w.map.props||[])if(p.low)for(let y=p.y;y<p.y+p.h;y++)for(let x=p.x;x<p.x+p.w;x++)low.add(posKey(x,y));
    b=new Set();w.map.rows.forEach((r,y)=>[...r].forEach((c,x)=>{if(c==='#'&&!low.has(posKey(x,y)))b.add(posKey(x,y));}));
    blockCache.set(w,b);return b;
  }
  // 두 칸 사이 직선(브레젠험)이 막힌 칸을 지나지 않으면 보인다.
  // 대칭 판정: A→B와 B→A 직선이 둘 다 막히지 않아야 보인다(방향에 따라 결과가 달라지지 않게)
  function lineOfSight(w,a,b){return losOne(w,a,b)&&losOne(w,b,a);}
  function losOne(w,a,b){
    const B=blockers(w);let x=a.x,y=a.y;const dx=abs(b.x-a.x),dy=-abs(b.y-a.y),sx=a.x<b.x?1:-1,sy=a.y<b.y?1:-1;let err=dx+dy;
    while(!(x===b.x&&y===b.y)){const e2=2*err;if(e2>=dy){err+=dy;x+=sx;}if(e2<=dx){err+=dx;y+=sy;}if(x===b.x&&y===b.y)break;if(B.has(posKey(x,y)))return false;}
    return true;
  }
  // 시야: 같은 방 안 w.sightRange 칸(기본 6). 문 칸(어느 방에도 속하지 않음)은 맞닿은 방들에 함께 속한 것으로 본다.
  function areasNear(w,x,y){const r=areaOf(w,x,y);if(r>=0)return [r];const o=[];for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const k=areaOf(w,x+dx,y+dy);if(k>=0&&!o.includes(k))o.push(k);}return o;}
  function sees(w,a,b){const A=areasNear(w,a.x,a.y),B=areasNear(w,b.x,b.y);if(!A.some(k=>B.includes(k)))return false;
    const both=areaOf(w,a.x,a.y)<0&&areaOf(w,b.x,b.y)<0;return manhattan(a,b)<=(both?3:(w.sightRange||6))&&lineOfSight(w,a,b);}
  // 기억: [사실ID, 역할, 시각]. 역할 0 직접 · 1 목격 · 2+i 인물 i에게 들음(증언). 인물당 최근 12개.
  function learn(target,factId,role,time){
    if(!target.mem)target.mem=[];
    if(target.mem.some(m=>m[0]===factId&&m[1]===role))return;
    target.mem.push([factId,role,time]);if(target.mem.length>12)target.mem.shift();
  }
  function witness(w,s,actor,factId,direct){
    for(const id of direct){const m=node(s,id);if(m)learn(m,factId,0,s.clock);}
    for(const o of s.npcs)if(!direct.includes(o.id)&&sees(w,o,actor))learn(o,factId,1,s.clock);
    if(sees(w,s.player,actor)){learn(s.player,factId,1,s.clock);checkScenes(w,s);}
  }
  function updateSeen(w,s){
    for(const n of s.npcs)if(sees(w,s.player,n))s.player.seen[n.id]=[areaOf(w,n.x,n.y),s.clock];
    checkScenes(w,s);checkCases(w,s);
  }
  // ---------- 사건: 실제로 일어난 일(플래그) → 발견(시선) → 방송·집합 → 현장 방에 들어가면 사건 대본(집합·조사) → 갈래별 재판 ----------
  // w.cases=[{id, flag, from(이 시각 이후 발견), spot(랜드마크), watchers:[NPC id], task(모두 현장으로 가는 일정), trial(집합·조사 대본 코드), notice}]
  // s.cases[id] = [단계(1 발견·2 시작), 발견 시각, 발견자(0 플레이어, i+1 NPC)]
  function checkCases(w,s){
    if(!w.cases)return;if(!s.cases)s.cases={};
    for(const c of w.cases){
      const st=s.cases[c.id];const l=landmark(w,c.spot);if(!l)continue;
      if(!st){
        if(!s.flags[c.flag]||(c.from&&s.clock%DAY<secs(c.from)))continue;
        let by=-1;if(sees(w,s.player,l))by=0;
        else for(const id of c.watchers||[]){const i=s.npcs.findIndex(n=>n.id===id);if(i>=0&&sees(w,s.npcs[i],l)){by=i+1;break;}}
        if(by<0)continue;
        s.cases[c.id]=[1,s.clock,by];
        addLog(w,s,(c.notice||'사건이 발견되었습니다.')+' (발견: '+(by===0?'당신':nm(w,s,w.npcs[by-1].id))+')','world');
        for(const n of s.npcs){ // 모두 현장으로
          if(n.mode==='accompany')continue;
          n.queued=n.queued.filter(t=>t.id!==c.task.id);n.queued.unshift(clone(c.task));
          if(n.mode!=='busy'&&n.mode!=='paused'){n.intent=null;n.mode='idle';n.route=[];n.nextMoveAt=s.clock+2;}
        }
      }else if(st[0]===1&&!s.trial&&areaOf(w,s.player.x,s.player.y)===areaOf(w,l.x,l.y)){
        const room=areaOf(w,l.x,l.y),all=s.npcs.every(n=>n.mode==='accompany'||areaOf(w,n.x,n.y)===room);
        if(all||s.clock-st[1]>=(c.wait||600)){st[0]=2;openTrial(w,s,c.trial,false);}
      }
    }
  }
  function branchLetter(w,s){const b=(w.branches||[]).find(b=>!b.slot&&s.flags[b.flag]);return b?b.letter:'A';}
  // 목격 장면(앨범): 정해 둔 장면만 해금한다(목격 기록을 글로 쌓지 않는다).
  //  fact: 플레이어가 그 사실을 직접 보거나 겪었을 때(증언으로 들은 건 제외)
  //  npc+area(+from/to): 그 인물이 그 방에 있는 걸 그 시간대에 봤을 때
  function checkScenes(w,s){
    if(!w.scenes)return;const p=s.player;if(!p.scenes)p.scenes={};
    for(const sc of w.scenes){
      if(p.scenes[sc.id]!==undefined)continue;
      let ok=false;
      if(sc.fact)ok=(p.mem||[]).some(m=>m[0]===sc.fact&&m[1]<=1);
      else if(sc.npc){const n=node(s,sc.npc),tod=s.clock%DAY,lm=sc.near&&landmark(w,sc.near);
        // near: 그 인물이 그 자리(랜드마크) 반경 radius칸 안에 있을 때만 — '그 방에 있었다'가 아니라 '그 근처에 있었다'
        ok=!!n&&sees(w,p,n)&&(!sc.area||(w.map.areas[areaOf(w,n.x,n.y)]||{}).name===sc.area)&&(!lm||manhattan(n,lm)<=(sc.radius||1))&&(!sc.from||tod>=absTime(sc.from))&&(!sc.to||tod<absTime(sc.to));}
      if(ok)p.scenes[sc.id]=s.clock;
    }
  }
  // 로그 공개는 시야 판정(sees)과 같은 기준을 쓴다.
  function addLog(w,s,text,type='world',at=null) {
    const visible=type==='player'||!at||sees(w,s.player,at);
    s.logs.push({time:s.clock,text,type,visible});
    if(s.logs.length>100)s.logs.shift();
  }
  function createWorld(w,seed=246813579){
    const t0=w.startTime?secs(w.startTime):9*3600; // 시작 시각(세계 데이터 startTime, 없으면 09:00)
    const s={schema:'TROEMEREI_NPC_V1',version:1,worldId:w.map.id,day:1,clock:t0,
      rng:seed>>>0 || 1, player:{x:w.player.x,y:w.player.y,route:[],nextMoveAt:0,mem:[],seen:{},items:{},talked:{},scenes:{}},
      npcs:w.npcs.map((n,i)=>({id:n.id,x:n.x,y:n.y,mode:'idle',intent:null,route:[],
        nextMoveAt:t0+10+i*4,busyUntil:0,blockedSince:null,completed:[],
        excluded:[],lastTask:'',lastCompleted:{},queued:[],meetings:[],followOffset:0,mem:(n.knows||[]).map(f=>[f,0,t0])})),
      flags:Object.fromEntries((w.flagNames||[]).map(f=>[f,false])),
      logs:[],revision:0,pend:null,pk:'',pc:0};
    relInit(w,s.player);
    s.player.look=null; // 체크인 전(첫 화면에서 외형을 고른다)
    if(w.device){s.player.batAt=s.clock;s.player.batUsed=0;s.player.cells=(w.device.cells||8)-1;} // 팔찌: 끼운 시각·기능 소모(초)·남은 예비 전지
    addLog(w,s,'시뮬레이션이 시작되었다. NPC들은 각자의 일정에 따라 행동한다.','player');
    // Decisions exist from the first frame; the player can cancel a planned visit before movement.
    for(const n of s.npcs)decide(w,s,n);
    updateSeen(w,s);
    return s;
  }
  function route(w,s,from,to,{ignorePlayer=false,ignoreNpc=null}={}){
    if (!walkable(w,to.x,to.y,s))return [];
    const occupied=new Set(s.npcs.filter(n=>n.id!==ignoreNpc && !(n.id===from.id)).map(n=>posKey(n.x,n.y)));
    if(!ignorePlayer)occupied.add(posKey(s.player.x,s.player.y));
    const q=[{x:from.x,y:from.y}],prev=new Map([[posKey(from.x,from.y),null]]),v=new Map([[posKey(from.x,from.y),q[0]]]);
    for(let i=0;i<q.length;i++){
      const p=q[i], k=posKey(p.x,p.y);
      if(p.x===to.x&&p.y===to.y){const out=[];let curr=k;while(prev.get(curr)!==null){out.push(v.get(curr));curr=prev.get(curr);}return out.reverse();}
      const lk=linkOf(w,p.x,p.y), nb=[[1,0],[0,1],[-1,0],[0,-1]].map(([dx,dy])=>[p.x+dx,p.y+dy]); if(lk)nb.push([lk.x,lk.y]);
      for(const [nx,ny] of nb){
        const nk=posKey(nx,ny);
        if(walkable(w,nx,ny,s)&&!prev.has(nk)&&(!occupied.has(nk)||(nx===from.x&&ny===from.y))){
          const point={x:nx,y:ny};prev.set(nk,k);v.set(nk,point);q.push(point);
        }
      }
    }
    return [];
  }
  function goalOf(w,s,task){
    if(task.targetPlayer)return {target:s.player,goal:{x:s.player.x,y:s.player.y}}; // 플레이어를 찾아가 먼저 말 걸기
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
    const occupied=s.npcs.some(other=>other.id!==n.id&&other.x===g.goal.x&&other.y===g.goal.y)||(s.player.x===g.goal.x&&s.player.y===g.goal.y); // 플레이어가 서 있어도 옆으로
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
    // ifFlag: 그 플래그(배열이면 그중 하나)가 켜졌을 때만 / unlessFlag: 켜져 있으면 안 함
    if(t.ifFlag&&![].concat(t.ifFlag).some(f=>s.flags[f]))return false;
    if(t.unlessFlag&&[].concat(t.unlessFlag).some(f=>s.flags[f]))return false;
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
    addLog(w,s,nm(w,s,spec.id)+'이(가) 새로운 목적지를 향해 움직이기 시작했다.','npc',n);
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
    if(task.targetPlayer){addLog(w,s,nm(w,s,spec.id)+'이(가) 다가와 말을 걸었다.','call',n);return;}
    addLog(w,s,nm(w,s,spec.id)+'이(가) '+(task.kind==='meet'?'다른 인물과 대화를 시작했다.':'목적지에서 행동을 시작했다.'),'npc',n);
  }
  function complete(w,s,n){
    const task=n.intent;if(!task){n.mode='idle';return;}
    const spec=w.npcs.find(x=>x.id===n.id);
    if(task.targetPlayer){finishCall(s,n);addLog(w,s,nm(w,s,spec.id)+'이(가) 대답을 기다리다 돌아갔다.','npc',n);return;}
    if(task.targetNpc){
      // 끝나는 순간에도 상대가 곁에 있어야 만남이 성립한다(도중에 데려가면 무산 → 다시 찾아간다).
      const m=node(s,task.targetNpc);
      if(!m||m.mode==='accompany'||manhattan(n,m)!==1){
        n.mode='moving';n.route=[];n.busyUntil=0;n.nextMoveAt=s.clock+5;
        addLog(w,s,nm(w,s,spec.id)+'의 만남이 중간에 끊겼다.','npc',n);return;
      }
    }
    n.completed.push(task.id);n.lastCompleted[task.id]=s.clock;n.lastTask=task.id;
    n.queued=n.queued.filter(t=>t.id!==task.id);
    addLog(w,s,nm(w,s,spec.id)+'이(가) '+(task.kind==='meet'?'만남':'활동')+'을 마쳤다.','npc',n);
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
    if(playerBlocks(w,s,n.intent)){if(manhattan(n,s.player)===1){askMove(w,s,n,n.intent);return;}}
    else if(s.block&&s.block.npc===n.id)s.block=null;
    if(hasReached(w,s,n,n.intent)){arrive(w,s,n);return;}
    if(!n.route.length || !isStepNext(w,n,n.route[0])){
      const r=routeFor(w,s,n,n.intent);n.route=r||[];
      if(!n.route.length){n.nextMoveAt=s.clock+12;return;}
    }
    const next=n.route[0];const blocker=posKey(next.x,next.y);
    const blockedByPlayer=blocker===posKey(s.player.x,s.player.y);
    const blockedByNpc=s.npcs.some(other=>other.id!==n.id&&blocker===posKey(other.x,other.y));
    if(blockedByNpc){
      // 마주 걸어오다 서로 막힘(상대의 다음 칸이 내 자리): 같은 쪽으로 동시에 비켜서 '와리가리'가 나지 않게, 목록 뒤쪽 인물만 옆으로 비킨다.
      const other=s.npcs.find(o=>o.id!==n.id&&posKey(o.x,o.y)===blocker);
      if(other&&other.mode==='moving'&&other.route.length&&other.route[0].x===n.x&&other.route[0].y===n.y){
        if(s.npcs.indexOf(n)<s.npcs.indexOf(other)){n.nextMoveAt=s.clock+3;return;}   // 앞쪽 인물은 그대로 기다린다
        const occ=new Set([...s.npcs.map(o=>posKey(o.x,o.y)),posKey(s.player.x,s.player.y)]);
        const dx=Math.sign(next.x-n.x),dy=Math.sign(next.y-n.y);
        const side=[[dy,dx],[-dy,-dx],[-dx,-dy]].map(([ax,ay])=>({x:n.x+ax,y:n.y+ay})).find(p=>walkable(w,p.x,p.y)&&!occ.has(posKey(p.x,p.y)));
        if(side){n.x=side.x;n.y=side.y;n.route=[];n.blockedSince=null;n.nextMoveAt=s.clock+(w.npcs.find(x=>x.id===n.id).stepSeconds||7);
          addLog(w,s,nm(w,s,n.id)+'이(가) '+nm(w,s,other.id)+'에게 길을 비켜 주었다.','npc',n);return;}
      }
    }
    if(blockedByPlayer||blockedByNpc){
      if(n.blockedSince===null)n.blockedSince=s.clock;
      if(s.clock-n.blockedSince>=8){
        const alternate=routeFor(w,s,n,n.intent);
        if(alternate&&alternate.length&&posKey(alternate[0].x,alternate[0].y)!==blocker){
          n.route=alternate;n.blockedSince=null;
          addLog(w,s,nm(w,s,n.id)+'이(가) 막힌 통로를 피해 우회했다.','npc',n);
        }else if(s.clock-n.blockedSince>=35){
          n.intent=null;n.mode='idle';n.route=[];n.nextMoveAt=s.clock+30;n.blockedSince=null;
          addLog(w,s,nm(w,s,n.id)+'이(가) 이동 계획을 잠시 보류했다.','npc',n);
        }
      }
      n.nextMoveAt=s.clock+4;return;
    }
    n.x=next.x;n.y=next.y;n.route.shift();n.blockedSince=null;
    n.nextMoveAt=s.clock+(w.npcs.find(x=>x.id===n.id).stepSeconds||7);
    if(hasReached(w,s,n,n.intent))arrive(w,s,n);
  }
  // ---------- 비켜 달라는 말: 플레이어가 인물이 가려던 자리에 서 있으면, 다가와 말을 건다(AI 없이 대본 대사) ----------
  // task.block = {tries(몇 번까지 부탁하나, 기본 w.blockTalk.tries 또는 1), wait(대답 기다리는 초, 기본 40), urgent, reason}
  // 부탁 횟수를 넘기면 단념: 한 번뿐인 일(once)은 그날 다시 하지 않는다(→ 사건을 막는 길), 반복하는 일은 쉬었다가 다시 고른다.
  function playerBlocks(w,s,task){if(!task||task.targetPlayer||task.targetNpc)return false;const g=goalOf(w,s,task);return !!g&&s.player.x===g.goal.x&&s.player.y===g.goal.y;}
  function askMove(w,s,n,task){
    const b=task.block||{},bt=w.blockTalk||{},max=b.tries||bt.tries||1;if(!n.asks)n.asks={};
    const k=(n.asks[task.id]||0)+1;
    if(k>max){
      delete n.asks[task.id];if(task.once)n.excluded.push(task.id);else n.lastCompleted[task.id]=s.clock;
      n.intent=null;n.mode='idle';n.route=[];n.nextMoveAt=s.clock+20;if(s.block&&s.block.npc===n.id)s.block=null;
      addLog(w,s,nm(w,s,n.id)+'이(가) 단념하고 다른 일을 하러 갔다.','npc',n);return;
    }
    n.asks[task.id]=k;n.mode='paused';n.route=[];n.busyUntil=s.clock+(b.wait||bt.wait||40);n.nextMoveAt=n.busyUntil;
    s.block={npc:n.id,task:task.id,n:k,max,urgent:!!b.urgent,at:s.clock,reason:b.reason||bt.reason||'당신이 서 있는 자리에 볼일이 있어 비켜 주었으면 하는 듯하다'};
    addLog(w,s,nm(w,s,n.id)+'이(가) 다가와 비켜 달라고 말을 걸었다.','call',n);
  }
  // 먼저 말 걸기 일정 끝내기(대화를 받았거나, 거절했거나, 기다리다 지침)
  function finishCall(s,n){const t=n.intent;if(t){n.completed.push(t.id);n.lastCompleted[t.id]=s.clock;n.lastTask=t.id;}n.mode='idle';n.intent=null;n.route=[];n.busyUntil=0;n.nextMoveAt=s.clock+5;}
  function caller(w,s){return s.npcs.find(n=>n.mode==='busy'&&n.intent&&n.intent.targetPlayer&&manhattan(n,s.player)===1)||null;}
  const isStepNext=(w,n,to)=>manhattan(n,to)===1||linked(w,n,to);
  function stepPlayer(w,s){
    if(!s.player.route.length)return;
    let next=s.player.route[0];
    const occupied=s.npcs.some(n=>n.x===next.x&&n.y===next.y);
    if(!isStepNext(w,s.player,next)||occupied){
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
  function nextDue(s,w){
    let t=Infinity;
    if(w&&inInvestigation(w,s))t=Math.min(t,Math.max(s.trial.sub,s.clock+1)); // 조사 마감
    if(w)for(const c of w.cases||[]){const v=(s.cases||{})[c.id];if(v&&v[0]===1){const at=v[1]+(c.wait||600);if(at>s.clock)t=Math.min(t,at);}}
    if(w)for(const c of w.cases||[])if(c.from&&s.flags[c.flag]&&!(s.cases||{})[c.id]){const at=Math.floor(s.clock/DAY)*DAY+secs(c.from);if(at>s.clock)t=Math.min(t,at);} // 발견 가능 시각
    if(s.player.route.length)t=Math.min(t,Math.max(s.player.nextMoveAt,s.clock+1));
    for(const n of s.npcs)if(n.mode!=='accompany')t=Math.min(t,Math.max(n.nextMoveAt,s.clock+1));
    return t;
  }
  function advance(w,state,seconds){
    const s=clone(state),end=s.clock+Math.max(0,Math.min(7200,Math.floor(seconds)));
    while(s.clock<end){
      if(s.trial&&!inInvestigation(w,s))break; // 재판 중에는 시간이 흐르지 않는다
      const t=nextDue(s,w);
      if(t>end){s.clock=end;updateSeen(w,s);break;}
      if(t-1>s.clock){s.clock=t-1;updateSeen(w,s);if(s.trial&&!inInvestigation(w,s))break;} // 직전 초까지 보이던 인물의 '마지막으로 본 시각'
      s.clock=t;
      if(s.player.route.length&&s.player.nextMoveAt<=s.clock)stepPlayer(w,s);
      for(const n of s.npcs){if(n.mode!=='accompany'&&n.nextMoveAt<=s.clock)npcStep(w,s,n);}
      updateSeen(w,s);checkDeadline(w,s);
      if(s.trial&&!inInvestigation(w,s))break; // 재판이 열리면 시간 정지(마감·집합 시작 순간에서 멈춤)
    }
    s.day=1+Math.floor(s.clock/DAY);
    s.revision++;
    return s;
  }
  // 시간 건너뛰기: 최대 2일. stop(s)가 참이 되는 순간(사건 단위) 멈춘다 → {state, stopped}.
  function advanceUntil(w,state,seconds,stop){
    const s=clone(state),end=s.clock+Math.max(0,Math.min(2*DAY,Math.floor(seconds)));let stopped=false;
    while(s.clock<end){
      if(s.trial&&!inInvestigation(w,s))break; // 재판 중에는 시간이 흐르지 않는다
      const t=nextDue(s,w);
      if(t>end){s.clock=end;updateSeen(w,s);break;}
      if(t-1>s.clock){s.clock=t-1;updateSeen(w,s);if(s.trial&&!inInvestigation(w,s))break;}
      s.clock=t;
      if(s.player.route.length&&s.player.nextMoveAt<=s.clock)stepPlayer(w,s);
      for(const n of s.npcs){if(n.mode!=='accompany'&&n.nextMoveAt<=s.clock)npcStep(w,s,n);}
      updateSeen(w,s);checkDeadline(w,s);
      if(s.trial&&!inInvestigation(w,s))break; // 재판이 열리면 시간 정지(마감·집합 시작 순간에서 멈춤)
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
      if(s.trial&&!inInvestigation(w,s))break; // 재판 중에는 시간이 흐르지 않는다
      s.clock++;
      if(s.player.route.length&&s.player.nextMoveAt<=s.clock)stepPlayer(w,s);
      for(const n of s.npcs){if(n.mode!=='accompany'&&n.nextMoveAt<=s.clock)npcStep(w,s,n);}
      updateSeen(w,s);checkDeadline(w,s);
      if(s.trial&&!inInvestigation(w,s))break; // 재판이 열리면 시간 정지(마감·집합 시작 순간에서 멈춤)
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
    if(rule.present&&state.pv!==rule.present)return {state,accepted:false,reason:'그 증거를 제시하지 않음'};
    if(rule.flag&&state.flags[rule.flag])return {state,accepted:false,reason:'이미 기록됨'};
    if(rule.trial){const T=state.trial,tr=T&&(w.trials||[])[T.i];
      if(!tr||tr.code!==rule.trial||T.phase!==rule.phase)return {state,accepted:false,reason:'지금 재판 단계와 맞지 않음'};}
    const s=clone(state);
    relApplyMap(w,s,rule.rel);
    if(rule.trial){
      if(rule.hold){const tr=w.trials[s.trial.i],ph=tr.phases[s.trial.phase],k=(tr.issues||[]).findIndex(x=>x.id===(ph&&ph.issue));if(k>=0)s.trial.hold=(s.trial.hold||0)|(1<<k);}
      trialNext(w,s);return {state:s,accepted:true,reason:'',hold:!!rule.hold};}
    if(rule.flag)s.flags[rule.flag]=true;
    for(const f of rule.setFlags||[])s.flags[f]=true; // 함께 켜는 깃발(예: 재판 전에 이미 밝혀졌다는 표시)
    addLog(w,s,rule.log||('사건 '+code+' 기록'),'world');
    return {state:s,accepted:true,reason:''};
  }
  // 증언(k): AI가 '대상이 대사로 말한 기억'의 코드를 적으면, 대상이 정말 그 기억을 가졌을 때만
  // 플레이어 단서에 '○○에게 들음'으로 기록한다. 사실이 참이라고 확정하지는 않는다(주장으로만 보관).
  // 기억 코드는 사실마다 고정(code). 배열 순서가 바뀌어도 같은 코드 = 같은 사실.
  function factCode(w,id){const f=(w.facts||[]).find(f=>f.id===id);return f&&f.code?'기억'+f.code:'';}
  // k 문자열 → [{code, line}] ('기억K3R8@3' = 원본 3번째 줄에서 말함. 줄 번호가 없으면 마지막 줄로 본다)
  function parseK(k){return [...String(k||'').matchAll(/(?:기억)?([A-Z0-9]{4})(?:@(\d{1,2}))?/g)].map(m=>({code:m[1],line:m[2]?+m[2]:0}));}
  function hearFacts(w,state,k){
    const out={state,accepted:[],rejected:[]};
    const codes=[...new Set((Array.isArray(k)?k:parseK(k)).map(x=>x.code))];
    if(!codes.length)return out;
    const n=state.pend&&node(state,state.pend);
    if(!n){out.rejected=codes.map(c=>[c,'대화 상대가 없음']);return out;}
    const s=clone(state),m=node(s,n.id),idx=w.npcs.findIndex(x=>x.id===n.id);
    for(const c of codes){
      const f=(w.facts||[]).find(x=>x.code===c);
      if(!f){out.rejected.push([c,'없는 기억 번호']);continue;}
      if(!(m.mem||[]).some(x=>x[0]===f.id)){out.rejected.push([c,'이 인물은 모르는 일']);continue;}
      learn(s.player,f.id,2+idx,s.clock);out.accepted.push(c);
    }
    out.state=s;return out;
  }
  // ---------- 관계: 인물이 플레이어를 어떻게 여기는지(척도별 0~100 → 단계 1~N) ----------
  // w.rel.scales=[{id,key,name,levels:[단계 이름…]}], 인물별 시작값은 npc.rel={trust:50,…}(없는 척도는 그 인물에게 없음)
  function relScales(w){return (w.rel&&w.rel.scales)||[];}
  function relInit(w,player){player.rel={};for(const n of w.npcs){const o={};for(const sc of relScales(w))if(n.rel&&n.rel[sc.id]!==undefined)o[sc.id]=n.rel[sc.id];player.rel[n.id]=o;}}
  // 척도에 opposite:true면 플레이어(체크인 성별, 없으면 player.sex)와 성별이 다른 인물에게만 있다
  function relOn(w,s,id,sc){const S=relScales(w).find(x=>x.id===sc);if(!S||!S.opposite)return true;const n=w.npcs.find(x=>x.id===id),L=(s.player||{}).look,ps=L?(L.g===1?'f':'m'):(w.player.sex||'m');return !!n&&n.sex!==ps;}
  // 화면에 보이는 이름: 가명(alias)은 그 깃발이 설 때까지
  function nm(w,s,id){const n=w.npcs.find(x=>x.id===id);if(!n)return id;return n.alias&&!((s&&s.flags)||{})[n.alias.until]?n.alias.name:n.name;}
  function relLevel(w,s,id,sc){const v=(((s.player||{}).rel||{})[id]||{})[sc];if(v===undefined||!relOn(w,s,id,sc))return 0;const S=relScales(w).find(x=>x.id===sc),N=((S&&S.levels)||[0,0,0,0,0]).length;return Math.min(N,Math.floor(v/(100/N))+1);}
  function relAdd(w,s,id,d){if(!d||!id)return;const all=s.player.rel||(s.player.rel={}),r=all[id]||(all[id]={});for(const k in d)if(r[k]!==undefined&&relOn(w,s,id,k))r[k]=Math.max(0,Math.min(100,r[k]+(d[k]|0)));}
  // AI의 r='t+1a-1': 대화 상대의 마음 변화. 척도마다 한 번에 ±1단계(=aiStep점)까지만.
  function applyRel(w,state,id,code){
    const out={state,changed:{}};if(!code||!id)return out;
    const s=clone(state),step=(w.rel&&w.rel.aiStep)||4,d={},re=/([A-Za-z가-힣]+)\s*([+-])\s*(\d)/g;let m;
    while((m=re.exec(String(code)))){const sc=relScales(w).find(x=>x.key===m[1]||x.id===m[1]||x.name===m[1]);if(!sc||!+m[3])continue;d[sc.id]=(m[2]==='-'?-1:1)*step;}
    const before=JSON.stringify((s.player.rel||{})[id]||{});relAdd(w,s,id,d);
    if(JSON.stringify((s.player.rel||{})[id]||{})!==before)out.changed=d;out.state=s;return out;
  }
  function relApplyMap(w,s,map){if(map)for(const id in map)relAdd(w,s,id,map[id]);}
  // ---------- 재판(시제품) ----------
  // s.trial = {i: 재판 번호, phase: 단계, hp: 재판 전용 체력, sub: 단계 안 진행도}. 재판 중에는 시간이 흐르지 않는다.
  // 설정 메뉴의 시험 시작: 재판 자료를 모두 지급. 사건 연쇄로 열릴 때는 실제로 모은 것만(부족한 필수 자료는 지배인이 건넨다고 알림).
  function startTrial(w,state,code){const s=clone(state);openTrial(w,s,code,true);return s;}
  function openTrial(w,s,code,grantAll){
    const i=(w.trials||[]).findIndex(t=>t.code===code);if(i<0)return;
    const tr=w.trials[i];s.trial={i,phase:0,hp:tr.hp||5,sub:0,failed:0,hold:0};
    if(!s.player.items)s.player.items={};
    const miss=(tr.evidence||[]).filter(id=>s.player.items[id]===undefined);
    if(!s.player.given)s.player.given={};
    for(const id of miss){s.player.items[id]=s.clock;s.player.given[id]=1;}
    if(miss.length&&!grantAll)addLog(w,s,'지배인이 미처 챙기지 못한 자료를 건넸다: '+miss.map(id=>((w.items||[]).find(x=>x.id===id)||{}).name).join(', '),'world');
    s.player.route=[];addLog(w,s,(tr.kind==='case'?'사건: ':'재판이 열렸다: ')+tr.title,'player');enterPhase(w,s);
  }
  // 조사 단계에 들어가면: 마감 시각을 sub에 적고, 자료를 지급하고, 모인 사람들을 풀어 준다(각자 일정으로).
  function enterPhase(w,s){
    const T=s.trial;if(!T)return;const ph=w.trials[T.i].phases[T.phase];if(!ph)return;
    for(const f of ph.setFlags||[])s.flags[f]=true; // 이 단계에 들어서면 서는 깃발(예: 가명이 본명으로 바뀜)
    if(ph.type!=='investigate')return;
    const cs=(w.cases||[]).find(c=>c.trial===w.trials[T.i].code),found=cs&&(s.cases||{})[cs.id]?s.cases[cs.id][1]:null;
    T.sub=ph.until?Math.floor(s.clock/DAY)*DAY+secs(ph.until):(ph.afterFound!=null&&found!=null)?found+ph.afterFound*60:s.clock+(ph.minutes||30)*60;
    T.sub=Math.max(T.sub,s.clock+300); // 최소 5분
    if(!s.player.given)s.player.given={};
    for(const id of ph.grant||[])if(s.player.items[id]===undefined){s.player.items[id]=s.clock;s.player.given[id]=1;}
    for(const n of s.npcs){const g=n.queued.find(t=>/^gather_/.test(t.id));if(g){n.queued=n.queued.filter(t=>t!==g);}
      if(n.intent&&/^gather_/.test(n.intent.id)){n.intent=null;n.mode='idle';n.route=[];n.busyUntil=0;n.nextMoveAt=s.clock+3;}}
    addLog(w,s,'조사 시간이 시작되었다. 마감 '+clock(T.sub).slice(0,5),'world');
  }
  function trialNext(w,s){
    const tr=w.trials[s.trial.i],cur=tr.phases[s.trial.phase];if(cur)relApplyMap(w,s,cur.rel);s.trial.phase++;s.trial.sub=0;
    if(s.trial.phase>=tr.phases.length){
      if(tr.flag)s.flags[tr.flag]=true;s.trial=null;
      // 연쇄: 집합·조사 대본이 끝나면 갈래에 맞는 재판으로(then: [{if:플래그, code}, …], 처음 맞는 것)
      const nx=(tr.then||[]).find(t=>!t.if||s.flags[t.if]);
      if(nx){openTrial(w,s,nx.code,false);return;}
      addLog(w,s,(tr.kind==='case'?'사건 정리가 끝났다: ':'재판이 끝났다: ')+tr.title,'player');return;
    }
    enterPhase(w,s);
  }
  function inInvestigation(w,s){const T=s.trial;return !!(T&&(w.trials[T.i].phases[T.phase]||{}).type==='investigate');}
  // 시간이 흐를 때: 조사 마감이 되면 개정
  function checkDeadline(w,s){if(inInvestigation(w,s)&&s.clock>=s.trial.sub){addLog(w,s,'조사 시간이 끝났다. 재판장으로 모인다.','world');trialNext(w,s);}}
  // 틀림: 체력 -1. 0이 되면 꿈(노멀)에서는 그 단계로 되감기고, 현실(진엔딩)에서는 실패로 끝난다.
  function trialHit(w,state){
    const s=clone(state),T=s.trial;if(!T)return {state:s,result:''};
    T.hp--;if(T.hp>0)return {state:s,result:'hit'};
    if(s.flags[w.realityFlag||'true_route']){T.failed=1;return {state:s,result:'fail'};}
    T.hp=(w.trials[T.i].hp||5);T.sub=0;addLog(w,s,'……정신을 차리니, 조금 전 그 순간이었다.','player');return {state:s,result:'rewind'};
  }
  function trialStep(w,state,action){
    const s=clone(state);if(!s.trial)return s;
    if(action==='NEXT')trialNext(w,s);else if(action==='SUB')s.trial.sub++;else if(action==='QUIT'){s.trial=null;addLog(w,s,'(시험) 재판을 중단했다.','player');}
    return s;
  }
  // 로어북을 켜는 표식. 화면이 매 메시지 머리말에 붙인다(검색 범위 '현재 유저 입력만' 항목용).
  function markers(w,s){
    const out=['#장'+(w.chapter||1)];
    if(s.trial&&w.trials&&w.trials[s.trial.i])out.push(inInvestigation(w,s)?'#조사'+w.trials[s.trial.i].code+branchLetter(w,s):'#재판'+w.trials[s.trial.i].code);
    // 시간대 갈래 표식: #1일저녁A. A는 인라인(메인), 조건이 맞으면 B·C…(어느 갈래인지는 화면이 판정)
    const sl=slotOf(w,s);
    if(sl){const b=(w.branches||[]).find(b=>(!b.flag||s.flags[b.flag])&&(!b.slot||b.slot===sl.day+'일'+sl.name));out.push('#'+sl.day+'일'+sl.name+(b?b.letter:'A'));}
    for(const m of w.markers||[])if(s.flags[m.flag])out.push(m.token);
    return out;
  }
  // ── 팔찌 전지 ── 남은 양 = 전지 1개 용량 − (지금 − 끼운 시각) − 기능으로 쓴 양. 0이 된 뒤 graceSeconds(1분)가 지나면 착용자 사망.
  function devCfg(w){return w.device||null;}
  function battery(w,s){const D=devCfg(w);if(!D||s.player.batAt===undefined)return null;
    const cap=D.cellSeconds||43200,left=cap-(s.clock-s.player.batAt)-(s.player.batUsed||0);
    return {left,cap,cells:s.player.cells|0,dead:left<=-(D.graceSeconds||60),empty:left<=0};}
  function batUse(w,s,sec){if(devCfg(w)&&s.player.batAt!==undefined)s.player.batUsed=(s.player.batUsed||0)+Math.max(0,sec|0);}
  function dispatch(w,state,action){
    let s=clone(state);const player=s.player;
    if(action.type==='DEVICE'){ // 팔찌 기능: photo / call(minutes) / locate(npcId) / swap
      const D=devCfg(w),b=battery(w,s);if(!D||!b){addLog(w,s,'팔찌가 없다.','player');return s;}
      if(b.dead){addLog(w,s,'팔찌가 멈췄다.','player');return s;}
      const C=D.cost||{};
      if(action.op==='swap'){if(s.player.cells<=0){addLog(w,s,'예비 전지가 없다.','player');return s;}
        s.player.cells--;s.player.batAt=s.clock+60;s.player.batUsed=0;addLog(w,s,'팔찌 전지를 갈아 끼웠다(1분).','player');return s;} // 교체 1분은 화면이 WAIT 60으로 흘린다
      if(b.empty){addLog(w,s,'전지가 다 됐다. 전지부터 갈아야 한다.','player');return s;}
      const cost=action.op==='photo'?(C.photo||300):action.op==='call'?(C.callMin||600)*Math.max(1,action.minutes|0):action.op==='locate'?(C.locate||10800):0;
      batUse(w,s,cost);
      if(action.op==='locate'){const n=node(s,action.npcId);s.player.lastLocate=n?{id:n.id,x:n.x,y:n.y,at:s.clock}:null;addLog(w,s,(n?nm(w,s,n.id):'?')+'의 위치를 조회했다.','player');}
      else addLog(w,s,action.op==='photo'?'사진을 찍었다.':'통화를 했다.','player');
      return s;
    }
    if(action.type==='MOVE_TO'||action.type==='MOVE_ONE'){
      const target=action.type==='MOVE_ONE'?{x:player.x+action.dx,y:player.y+action.dy}:{x:action.x,y:action.y};
      // 숨은 공간: 정해진 칸(from)에서 그 벽 쪽으로 한 번 더 움직이면 열린다.
      const sq=action.type==='MOVE_ONE'&&secretAt(w,target.x,target.y);
      if(sq&&!s.flags[sq.flag]&&sq.from&&sq.from[0]===player.x&&sq.from[1]===player.y){s.flags[sq.flag]=true;addLog(w,s,sq.text||'벽 틈으로 들어갈 수 있을 것 같다.','player');}
      // 막는 칸에 들어가려 하면 경고가 쌓이고, 경고 수를 넘기면 over 플래그(게임 오버).
      const gd=action.type==='MOVE_ONE'&&guardAt(w,target.x,target.y);
      if(gd&&!s.flags[gd.open]){const n=gd.warn.filter(f=>s.flags[f]).length;
        if(n>=gd.warn.length)s.flags[gd.over]=true;else s.flags[gd.warn[n]]=true;
        s.guardHit={id:gd.id,n:n+1,at:s.clock};addLog(w,s,(gd.who||'누군가')+'이(가) 앞을 막아섰다.','player');return s;}
      if(!walkable(w,target.x,target.y,s)){addLog(w,s,'그곳으로는 이동할 수 없다.','player');return s;}
      const p=route(w,s,player,target,{ignorePlayer:true});
      if(!p.length&&manhattan(player,target)>0){addLog(w,s,'갈 수 있는 경로가 없다.','player');return s;}
      // 계단 칸으로 한 걸음 들어가면 그대로 연결된 반대쪽(다른 층)까지 이어서 간다.
      const lt=action.type==='MOVE_ONE'&&p.length===1&&linkOf(w,target.x,target.y); if(lt)p.push({x:lt.x,y:lt.y});
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
      addLog(w,s,nm(w,s,n.id)+'이(가) 동행을 수락했다. 기존 방문 일정은 취소됐다.','player');
    }else if(action.type==='RELEASE'){
      const n=node(s,action.npcId);
      if(n&&n.mode==='accompany'){n.mode='idle';n.nextMoveAt=s.clock+5; n.route=[];
        addLog(w,s,nm(w,s,n.id)+'이(가) 다시 독립 행동을 시작했다.','player');}
    }else if(action.type==='TALK_REQUEST'){
      // 대화는 AI가 응답한 뒤 applyTalk()로 시간을 반영한다. 여기서는 대상만 잠근다.
      const n=node(s,action.npcId);
      // 2칸 이내 + 시야가 트여 있으면 상대가 바빠도 말은 걸 수 있다(들어줄지는 AI가 상태를 보고 정한다)
      if(!n||manhattan(player,n)>(w.talkRange||2)||!lineOfSight(w,player,n)){addLog(w,s,'대화하려면 인물에게 더 다가가야 한다.','player');return s;}
      if(n.mode==='busy'&&n.intent&&n.intent.targetPlayer)finishCall(s,n);
      if(!player.talked)player.talked={};if(player.talked[n.id]===undefined)relAdd(w,s,n.id,(w.rel||{}).firstTalk);player.talked[n.id]=s.clock;
      s.pend=n.id;s.pk=action.kind||'T';s.pc=Math.max(0,Math.min(2000,action.chars|0));player.route=[];player.nextMoveAt=0;
    }else if(action.type==='WAIT')return advance(w,s,action.seconds||60);
    else if(action.type==='SEARCH'){
      // 조사: 랜드마크 자리나 그 가구 칸 바로 옆에서. 시간이 든다. 있으면 소지품으로.
      const l=landmark(w,action.landmark);
      if(!l)return s;
      const spots=[{x:l.x,y:l.y},...(l.hit||[]).map(h=>({x:h[0],y:h[1]}))];
      if(!spots.some(p=>manhattan(player,p)<=1)){addLog(w,s,'조사하려면 '+l.name+' 가까이 가야 한다.','player');return s;}
      const wasInv=inInvestigation(w,s);
      const t=advance(w,s,w.searchSeconds||20);s=t;
      if(wasInv&&!inInvestigation(w,s)){addLog(w,s,'조사하던 도중 마감이 되었다. 아무것도 챙기지 못했다.','player');return s;}
      const found=itemsAt(w,s,l.id);
      if(!s.player.items)s.player.items={};
      for(const it of found)s.player.items[it.id]=s.clock;
      addLog(w,s,found.length?l.name+'에서 '+josa(found.map(i=>i.name).join(', '),'을','를')+' 찾았다.':l.name+' 주변을 뒤졌지만 아무것도 없었다.','player');
      return s;
    }else if(action.type==='DISMISS_CALL'){
      const n=node(s,action.npcId);
      if(n&&n.mode==='busy'&&n.intent&&n.intent.targetPlayer){finishCall(s,n);addLog(w,s,nm(w,s,n.id)+'이(가) 아쉬운 얼굴로 돌아갔다.','player');}
    }else if(action.type==='UNSTUCK'){
      // 끼임 탈출: 지금 칸에서 한 칸도 못 움직일 때만, 가장 가까운 '빠져나갈 수 있는 빈칸'으로 옮긴다(시간 0).
      const occ=new Set(s.npcs.filter(n=>n.mode!=='accompany').map(n=>posKey(n.x,n.y)));
      const free=(x,y)=>walkable(w,x,y)&&!occ.has(posKey(x,y));
      const D4=[[1,0],[-1,0],[0,1],[0,-1]];
      const canMove=(x,y)=>D4.some(([dx,dy])=>free(x+dx,y+dy));
      if(walkable(w,player.x,player.y)&&canMove(player.x,player.y)){addLog(w,s,'막혀 있지 않다.','player');return s;}
      const q=[[player.x,player.y]],seen=new Set([posKey(player.x,player.y)]);let to=null;
      for(let i=0;i<q.length&&!to;i++){const [x,y]=q[i];
        for(const [dx,dy] of D4){const nx=x+dx,ny=y+dy,k=posKey(nx,ny);if(!inBounds(w,nx,ny)||seen.has(k))continue;seen.add(k);
          if(free(nx,ny)&&canMove(nx,ny)){to={x:nx,y:ny};break;}q.push([nx,ny]);}}
      if(!to){addLog(w,s,'빠져나갈 곳이 없다.','player');return s;}
      player.x=to.x;player.y=to.y;player.route=[];player.nextMoveAt=0;addLog(w,s,'끼인 곳에서 빠져나왔다.','player');
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
    // 하던 일이 있으면(일하는 중·만남 대기) 그 일이 대화한 만큼 늦어진다. 아니면 그 자리에 멈춰 대화.
    if(n&&(n.mode==='busy'||n.mode==='paused')){n.busyUntil=Math.max(n.busyUntil||s.clock,s.clock)+sec;n.nextMoveAt=Math.max(n.nextMoveAt,n.busyUntil);}
    else if(n&&n.mode!=='accompany'){n.mode='paused';n.busyUntil=s.clock+sec;n.nextMoveAt=n.busyUntil;}
    s.player.route=[];s.player.nextMoveAt=0;s.pend=null;s.pk='';s.pc=0;
    if(sec>0){addLog(w,s,(n?nm(w,s,n.id)+'와(과) ':'')+'대화하며 '+sec+'초가 지났다.','player');s=advance(w,s,sec);}
    else s.revision++;
    return s;
  }
  // 대화 시간은 AI가 정하지 않고 글자 수로 계산한다(초당 약 6자 + 기본 4초).
  function talkSeconds(userChars,replyChars){return Math.max(5,Math.min(600,Math.ceil(((userChars|0)+(replyChars|0))/6)+4));}
  // NPC가 스스로 아는 현재 행동을 짧은 말로.
  function describe(w,s,n){
    const name=id=>nm(w,s,id), place=id=>(landmark(w,id)||{}).name||'어딘가';
    if(n.mode==='accompany')return '플레이어와 동행 중';
    if(s.block&&s.block.npc===n.id)return place(n.intent&&n.intent.landmark)+'에 볼일이 있는데 플레이어가 그 자리에 서 있어, 비켜 달라고 말을 건 참('+s.block.n+'번째 부탁'+(s.block.urgent?', 급한 일':'')+')';
    if(n.mode==='busy'&&n.intent)return n.intent.targetNpc?name(n.intent.targetNpc)+'와 이야기하는 중':place(n.intent.landmark)+'에서 일하는 중';
    if(n.intent)return n.intent.targetNpc?name(n.intent.targetNpc)+'에게 가는 중':place(n.intent.landmark)+' 쪽으로 가는 중';
    return '한가함';
  }
  function diagnostics(w,s){
    return s.npcs.map(n=>({id:n.id,name:nm(w,s,n.id),mode:n.mode,
      pos:`(${n.x},${n.y})`,plan:n.intent?.id||null,nextMoveAt:n.nextMoveAt,remaining:n.route.length,
      completed:n.completed.join(',')||'—',excluded:n.excluded.join(',')||'—'}));
  }
  function validate(w,s){
    if(s.schema!=='TROEMEREI_NPC_V1'||s.worldId!==w.map.id)throw Error('Invalid checkpoint schema/world');
    for(const x of [s.player,...s.npcs])if(!walkable(w,x.x,x.y,s))throw Error('Invalid position '+x.x+','+x.y);
    return true;
  }
  return {battery, createWorld, nm, inInvestigation, branchLetter, relScales, relLevel, relAdd, applyRel, startTrial, trialHit, trialStep, caller, parseK, lineOfSight, advance, advanceUntil, absTime, itemsAt, slotOf, advanceSlow, applyEvent, hearFacts, factCode, markers, dispatch, applyTalk, talkSeconds, describe, areaOf, sees, route, walkable, clock, diagnostics, validate, clone};
})();
if(typeof module!=='undefined')module.exports=TroemereiNPC;
