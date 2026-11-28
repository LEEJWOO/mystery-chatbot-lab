// 모듈 원본을 UUMMAI 등록용 단일 JSX(import·fetch 없음)와 브라우저 시험용 HTML로 묶는다.
import fs from 'node:fs';
import { transformSync } from 'esbuild';

const read = p => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const strip = code => code.replace(/\nif\s*\(typeof module[^\n]*\n?/g, '\n');
// WORLD=ch1 이면 본편 1장 세계(src/world_ch1.json)로, 결과 파일 이름에 _ch1을 붙인다. 기본은 시험 세계.
const WN = process.env.WORLD || '', SUF = WN ? '_' + WN : '';
const world = JSON.parse(read('./src/world' + SUF + '.json'));
// 그림 주소 표(tools/assets.py가 만든다). ASSET_URL을 주면 주소 앞부분만 바꾼다(브라우저 시험용 로컬 경로 등).
const assets = JSON.parse(read('./src/assets.' + (process.env.ASSETS || 'web') + '.json'));
if (process.env.ASSET_URL) assets.url = process.env.ASSET_URL;
// 본편 세계는 시험판 지도 그림·방 배경을 쓰지 않는다(1장 지도 그림 mapCh1이 있으면 그것을 씀).
if (WN) { if (assets.mapCh1) assets.map = assets.mapCh1; else delete assets.map; assets.bgExtra = assets.bg; assets.bg = assets.bgCh1 || {}; }  // 1장 지도 그림(대략판) · 시험판 배경은 갤러리 미리보기용으로만
delete assets.mapCh1;
const makeJsx = assets => [
  '// 몽환의 트로이메라이 · 탑다운 시험판 v2.0 (TRM1) — UUMMAI에 컴포넌트 1개로 등록: 이름 Troemerei',
  '// import·fetch·브라우저 저장소 없음. 그림은 아래 TN_ASSETS의 외부 이미지 주소(<img>·CSS 배경)로만 불러온다. useState/useEffect/useRef/useMemo/sendMessage는 호스트 제공.',
  '// AI 출력 형식: <Troemerei s=\'상태코드\' d=\'이름(표정):대사|*서술\' />  (자유 행동 t=\'초\', 사건 e=\'…\', 증언 k=\'기억K3R8@줄\', 화면 밖 대화 f=\'1\')',
  'const TN_WORLD = ' + JSON.stringify(world) + ';',
  'const TN_CSS = ' + JSON.stringify(read('./src/style.css')) + ';',
  // 이미지 ID → 주소 표. 플랫폼별 파일(assets.<플랫폼>.json)을 골라 넣는다. 기본: uummai
  'const TN_ASSETS = ' + JSON.stringify(assets) + ';',
  strip(read('./src/engine.js')),
  strip(read('./src/codec.js')),
  strip(read('./src/dialogue.js')),
  read('./src/component.jsx'),
].join('\n')
  // 등록용 출력에서는 내부 객체 이름을 소문자로 바꿔, UUMMAI 컴포넌트 목록에 Troemerei 하나만 보이게 한다.
  .replace(/\bTroemereiNPC\b/g, 'trNPC').replace(/\bTroemereiCodec\b/g, 'trCodec').replace(/\bTroemereiTalk\b/g, 'trTalk');
const jsx = makeJsx(assets);
fs.mkdirSync(new URL('./dist/', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('./dist/Troemerei' + SUF + '.jsx', import.meta.url), jsx);

// 문법 검사 겸 브라우저 시험본 생성
const makeHtml = jsx => { const js = transformSync(jsx, { loader: 'jsx', jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment' }).code;
const react = read('./node_modules/react/umd/react.production.min.js');
const reactDom = read('./node_modules/react-dom/umd/react-dom.production.min.js');
const harness = read('./tools/harness.js');
const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Troemerei v2.0 시험</title>
<style>body{margin:0;background:#f4f4f2}#root{max-width:360px;margin:12px auto}#mock{background:#101b29;color:#dce6f0;font:13px system-ui,sans-serif;padding:12px;border-top:1px solid #2b3d50}#mock textarea{width:100%;box-sizing:border-box;min-height:90px;background:#08121c;color:#e6eef7;border:1px solid #34495d;border-radius:8px;padding:8px;font:12px ui-monospace,monospace}#mock button{margin-top:6px;padding:8px 12px;border-radius:8px;border:1px solid #4a6378;background:#1d3346;color:#fff}</style></head>
<body><div id="root"></div><div id="mock"><b>모의 AI (브라우저 시험 전용)</b><div id="sentBox" style="white-space:pre-wrap;font:11px ui-monospace,monospace;margin:6px 0;color:#9fc6dd"></div><textarea id="reply" placeholder="AI가 출력할 &lt;Troemerei s='…' t='…' d='…' /&gt; 태그를 붙여넣기"></textarea><button id="apply">새 화면으로 적용</button></div>
<script>${react}</script><script>${reactDom}</script>
<script>const {useState,useEffect,useRef,useMemo}=React;
${js}
${harness}</script></body></html>`;
return html; };
fs.writeFileSync(new URL('./dist/Troemerei' + SUF + '_Standalone.html', import.meta.url), makeHtml(jsx));
// 오프라인 시험본(로컬 전용): OFFLINE_DIR의 그림을 data: 주소로 시험용 HTML에만 넣는다. 등록용 JSX에는 넣지 않으며 저장소에도 올리지 않는다.
if (process.env.OFFLINE_DIR) {
  const off = JSON.parse(JSON.stringify(assets).replace(/"([0-9a-f]{12}\.webp)"/g, (m, n) => { const f = process.env.OFFLINE_DIR + '/' + n; return fs.existsSync(f) ? JSON.stringify('data:image/webp;base64,' + fs.readFileSync(f).toString('base64')) : m; }));
  // LOCAL_EXTRA: 저장소에 올리지 않는 그림(속옷 보행 도트 등) 목록 JSON. 오프라인 시험본에만 넣는다.
  if (process.env.LOCAL_EXTRA && fs.existsSync(process.env.LOCAL_EXTRA)) {
    const ex = JSON.parse(fs.readFileSync(process.env.LOCAL_EXTRA, 'utf8'));
    off.spritesExtra = (ex.spritesExtra || []).map(s => ({ ...s, src: 'data:image/png;base64,' + fs.readFileSync(s.file).toString('base64'), file: undefined }));
  }
  fs.writeFileSync(new URL('./dist/Troemerei' + SUF + '_Offline.html', import.meta.url), makeHtml(makeJsx(off)));
  console.log('오프라인 시험본 생성(로컬 전용)');
}
console.log('Troemerei' + SUF + '.jsx', jsx.length, '자 /', Buffer.byteLength(jsx), '바이트');

// 기억 코드 로어북(본편 비밀은 채팅에 보이지 않게 코드로 보내고, 내용은 로어북에 둔다). 코드는 사실마다 고정(world.facts[].code).
const codes = world.facts.map(f => f.code);
if (codes.some(c => !/^[A-Z0-9]{4}$/.test(c || '')) || new Set(codes).size !== codes.length) throw Error('facts[].code는 서로 다른 영문 대문자·숫자 4자여야 합니다');
const lore = ['기억 코드 로어북 — 항목마다 따로 등록. 키워드는 「기억+코드」, 검색 범위는 「현재 유저 입력만」.', ''];
world.facts.forEach(f => {
  const self = Object.entries(f.self || {}).map(([id, t]) => `(직접·${(world.npcs.find(n => n.id === id) || {}).name || id}) ${t}`);
  lore.push(`[항목] 이름: 기억${f.code}`, `- 키워드: 기억${f.code} / 검색 범위: 현재 유저 입력만`, '- 내용:',
    `기억${f.code}: ` + [...self, f.seen ? '(목격) ' + f.seen : ''].filter(Boolean).join(' / ') + ' — 이 기억은 메시지의 기억 줄에 이 코드가 있는 인물만 안다.', '');
});
fs.writeFileSync(new URL('./dist/MEMORY_LOREBOOK' + SUF + '.txt', import.meta.url), lore.join('\n'));
