// 몽환의 트로이메라이 · 탑다운 시험판 v0.4 (TRM1) — UUMMAI에 컴포넌트 1개로 등록: 이름 Troemerei
// import·fetch·외부 에셋·브라우저 저장소 없음. useState/useEffect/useRef/useMemo/sendMessage는 호스트 제공.
// AI 출력 형식: <Troemerei s='상태코드' d='이름:대사|*서술' />  (자유 행동 응답에만 t='초', 사건 코드 e='…')
const TN_WORLD = {"version":3,"kind":"prototype-world-not-canon","title":"트로메라 · 일상 행동 샌드박스","notes":"인물/장소/사건은 동작 검증용 임시 데이터이며 본편 설정이 아니다.","map":{"id":"prototype","width":30,"height":18,"rows":["##############################","#..............#.............#","#..............#.............#","#..............#..#..........#","#...#..........#.............#","#..........................#.#","#.........#....#.............#","#..............#.............#","########.###########.#########","#..............#.............#","#..............#.............#","#..............#.............#","#............................#","#..............#.........#...#","#............#.#.............#","#...#..........#.#...........#","#..............#.............#","##############################"],"tileSeconds":4,"areas":[{"name":"자료실","x0":1,"y0":1,"x1":14,"y1":7},{"name":"작업실","x0":16,"y0":1,"x1":28,"y1":7},{"name":"정원","x0":1,"y0":9,"x1":14,"y1":16},{"name":"광장","x0":16,"y0":9,"x1":28,"y1":16}],"landmarks":[{"id":"archive","name":"자료실 선반","x":6,"y":4,"icon":"▣"},{"id":"desk","name":"작업실 탁자","x":24,"y":4,"icon":"◇"},{"id":"fountain","name":"광장 분수","x":22,"y":12,"icon":"◉"},{"id":"garden","name":"정원 벤치","x":7,"y":13,"icon":"▤"},{"id":"notice","name":"게시판","x":11,"y":12,"icon":"▥"}]},"player":{"x":7,"y":12,"moveSeconds":4},"npcs":[{"id":"companion","name":"유리","symbol":"유","color":"#de9f68","x":8,"y":12,"stepSeconds":5,"agenda":[{"id":"meet_contact","kind":"meet","targetNpc":"contact","from":"09:00","until":"09:25","durationSeconds":45,"priority":90,"weight":5,"once":true,"interruptible":true,"onComplete":"meeting_created","onInterrupt":"meeting_prevented","onInterruptFact":"missed_doyun","onAccompany":"cancel"},{"id":"garden_break","kind":"visit","landmark":"garden","from":"09:00","until":"18:30","durationSeconds":100,"priority":10,"weight":3,"cooldownSeconds":180,"interruptible":true},{"id":"fountain_walk","kind":"visit","landmark":"fountain","from":"09:00","until":"18:30","durationSeconds":80,"priority":10,"weight":2,"cooldownSeconds":150,"interruptible":true}],"portrait":"yuri_default"},{"id":"contact","name":"도윤","symbol":"도","color":"#7aaddd","x":24,"y":4,"stepSeconds":8,"agenda":[]},{"id":"librarian","name":"세린","symbol":"세","color":"#a49ad8","x":5,"y":5,"stepSeconds":9,"agenda":[{"id":"archive_patrol","kind":"visit","landmark":"archive","from":"09:00","until":"18:00","durationSeconds":90,"priority":10,"weight":4,"cooldownSeconds":120,"interruptible":true},{"id":"notice_review","kind":"visit","landmark":"notice","from":"09:00","until":"18:00","durationSeconds":40,"priority":10,"weight":1,"cooldownSeconds":180,"interruptible":true}],"portrait":"serin_default"},{"id":"courier","name":"태수","symbol":"태","color":"#88bfa6","x":21,"y":14,"stepSeconds":7,"agenda":[{"id":"post_delivery","kind":"visit","landmark":"notice","from":"09:00","until":"18:30","durationSeconds":40,"priority":10,"weight":4,"cooldownSeconds":140,"interruptible":true},{"id":"fetch_material","kind":"visit","landmark":"desk","from":"09:00","until":"18:30","durationSeconds":90,"priority":10,"weight":2,"cooldownSeconds":150,"interruptible":true}]}],"onComplete":[{"id":"meeting_created","when":{"npc":"companion","task":"meet_contact","targetNpc":"contact"},"setFlag":"meeting_occurred","queueTask":{"id":"deliver_request","kind":"visit","landmark":"archive","durationSeconds":70,"priority":100,"interruptible":false,"once":true,"onCompleteFlag":"delivery_done","onCompleteFact":"delivered"},"publicLog":"두 사람이 대화를 마쳤고, 유리에게 자료실 방문 일정이 새로 생겼다.","fact":"met_doyun"}],"flagNames":["meeting_occurred","meeting_prevented","delivery_done","true_route"],"facts":[{"id":"met_doyun","self":{"companion":"도윤에게 업무 메모를 전했다","contact":"유리에게 업무 메모를 받았다"},"seen":"유리와 도윤이 작업실에서 짧게 이야기하는 걸 봤다","player":"유리와 도윤이 작업실에서 이야기했다"},{"id":"missed_doyun","self":{"companion":"플레이어와 동행하느라 도윤에게 메모를 전하지 못했다"},"seen":"","player":""},{"id":"delivered","self":{"companion":"자료실 선반에 메모 사본을 두었다"},"seen":"유리가 자료실 선반에 무언가 두는 걸 봤다","player":"유리가 자료실 선반에 무언가를 두었다"}],"chapter":1,"events":{"TRUE":{"kind":"T","npcs":["companion"],"flag":"true_route","log":"(시험) 진엔딩 루트 표식이 인정되었다."}},"markers":[{"flag":"true_route","token":"#진"}]};
const TN_CSS = ".tr-out{width:100%;position:relative;font-family:system-ui,-apple-system,\"Malgun Gothic\",sans-serif;color:#e7edf5;-webkit-tap-highlight-color:transparent}\n.tr-card{position:absolute;left:0;top:0;width:360px;height:540px;overflow:hidden;background:#0c1421;border-radius:8px;transform-origin:0 0;user-select:none}\n.tr-card *{box-sizing:border-box}.tr-card button{font:inherit;color:inherit;cursor:pointer;background:#0b1522e0;border:1px solid #3d5368;border-radius:7px;padding:0 8px;line-height:1}\n.tr-card button:disabled{opacity:.38;cursor:default}\n.tr-map{position:absolute;inset:0;display:block;touch-action:manipulation}\n.tr-hud{position:absolute;left:4px;right:4px;top:4px;display:flex;gap:4px;align-items:center;font-size:12px;pointer-events:none}\n.tr-hud>*{pointer-events:auto}\n.tr-pill{background:#0b1522e0;border:1px solid #3d5368;border-radius:7px;padding:3px 7px;line-height:16px;white-space:nowrap}\n.tr-time{color:#e7c894;font-variant-numeric:tabular-nums}\n.tr-hud button{height:24px;font-size:12px}\n.tr-toast{position:absolute;left:4px;right:4px;top:32px;font-size:11px;line-height:15px;padding:2px 7px;background:#0b1522b8;border-radius:6px;color:#c9d5e0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none}\n.tr-pad{position:absolute;width:34px;height:34px;font-size:15px!important;display:grid;place-items:center;padding:0!important;touch-action:none}\n.tr-menu{position:absolute;left:112px;right:6px;bottom:6px;padding:5px;background:#08111ef2;border:1px solid #6d7f92;border-radius:9px}\n.tr-menu-h{display:flex;justify-content:space-between;align-items:baseline;font-size:12px;line-height:15px;margin:0 2px 4px}\n.tr-menu-h b{font-weight:600;color:#f2c48f}.tr-menu-h span{color:#93adc2;font-size:11px}\n.tr-menu-g{display:grid;grid-template-columns:1fr 1fr;gap:4px}.tr-menu-g button{height:34px;font-size:13px}\n.tr-menu-why{font-size:10px;color:#93adc2;margin:3px 2px 0;line-height:13px}\n.tr-preview{position:absolute;left:112px;right:6px;bottom:6px;padding:4px 7px;font-size:12px;line-height:16px;background:#f3e6c8;color:#3d2c14;border-radius:8px}\n.tr-sheet{position:absolute;inset:0;background:#0c1421;display:flex;flex-direction:column}\n.tr-tabs{display:flex;gap:3px;padding:4px}.tr-tabs button{flex:1;height:28px;font-size:12px}.tr-tabs .on{background:#2c4a63;border-color:#7ea0bc}\n.tr-body{flex:1;overflow-y:auto;padding:2px 8px 8px;font-size:13px;line-height:18px}\n.tr-row{padding:4px 0;border-bottom:1px solid #22344a}.tr-row time{color:#c6a572;margin-right:6px;font-variant-numeric:tabular-nums}\n.tr-mut{color:#93adc2;font-size:11px;line-height:15px}\n.tr-mono{font:11px ui-monospace,monospace;word-break:break-all;color:#cfe0ee}\n.tr-ta{width:100%;resize:none;padding:5px 7px;background:#08121c;border:1px solid #3d5368;color:#e6eef7;border-radius:6px;font:inherit;font-size:16px;line-height:20px;user-select:text}\n.tr-talk{position:absolute;inset:0}\n.tr-box{position:absolute;left:5px;right:5px;padding:3px 8px 4px;background:#08111ef2;border:1px solid #8a7550;border-radius:8px}\n.tr-name{display:flex;justify-content:space-between;font-size:12px;line-height:16px}.tr-name b{color:#f2c48f;font-weight:600}.tr-name span{color:#93adc2;font-size:11px}\n.tr-line{font-size:14px;line-height:19px;height:57px;overflow:hidden;white-space:pre-wrap;overflow-wrap:anywhere}\n.tr-line.narr{color:#b9c9d6;font-style:italic}\n.tr-ctl{display:flex;gap:4px;margin-top:2px}.tr-ctl button{height:22px;font-size:11px;padding:0 7px}\n.tr-in{position:absolute;left:5px;right:5px;bottom:5px;padding:4px;background:#0e1a29f5;border:1px solid #3d5368;border-radius:8px}\n.tr-in-top{display:flex;gap:4px;margin-bottom:3px;align-items:center}.tr-in-top button{height:22px;font-size:11px}\n.tr-send{width:52px;flex:none;white-space:nowrap;padding:0 4px!important;background:#907040!important;border-color:#c1a06a!important;font-size:13px!important}\n.tr-drop{position:absolute;left:4px;bottom:100%;margin-bottom:3px;display:grid;gap:3px;padding:4px;background:#08111ef7;border:1px solid #6d7f92;border-radius:8px;width:150px}\n.tr-drop button{height:30px;font-size:12px;text-align:left}\n.tr-err{position:absolute;inset:0;padding:14px;display:flex;flex-direction:column;gap:8px;font-size:13px;line-height:19px}\n";
const TN_ASSETS = {"yuri_default":"https://image.uumm.ai/fb42aee5-a227-47f2-8756-9e63fbd7272e","serin_default":"https://image.uumm.ai/12737bb8-ff89-4cda-ab96-99a341e886cb"};
/* Troemerei NPC simulation core v0.3 — 결정적 NPC 일정·경로·기억. DOM/네트워크/LLM 의존 없음. */
const trNPC = (() => {
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
  // 방 번호(-1은 통로). 같은 방이고 6칸 이내면 서로 보인다(통로끼리는 3칸).
  function areaOf(w,x,y){return w.map.areas.findIndex(a=>x>=a.x0&&x<=a.x1&&y>=a.y0&&y<=a.y1);}
  function sees(w,a,b){const ra=areaOf(w,a.x,a.y),rb=areaOf(w,b.x,b.y);if(ra!==rb)return false;return manhattan(a,b)<=(ra<0?3:6);}
  // 기억: [사실ID, 역할(0 직접 1 목격), 시각]. 인물당 최근 12개.
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
  function addLog(s,text,type='world',at=null) {
    const visible=type==='player'||!at||manhattan(s.player,at)<=5;
    s.logs.push({time:s.clock,text,type,visible});
    if(s.logs.length>100)s.logs.shift();
  }
  function createWorld(w,seed=246813579){
    const s={schema:'TROEMEREI_NPC_V1',version:1,worldId:w.map.id,day:1,clock:9*3600,
      rng:seed>>>0 || 1, player:{x:w.player.x,y:w.player.y,route:[],nextMoveAt:0,mem:[],seen:{}},
      npcs:w.npcs.map((n,i)=>({id:n.id,x:n.x,y:n.y,mode:'idle',intent:null,route:[],
        nextMoveAt:9*3600+10+i*4,busyUntil:0,blockedSince:null,completed:[],
        excluded:[],lastTask:'',lastCompleted:{},queued:[],meetings:[],followOffset:0,mem:[]})),
      flags:Object.fromEntries((w.flagNames||[]).map(f=>[f,false])),
      logs:[],revision:0,pend:null,pk:'',pc:0};
    addLog(s,'시뮬레이션이 시작되었다. NPC들은 각자의 일정에 따라 행동한다.','player');
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
    addLog(s,spec.name+'이(가) 새로운 목적지를 향해 움직이기 시작했다.','npc',n);
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
    n.mode='busy';n.route=[];n.busyUntil=s.clock+(task.durationSeconds||30);n.nextMoveAt=n.busyUntil;
    addLog(s,spec.name+'이(가) '+(task.kind==='meet'?'다른 인물과 대화를 시작했다.':'목적지에서 행동을 시작했다.'),'npc',n);
  }
  function complete(w,s,n){
    const task=n.intent;if(!task){n.mode='idle';return;}
    const spec=w.npcs.find(x=>x.id===n.id);
    n.completed.push(task.id);n.lastCompleted[task.id]=s.clock;n.lastTask=task.id;
    n.queued=n.queued.filter(t=>t.id!==task.id);
    addLog(s,spec.name+'이(가) '+(task.kind==='meet'?'만남':'활동')+'을 마쳤다.','npc',n);
    for(const r of w.onComplete||[]){
      if(r.when.npc===n.id&&r.when.task===task.id&&(!r.when.targetNpc||r.when.targetNpc===task.targetNpc)){
        if(r.setFlag)s.flags[r.setFlag]=true;
        if(r.queueTask)n.queued.push(clone(r.queueTask));
        if(r.publicLog)addLog(s,r.publicLog,'world',n);
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
          addLog(s,w.npcs.find(x=>x.id===n.id).name+'이(가) 막힌 통로를 피해 우회했다.','npc',n);
        }else if(s.clock-n.blockedSince>=35){
          n.intent=null;n.mode='idle';n.route=[];n.nextMoveAt=s.clock+30;n.blockedSince=null;
          addLog(s,w.npcs.find(x=>x.id===n.id).name+'이(가) 이동 계획을 잠시 보류했다.','npc',n);
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
    if(rule.kind&&rule.kind!==state.pk)return {state,accepted:false,reason:'대화 종류가 맞지 않음'};
    if(rule.npcs&&!rule.npcs.includes(state.pend))return {state,accepted:false,reason:'이 인물에게는 인정되지 않음'};
    if(rule.flag&&state.flags[rule.flag])return {state,accepted:false,reason:'이미 기록됨'};
    const s=clone(state);
    if(rule.flag)s.flags[rule.flag]=true;
    addLog(s,rule.log||('사건 '+code+' 기록'),'world');
    return {state:s,accepted:true,reason:''};
  }
  // 로어북을 켜는 표식. 화면이 매 메시지 머리말에 붙인다(검색 범위 '현재 유저 입력만' 항목용).
  function markers(w,s){
    const out=['#장'+(w.chapter||1)];
    for(const m of w.markers||[])if(s.flags[m.flag])out.push(m.token);
    return out;
  }
  function dispatch(w,state,action){
    let s=clone(state);const player=s.player;
    if(action.type==='MOVE_TO'||action.type==='MOVE_ONE'){
      const target=action.type==='MOVE_ONE'?{x:player.x+action.dx,y:player.y+action.dy}:{x:action.x,y:action.y};
      if(!walkable(w,target.x,target.y)){addLog(s,'그곳으로는 이동할 수 없다.','player');return s;}
      const p=route(w,s,player,target,{ignorePlayer:true});
      if(!p.length&&manhattan(player,target)>0){addLog(s,'갈 수 있는 경로가 없다.','player');return s;}
      player.route=p;player.nextMoveAt=s.clock+(w.player.moveSeconds||4);
      addLog(s,p.length?'목적지로 이동을 시작했다.':'이미 그곳에 있다.','player');
    }else if(action.type==='ACCOMPANY'){
      const n=node(s,action.npcId);
      if(!n||manhattan(player,n)>1){addLog(s,'동행하려면 해당 인물 가까이 있어야 한다.','player');return s;}
      if(n.mode==='busy'||n.mode==='accompany'||(n.intent&&!n.intent.interruptible)){
        addLog(s,'지금은 동행할 수 없다.','player');return s;
      }
      if(n.intent){
        // onAccompany: 'cancel'(기본, 이번 일정은 다시 고르지 않음) / 'postpone'(동행이 끝나면 다시 고를 수 있음)
        if(n.intent.onAccompany!=='postpone')n.excluded.push(n.intent.id);
        if(n.intent.onInterrupt)s.flags[n.intent.onInterrupt]=true;
        if(n.intent.onInterruptFact)learn(n,n.intent.onInterruptFact,0,s.clock);
      }
      n.mode='accompany';n.intent=null;n.route=[];n.nextMoveAt=0;n.busyUntil=0;n.blockedSince=null;
      addLog(s,w.npcs.find(x=>x.id===n.id).name+'이(가) 동행을 수락했다. 기존 방문 일정은 취소됐다.','player');
    }else if(action.type==='RELEASE'){
      const n=node(s,action.npcId);
      if(n&&n.mode==='accompany'){n.mode='idle';n.nextMoveAt=s.clock+5; n.route=[];
        addLog(s,w.npcs.find(x=>x.id===n.id).name+'이(가) 다시 독립 행동을 시작했다.','player');}
    }else if(action.type==='TALK_REQUEST'){
      // 대화는 AI가 응답한 뒤 applyTalk()로 시간을 반영한다. 여기서는 대상만 잠근다.
      const n=node(s,action.npcId);
      if(!n||manhattan(player,n)>1){addLog(s,'대화하려면 인물에게 접근해야 한다.','player');return s;}
      if(n.mode==='busy'){addLog(s,'현재 진행 중인 행동이 있어 대화를 나누기 어렵다.','player');return s;}
      s.pend=n.id;s.pk=action.kind||'T';s.pc=Math.max(0,Math.min(2000,action.chars|0));player.route=[];player.nextMoveAt=0;
    }else if(action.type==='WAIT')return advance(w,s,action.seconds||60);
    else if(action.type==='CLEAR_ROUTE'){s.player.route=[];s.player.nextMoveAt=0;addLog(s,'이동을 멈췄다.','player');}
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
    if(sec>0){addLog(s,(n?w.npcs.find(x=>x.id===n.id).name+'와(과) ':'')+'대화하며 '+sec+'초가 지났다.','player');s=advance(w,s,sec);}
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
  return {createWorld, advance, advanceSlow, applyEvent, markers, dispatch, applyTalk, talkSeconds, describe, areaOf, sees, route, walkable, clock, diagnostics, validate, clone};
})();

/* Troemerei 상태 압축 코덱 v2 — AI가 매 턴 그대로 복사하는 문자열을 최소화한다.
   상태 JSON(약 1,000자 이상) → base64url 약 100~150자. 끝 2바이트는 손상 검사용 체크섬.
   로그는 화면 표시용이라 저장하지 않는다. 경로·타이머·완료 기록은 그대로 보존해 결정성을 유지한다. */
const trCodec = (() => {
  const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const MODES = ['idle', 'moving', 'busy', 'paused', 'accompany'];
  const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  const VERSION = 2;
  const KINDS = ['', 'T', 'I', 'A', 'P'];

  function hash32(text) { let h = 0x811c9dc5; for (const ch of text) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h >>> 0; }
  const hash16 = text => { const h = hash32(text); return (h ^ (h >>> 16)) & 0xffff; };
  // 세계 지문: 맵·일정·후속 규칙·사실·플래그 정의가 하나라도 바뀌면 달라진다 → 옛 코드를 조용히 잘못 읽지 않는다.
  function fingerprint(w) {
    return hash32(JSON.stringify({ id: w.map.id, v: w.version || 1, rows: w.map.rows, areas: w.map.areas, lm: w.map.landmarks.map(l => [l.id, l.x, l.y]),
      npcs: w.npcs.map(n => [n.id, n.agenda]), rules: w.onComplete || [], facts: (w.facts || []).map(f => f.id), flags: w.flagNames || [] }));
  }
  function taskTable(w) {
    const list = [];
    const add = t => { if (t && t.id && !list.some(x => x.id === t.id)) list.push(t); };
    for (const n of w.npcs) for (const t of n.agenda || []) add(t);
    for (const r of w.onComplete || []) add(r.queueTask);
    return list;
  }
  function meta(w) {
    if (w.__codec) return w.__codec;
    const tasks = taskTable(w);
    const facts = (w.facts || []).map(f => f.id);
    const m = { tasks, index: new Map(tasks.map((t, i) => [t.id, i])), flags: w.flagNames || [], facts, fidx: new Map(facts.map((f, i) => [f, i])), fp: fingerprint(w) };
    Object.defineProperty(w, '__codec', { value: m, enumerable: false });
    return m;
  }

  function writer() {
    const b = [];
    const api = {
      byte(v) { b.push(v & 255); },
      uint(v) { v = Math.floor(v); if (v < 0) throw Error('음수 저장 불가'); do { let x = v % 128; v = Math.floor(v / 128); if (v) x |= 128; b.push(x); } while (v); },
      sint(v) { api.uint(v < 0 ? -2 * v - 1 : 2 * v); },
      u32(v) { for (let i = 0; i < 4; i++) b.push((v >>> (i * 8)) & 255); },
      bytes: b,
    };
    return api;
  }
  function reader(b) {
    let p = 0;
    const need = () => { if (p >= b.length) throw Error('상태 코드가 잘렸습니다'); };
    const api = {
      byte() { need(); return b[p++]; },
      uint() { let v = 0, mul = 1, x; do { need(); x = b[p++]; v += (x & 127) * mul; mul *= 128; } while (x & 128); return v; },
      sint() { const v = api.uint(); return v % 2 ? -(v + 1) / 2 : v / 2; },
      u32() { let v = 0; for (let i = 0; i < 4; i++) { need(); v |= b[p++] << (i * 8); } return v >>> 0; },
      done() { return p === b.length; },
    };
    return api;
  }
  function fletcher(bytes) { let a = 0, c = 0; for (const x of bytes) { a = (a + x) % 255; c = (c + a) % 255; } return [a, c]; }
  function toB64(bytes) { let out = '', i = 0; for (; i + 2 < bytes.length; i += 3) { const n = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2]; out += B64[n >> 18] + B64[n >> 12 & 63] + B64[n >> 6 & 63] + B64[n & 63]; } const r = bytes.length - i; if (r === 1) { const n = bytes[i] << 16; out += B64[n >> 18] + B64[n >> 12 & 63]; } else if (r === 2) { const n = bytes[i] << 16 | bytes[i + 1] << 8; out += B64[n >> 18] + B64[n >> 12 & 63] + B64[n >> 6 & 63]; } return out; }
  function fromB64(text) {
    const clean = String(text || '').trim();
    if (!/^[A-Za-z0-9_-]+$/.test(clean)) throw Error('상태 코드에 허용되지 않은 문자가 있습니다');
    const vals = Array.from(clean, ch => B64.indexOf(ch)), out = [];
    for (let i = 0; i < vals.length; i += 4) { const n = (vals[i] << 18) | ((vals[i + 1] || 0) << 12) | ((vals[i + 2] || 0) << 6) | (vals[i + 3] || 0); out.push(n >> 16 & 255); if (i + 2 < vals.length) out.push(n >> 8 & 255); if (i + 3 < vals.length) out.push(n & 255); }
    return out;
  }

  // 시각: 0은 '없음', 그 외에는 현재 시각과의 차이를 저장해 짧게 만든다.
  const putTime = (o, t, clock) => o.uint(!t ? 0 : (t - clock < 0 ? -2 * (t - clock) - 1 : 2 * (t - clock)) + 1);
  const getTime = (r, clock) => { const v = r.uint(); if (!v) return 0; const z = v - 1; return clock + (z % 2 ? -(z + 1) / 2 : z / 2); };
  function putRoute(o, from, route) {
    o.uint(route.length); let prev = from, acc = 0, k = 0;
    for (const p of route) {
      const d = DIRS.findIndex(([dx, dy]) => prev.x + dx === p.x && prev.y + dy === p.y);
      if (d < 0) throw Error('연속되지 않은 경로는 저장할 수 없습니다');
      acc |= d << (k * 2); k++; prev = p;
      if (k === 4) { o.byte(acc); acc = 0; k = 0; }
    }
    if (k) o.byte(acc);
  }
  function getRoute(r, from) {
    const len = r.uint(), out = []; let prev = from, acc = 0;
    for (let i = 0; i < len; i++) { if (i % 4 === 0) acc = r.byte(); const [dx, dy] = DIRS[(acc >> ((i % 4) * 2)) & 3]; prev = { x: prev.x + dx, y: prev.y + dy }; out.push(prev); }
    return out;
  }
  const putList = (o, ids, m) => { const set = [...new Set(ids)].filter(id => m.index.has(id)); o.uint(set.length); for (const id of set) o.uint(m.index.get(id)); };
  const getList = (r, m) => { const n = r.uint(), out = []; for (let i = 0; i < n; i++) out.push(task(m, r.uint()).id); return out; };
  const task = (m, i) => { if (!m.tasks[i]) throw Error('상태 코드의 행동 번호가 세계 데이터에 없습니다'); return m.tasks[i]; };
  const putMem = (o, mem, m, clock) => { const list = (mem || []).filter(x => m.fidx.has(x[0])); o.uint(list.length); for (const [f, role, t] of list) { o.uint(m.fidx.get(f) * 2 + (role ? 1 : 0)); o.uint(Math.max(0, clock - t)); } };
  const getMem = (r, m, clock) => { const n = r.uint(), out = []; for (let i = 0; i < n; i++) { const v = r.uint(), f = m.facts[v >> 1]; if (f === undefined) throw Error('상태 코드의 사실 번호가 세계 데이터에 없습니다'); out.push([f, v & 1, clock - r.uint()]); } return out; };

  function pack(w, s) {
    const m = meta(w), o = writer(), clock = s.clock;
    o.byte(VERSION); o.u32(m.fp);
    o.uint(s.revision || 0); o.uint(s.day || 1); o.uint(clock); o.u32(s.rng >>> 0);
    const fb = Math.ceil(m.flags.length / 8);
    for (let i = 0; i < fb; i++) { let v = 0; for (let j = 0; j < 8; j++) if (s.flags[m.flags[i * 8 + j]]) v |= 1 << j; o.byte(v); }
    o.uint(s.pend ? s.npcs.findIndex(n => n.id === s.pend) + 1 : 0);
    o.byte(Math.max(0, KINDS.indexOf(s.pk || ''))); o.uint(s.pc || 0);
    o.byte(s.player.x); o.byte(s.player.y); putRoute(o, s.player, s.player.route); putTime(o, s.player.route.length ? s.player.nextMoveAt : 0, clock);
    putMem(o, s.player.mem, m, clock);
    for (const spec of w.npcs) { const v = (s.player.seen || {})[spec.id]; if (!v) o.uint(0); else { o.uint(v[0] + 2); o.uint(Math.max(0, clock - v[1])); } }
    for (const spec of w.npcs) {
      const n = s.npcs.find(x => x.id === spec.id);
      o.byte(n.x); o.byte(n.y); o.byte(MODES.indexOf(n.mode));
      o.uint(n.intent ? m.index.get(n.intent.id) + 1 : 0);
      putRoute(o, n, n.route);
      putTime(o, n.nextMoveAt, clock); putTime(o, n.busyUntil, clock);
      o.uint(n.blockedSince === null ? 0 : clock - n.blockedSince + 1);
      const done = [...new Set(n.completed)].filter(id => m.index.has(id));
      o.uint(done.length); for (const id of done) { o.uint(m.index.get(id)); o.uint(Math.max(0, clock - (n.lastCompleted[id] || clock))); }
      putList(o, n.excluded, m); putList(o, n.queued.map(t => t.id), m);
      o.uint(n.lastTask && m.index.has(n.lastTask) ? m.index.get(n.lastTask) + 1 : 0);
      putMem(o, n.mem, m, clock);
    }
    const sum = fletcher(o.bytes);
    return toB64([...o.bytes, ...sum]);
  }

  function unpack(w, text) {
    const m = meta(w), all = fromB64(text);
    if (all.length < 6) throw Error('상태 코드가 너무 짧습니다');
    const body = all.slice(0, -2), [a, c] = fletcher(body);
    if (a !== all[all.length - 2] || c !== all[all.length - 1]) throw Error('상태 코드가 손상되었습니다(체크섬 불일치)');
    const r = reader(body);
    if (r.byte() !== VERSION) throw Error('상태 코드 형식 버전이 다릅니다(이전 버전에서 만든 코드)');
    if (r.u32() !== m.fp) throw Error('세계 데이터(맵·일정)가 바뀌어 이 상태 코드를 읽을 수 없습니다');
    const s = { schema: 'TROEMEREI_NPC_V1', version: 1, worldId: w.map.id, logs: [] };
    s.revision = r.uint(); s.day = r.uint(); const clock = s.clock = r.uint(); s.rng = r.u32();
    s.flags = {}; const fb = Math.ceil(m.flags.length / 8);
    for (let i = 0; i < fb; i++) { const v = r.byte(); for (let j = 0; j < 8 && i * 8 + j < m.flags.length; j++) s.flags[m.flags[i * 8 + j]] = !!(v & (1 << j)); }
    const pend = r.uint(); s.pk = KINDS[r.byte()] || ''; s.pc = r.uint();
    const px = r.byte(), py = r.byte();
    s.player = { x: px, y: py }; s.player.route = getRoute(r, s.player); s.player.nextMoveAt = getTime(r, clock);
    s.player.mem = getMem(r, m, clock); s.player.seen = {};
    for (const spec of w.npcs) { const a = r.uint(); if (a) s.player.seen[spec.id] = [a - 2, clock - r.uint()]; }
    s.npcs = w.npcs.map(() => {
      const n = { x: r.byte(), y: r.byte() };
      n.mode = MODES[r.byte()]; if (!n.mode) throw Error('NPC 상태 값 오류');
      const it = r.uint(); n.intent = it ? JSON.parse(JSON.stringify(task(m, it - 1))) : null;
      n.route = getRoute(r, n); n.nextMoveAt = getTime(r, clock); n.busyUntil = getTime(r, clock);
      const bs = r.uint(); n.blockedSince = bs ? clock - (bs - 1) : null;
      n.completed = []; n.lastCompleted = {};
      const dn = r.uint(); for (let i = 0; i < dn; i++) { const id = task(m, r.uint()).id; n.completed.push(id); n.lastCompleted[id] = clock - r.uint(); }
      n.excluded = getList(r, m); n.queued = getList(r, m).map(id => JSON.parse(JSON.stringify(m.tasks[m.index.get(id)])));
      const lt = r.uint(); n.lastTask = lt ? task(m, lt - 1).id : '';
      n.meetings = []; n.followOffset = 0; n.mem = getMem(r, m, clock);
      return n;
    });
    w.npcs.forEach((spec, i) => { s.npcs[i] = { id: spec.id, ...s.npcs[i] }; });
    s.pend = pend ? s.npcs[pend - 1].id : null;
    if (!r.done()) throw Error('상태 코드 뒤에 알 수 없는 데이터가 있습니다');
    return s;
  }
  return { pack, unpack, hash16, fingerprint };
})();

/* AI 대사 문자열 해석 + AI 인계 메시지 생성.
   대사 형식(d 속성): 줄 구분은 |, 인물 대사는 `이름:대사` 또는 `이름(표정):대사`, 서술은 `*서술`.
   색·속도·크기 같은 연출 기본값은 JSX가 가진다(AI가 매번 적지 않는다). */
const trTalk = (() => {
  const LINE = /^([^:：*|()]{1,20})(?:\(([^()]{1,12})\))?\s*[:：]\s*(.+)$/s;
  function parse(raw) {
    if (!raw) return [];
    return String(raw).split('|').map(x => x.trim()).filter(Boolean).slice(0, 24).map(part => {
      if (part[0] === '*') return { speaker: '', expression: '', text: part.slice(1).trim().slice(0, 600), narration: true };
      const m = LINE.exec(part);
      if (!m || /^\d+$/.test(m[1].trim())) return { speaker: '', expression: '', text: part.slice(0, 600), narration: true };
      return { speaker: m[1].trim(), expression: (m[2] || '').trim(), text: m[3].trim().slice(0, 600), narration: false };
    }).filter(x => x.text);
  }
  // 끼어들기 시 실제로 본 비율만큼만 대화 시간을 반영한다.
  function partialSeconds(lines, lineIndex, chars, total) {
    const all = lines.reduce((n, l) => n + Array.from(l.text).length, 0);
    if (!all) return 0;
    const seen = lines.slice(0, lineIndex).reduce((n, l) => n + Array.from(l.text).length, 0) + chars;
    return Math.round(Math.max(0, Math.min(1, seen / all)) * total);
  }
  // kind: T 대화, I 끼어들기, A 추리 제시, P 자유 행동. ctx: 화면이 실제 상태로 만든 사실 줄(대상 상태·기억, 내 단서).
  function handoff({ kind, target = '', where = '', time = '', marks = [], ctx = [], cut = '', text = '', code }) {
    const head = ['TRM1', kind, target, cut ? 'cut=' + cut : ''].filter(Boolean).join(' ');
    const where2 = [time, where, ...marks].filter(Boolean).join(' ');
    return [head + (where2 ? ' | ' + where2 : ''), ...ctx.filter(Boolean), text, 's=' + code].filter(Boolean).join('\n');
  }
  return { parse, partialSeconds, handoff };
})();

// 360×540(2:3) 기준 화면. 폭이 다르면 비율을 유지한 채 통째로 확대·축소한다.
const TR_W = 360, TR_H = 540, TR_CELL = 36;
const TR_IMP = { idle: '한가해 보인다', moving: '어딘가 바빠 보인다', busy: '무언가에 집중하고 있다', paused: '이야기를 들어 주고 있다', accompany: '곁에서 함께 걷고 있다' };
const TR_BG = ['#25344a', '#2d3a30', '#283a4a', '#2c3550'];
const trNpc = id => TN_WORLD.npcs.find(n => n.id === id) || { name: id, color: '#999', symbol: '?' };
const trArea = (x, y) => { const i = trNPC.areaOf(TN_WORLD, x, y); return i < 0 ? '통로' : TN_WORLD.map.areas[i].name; };
const trHM = n => trNPC.clock(n).slice(0, 5);
const trFact = (id, role, who) => { const f = (TN_WORLD.facts || []).find(x => x.id === id); if (!f) return id; if (who === 'player') return f.player || f.seen || id; return role === 0 ? ((f.self || {})[who] || f.seen || id) : (f.seen || id); };
const trVisible = (s, n) => trNPC.sees(TN_WORLD, s.player, n);
const trChars = lines => lines.reduce((k, l) => k + Array.from(l.text).length, 0);

// 이미지 ID → 실제 주소. 주소 표(TN_ASSETS)는 빌드할 때 플랫폼별로 끼워 넣는다.
const trImg = id => (id && typeof TN_ASSETS === 'object' && TN_ASSETS[id]) || '';

// AI 출력: <Troemerei s='상태코드' d='이름:대사|*서술' />  (자유 행동 P에만 t='초', 사건 코드는 e='…')
function Troemerei({ s = '', t = '', d = '', e = '' }) {
  const lines = useMemo(() => trTalk.parse(d), [d]);
  const [boot] = useState(() => {
    if (!s) return { base: trNPC.createWorld(TN_WORLD), error: '', ev: null };
    try {
      let base = trCodec.unpack(TN_WORLD, s), ev = null;
      // 사건 코드는 화면이 조건을 검사한 뒤에만 상태에 반영한다(대화 시간 반영 전에 검사).
      if (e) { const r = trNPC.applyEvent(TN_WORLD, base, e); base = r.state; ev = { code: String(e), accepted: r.accepted, reason: r.reason }; }
      return { base, error: '', ev };
    } catch (err) { return { base: null, error: err.message, ev: null }; }
  });
  const replySec = b => (b && b.pk === 'P' && String(t).trim() !== '') ? Math.max(0, Math.min(900, Math.floor(Number(t) || 0))) : trNPC.talkSeconds(b ? b.pc : 0, trChars(lines));
  const pendNpc = boot.base && boot.base.pend;
  const [state, setState] = useState(() => !boot.base ? null : (s && !lines.length) ? trNPC.applyTalk(TN_WORLD, boot.base, replySec(boot.base)) : boot.base);
  const [talk, setTalk] = useState(() => boot.base && lines.length ? { npc: pendNpc || null, idx: 0, shown: 0, cut: false, fresh: false } : null);
  // 받은 응답의 대화 시간을 이미 반영했는지(대사가 있으면 다 읽거나 끊을 때 반영).
  const [consumed, setConsumed] = useState(() => !lines.length);
  const [menu, setMenu] = useState(null);
  const [preview, setPreview] = useState(null);
  const [sheet, setSheet] = useState('');
  const [drop, setDrop] = useState(false);
  const [text, setText] = useState('');
  const [codeText, setCodeText] = useState('');
  const [toast, setToast] = useState(boot.ev && boot.ev.accepted ? (trNPC.clone(boot.base).logs.slice(-1)[0] || {}).text || '' : boot.base && s && !lines.length && boot.base.pk ? '응답을 반영했습니다' : '');
  const [debug, setDebug] = useState(false);
  const [sent, setSent] = useState('');
  const [scale, setScale] = useState(1);
  const [badImg, setBadImg] = useState({}); // 불러오지 못한 그림은 임시 그림으로 대체
  const outRef = useRef(null), padRef = useRef(null), svgRef = useRef(null), lastSpeaker = useRef(null);

  useEffect(() => {
    const fit = () => { const el = outRef.current; if (!el) return; const w = el.getBoundingClientRect().width || TR_W; const h = (typeof window !== 'undefined' && window.innerHeight) || 99999; setScale(Math.max(0.6, Math.min(1.6, w / TR_W, (h - 8) / TR_H))); };
    fit();
    if (typeof ResizeObserver === 'function' && outRef.current) { const ro = new ResizeObserver(fit); ro.observe(outRef.current); return () => ro.disconnect(); }
    if (typeof window !== 'undefined') { window.addEventListener('resize', fit); return () => window.removeEventListener('resize', fit); }
  }, []);
  const line = talk && !talk.fresh && !talk.done ? lines[talk.idx] : null;
  const chars = line ? Array.from(line.text) : [];
  const full = !line || talk.shown >= chars.length;
  const lastLine = !!line && talk.idx === lines.length - 1;
  const canInput = talk && !sent && (talk.fresh || talk.cut || (lastLine && full) || talk.done);
  useEffect(() => {
    if (!line || talk.cut || full) return;
    const id = setInterval(() => setTalk(v => v && ({ ...v, shown: Math.min(chars.length, v.shown + 1) })), 30);
    return () => clearInterval(id);
  }, [talk && talk.idx, talk && talk.cut, full, chars.length]);

  // 이동 중에만 시간이 흐른다. 새 인물이 시야에 들어오면 자동으로 멈춘다.
  useEffect(() => {
    if (!state || sent || talk || !state.player.route.length) return;
    const id = setTimeout(() => {
      const before = new Set(state.npcs.filter(n => trVisible(state, n)).map(n => n.id));
      let next = trNPC.advance(TN_WORLD, state, TN_WORLD.player.moveSeconds || 4);
      const fresh = next.npcs.filter(n => trVisible(next, n) && !before.has(n.id));
      if (fresh.length && next.player.route.length) { next = trNPC.dispatch(TN_WORLD, next, { type: 'CLEAR_ROUTE' }); setToast(fresh.map(n => trNpc(n.id).name).join('·') + '이(가) 보여 멈췄다'); }
      setState(next);
    }, 160);
    return () => clearTimeout(id);
  }, [state, sent, talk]);

  if (!state) return <div className="tr-out" ref={outRef} style={{ height: TR_H * scale }}><style>{TN_CSS}</style><div className="tr-card" style={{ transform: `scale(${scale})` }}>
    <div className="tr-err"><b>상태 코드를 읽을 수 없습니다</b><div className="tr-mut">{boot.error}</div>
      <div>직전 인계 메시지의 <b>s=</b> 뒤 값을 붙여넣으면 이어서 진행할 수 있습니다.</div>
      <textarea className="tr-ta" rows={4} value={codeText} onChange={e => setCodeText(e.target.value)} />
      <button style={{ height: 34 }} onClick={() => { try { const v = trCodec.unpack(TN_WORLD, codeText.trim()); setState(trNPC.applyTalk(TN_WORLD, v, 0)); } catch (e) { setToast(e.message); } }}>이 코드로 복원</button>
      <button style={{ height: 34 }} onClick={() => setState(trNPC.createWorld(TN_WORLD))}>처음부터 시작</button>
      {toast ? <div className="tr-mut">{toast}</div> : null}</div></div></div>;

  const p = state.player, area = trNPC.areaOf(TN_WORLD, p.x, p.y);
  const camX = Math.max(0, Math.min(TN_WORLD.map.width * TR_CELL - TR_W, (p.x + .5) * TR_CELL - TR_W / 2));
  const camY = Math.max(0, Math.min(TN_WORLD.map.height * TR_CELL - TR_H, (p.y + .5) * TR_CELL - TR_H / 2 + 40));
  const busy = !!sent;

  function act(a) { if (busy) return; setState(v => trNPC.dispatch(TN_WORLD, v, a)); }
  function step(dx, dy) {
    setPreview(null); setMenu(null);
    setState(v => { if (v.player.route.length) return v; const a = trNPC.dispatch(TN_WORLD, v, { type: 'MOVE_ONE', dx, dy }); return a.player.route.length ? trNPC.advance(TN_WORLD, a, TN_WORLD.player.moveSeconds || 4) : a; });
  }
  function padDown(dx, dy) { if (busy) return; step(dx, dy); clearInterval(padRef.current); padRef.current = setInterval(() => step(dx, dy), 240); }
  function padUp() { clearInterval(padRef.current); padRef.current = null; }

  function tapMap(e) {
    if (busy) return;
    const r = svgRef.current.getBoundingClientRect();
    const x = Math.floor((camX + (e.clientX - r.left) * TR_W / r.width) / TR_CELL), y = Math.floor((camY + (e.clientY - r.top) * TR_H / r.height) / TR_CELL);
    const who = state.npcs.find(n => n.x === x && n.y === y && (debug || trVisible(state, n)));
    if (who) { setPreview(null); setMenu({ kind: 'npc', id: who.id }); return; }
    const lm = TN_WORLD.map.landmarks.find(l => l.x === x && l.y === y && trNPC.areaOf(TN_WORLD, x, y) === area);
    if (lm) { setPreview(null); setMenu({ kind: 'lm', id: lm.id }); return; }
    setMenu(null);
    if (!trNPC.walkable(TN_WORLD, x, y)) { setPreview(null); return; }
    if (trNPC.areaOf(TN_WORLD, x, y) !== area) { setPreview(null); setToast('다른 구역은 방향키로 이동하세요'); return; }
    if (preview && preview.x === x && preview.y === y) { setPreview(null); act({ type: 'MOVE_TO', x, y }); return; }
    const path = trNPC.route(TN_WORLD, state, p, { x, y }, { ignorePlayer: true });
    if (!path.length) { setPreview(null); return; }
    setPreview({ x, y, path, sec: path.length * (TN_WORLD.player.moveSeconds || 4) });
  }

  function npcContext(next, id) {
    const n = next.npcs.find(v => v.id === id), name = trNpc(id).name;
    const mem = (n.mem || []).slice(-5).map(m => trHM(m[2]) + ' ' + trFact(m[0], m[1], id) + (m[1] ? '(목격)' : ''));
    return [name + ' 상태: ' + trNPC.describe(TN_WORLD, next, n), mem.length ? name + ' 기억: ' + mem.join(' / ') : ''];
  }
  function clueLine(next) { const c = (next.player.mem || []).slice(-6).map(m => trFact(m[0], m[1], 'player')); return c.length ? '내 단서: ' + c.join(' / ') : ''; }
  function applyReply(kind) {
    if (!lines.length || consumed) return state;
    const full = replySec(boot.base);
    return trNPC.applyTalk(TN_WORLD, boot.base, kind === 'I' ? trTalk.partialSeconds(lines, talk.idx, talk.shown, full) : full);
  }
  function send(kind) {
    const msg = text.trim(); if (!msg || busy) return;
    const chars = Array.from(msg).length;
    let next = applyReply(kind), target = '', ctx = [], cut = '';
    if (kind === 'I') cut = `${talk.idx + 1}/${lines.length}:${talk.shown}`;
    const id = (kind === 'T' || kind === 'I') && talk ? talk.npc : null;
    if (id) {
      next = trNPC.dispatch(TN_WORLD, next, { type: 'TALK_REQUEST', npcId: id, kind, chars });
      if (next.pend !== id) { setToast('지금은 말을 걸 수 없습니다'); return; }
      target = trNpc(id).name; ctx = [...npcContext(next, id), clueLine(next)];
    } else {
      next = { ...trNPC.clone(next), pk: kind === 'T' ? 'P' : kind, pc: chars, pend: null };
      ctx = [clueLine(next)];
    }
    const code = trCodec.pack(TN_WORLD, next);
    const message = trTalk.handoff({ kind: id ? kind : (kind === 'T' ? 'P' : kind), target, cut, where: trArea(next.player.x, next.player.y), time: next.day + '일 ' + trHM(next.clock), marks: trNPC.markers(TN_WORLD, next), ctx, text: msg, code });
    try { if (typeof sendMessage === 'function') sendMessage(message); setState(next); setConsumed(true); setSent(message); setText(''); setDrop(false); }
    catch (e) { setToast('전송 실패: ' + e.message); }
  }
  function endTalk() {
    if (!consumed) { setState(applyReply('T')); setConsumed(true); }
    setTalk(null); setText(''); setDrop(false);
  }
  function talkAction(type) {
    let next = applyReply('T'); setConsumed(true);
    if (type === 'LOOK') { setState(next); setTalk(v => ({ ...v, done: true })); setToast(trNpc(talk.npc).name + ' · ' + TR_IMP[next.npcs.find(n => n.id === talk.npc).mode]); setDrop(false); return; }
    next = trNPC.dispatch(TN_WORLD, next, { type, npcId: talk.npc });
    setState(next); setTalk(null); setDrop(false); setToast((next.logs[next.logs.length - 1] || {}).text || '');
  }
  function menuDo(kind) {
    const m = menu; setMenu(null);
    if (m.kind === 'lm') { const lm = TN_WORLD.map.landmarks.find(l => l.id === m.id); if (kind === 'LOOK') setToast(lm.name + '을(를) 살펴봤다 (0초)'); if (kind === 'GO') act({ type: 'MOVE_TO', x: lm.x, y: lm.y }); if (kind === 'SEARCH') setToast('조사는 다음 시험판에서 구현됩니다'); return; }
    const n = state.npcs.find(v => v.id === m.id);
    if (kind === 'TALK') { setTalk({ npc: m.id, idx: 0, shown: 0, cut: false, fresh: true }); setText(''); return; }
    if (kind === 'LOOK') { setToast(trNpc(m.id).name + ' · ' + TR_IMP[n.mode] + ' (0초)'); return; }
    act({ type: kind, npcId: m.id });
  }

  // ---------- 1:1 대화 화면 ----------
  if (talk) {
    const n = talk.npc ? state.npcs.find(v => v.id === talk.npc) : null;
    const def = n ? trNpc(talk.npc) : { name: '상황', color: '#6b7a8c', symbol: '…' };
    const sp = line && !line.narration ? (TN_WORLD.npcs.find(x => x.name === line.speaker) || null) : null;
    const pic = trImg((sp && sp.portrait) || (lastSpeaker.current && lastSpeaker.current.portrait) || def.portrait);
    if (sp) lastSpeaker.current = sp;
    const boxBottom = canInput ? 92 : 5;
    return <div className="tr-out" ref={outRef} style={{ height: TR_H * scale }}><style>{TN_CSS}</style>
      <div className="tr-card" style={{ transform: `scale(${scale})`, background: TR_BG[Math.max(0, area)] }}>
        <div className="tr-talk">
          {pic && !badImg[pic] ? <img src={pic} alt="" onError={() => setBadImg(v => ({ ...v, [pic]: true }))} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} /> :
            <svg viewBox="0 0 360 540" style={{ position: 'absolute', inset: 0 }} aria-hidden="true"><ellipse cx="180" cy="520" rx="150" ry="230" fill={def.color} opacity=".55" /><circle cx="180" cy="190" r="78" fill={def.color} opacity=".9" /><text x="180" y="212" textAnchor="middle" fontSize="64" fontWeight="700" fill="#14212c">{def.symbol}</text></svg>}
          <div className="tr-hud"><span className="tr-pill">{def.name} · {trArea(n ? n.x : state.player.x, n ? n.y : state.player.y)}</span><span style={{ flex: 1 }} /><span className="tr-pill tr-time">{trNPC.clock(state.clock)}</span></div>
          <div className="tr-toast" style={{ right: 'auto' }}>{toast || (n ? TR_IMP[n.mode] : '행동의 결과')}</div>
          {line ? <div className="tr-box" style={{ bottom: boxBottom }} onClick={() => { if (talk.cut) return; if (!full) setTalk(v => ({ ...v, shown: chars.length })); else if (!lastLine) setTalk(v => ({ ...v, idx: v.idx + 1, shown: 0 })); }}>
            <div className="tr-name"><b style={{ color: sp ? sp.color : '#b9c9d6' }}>{line.narration ? '서술' : line.speaker}{line.expression ? ' · ' + line.expression : ''}</b><span>{talk.idx + 1}/{lines.length}{talk.cut ? ' · 멈춤' : full ? ' ▼' : ''}</span></div>
            <div className={'tr-line' + (line.narration ? ' narr' : '')}>{chars.slice(0, talk.shown).join('')}</div>
            <div className="tr-ctl" onClick={e => e.stopPropagation()}>
              <button disabled={talk.idx < 1 || talk.cut} onClick={() => setTalk(v => ({ ...v, idx: v.idx - 1, shown: 0 }))}>‹</button>
              <button disabled={lastLine || talk.cut} onClick={() => setTalk(v => ({ ...v, idx: v.idx + 1, shown: 0 }))}>›</button>
              <button disabled={talk.cut} onClick={() => setTalk(v => ({ ...v, shown: 0 }))}>↺</button>
              <span style={{ flex: 1 }} />
              {!(lastLine && full) && !talk.cut ? <button disabled={busy} onClick={() => { setTalk(v => ({ ...v, cut: true })); setText(''); }}>끼어들기</button> : null}
              {talk.cut ? <button onClick={() => setTalk(v => ({ ...v, cut: false }))}>끼어들기 취소</button> : null}
              <button disabled={busy || talk.cut} onClick={endTalk}>대화 끝</button>
            </div></div> : null}
          {canInput ? <div className="tr-in">
            {drop && n ? <div className="tr-drop">
              {n.mode === 'accompany' ? <button onClick={() => talkAction('RELEASE')}>동행 종료</button> : <button disabled={n.mode === 'busy' || (n.intent && !n.intent.interruptible)} onClick={() => talkAction('ACCOMPANY')}>동행 요청</button>}
              <button onClick={() => talkAction('LOOK')}>관찰 (0초)</button>
              <button disabled>증거 제시 (준비 중)</button>
            </div> : null}
            <div className="tr-in-top">{n ? <button onClick={() => setDrop(v => !v)}>행동 ▾</button> : null}<button onClick={() => setText(v => v + '**')}>*</button><button onClick={() => setText(v => v + '""')}>"</button>
              <span style={{ flex: 1 }} />{talk.cut ? <span className="tr-mut">끊은 뒤 대사는 무효</span> : !line ? <button onClick={endTalk}>대화 끝</button> : null}</div>
            <div style={{ display: 'flex', gap: 4 }}><textarea className="tr-ta" rows={2} value={text} placeholder={n ? def.name + '에게 할 말이나 행동' : '이어서 할 행동'} onChange={e => setText(e.target.value.slice(0, 500))} />
              <button className="tr-send" disabled={!text.trim()} onClick={() => send(talk.cut ? 'I' : 'T')}>보내기</button></div>
          </div> : null}
          {sent ? <div className="tr-box" style={{ bottom: 5 }}><div className="tr-line" style={{ height: 'auto' }}>전달했습니다. AI 응답의 새 화면에서 이어집니다.</div></div> : null}
        </div></div></div>;
  }

  // ---------- 탐색 화면 ----------
  const vis = state.npcs.filter(n => debug || trVisible(state, n));
  const mn = menu && menu.kind === 'npc' ? state.npcs.find(v => v.id === menu.id) : null;
  const ml = menu && menu.kind === 'lm' ? TN_WORLD.map.landmarks.find(l => l.id === menu.id) : null;
  const dist = mn ? Math.abs(p.x - mn.x) + Math.abs(p.y - mn.y) : 0;
  const near = dist <= 1, canAcc = near && mn && mn.mode !== 'busy' && mn.mode !== 'accompany' && (!mn.intent || mn.intent.interruptible);
  const recent = state.logs.filter(e => e.visible && e.type === 'world').slice(-1)[0];
  return <div className="tr-out" ref={outRef} style={{ height: TR_H * scale }}><style>{TN_CSS}</style>
    <div className="tr-card" style={{ transform: `scale(${scale})` }}>
      <svg ref={svgRef} className="tr-map" viewBox={`${camX} ${camY} ${TR_W} ${TR_H}`} onClick={tapMap}>
        {trStaticLayer()}
        {TN_WORLD.map.areas.map((a, i) => i === area && !debug ? null : <rect key={'f' + i} x={a.x0 * TR_CELL} y={a.y0 * TR_CELL} width={(a.x1 - a.x0 + 1) * TR_CELL} height={(a.y1 - a.y0 + 1) * TR_CELL} fill="#050b14" opacity={debug ? .35 : .82} pointerEvents="none" />)}
        {preview ? <polyline points={[p, ...preview.path].map(q => `${(q.x + .5) * TR_CELL},${(q.y + .5) * TR_CELL}`).join(' ')} fill="none" stroke="#f2d99e" strokeWidth="3" strokeDasharray="5 4" pointerEvents="none" /> : null}
        {p.route.length ? <polyline points={[p, ...p.route].map(q => `${(q.x + .5) * TR_CELL},${(q.y + .5) * TR_CELL}`).join(' ')} fill="none" stroke="#f2d99e" strokeWidth="3" pointerEvents="none" /> : null}
        {vis.map(n => { const df = trNpc(n.id), cx = (n.x + .5) * TR_CELL, cy = (n.y + .5) * TR_CELL; return <g key={n.id} pointerEvents="none">
          {menu && menu.id === n.id ? <circle cx={cx} cy={cy} r="18" fill="none" stroke="#f0d29a" strokeWidth="2" strokeDasharray="4 3" /> : null}
          <circle cx={cx} cy={cy} r="14" fill={df.color} stroke="#f4efdf" strokeWidth="1.6" /><text x={cx} y={cy + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#14212c">{df.symbol}</text>
          {n.mode === 'accompany' ? <circle cx={cx + 11} cy={cy - 11} r="4" fill="#f7d47c" /> : null}</g>; })}
        <g pointerEvents="none"><circle cx={(p.x + .5) * TR_CELL} cy={(p.y + .5) * TR_CELL} r="15" fill="#f6dfab" stroke="#1b2a39" strokeWidth="3" /><text x={(p.x + .5) * TR_CELL} y={(p.y + .5) * TR_CELL + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1b2a39">나</text></g>
      </svg>
      <div className="tr-hud"><span className="tr-pill">{trArea(p.x, p.y)}</span><span className="tr-pill tr-time">{state.day}일 {trNPC.clock(state.clock)}</span><span style={{ flex: 1 }} />
        <button onClick={() => setSheet('clue')}>노트</button><button onClick={() => setSheet('set')}>≡</button></div>
      <div className="tr-toast">{toast || (recent ? trHM(recent.time) + ' ' + recent.text : '인물·물건을 누르면 행동을 고를 수 있다')}</div>
      {[[0, -1, 41, 436, '↑'], [-1, 0, 6, 471, '←'], [1, 0, 76, 471, '→'], [0, 1, 41, 506, '↓']].map(([dx, dy, x, y, k]) => <button key={k} className="tr-pad" style={{ left: x, top: y - 5 }} disabled={busy} onPointerDown={e => { e.preventDefault(); padDown(dx, dy); }} onPointerUp={padUp} onPointerLeave={padUp} onPointerCancel={padUp}>{k}</button>)}
      {preview && !menu ? <div className="tr-preview" onClick={() => setPreview(null)}>{preview.path.length}칸 · {preview.sec}초 걸림 — 같은 칸을 한 번 더 누르면 출발</div> : null}
      {mn ? <div className="tr-menu"><div className="tr-menu-h"><b>{trNpc(mn.id).name}</b><span>{dist}칸 · {TR_IMP[mn.mode]}</span></div>
        <div className="tr-menu-g">
          <button disabled={!near || mn.mode === 'busy' || busy} onClick={() => menuDo('TALK')}>대화</button>
          <button disabled={!canAcc || busy} onClick={() => menuDo('ACCOMPANY')}>동행 요청</button>
          <button disabled={mn.mode !== 'accompany' || busy} onClick={() => menuDo('RELEASE')}>동행 종료</button>
          <button disabled={busy} onClick={() => menuDo('LOOK')}>관찰 0초</button></div>
        {!near ? <div className="tr-menu-why">대화·동행은 바로 옆 칸에서 할 수 있다</div> : mn.mode === 'busy' ? <div className="tr-menu-why">지금은 하던 일에 집중하고 있다</div> : null}</div> : null}
      {ml ? <div className="tr-menu"><div className="tr-menu-h"><b>{ml.name}</b><span>{Math.abs(p.x - ml.x) + Math.abs(p.y - ml.y)}칸</span></div>
        <div className="tr-menu-g"><button onClick={() => menuDo('LOOK')}>관찰 0초</button><button onClick={() => menuDo('SEARCH')}>조사</button><button onClick={() => menuDo('GO')}>여기로 이동</button><button onClick={() => setMenu(null)}>닫기</button></div></div> : null}
      {sent ? <div className="tr-preview" style={{ left: 112 }}>전달했습니다. 새 화면에서 이어집니다.</div> : null}
      {sheet ? trSheet({ ev: boot.ev, tab: sheet, setTab: setSheet, state, debug, setDebug, busy,
        onWait: sec => { act({ type: 'WAIT', seconds: sec }); setSheet(''); }, codeText, setCodeText,
        onRestore: () => { try { const v = trCodec.unpack(TN_WORLD, codeText.trim()); setState(trNPC.applyTalk(TN_WORLD, v, 0)); setSheet(''); setToast('상태 코드를 복원했습니다'); } catch (e) { setToast('복원 실패: ' + e.message); } },
        onFree: () => { setSheet('free'); setText(''); }, text, setText, send, sent }) : null}
    </div></div>;
}

// 움직이지 않는 지도 층: 한 번만 만들고 다시 그리지 않는다.
// 움직이지 않는 지도 층(함수 호출로 사용: 대문자 이름은 UUMMAI가 별도 컴포넌트로 인식하므로 피한다).
const trStaticLayer = (() => {
  let cache = null;
  return () => {
    if (cache) return cache;
    const out = [];
    TN_WORLD.map.rows.forEach((row, y) => row.split('').forEach((c, x) => { const i = trNPC.areaOf(TN_WORLD, x, y); out.push(<rect key={x + '-' + y} x={x * TR_CELL} y={y * TR_CELL} width={TR_CELL} height={TR_CELL} fill={c === '#' ? '#0f1a27' : TR_BG[Math.max(0, i)]} stroke="#5f7585" strokeOpacity=".09" />); }));
    TN_WORLD.map.landmarks.forEach(l => out.push(<g key={'l' + l.id}><rect x={l.x * TR_CELL + 6} y={l.y * TR_CELL + 6} width={TR_CELL - 12} height={TR_CELL - 12} rx="4" fill="#e0bc78" opacity=".22" /><text x={(l.x + .5) * TR_CELL} y={(l.y + .5) * TR_CELL + 6} fontSize="16" textAnchor="middle" fill="#eddbaf">{l.icon}</text></g>));
    cache = <g pointerEvents="none">{out}</g>;
    return cache;
  };
})();

function trSheet({ ev, tab, setTab, state, debug, setDebug, busy, onWait, codeText, setCodeText, onRestore, onFree, text, setText, send, sent }) {
  const tabs = [['clue', '단서'], ['people', '인물'], ['log', '기록'], ['set', '설정']];
  const mem = (state.player.mem || []).slice().reverse();
  return <div className="tr-sheet">
    <div className="tr-tabs">{tabs.map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}<button style={{ flex: 'none', width: 34 }} onClick={() => setTab('')}>✕</button></div>
    <div className="tr-body">
      {tab === 'clue' ? (mem.length ? mem.map((m, i) => <div className="tr-row" key={i}><time>{trHM(m[2])}</time>{trFact(m[0], m[1], 'player')}</div>) : <div className="tr-mut">아직 직접 보거나 들은 단서가 없다.</div>) : null}
      {tab === 'people' ? TN_WORLD.npcs.map(n => { const v = (state.player.seen || {})[n.id]; return <div className="tr-row" key={n.id}><b style={{ color: n.color }}>{n.name}</b> <span className="tr-mut">{v ? '마지막으로 본 곳: ' + (v[0] < 0 ? '통로' : TN_WORLD.map.areas[v[0]].name) + ' · ' + trHM(v[1]) : '아직 보지 못했다'}</span></div>; }) : null}
      {tab === 'log' ? state.logs.filter(e => debug || e.visible).slice(-30).reverse().map((e, i) => <div className="tr-row" key={i}><time>{trHM(e.time)}</time>{e.text}</div>) : null}
      {tab === 'set' ? <div style={{ display: 'grid', gap: 6, paddingTop: 4 }}>
        <div style={{ display: 'flex', gap: 4 }}><button style={{ flex: 1, height: 32 }} disabled={busy} onClick={() => onWait(60)}>1분 대기</button><button style={{ flex: 1, height: 32 }} disabled={busy} onClick={() => onWait(300)}>5분 대기</button></div>
        <button style={{ height: 32 }} disabled={busy} onClick={onFree}>자유 행동 · 추리 입력</button>
        <label className="tr-mut"><input type="checkbox" checked={debug} onChange={e => setDebug(e.target.checked)} /> 디버그 (숨은 인물·기록 표시)</label>
        <div className="tr-mut">상태 코드</div><div className="tr-mono">{trCodec.pack(TN_WORLD, state)}</div>
        <textarea className="tr-ta" rows={2} value={codeText} onChange={e => setCodeText(e.target.value)} placeholder="복원할 상태 코드" />
        <button style={{ height: 30 }} disabled={busy} onClick={onRestore}>이 코드로 복원</button>
        {ev ? <div className="tr-mut">받은 사건 코드: {ev.code} · {ev.accepted ? '인정' : '거부(' + (ev.reason || '조건 불일치') + ')'}</div> : null}
        <div className="tr-mut">표식: {trNPC.markers(TN_WORLD, state).join(' ')}</div>
        <div className="tr-mut">시험판 v0.4 · 임시 인물·장소(본편 아님)</div></div> : null}
      {tab === 'free' ? <div style={{ display: 'grid', gap: 6, paddingTop: 4 }}>
        <div className="tr-mut">인물이 아닌 상대로 하는 행동이나, 지금까지의 추리를 적는다.</div>
        <textarea className="tr-ta" rows={4} value={text} onChange={e => setText(e.target.value.slice(0, 500))} placeholder="행동이나 추리" />
        <div style={{ display: 'flex', gap: 4 }}><button style={{ flex: 1, height: 34 }} disabled={!text.trim() || !!sent} onClick={() => send('P')}>행동 전달</button><button style={{ flex: 1, height: 34 }} disabled={!text.trim() || !!sent} onClick={() => send('A')}>추리 제시</button></div>
        {sent ? <div className="tr-mut">전달했습니다. 새 화면에서 이어집니다.</div> : null}</div> : null}
    </div></div>;
}
