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
