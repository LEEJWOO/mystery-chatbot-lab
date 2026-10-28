# MysteryTestHub — 통합 사건 플레이 테스트

UUMMAI 단일 컴포넌트 `MysteryTestHub`용 미스터리 어드벤처. **초기 화면에서 바로 플레이하며 `/n차` 명령은 필요 없다.** 기본 배경은 《폐관 직전의 기록실》이다.

- `MysteryTestHub.jsx`: 등록용 단일 JSX, 24종 기본 방향 에셋 포함
- `MAIN_PROMPT_ADDENDUM.md`: 기존 운영 프롬프트에 추가하는 LLM 인계 규칙
- `NPC_LOREBOOK_TEST.md`: 제작자용 비공개 사건 진상과 NPC 성격; 공개 저장소에 게시하지 말 것
- `data/world.json`: 공개 월드와 확정된 고정 문구
- `src/hub_worker.mjs`: 기존 lab13 Worker의 `/hub/*` API
- `integration/lab13/src/worker.mjs`: 기존 Worker 경로를 유지하면서 hub API를 추가한 교체 후보
- `WORKER_SETUP.md`: GitHub Actions와 KV 연결 방법
- `SMOKE_TESTS.md`: 수동 검증 시나리오
- `tests`: Node 테스트 및 JSX 구문 검사

실행 시 `MysteryTestHub`를 그대로 등록하고 `<MysteryTestHub />`를 첫 장면으로 출력한다. Worker가 실제로 배포되었다면 `<MysteryTestHub worldUrl="https://실제-호스트/hub/world.json" />`로 시작할 수 있다.

Node 테스트: `npm test` (외부 의존성 없음). JSX 구문 검사는 TypeScript 설치가 필요한 개발 환경에서 `npm run check:jsx`.

## 현 시점 제한

UUMMAI 실제 설치 및 LLM 응답 이벤트는 원격에서 확인되지 않았다. Worker API는 로컬에서 테스트되지만 Cloudflare에 배포되지 않았다. 중요한 상태의 KV 저장은 namespace 연결 후 작동한다. 2D 이미지는 8방향 SVG 시제품이며 상용 일러스트 수준의 완성 에셋은 아니다. 탐색·대화·사건 상태의 통합 연결을 검증하는 플레이어블 프로토타입으로 취급한다.