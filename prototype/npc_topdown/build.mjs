// 모듈 원본을 UUMMAI 등록용 단일 JSX(import/fetch/외부 에셋 없음)와 브라우저 시험용 HTML로 묶는다.
import fs from 'node:fs';
import { transformSync } from 'esbuild';

const read = p => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const strip = code => code.replace(/\nif\s*\(typeof module[^\n]*\n?/g, '\n');
const world = JSON.parse(read('./src/world.json'));
const jsx = [
  '// 몽환의 트로이메라이 · 탑다운 시험판 v0.4 (TRM1) — UUMMAI에 컴포넌트 1개로 등록: 이름 Troemerei',
  '// import·fetch·외부 에셋·브라우저 저장소 없음. useState/useEffect/useRef/useMemo/sendMessage는 호스트 제공.',
  '// AI 출력 형식: <Troemerei s=\'상태코드\' d=\'이름:대사|*서술\' />  (자유 행동 응답에만 t=\'초\', 사건 코드 e=\'…\')',
  'const TN_WORLD = ' + JSON.stringify(world) + ';',
  'const TN_CSS = ' + JSON.stringify(read('./src/style.css')) + ';',
  // 이미지 ID → 주소 표. 플랫폼별 파일(assets.<플랫폼>.json)을 골라 넣는다. 기본: uummai
  'const TN_ASSETS = ' + JSON.stringify(JSON.parse(read('./src/assets.' + (process.env.PLATFORM || 'uummai') + '.json'))) + ';',
  strip(read('./src/engine.js')),
  strip(read('./src/codec.js')),
  strip(read('./src/dialogue.js')),
  read('./src/component.jsx'),
].join('\n')
  // 등록용 출력에서는 내부 객체 이름을 소문자로 바꿔, UUMMAI 컴포넌트 목록에 Troemerei 하나만 보이게 한다.
  .replace(/\bTroemereiNPC\b/g, 'trNPC').replace(/\bTroemereiCodec\b/g, 'trCodec').replace(/\bTroemereiTalk\b/g, 'trTalk');
fs.mkdirSync(new URL('./dist/', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('./dist/Troemerei.jsx', import.meta.url), jsx);

// 문법 검사 겸 브라우저 시험본 생성
const js = transformSync(jsx, { loader: 'jsx', jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment' }).code;
const react = read('./node_modules/react/umd/react.production.min.js');
const reactDom = read('./node_modules/react-dom/umd/react-dom.production.min.js');
const harness = read('./tools/harness.js');
const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Troemerei v0.4 시험</title>
<style>body{margin:0;background:#f4f4f2}#root{max-width:360px;margin:12px auto}#mock{background:#101b29;color:#dce6f0;font:13px system-ui,sans-serif;padding:12px;border-top:1px solid #2b3d50}#mock textarea{width:100%;box-sizing:border-box;min-height:90px;background:#08121c;color:#e6eef7;border:1px solid #34495d;border-radius:8px;padding:8px;font:12px ui-monospace,monospace}#mock button{margin-top:6px;padding:8px 12px;border-radius:8px;border:1px solid #4a6378;background:#1d3346;color:#fff}</style></head>
<body><div id="root"></div><div id="mock"><b>모의 AI (브라우저 시험 전용)</b><div id="sentBox" style="white-space:pre-wrap;font:11px ui-monospace,monospace;margin:6px 0;color:#9fc6dd"></div><textarea id="reply" placeholder="AI가 출력할 &lt;Troemerei s='…' t='…' d='…' /&gt; 태그를 붙여넣기"></textarea><button id="apply">새 화면으로 적용</button></div>
<script>${react}</script><script>${reactDom}</script>
<script>const {useState,useEffect,useRef,useMemo}=React;
${js}
${harness}</script></body></html>`;
fs.writeFileSync(new URL('./dist/Troemerei_Standalone.html', import.meta.url), html);
console.log('Troemerei.jsx', jsx.length, '자 /', Buffer.byteLength(jsx), '바이트');
