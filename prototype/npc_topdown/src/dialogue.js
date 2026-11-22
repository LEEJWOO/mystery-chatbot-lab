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
if (typeof module !== 'undefined') module.exports = TroemereiTalk;
