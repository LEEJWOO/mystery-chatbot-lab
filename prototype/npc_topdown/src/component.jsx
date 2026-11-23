// 360×540(2:3) 기준 화면. 폭이 다르면 비율을 유지한 채 통째로 확대·축소한다.
const TR_W = 360, TR_H = 540, TR_CELL = 36;
const TR_IMP = { idle: '한가해 보인다', moving: '어딘가 바빠 보인다', busy: '무언가에 집중하고 있다', paused: '이야기를 들어 주고 있다', accompany: '곁에서 함께 걷고 있다' };
const TR_BG = ['#25344a', '#2d3a30', '#283a4a', '#2c3550'];
const trNpc = id => TN_WORLD.npcs.find(n => n.id === id) || { name: id, color: '#999', symbol: '?' };
const trArea = (x, y) => { const i = TroemereiNPC.areaOf(TN_WORLD, x, y); return i < 0 ? '통로' : TN_WORLD.map.areas[i].name; };
const trHM = n => TroemereiNPC.clock(n).slice(0, 5);
const trFact = (id, role, who) => { const f = (TN_WORLD.facts || []).find(x => x.id === id); if (!f) return id; if (who === 'player') return f.player || f.seen || id; return role === 0 ? ((f.self || {})[who] || f.seen || id) : (f.seen || id); };
const trVisible = (s, n) => TroemereiNPC.sees(TN_WORLD, s.player, n);
const trChars = lines => lines.reduce((k, l) => k + Array.from(l.text).length, 0);

// AI 출력: <Troemerei s='상태코드' d='이름:대사|*서술' />  (자유 행동 P에만 t='초' 허용)
function Troemerei({ s = '', t = '', d = '' }) {
  const lines = useMemo(() => TroemereiTalk.parse(d), [d]);
  const [boot] = useState(() => {
    if (!s) return { base: TroemereiNPC.createWorld(TN_WORLD), error: '' };
    try { return { base: TroemereiCodec.unpack(TN_WORLD, s), error: '' }; } catch (e) { return { base: null, error: e.message }; }
  });
  const replySec = b => (b && b.pk === 'P' && String(t).trim() !== '') ? Math.max(0, Math.min(900, Math.floor(Number(t) || 0))) : TroemereiNPC.talkSeconds(b ? b.pc : 0, trChars(lines));
  const pendNpc = boot.base && boot.base.pend;
  const [state, setState] = useState(() => !boot.base ? null : (s && !lines.length) ? TroemereiNPC.applyTalk(TN_WORLD, boot.base, replySec(boot.base)) : boot.base);
  const [talk, setTalk] = useState(() => boot.base && lines.length ? { npc: pendNpc || null, idx: 0, shown: 0, cut: false, fresh: false } : null);
  // 받은 응답의 대화 시간을 이미 반영했는지(대사가 있으면 다 읽거나 끊을 때 반영).
  const [consumed, setConsumed] = useState(() => !lines.length);
  const [menu, setMenu] = useState(null);
  const [preview, setPreview] = useState(null);
  const [sheet, setSheet] = useState('');
  const [drop, setDrop] = useState(false);
  const [text, setText] = useState('');
  const [codeText, setCodeText] = useState('');
  const [toast, setToast] = useState(boot.base && s && !lines.length && boot.base.pk ? '응답을 반영했습니다' : '');
  const [debug, setDebug] = useState(false);
  const [sent, setSent] = useState('');
  const [scale, setScale] = useState(1);
  const outRef = useRef(null), padRef = useRef(null), svgRef = useRef(null);

  useEffect(() => {
    const fit = () => { const el = outRef.current; if (el) { const w = el.getBoundingClientRect().width || TR_W; setScale(Math.max(0.6, Math.min(1.6, w / TR_W))); } };
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
  const camX = Math.max(0, Math.min(TN_WORLD.map.width * TR_CELL - TR_W, (p.x + .5) * TR_CELL - TR_W / 2));
  const camY = Math.max(0, Math.min(TN_WORLD.map.height * TR_CELL - TR_H, (p.y + .5) * TR_CELL - TR_H / 2 + 40));
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
    const who = state.npcs.find(n => n.x === x && n.y === y && (debug || trVisible(state, n)));
    if (who) { setPreview(null); setMenu({ kind: 'npc', id: who.id }); return; }
    const lm = TN_WORLD.map.landmarks.find(l => l.x === x && l.y === y && TroemereiNPC.areaOf(TN_WORLD, x, y) === area);
    if (lm) { setPreview(null); setMenu({ kind: 'lm', id: lm.id }); return; }
    setMenu(null);
    if (!TroemereiNPC.walkable(TN_WORLD, x, y)) { setPreview(null); return; }
    if (TroemereiNPC.areaOf(TN_WORLD, x, y) !== area) { setPreview(null); setToast('다른 구역은 방향키로 이동하세요'); return; }
    if (preview && preview.x === x && preview.y === y) { setPreview(null); act({ type: 'MOVE_TO', x, y }); return; }
    const path = TroemereiNPC.route(TN_WORLD, state, p, { x, y }, { ignorePlayer: true });
    if (!path.length) { setPreview(null); return; }
    setPreview({ x, y, path, sec: path.length * (TN_WORLD.player.moveSeconds || 4) });
  }

  function npcContext(next, id) {
    const n = next.npcs.find(v => v.id === id), name = trNpc(id).name;
    const mem = (n.mem || []).slice(-5).map(m => trHM(m[2]) + ' ' + trFact(m[0], m[1], id) + (m[1] ? '(목격)' : ''));
    return [name + ' 상태: ' + TroemereiNPC.describe(TN_WORLD, next, n), mem.length ? name + ' 기억: ' + mem.join(' / ') : ''];
  }
  function clueLine(next) { const c = (next.player.mem || []).slice(-6).map(m => trFact(m[0], m[1], 'player')); return c.length ? '내 단서: ' + c.join(' / ') : ''; }
  function applyReply(kind) {
    if (!lines.length || consumed) return state;
    const full = replySec(boot.base);
    return TroemereiNPC.applyTalk(TN_WORLD, boot.base, kind === 'I' ? TroemereiTalk.partialSeconds(lines, talk.idx, talk.shown, full) : full);
  }
  function send(kind) {
    const msg = text.trim(); if (!msg || busy) return;
    const chars = Array.from(msg).length;
    let next = applyReply(kind), target = '', ctx = [], cut = '';
    if (kind === 'I') cut = `${talk.idx + 1}/${lines.length}:${talk.shown}`;
    const id = (kind === 'T' || kind === 'I') && talk ? talk.npc : null;
    if (id) {
      next = TroemereiNPC.dispatch(TN_WORLD, next, { type: 'TALK_REQUEST', npcId: id, kind, chars });
      if (next.pend !== id) { setToast('지금은 말을 걸 수 없습니다'); return; }
      target = trNpc(id).name; ctx = [...npcContext(next, id), clueLine(next)];
    } else {
      next = { ...TroemereiNPC.clone(next), pk: kind === 'T' ? 'P' : kind, pc: chars, pend: null };
      ctx = [clueLine(next)];
    }
    const code = TroemereiCodec.pack(TN_WORLD, next);
    const message = TroemereiTalk.handoff({ kind: id ? kind : (kind === 'T' ? 'P' : kind), target, cut, where: trArea(next.player.x, next.player.y), time: next.day + '일 ' + trHM(next.clock), ctx, text: msg, code });
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
    next = TroemereiNPC.dispatch(TN_WORLD, next, { type, npcId: talk.npc });
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
    const boxBottom = canInput ? 92 : 5;
    return <div className="tr-out" ref={outRef} style={{ height: TR_H * scale }}><style>{TN_CSS}</style>
      <div className="tr-card" style={{ transform: `scale(${scale})`, background: TR_BG[Math.max(0, area)] }}>
        <div className="tr-talk">
          {def.portrait ? <img src={def.portrait} alt="" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '88%', objectFit: 'contain', objectPosition: 'center bottom' }} /> :
            <svg viewBox="0 0 360 540" style={{ position: 'absolute', inset: 0 }} aria-hidden="true"><ellipse cx="180" cy="520" rx="150" ry="230" fill={def.color} opacity=".55" /><circle cx="180" cy="190" r="78" fill={def.color} opacity=".9" /><text x="180" y="212" textAnchor="middle" fontSize="64" fontWeight="700" fill="#14212c">{def.symbol}</text></svg>}
          <div className="tr-hud"><span className="tr-pill">{def.name} · {trArea(n ? n.x : state.player.x, n ? n.y : state.player.y)}</span><span style={{ flex: 1 }} /><span className="tr-pill tr-time">{trHM(state.clock)}</span></div>
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
        <TrStatic />
        {TN_WORLD.map.areas.map((a, i) => i === area && !debug ? null : <rect key={'f' + i} x={a.x0 * TR_CELL} y={a.y0 * TR_CELL} width={(a.x1 - a.x0 + 1) * TR_CELL} height={(a.y1 - a.y0 + 1) * TR_CELL} fill="#050b14" opacity={debug ? .35 : .82} pointerEvents="none" />)}
        {preview ? <polyline points={[p, ...preview.path].map(q => `${(q.x + .5) * TR_CELL},${(q.y + .5) * TR_CELL}`).join(' ')} fill="none" stroke="#f2d99e" strokeWidth="3" strokeDasharray="5 4" pointerEvents="none" /> : null}
        {p.route.length ? <polyline points={[p, ...p.route].map(q => `${(q.x + .5) * TR_CELL},${(q.y + .5) * TR_CELL}`).join(' ')} fill="none" stroke="#f2d99e" strokeWidth="3" pointerEvents="none" /> : null}
        {vis.map(n => { const df = trNpc(n.id), cx = (n.x + .5) * TR_CELL, cy = (n.y + .5) * TR_CELL; return <g key={n.id} pointerEvents="none">
          {menu && menu.id === n.id ? <circle cx={cx} cy={cy} r="18" fill="none" stroke="#f0d29a" strokeWidth="2" strokeDasharray="4 3" /> : null}
          <circle cx={cx} cy={cy} r="14" fill={df.color} stroke="#f4efdf" strokeWidth="1.6" /><text x={cx} y={cy + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#14212c">{df.symbol}</text>
          {n.mode === 'accompany' ? <circle cx={cx + 11} cy={cy - 11} r="4" fill="#f7d47c" /> : null}</g>; })}
        <g pointerEvents="none"><circle cx={(p.x + .5) * TR_CELL} cy={(p.y + .5) * TR_CELL} r="15" fill="#f6dfab" stroke="#1b2a39" strokeWidth="3" /><text x={(p.x + .5) * TR_CELL} y={(p.y + .5) * TR_CELL + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1b2a39">나</text></g>
      </svg>
      <div className="tr-hud"><span className="tr-pill">{trArea(p.x, p.y)}</span><span className="tr-pill tr-time">{state.day}일 {trHM(state.clock)}</span><span style={{ flex: 1 }} />
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
      {sheet ? <TrSheet tab={sheet} setTab={setSheet} state={state} debug={debug} setDebug={setDebug} busy={busy}
        onWait={sec => { act({ type: 'WAIT', seconds: sec }); setSheet(''); }} codeText={codeText} setCodeText={setCodeText}
        onRestore={() => { try { const v = TroemereiCodec.unpack(TN_WORLD, codeText.trim()); setState(TroemereiNPC.applyTalk(TN_WORLD, v, 0)); setSheet(''); setToast('상태 코드를 복원했습니다'); } catch (e) { setToast('복원 실패: ' + e.message); } }}
        onFree={() => { setSheet('free'); setText(''); }} text={text} setText={setText} send={send} sent={sent} /> : null}
    </div></div>;
}

// 움직이지 않는 지도 층: 한 번만 만들고 다시 그리지 않는다.
const TR_STATIC = (() => {
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
function TrStatic() { return TR_STATIC(); }

function TrSheet({ tab, setTab, state, debug, setDebug, busy, onWait, codeText, setCodeText, onRestore, onFree, text, setText, send, sent }) {
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
        <div className="tr-mut">상태 코드</div><div className="tr-mono">{TroemereiCodec.pack(TN_WORLD, state)}</div>
        <textarea className="tr-ta" rows={2} value={codeText} onChange={e => setCodeText(e.target.value)} placeholder="복원할 상태 코드" />
        <button style={{ height: 30 }} disabled={busy} onClick={onRestore}>이 코드로 복원</button>
        <div className="tr-mut">시험판 v0.3 · 임시 인물·장소(본편 아님)</div></div> : null}
      {tab === 'free' ? <div style={{ display: 'grid', gap: 6, paddingTop: 4 }}>
        <div className="tr-mut">인물이 아닌 상대로 하는 행동이나, 지금까지의 추리를 적는다.</div>
        <textarea className="tr-ta" rows={4} value={text} onChange={e => setText(e.target.value.slice(0, 500))} placeholder="행동이나 추리" />
        <div style={{ display: 'flex', gap: 4 }}><button style={{ flex: 1, height: 34 }} disabled={!text.trim() || !!sent} onClick={() => send('P')}>행동 전달</button><button style={{ flex: 1, height: 34 }} disabled={!text.trim() || !!sent} onClick={() => send('A')}>추리 제시</button></div>
        {sent ? <div className="tr-mut">전달했습니다. 새 화면에서 이어집니다.</div> : null}</div> : null}
    </div></div>;
}
