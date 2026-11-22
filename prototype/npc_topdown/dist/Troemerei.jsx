// 몽환의 트로이메라이 · 탑다운 시험판 v0.2 (TRM1) — UUMMAI에 컴포넌트 1개로 등록: 이름 Troemerei
// import·fetch·외부 에셋·브라우저 저장소 없음. useState/useEffect/useRef/useMemo/sendMessage는 호스트 제공.
// AI 출력 형식: <Troemerei s='상태코드' t='경과초' d='이름:대사|*서술' />
const TN_WORLD = {"version":1,"kind":"prototype-world-not-canon","title":"트로메라 · 일상 행동 샌드박스","notes":"인물/장소/사건은 동작 검증용 임시 데이터이며 본편 설정이 아니다.","map":{"id":"prototype","width":30,"height":18,"rows":["##############################","#..............#.............#","#..............#.............#","#..............#..#..........#","#...#..........#.............#","#..........................#.#","#.........#....#.............#","#..............#.............#","########.###########.#########","#..............#.............#","#..............#.............#","#..............#.............#","#............................#","#..............#.........#...#","#............#.#.............#","#...#..........#.#...........#","#..............#.............#","##############################"],"tileSeconds":4,"areas":[{"name":"자료실","x0":1,"y0":1,"x1":14,"y1":7},{"name":"작업실","x0":16,"y0":1,"x1":28,"y1":7},{"name":"정원","x0":1,"y0":9,"x1":14,"y1":16},{"name":"광장","x0":16,"y0":9,"x1":28,"y1":16}],"landmarks":[{"id":"archive","name":"자료실 선반","x":6,"y":4,"icon":"▣"},{"id":"desk","name":"작업실 탁자","x":24,"y":4,"icon":"◇"},{"id":"fountain","name":"광장 분수","x":22,"y":12,"icon":"◉"},{"id":"garden","name":"정원 벤치","x":7,"y":13,"icon":"▤"},{"id":"notice","name":"게시판","x":11,"y":12,"icon":"▥"}]},"player":{"x":7,"y":12,"moveSeconds":4},"npcs":[{"id":"companion","name":"유리","symbol":"유","color":"#de9f68","x":8,"y":12,"stepSeconds":5,"agenda":[{"id":"meet_contact","kind":"meet","targetNpc":"contact","from":"09:00","until":"09:25","durationSeconds":45,"priority":90,"weight":5,"once":true,"interruptible":true,"onComplete":"meeting_created","onInterrupt":"meeting_prevented"},{"id":"garden_break","kind":"visit","landmark":"garden","from":"09:00","until":"18:30","durationSeconds":100,"priority":10,"weight":3,"cooldownSeconds":180,"interruptible":true},{"id":"fountain_walk","kind":"visit","landmark":"fountain","from":"09:00","until":"18:30","durationSeconds":80,"priority":10,"weight":2,"cooldownSeconds":150,"interruptible":true}]},{"id":"contact","name":"도윤","symbol":"도","color":"#7aaddd","x":24,"y":4,"stepSeconds":8,"agenda":[]},{"id":"librarian","name":"세린","symbol":"세","color":"#a49ad8","x":5,"y":5,"stepSeconds":9,"agenda":[{"id":"archive_patrol","kind":"visit","landmark":"archive","from":"09:00","until":"18:00","durationSeconds":90,"priority":10,"weight":4,"cooldownSeconds":120,"interruptible":true},{"id":"notice_review","kind":"visit","landmark":"notice","from":"09:00","until":"18:00","durationSeconds":40,"priority":10,"weight":1,"cooldownSeconds":180,"interruptible":true}]},{"id":"courier","name":"태수","symbol":"태","color":"#88bfa6","x":21,"y":14,"stepSeconds":7,"agenda":[{"id":"post_delivery","kind":"visit","landmark":"notice","from":"09:00","until":"18:30","durationSeconds":40,"priority":10,"weight":4,"cooldownSeconds":140,"interruptible":true},{"id":"fetch_material","kind":"visit","landmark":"desk","from":"09:00","until":"18:30","durationSeconds":90,"priority":10,"weight":2,"cooldownSeconds":150,"interruptible":true}]}],"onComplete":[{"id":"meeting_created","when":{"npc":"companion","task":"meet_contact","targetNpc":"contact"},"setFlag":"meeting_occurred","queueTask":{"id":"deliver_request","kind":"visit","landmark":"archive","durationSeconds":70,"priority":100,"interruptible":false,"once":true,"onCompleteFlag":"delivery_done"},"publicLog":"두 사람이 대화를 마쳤고, 유리에게 자료실 방문 일정이 새로 생겼다."}],"flagNames":["meeting_occurred","meeting_prevented","delivery_done"]};
const TN_CSS = ".tn-app{color:#e7edf5;background:#0c1421;font-family:system-ui,-apple-system,\"Malgun Gothic\",sans-serif;min-height:100vh;box-sizing:border-box;padding:16px;font-size:14px}\n.tn-app *{box-sizing:border-box}.tn-app button{font:inherit;cursor:pointer;color:inherit;background:#1a2a3b;border:1px solid #324357;border-radius:9px;padding:9px 12px;transition:background .12s}.tn-app button:hover:not(:disabled){background:#283b50}.tn-app button:disabled{opacity:.35;cursor:default}.tn-app .tn-primary{background:#907040;border-color:#c1a06a;color:#fff}.tn-app .tn-primary:hover{background:#a68753}\n.tn-head{display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin:0 0 13px}.tn-title{font-weight:750;font-size:23px;letter-spacing:.03em}.tn-subtitle{font-size:11px;color:#93a7b8;margin-top:3px}.tn-clock{font-variant-numeric:tabular-nums;font-weight:800;font-size:19px;color:#e7c894}.tn-pill{font-size:12px;padding:5px 10px;background:#203042;border:1px solid #314154;border-radius:8px}\n.tn-toolbar{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin:0 0 12px}.tn-toolbar .tn-clock{margin-right:14px}.tn-grid{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:12px;align-items:start}\n.tn-panel{background:#111e2d;border:1px solid #293a4c;border-radius:13px;overflow:hidden;box-shadow:0 9px 22px #0003}.tn-maphead{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;border-bottom:1px solid #293a4c;font-size:12px;color:#a8bdd0}\n.tn-view{height:min(60vh,530px);min-height:380px;background:#172435;position:relative;touch-action:none;overflow:hidden}.tn-view svg{width:100%;height:100%;display:block;touch-action:none;user-select:none}.tn-view svg [data-x]{cursor:crosshair}.tn-view svg [data-npc]{cursor:pointer}\n.tn-mapfoot{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;border-top:1px solid #293a4c;color:#9eb3c3;font-size:12px}.tn-dir{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;width:132px}.tn-dir button{padding:5px}.tn-side{display:flex;flex-direction:column;gap:12px}.tn-cardhead{padding:12px 14px;border-bottom:1px solid #293a4c;color:#afc3d5;font-size:12px;font-weight:700;letter-spacing:.07em}\n.tn-inspector{padding:14px;min-height:160px}.tn-person{display:flex;gap:12px;align-items:center;margin:0 0 10px}.tn-avatar{border-radius:11px;width:44px;height:44px;display:grid;place-items:center;font-size:20px;font-weight:800;color:#121a24}.tn-person-name{font-size:18px;font-weight:800}.tn-muted{font-size:12px;color:#a2b5c4;line-height:1.65}.tn-status{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}.tn-tag{font-size:11px;border-radius:6px;background:#203448;padding:5px 8px;color:#c8d6e1}\n.tn-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:12px}.tn-log{padding:5px 13px 12px;max-height:240px;min-height:140px;overflow-y:auto}.tn-entry{padding:8px 0;border-bottom:1px solid #2a3b4a;color:#c9d5e0;font-size:12px;line-height:1.5}.tn-entry time{font-variant-numeric:tabular-nums;color:#c6a572;margin-right:7px}.tn-checks{display:flex;flex-wrap:wrap;gap:6px;padding:10px 12px}.tn-checks span{padding:6px 8px;border-radius:6px;font-size:11px;background:#203447;color:#b6cad7}.tn-checks .ok{color:#b5ecd1;background:#193c35}.tn-checks .warn{color:#f1d3a7;background:#4a3527}\n.tn-export{display:none;padding:12px}.tn-export.show{display:block}.tn-export textarea{resize:vertical;min-height:140px;width:100%;padding:8px;background:#08121c;border:1px solid #34495d;color:#dce5f3;border-radius:8px;font:11px ui-monospace,monospace}\n.tn-footer{font-size:11px;color:#8299ac;line-height:1.5;margin-top:12px}.tn-legend{display:flex;gap:12px;flex-wrap:wrap}.tn-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:3px}\n@media(max-width:840px){.tn-grid{grid-template-columns:1fr}.tn-side{display:grid;grid-template-columns:1fr 1fr}.tn-view{height:52vh;min-height:340px}.tn-head{align-items:start}}@media(max-width:520px){.tn-app{padding:7px}.tn-title{font-size:19px}.tn-side{grid-template-columns:1fr}.tn-toolbar button{font-size:12px;padding:7px 9px}.tn-view{min-height:300px;height:46vh}.tn-mapfoot{align-items:start}.tn-clock{font-size:17px}}\n.tn-vn{position:absolute;left:8px;right:8px;bottom:8px;background:rgba(7,16,28,.95);border:1px solid #6b86a0;border-radius:11px;padding:12px 13px;min-height:118px;cursor:pointer;touch-action:manipulation}.tn-vn-name{color:#f2d19f;font-weight:800;font-size:15px;margin-bottom:6px;display:flex;justify-content:space-between}.tn-vn-name small{color:#93adc2;font-weight:400;font-size:11px}.tn-vn-text{font-size:16px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere;min-height:52px}.tn-vn-text.narr{color:#b9c9d6;font-style:italic}.tn-vnbar{display:flex;gap:6px;flex-wrap:wrap;padding:8px 10px;border-top:1px solid #293a4c}.tn-vnbar button{flex:1;font-size:12px;padding:8px 6px}.tn-dim{position:absolute;inset:0;background:#050b14a8;pointer-events:none}.tn-input{width:100%;min-height:62px;resize:vertical;padding:8px;background:#08121c;border:1px solid #34495d;color:#e6eef7;border-radius:8px;font:inherit;font-size:13px}.tn-error{margin:0 0 10px;padding:10px 12px;border-radius:10px;background:#4a2b2b;border:1px solid #a45d5d;color:#ffdcd4;font-size:12px}.tn-sent{padding:10px 12px;color:#b8e4dc;font-size:12px}.tn-mono{font:11px ui-monospace,monospace;word-break:break-all;color:#cfe0ee}\n";
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
  function addLog(s,text,type='world',at=null) {
    const visible=type==='player'||!at||manhattan(s.player,at)<=5;
    s.logs.push({time:s.clock,text,type,visible});
    if(s.logs.length>100)s.logs.shift();
  }
  function createWorld(w,seed=246813579){
    const s={schema:'TROEMEREI_NPC_V1',version:1,worldId:w.map.id,day:1,clock:9*3600,
      rng:seed>>>0 || 1, player:{x:w.player.x,y:w.player.y,route:[],nextMoveAt:0},
      npcs:w.npcs.map((n,i)=>({id:n.id,x:n.x,y:n.y,mode:'idle',intent:null,route:[],
        nextMoveAt:9*3600+10+i*4,busyUntil:0,blockedSince:null,completed:[],
        excluded:[],lastTask:'',lastCompleted:{},queued:[],meetings:[],followOffset:0})),
      flags:{meeting_occurred:false,meeting_prevented:false,delivery_done:false},
      logs:[],revision:0,pend:null};
    addLog(s,'시뮬레이션이 시작되었다. NPC들은 각자의 일정에 따라 행동한다.','player');
    // Decisions exist from the first frame; the player can cancel a planned visit before movement.
    for(const n of s.npcs)decide(w,s,n);
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
    if(s.clock<secs(t.from||'00:00') ||s.clock>=secs(t.until||'23:59'))return false;
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
      }
    }
    if(task.onCompleteFlag)s.flags[task.onCompleteFlag]=true;
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
  function advance(w,state,seconds){
    const s=clone(state),end=s.clock+Math.max(0,Math.min(7200,Math.floor(seconds)));
    for(;s.clock<end;){
      s.clock++;
      if(s.player.route.length&&s.player.nextMoveAt<=s.clock)stepPlayer(w,s);
      for(const n of s.npcs){if(n.mode!=='accompany'&&n.nextMoveAt<=s.clock)npcStep(w,s,n);}
    }
    s.revision++;
    return s;
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
        n.excluded.push(n.intent.id);
        if(n.intent.onInterrupt)s.flags[n.intent.onInterrupt]=true;
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
      s.pend=n.id;player.route=[];player.nextMoveAt=0;
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
    s.player.route=[];s.player.nextMoveAt=0;s.pend=null;
    if(sec>0){addLog(s,(n?w.npcs.find(x=>x.id===n.id).name+'와(과) ':'')+'대화하며 '+sec+'초가 지났다.','player');s=advance(w,s,sec);}
    else s.revision++;
    return s;
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
  return {createWorld, advance, dispatch, applyTalk, route, walkable, clock, diagnostics, validate, clone};
})();

/* Troemerei 상태 압축 코덱 v1 — AI가 매 턴 그대로 복사하는 문자열을 최소화한다.
   상태 JSON(약 1,000자 이상) → base64url 약 100~150자. 끝 2바이트는 손상 검사용 체크섬.
   로그는 화면 표시용이라 저장하지 않는다. 경로·타이머·완료 기록은 그대로 보존해 결정성을 유지한다. */
const TroemereiCodec = (() => {
  const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const MODES = ['idle', 'moving', 'busy', 'paused', 'accompany'];
  const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  const VERSION = 1;

  function hash16(text) { let h = 0x811c9dc5; for (const ch of text) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return (h ^ (h >>> 16)) & 0xffff; }
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
    const m = { tasks, index: new Map(tasks.map((t, i) => [t.id, i])), flags: w.flagNames || [], hash: hash16(w.map.id + ':' + (w.version || 1)) };
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
  const getList = (r, m) => { const n = r.uint(), out = []; for (let i = 0; i < n; i++) out.push(m.tasks[r.uint()].id); return out; };

  function pack(w, s) {
    const m = meta(w), o = writer(), clock = s.clock;
    o.byte(VERSION); o.byte(m.hash & 255); o.byte(m.hash >> 8);
    o.uint(s.revision || 0); o.uint(s.day || 1); o.uint(clock); o.u32(s.rng >>> 0);
    const fb = Math.ceil(m.flags.length / 8);
    for (let i = 0; i < fb; i++) { let v = 0; for (let j = 0; j < 8; j++) if (s.flags[m.flags[i * 8 + j]]) v |= 1 << j; o.byte(v); }
    o.uint(s.pend ? s.npcs.findIndex(n => n.id === s.pend) + 1 : 0);
    o.byte(s.player.x); o.byte(s.player.y); putRoute(o, s.player, s.player.route); putTime(o, s.player.route.length ? s.player.nextMoveAt : 0, clock);
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
    if (r.byte() !== VERSION) throw Error('상태 코드 버전이 다릅니다');
    if ((r.byte() | r.byte() << 8) !== m.hash) throw Error('다른 맵의 상태 코드입니다');
    const s = { schema: 'TROEMEREI_NPC_V1', version: 1, worldId: w.map.id, logs: [] };
    s.revision = r.uint(); s.day = r.uint(); const clock = s.clock = r.uint(); s.rng = r.u32();
    s.flags = {}; const fb = Math.ceil(m.flags.length / 8);
    for (let i = 0; i < fb; i++) { const v = r.byte(); for (let j = 0; j < 8 && i * 8 + j < m.flags.length; j++) s.flags[m.flags[i * 8 + j]] = !!(v & (1 << j)); }
    const pend = r.uint();
    const px = r.byte(), py = r.byte();
    s.player = { x: px, y: py }; s.player.route = getRoute(r, s.player); s.player.nextMoveAt = getTime(r, clock);
    s.npcs = w.npcs.map(() => {
      const n = { x: r.byte(), y: r.byte() };
      n.mode = MODES[r.byte()]; if (!n.mode) throw Error('NPC 상태 값 오류');
      const it = r.uint(); n.intent = it ? JSON.parse(JSON.stringify(m.tasks[it - 1])) : null;
      n.route = getRoute(r, n); n.nextMoveAt = getTime(r, clock); n.busyUntil = getTime(r, clock);
      const bs = r.uint(); n.blockedSince = bs ? clock - (bs - 1) : null;
      n.completed = []; n.lastCompleted = {};
      const dn = r.uint(); for (let i = 0; i < dn; i++) { const id = m.tasks[r.uint()].id; n.completed.push(id); n.lastCompleted[id] = clock - r.uint(); }
      n.excluded = getList(r, m); n.queued = getList(r, m).map(id => JSON.parse(JSON.stringify(m.tasks[m.index.get(id)])));
      const lt = r.uint(); n.lastTask = lt ? m.tasks[lt - 1].id : '';
      n.meetings = []; n.followOffset = 0;
      return n;
    });
    w.npcs.forEach((spec, i) => { s.npcs[i] = { id: spec.id, ...s.npcs[i] }; });
    s.pend = pend ? s.npcs[pend - 1].id : null;
    if (!r.done()) throw Error('상태 코드 뒤에 알 수 없는 데이터가 있습니다');
    return s;
  }
  return { pack, unpack, hash16 };
})();

/* AI 대사 문자열 해석 + AI 인계 메시지 생성.
   대사 형식(d 속성): 줄 구분은 |, 인물 대사는 `이름:대사` 또는 `이름(표정):대사`, 서술은 `*서술`.
   색·속도·크기 같은 연출 기본값은 JSX가 가진다(AI가 매번 적지 않는다). */
const TroemereiTalk = (() => {
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
  // kind: T 대화, I 끼어들기, A 추리 제시, P 자유 행동
  function handoff({ kind, target = '', where = '', time = '', clues = [], cut = '', text = '', code }) {
    const head = ['TRM1', kind, target, cut ? 'cut=' + cut : ''].filter(Boolean).join(' ');
    const ctx = [time, where].filter(Boolean).join(' ');
    const lines = [head + (ctx ? ' | ' + ctx : '')];
    if (clues.length) lines.push('단서: ' + clues.join('·'));
    if (text) lines.push(text);
    lines.push('s=' + code);
    return lines.join('\n');
  }
  return { parse, partialSeconds, handoff };
})();

const TN_CELL = 38;
const TN_MODE = { idle: '대기', moving: '이동', busy: '행동 중', paused: '대화 후 대기', accompany: '동행 중' };
function tnArea(x, y) { return (TN_WORLD.map.areas.find(a => x >= a.x0 && x <= a.x1 && y >= a.y0 && y <= a.y1) || {}).name || '통로'; }
function tnName(id) { const d = TN_WORLD.npcs.find(v => v.id === id); return d ? d.name : id; }
function tnHM(n) { return TroemereiNPC.clock(n).slice(0, 5); }

// AI 출력 형식: <Troemerei s='상태코드' t='경과초' d='이름:대사|*서술|이름(표정):대사' />
function Troemerei({ s = '', t = '0', d = '' }) {
  const lines = useMemo(() => TroemereiTalk.parse(d), [d]);
  const sec = Math.max(0, Math.min(900, Math.floor(Number(t) || 0)));
  const [boot] = useState(() => {
    if (!s) return { base: TroemereiNPC.createWorld(TN_WORLD), error: '' };
    try { return { base: TroemereiCodec.unpack(TN_WORLD, s), error: '' }; }
    catch (e) { return { base: TroemereiNPC.createWorld(TN_WORLD), error: e.message }; }
  });
  const fresh = !s || !!boot.error;
  // 대사가 있으면 대사를 다 본 뒤에 시간을 반영하고, 없으면 바로 반영한다.
  const [state, setState] = useState(() => (!fresh && !lines.length) ? TroemereiNPC.applyTalk(TN_WORLD, boot.base, sec) : boot.base);
  const [talk, setTalk] = useState({ idx: 0, shown: 0, done: fresh || !lines.length, cut: false });
  const [selected, setSelected] = useState('companion');
  const [debug, setDebug] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panel, setPanel] = useState('');
  const [text, setText] = useState('');
  const [codeText, setCodeText] = useState('');
  const [notice, setNotice] = useState(boot.error ? '상태 코드를 읽지 못해 처음 상태로 시작했습니다. 아래 [상태 코드]에서 직전 코드를 붙여넣어 복원하세요.' : '');
  const [sent, setSent] = useState('');
  const drag = useRef(null), dragged = useRef(false);

  const line = !talk.done ? lines[talk.idx] : null;
  const chars = line ? Array.from(line.text) : [];
  const full = line ? talk.shown >= chars.length : true;
  const last = line && talk.idx === lines.length - 1;
  const inTalk = !!line;
  const locked = !!sent || inTalk;

  useEffect(() => {
    if (!line || talk.cut || full) return;
    const id = setInterval(() => setTalk(v => ({ ...v, shown: Math.min(chars.length, v.shown + 1) })), 32);
    return () => clearInterval(id);
  }, [talk.idx, talk.cut, full, chars.length]);

  // 시간은 행동할 때만 흐른다: 이동 경로가 남아 있는 동안만 한 칸씩 진행.
  useEffect(() => {
    if (locked || !state.player.route.length) return;
    const id = setTimeout(() => setState(v => TroemereiNPC.advance(TN_WORLD, v, TN_WORLD.player.moveSeconds || 4)), 170);
    return () => clearTimeout(id);
  }, [state, locked]);

  function act(a) { if (locked) return; setState(v => TroemereiNPC.dispatch(TN_WORLD, v, a)); }
  function nextLine() {
    if (!line || talk.cut) return;
    if (!full) { setTalk(v => ({ ...v, shown: chars.length })); return; }
    if (!last) setTalk(v => ({ ...v, idx: v.idx + 1, shown: 0 }));
  }
  function endTalk() { setState(TroemereiNPC.applyTalk(TN_WORLD, boot.base, sec)); setTalk(v => ({ ...v, done: true })); setNotice('대화를 마쳤습니다.'); }

  function send(kind, extra = {}) {
    const msg = text.trim();
    if (!msg && kind !== 'I') { setNotice('전달할 말이나 행동을 입력하세요.'); return; }
    if (!msg) { setNotice('끼어들 말을 입력하세요.'); return; }
    let next = state, target = '';
    if (kind === 'T') {
      next = TroemereiNPC.dispatch(TN_WORLD, state, { type: 'TALK_REQUEST', npcId: selected });
      if (next.pend !== selected) { setState(next); setNotice('지금은 이 인물과 대화할 수 없습니다.'); return; }
      target = tnName(selected);
    }
    if (kind === 'I') {
      const part = TroemereiTalk.partialSeconds(lines, talk.idx, talk.shown, sec);
      const pendId = boot.base.pend;
      next = TroemereiNPC.applyTalk(TN_WORLD, boot.base, part);
      if (pendId) next = { ...next, pend: pendId };
      target = pendId ? tnName(pendId) : '';
    }
    const code = TroemereiCodec.pack(TN_WORLD, next);
    const message = TroemereiTalk.handoff({ kind, target, cut: extra.cut || '', where: tnArea(next.player.x, next.player.y), time: tnHM(next.clock), text: msg, code });
    if (typeof sendMessage !== 'function') { setState(next); setSent(message); setNotice('이 환경에는 sendMessage()가 없어 전송 내용을 아래에 표시합니다.'); return; }
    try { sendMessage(message); setState(next); setSent(message); setNotice('AI에게 전달했습니다. 다음 화면에서 이어집니다.'); }
    catch (e) { setNotice('전송 실패: ' + e.message); }
  }
  function restore() {
    try { const v = TroemereiCodec.unpack(TN_WORLD, codeText.trim()); setState(TroemereiNPC.applyTalk(TN_WORLD, v, 0)); setTalk(x => ({ ...x, done: true })); setNotice('상태 코드를 복원했습니다.'); setPanel(''); }
    catch (e) { setNotice('복원 실패: ' + e.message); }
  }

  const npc = state.npcs.find(n => n.id === selected);
  const def = npc ? TN_WORLD.npcs.find(v => v.id === npc.id) : null;
  const dist = npc ? Math.abs(state.player.x - npc.x) + Math.abs(state.player.y - npc.y) : 99;
  const canTalk = npc && dist <= 1 && npc.mode !== 'busy';
  const canFollow = npc && dist <= 1 && npc.mode !== 'busy' && npc.mode !== 'accompany' && (!npc.intent || npc.intent.interruptible);
  const viewW = 18 * TN_CELL, viewH = 12 * TN_CELL;
  const camX = Math.max(0, Math.min(TN_WORLD.map.width * TN_CELL - viewW, state.player.x * TN_CELL - viewW / 2 + pan.x));
  const camY = Math.max(0, Math.min(TN_WORLD.map.height * TN_CELL - viewH, state.player.y * TN_CELL - viewH / 2 + pan.y));
  const logs = state.logs.filter(e => debug || e.visible).slice(-8).reverse();
  const speakerDef = line && !line.narration ? TN_WORLD.npcs.find(n => n.name === line.speaker) : null;
  const color = ['#27394b', '#334339', '#273d4c', '#314259'];
  const onDown = e => { drag.current = { x: e.clientX, y: e.clientY, pan, id: e.pointerId }; dragged.current = false; };
  const onMove = e => {
    if (!drag.current) return; const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y;
    if (!dragged.current && Math.abs(dx) + Math.abs(dy) > 6) { dragged.current = true; try { e.currentTarget.setPointerCapture(drag.current.id); } catch (err) { } }
    if (dragged.current) { const r = e.currentTarget.getBoundingClientRect(), k = viewW / (r.width || 1); setPan({ x: drag.current.pan.x - dx * k, y: drag.current.pan.y - dy * k }); }
  };
  const onUp = () => { drag.current = null; if (dragged.current) setTimeout(() => { dragged.current = false; }, 100); };

  return <div className="tn-app"><style>{TN_CSS}</style>
    <div className="tn-head"><div><div className="tn-title">몽환의 트로이메라이 · 시험판</div><div className="tn-subtitle">2D 탑다운 · 임시 인물/장소(본편 아님) · 행동할 때만 시간이 흐름</div></div><div className="tn-pill">TRM1 · v0.2</div></div>
    {boot.error ? <div className="tn-error">상태 코드 오류: {boot.error}</div> : null}
    <div className="tn-toolbar"><span className="tn-clock">{state.day}일차 {TroemereiNPC.clock(state.clock)}</span>
      <button disabled={locked} onClick={() => act({ type: 'WAIT', seconds: 60 })}>1분 대기</button>
      <button disabled={locked} onClick={() => act({ type: 'WAIT', seconds: 300 })}>5분 대기</button>
      <button disabled={locked} onClick={() => act({ type: 'CLEAR_ROUTE' })}>이동 중단</button>
      <button onClick={() => setPan({ x: 0, y: 0 })}>카메라 추적</button>
      <label className="tn-muted"><input type="checkbox" checked={debug} onChange={e => setDebug(e.target.checked)} /> 디버그</label>
    </div>
    <div className="tn-grid">
      <div className="tn-panel"><div className="tn-maphead"><span>지도 · {tnArea(state.player.x, state.player.y)}</span><span>타일 탭 이동 · 인물 선택 · 드래그</span></div>
        <div className="tn-view"><svg viewBox={`${camX} ${camY} ${viewW} ${viewH}`} preserveAspectRatio="xMidYMid meet" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          {TN_WORLD.map.rows.map((row, y) => row.split('').map((tile, x) => {
            const ix = TN_WORLD.map.areas.findIndex(a => x >= a.x0 && x <= a.x1 && y >= a.y0 && y <= a.y1);
            return <rect key={`t-${x}-${y}`} x={x * TN_CELL} y={y * TN_CELL} width={TN_CELL} height={TN_CELL} fill={tile === '#' ? '#111d2b' : color[Math.max(0, ix)]} stroke="#5f7585" strokeOpacity=".10" strokeWidth=".7" onClick={() => { if (!dragged.current) act({ type: 'MOVE_TO', x, y }); }} />;
          }))}
          {TN_WORLD.map.areas.map(a => <text key={a.name} x={(a.x0 + 1) * TN_CELL} y={(a.y0 + 0.7) * TN_CELL} fontSize="17" fill="#dae6ee" opacity=".23" pointerEvents="none">{a.name}</text>)}
          {TN_WORLD.map.landmarks.map(p => <g key={p.id} pointerEvents="none"><rect x={p.x * TN_CELL + 7} y={p.y * TN_CELL + 7} width={TN_CELL - 14} height={TN_CELL - 14} rx="5" fill="#e0bc78" opacity=".22" /><text x={(p.x + .5) * TN_CELL} y={(p.y + .62) * TN_CELL} fontSize="17" textAnchor="middle" fill="#eddbaf">{p.icon}</text></g>)}
          {state.player.route.length > 0 && <polyline points={[state.player, ...state.player.route].map(p => `${(p.x + .5) * TN_CELL},${(p.y + .5) * TN_CELL}`).join(' ')} fill="none" stroke="#f2d99e" strokeWidth="3" strokeDasharray="6 4" pointerEvents="none" />}
          {state.npcs.map(n => {
            const nd = TN_WORLD.npcs.find(v => v.id === n.id), cx = (n.x + .5) * TN_CELL, cy = (n.y + .5) * TN_CELL;
            return <g key={n.id} onClick={e => { e.stopPropagation(); if (!dragged.current) setSelected(n.id); }} style={{ cursor: 'pointer' }}>
              {selected === n.id && <circle cx={cx} cy={cy} r="21" fill="none" stroke="#f0d29a" strokeWidth="2" strokeDasharray="5 3" />}
              <circle cx={cx} cy={cy} r="15" fill={nd.color} stroke="#f4efdf" strokeWidth="1.7" />
              <text x={cx} y={cy + 4.5} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#14212c" pointerEvents="none">{nd.symbol}</text>
              {n.mode === 'accompany' && <circle cx={cx + 12} cy={cy - 13} r="5" fill="#f7d47c" pointerEvents="none" />}
            </g>;
          })}
          <g pointerEvents="none"><circle cx={(state.player.x + .5) * TN_CELL} cy={(state.player.y + .5) * TN_CELL} r="16" fill="#f6dfab" stroke="#1b2a39" strokeWidth="3" />
            <text x={(state.player.x + .5) * TN_CELL} y={(state.player.y + .62) * TN_CELL} fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1b2a39">나</text></g>
        </svg>
          {inTalk ? <><div className="tn-dim" /><div className="tn-vn" onClick={nextLine}>
            <div className="tn-vn-name"><span style={{ color: speakerDef ? speakerDef.color : '#f2d19f' }}>{line.narration ? '　' : line.speaker}{line.expression ? ' · ' + line.expression : ''}</span><small>{talk.idx + 1}/{lines.length}{talk.cut ? ' · 일시정지' : full ? ' ▼' : ''}</small></div>
            <div className={'tn-vn-text' + (line.narration ? ' narr' : '')}>{chars.slice(0, talk.shown).join('')}</div>
          </div></> : null}
        </div>
        {inTalk ? <div className="tn-vnbar">
          <button disabled={talk.idx < 1 || talk.cut} onClick={() => setTalk(v => ({ ...v, idx: v.idx - 1, shown: 0 }))}>‹ 이전</button>
          <button disabled={talk.cut} onClick={() => setTalk(v => ({ ...v, shown: 0 }))}>↺ 다시</button>
          {last && full ? <button className="tn-primary" disabled={talk.cut || !!sent} onClick={endTalk}>대화 종료</button>
            : <button disabled={talk.cut || !!sent} onClick={() => { setTalk(v => ({ ...v, cut: true })); setText(''); }}>끼어들기</button>}
          <button disabled={talk.cut || (last && full)} onClick={nextLine}>다음 ›</button>
        </div> : <div className="tn-mapfoot"><div><div className="tn-legend">{TN_WORLD.npcs.map(n => <span key={n.id}><i className="tn-dot" style={{ background: n.color }} />{n.name}</span>)}</div><div style={{ marginTop: 7 }}>({state.player.x},{state.player.y}) · 한 칸 {TN_WORLD.player.moveSeconds}초</div></div>
          <div className="tn-dir"><span /><button disabled={locked} onClick={() => act({ type: 'MOVE_ONE', dx: 0, dy: -1 })}>↑</button><span />
            <button disabled={locked} onClick={() => act({ type: 'MOVE_ONE', dx: -1, dy: 0 })}>←</button><button disabled={locked} onClick={() => act({ type: 'MOVE_ONE', dx: 0, dy: 1 })}>↓</button><button disabled={locked} onClick={() => act({ type: 'MOVE_ONE', dx: 1, dy: 0 })}>→</button></div></div>}
        {talk.cut && !sent ? <div style={{ padding: 10 }}><div className="tn-muted">여기서 끊습니다. 이 뒤의 대사는 말하지 않은 것으로 처리됩니다.</div>
          <textarea className="tn-input" value={text} onChange={e => setText(e.target.value.slice(0, 600))} placeholder="끼어들 말이나 행동" />
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}><button className="tn-primary" style={{ flex: 1 }} disabled={!text.trim()} onClick={() => send('I', { cut: `${talk.idx + 1}/${lines.length}:${talk.shown}` })}>AI에게 전달</button><button onClick={() => setTalk(v => ({ ...v, cut: false }))}>취소</button></div></div> : null}
      </div>
      <div className="tn-side">
        <div className="tn-panel"><div className="tn-cardhead">선택된 인물</div><div className="tn-inspector">
          {npc ? <><div className="tn-person"><div className="tn-avatar" style={{ background: def.color }}>{def.symbol}</div><div><div className="tn-person-name">{def.name}</div><div className="tn-muted">{tnArea(npc.x, npc.y)} · 거리 {dist}칸 · {TN_MODE[npc.mode] || npc.mode}</div></div></div>
            {debug ? <div className="tn-muted">목표: {npc.intent?.id || '없음'} · 남은 경로 {npc.route.length}칸 · 다음 갱신 {TroemereiNPC.clock(npc.nextMoveAt)}</div> : null}
            <div className="tn-actions">
              <button disabled={locked || !canTalk} onClick={() => { setPanel(panel === 'talk' ? '' : 'talk'); setText(''); }}>대화</button>
              <button disabled={locked || !canFollow} onClick={() => act({ type: 'ACCOMPANY', npcId: npc.id })}>동행 요청</button>
              <button disabled={locked || npc.mode !== 'accompany'} onClick={() => act({ type: 'RELEASE', npcId: npc.id })}>동행 종료</button>
              <button disabled={locked} onClick={() => setNotice(def.name + '을(를) 관찰했다. (0초)')}>관찰 0초</button>
            </div>
            {panel === 'talk' && !locked ? <div style={{ marginTop: 10 }}><textarea className="tn-input" value={text} onChange={e => setText(e.target.value.slice(0, 600))} placeholder={def.name + '에게 할 말이나 행동'} /><button className="tn-primary" style={{ width: '100%', marginTop: 6 }} disabled={!text.trim() || !canTalk} onClick={() => send('T')}>말 걸기 (AI 응답)</button></div> : null}
          </> : <div className="tn-muted">맵에서 인물을 선택하세요.</div>}
        </div></div>
        <div className="tn-panel"><div className="tn-cardhead">자유 행동 · 추리</div><div style={{ padding: 10 }}>
          {panel === 'free' && !locked ? <><textarea className="tn-input" value={text} onChange={e => setText(e.target.value.slice(0, 600))} placeholder="행동이나 추리를 자유롭게 입력" />
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}><button style={{ flex: 1 }} disabled={!text.trim()} onClick={() => send('P')}>행동 전달</button><button style={{ flex: 1 }} disabled={!text.trim()} onClick={() => send('A')}>추리 제시</button></div></>
            : <button disabled={locked} style={{ width: '100%' }} onClick={() => { setPanel('free'); setText(''); }}>입력 열기</button>}
        </div></div>
        <div className="tn-panel"><div className="tn-cardhead">기록</div>
          {debug ? <div className="tn-checks">{TN_WORLD.flagNames.map(f => <span key={f} className={state.flags[f] ? 'ok' : ''}>{f}: {state.flags[f] ? 'O' : '-'}</span>)}</div> : null}
          <div className="tn-log">{logs.length ? logs.map((e, i) => <div className="tn-entry" key={i}><time>{tnHM(e.time)}</time>{e.text}</div>) : <div className="tn-entry">이번 화면에서 새로 생긴 기록이 없습니다.</div>}</div>
        </div>
        <div className="tn-panel"><div className="tn-cardhead">상태 코드</div><div style={{ padding: 10 }}>
          {panel === 'code' || boot.error ? <><div className="tn-mono">{TroemereiCodec.pack(TN_WORLD, state)}</div>
            <textarea className="tn-input" style={{ marginTop: 6 }} value={codeText} onChange={e => setCodeText(e.target.value)} placeholder="복원할 상태 코드(s=뒤의 값)" />
            <button style={{ width: '100%', marginTop: 6 }} disabled={!!sent} onClick={restore}>이 코드로 복원</button></>
            : <button style={{ width: '100%' }} onClick={() => setPanel('code')}>보기 · 복원</button>}
        </div></div>
      </div>
    </div>
    {notice ? <div className="tn-muted" style={{ marginTop: 10 }}>{notice}</div> : null}
    {sent ? <div className="tn-panel" style={{ marginTop: 10 }}><div className="tn-sent">전송됨 — AI 응답의 새 화면에서 이어집니다. 이 화면은 잠겼습니다.</div>{typeof sendMessage !== 'function' ? <pre className="tn-mono" style={{ padding: '0 12px 12px', whiteSpace: 'pre-wrap' }}>{sent}</pre> : null}</div> : null}
    <div className="tn-footer">시험용 인물·장소이며 본편 설정이 아닙니다. 이동·NPC 일정·시간은 이 화면이 계산하고, AI는 대화가 필요할 때만 호출됩니다.</div>
  </div>;
}
