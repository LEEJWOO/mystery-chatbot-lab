// 360×540(2:3) 기준 화면. 폭이 다르면 비율을 유지한 채 통째로 확대·축소한다.
const TR_W = 360, TR_H = 540, TR_CELL = 36;
const TR_IMP = { idle: '한가해 보인다', moving: '어딘가 바빠 보인다', busy: '무언가에 집중하고 있다', paused: '이야기를 들어 주고 있다', accompany: '곁에서 함께 걷고 있다' };
const TR_BG = ['#25344a', '#2d3a30', '#283a4a', '#2c3550'];
const trNpc = id => TN_WORLD.npcs.find(n => n.id === id) || { name: id, color: '#999', symbol: '?' };
const trArea = (x, y) => { const i = TroemereiNPC.areaOf(TN_WORLD, x, y); return i < 0 ? '통로' : TN_WORLD.map.areas[i].name; };
const trHM = n => TroemereiNPC.clock(n).slice(0, 5);
const trFact = (id, role, who) => {
  const f = (TN_WORLD.facts || []).find(x => x.id === id); if (!f) return id;
  if (who === 'player' && role >= 2) { const src = TN_WORLD.npcs[role - 2]; return src ? src.name + '의 증언: ' + ((f.self || {})[src.id] || f.seen || id) : id; }
  if (who === 'player') return f.player || f.seen || id;
  return role === 0 ? ((f.self || {})[who] || f.seen || id) : (f.seen || id);
};
// 대상 기억은 코드로만 보낸다(채팅에 비밀이 그대로 보이지 않게). 내용은 같은 코드를 키워드로 켜지는 로어북 항목에 있다.
const trMemCode = (id, role) => TroemereiNPC.factCode(TN_WORLD, id) + (role === 0 ? '직' : role === 1 ? '목' : '들');
// 공지(매일 반복) 중 (from, to] 사이의 것들. [{t: 절대 시각, n: 공지}]
const trNotices = (from, to) => { const out = []; for (let d = Math.floor(from / 86400); d <= Math.floor(to / 86400); d++) for (const n of TN_WORLD.notices || []) { const t = d * 86400 + TroemereiNPC.absTime(n.time); if (t > from && t <= to) out.push({ t, n }); } return out.sort((a, b) => a.t - b.t); };
// 받침에 따라 조사 고르기(이/가, 을/를)
const trJosa = (w, a, b) => { const c = String(w).charCodeAt(String(w).length - 1) - 0xac00; return w + (c >= 0 && c < 11172 && c % 28 ? a : b); };
const trVisible = (s, n) => TroemereiNPC.sees(TN_WORLD, s.player, n);
const trChars = lines => lines.reduce((k, l) => k + Array.from(l.text).length, 0);

// ---------- 그림: 장소 배경 + 인물 레이어(몸 + 표정 조각) ----------
// 주소 표(TN_ASSETS)는 빌드할 때 끼워 넣는다. 파일 이름은 내용 해시라 이름만으로 무엇인지 알 수 없다.
const TR_A = typeof TN_ASSETS === 'object' && TN_ASSETS ? TN_ASSETS : {};
const trUrl = f => f ? (/^https?:/.test(f) ? f : (TR_A.url || '') + f) : '';
// AI가 쓴 표정 낱말 → 준비된 표정. 목록에 없으면 기본 표정.
const TR_SYN = { 웃음: ['웃', '미소', '기쁨', '기뻐', '즐거', '신나', '환하', '장난', '흐뭇', '반가'], 놀람: ['놀', '당황', '경악', '의아', '어리둥절', '깜짝', '멍', '걱정', '불안'], 불만: ['불만', '짜증', '삐', '언짢', '뾰로통', '찡그', '화', '못마땅', '부루퉁', '토라'], 평상시: ['평상', '무표정', '담담', '차분', '진지', '덤덤'] };
function trFace(c, expr) {
  if (!c) return '';
  const keys = Object.keys(c.faces || {}), e = String(expr || '');
  if (!e) return c.def || '';
  if (c.faces && c.faces[e]) return e;
  for (const k of [...keys, c.def || '']) if ((TR_SYN[k] || [k]).some(w => w && e.includes(w))) return k;
  return c.def || '';
}

const TR_STEP_MS = 180, TR_FRAME_MS = 90;
// 탐색 화면 인물: 스프라이트 묶음에서 방향(하·상·좌·우)과 걷기 단계에 맞는 칸을 고른다.
// 칸 번호는 주소 표의 sprites.dirs = {down:{idle, walk:[…]}, …}를 따른다(걷기 장수 자유). 우가 없으면 좌를 뒤집는다.
function trCharSprite(c, animRef, movedRef, sel, bad) {
  const now = Date.now(), A = animRef.current;
  const a = A[c.id] || (A[c.id] = { x: c.x, y: c.y, dir: 'down', step: 0, at: -1e9 });
  if (a.x !== c.x || a.y !== c.y) {
    const dx = c.x - a.x, dy = c.y - a.y;
    a.dir = Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
    a.step++; a.at = now; a.x = c.x; a.y = c.y;
  }
  const el = now - a.at, walking = el < TR_STEP_MS;
  if (el < TR_STEP_MS + TR_FRAME_MS) movedRef.current = true;
  const sp = TR_A.sprites, row = sp ? sp.ids.indexOf(c.id) : -1;
  const df = c.n ? trNpc(c.id) : { name: '나', color: '#f6dfab', symbol: '나' };
  const pos = { transform: `translate(${c.x * TR_CELL}px,${c.y * TR_CELL}px)` };
  const tag = c.n ? <div className="tr-tag" style={{ borderColor: df.color }}>{df.name}{c.n.mode === 'accompany' ? ' ★' : ''}</div> : null;
  if (!sp || row < 0 || bad[trUrl(sp.src)]) return <div key={c.id} className="tr-ch" style={pos}>
    <div className="tr-tok" style={{ background: df.color, outline: sel ? '2px dashed #f0d29a' : 'none' }}>{df.symbol}</div>{tag}</div>;
  const dirs = sp.dirs || {}, flip = a.dir === 'right' && !dirs.right, set = dirs[flip ? 'left' : a.dir] || dirs.down || { idle: 0, walk: [] };
  let col = set.idle;
  if (walking && set.walk && set.walk.length) {
    // 한 칸 이동 동안 걷기 그림을 (장수/2)장씩 넘긴다 → 두 칸에 한 주기.
    const per = Math.max(1, Math.ceil(set.walk.length / 2));
    col = set.walk[((a.step - 1) * per + Math.min(per - 1, Math.floor(el / (TR_STEP_MS / per)))) % set.walk.length];
  }
  return <div key={c.id} className="tr-ch" style={pos}>
    <div className={'tr-shadow' + (sel ? ' sel' : '')} />
    <div className="tr-px" style={{ position: 'absolute', left: (TR_CELL - sp.cw) / 2, bottom: 2, width: sp.cw, height: sp.ch, backgroundImage: `url(${trUrl(sp.src)})`, backgroundSize: `${sp.w}px ${sp.h}px`, backgroundPosition: `${-col * sp.cw}px ${-row * sp.ch}px`, transform: flip ? 'scaleX(-1)' : 'none' }} />
    {tag}</div>;
}

// ---------- 재판 대본 도우미 ----------
const trIdByName = name => name === '바쿠' ? 'baku' : name === '나' ? 'me' : ((TN_WORLD.npcs.find(n => n.name === name) || {}).id || '');
// 조건: talked·seen(인물 id), fact, scene, item, flag. not:{…}은 반대. 여러 키는 모두 만족해야 함
function trCond(st, c) {
  if (!c) return true; const p = st.player;
  if (c.not) return !trCond(st, c.not);
  if (c.talked && (p.talked || {})[c.talked] === undefined) return false;
  if (c.seen && !(p.seen || {})[c.seen]) return false;
  if (c.fact && !(p.mem || []).some(m => m[0] === c.fact)) return false;
  if (c.scene && (p.scenes || {})[c.scene] === undefined) return false;
  if (c.item && (p.items || {})[c.item] === undefined) return false;
  if (c.flag && !st.flags[c.flag]) return false;
  return true;
}
// 대본 한 줄 → {who, face, text, fx, speed, cut}. 문자열 '이름(표정):대사' / '*서술'도 받는다. alt는 앞에서부터 조건이 맞는 첫 변형.
function trLineOf(st, x) {
  if (typeof x === 'string') { const L = TroemereiTalk.parse(x)[0] || { text: x, narration: true }; return { who: L.narration ? '' : trIdByName(L.speaker), name: L.speaker, face: L.expression, text: L.text }; }
  const alt = (x.alt || []).find(a => trCond(st, a.if));
  return { ...x, ...(alt || {}), alt: undefined, if: undefined };
}
// 강조 표기: [[강조]] 붉게·굵게, <<크게>> 크고 금빛, ((속삭임)) 작고 흐리게
function trSegs(t) {
  const out = []; const re = /\[\[(.+?)\]\]|<<(.+?)>>|\(\((.+?)\)\)/g; let i = 0, m;
  while ((m = re.exec(t))) { if (m.index > i) out.push({ t: t.slice(i, m.index), c: '' }); out.push({ t: m[1] || m[2] || m[3], c: m[1] ? 'em' : m[2] ? 'big' : 'wh' }); i = re.lastIndex; }
  if (i < t.length) out.push({ t: t.slice(i), c: '' }); return out;
}
function trTyped(segs, n) {
  const out = []; let left = n;
  segs.forEach((g, i) => { if (left <= 0) return; const ch = Array.from(g.t), part = ch.slice(0, left).join(''); left -= ch.length; out.push(g.c ? <span key={i} className={'tr-' + g.c}>{part}</span> : <span key={i}>{part}</span>); });
  return out;
}
// 화면이 깨지는 조각(반론·모순 연출)
function trShards() {
  const pieces = [[0, 0, 50, 0, 35, 45], [50, 0, 100, 0, 70, 40], [100, 0, 100, 50, 70, 40], [0, 0, 35, 45, 0, 60], [35, 45, 70, 40, 55, 75], [70, 40, 100, 50, 100, 100], [0, 60, 35, 45, 55, 75], [0, 60, 55, 75, 0, 100], [55, 75, 100, 100, 0, 100], [70, 40, 55, 75, 100, 100]];
  return <div className="tr-shards">{pieces.map((q, i) => <i key={i} style={{ clipPath: `polygon(${q[0]}% ${q[1]}%,${q[2]}% ${q[3]}%,${q[4]}% ${q[5]}%)`, animationDelay: (i % 4) * 0.04 + 's', '--dx': ((q[0] + q[2] + q[4]) / 3 - 50) * 0.6 + 'px', '--dy': ((q[1] + q[3] + q[5]) / 3 - 50) * 0.6 + 'px' }} />)}
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="35,45 70,40 55,75 35,45 0,60 M70,40 100,50" fill="none" stroke="#fff" strokeWidth=".6" /><polyline points="35,45 50,0 M70,40 100,0 M55,75 100,100 M55,75 0,100" fill="none" stroke="#fff" strokeWidth=".6" /></svg></div>;
}

// 인물 레이어: 몸(기본 표정 포함) 위에 표정 조각을 같은 비율 좌표로 겹친다. 화면 아래 가운데 정렬.
function trSprite(c, face, onBad, bad) {
  const H = 528, W = Math.round(H * c.w / c.h), f = face && face !== c.def && (c.faces || {})[face];
  const pct = (a, b) => (a / b * 100) + '%';
  return <div style={{ position: 'absolute', bottom: 0, left: (TR_W - W) / 2, width: W, height: H }}>
    <img src={trUrl(c.src)} alt="" onError={() => onBad(trUrl(c.src))} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
    {f && !bad[trUrl(f.src)] ? <img src={trUrl(f.src)} alt="" onError={() => onBad(trUrl(f.src))} style={{ position: 'absolute', left: pct(f.x, c.w), top: pct(f.y, c.h), width: pct(f.w, c.w), height: pct(f.h, c.h) }} /> : null}
  </div>;
}

// AI 출력: <Troemerei s='상태코드' d='이름:대사|*서술' />  (자유 행동 P에만 t='초', 사건 코드는 e='…')
function Troemerei({ s = '', t = '', d = '', e = '', k = '', f = '' }) {
  const parsed = useMemo(() => TroemereiTalk.parse(d), [d]), lines = useMemo(() => TroemereiTalk.paginate(parsed), [parsed]);
  const free = !!String(f).trim();
  const [boot] = useState(() => {
    // 화면 밖 대화 응답(f)인데 상태 코드가 없으면 새 세계로 시작하지 않고 복원 화면을 띄운다.
    if (!s) return free ? { base: null, error: '화면 밖 대화의 응답에 상태 코드가 없습니다', ev: null } : { base: TroemereiNPC.createWorld(TN_WORLD), error: '', ev: null };
    try {
      let base = TroemereiCodec.unpack(TN_WORLD, s), ev = null, heard = null;
      // 화면 밖(UUMMAI 입력창) 대화의 응답: 시간·사건을 바꾸지 않고 마지막 전송 시점에서 이어진다.
      if (free) return { base: { ...TroemereiNPC.clone(base), pend: null, pk: '', pc: 0 }, error: '', ev: null, heard: null };
      // 사건 코드·증언은 화면이 조건을 검사한 뒤에만 상태에 반영한다(대화 시간 반영 전에 검사).
      if (e) { const r = TroemereiNPC.applyEvent(TN_WORLD, base, e); base = r.state; ev = { code: String(e), accepted: r.accepted, reason: r.reason }; }
      // 재판 반론(R)의 응답: 사건 코드가 인정되면 다음 단계(applyEvent가 처리), 아니면 재판 체력 -1. 재판 중에는 시간이 흐르지 않는다.
      if (base.pk === 'R') {
        let tres = 'ok';
        if (!(ev && ev.accepted)) { const h = TroemereiNPC.trialHit(TN_WORLD, base); base = h.state; tres = h.result; }
        return { base: TroemereiNPC.applyTalk(TN_WORLD, base, 0), error: '', ev, heard, rmode: true, tres };
      }
      return { base, error: '', ev, heard };
    } catch (err) { return { base: null, error: err.message, ev: null, heard: null }; }
  });
  const replySec = b => (b && b.pk === 'P' && String(t).trim() !== '') ? Math.max(0, Math.min(900, Math.floor(Number(t) || 0))) : TroemereiNPC.talkSeconds(b ? b.pc : 0, trChars(lines));
  const pendNpc = boot.base && boot.base.pend;
  const [state, setState] = useState(() => !boot.base ? null : boot.rmode ? boot.base : (s && !lines.length) ? TroemereiNPC.applyTalk(TN_WORLD, boot.base, replySec(boot.base)) : boot.base);
  const [talk, setTalk] = useState(() => boot.base && lines.length && !boot.rmode ? { npc: free ? null : pendNpc || null, idx: 0, shown: 0, cut: false, fresh: false } : null);
  // 받은 응답의 대화 시간을 이미 반영했는지(대사가 있으면 다 읽거나 끊을 때 반영).
  const [consumed, setConsumed] = useState(() => !lines.length || free || !!boot.rmode);
  // 재판 화면 상태(화면 안에서만 쓰는 값)
  const [tv, setTv] = useState(() => ({ reply: !!boot.rmode && lines.length > 0, idx: 0, shown: 0, stmt: 0, drawer: false, vote: '', ev: '', fx: boot.rmode && !lines.length ? boot.tres : '', voted: false, g: {} }));
  const [trText, setTrText] = useState('');
  // 재판 대사 타자 효과(대사별 속도)
  const typeRef = useRef(null);
  useEffect(() => { const L = typeRef.current; if (!L || tv.shown >= L.len) return; const id = setTimeout(() => setTv(v => ({ ...v, shown: v.shown + 1 })), L.ms); return () => clearTimeout(id); });
  const [menu, setMenu] = useState(null);
  const [preview, setPreview] = useState(null);
  const [sheet, setSheet] = useState('');
  const [drop, setDrop] = useState(false);
  const [text, setText] = useState('');
  const [codeText, setCodeText] = useState('');
  const [toast, setToast] = useState(() => {
    if (!boot.base) return '';
    if (free) return '화면 밖 대화 · ' + trHM(boot.base.clock) + ' 시점에서 이어집니다';
    if (boot.ev && boot.ev.accepted) return (boot.base.logs.slice(-1)[0] || {}).text || '';
    return s && !lines.length && boot.base.pk ? '응답을 반영했습니다' : '';
  });
  const [manual, setManual] = useState('');
  const [debug, setDebug] = useState(false);
  const [sent, setSent] = useState('');
  const [scale, setScale] = useState(1);
  const [badImg, setBadImg] = useState({}); // 불러오지 못한 그림은 임시 그림으로 대체
  const outRef = useRef(null), padRef = useRef(null), svgRef = useRef(null), farRef = useRef([0, 0]), heardRef = useRef(null);
  // 걷기 연출: 인물별 직전 칸·방향·걸음 수. 칸이 바뀌면 그쪽을 보고 한 걸음 걷는다(우는 좌 그림을 뒤집음).
  const animRef = useRef({}), movedRef = useRef(false), roomRef = useRef(-1);
  const [wokeBy, setWokeBy] = useState(''), [pick, setPick] = useState(null), [found, setFound] = useState(null), [restH, setRestH] = useState(-1), [restM, setRestM] = useState(0);
  const [, setTick] = useState(0);
  // 걷는 인물이 있으면 걷기 칸이 넘어가도록 짧게 다시 그린다(걸음이 끝나면 멈춤).
  useEffect(() => { if (!movedRef.current) return; movedRef.current = false; const id = setTimeout(() => setTick(v => v + 1), TR_FRAME_MS); return () => clearTimeout(id); });

  useEffect(() => {
    // 높이 기준은 화면(screen) 크기로 잡는다. UUMMAI는 컴포넌트를 내용 높이에 맞춘 iframe에 넣으므로
    // innerHeight를 쓰면 '작아짐→iframe 작아짐→더 작아짐' 순환이 생긴다(v0.4 PC·모바일 축소 원인).
    let lastW = -1;
    const fit = () => { const el = outRef.current; if (!el) return; const w = el.getBoundingClientRect().width || TR_W; if (Math.abs(w - lastW) < 1) return; lastW = w;
      const sh = (typeof screen !== 'undefined' && screen.availHeight) || 0; const h = sh > 300 ? sh - 200 : 99999;
      setScale(Math.max(0.6, Math.min(1.6, w / TR_W, h / TR_H))); };
    fit();
    if (typeof ResizeObserver === 'function' && outRef.current) { const ro = new ResizeObserver(fit); ro.observe(outRef.current); return () => ro.disconnect(); }
    if (typeof window !== 'undefined') { window.addEventListener('resize', fit); return () => window.removeEventListener('resize', fit); }
  }, []);
  typeRef.current = null; // 재판 화면이 그려질 때만 다시 채운다
  const line = talk && !talk.fresh && !talk.done ? lines[talk.idx] : null;
  const chars = line ? Array.from(line.text) : [];
  const full = !line || talk.shown >= chars.length;
  const lastLine = !!line && talk.idx === lines.length - 1;
  const canInput = talk && !sent && (talk.fresh || talk.cut || (lastLine && full) || talk.done);
  // 되감아 다시 읽어도 '이미 말해진 위치'는 줄지 않는다(끼어들기 시간·cut 기준).
  if (line) { const [fi, fs] = farRef.current; if (talk.idx > fi || (talk.idx === fi && talk.shown > fs)) farRef.current = [talk.idx, talk.shown]; }
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
      let next = TroemereiNPC.advance(TN_WORLD, state, TN_WORLD.player.moveSeconds || 4);
      const fresh = next.npcs.filter(n => trVisible(next, n) && !before.has(n.id));
      if (fresh.length && next.player.route.length) { next = TroemereiNPC.dispatch(TN_WORLD, next, { type: 'CLEAR_ROUTE' }); setToast(fresh.map(n => trNpc(n.id).name).join('·') + '이(가) 보여 멈췄다'); }
      setState(next);
    }, 160);
    return () => clearTimeout(id);
  }, [state, sent, talk]);

  if (!state) return <div className="tr-out" ref={outRef} style={{ height: TR_H * scale }}><style>{TN_CSS}</style><div className="tr-card" style={{ transform: `scale(${scale})` }}>
    <div className="tr-err"><b>상태 코드를 읽을 수 없습니다</b><div className="tr-mut">{boot.error}</div>
      <div>직전 인계 메시지의 <b>s=</b> 뒤 값을 붙여넣으면 이어서 진행할 수 있습니다.</div>
      <textarea className="tr-ta" rows={4} value={codeText} onChange={e => setCodeText(e.target.value)} />
      <button style={{ height: 34 }} onClick={() => { try { const v = TroemereiCodec.unpack(TN_WORLD, codeText.trim()); setState(TroemereiNPC.applyTalk(TN_WORLD, v, 0)); } catch (e) { setToast(e.message); } }}>이 코드로 복원</button>
      <button style={{ height: 34 }} onClick={() => setState(TroemereiNPC.createWorld(TN_WORLD))}>처음부터 시작</button>
      {toast ? <div className="tr-mut">{toast}</div> : null}</div></div></div>;

  const p = state.player, area = TroemereiNPC.areaOf(TN_WORLD, p.x, p.y);
  // 방 하나 = 한 화면. 문 칸(통로)에 서 있으면 직전 방을 계속 보여 준다. 계산은 층 전체 격자 그대로.
  let room = area >= 0 ? area : roomRef.current; if (room < 0) room = 0;
  const roomChanged = roomRef.current >= 0 && roomRef.current !== room; roomRef.current = room;
  const RM = TN_WORLD.map.areas[room], rx0 = (RM.x0 - 1) * TR_CELL, ry0 = (RM.y0 - 1) * TR_CELL, rx1 = (RM.x1 + 2) * TR_CELL, ry1 = (RM.y1 + 2) * TR_CELL;
  const HUD_H = 56, fitAxis = (lo, hi, view, c, off) => hi - lo <= view ? lo - (view - (hi - lo)) / 2 - off : Math.max(lo - off, Math.min(hi - view, c - view / 2));
  const camX = fitAxis(rx0, rx1, TR_W, (p.x + .5) * TR_CELL, 0);
  const camY = fitAxis(ry0, ry1, TR_H - HUD_H, (p.y + .5) * TR_CELL + 20, HUD_H);
  const inRoom = (x, y) => x >= RM.x0 - 1 && x <= RM.x1 + 1 && y >= RM.y0 - 1 && y <= RM.y1 + 1;
  const busy = !!sent;

  function act(a) { if (busy) return; setState(v => TroemereiNPC.dispatch(TN_WORLD, v, a)); }
  function step(dx, dy) {
    setPreview(null); setMenu(null);
    setState(v => { if (v.player.route.length) return v; const a = TroemereiNPC.dispatch(TN_WORLD, v, { type: 'MOVE_ONE', dx, dy }); return a.player.route.length ? TroemereiNPC.advance(TN_WORLD, a, TN_WORLD.player.moveSeconds || 4) : a; });
  }
  function padDown(dx, dy) { if (busy) return; step(dx, dy); clearInterval(padRef.current); padRef.current = setInterval(() => step(dx, dy), 240); }
  function padUp() { clearInterval(padRef.current); padRef.current = null; }

  function tapMap(e) {
    if (busy) return;
    const r = svgRef.current.getBoundingClientRect();
    const x = Math.floor((camX + (e.clientX - r.left) * TR_W / r.width) / TR_CELL), y = Math.floor((camY + (e.clientY - r.top) * TR_H / r.height) / TR_CELL);
    // 인물 그림은 1.5칸 높이라 머리 쪽(한 칸 위)을 눌러도 그 인물로 본다.
    const who = state.npcs.find(n => n.x === x && (n.y === y || n.y === y + 1) && (debug || trVisible(state, n)));
    if (who) { setPreview(null); setMenu({ kind: 'npc', id: who.id }); return; }
    const lm = TN_WORLD.map.landmarks.find(l => (l.x === x && l.y === y || (l.hit || []).some(h => h[0] === x && h[1] === y)) && TroemereiNPC.areaOf(TN_WORLD, l.x, l.y) === room);
    if (lm) { setPreview(null); setMenu({ kind: 'lm', id: lm.id }); return; }
    setMenu(null);
    if (!TroemereiNPC.walkable(TN_WORLD, x, y)) { setPreview(null); return; }
    const ta = TroemereiNPC.areaOf(TN_WORLD, x, y);
    if (ta !== room && !(ta < 0 && inRoom(x, y))) { setPreview(null); return; }
    if (preview && preview.x === x && preview.y === y) { setPreview(null); act({ type: 'MOVE_TO', x, y }); return; }
    const path = TroemereiNPC.route(TN_WORLD, state, p, { x, y }, { ignorePlayer: true });
    if (!path.length) { setPreview(null); return; }
    setPreview({ x, y, path, sec: path.length * (TN_WORLD.player.moveSeconds || 4) });
  }

  function npcContext(next, id) {
    const n = next.npcs.find(v => v.id === id), name = trNpc(id).name;
    const mem = (n.mem || []).slice(-5).map(m => trHM(m[2]) + ' ' + trMemCode(m[0], m[1]));
    return [name + ' 상태: ' + TroemereiNPC.describe(TN_WORLD, next, n), mem.length ? name + ' 기억: ' + mem.join(' / ') : ''];
  }
  // 추리(A)·자유 행동(P): 지금 같은 방에서 보이는 사람과 그들이 하던 일(대상이 없으므로 현장 인물을 알려 준다)
  function presentLine(next) { const v = next.npcs.filter(n => trVisible(next, n)); return '함께 있는 사람: ' + (v.length ? v.map(n => trNpc(n.id).name + '(' + TroemereiNPC.describe(TN_WORLD, next, n) + ')').join(', ') : '없음'); }
  function clueLine(next) { const c = (next.player.mem || []).slice(-6).map(m => trFact(m[0], m[1], 'player')); return c.length ? '내 단서: ' + c.join(' / ') : ''; }
  function applyReply(kind) {
    if (!lines.length || consumed) return state;
    const full = replySec(boot.base);
    const [fi, fs] = farRef.current;
    // 증언(k)은 그 줄을 실제로 끝까지 들은 경우에만 단서가 된다(끼어들어 끊으면 뒤쪽 증언은 무효).
    let base = boot.base;
    if (k) {
      const [os, oc] = TroemereiTalk.origPos(lines, fi, fs), heardAll = kind !== 'I';
      const items = TroemereiNPC.parseK(k).map(x => ({ ...x, at: x.line ? Math.min(parsed.length, x.line) - 1 : parsed.length - 1 }));
      const ok = items.filter(x => heardAll || x.at < os || (x.at === os && oc >= Array.from((parsed[os] || { text: '' }).text).length));
      const r = TroemereiNPC.hearFacts(TN_WORLD, base, ok);
      base = r.state; heardRef.current = { raw: String(k), accepted: r.accepted, rejected: [...r.rejected, ...items.filter(x => !ok.includes(x)).map(x => [x.code, '끊겨서 못 들음'])] };
    }
    return TroemereiNPC.applyTalk(TN_WORLD, base, kind === 'I' ? TroemereiTalk.partialSeconds(lines, fi, fs, boot.base.pc) : full);
  }
  function send(kind, opt) {
    const msg = (opt && opt.text) || text.trim(); if (!msg || busy) return;
    const chars = Array.from(msg).length;
    let next = applyReply(kind), target = '', ctx = [], cut = '';
    if (kind === 'I') { const [os, oc] = TroemereiTalk.origPos(lines, farRef.current[0], farRef.current[1]); cut = `${os + 1}/${parsed.length}:${oc}`; }
    const id = (opt && opt.npc) || ((kind === 'T' || kind === 'I') && talk ? talk.npc : null);
    if (id) {
      next = TroemereiNPC.dispatch(TN_WORLD, next, { type: 'TALK_REQUEST', npcId: id, kind, chars });
      if (next.pend !== id) { setToast('지금은 말을 걸 수 없습니다'); return; }
      target = trNpc(id).name; ctx = [...npcContext(next, id), opt && opt.situation, clueLine(next)];
    } else {
      next = { ...TroemereiNPC.clone(next), pk: kind === 'T' ? 'P' : kind, pc: chars, pend: null };
      ctx = [presentLine(next), clueLine(next)];
    }
    const code = TroemereiCodec.pack(TN_WORLD, next);
    const message = TroemereiTalk.handoff({ kind: id ? kind : (kind === 'T' ? 'P' : kind), target, cut, where: trArea(next.player.x, next.player.y), time: next.day + '일 ' + trHM(next.clock), marks: TroemereiNPC.markers(TN_WORLD, next), ctx, text: msg, code });
    // 전송 함수가 없으면 보낼 문장을 직접 보여 준다. 실패하면(비동기 포함) 잠금을 풀고 원래 상태로 돌린다.
    if (typeof sendMessage !== 'function') { setManual(message); return; }
    const prev = { state, consumed };
    const fail = err => { setState(prev.state); setConsumed(prev.consumed); setSent(''); setToast('전송 실패: ' + ((err && err.message) || '알 수 없는 오류') + ' · 다시 보내 주세요'); };
    try {
      const r = sendMessage(message);
      setState(next); setConsumed(true); setSent(message); setText(''); setDrop(false);
      if (r && typeof r.then === 'function') r.then(v => { if (v === false) fail(); }, fail);
    } catch (e) { fail(e); }
  }
  function heardToast() { const h = heardRef.current; if (h && h.accepted.length) setToast('단서 추가: ' + trNpc(boot.base.pend).name + '의 증언 ' + h.accepted.length + '건'); }
  function endTalk() {
    if (!consumed) { const nx = applyReply('T'); setState(nx); setConsumed(true); heardToast(); }
    setTalk(null); setText(''); setDrop(false);
  }
  function talkAction(type) {
    let next = applyReply(talk.cut ? 'I' : 'T'); setConsumed(true); heardToast();
    if (type === 'LOOK') { setState(next); setTalk(v => ({ ...v, done: true })); setToast(trNpc(talk.npc).name + ' · ' + TR_IMP[next.npcs.find(n => n.id === talk.npc).mode]); setDrop(false); return; }
    next = TroemereiNPC.dispatch(TN_WORLD, next, { type, npcId: talk.npc });
    setState(next); setTalk(null); setDrop(false); setToast((next.logs[next.logs.length - 1] || {}).text || '');
  }
  // 시간 건너뛰기: 공지 시각, 새로 보이는 인물, 보이는 사건 기록에서 멈춘다.
  function skipTo(target) {
    if (busy) return;
    const start = TroemereiNPC.dispatch(TN_WORLD, state, { type: 'CLEAR_ROUTE' });
    const note = trNotices(start.clock, target)[0], end = note ? note.t : target;
    // 지나가는 사람(이동 중)은 무시하고, 누군가 내 곁(1칸)에 멈춰 서면 멈춘다.
    const near = x => x.npcs.filter(n => n.mode !== 'accompany' && n.mode !== 'moving' && Math.abs(n.x - x.player.x) + Math.abs(n.y - x.player.y) <= 1 && trVisible(x, n)).map(n => n.id);
    const seen0 = new Set(near(start));
    const r = TroemereiNPC.advanceUntil(TN_WORLD, start, end - start.clock, x => near(x).some(id => !seen0.has(id)) || x.logs.some(l => l.visible && (l.type === 'world' || l.type === 'call') && l.time > start.clock));
    const s2 = r.state, who = near(s2).filter(id => !seen0.has(id)).map(id => trNpc(id).name);
    const lg = s2.logs.filter(l => l.visible && l.type === 'world' && l.time > start.clock).slice(-1)[0];
    setState(s2); setSheet(''); setPreview(null); setMenu(null);
    const cl = TroemereiNPC.caller(TN_WORLD, s2); setWokeBy(r.stopped && cl ? cl.id : '');
    setToast(r.stopped ? (who.length ? trJosa(who.join('·'), '이', '가') + ' 다가와서 쉬던 것을 멈췄다' : lg ? lg.text : '무슨 일이 생겨 멈췄다') : note ? '공지 · ' + trHM(note.t) + ' ' + note.n.text + (note.n.place ? ' (' + note.n.place + ')' : '') : TroemereiNPC.clock(s2.clock).slice(0, 5) + '까지 쉬었다');
  }
  // ---------- 재판 ----------
  // ---------- 재판 ----------
  const resetTv = { idx: 0, shown: 0, stmt: 0, drawer: false, vote: '', ev: '', voted: false, g: {} };
  function trialWrong() { const h = TroemereiNPC.trialHit(TN_WORLD, state); setState(h.state); setTv(v => ({ ...v, drawer: false, fx: h.result })); if (h.result === 'hit') setTimeout(() => setTv(v => ({ ...v, fx: v.fx === 'hit' ? '' : v.fx })), 800); }
  // 정답: 도장(+모순이면 화면 깨짐) → 다음 단계
  function trialRight(label, wait) { setTv(v => ({ ...v, drawer: false, fx: label || 'ok' })); setTimeout(() => { setState(v => TroemereiNPC.trialStep(TN_WORLD, v, 'NEXT')); setTv(v => ({ ...v, ...resetTv, fx: '' })); }, wait || 1100); }
  function trialNext() { setState(v => TroemereiNPC.trialStep(TN_WORLD, v, 'NEXT')); setTv(v => ({ ...v, ...resetTv })); }
  function sendRebut(ph) {
    const msg = trText.trim(); if (!msg || busy) return;
    const it = (TN_WORLD.items || []).find(x => x.id === tv.ev), npc = trNpc(ph.npc), TR = TN_WORLD.trials[state.trial.i];
    const next = { ...TroemereiNPC.clone(state), pend: ph.npc, pk: 'R', pc: Array.from(msg).length };
    const ctx = ['재판: ' + TR.title + ' · 반론 상대 ' + npc.name, npc.name + '의 주장: ' + ph.claim, '제시한 증거: ' + (it ? it.name + '(' + it.desc + ')' : '없음'), clueLine(next)];
    const message = TroemereiTalk.handoff({ kind: 'R', target: npc.name, where: '재판장', time: next.day + '일 ' + trHM(next.clock), marks: TroemereiNPC.markers(TN_WORLD, next), ctx, text: msg, code: TroemereiCodec.pack(TN_WORLD, next) });
    if (typeof sendMessage !== 'function') { setManual(message); return; }
    try { const r = sendMessage(message); setSent(message); setTrText(''); if (r && typeof r.then === 'function') r.then(v => { if (v === false) setSent(''); }, () => { setSent(''); setToast('전송 실패 · 다시 보내 주세요'); }); }
    catch (err) { setToast('전송 실패: ' + err.message); }
  }
  function trTrialScreen() {
    const T = state.trial, TR = TN_WORLD.trials[T.i], ph = TR.phases[T.phase] || { type: 'talk', lines: [] };
    const evid = (TR.evidence || []).filter(id => (state.player.items || {})[id] !== undefined).map(id => TN_WORLD.items.find(x => x.id === id));
    // 대사 줄: 대본(조건부 변형 alt) 또는 AI 반론 응답
    let cur = null, total = 0, onEnd = null;
    if (tv.reply && lines.length) {
      const L = lines[Math.min(tv.idx, lines.length - 1)]; total = lines.length;
      cur = { who: L.narration ? '' : trIdByName(L.speaker), name: L.speaker, face: L.expression, text: L.text };
      onEnd = () => { setTv(v => ({ ...v, reply: false, ...resetTv, fx: boot.tres || '' })); if (boot.tres === 'hit' || boot.tres === 'ok') setTimeout(() => setTv(v => ({ ...v, fx: v.fx === boot.tres ? '' : v.fx })), 1000); };
    } else if (ph.type === 'talk') {
      const all = ph.lines.map(x => trLineOf(state, x)); total = all.length; cur = all[Math.min(tv.idx, total - 1)]; onEnd = trialNext;
    }
    const segs = cur ? trSegs(cur.text) : [], len = segs.reduce((n, g) => n + Array.from(g.t).length, 0), done = tv.shown >= len;
    typeRef.current = cur && !sent ? { len, ms: Math.round(30 / (cur.speed || 1)) } : null;
    const tapLine = () => { if (!cur) return; if (!done) { setTv(v => ({ ...v, shown: len })); return; } if (tv.idx + 1 < total) setTv(v => ({ ...v, idx: v.idx + 1, shown: 0 })); else onEnd && onEnd(); };
    const issues = TR.issues || [], solvedUntil = id => { let last = -1; TR.phases.forEach((p, i) => { if (p.issue === id) last = i; }); return last; };
    const issueOf = TR.phases.slice(0, T.phase + 1).reduce((a, p) => p.issue || a, '');
    const stageFx = cur && cur.fx ? cur.fx : '', mini = !cur && ph.type !== 'trans';
    const speakerId = cur ? cur.who : (ph.type === 'debate' ? ph.lines[tv.stmt].who : ph.type === 'rebut' ? ph.npc : '');
    let body = null;
    if (sent) body = <div className="tr-tcard"><div className="tr-mut">반론을 전달했습니다. 상대의 대답이 새 화면에서 이어집니다.</div></div>;
    else if (cur) body = <div className="tr-tbox2" onClick={tapLine}>
      <div className="tr-name"><b style={{ color: cur.who && cur.who !== 'baku' ? trNpc(cur.who).color : '#e9c98c' }}>{cur.who === 'baku' ? '바쿠' : cur.who === 'me' ? '나' : cur.who ? (cur.name || trNpc(cur.who).name) : ''}</b><span>{tv.idx + 1}/{total}{done ? ' ▼' : ''}</span></div>
      <div className={'tr-ttext' + (cur.who ? '' : ' narr')}>{trTyped(segs, tv.shown)}</div></div>;
    else if (ph.type === 'trans') {
      const k = issues.findIndex(x => x.id === ph.issue);
      body = <div className="tr-trans" onClick={trialNext}><div className="tr-trans-n">{ph.text}</div><div className="tr-trans-q">{(issues[k] || {}).q}</div><div className="tr-mut">눌러서 계속</div></div>;
    } else if (ph.type === 'debate') {
      const st = ph.lines[tv.stmt], c = trNpc(st.who);
      body = <div className="tr-debate">
        <div className="tr-mut" style={{ textAlign: 'center' }}>{ph.title} · 모순되는 증언에 증거를 내민다</div>
        <div key={tv.stmt} className="tr-stmt"><div className="tr-tpor sm">{trPortrait(st.who, 64, 80)}</div><div><b style={{ color: c.color }}>{c.name}</b><div className="tr-ttext">「{st.text}」</div></div></div>
        <div className="tr-dots">{ph.lines.map((_, i) => <i key={i} className={i === tv.stmt ? 'on' : ''} />)}</div>
        <div style={{ display: 'flex', gap: 5 }}><button className="tr-tbtn" onClick={() => setTv(v => ({ ...v, stmt: (v.stmt + ph.lines.length - 1) % ph.lines.length, drawer: false }))}>‹ 이전</button>
          <button className="tr-tbtn gold" style={{ flex: 2 }} onClick={() => setTv(v => ({ ...v, drawer: !v.drawer }))}>이 증언에 증거 제시</button>
          <button className="tr-tbtn" onClick={() => setTv(v => ({ ...v, stmt: (v.stmt + 1) % ph.lines.length, drawer: false }))}>다음 ›</button></div>
        {tv.drawer ? <div className="tr-drawer">{evid.map(it => <button key={it.id} className="tr-evi" onClick={() => (st.answer === it.id ? trialRight('모순!', 1400) : trialWrong())}><b>{it.name}</b><span>{it.desc}</span></button>)}</div> : null}
      </div>;
    } else if (ph.type === 'rebut') {
      const c = trNpc(ph.npc);
      body = <div className="tr-debate">
        <div className="tr-mut" style={{ textAlign: 'center' }}>반론 · 내 말로 맞선다</div>
        <div className="tr-stmt rebut"><div className="tr-tpor sm">{trPortrait(ph.npc, 64, 80)}</div><div><b style={{ color: c.color }}>{c.name}</b><div className="tr-ttext">「{ph.claim}」</div></div></div>
        <div className="tr-chips">{evid.map(it => <button key={it.id} className={tv.ev === it.id ? 'on' : ''} onClick={() => setTv(v => ({ ...v, ev: v.ev === it.id ? '' : it.id }))}>{it.name}</button>)}</div>
        <textarea className="tr-ta" rows={3} value={trText} placeholder={c.name + '의 주장에 반론한다 (증거는 위에서 골라 함께 제시)'} onChange={e => setTrText(e.target.value.slice(0, 400))} />
        <button className="tr-tbtn gold" disabled={!trText.trim() || busy} onClick={() => sendRebut(ph)}>반론하기</button></div>;
    } else if (ph.type === 'pairs') {
      // 엇갈린 증언: 여러 사람의 증언에서 서로 부딪치는 두 문장(다른 사람끼리)을 고른다
      const g = tv.g, wi = g.w === undefined ? 0 : g.w, sel = g.sel || [], W0 = ph.witnesses[wi];
      const has = (a, b) => sel.some(x => x[0] === a && x[1] === b);
      const tap = (a, b) => setTv(v => { const cs = v.g.sel || []; const on = cs.some(x => x[0] === a && x[1] === b); const ns = on ? cs.filter(x => !(x[0] === a && x[1] === b)) : [...cs.filter(x => x[0] !== a), [a, b]].slice(-2); return { ...v, g: { ...v.g, sel: ns } }; });
      const ok = sel.length === 2 && (ph.answers || [ph.answer]).some(ans => ans.every(a => sel.some(x => x[0] === a[0] && x[1] === a[1])));  // 정답 짝이 여럿일 수 있다
      body = <div className="tr-debate"><div className="tr-mut" style={{ textAlign: 'center' }}>{ph.title} · {ph.guide}</div>
        <div className="tr-wtabs">{ph.witnesses.map((x, i) => <button key={i} className={(i === wi ? 'on' : '') + (sel.some(s2 => s2[0] === i) ? ' mark' : '')} onClick={() => setTv(v => ({ ...v, g: { ...v.g, w: i } }))}>{trPortrait(x.who, 34, 40)}<span>{trNpc(x.who).name}</span></button>)}</div>
        <div key={wi} className="tr-col" style={{ animation: 'trin .25s' }}>{W0.parts.map((t, i) => <button key={i} className={'tr-part' + (has(wi, i) ? ' on' : '')} onClick={() => tap(wi, i)}>「{t}」</button>)}</div>
        <div className="tr-picked">{sel.length ? sel.map((x, i) => <span key={i}>{trNpc(ph.witnesses[x[0]].who).name} 「{ph.witnesses[x[0]].parts[x[1]]}」</span>) : <span className="tr-mut">다른 두 사람의 문장을 하나씩 고른다</span>}</div>
        <button className="tr-tbtn gold" disabled={sel.length < 2} onClick={() => (ok ? trialRight('모순!', 1400) : (setTv(v => ({ ...v, g: { ...v.g, sel: [] } })), trialWrong()))}>이 두 문장이 부딪친다</button></div>;
    } else if (ph.type === 'combine') {
      const g = tv.g, sel = g.sel || [], got = g.got || [];
      const tap = (d, i) => setTv(v => { const cs = v.g.sel || []; const on = cs.some(x => x[0] === d && x[1] === i); return { ...v, g: { ...v.g, sel: on ? cs.filter(x => !(x[0] === d && x[1] === i)) : [...cs.filter(x => x[0] !== d), [d, i]].slice(-2) } }; });
      const same = (a, b) => a[0] === b[0] && a[1] === b[1];
      const tryIt = () => { const k = ph.combos.findIndex(c => (same(c.a, sel[0]) && same(c.b, sel[1])) || (same(c.a, sel[1]) && same(c.b, sel[0])));
        if (k < 0 || got.includes(k)) { setTv(v => ({ ...v, g: { ...v.g, sel: [] } })); trialWrong(); return; }
        const ng = [...got, k]; setTv(v => ({ ...v, g: { ...v.g, got: ng, sel: [], fresh: k } }));
        if (ng.length >= ph.combos.length) trialRight('추론 완성', 1300); };
      body = <div className="tr-debate"><div className="tr-mut" style={{ textAlign: 'center' }}>{ph.title} · {ph.guide}</div>
        <div className="tr-docs">{ph.docs.map((d, di) => <div key={di} className="tr-doc"><b>{d.title}</b>{d.parts.map((t, i) => <button key={i} className={'tr-part' + (sel.some(x => x[0] === di && x[1] === i) ? ' on' : '')} onClick={() => tap(di, i)}>{t}</button>)}</div>)}</div>
        <div className="tr-facts">{got.map(k => <div key={k} className={'tr-fact' + (g.fresh === k ? ' fresh' : '')}>◆ {ph.combos[k].fact}</div>)}{Array.from({ length: ph.combos.length - got.length }, (_, i) => <div key={'x' + i} className="tr-fact lock">? ? ?</div>)}</div>
        <button className="tr-tbtn gold" disabled={sel.length < 2} onClick={tryIt}>맞대 보기</button></div>;
    } else if (ph.type === 'develop') {
      const g = tv.g, dn = g.done || [], left = ph.spots.length - dn.length, bg = trUrl((TR_A.bg || {})[ph.bg]), ch = (TR_A.chars || {})[ph.who];
      body = <div className="tr-debate"><div className="tr-mut" style={{ textAlign: 'center' }}>{ph.title} · {ph.guide}</div>
        <div className={'tr-photo' + (left === 0 ? ' clear' : '')}><div className="tr-photoin" style={{ filter: `blur(${left * 4}px) sepia(${left ? .5 : 0})` }}>
          {bg ? <img src={bg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
          {ch ? <img src={trUrl(ch.src)} alt="" style={{ position: 'absolute', right: 10, bottom: -60, height: 300 }} /> : null}</div>
          {ph.spots.map((sp, i) => dn.includes(i) ? null : <button key={i} className={'tr-spot' + (g.pick === i ? ' on' : '')} style={{ left: sp.x + '%', top: sp.y + '%' }} onClick={() => setTv(v => ({ ...v, g: { ...v.g, pick: i } }))}>{i + 1}</button>)}</div>
        {left === 0 ? <div className="tr-stmt"><div className="tr-ttext">{ph.caption}</div></div> : g.pick !== undefined ? <div className="tr-drawer"><div className="tr-mut">{g.pick + 1}. {ph.spots[g.pick].label} — 맞는 증거는?</div>
          {evid.map(it => <button key={it.id} className="tr-evi" onClick={() => { if (ph.spots[g.pick].answer === it.id) setTv(v => ({ ...v, g: { ...v.g, done: [...dn, g.pick], pick: undefined } })); else trialWrong(); }}><b>{it.name}</b></button>)}</div>
          : <div className="tr-mut" style={{ textAlign: 'center' }}>번호를 눌러 흐린 곳을 고른다 · 남은 곳 {left}</div>}
        {left === 0 ? <button className="tr-tbtn gold" onClick={() => trialRight('현상 완료')}>기억을 굳힌다</button> : null}</div>;
    } else if (ph.type === 'route') {
      const g = tv.g, path = g.path || [ph.start], C = 11, M = TN_WORLD.map, last = path[path.length - 1];
      const tap = e => { if (g.ok) return; const r = e.currentTarget.getBoundingClientRect(), x = Math.floor((e.clientX - r.left) / r.width * M.width), y = Math.floor((e.clientY - r.top) / r.height * M.height);
        if (path.length > 1 && x === last[0] && y === last[1]) { setTv(v => ({ ...v, g: { ...v.g, path: path.slice(0, -1) } })); return; }
        if (Math.abs(x - last[0]) + Math.abs(y - last[1]) !== 1 || !TroemereiNPC.walkable(TN_WORLD, x, y)) return;
        setTv(v => ({ ...v, g: { ...v.g, path: [...path, [x, y]] } })); };
      const check = () => { let k = 0; for (const p2 of path) if (k < ph.via.length && p2[0] === ph.via[k][0] && p2[1] === ph.via[k][1]) k++; const end = path[path.length - 1];
        return k === ph.via.length && Math.abs(end[0] - ph.end[0]) + Math.abs(end[1] - ph.end[1]) <= 1; };
      const pts = path.map(p2 => `${(p2[0] + .5) * C},${(p2[1] + .5) * C}`).join(' ');
      body = <div className="tr-debate"><div className="tr-mut" style={{ textAlign: 'center' }}>{ph.title} · {ph.guide}</div>
        <div className="tr-mini" style={{ width: M.width * C, height: M.height * C }} onClick={tap}>
          {TR_A.map ? <img className="tr-px" src={trUrl(TR_A.map.src)} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .85 }} /> : null}
          <svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%"><polyline points={pts} fill="none" stroke="#f2c46d" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" opacity={g.ok ? .35 : 1} />
            {g.ok ? <polyline className="tr-draw" points={pts} fill="none" stroke="#fff6d0" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" pathLength="1" /> : null}
            <circle cx={(ph.start[0] + .5) * C} cy={(ph.start[1] + .5) * C} r="5" fill="#9ad87a" /><rect x={ph.end[0] * C - 2} y={ph.end[1] * C - 2} width={C + 4} height={C + 4} fill="none" stroke="#ff9a8a" strokeWidth="2" />
            <circle cx={(last[0] + .5) * C} cy={(last[1] + .5) * C} r="5" fill="#fff" stroke="#3a2a14" /></svg></div>
        <div className="tr-mut" style={{ textAlign: 'center' }}>{path.length - 1}칸 · 이웃 칸을 눌러 잇고, 끝 칸을 다시 누르면 지운다</div>
        <div style={{ display: 'flex', gap: 5 }}><button className="tr-tbtn" disabled={g.ok} onClick={() => setTv(v => ({ ...v, g: { ...v.g, path: [ph.start] } }))}>처음부터</button>
          <button className="tr-tbtn gold" style={{ flex: 2 }} disabled={path.length < 3 || g.ok} onClick={() => { if (check()) { setTv(v => ({ ...v, g: { ...v.g, ok: true } })); setTimeout(() => trialRight('동선 일치'), 1000); } else trialWrong(); }}>이 길이었다</button></div></div>;
    } else if (ph.type === 'strings') {
      const g = tv.g, es = g.es || [], key = (a2, b2) => [a2, b2].sort().join('|'), W2 = 348, H2 = 250, pos = id => { const n = ph.nodes.find(x => x.id === id); return [n.x / 100 * W2, n.y / 100 * H2]; };
      const tapN = id => setTv(v => { const a2 = v.g.a; if (!a2) return { ...v, g: { ...v.g, a: id } }; if (a2 === id) return { ...v, g: { ...v.g, a: '' } };
        const k = key(a2, id), cs = v.g.es || []; return { ...v, g: { ...v.g, a: '', es: cs.includes(k) ? cs.filter(x => x !== k) : [...cs, k] } }; });
      const want = ph.edges.map(e => key(e[0], e[1])), ok = es.filter(x => want.includes(x)).length;
      body = <div className="tr-debate"><div className="tr-mut" style={{ textAlign: 'center' }}>{ph.title} · {ph.guide}</div>
        <div className="tr-cork" style={{ height: H2 }}><svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%">{es.map(k => { const [a2, b2] = k.split('|'), p1 = pos(a2), p2 = pos(b2); return <line key={k} className="tr-draw" pathLength="1" x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="#c0303a" strokeWidth="2.5" />; })}</svg>
          {ph.nodes.map(n => <button key={n.id} className={'tr-pin' + (g.a === n.id ? ' on' : '')} style={{ left: n.x + '%', top: n.y + '%' }} onClick={() => tapN(n.id)}>{n.label}</button>)}</div>
        <div className="tr-mut" style={{ textAlign: 'center' }}>실 {es.length}개 · 핀 둘을 차례로 누르면 걸고, 다시 누르면 뗀다</div>
        <button className="tr-tbtn gold" disabled={!es.length} onClick={() => (ok === want.length && es.length === want.length ? trialRight('관계 확정') : (setToast('맞게 걸린 실 ' + ok + ' / ' + want.length), trialWrong()))}>이렇게 이어진다</button></div>;
    } else if (ph.type === 'dream') {
      const n = ph.pieces.length, order = ph.pieces.map((_, i) => i).sort((a2, b2) => ((a2 * 3 + 1) % n) - ((b2 * 3 + 1) % n));
      body = <div className="tr-debate">
        <div className="tr-mut" style={{ textAlign: 'center' }}>{ph.title} · {ph.guide}</div>
        <div className="tr-line2">{ph.pieces.map((p2, i) => <div key={i} className={'tr-slot' + (i < T.sub ? ' on' : '')}>{i < T.sub ? <><i>{i + 1}</i>{p2}</> : <i>{i + 1}</i>}</div>)}</div>
        <div className="tr-sky">{order.filter(i => i >= T.sub).map((i, k) => <button key={i} className="tr-bub" style={{ animationDelay: (k * .7) + 's', left: (8 + (k % 2) * 46) + '%', top: (6 + Math.floor(k / 2) * 46) + '%' }}
          onClick={() => { if (i === T.sub) { if (T.sub + 1 >= n) trialRight('이어졌다'); else setState(v => TroemereiNPC.trialStep(TN_WORLD, v, 'SUB')); } else trialWrong(); }}>{ph.pieces[i]}</button>)}</div></div>;
    } else if (ph.type === 'crystal') {
      // 진상 결정: 모서리를 누르면 그 자리 단서 다섯 장이 부채꼴로 펼쳐진다
      const g = tv.g, put = g.put || {}, open = g.open, R2 = 88, cx = 174, cy = 118;
      const pts = ph.slots.map((_, i) => { const a2 = -Math.PI / 2 + i * 2 * Math.PI / ph.slots.length; return [cx + R2 * Math.cos(a2), cy + R2 * Math.sin(a2)]; });
      const filled = Object.keys(put).length;
      body = <div className="tr-debate"><div className="tr-mut" style={{ textAlign: 'center' }}>{ph.title} · {ph.guide}</div>
        <div className={'tr-crys' + (g.win ? ' win' : '')}><svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%"><polygon points={pts.map(p2 => p2.join(',')).join(' ')} fill="#9a7ad822" stroke="#9a7ad8" strokeWidth="2" />
          {pts.map((p2, i) => put[i] ? <line key={i} x1={cx} y1={cy} x2={p2[0]} y2={p2[1]} stroke="#f2c46d" strokeWidth="2" opacity=".7" /> : null)}
          <polygon className="tr-core" points={pts.map(p2 => [cx + (p2[0] - cx) * .32, cy + (p2[1] - cy) * .32].join(',')).join(' ')} fill="#f2c46d" opacity={filled / ph.slots.length * .8 + .12} /></svg>
          {ph.slots.map((sl, i) => <button key={i} className={'tr-face' + (open === i ? ' on' : '') + (put[i] ? ' set' : '')} style={{ left: pts[i][0], top: pts[i][1] }} onClick={() => setTv(v => ({ ...v, g: { ...v.g, open: v.g.open === i ? undefined : i } }))}><small>{sl.label}</small>{put[i] || '?'}</button>)}
          {open !== undefined ? <div className="tr-fan" onClick={() => setTv(v => ({ ...v, g: { ...v.g, open: undefined } }))}>{ph.slots[open].options.map((o, k) => { const ang = -Math.PI / 2 + k * 2 * Math.PI / 5; // 가운데에서 꽃잎처럼 다섯 장
            return <button key={o} className={'tr-fancard' + (put[open] === o ? ' on' : '')} style={{ left: cx + 84 * Math.cos(ang), top: cy + 6 + 78 * Math.sin(ang), animationDelay: (k * .05) + 's' }}
              onClick={e => { e.stopPropagation(); setTv(v => ({ ...v, g: { ...v.g, put: { ...(v.g.put || {}), [open]: o }, open: undefined } })); }}>{o}</button>; })}</div> : null}</div>
        <div className="tr-mut" style={{ textAlign: 'center' }}>{filled} / {ph.slots.length}면 · 모서리를 누르면 단서가 펼쳐진다</div>
        <button className="tr-tbtn gold" disabled={filled < ph.slots.length || g.win} onClick={() => { if (ph.slots.every((sl, i) => put[i] === sl.answer)) { setTv(v => ({ ...v, g: { ...v.g, win: true } })); setTimeout(() => trialRight('진상 결정', 1300), 700); } else trialWrong(); }}>진상을 굳힌다</button></div>;
    } else if (ph.type === 'vote') {
      body = <div className="tr-debate">
        <div className="tr-mut" style={{ textAlign: 'center' }}>투표 · {ph.question}</div>
        <div className="tr-votes">{ph.options.map(id => <button key={id} className={'tr-vote' + (tv.vote === id ? ' on' : '')} onClick={() => !tv.voted && setTv(v => ({ ...v, vote: id }))}>{trPortrait(id, 76, 92)}<b>{trNpc(id).name}</b>
          {tv.voted ? <span className="tr-bar"><i style={{ width: (id === ph.answer ? 100 : 0) + '%' }} /></span> : null}</button>)}</div>
        <button className="tr-tbtn gold" disabled={!tv.vote || tv.voted} onClick={() => { setTv(v => ({ ...v, voted: true })); setTimeout(() => (tv.vote === ph.answer ? trialRight('정답') : (setTv(v => ({ ...v, voted: false })), trialWrong())), 1100); }}>투표한다</button></div>;
    }
    const maxHp = TR.hp || 5, ch = speakerId && speakerId !== 'baku' && speakerId !== 'me' ? (TR_A.chars || {})[speakerId] : null;
    const crack = ['모순!'].includes(tv.fx);
    return <div className="tr-out" ref={outRef} style={{ height: TR_H * scale }}><style>{TN_CSS}</style>
      <div className="tr-card tr-court" style={{ transform: `scale(${scale})` }}>
        {/* 무대: 말하는 사람의 모습(표정 조각)과 재판 참가자 자리 */}
        <div key={T.phase + '-' + speakerId + '-' + (stageFx || (cur && cur.cut) ? tv.idx : '') + (tv.reply ? 'r' : '')} className={'tr-stage' + (mini ? ' mini' : '') + (stageFx ? ' fx-' + stageFx : '')}>
          {TR_A.bg && TR_A.bg['재판장'] ? <img src={trUrl(TR_A.bg['재판장'])} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: .6 }} /> : <div className="tr-spot-light" />}
          {!mini && ch ? <div className="tr-actor">{trSprite(ch, trFace(ch, cur ? cur.face : ''), u => setBadImg(v => ({ ...v, [u]: true })), badImg)}</div> : null}
          {!mini && speakerId === 'baku' ? <div className="tr-actor baku"><div className="tr-baku-sil">獏</div></div> : null}
          {stageFx === 'flash' ? <div className="tr-flash" /> : null}
          {cur && cur.cut ? <div className="tr-cutin"><div className="tr-cutband">{trPortrait(cur.who, 70, 84)}<b>{cur.cut}!</b></div></div> : null}
          {stageFx === 'crack' ? trShards() : null}
        </div>
        <div className={'tr-thead' + (tv.fx === 'hit' ? ' shake' : '')}><div><b>{TR.title}</b><div className="tr-mut">재판 · {T.phase + 1}/{TR.phases.length}</div></div>
          <div className="tr-hp">{Array.from({ length: maxHp }, (_, i) => <i key={i} className={i < T.hp ? 'on' : ''} />)}</div>
          <button className="tr-hbtn" onClick={() => setState(v => TroemereiNPC.trialStep(TN_WORLD, v, 'QUIT'))}>중단</button></div>
        {/* 쟁점 진행: 풀린 쟁점은 답이 붙고, 지금 쟁점은 빛난다 */}
        <div className="tr-issues">{issues.map((x, i) => { const sv = T.phase > solvedUntil(x.id); return <div key={x.id} className={'tr-issue' + (sv ? ' done' : '') + (x.id === issueOf && !sv ? ' now' : '')}><i>{i + 1}</i>{sv ? x.a : x.id === issueOf ? x.q : '? ? ?'}</div>; })}</div>
        <div className={'tr-tbody' + (tv.fx === 'hit' ? ' shake' : '')}>{body}</div>
        {tv.fx && !['hit', 'rewind', 'fail'].includes(tv.fx) ? <>{crack ? trShards() : null}<div className={'tr-stamp' + (crack ? ' big' : '')}>{tv.fx === 'ok' ? '반론 성공' : tv.fx}</div></> : null}
        {tv.fx === 'hit' ? <div className="tr-stamp bad">빗나갔다</div> : null}
        {tv.fx === 'rewind' ? <div className="tr-rewind" onClick={() => setTv(v => ({ ...v, fx: '' }))}><div className="tr-ripple"><i /><i /><i /></div><div className="tr-clock"><b /></div>
          <div className="tr-whisper">뭐, 이런 전개도 가능하겠지만…… 그럴 리는 없지. 피곤한가?</div><span className="tr-mut tr-later">눌러서 계속</span></div> : null}
        {tv.fx === 'fail' || T.failed ? <div className="tr-rewind fail"><b>되돌릴 수 없다</b><span className="tr-mut">재판 실패</span><button className="tr-tbtn" onClick={() => setState(v => TroemereiNPC.trialStep(TN_WORLD, v, 'QUIT'))}>나가기 (시험)</button></div> : null}
        {manual ? <div className="tr-box" style={{ bottom: 5 }}><div className="tr-mut">아래 내용을 복사해 채팅 입력창에 보내 주세요.</div><textarea className="tr-ta" readOnly rows={5} value={manual} /><button style={{ height: 28 }} onClick={() => setManual('')}>닫기</button></div> : null}
      </div></div>;
  }
  // 먼저 말을 걸어온 인물에게 응답: 대화 화면을 열고 바로 인계(AI가 그 인물의 첫마디를 쓴다)
  function answerCall(id) {
    const asleep = wokeBy === id; setWokeBy('');
    setTalk({ npc: id, idx: 0, shown: 0, cut: false, fresh: true });
    send('T', { npc: id, text: asleep ? '(눈을 뜨고 돌아본다)' : '(돌아본다)', situation: '상황: ' + trJosa(trNpc(id).name, '이', '가') + ' 먼저 다가와 말을 걸었다' + (asleep ? ' · 플레이어는 쉬다가 깜빡 잠들어 있었다' : '') });
  }
  function menuDo(kind) {
    const m = menu; setMenu(null);
    if (m.kind === 'lm') { const lm = TN_WORLD.map.landmarks.find(l => l.id === m.id); if (kind === 'LOOK') setToast(lm.name + '을(를) 살펴봤다 (0초)'); if (kind === 'GO') act({ type: 'MOVE_TO', x: lm.x, y: lm.y }); if (kind === 'SEARCH') { if (busy) return; const next = TroemereiNPC.dispatch(TN_WORLD, state, { type: 'SEARCH', landmark: lm.id }); const got = (TN_WORLD.items || []).filter(it => next.player.items[it.id] !== undefined && (state.player.items || {})[it.id] === undefined); setState(next); setToast((next.logs[next.logs.length - 1] || {}).text || ''); if (got.length) setFound(got); } return; }
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
    // 지금 보일 인물: 이 줄까지 마지막으로 말한 사람(서술 줄은 직전 화자 유지). 없으면 대화 상대.
    let who = n ? { npc: trNpc(talk.npc), id: talk.npc, expr: '' } : null;
    if (line) for (let i = talk.idx; i >= 0; i--) { const L = lines[i]; if (!L.narration) { const m = TN_WORLD.npcs.find(x => x.name === L.speaker); who = { npc: m || { name: L.speaker, color: '#6b7a8c', symbol: '?' }, id: m ? m.id : '', expr: L.expression }; break; } }
    const ch = who && who.id && (TR_A.chars || {})[who.id];
    const face = ch ? trFace(ch, who.expr) : '';
    const bg = trUrl((TR_A.bg || {})[trArea(state.player.x, state.player.y)]);
    const boxBottom = canInput ? 92 : 5;
    return <div className="tr-out" ref={outRef} style={{ height: TR_H * scale }}><style>{TN_CSS}</style>
      <div className="tr-card" style={{ transform: `scale(${scale})`, background: TR_BG[Math.max(0, area)] }}>
        <div className="tr-talk">
          {bg && !badImg[bg] ? <img src={bg} alt="" onError={() => setBadImg(v => ({ ...v, [bg]: true }))} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
          {ch && !badImg[trUrl(ch.src)] ? trSprite(ch, face, u => setBadImg(v => ({ ...v, [u]: true })), badImg) : who ?
            <svg viewBox="0 0 360 540" style={{ position: 'absolute', inset: 0 }} aria-hidden="true"><ellipse cx="180" cy="520" rx="150" ry="230" fill={who.npc.color} opacity=".55" /><circle cx="180" cy="190" r="78" fill={who.npc.color} opacity=".9" /><text x="180" y="212" textAnchor="middle" fontSize="64" fontWeight="700" fill="#14212c">{who.npc.symbol}</text></svg> : null}
          <div className="tr-hud"><span className="tr-pill">{def.name} · {trArea(n ? n.x : state.player.x, n ? n.y : state.player.y)}</span><span style={{ flex: 1 }} /><span className="tr-pill tr-time">{TroemereiNPC.clock(state.clock)}</span></div>
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
              <button disabled={busy || talk.cut} onClick={endTalk}>{lastLine && full ? '대화 끝' : '넘기고 닫기'}</button>
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
          {manual ? <div className="tr-box" style={{ bottom: 5 }}><div className="tr-mut">자동 전송을 쓸 수 없는 환경입니다. 아래 내용을 복사해 채팅 입력창에 보내 주세요.</div>
            <textarea className="tr-ta" readOnly rows={5} value={manual} onFocus={e => e.target.select()} /><button style={{ height: 28 }} onClick={() => setManual('')}>닫기</button></div> : null}
        </div></div></div>;
  }

  // ---------- 재판 화면 ----------
  if (state.trial && !talk) return trTrialScreen();

  // ---------- 탐색 화면 ----------
  const vis = state.npcs.filter(n => debug || trVisible(state, n));
  const mn = menu && menu.kind === 'npc' ? state.npcs.find(v => v.id === menu.id) : null;
  const ml = menu && menu.kind === 'lm' ? TN_WORLD.map.landmarks.find(l => l.id === menu.id) : null;
  const dist = mn ? Math.abs(p.x - mn.x) + Math.abs(p.y - mn.y) : 0;
  const near = dist <= 1, canAcc = near && mn && mn.mode !== 'busy' && mn.mode !== 'accompany' && (!mn.intent || mn.intent.interruptible);
  const caller = TroemereiNPC.caller(TN_WORLD, state);
  const recent = state.logs.filter(e => e.visible && e.type === 'world' && state.clock - e.time < 600).slice(-1)[0];
  const nextNote = trNotices(state.clock, state.clock + 86400)[0];
  return <div className="tr-out" ref={outRef} style={{ height: TR_H * scale }}><style>{TN_CSS}</style>
    <div className="tr-card" style={{ transform: `scale(${scale})` }}>
      <div ref={svgRef} className="tr-map" onClick={tapMap}>
        <div className="tr-world" style={{ width: TN_WORLD.map.width * TR_CELL, height: TN_WORLD.map.height * TR_CELL, transform: `translate(${-camX}px,${-camY}px)`, transition: roomChanged ? 'none' : undefined,
          clipPath: debug ? 'none' : `inset(${ry0}px ${TN_WORLD.map.width * TR_CELL - rx1}px ${TN_WORLD.map.height * TR_CELL - ry1}px ${rx0}px)` }}>
          {TR_A.map && !badImg[trUrl(TR_A.map.src)] ? <img className="tr-px" src={trUrl(TR_A.map.src)} alt="" onError={() => setBadImg(v => ({ ...v, [trUrl(TR_A.map.src)]: true }))} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} />
            : <svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%">{trStaticLayer()}</svg>}
          {TN_WORLD.map.areas.map((a, i) => i === room || !debug ? null : <div key={'f' + i} className="tr-fog" style={{ left: a.x0 * TR_CELL, top: a.y0 * TR_CELL - 18, width: (a.x1 - a.x0 + 1) * TR_CELL, height: (a.y1 - a.y0 + 1) * TR_CELL + 18, opacity: debug ? .3 : .74 }} />)}
          <svg style={{ position: 'absolute', inset: 0, overflow: 'visible' }} width="100%" height="100%" pointerEvents="none">
            {(preview ? preview.path : p.route).map((q, i) => <circle key={i} cx={(q.x + .5) * TR_CELL} cy={(q.y + .5) * TR_CELL} r={i === (preview ? preview.path : p.route).length - 1 ? 7 : 3.5} fill={preview ? '#f6e3b4' : '#f2c46d'} opacity={preview ? .9 : .75} stroke="#3a2a14" strokeWidth="1" />)}
            {ml ? [[ml.x, ml.y], ...(ml.hit || [])].map(([hx, hy], i) => <rect key={i} x={hx * TR_CELL + 2} y={hy * TR_CELL + 2} width={TR_CELL - 4} height={TR_CELL - 4} rx="6" fill="none" stroke="#f6d48a" strokeWidth="2" strokeDasharray={i ? '4 3' : ''} />) : null}
          </svg>
          {[...vis.map(n => ({ id: n.id, x: n.x, y: n.y, n })), { id: 'player', x: p.x, y: p.y, n: null }].sort((a, b) => a.y - b.y).map(c => trCharSprite(c, animRef, movedRef, menu && menu.id === c.id, badImg))}
        </div>
        <div key={'fade' + room} className="tr-fade" />
      </div>
      <div className="tr-hud"><span className="tr-pill tr-area"><i />{RM.name}</span><span className="tr-pill tr-time">{state.day}일 {TroemereiNPC.clock(state.clock)}</span><span style={{ flex: 1 }} />
        <button className="tr-hbtn" onClick={() => setSheet('rest')}>휴식</button><button className="tr-hbtn" onClick={() => setSheet('note')}>노트</button><button className="tr-hbtn" aria-label="메뉴" onClick={() => setSheet('set')}>≡</button></div>
      <div className="tr-toast">{toast || (recent ? trHM(recent.time) + ' ' + recent.text : nextNote ? '다음 공지 ' + trHM(nextNote.t) + ' ' + nextNote.n.text + (nextNote.n.place ? ' · ' + nextNote.n.place : '') : '인물·물건을 누르면 행동을 고를 수 있다')}</div>
      {caller && !found && !menu && !preview ? <div className="tr-call"><div><b>{trJosa(trNpc(caller.id).name, '이', '가')}</b> 다가와 말을 걸었다{wokeBy === caller.id ? ' · 깜빡 잠들어 있었다' : ''}</div>
        <div style={{ display: 'flex', gap: 5, marginTop: 5 }}><button className="tr-callyes" disabled={busy} onClick={() => answerCall(caller.id)}>돌아본다</button><button disabled={busy} onClick={() => { act({ type: 'DISMISS_CALL', npcId: caller.id }); setWokeBy(''); }}>나중에</button></div></div> : null}
      {found ? <div className="tr-found" onClick={() => setFound(null)}><div className="tr-found-h">증거 획득</div>{found.map(it => <div key={it.id}><b>{it.name}</b><div className="tr-mut">{it.desc}</div></div>)}<div className="tr-mut" style={{ textAlign: 'right' }}>눌러서 닫기 · 노트 › 증거</div></div> : null}
      <div className="tr-padbase" />
      {[[0, -1, 38, 425, 0], [-1, 0, 4, 459, 270], [1, 0, 72, 459, 90], [0, 1, 38, 493, 180]].map(([dx, dy, x, y, r]) => <button key={r} className="tr-pad" style={{ left: x, top: y }} disabled={busy} onPointerDown={e => { e.preventDefault(); padDown(dx, dy); }} onPointerUp={padUp} onPointerLeave={padUp} onPointerCancel={padUp}>
        <svg width="14" height="14" viewBox="0 0 14 14" style={{ transform: `rotate(${r}deg)` }}><path d="M7 2 L12.5 11 L1.5 11 Z" fill="currentColor" /></svg></button>)}
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
      {sheet ? trSheet({ ev: boot.ev, heard: heardRef.current || (k ? { raw: String(k), accepted: [], rejected: [], wait: true } : null), free, tab: sheet, setTab: setSheet, state, debug, setDebug, busy, rest: { h: restH, setH: setRestH, mi: restM, setMi: setRestM }, onSkip: skipTo, onTrial: code => { setState(TroemereiNPC.startTrial(TN_WORLD, state, code)); setSheet(''); setTv({ reply: false, idx: 0, shown: 0, stmt: 0, drawer: false, vote: '', ev: '', fx: '', voted: false, g: {} }); }, onTrialAt: (code, n) => { let x = TroemereiNPC.startTrial(TN_WORLD, state, code); for (let i = 0; i < n; i++) x = TroemereiNPC.trialStep(TN_WORLD, x, 'NEXT'); setState(x); setSheet(''); setTv({ reply: false, idx: 0, shown: 0, stmt: 0, drawer: false, vote: '', ev: '', fx: '', voted: false, g: {} }); }, onUnstuck: () => { const n = TroemereiNPC.dispatch(TN_WORLD, state, { type: 'UNSTUCK' }); setState(n); setSheet(''); setToast((n.logs[n.logs.length - 1] || {}).text || ''); }, pick, setPick,
        onWait: sec => { act({ type: 'WAIT', seconds: sec }); setSheet(''); }, codeText, setCodeText,
        onRestore: () => { try { const v = TroemereiCodec.unpack(TN_WORLD, codeText.trim()); setState(TroemereiNPC.applyTalk(TN_WORLD, v, 0)); setSheet(''); setToast('상태 코드를 복원했습니다'); } catch (e) { setToast('복원 실패: ' + e.message); } },
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
    TN_WORLD.map.rows.forEach((row, y) => row.split('').forEach((c, x) => { const i = TroemereiNPC.areaOf(TN_WORLD, x, y); out.push(<rect key={x + '-' + y} x={x * TR_CELL} y={y * TR_CELL} width={TR_CELL} height={TR_CELL} fill={c === '#' ? '#0f1a27' : TR_BG[Math.max(0, i)]} stroke="#5f7585" strokeOpacity=".09" />); }));
    TN_WORLD.map.landmarks.forEach(l => out.push(<g key={'l' + l.id}><rect x={l.x * TR_CELL + 6} y={l.y * TR_CELL + 6} width={TR_CELL - 12} height={TR_CELL - 12} rx="4" fill="#e0bc78" opacity=".22" /><text x={(l.x + .5) * TR_CELL} y={(l.y + .5) * TR_CELL + 6} fontSize="16" textAnchor="middle" fill="#eddbaf">{l.icon}</text></g>));
    cache = <g pointerEvents="none">{out}</g>;
    return cache;
  };
})();

function trSheet({ ev, heard, free, tab, setTab, state, debug, setDebug, busy, onSkip, onUnstuck, onTrial, onTrialAt, pick, setPick, rest, onWait, codeText, setCodeText, onRestore, onFree, text, setText, send, sent }) {
  const tabs = [['note', '수첩'], ['scene', '목격'], ['item', '증거'], ['clue', '단서'], ['rest', '휴식'], ['set', '설정']];
  const mem = (state.player.mem || []).slice().reverse();
  return <div className="tr-sheet">
    <div className="tr-tabs">{tabs.map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => { setTab(k); setPick(null); }}>{l}</button>)}<button style={{ flex: 'none', width: 34 }} onClick={() => setTab('')}>✕</button></div>
    <div className="tr-body">
      {tab === 'clue' ? (mem.length ? mem.map((m, i) => <div className="tr-row" key={i}><time>{trHM(m[2])}</time>{trFact(m[0], m[1], 'player')}</div>) : <div className="tr-mut">아직 직접 보거나 들은 단서가 없다.</div>) : null}
      {tab === 'item' ? (() => { const its = (TN_WORLD.items || []).filter(it => (state.player.items || {})[it.id] !== undefined).sort((a, b) => state.player.items[b.id] - state.player.items[a.id]);
        return its.length ? its.map(it => { const l = TN_WORLD.map.landmarks.find(x => x.id === it.at); return <div className="tr-row" key={it.id}><b>{it.name}</b> <span className="tr-mut">{Math.floor(state.player.items[it.id] / 86400) + 1}일 {trHM(state.player.items[it.id])} · {l ? l.name : ''}에서 발견</span><div className="tr-mut">{it.desc}</div></div>; }) : <div className="tr-mut">아직 찾은 증거가 없다. 물건을 눌러 「조사」하면 찾을 수 있다.</div>; })() : null}
      {tab === 'rest' ? trRest({ state, busy, onSkip, ...rest }) : null}
      {tab === 'note' ? trNotebook(state, pick, setPick) : null}
      {tab === 'scene' ? trScenes(state, pick, setPick) : null}
      {tab === 'set' ? <div style={{ display: 'grid', gap: 6, paddingTop: 4 }}>
        <button style={{ height: 32 }} disabled={busy} onClick={onFree}>자유 행동 · 추리 입력</button>
        <button style={{ height: 32 }} disabled={busy} onClick={onUnstuck}>끼임 탈출 (움직일 수 없을 때 가까운 빈칸으로)</button>
        {(TN_WORLD.trials || []).map(t => <div key={t.code} style={{ display: 'grid', gap: 4 }}><button style={{ height: 32 }} disabled={busy || !!state.trial} onClick={() => onTrial(t.code)}>재판 시제품 시작 · {t.title} (시험)</button>
          <div className="tr-mut">단계 바로가기(시험용)</div>
          <div className="tr-grid h">{t.phases.map((ph, i) => <button key={i} disabled={busy || !!state.trial} title={ph.title || ph.type} onClick={() => onTrialAt(t.code, i)}>{i + 1}</button>)}</div>
          <div className="tr-mut">{t.phases.map((ph, i) => (i + 1) + '.' + ({ talk: '대사', debate: '증거 제시', pairs: '엇갈린 증언', combine: '구절 짝짓기', rebut: 'AI 반론', develop: '기억 현상', route: '동선 재현', strings: '실 엮기', dream: '꿈 조각', crystal: '진상 결정', vote: '투표' }[ph.type] || ph.type)).join(' · ')}</div></div>)}
        <div className="tr-mut">최근 기록</div>
        <div style={{ maxHeight: 130, overflowY: 'auto' }}>{state.logs.filter(e => debug || e.visible).slice(-20).reverse().map((e, i) => <div className="tr-row" key={i} style={{ fontSize: 12 }}><time>{trHM(e.time)}</time>{e.text}</div>)}</div>
        <label className="tr-mut"><input type="checkbox" checked={debug} onChange={e => setDebug(e.target.checked)} /> 디버그 (숨은 인물·기록 표시)</label>
        <div className="tr-mut">상태 코드</div><div className="tr-mono">{TroemereiCodec.pack(TN_WORLD, state)}</div>
        <textarea className="tr-ta" rows={2} value={codeText} onChange={e => setCodeText(e.target.value)} placeholder="복원할 상태 코드" />
        <button style={{ height: 30 }} disabled={busy} onClick={onRestore}>이 코드로 복원</button>
        {free ? <div className="tr-mut">이 화면: 화면 밖 대화의 응답(시간 변화 없음)</div> : null}
        {heard ? <div className="tr-mut">받은 증언 코드: {heard.raw} · {heard.wait ? '대사를 다 들으면 반영' : '인정 ' + (heard.accepted.join(',') || '없음')}{heard.rejected.length ? ' · 거부 ' + heard.rejected.map(r => r[0] + '(' + r[1] + ')').join(', ') : ''}</div> : null}
        {ev ? <div className="tr-mut">받은 사건 코드: {ev.code} · {ev.accepted ? '인정' : '거부(' + (ev.reason || '조건 불일치') + ')'}</div> : null}
        <div className="tr-mut">표식: {TroemereiNPC.markers(TN_WORLD, state).join(' ')}</div>
        <div className="tr-mut">시험판 v0.4 · 임시 인물·장소(본편 아님)</div></div> : null}
      {tab === 'free' ? <div style={{ display: 'grid', gap: 6, paddingTop: 4 }}>
        <div className="tr-mut">인물이 아닌 상대로 하는 행동이나, 지금까지의 추리를 적는다.</div>
        <textarea className="tr-ta" rows={4} value={text} onChange={e => setText(e.target.value.slice(0, 500))} placeholder="행동이나 추리" />
        <div style={{ display: 'flex', gap: 4 }}><button style={{ flex: 1, height: 34 }} disabled={!text.trim() || !!sent} onClick={() => send('P')}>행동 전달</button><button style={{ flex: 1, height: 34 }} disabled={!text.trim() || !!sent} onClick={() => send('A')}>추리 제시</button></div>
        {sent ? <div className="tr-mut">전달했습니다. 새 화면에서 이어집니다.</div> : null}</div> : null}
    </div></div>;
}

// 휴식 패널: 다음 시간대까지 / 자고 아침으로 / 시각 지정. 미리보기는 공지 일정만(남의 계획은 보이지 않는다).
function trRest({ state, busy, onSkip, h, setH, mi, setMi }) {
  const now = state.clock, D = 86400, sl = TroemereiNPC.slotOf(TN_WORLD, state), slots = TN_WORLD.slots || [];
  const nextSlot = (() => { for (let d = Math.floor(now / D); d <= Math.floor(now / D) + 1; d++) for (const x of slots) { const t = d * D + TroemereiNPC.absTime(x.from); if (t > now) return { t, name: x.name }; } return null; })();
  const morning = (() => { const t = Math.floor(now / D) * D + 7 * 3600; return t > now + 3600 ? t : t + D; })();
  const pick = h >= 0 ? (() => { const t = Math.floor(now / D) * D + h * 3600 + mi * 60; return t > now ? t : t + D; })() : 0;
  const label = t => (Math.floor(t / D) + 1) + '일 ' + trHM(t), dur = t => { const m = Math.round((t - now) / 60); return (m >= 60 ? Math.floor(m / 60) + '시간 ' : '') + (m % 60) + '분 뒤'; };
  const notes = pick ? trNotices(now, pick) : [];
  return <div style={{ display: 'grid', gap: 6, paddingTop: 4 }}>
    <div className="tr-mut">지금 {label(now)}{sl ? ' · ' + sl.name : ''} · 쉬는 동안에도 다른 사람들은 움직인다. 누가 나타나거나 공지가 있으면 멈춘다.</div>
    {nextSlot ? <button className="tr-big" disabled={busy} onClick={() => onSkip(nextSlot.t)}>다음 시간대까지 쉬기<small>{nextSlot.name} {label(nextSlot.t)} · {dur(nextSlot.t)}</small></button> : null}
    <button className="tr-big" disabled={busy} onClick={() => onSkip(morning)}>자고 아침으로<small>{label(morning)} · {dur(morning)}</small></button>
    <div className="tr-mut" style={{ marginTop: 4 }}>시각 지정</div>
    <div className="tr-grid h">{Array.from({ length: 24 }, (_, i) => <button key={i} className={h === i ? 'on' : ''} onClick={() => setH(i)}>{String(i).padStart(2, '0')}</button>)}</div>
    <div className="tr-grid m">{[0, 10, 20, 30, 40, 50].map(m => <button key={m} className={mi === m ? 'on' : ''} onClick={() => setMi(m)}>:{String(m).padStart(2, '0')}</button>)}</div>
    {pick ? <div className="tr-prev"><b>{label(pick)}</b> · {dur(pick)}{notes.length ? notes.map((x, i) => <div key={i} className="tr-mut">{trHM(x.t)} 공지 · {x.n.text}{x.n.place ? ' (' + x.n.place + ')' : ''} — 여기서 멈춤</div>) : <div className="tr-mut">그 사이 공지 없음</div>}</div> : null}
    <button className="tr-big" disabled={busy || !pick} onClick={() => onSkip(pick)}>{pick ? trHM(pick) + '까지 건너뛰기' : '시각을 고르세요'}</button>
  </div>;
}

// ---------- 인물 수첩 · 목격 장면 (글 기록을 쌓지 않고, 정해 둔 메모·장면만 해금) ----------
function trNoteOpen(st, id, u) {
  u = u || {}; const p = st.player;
  if (u.talked) return (p.talked || {})[id] !== undefined;
  if (u.seen) return !!(p.seen || {})[id];
  if (u.fact) return (p.mem || []).some(m => m[0] === u.fact);
  if (u.scene) return (p.scenes || {})[u.scene] !== undefined;
  if (u.flag) return !!st.flags[u.flag];
  return true;
}
// 인물 그림: 대화용 몸 그림이 있으면 윗부분, 없으면 탐색 스프라이트(정면)를 크게.
function trPortrait(id, w, h) {
  const c = (TR_A.chars || {})[id], sp = TR_A.sprites, row = sp ? sp.ids.indexOf(id) : -1, df = trNpc(id);
  if (c) return <div style={{ width: w, height: h, overflow: 'hidden', position: 'relative', background: '#e9dcc0' }}><img src={trUrl(c.src)} alt="" style={{ position: 'absolute', left: '50%', top: 0, width: w * 1.6, transform: 'translateX(-50%)' }} /></div>;
  if (sp && row >= 0) { const k = Math.max(1, Math.floor(Math.min(w / sp.cw, h / sp.ch))), col = (sp.dirs && sp.dirs.down) ? sp.dirs.down.idle : 0;
    return <div style={{ width: w, height: h, display: 'grid', placeItems: 'center', background: '#e9dcc0' }}><div className="tr-px" style={{ width: sp.cw * k, height: sp.ch * k, backgroundImage: `url(${trUrl(sp.src)})`, backgroundSize: `${sp.w * k}px ${sp.h * k}px`, backgroundPosition: `${-col * sp.cw * k}px ${-row * sp.ch * k}px` }} /></div>; }
  return <div style={{ width: w, height: h, display: 'grid', placeItems: 'center', background: df.color, fontSize: 28, fontWeight: 700, color: '#14212c' }}>{df.symbol}</div>;
}
function trNotebook(st, pick, setPick) {
  const met = n => !!(st.player.seen || {})[n.id] || (st.player.talked || {})[n.id] !== undefined;
  if (pick && pick.note) {
    const n = TN_WORLD.npcs.find(x => x.id === pick.note), known = met(n);
    return <div className="tr-nb-detail">
      <button className="tr-back" onClick={() => setPick(null)}>‹ 수첩</button>
      <div style={{ display: 'flex', gap: 8 }}><div style={{ filter: known ? 'none' : 'brightness(0) opacity(.55)' }}>{trPortrait(n.id, 120, 170)}</div>
        <div className="tr-slip" style={{ flex: 1 }}><b style={{ color: '#8a3b2b' }}>{known ? n.name : '???'}</b><div>{known ? n.profile : '아직 만나지 못했다'}</div></div></div>
      <div className="tr-slips">{(n.notes || []).map((x, i) => trNoteOpen(st, n.id, x.unlock) ? <div key={i} className="tr-slip">· {x.text}</div> : <div key={i} className="tr-slip lock"><b>? ? ?</b></div>)}</div>
    </div>;
  }
  return <div className="tr-cards">{TN_WORLD.npcs.map(n => { const open = (n.notes || []).filter(x => trNoteOpen(st, n.id, x.unlock)).length, known = met(n);
    return <button key={n.id} className="tr-card2" onClick={() => setPick({ note: n.id })}><div style={{ filter: known ? 'none' : 'brightness(0) opacity(.55)' }}>{trPortrait(n.id, 70, 92)}</div>
      <div style={{ flex: 1, minWidth: 0 }}><b>{known ? n.name : '???'}</b><div className="tr-mut2">{known ? n.profile : '아직 만나지 못했다'}</div><div className="tr-mut2">메모 {open} / {(n.notes || []).length}</div></div></button>; })}</div>;
}
function trScenes(st, pick, setPick) {
  const got = st.player.scenes || {}, list = TN_WORLD.scenes || [];
  const who = sc => sc.npc ? [sc.npc] : Object.keys(((TN_WORLD.facts || []).find(f => f.id === sc.fact) || {}).self || {});
  const art = (sc, w, h) => sc.img ? <img src={trUrl(sc.img)} alt="" style={{ width: w, height: h, objectFit: 'cover' }} /> :
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2, background: 'linear-gradient(#3b4a5e,#1c2533)' }}>{who(sc).map(id => <div key={id}>{trPortrait(id, Math.round(w / 2.6), Math.round(h * .8))}</div>)}</div>;
  if (pick && pick.scene) { const sc = list.find(x => x.id === pick.scene), t = got[sc.id];
    return <div className="tr-nb-detail"><button className="tr-back" onClick={() => setPick(null)}>‹ 목격</button>{art(sc, 336, 190)}
      <div className="tr-slip"><b>{sc.title}</b><div>{sc.caption}</div><div className="tr-mut2">{Math.floor(t / 86400) + 1}일 {trHM(t)}에 봤다</div></div></div>; }
  return <div><div className="tr-mut" style={{ margin: '2px 0 6px' }}>직접 본 장면만 남는다 · {Object.keys(got).length} / {list.length}</div>
    <div className="tr-grid2">{list.map(sc => got[sc.id] !== undefined ? <button key={sc.id} className="tr-scene" onClick={() => setPick({ scene: sc.id })}>{art(sc, 164, 96)}<span>{sc.title}</span></button>
      : <div key={sc.id} className="tr-scene lock"><b>? ? ?</b></div>)}</div></div>;
}
