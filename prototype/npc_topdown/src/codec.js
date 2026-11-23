/* Troemerei 상태 압축 코덱 v2 — AI가 매 턴 그대로 복사하는 문자열을 최소화한다.
   상태 JSON(약 1,000자 이상) → base64url 약 100~150자. 끝 2바이트는 손상 검사용 체크섬.
   로그는 화면 표시용이라 저장하지 않는다. 경로·타이머·완료 기록은 그대로 보존해 결정성을 유지한다. */
const TroemereiCodec = (() => {
  const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const MODES = ['idle', 'moving', 'busy', 'paused', 'accompany'];
  const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  const VERSION = 3;
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
  const putMem = (o, mem, m, clock) => { const list = (mem || []).filter(x => m.fidx.has(x[0])); o.uint(list.length); for (const [f, role, t] of list) { o.uint(m.fidx.get(f)); o.uint(role | 0); o.uint(Math.max(0, clock - t)); } };
  const getMem = (r, m, clock) => { const n = r.uint(), out = []; for (let i = 0; i < n; i++) { const f = m.facts[r.uint()]; if (f === undefined) throw Error('상태 코드의 사실 번호가 세계 데이터에 없습니다'); const role = r.uint(); out.push([f, role, clock - r.uint()]); } return out; };

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
if (typeof module !== 'undefined') module.exports = TroemereiCodec;
