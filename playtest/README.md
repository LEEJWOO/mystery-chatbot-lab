# MysteryTestHub — 안정화 패키지 (2026-11-01)

등록 파일은 `MysteryTestHub.jsx`다. 새 UUMMAI 시험 챗봇에서 `<MysteryTestHub />`로 시작한다. 외부 맵은 `<MysteryTestHub worldUrl="https://mystery-scene-lab13.hgschat.workers.dev/hub/world.json" />`로 확인한다. 옛 1~12차 시험 컴포넌트와 같은 등록 이름이므로 기존 챗봇을 자동으로 덮어쓰지 않는다.

정본·수정·미완료 사항: [audit/STATUS_AND_HANDOFF.md](audit/STATUS_AND_HANDOFF.md). 프롬프트 보완: [MAIN_PROMPT_ADDENDUM.md](MAIN_PROMPT_ADDENDUM.md).

- 원본 코드: `src/core.mjs`, `src/view.jsx`
- 원본 데이터: `data/world.json`, `assets/npcs/*.svg`
- 생성: `npm run build` → 등록용 JSX와 generated 모듈. 생성 파일 직접 수정 금지.
- 회귀: `npm ci && npm test && npm run check:jsx`
- 브라우저: `npx playwright install --with-deps chromium && npm run test:browser`
- 측정: `node measure.mjs`
- 기존 Worker 결합 빌드: 저장소 루트 기준 `cd lab13 && npm ci && npm test && npm run build`

기존 Worker/KV 배포는 확인됐다. **이번 안정화 서버 변경은 미배포**이며 UUMMAI 최신 통합 실기는 별도다. 공개 시험 맵/에셋만 포함한다. 본편 진상·NPC 비공개 로어북은 추가하지 않았다. 이전 문서에 기재된 로컬 전용 파일이 공개 저장소에도 있는 것으로 해석하지 않는다.
