/* AI 대사 문자열 해석 + AI 인계 메시지 생성.
   대사 형식(d 속성): 줄 구분은 |, 인물 대사는 `이름:대사` 또는 `이름(표정):대사`, 서술은 `*서술`.
   색·속도·크기 같은 연출 기본값은 JSX가 가진다(AI가 매번 적지 않는다). */
const TroemereiTalk = (() => {
  const LINE = /^([^:：*|()]{1,20})(?:\(([^()]{1,20})\))?\s*[:：]\s*(.+)$/s;
  // 괄호 안: 표정과 움직임을 · , / 로 함께 쓸 수 있다. 예) 유리(놀람·흔들림):…  움직임: 흔들림·다가섬·번쩍·깨짐
  const FX = { '흔들림': 'shake', '흔들': 'shake', shake: 'shake', '다가섬': 'zoom', '다가': 'zoom', zoom: 'zoom', '번쩍': 'flash', flash: 'flash', '깨짐': 'crack', crack: 'crack' };
  function face(expr) { const t = String(expr || '').split(/[·,\/\s]+/).filter(Boolean); return { expression: t.filter(x => !FX[x]).join(' '), fx: (t.map(x => FX[x]).find(Boolean)) || '' }; }
  function parse(raw) {
    if (!raw) return [];
    return String(raw).split('|').map(x => x.trim()).filter(Boolean).slice(0, 24).map(part => {
      if (part[0] === '*') return { speaker: '', expression: '', text: part.slice(1).trim().slice(0, 600), narration: true };
      const m = LINE.exec(part);
      if (!m || /^\d+$/.test(m[1].trim())) return { speaker: '', expression: '', text: part.slice(0, 600), narration: true };
      return { speaker: m[1].trim(), ...face(m[2]), text: m[3].trim().slice(0, 600), narration: false };
    }).filter(x => x.text);
  }
  // 화면 3줄에 넘치는 발화는 같은 화자의 여러 페이지로 나눈다(전각 1칸, 반각 0.55칸 기준).
  const PAGE = 54;
  const width = ch => /[\u1100-\u11ff\u3000-\u9fff\uac00-\ud7af\uff00-\uffef]/.test(ch) ? 1 : 0.55;
  // 각 페이지에 원본 줄 번호(src)와 그 줄 안에서의 시작 글자 위치(off)를 남긴다 → 끼어들기 위치·증언 시점을 원본 기준으로 계산.
  function paginate(lines, limit = PAGE) {
    const out = [];
    lines.forEach((l, src) => {
      const all = Array.from(l.text); let pos = 0;
      while (pos < all.length) {
        let w = 0, cut = all.length - pos;
        for (let i = pos; i < all.length; i++) { w += width(all[i]); if (w > limit) { cut = i - pos; break; } }
        if (pos + cut < all.length) { let b = -1; for (let i = cut; i > cut * 0.5; i--) if (/[\s.,!?…。、~」]/.test(all[pos + i - 1])) { b = i; break; } if (b > 0) cut = b; }
        const text = all.slice(pos, pos + cut).join('');
        if (text.trim()) out.push({ ...l, text, src, off: pos });
        pos += cut;
      }
    });
    return out;
  }
  // 화면 페이지 위치(idx, 글자 수) → 원본 줄 위치(줄 번호 0부터, 그 줄 안 글자 수)
  function origPos(pages, idx, chars) { const p = pages[idx]; return p ? [p.src, p.off + chars] : [0, 0]; }
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
  return { parse, paginate, origPos, partialSeconds, handoff };
})();
if (typeof module !== 'undefined') module.exports = TroemereiTalk;
