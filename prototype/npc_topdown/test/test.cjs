// node test/test.cjs — 엔진·압축 코덱·대사 해석 회귀 테스트
const assert = require('node:assert/strict');
const E = require('../src/engine.js'), C = require('../src/codec.js'), T = require('../src/dialogue.js');
const W = require('./fixture_world_v1.json'); // 엔진 회귀 시험은 고정된 옛 시험 세계로(본 세계 데이터가 바뀌어도 유지)
let pass = 0; const tests = [];
const test = (name, fn) => tests.push([name, fn]);
const pk = s => C.pack(W, s);

test('개입 없음: 5분 뒤 만남 발생, 이후 자료실 전달 완료', () => {
  let s = E.createWorld(W); s = E.advance(W, s, 300);
  assert.equal(s.flags.meeting_occurred, true);
  s = E.advance(W, s, 600); assert.equal(s.flags.delivery_done, true);
});
test('사전 개입: 동행하면 만남이 무산되고 이후에도 발생하지 않음', () => {
  let s = E.createWorld(W); s = E.dispatch(W, s, { type: 'ACCOMPANY', npcId: 'companion' });
  assert.equal(s.flags.meeting_prevented, true);
  s = E.advance(W, s, 300); assert.equal(s.flags.meeting_occurred, false);
  const before = { ...s.player };
  s = E.dispatch(W, s, { type: 'MOVE_TO', x: 7, y: 10 }); s = E.advance(W, s, 20);
  const c = s.npcs.find(n => n.id === 'companion');
  assert.notDeepEqual({ x: s.player.x, y: s.player.y }, { x: before.x, y: before.y });
  assert.equal(Math.abs(c.x - s.player.x) + Math.abs(c.y - s.player.y), 1, '동행자가 바로 뒤를 따라와야 함');
});
test('결정성: 같은 행동이면 같은 상태 코드', () => {
  const run = () => { let s = E.createWorld(W); s = E.dispatch(W, s, { type: 'MOVE_TO', x: 20, y: 12 }); s = E.advance(W, s, 777); return pk(s); };
  assert.equal(run(), run());
});
test('코덱 왕복: 여러 시점에서 복원 후 같은 코드, 이어서 진행해도 같은 결과', () => {
  let s = E.createWorld(W), max = 0;
  s = E.dispatch(W, s, { type: 'MOVE_TO', x: 22, y: 11 });
  for (let i = 0; i < 60; i++) {
    s = E.advance(W, s, 7 + (i % 13) * 9);
    const code = pk(s); max = Math.max(max, code.length);
    const back = C.unpack(W, code);
    assert.equal(pk(back), code);
    assert.equal(pk(E.advance(W, back, 120)), pk(E.advance(W, s, 120)), '복원 상태와 원래 상태의 진행 결과가 달라짐(' + i + ')');
  }
  assert.ok(max < 260, '상태 코드가 너무 김: ' + max);
  console.log('   상태 코드 최대 길이', max, '자 / 원래 JSON', JSON.stringify(s).length, '자');
});
test('손상 검출: 한 글자 바뀌면 체크섬 오류, 다른 맵이면 거부', () => {
  const code = pk(E.advance(W, E.createWorld(W), 90));
  const i = Math.floor(code.length / 2), bad = code.slice(0, i) + (code[i] === 'A' ? 'B' : 'A') + code.slice(i + 1);
  assert.throws(() => C.unpack(W, bad), /손상|잘렸|알 수 없는|오류/);
  const other = JSON.parse(JSON.stringify(W)); other.map.id = 'other';
  assert.throws(() => C.unpack(other, code), /세계 데이터/);
  assert.throws(() => C.unpack(W, code + '\''), /허용되지 않은/);
});
test('대화 요청: 인접해야 하고, 응답 시간 반영은 다시 마운트해도 동일', () => {
  let s = E.createWorld(W);
  const far = E.dispatch(W, s, { type: 'TALK_REQUEST', npcId: 'contact' });
  assert.equal(far.pend, null);
  s = E.dispatch(W, s, { type: 'TALK_REQUEST', npcId: 'companion' });
  assert.equal(s.pend, 'companion');
  const code = pk(s);
  const a = E.applyTalk(W, C.unpack(W, code), 45), b = E.applyTalk(W, C.unpack(W, code), 45);
  assert.equal(pk(a), pk(b)); assert.equal(a.clock, s.clock + 45); assert.equal(a.pend, null);
});
test('대화 중에는 상대가 멈추고, 그 사이 다른 인물은 계속 움직임', () => {
  let s = E.dispatch(W, E.createWorld(W), { type: 'TALK_REQUEST', npcId: 'companion' });
  const before = s.npcs.map(n => n.x + ',' + n.y);
  const after = E.applyTalk(W, s, 60);
  const comp = after.npcs.find(n => n.id === 'companion');
  assert.equal(comp.x + ',' + comp.y, before[0], '대화 상대는 대화 시간 동안 제자리');
  assert.ok(after.npcs.some((n, i) => n.x + ',' + n.y !== before[i]), '다른 NPC는 움직여야 함');
});
test('대화 상대가 아니어도 자유 행동 응답 시간은 반영', () => {
  const s = E.createWorld(W), a = E.applyTalk(W, s, 120);
  assert.equal(a.clock, s.clock + 120);
  assert.equal(E.applyTalk(W, s, 99999).clock, s.clock + 900, '최대 900초 제한');
});
test('대사 해석: 이름·표정·서술 구분, 숫자 시각은 화자로 오인하지 않음', () => {
  const l = T.parse('유태윤(긴장):……대장까지 확인하셨군요.|*그는 안경을 밀어 올렸다.|김민서:9시 7분이었어요!|09:07에 종이 울렸다.');
  assert.equal(l.length, 4);
  assert.deepEqual([l[0].speaker, l[0].expression, l[0].narration], ['유태윤', '긴장', false]);
  assert.equal(l[1].narration, true); assert.equal(l[2].text, '9시 7분이었어요!'); assert.equal(l[3].narration, true);
});
test('끼어들기: 내 말은 전부, 상대 대사는 읽은 위치까지만 시간 반영', () => {
  const l = T.parse('가:1234567890|나:1234567890');
  assert.equal(T.partialSeconds(l, 0, 0, 500), Math.ceil(500 / 6) + 4, '응답을 0자 보고 끊어도 내 말 시간은 남음');
  assert.equal(T.partialSeconds(l, 1, 10, 10), Math.ceil(30 / 6) + 4);
  assert.equal(T.partialSeconds(l, 0, 0, 0), 5, '최소 5초');
});
test('긴 대사: 3줄(54칸)을 넘으면 같은 화자의 여러 페이지로 나눔, 글자 수는 그대로', () => {
  const long = '가'.repeat(30) + ' ' + '나'.repeat(40) + '. ' + '다'.repeat(50);
  const l = T.paginate(T.parse('유리(놀람):' + long + '|*짧은 서술'));
  assert.ok(l.length >= 4, '페이지가 나뉘어야 함');
  assert.ok(l.slice(0, -1).every(x => x.speaker === '유리' && x.expression === '놀람'));
  assert.equal(l.slice(0, -1).map(x => x.text).join('').replace(/\s/g, ''), long.replace(/\s/g, ''));
  assert.ok(l.every(x => Array.from(x.text).length <= 54));
  assert.equal(T.paginate(T.parse('a:' + 'x'.repeat(90))).length, 1, '반각 90자는 한 페이지(0.55칸)');
});
test('인계 메시지 형식: 한 줄 머리말 + 입력 + 상태 코드', () => {
  const msg = T.handoff({ kind: 'I', target: '유리', cut: '2/3:15', where: '정원', time: '09:01', ctx: ['유리 상태: 한가함', ''], text: '잠깐만요', code: 'AbC' });
  assert.equal(msg, 'TRM1 I 유리 cut=2/3:15 | 09:01 정원\n유리 상태: 한가함\n잠깐만요\ns=AbC');
});
test('매 턴 저장해도 사건 결과는 연속 진행과 같음', () => {
  let a = E.createWorld(W), b = E.createWorld(W);
  for (let i = 0; i < 20; i++) { a = E.advance(W, a, 45); b = C.unpack(W, pk(E.advance(W, b, 45))); }
  assert.deepEqual(b.flags, a.flags); assert.equal(pk(a), pk(b));
});
test('단일 JSX 산출물에 import/export/fetch/localStorage 없음', () => {
  const fs = require('node:fs'), src = fs.readFileSync(__dirname + '/../dist/Troemerei.jsx', 'utf8');
  for (const bad of [/^\s*import\s/m, /^\s*export\s/m, /\bfetch\(/, /localStorage/, /\bmodule\.exports/]) assert.ok(!bad.test(src), '금지 패턴: ' + bad);
  assert.ok(/function Troemerei\(/.test(src));
});

test('세계 지문: 일정 정의가 바뀌면 옛 상태 코드를 거부(조용히 다른 행동으로 읽지 않음)', () => {
  let s = E.advance(W, E.createWorld(W), 400);
  const code = pk(s);
  const changed = JSON.parse(JSON.stringify(W));
  changed.npcs[3].agenda.unshift({ id: 'new_task', kind: 'visit', landmark: 'garden', from: '09:00', until: '18:00', durationSeconds: 30, priority: 10, weight: 1 });
  assert.throws(() => C.unpack(changed, code), /세계 데이터/);
  const renamed = JSON.parse(JSON.stringify(W)); renamed.facts[0].id = 'met_other';
  assert.throws(() => C.unpack(renamed, code), /세계 데이터/);
});
test('날짜 넘김: 자정이 지나면 날짜가 늘고, 다음 날 09시 이후 일정이 다시 진행됨', () => {
  let s = E.createWorld(W);
  const target = 86400 + 9 * 3600 + 1800; while (s.clock < target) s = E.advance(W, s, Math.min(7200, target - s.clock));
  assert.equal(s.day, 2);
  assert.equal(E.clock(s.clock).slice(0, 2), '09');
  assert.ok(s.npcs.some(n => n.intent || n.mode === 'busy'), '둘째 날 아침에 일정을 고른 NPC가 있어야 함');
  const before = s.npcs.map(n => n.completed.length);
  s = E.advance(W, s, 1800);
  assert.ok(s.npcs.some((n, i) => n.lastCompleted && Object.values(n.lastCompleted).some(t => t > 86400 + 9 * 3600)), '둘째 날 완료한 행동이 있어야 함');
});
test('연기(postpone): 동행을 끝내면 미뤘던 만남을 다시 진행 / 취소(cancel)는 다시 안 함', () => {
  const P = JSON.parse(JSON.stringify(W)); P.npcs[0].agenda[0].onAccompany = 'postpone';
  let a = E.dispatch(P, E.createWorld(P), { type: 'ACCOMPANY', npcId: 'companion' });
  a = E.advance(P, a, 30); a = E.dispatch(P, a, { type: 'RELEASE', npcId: 'companion' }); a = E.advance(P, a, 600);
  assert.equal(a.flags.meeting_occurred, true);
  let b = E.dispatch(W, E.createWorld(W), { type: 'ACCOMPANY', npcId: 'companion' });
  b = E.advance(W, b, 30); b = E.dispatch(W, b, { type: 'RELEASE', npcId: 'companion' }); b = E.advance(W, b, 600);
  assert.equal(b.flags.meeting_occurred, false);
});
test('인물 기억: 당사자는 직접, 근처 사람은 목격으로 알고, 먼 사람은 모름', () => {
  let s = E.createWorld(W); s.player.x = 22; s.player.y = 6;
  s = E.advance(W, s, 400);
  const mem = id => s.npcs.find(n => n.id === id).mem.map(m => m[0] + ':' + m[1]);
  assert.ok(mem('companion').includes('met_doyun:0')); assert.ok(mem('contact').includes('met_doyun:0'));
  assert.ok(s.player.mem.some(m => m[0] === 'met_doyun' && m[1] === 1), '근처에 있던 플레이어는 목격');
  const far = E.advance(W, E.createWorld(W), 400);
  assert.ok(!far.player.mem.some(m => m[0] === 'met_doyun'), '정원에 있던 플레이어는 모름');
  const acc = E.dispatch(W, E.createWorld(W), { type: 'ACCOMPANY', npcId: 'companion' });
  assert.ok(acc.npcs[0].mem.some(m => m[0] === 'missed_doyun'));
});
test('대화 시간은 글자 수로 계산하고, 대기 정보(종류·글자 수)는 코드에 보존', () => {
  assert.equal(E.talkSeconds(60, 120), 34); assert.equal(E.talkSeconds(0, 0), 5);
  let s = E.dispatch(W, E.createWorld(W), { type: 'TALK_REQUEST', npcId: 'companion', kind: 'T', chars: 42 });
  const back = C.unpack(W, pk(s));
  assert.equal(back.pk, 'T'); assert.equal(back.pc, 42); assert.equal(back.pend, 'companion');
  assert.deepEqual(back.player.seen, s.player.seen);
});

test('빠른 계산: 다음 사건 시각으로 건너뛰어도 1초씩 계산한 결과와 완전히 같음', () => {
  const strip = s => JSON.stringify({ ...s, logs: s.logs.map(l => [l.time, l.text]) });
  const scenarios = [
    s => s,
    s => E.dispatch(W, s, { type: 'ACCOMPANY', npcId: 'companion' }),
    s => E.dispatch(W, s, { type: 'MOVE_TO', x: 22, y: 11 }),
    s => { s = E.dispatch(W, s, { type: 'MOVE_TO', x: 7, y: 9 }); return s; },
    s => { s.player.x = 22; s.player.y = 6; return s; },
  ];
  for (const [i, prep] of scenarios.entries()) {
    let a = prep(E.createWorld(W)), b = prep(E.createWorld(W));
    for (const step of [1, 7, 33, 120, 600, 1800, 7200, 7200, 7200, 7200, 7200, 7200, 7200, 7200, 7200, 7200, 7200, 7200, 7200]) {
      a = E.advance(W, a, step); b = E.advanceSlow(W, b, step);
      assert.equal(strip(a), strip(b), '시나리오 ' + i + ' 시각 ' + E.clock(b.clock) + '에서 달라짐');
    }
  }
});
test('빠른 계산: 하루를 건너뛰어도 1초 안에 끝남', () => {
  let s = E.createWorld(W); const t0 = Date.now();
  for (let i = 0; i < 12; i++) s = E.advance(W, s, 7200);
  const ms = Date.now() - t0;
  assert.ok(ms < 1000, '하루 계산에 ' + ms + 'ms'); console.log('   하루(86,400초) 계산', ms, 'ms');
});
test('사건 코드: 조건이 맞을 때만 인정(대상 인물·대화 종류), 두 번은 기록 안 함', () => {
  let s = E.dispatch(W, E.createWorld(W), { type: 'TALK_REQUEST', npcId: 'companion', kind: 'T', chars: 5 });
  const ok = E.applyEvent(W, s, 'TRUE'); assert.equal(ok.accepted, true); assert.equal(ok.state.flags.true_route, true);
  assert.equal(E.applyEvent(W, ok.state, 'TRUE').accepted, false);
  let far = E.createWorld(W); far.player.x = 5; far.player.y = 6;
  far = E.dispatch(W, far, { type: 'TALK_REQUEST', npcId: 'librarian', kind: 'T', chars: 5 });
  const wrongNpc = E.applyEvent(W, far, 'TRUE'); assert.equal(wrongNpc.accepted, false);
  assert.equal(E.applyEvent(W, s, 'HACK').accepted, false);
  assert.equal(E.applyEvent(W, s, '').accepted, false);
});
test('로어북 표식: 장 표식은 항상, 진엔딩 표식은 플래그가 있을 때만', () => {
  const s = E.createWorld(W);
  assert.deepEqual(E.markers(W, s), ['#장1', '#1일아침A']);
  s.flags.true_route = true; assert.deepEqual(E.markers(W, s), ['#장1', '#1일아침A', '#진루트']);
  s.flags.meeting_prevented = true; assert.equal(E.markers(W, s)[1], '#1일아침B', '조건이 맞으면 갈래 B');
  const night = { ...E.clone(s), clock: 86400 + 2 * 3600 }; assert.equal(E.markers(W, night)[1], '#1일밤B', '새벽은 전날 밤');
  const eve = { ...E.clone(E.createWorld(W)), clock: 18 * 3600 + 5 }; assert.equal(E.markers(W, eve)[1], '#1일저녁A');
  assert.equal(T.handoff({ kind: 'T', target: '유리', where: '정원', time: '1일 09:00', marks: ['#장1', '#진루트'], text: 'x', code: 'A' }).split('\n')[0], 'TRM1 T 유리 | 1일 09:00 정원 #장1 #진루트');
});

test('만남: 도중에 상대를 데려가면 성립하지 않고, 성립 안 한 일은 기억에도 없음', () => {
  let s = E.createWorld(W), guard = 0;
  while (guard++ < 400) { s = E.advance(W, s, 1); if (s.npcs.find(n => n.id === 'companion').mode === 'busy') break; }
  const c = s.npcs.find(n => n.id === 'companion'), d = s.npcs.find(n => n.id === 'contact');
  assert.equal(c.mode, 'busy'); assert.equal(d.mode, 'paused', '상대도 만남 동안 붙잡힘');
  s.player.x = d.x; s.player.y = d.y + 1; if (!E.walkable(W, s.player.x, s.player.y)) { s.player.x = d.x + 1; s.player.y = d.y; }
  s = E.dispatch(W, s, { type: 'ACCOMPANY', npcId: 'contact' });
  assert.equal(s.npcs.find(n => n.id === 'contact').mode, 'accompany');
  s = E.dispatch(W, s, { type: 'MOVE_TO', x: 20, y: 12 }); s = E.advance(W, s, 200);
  assert.equal(s.flags.meeting_occurred, false, '데려갔으므로 만남 불성립');
  assert.ok(!s.npcs.some(n => (n.mem || []).some(m => m[0] === 'met_doyun')), '아무도 만남을 기억하지 않음');
});
test('로그 공개: 다른 구역에서 일어난 일은 보이지 않음(시야 판정과 같은 기준)', () => {
  let s = E.createWorld(W); s = E.advance(W, s, 900);
  assert.equal(s.flags.meeting_occurred, true);
  const done = s.logs.filter(l => /만남을 마쳤다/.test(l.text));
  assert.ok(done.length && done.every(l => !l.visible), '정원에서 작업실 만남은 안 보임');
});
test('증언(k): 대상이 아는 기억만 「들음」 단서로 기록, 모르는 일·없는 번호는 거부, 코드 왕복 보존', () => {
  let s = E.createWorld(W); s = E.advance(W, s, 900);
  const c = s.npcs.find(n => n.id === 'companion');
  s.player.x = c.x; s.player.y = c.y + 1; if (!E.walkable(W, s.player.x, s.player.y)) { s.player.x = c.x + 1; s.player.y = c.y; }
  s = E.dispatch(W, s, { type: 'TALK_REQUEST', npcId: 'companion', kind: 'T', chars: 5 });
  assert.equal(s.pend, 'companion');
  assert.equal(E.factCode(W, 'met_doyun'), '기억K3R8');
  const r = E.hearFacts(W, s, '기억K3R8@2,기억T9M2, 기억ZZZZ');
  assert.deepEqual(r.accepted, ['K3R8']);
  assert.deepEqual(r.rejected.map(x => x[0]), ['T9M2', 'ZZZZ']);
  assert.deepEqual(E.parseK('기억K3R8@2,기억P4X6'), [{ code: 'K3R8', line: 2 }, { code: 'P4X6', line: 0 }]);
  const heard = r.state.player.mem.find(m => m[0] === 'met_doyun');
  assert.equal(heard[1], 2 + W.npcs.findIndex(n => n.id === 'companion'), '역할 = 2 + 말한 인물 번호');
  const back = C.unpack(W, C.pack(W, r.state));
  assert.deepEqual(back.player.mem.map(m => m.slice(0, 2)), r.state.player.mem.map(m => m.slice(0, 2)));
  assert.equal(E.hearFacts(W, E.createWorld(W), '기억K3R8').accepted.length, 0, '대화 상대가 없으면 거부');
});
test('사건 코드: 끼어들기(I)도 일반 대화(T)와 같이 인정, 자유 행동(P)은 거부', () => {
  let s = E.createWorld(W);
  const i = E.dispatch(W, s, { type: 'TALK_REQUEST', npcId: 'companion', kind: 'I', chars: 5 });
  assert.equal(E.applyEvent(W, i, 'TRUE').accepted, true);
  const p = { ...E.clone(s), pend: 'companion', pk: 'P' };
  assert.equal(E.applyEvent(W, p, 'TRUE').accepted, false);
});

test('물건: 등장 조건 전에는 없고, 조건 뒤 조사하면 소지품(발견 시각 보존), 두 번은 못 가져감', () => {
  let s = E.createWorld(W);
  s.player.x = 7; s.player.y = 13; // 정원 벤치 자리
  let r = E.dispatch(W, s, { type: 'SEARCH', landmark: 'garden' });
  assert.equal(r.player.items.button, undefined, '09:30 전에는 없음');
  assert.ok(r.clock > s.clock, '조사에 시간이 듦');
  s = E.advance(W, r, 1800); s.player.x = 7; s.player.y = 13; s.player.route = [];
  r = E.dispatch(W, s, { type: 'SEARCH', landmark: 'garden' });
  assert.ok(r.player.items.button >= 9 * 3600 + 1800);
  const back = C.unpack(W, C.pack(W, r)); assert.equal(back.player.items.button, r.player.items.button);
  assert.equal(E.itemsAt(W, r, 'garden').length, 0, '이미 가져감');
  assert.equal(E.itemsAt(W, E.createWorld(W), 'archive').length, 0, '메모 사본은 전달 전엔 없음');
  assert.equal(r.flags.delivery_done, true); assert.equal(E.itemsAt(W, r, 'archive').length, 1, '전달(플래그) 뒤에는 있음');
  const far = E.dispatch(W, E.createWorld(W), { type: 'SEARCH', landmark: 'archive' });
  assert.ok(/가까이/.test(far.logs[far.logs.length - 1].text), '멀면 조사 불가');
});
test('시간 건너뛰기: 조건이 참이 되는 순간 멈추고, 아니면 끝까지(하루 넘게도)', () => {
  const s = E.createWorld(W);
  const all = E.advanceUntil(W, s, 30 * 3600, null);
  assert.equal(all.stopped, false); assert.equal(all.state.clock, s.clock + 30 * 3600); assert.equal(all.state.day, 2);
  const seen0 = new Set(s.npcs.filter(n => E.sees(W, s.player, n)).map(n => n.id));
  const r = E.advanceUntil(W, s, 6 * 3600, x => x.npcs.some(n => E.sees(W, x.player, n) && !seen0.has(n.id)));
  assert.equal(r.stopped, true); assert.ok(r.state.clock < s.clock + 6 * 3600);
  assert.equal(pk(E.advanceUntil(W, s, 600, null).state), pk(E.advance(W, s, 600)), '멈춤 없으면 일반 진행과 같음');
});
test('끼임 탈출: 움직일 수 있으면 그대로, 사방이 막히면 가장 가까운 빠져나갈 칸으로(시간 0)', () => {
  let s = E.createWorld(W);
  assert.deepEqual([E.dispatch(W, s, { type: 'UNSTUCK' }).player.x, E.dispatch(W, s, { type: 'UNSTUCK' }).player.y], [s.player.x, s.player.y]);
  s.player.x = 4; s.player.y = 4; // 벽(가구) 칸에 끼임
  const r = E.dispatch(W, s, { type: 'UNSTUCK' });
  assert.ok(E.walkable(W, r.player.x, r.player.y)); assert.equal(Math.abs(r.player.x - 4) + Math.abs(r.player.y - 4), 1); assert.equal(r.clock, s.clock);
});
test('목격 장면·말 건 인물: 조건이 맞을 때만 해금, 증언으로 들은 건 장면 해금 안 함, 코드 왕복 보존', () => {
  let s = E.createWorld(W);
  s = E.dispatch(W, s, { type: 'TALK_REQUEST', npcId: 'companion', kind: 'T', chars: 3 });
  assert.ok(s.player.talked.companion !== undefined);
  let t = E.advance(W, E.applyTalk(W, s, 5), 3600);
  const sb = t.player.scenes.serin_board; // 세린이 오전에 정원 게시판을 지나가면 해금
  const back = C.unpack(W, C.pack(W, t));
  assert.deepEqual(Object.keys(back.player.scenes).sort(), Object.keys(t.player.scenes).sort());
  assert.ok(back.player.talked.companion !== undefined);
  assert.equal(t.player.scenes.meet, undefined, '작업실 만남은 정원에서 못 봄');
  const h = { ...E.clone(t), pend: 'companion', pk: 'T' }; const r = E.hearFacts(W, h, '기억K3R8');
  if (r.accepted.length) assert.equal(r.state.player.scenes.meet, undefined, '증언은 목격 장면이 아님');
  console.log('   세린 게시판 장면:', sb === undefined ? '이번 실행에선 안 봄' : '해금');
});
test('먼저 말 걸기: 정해진 시간에 플레이어를 찾아와 곁에서 기다리고, 대화하면 끝·거절하면 돌아감·안 받으면 지쳐 돌아감', () => {
  let s = E.createWorld(W); s = E.advance(W, s, 40 * 60); // 09:40
  let c = E.caller(W, s), guard = 0;
  while (!c && guard++ < 40) { s = E.advance(W, s, 30); c = E.caller(W, s); }
  assert.ok(c, '태수가 찾아와야 함'); assert.equal(c.id, 'courier');
  const talk = E.dispatch(W, s, { type: 'TALK_REQUEST', npcId: 'courier', kind: 'T', chars: 3 });
  assert.equal(talk.pend, 'courier'); assert.equal(E.caller(W, talk), null);
  const no = E.dispatch(W, s, { type: 'DISMISS_CALL', npcId: 'courier' }); assert.equal(E.caller(W, no), null);
  assert.ok(no.npcs.find(n => n.id === 'courier').completed.includes('call_player'), '한 번만');
  const wait = E.advance(W, s, 200); assert.equal(E.caller(W, wait), null, '기다리다 돌아감');
  const back = C.unpack(W, C.pack(W, s)); assert.ok(E.caller(W, back), '상태 코드 왕복 후에도 기다리는 중');
});
test('시선: 같은 방·6칸 안이어도 키 큰 가구(책장 등)에 가리면 안 보이고, 낮은 가구는 가리지 않음', () => {
  // 자료실 책장(6~7,3) 위아래
  assert.equal(E.lineOfSight(W, { x: 6, y: 2 }, { x: 6, y: 5 }), false, '책장이 가림');
  assert.equal(E.lineOfSight(W, { x: 4, y: 3 }, { x: 4, y: 6 }) , true, '낮은 탁자(4,4)는 안 가림');
  assert.equal(E.sees(W, { x: 6, y: 2 }, { x: 6, y: 5 }), false);
});
test('세계 지문: 공지·사건·갈래·장면 조건이 바뀌면 이전 코드 거부, 설명 문구만 바뀌면 허용', () => {
  const code = pk(E.createWorld(W));
  const mut = f => { const w2 = JSON.parse(JSON.stringify(W)); f(w2); try { C.unpack(w2, code); return '허용'; } catch (e) { return '거부'; } };
  assert.equal(mut(w => { w.notices[0].time = '12:30'; }), '거부');
  assert.equal(mut(w => { w.events.TRUE.flag = 'delivery_done'; }), '거부');
  assert.equal(mut(w => { w.branches[0].letter = 'C'; }), '거부');
  assert.equal(mut(w => { w.scenes[1].radius = 3; }), '거부');
  assert.equal(mut(w => { w.dataVersion = (w.dataVersion || 0) + 1; }), '거부');
  assert.equal(mut(w => { w.rel.scales[0].levels.push('맹신'); }), '거부');
  assert.equal(mut(w => { w.npcs[0].rel.trust = 60; }), '거부');
  assert.equal(mut(w => { w.items[0].desc = '다른 설명'; }), '허용');
  assert.equal(mut(w => { w.npcs[0].notes[0].text = '다른 메모'; }), '허용');
});
test('대화 중 증거 제시: 사건 규칙의 present는 그 증거를 낸 대화에서만, 코드 왕복', () => {
  const W2 = JSON.parse(JSON.stringify(W)); W2.events.SHOW = { kinds: ['T'], present: 'memo_copy', flag: 'delivery_done', log: '사본을 보여 줌' };
  const base = { ...E.createWorld(W2), pend: 'companion', pk: 'T', pv: '' };
  assert.equal(E.applyEvent(W2, base, 'SHOW').accepted, false);
  const withIt = { ...base, pv: 'memo_copy' }; assert.equal(E.applyEvent(W2, withIt, 'SHOW').accepted, true);
  assert.equal(C.unpack(W2, C.pack(W2, withIt)).pv, 'memo_copy');
});
test('사건 연결: 실제 행동 → 발견 → 현장 입장 시 집합 → 조사(마감·자료) → 개정 → 갈래별 재판(A=T1, B=T1B), 막으면 사건 없음', () => {
  const go = (prep) => { let s = E.createWorld(W); if (prep) s = prep(s); for (let i = 0; i < 1440 && !(s.cases && s.cases.C1); i++) s = E.advance(W, s, 5); return s; };
  const toCase = s => { const d = W.map.landmarks.find(l => l.id === 'desk'); s = E.dispatch(W, s, { type: 'MOVE_TO', x: d.x, y: d.y + 1 }); for (let i = 0; i < 200 && !s.trial; i++) s = E.advance(W, s, 4); return s; };
  for (const [prep, want, inv] of [[null, 'T1', '#조사C1A'], [s => { s = E.dispatch(W, s, { type: 'ACCOMPANY', npcId: 'companion' }); for (let i = 0; i < 6; i++) s = E.advance(W, s, 5); return E.dispatch(W, s, { type: 'RELEASE', npcId: 'companion' }); }, 'T1B', '#조사C1B']]) {
    let s = go(prep); assert.ok(s.cases.C1, '사건 발견');
    assert.ok(s.npcs.every(n => n.mode === 'accompany' || n.queued.some(t => t.id === 'gather_C1') || (n.intent && n.intent.id === 'gather_C1') || n.completed.includes('gather_C1')), '모두 현장으로');
    s = toCase(s); assert.equal(W.trials[s.trial.i].code, 'C1', '현장 방에 들어가면(모두 모이거나 10분 뒤) 사건 대본');
    const room = E.areaOf(W, s.player.x, s.player.y); assert.ok(s.npcs.every(n => E.areaOf(W, n.x, n.y) === room) || s.clock - s.cases.C1[1] >= 600, '집합 조건');
    assert.equal(s.player.items.work_order, undefined, '연쇄 시작에는 자료를 지급하지 않음');
    s = E.trialStep(W, s, 'NEXT'); assert.ok(E.inInvestigation(W, s)); assert.ok(s.player.items.work_order !== undefined && s.player.given.work_order, '조사 시작 때 지급(출처: 지배인)');
    assert.equal(s.trial.sub, s.cases.C1[1] + 50 * 60 > s.clock + 300 ? s.cases.C1[1] + 50 * 60 : s.clock + 300, '마감은 발견 시각 + 50분');
    assert.ok(E.markers(W, s).includes(inv), '조사 표식 ' + inv);
    assert.ok(s.npcs.every(n => !n.queued.some(t => t.id === 'gather_C1')), '조사 중엔 각자 일정');
    const dl = s.trial.sub; const t30 = E.applyTalk(W, E.advance(W, s, dl - s.clock - 1), 30); assert.equal(t30.clock, dl, '마감을 넘기는 대화도 시간은 마감에서 멈춤');
    const lm = W.map.landmarks.find(l => l.id === 'archive'); let sr = E.advance(W, s, dl - s.clock - 5); sr.player.x = lm.x; sr.player.y = lm.y + 1; const got = E.dispatch(W, sr, { type: 'SEARCH', landmark: 'archive' });
    assert.ok(!E.inInvestigation(W, got) && got.player.items.memo_copy === sr.player.items.memo_copy, '마감에 걸친 조사는 성공하지 않음');
    s = E.advance(W, s, dl - s.clock + 5); assert.ok(!E.inInvestigation(W, s), '마감에 개정');
    s = E.trialStep(W, s, 'NEXT'); assert.equal(W.trials[s.trial.i].code, want, '갈래별 재판 ' + want);
    assert.ok(C.unpack(W, C.pack(W, s)).cases.C1, '코드 왕복');
  }
  // 막기: 유리와 동행 + 태수도 붙잡아 두면(동행은 한 명이라 태수의 전달은 남는다) → 여기서는 유리 동행 후 태수 동행으로 바꿔 전달을 막는다
  let s = E.dispatch(W, E.createWorld(W), { type: 'ACCOMPANY', npcId: 'companion' });
  for (let i = 0; i < 6; i++) s = E.advance(W, s, 5);
  s = E.dispatch(W, s, { type: 'RELEASE', npcId: 'companion' });
  const t = s.npcs.find(n => n.id === 'courier'); s.player.x = t.x; s.player.y = t.y + (E.walkable(W, t.x, t.y + 1) ? 1 : -1);
  s = E.dispatch(W, s, { type: 'ACCOMPANY', npcId: 'courier' });
  for (let i = 0; i < 600; i++) s = E.advance(W, s, 5);
  if (s.npcs.find(n => n.id === 'courier').mode === 'accompany') assert.ok(!(s.cases && s.cases.C1), '전달을 막으면 사건 없음');
});
test('반론 보류: 입증 부족 지적(T1_R1H)은 쟁점을 보류로 두고 다음 단계로, 코드 왕복', () => {
  let s = E.startTrial(W, E.createWorld(W), 'T1'); for (let i = 0; i < 6; i++) s = E.trialStep(W, s, 'NEXT');
  const r = E.applyEvent(W, { ...E.clone(s), pend: 'librarian', pk: 'R' }, 'T1_R1H');
  assert.ok(r.accepted && r.hold); assert.equal(r.state.trial.phase, 7); assert.equal(r.state.trial.hold & 1, 1);
  assert.equal(C.unpack(W, C.pack(W, r.state)).trial.hold, 1);
});
test('체크인 외형: 코드 왕복(한글 이름 포함)', () => {
  const s = E.createWorld(W); assert.equal(s.player.look, null);
  s.player.look = { g: 1, hf: 2, hb: 3, hc: 7, eye: 1, ec: 4, sk: 2, of: 4, oc: 5, ac: 3, name: '키와무 하지메' };
  assert.deepEqual(C.unpack(W, C.pack(W, s)).player.look, s.player.look);
});
test('말 걸기: 2칸 이내·시야 트임이면 상대가 일하는 중이어도 가능, 대화 시간만큼 그 일이 늦어짐', () => {
  let s = E.createWorld(W); for (let i = 0; i < 400; i++) { s = E.advance(W, s, 5); if (s.npcs.some(n => n.mode === 'busy' && !n.intent?.targetPlayer)) break; }
  const n = s.npcs.find(v => v.mode === 'busy' && !v.intent?.targetPlayer); assert.ok(n, '일하는 인물');
  const spot = [[0, 2], [2, 0], [0, -2], [-2, 0], [1, 1], [-1, 1], [1, -1], [-1, -1], [0, 1], [1, 0]].map(([dx, dy]) => ({ x: n.x + dx, y: n.y + dy })).find(p => E.walkable(W, p.x, p.y) && !s.npcs.some(v => v.x === p.x && v.y === p.y) && E.lineOfSight(W, p, n));
  s.player.x = spot.x; s.player.y = spot.y;
  const t = E.dispatch(W, s, { type: 'TALK_REQUEST', npcId: n.id, kind: 'T', chars: 5 }); assert.equal(t.pend, n.id);
  const before = t.npcs.find(v => v.id === n.id).busyUntil, after = E.applyTalk(W, t, 30).npcs.find(v => v.id === n.id);
  assert.ok(after.busyUntil >= before + 30 || after.mode !== 'busy', '하던 일이 늦어짐');
  const far = E.clone(s); far.player.x = n.x + 6; assert.notEqual(E.dispatch(W, far, { type: 'TALK_REQUEST', npcId: n.id }).pend, n.id, '멀면 불가');
});
test('시선 대칭: 같은 방의 모든 두 칸에서 A가 B를 보면 B도 A를 본다', () => {
  const s = E.createWorld(W); let bad = 0, n = 0;
  for (let y = 0; y < W.map.height; y++) for (let x = 0; x < W.map.width; x++) {
    if (!E.walkable(W, x, y)) continue;
    for (let dy = -6; dy <= 6; dy++) for (let dx = -6; dx <= 6; dx++) { const b = { x: x + dx, y: y + dy }; if (!E.walkable(W, b.x, b.y)) continue; n++;
      if (E.lineOfSight(W, { x, y }, b) !== E.lineOfSight(W, b, { x, y })) bad++; }
  }
  assert.ok(n > 1000); assert.equal(bad, 0);
});
test('관계: 시작값·단계·첫 대화 보너스·AI r(±1단계 제한·대상만)·사건/단계 보상·코드 왕복', () => {
  let s = E.createWorld(W);
  assert.equal(E.relLevel(W, s, 'contact', 'trust'), 2, '도윤 신뢰 35 → 경계(2)');
  assert.equal(E.relLevel(W, s, 'contact', 'affection'), 3, '애정은 성별과 관계없이 열림(남성 플레이어 → 남성 인물)');
  const fem = E.clone(s); fem.player.look = { g: 1, hf: 0, hb: 0, hc: 0, eye: 0, ec: 0, sk: 0, of: 0, oc: 0, ac: 0, name: '여' };
  assert.equal(E.relLevel(W, fem, 'contact', 'affection'), 3, '여성 플레이어 → 남성 인물');
  assert.ok(E.relLevel(W, fem, 'companion', 'affection') > 0, '여성 플레이어 → 여성 인물도 열림');
  const W2 = JSON.parse(JSON.stringify(W)); W2.rel.scales[1].opposite = true;
  assert.equal(E.relLevel(W2, s, 'contact', 'affection'), 0, 'opposite:true로 켜면 이성에게만(옵션은 남겨 둠)');
  const near = JSON.parse(JSON.stringify(s)); const d = near.npcs.find(n => n.id === 'contact'); near.player.x = d.x; near.player.y = d.y + 1;
  let t = E.dispatch(W, near, { type: 'TALK_REQUEST', npcId: 'contact', kind: 'T', chars: 5 });
  if (t.pend === 'contact') assert.equal(t.player.rel.contact.trust, 41, '첫 대화 +6');
  const r1 = E.applyRel(W, s, 'companion', 't+3a-1');
  assert.equal(r1.state.player.rel.companion.trust, 50, '척도마다 한 번에 ±1단계(5점)까지');
  assert.equal(r1.state.player.rel.companion.affection, 45);
  assert.deepEqual(E.applyRel(W, s, 'contact', 'a+1').changed, { affection: 5 }, '동성 인물에게도 애정 반영');
  assert.deepEqual(E.applyRel(W2, s, 'contact', 'a+1').changed, {}, '꺼진 척도는 무시');
  const r2 = E.applyRel(W, s, 'courier', '신뢰+1'); assert.equal(r2.state.player.rel.courier.trust, 55, '한글 척도 이름도 허용');
  let x = E.clone(s); E.relAdd(W, x, 'librarian', { trust: 200 }); assert.equal(x.player.rel.librarian.trust, 100, '0~100으로 묶임');
  assert.equal(E.relLevel(W, x, 'librarian', 'trust'), 5);
  const back = C.unpack(W, C.pack(W, x)); assert.deepEqual(back.player.rel, x.player.rel, '코드 왕복');
  let tr = E.startTrial(W, s, 'T1'); tr.trial.phase = 6; tr = E.trialStep(W, tr, 'NEXT');
  assert.equal(tr.player.rel.librarian.trust, 46, '반론 단계를 넘기면 세린 신뢰 +6');
});
test('재판: 시작·단계 진행·체력·되감기(꿈)·실패(현실)·AI 반론 사건 코드는 그 단계에서만, 코드 왕복', () => {
  let s = E.startTrial(W, E.createWorld(W), 'T1');
  assert.deepEqual([s.trial.phase, s.trial.hp], [0, 5]); assert.ok(s.player.items.memo_copy !== undefined, '재판 자료 지급');
  assert.ok(E.markers(W, s).includes('#재판T1'));
  const RB = W.events.T1_R1.phase; for (let i = 0; i < RB; i++) s = E.trialStep(W, s, 'NEXT'); assert.equal(s.trial.phase, RB);
  const back = C.unpack(W, C.pack(W, s)); assert.deepEqual(back.trial, { i: 0, phase: RB, hp: 5, sub: 0, failed: 0, hold: 0 });
  const r = { ...E.clone(s), pend: 'librarian', pk: 'R' };
  assert.equal(E.applyEvent(W, r, 'T1_R1').state.trial.phase, RB + 1, '반론 성공 → 다음 단계');
  const early = { ...E.clone(E.trialStep(W, E.startTrial(W, E.createWorld(W), 'T1'), 'NEXT')), pend: 'librarian', pk: 'R' };
  assert.equal(E.applyEvent(W, early, 'T1_R1').accepted, false, '다른 단계에서는 무효');
  let h = s; for (let i = 0; i < 4; i++) h = E.trialHit(W, h).state;
  const rw = E.trialHit(W, h); assert.equal(rw.result, 'rewind'); assert.equal(rw.state.trial.hp, 5); assert.equal(rw.state.trial.phase, RB);
  h.flags.true_route = true; assert.equal(E.trialHit(W, h).result, 'fail', '진엔딩은 되감기 없음');
  let e = s; for (let i = RB; i < W.trials[0].phases.length; i++) e = E.trialStep(W, e, 'NEXT'); assert.equal(e.trial, null); assert.equal(e.flags.trial_memo_done, true);
});

// ---- 현재 시험 세계(src/world.json: 사라진 브로치) 무결성 ----
const NW = require('../src/world.json');
test('시험 세계: 시작·사건 발견·집합 후 재판, 코드 왕복', () => {
  let s = E.createWorld(NW); E.validate(NW, s);
  assert.equal(s.clock % 86400, 19 * 3600 + 30 * 60, '19:30 시작');
  for (let i = 0; i < 90 && !s.trial; i++) s = E.advance(NW, s, 60);
  assert.ok(s.flags.brooch_gone, '브로치 사라짐 깃발'); assert.ok(s.trial, '집합 후 재판 시작');
  assert.equal(NW.trials[s.trial.i].code, 'C1');
  const code = C.pack(NW, s); assert.equal(C.pack(NW, C.unpack(NW, code)), code); assert.ok(code.length < 420, '상태 코드 길이 ' + code.length);
});
test('시험 세계: 대본 참조(증거·인물·구절·쟁점·반론 단계) 일치', () => {
  const ids = new Set(NW.npcs.map(n => n.id)), items = new Set(NW.items.map(i => i.id)), facts = new Set(NW.facts.map(f => f.id));
  const FACES = ['기본', '미소', '웃음', '의심', '놀람', '곤란', '부끄러움', '불만', '슬픔', '격노', '패닉', '하라구로'], usedF = new Set(), usedP = new Set();
  const seeLine = l => { if (l.face) { assert.ok(FACES.includes(l.face), '표정 ' + l.face); usedF.add(l.face); } if (l.pose) usedP.add(l.pose); (l.alt || []).forEach(seeLine); if (l.who && l.who !== 'host') assert.ok(ids.has(l.who), '인물 ' + l.who); };
  for (const n of NW.npcs) for (const f of n.knows || []) assert.ok(facts.has(f), 'knows ' + f);
  for (const T of NW.trials) {
    (T.evidence || []).forEach(e => assert.ok(items.has(e), '증거 ' + e));
    const iss = new Set((T.issues || []).map(i => i.id));
    T.phases.forEach((ph, k) => {
      if (ph.issue) assert.ok(iss.has(ph.issue), T.code + ' 쟁점 ' + ph.issue);
      (ph.lines || []).forEach(seeLine); Object.values(ph.miss || {}).forEach(seeLine);
      if (ph.type === 'nonstop') { const segs = ph.lines.map(l => (l.text.match(/\{[^}]+\}/g) || []).length);
        for (const a of ph.answers) { assert.ok(a.at[1] < segs[a.at[0]], k + ' 구절 위치'); if (a.word) assert.ok(a.word[1] < segs[a.word[0]], k + ' 회수 위치'); (a.ev || []).forEach(e => assert.ok(T.evidence.includes(e), k + ' 증거 ' + e)); } }
      if (ph.type === 'crystal') ph.slots.forEach(sl => assert.ok(sl.options.includes(sl.answer), sl.label));
      if (ph.type === 'vote') assert.ok(ph.options.includes(ph.answer));
      if (ph.type === 'dream') ph.rounds.forEach(r => r.ask.forEach(([sd, f]) => { const v = r[sd][f], opt = { who: [...ph.cast, ''], obj: [...ph.objs, ''], at: ph.ats, pose: ['서 있음', '달림', '건넴'], bg: NW.map.areas.map(a => a.name) }[f]; assert.ok(opt.includes(v), '꿈 ' + f + ' ' + v); }));
      if (ph.type === 'route') { assert.ok(E.walkable(NW, ...ph.start) && ph.via.every(v => E.walkable(NW, ...v)), '동선 칸'); }
    });
    (T.issues || []).filter(i => i.confirmAt !== undefined).forEach(i => assert.equal(T.phases[i.confirmAt].type, 'crystal', 'confirmAt'));
  }
  for (const [k, ev] of Object.entries(NW.events)) if (ev.trial) { const T = NW.trials.find(t => t.code === ev.trial); assert.equal(T.phases[ev.phase].type, 'rebut', k + ' 반론 단계'); }
  assert.deepEqual(FACES.filter(f => !usedF.has(f)), [], '대본에 안 쓰인 표정'); assert.deepEqual(['think', 'point', 'crossed'].filter(p => !usedP.has(p)), [], '대본에 안 쓰인 자세');
});


test('층 연결(계단)과 숨은 공간: 경로가 계단을 지나고, 정해진 칸에서 벽으로 한 번 더 가면 열림', () => {
  const w = JSON.parse(JSON.stringify(W)), M = w.map, rows = M.rows.map(r => [...r]);
  const open = []; rows.forEach((r, y) => r.forEach((c, x) => { if (c !== '#') open.push([x, y]); }));
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]], s0 = E.createWorld(W), npcAt = new Set(s0.npcs.map(n => n.x + ',' + n.y));
  const wallN = ([x, y]) => dirs.some(([dx, dy]) => rows[y + dy] && rows[y + dy][x + dx] === '#' && y + dy > 0 && x + dx > 0 && y + dy < rows.length - 1 && x + dx < rows[0].length - 1);
  const openN = ([x, y]) => dirs.some(([dx, dy]) => rows[y + dy] && rows[y + dy][x + dx] !== '#' && !npcAt.has((x + dx) + ',' + (y + dy)));
  const P = open.find(c => !npcAt.has(c + '') && wallN(c) && openN(c)); w.player.x = P[0]; w.player.y = P[1];
  // 플레이어 칸 옆 벽 하나를 숨은 칸으로
  const d = dirs.find(([dx, dy]) => { const x = P[0] + dx, y = P[1] + dy; return rows[y] && rows[y][x] === '#' && y > 0 && x > 0 && y < rows.length - 1 && x < rows[0].length - 1; });
  assert.ok(d, '플레이어 옆에 벽이 있어야 시험 가능');
  const sx = P[0] + d[0], sy = P[1] + d[1];
  M.secrets = [{ id: 'hid', x: sx, y: sy, from: P, flag: 'secret_test' }]; w.flagNames = [...(w.flagNames || []), 'secret_test'];
  // 가장 먼 빈칸과 플레이어 옆 빈칸을 계단으로 연결
  const far = open.reduce((a, b) => Math.abs(b[0] - P[0]) + Math.abs(b[1] - P[1]) > Math.abs(a[0] - P[0]) + Math.abs(a[1] - P[1]) ? b : a);
  const near = dirs.map(([dx, dy]) => [P[0] + dx, P[1] + dy]).find(([x, y]) => rows[y] && rows[y][x] !== '#' && !npcAt.has(x + ',' + y));
  M.links = [{ a: near, b: far, name: '계단' }];
  let s = E.createWorld(w);
  assert.equal(E.walkable(w, sx, sy, s), false);
  s = E.dispatch(w, s, { type: 'MOVE_ONE', dx: d[0], dy: d[1] }); s = E.advance(w, s, 10);
  assert.equal(s.flags.secret_test, true); assert.deepEqual([s.player.x, s.player.y], [sx, sy], '숨은 칸으로 들어가야 함');
  assert.equal(C.unpack(w, C.pack(w, s)).flags.secret_test, true, '열린 숨은 공간은 상태 코드에 남아야 함');
  // 계단: 한 걸음 들어가면 반대쪽까지
  let t = E.createWorld(w);
  t = E.dispatch(w, t, { type: 'MOVE_ONE', dx: near[0] - P[0], dy: near[1] - P[1] }); t = E.advance(w, t, 30);
  assert.deepEqual([t.player.x, t.player.y], far, '계단 반대쪽으로 이어져야 함');
});

test('1장 지도: 모든 방이 이어지고(잠긴 옥상·재판장·지배인실 제외), 계단으로 층을 넘고, 숨은 공간 2곳이 열림', () => {
  const w = require('../src/world_ch1.json'); let s = E.createWorld(w);
  const A = w.map.areas, cell = a => { for (let y = a.y0; y <= a.y1; y++) for (let x = a.x0; x <= a.x1; x++) if (E.walkable(w, x, y, s) && !s.npcs.some(n => n.x === x && n.y === y)) return { x, y }; };
  for (const a of A) {
    if (['옥상', '재판장', '지배인실', '갯바위'].includes(a.name)) continue;
    const r = E.dispatch(w, s, { type: 'MOVE_TO', ...cell(a) });
    assert.ok(r.player.route.length > 0 || (r.player.x === cell(a).x && r.player.y === cell(a).y), a.name + '(으)로 가는 길이 없음');
  }
  for (const nm of ['옥상', '재판장', '지배인실']) { const a = A.find(x => x.name === nm); assert.equal(E.dispatch(w, s, { type: 'MOVE_TO', ...cell(a) }).player.route.length, 0, nm + '은(는) 막혀 있어야 함'); }
  for (const q of w.map.secrets) {
    let t = JSON.parse(JSON.stringify(s)); t.player.x = q.from[0]; t.player.y = q.from[1]; t.player.route = [];
    t = E.dispatch(w, t, { type: 'MOVE_ONE', dx: q.x - q.from[0], dy: q.y - q.from[1] }); t = E.advance(w, t, 10);
    assert.equal(t.flags[q.flag], true, q.id); assert.deepEqual([t.player.x, t.player.y], [q.x, q.y], q.id + ' 안으로');
  }
  const lv = w.map.levels.map(l => l.name); assert.deepEqual(lv, ['외부', '1층', '2층', '옥상', '지하']);
  assert.equal(C.pack(w, C.unpack(w, C.pack(w, s))), C.pack(w, s), '1장 세계 상태 코드 왕복');
});

test('1장 물때·사다리: 갯바위는 썰물 때만, 밧줄 사다리는 걷으면 끊김, 바다는 시야를 막지 않음', () => {
  const w = require('../src/world_ch1.json'), T = w.map.areas.find(a => a.name === '갯바위'), R = w.map.areas.find(a => a.name === '바위 해안');
  const lad = w.map.links.find(l => l.name === '밧줄 사다리'), [tx, ty] = lad.b[1] > lad.a[1] ? lad.b : lad.a, [vx, vy] = lad.b[1] > lad.a[1] ? lad.a : lad.b;
  let s = E.createWorld(w); s.player.x = 32; s.player.y = R.y1; s.player.route = [];
  assert.equal(E.walkable(w, tx, ty, s), false, '1일 저녁(밀물)엔 갯바위가 잠김');
  s.clock = E.absTime('2일 15:50'); assert.equal(E.walkable(w, tx, ty, s), true, '썰물엔 걸을 수 있음');
  assert.ok(E.dispatch(w, s, { type: 'MOVE_TO', x: tx, y: ty }).player.route.length > 0, '썰물엔 바위 해안에서 갯바위로 감');
  let v = E.createWorld(w); v.clock = E.absTime('2일 15:50'); v.player.x = vx; v.player.y = vy - 1; v.player.route = [];
  let d = E.dispatch(w, v, { type: 'MOVE_ONE', dx: 0, dy: 1 }); d = E.advance(w, d, 20); assert.deepEqual([d.player.x, d.player.y], [tx, ty], '사다리로 내려감');
  v.flags.ladder_gone = true; d = E.dispatch(w, v, { type: 'MOVE_ONE', dx: 0, dy: 1 }); d = E.advance(w, d, 20); assert.deepEqual([d.player.x, d.player.y], [vx, vy], '사다리를 걷으면 내려가지 못함');
  const dock = w.map.landmarks.find(l => l.id === 'dock_end'), spot = w.map.landmarks.find(l => l.id === 'rope_spot');
  assert.ok(E.lineOfSight(w, dock, { x: spot.x, y: spot.y + 2 }), '선착장 끝에서 바다 건너 바위벽 밑(갯바위)까지 보임');
  // 시야 약속(동업자 확인 11-28): ① 선착장 끝 → 바위벽 ② 벤치 → 비탈 입구는 보이고 바다 쪽 바위벽은 안 보임 ③ 바위 끝 → 바위틈
  const L = id => w.map.landmarks.find(l => l.id === id), cr = L('crevice'), foot = { x: spot.x, y: spot.y + 2 };
  assert.ok(E.lineOfSight(w, L('bench'), L('slope_foot')), '벤치에서 비탈 입구가 보여야 함');
  assert.ok(!E.lineOfSight(w, L('bench'), foot) && !E.lineOfSight(w, L('bench'), cr), '벤치에서 바다 쪽 바위벽·바위틈은 안 보여야 함');
  assert.ok(E.lineOfSight(w, L('rock_edge'), cr), '바위 끝에서 바위틈이 내려다보여야 함');
  for (const nm of ['바위 해안', '해안 산책로', '해변', '이끼 비탈', '앞마당']) { const a = w.map.areas.find(x => x.name === nm);
    for (let y = a.y0; y <= a.y1; y++) for (let x = a.x0; x <= a.x1; x++) if (w.map.rows[y][x] !== '#') assert.ok(!E.lineOfSight(w, { x, y }, cr) && !E.lineOfSight(w, { x, y }, foot), nm + ' ' + x + ',' + y + '에서 바위틈·바위벽 밑이 보이면 안 됨'); }
});

test('1장 기본 루트 일정: 시간표 v2.1 순서대로 흘러가고, 20:10 전 비탈을 밟은 사람은 바룬 한 명', () => {
  const w = require('../src/world_ch1.json'); let s = E.createWorld(w); s.player.x = 1; s.player.y = w.map.levels[1].y0 + 1;
  const at = {}, slope = new Set(), J = () => s.npcs.find(n => n.id === 'justin'), slopeI = w.map.areas.findIndex(a => a.name === '이끼 비탈');
  const until = E.absTime('2일 20:40'), t10 = E.absTime('2일 20:10');
  while (s.clock < until) { s = E.advance(w, s, 60);
    for (const f of Object.keys(s.flags)) if (s.flags[f] && at[f] === undefined) at[f] = s.clock;
    if (s.clock < t10) for (const n of s.npcs) if (E.areaOf(w, n.x, n.y) === slopeI) slope.add(n.id);
    if (s.cases && s.cases.J1 && at.case === undefined) at.case = s.clock; }
  const T = v => E.absTime(v), inn = (f, a, b) => assert.ok(at[f] >= T(a) && at[f] <= T(b), f + ' 시각 ' + (at[f] === undefined ? '없음' : ((at[f] / 3600) % 24).toFixed(2)) + ' (기대 ' + a + '~' + b + ')');
  inn('spares_taken', '1일 23:20', '2일 00:10'); inn('spares_hidden', '2일 02:20', '2일 04:40'); inn('suzune_told', '2일 09:40', '2일 10:10');
  inn('ladder_gone', '2일 12:40', '2일 13:20'); inn('justin_fell', '2일 16:00', '2일 16:40'); inn('band_thrown', '2일 18:30', '2일 18:50');
  inn('justin_dead', '2일 18:40', '2일 19:00'); inn('case', '2일 20:15', '2일 20:40');
  assert.deepEqual([...slope], ['varun'], '20:10 전에 비탈을 밟은 사람: ' + [...slope].join(','));
  assert.ok(['varun', 'suzune', 'killian'].includes(s.npcs[s.cases.J1[2] - 1].id), '발견자는 수색대(바위 끝)');
  s.player.batAt = s.clock; s.player.batUsed = 0;   // 시험용 플레이어는 내내 화장실에 있었으니 전지만 새로
  const loc = E.dispatch(w, s, { type: 'DEVICE', op: 'locate', npcId: 'justin' }).player.lastLocate, sl = w.map.landmarks.find(l => l.id === 'shore_ledge');
  assert.deepEqual([loc.x, loc.y], [sl.x, sl.y], '팔찌를 던진 뒤 위치 조회는 팔찌 자리(바위 해안)');
});

test('1장 재판(K1) 데이터: 인물·표정(36종)·증거·정답 위치·보기·동선·반론 연결이 맞음', () => {
  const w = require('../src/world_ch1.json'), T = w.trials.find(t => t.code === 'K1'); assert.ok(T, 'K1 재판');
  const src = require('fs').readFileSync(require('path').join(__dirname, '../src/component.jsx'), 'utf8');
  const core = src.match(/const TR_FACES = \[([^\]]+)\]/)[1].match(/'([^']+)'/g).map(x => x.slice(1, -1));
  const fb = src.match(/const TR_FB = \{([\s\S]+?)\};/)[1].match(/'?([가-힣 ]+)'?:/g).map(x => x.replace(/[':]/g, '').trim());
  const FACES = new Set([...core, ...fb]), ids = new Set(w.npcs.map(n => n.id)), items = new Set(w.items.map(i => i.id)), iss = new Set(T.issues.map(i => i.id));
  const see = (l, where) => { if (!l) return; if (l.face) assert.ok(FACES.has(l.face), where + ' 표정 ' + l.face); if (l.who && !['host', 'me'].includes(l.who)) assert.ok(ids.has(l.who), where + ' 인물 ' + l.who); (l.alt || []).forEach(a => see(a, where)); if (l.if && l.if.item) assert.ok(items.has(l.if.item), where + ' 물건 ' + l.if.item); };
  T.evidence.forEach(e => assert.ok(items.has(e), '증거 ' + e));
  T.phases.forEach((ph, k) => { const at = 'K1 ' + k + ' ' + ph.type;
    if (ph.issue) assert.ok(iss.has(ph.issue), at + ' 쟁점');
    (ph.lines || []).forEach(l => see(l, at)); Object.values(ph.miss || {}).forEach(l => see(l, at)); (ph.show || []).forEach(l => see(l, at));
    if (ph.type === 'nonstop' || (ph.type === 'rebut' && ph.lines)) { const segs = ph.lines.map(l => (l.text.match(/\{[^}]+\}/g) || []).length);
      ph.answers.forEach(a => { assert.ok(a.at[1] < segs[a.at[0]], at + ' 구절 위치'); (a.ev || []).forEach(e => assert.ok(T.evidence.includes(e), at + ' 증거 ' + e)); }); }
    if (ph.type === 'choice') { assert.equal(ph.options.filter(o => o.ok).length, 1, at + ' 정답 하나'); ph.options.forEach(o => see(o.miss, at)); }
    if (ph.type === 'crystal') ph.slots.forEach(sl => assert.ok(sl.options.includes(sl.answer), at + ' ' + sl.label));
    if (ph.type === 'vote') assert.ok(ph.options.includes(ph.answer) && ph.options.every(o => ids.has(o)), at);
    if (ph.type === 'dream') ph.rounds.forEach((r, ri) => r.ask.forEach(([sd, f]) => { const v = r[sd][f], opt = { who: [...ph.cast, ''], obj: [...ph.objs, ''], at: ph.ats, time: ph.times, act: ph.acts, to: ph.cast }[f];
      assert.ok(opt && opt.includes(v), at + ' 조각 ' + ri + ' ' + sd + '.' + f + '=' + v); (ph.objs || []).forEach(o => assert.ok(items.has(o), at + ' 물건 ' + o)); }));
    if (ph.type === 'route') { assert.ok(E.walkable(w, ...ph.start) && E.walkable(w, ...ph.end) && ph.via.every(v => E.walkable(w, ...v)), at + ' 동선 칸');
      let s = E.createWorld(w); s.clock = E.absTime('2일 15:50'); s.player.x = ph.start[0]; s.player.y = ph.start[1]; assert.ok(E.dispatch(w, s, { type: 'MOVE_TO', x: ph.end[0], y: ph.end[1] }).player.route.length > 0, at + ' 길이 이어짐'); }
  });
  T.issues.filter(i => i.confirmAt !== undefined).forEach(i => assert.equal(T.phases[i.confirmAt].type, 'crystal'));
  for (const [k, ev] of Object.entries(w.events)) { const TT = w.trials.find(t => t.code === ev.trial); assert.equal(TT.phases[ev.phase].type, 'rebut', k); }
  const C = w.trials.find(t => t.code === 'J1'); assert.deepEqual(C.then, [{ code: 'K1' }]); C.phases.find(p => p.type === 'investigate').grant.forEach(g => assert.ok(items.has(g), '조사 지급 ' + g));
});

test('팔찌 전지: 시간·기능으로 줄고, 교체하면 새로, 0 뒤 1분이면 사망, 상태 코드에 남음', () => {
  const w = require('../src/world_ch1.json'); let s = E.createWorld(w);
  let b = E.battery(w, s); assert.equal(b.left, 43200); assert.equal(b.cells, 7);
  s = E.advance(w, s, 3600); assert.equal(E.battery(w, s).left, 43200 - 3600);
  s = E.dispatch(w, s, { type: 'DEVICE', op: 'locate', npcId: 'justin' }); assert.equal(E.battery(w, s).left, 43200 - 3600 - 10800);
  assert.ok(s.player.lastLocate && s.player.lastLocate.id === 'justin');
  s = E.dispatch(w, s, { type: 'DEVICE', op: 'photo' }); s = E.dispatch(w, s, { type: 'DEVICE', op: 'call', minutes: 2 });
  assert.equal(E.battery(w, s).left, 43200 - 3600 - 10800 - 300 - 1200);
  const back = C.unpack(w, C.pack(w, s)); assert.equal(E.battery(w, back).left, E.battery(w, s).left); assert.equal(E.battery(w, back).cells, 7);
  s = E.dispatch(w, s, { type: 'DEVICE', op: 'swap' }); s = E.advance(w, s, 60); assert.equal(E.battery(w, s).left, 43200); assert.equal(E.battery(w, s).cells, 6);
  let q = JSON.parse(JSON.stringify(s)); q.player.batUsed = 43200 - 6900; q = E.dispatch(w, q, { type: 'DEVICE', op: 'locate', npcId: 'justin' });
  assert.equal(E.battery(w, q).left, 6900, '남은 1시간 55분으로는 3시간짜리 조회를 못 함(쓰다 꺼지지 않음)'); assert.ok(q.devShort && q.devShort.op === 'locate');
  q = E.dispatch(w, q, { type: 'DEVICE', op: 'swap' }); q = E.advance(w, q, 60); q = E.dispatch(w, q, { type: 'DEVICE', op: 'locate', npcId: 'justin' });
  assert.equal(E.battery(w, q).left, 43200 - 10800, '일찍 갈아 끼우면(남은 시간은 버려짐) 바로 조회 가능');
  let d = JSON.parse(JSON.stringify(s)); d.player.batUsed = 43200; d = E.advance(w, d, 59); assert.equal(E.battery(w, d).dead, false);
  d = E.advance(w, d, 2); assert.equal(E.battery(w, d).dead, true);
});

test('재판장 문: 공지 전에는 막히고 1·2회 경고, 3회째 게임 오버, 열리면 통과', () => {
  const w = require('../src/world_ch1.json'), G = w.map.guards[0]; let s = E.createWorld(w);
  const [gx, gy] = G.cells[0]; s.player.x = gx - 1; s.player.y = gy; s.player.route = [];
  for (let i = 1; i <= 3; i++) { s = E.dispatch(w, s, { type: 'MOVE_ONE', dx: 1, dy: 0 }); assert.deepEqual([s.player.x, s.player.y], [gx - 1, gy], '들어가면 안 됨'); assert.equal(s.guardHit.n, i); }
  assert.equal(!!s.flags.court_warn1 && !!s.flags.court_warn2 && !!s.flags.court_over, true);
  let o = E.createWorld(w); o.player.x = gx - 1; o.player.y = gy; o.flags.court_open = true;
  o = E.dispatch(w, o, { type: 'MOVE_ONE', dx: 1, dy: 0 }); o = E.advance(w, o, 10); assert.deepEqual([o.player.x, o.player.y], [gx, gy], '열리면 지나감');
});
for (const [name, fn] of tests) { try { fn(); pass++; console.log('✓', name); } catch (e) { console.log('✗', name, '\n  ', e.message); } }
console.log(`${pass}/${tests.length} 통과`);
process.exit(pass === tests.length ? 0 : 1);
