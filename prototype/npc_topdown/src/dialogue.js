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
  // 화면 3줄에 넘치는 발화는 같은 화자의 여러 페이지로 나눈다(전각 1칸, 반각 0.55칸 기준).
  const PAGE = 54;
  const width = ch => /[\u1100-\u11ff\u3000-\u9fff\uac00-\ud7af\uff00-\uffef]/.test(ch) ? 1 : 0.55;
  function paginate(lines, limit = PAGE) {
    const out = [];
    for (const l of lines) {
      let rest = Array.from(l.text);
      while (rest.length) {
        let w = 0, cut = rest.length;
        for (let i = 0; i < rest.length; i++) { w += width(rest[i]); if (w > limit) { cut = i; break; } }
        if (cut < rest.length) { // 가능하면 문장부호·공백에서 자른다
          let b = -1; for (let i = cut; i > cut * 0.5; i--) if (/[\s.,!?…。、~」]/.test(rest[i - 1])) { b = i; break; }
          if (b > 0) cut = b;
        }
        out.push({ ...l, text: rest.slice(0, cut).join('').trim() }); rest = rest.slice(cut);
        while (rest.length && /\s/.test(rest[0])) rest.shift();
      }
    }
    return out.filter(x => x.text);
  }
  // 끼어들기: 내가 한 말은 전부, 상대 대사는 '가장 멀리 읽은 위치'까지만 대화 시간에 넣는다.
  function partialSeconds(lines, lineIndex, chars, userChars) {
    const seen = lines.slice(0, lineIndex).reduce((n, l) => n + Array.from(l.text).length, 0) + Math.max(0, chars | 0);
    return Math.max(5, Math.min(600, Math.ceil(((userChars | 0) + seen) / 6) + 4));
  }
  // kind: T 대화, I 끼어들기, A 추리 제시, P 자유 행동. ctx: 화면이 실제 상태로 만든 사실 줄(대상 상태·기억, 내 단서).
  function handoff({ kind, target = '', where = '', time = '', marks = [], ctx = [], cut = '', text = '', code }) {
    const head = ['TRM1', kind, target, cut ? 'cut=' + cut : ''].filter(Boolean).join(' ');
    const where2 = [time, where, ...marks].filter(Boolean).join(' ');
    return [head + (where2 ? ' | ' + where2 : ''), ...ctx.filter(Boolean), text, 's=' + code].filter(Boolean).join('\n');
  }
  return { parse, paginate, partialSeconds, handoff };
})();
if (typeof module !== 'undefined') module.exports = TroemereiTalk;
