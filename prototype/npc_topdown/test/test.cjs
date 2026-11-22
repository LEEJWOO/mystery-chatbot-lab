// node test/test.cjs — 엔진·압축 코덱·대사 해석 회귀 테스트
const assert = require('node:assert/strict');
const E = require('../src/engine.js'), C = require('../src/codec.js'), T = require('../src/dialogue.js');
const W = require('../src/world.json');
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
  assert.ok(max < 220, '상태 코드가 너무 김: ' + max);
  console.log('   상태 코드 최대 길이', max, '자 / 원래 JSON', JSON.stringify(s).length, '자');
});
test('손상 검출: 한 글자 바뀌면 체크섬 오류, 다른 맵이면 거부', () => {
  const code = pk(E.advance(W, E.createWorld(W), 90));
  const i = Math.floor(code.length / 2), bad = code.slice(0, i) + (code[i] === 'A' ? 'B' : 'A') + code.slice(i + 1);
  assert.throws(() => C.unpack(W, bad), /손상|잘렸|알 수 없는|오류/);
  const other = JSON.parse(JSON.stringify(W)); other.map.id = 'other';
  assert.throws(() => C.unpack(other, code), /다른 맵/);
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
test('끼어들기: 본 글자 비율만큼만 시간 반영', () => {
  const l = T.parse('가:1234567890|나:1234567890');
  assert.equal(T.partialSeconds(l, 0, 5, 40), 10);
  assert.equal(T.partialSeconds(l, 1, 10, 40), 40);
});
test('인계 메시지 형식: 한 줄 머리말 + 입력 + 상태 코드', () => {
  const msg = T.handoff({ kind: 'I', target: '유리', cut: '2/3:15', where: '정원', time: '09:01', text: '잠깐만요', code: 'AbC' });
  assert.equal(msg, 'TRM1 I 유리 cut=2/3:15 | 09:01 정원\n잠깐만요\ns=AbC');
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

for (const [name, fn] of tests) { try { fn(); pass++; console.log('✓', name); } catch (e) { console.log('✗', name, '\n  ', e.message); } }
console.log(`${pass}/${tests.length} 통과`);
process.exit(pass === tests.length ? 0 : 1);
