# IntegrationScene13 — 챗봇 종합 구현 테스트

## 이번에 검증할 것
랭킹 없음. 헌터 서바이버즈의 소스·그림은 포함하지 않았고, 상태/표시 분리와 데이터 기반 조합 방식만 응용했다. 기존 mystery-chatbot-lab 캐릭터 에셋을 재사용했다.

- 5×3 조사 공간, 8방향 이동, 유효 이동에만 1분 소모
- 근무표 → 경비원에게 제시 → 열쇠 → 자료실 → 기록부
- 배경/캐릭터/표정/의상 레이어 합성
- 증거 수첩, 조건 해금, 중복 보상 방지
- 버전 있는 JSON 체크포인트와 명시적 복원
- 현재 화면에 공개된 대사와 전체 상태를 AI로 인계; 인계 후 기존 패널 조작 잠금
- 동일 상태를 완성 SVG 이미지로 출력하는 Cloudflare Worker

## UUMMAI
`IntegrationScene13.jsx` 전체를 별도 컴포넌트 `IntegrationScene13`으로 등록한다. 기존 MysteryTestHub 1~12는 수정하지 않는다.
이 파일에는 import/export가 없고, useState/useRef 및 sendMessage를 호스트가 제공해야 한다. fetch, DOM 직접 접근, localStorage가 없다.

```jsx
<IntegrationScene13 />
```
이전 상태를 전달할 때는 `initial`에 JSON 문자열을 넣는다. initial은 최초 마운트에서만 읽는다. 같은 패널을 재사용한다면 React key를 새롭게 지정하거나 UI의 JSON 복원을 사용한다.

```jsx
<IntegrationScene13 initial='{"v":1,...실제 체크포인트 전체...}' />
```
위 JSON은 형식 설명용이며 유효한 예제가 아니다. `sample-state.json`의 실제 JSON 또는 화면에서 내보낸 JSON을 사용한다.
외부 이미지 허용은 별도 조건이다. 기존 에셋 주소는 raw.githubusercontent.com이다. 그림이 차단되면 UI에 오류가 뜬다.

## 브라우저 테스트
`standalone.html`을 열면 React가 포함된 실행본이 열린다. 이미지에는 인터넷이 필요하다.
또는 `npm ci && npm run build` 후 `python3 -m http.server 8080 -d dist` → http://localhost:8080
독립 웹 데모는 sendMessage를 호출하는 대신 수신 결과를 아래 텍스트칸에 출력한다. 이 결과가 실제 AI의 응답은 아니다.

## 재현 동선 / 기대값
초기 09:05, (1,1).
오른쪽 2회 → 근무표 클릭 → 왼쪽 2회 → 경비원 클릭 → 오른쪽 2회 → 자료실 문 클릭 → 오른쪽 2회 → 기록부 클릭.
기대: 09:19 / 자료실 / 근무표·열쇠·기록부 3개 / 모순 질문 해금.
근무표 재클릭은 중복 보상 및 시간 소비가 없어야 한다. 잠긴 문이나 먼 물체 클릭도 상태를 바꾸지 않는다.
저장·연결 탭에서 JSON을 복사하고 위치를 옮긴 후 복원하면 이전 상태로 돌아와야 한다.
전송 실패 때 재시도가 가능하고, 성공 후 움직임과 추가 전송이 차단되어야 한다.

## AI 인계 계약
채팅 메시지: `MYSTERY_LAB_V1 {"protocol":"MYSTERY_LAB_V1","event":"HANDOFF","state":...,"seenText":...,"user":...,"futureIsCanon":false}`.
AI는 state를 이어받아 해금 조건과 시간을 유지하고, user의 요청에 답한 뒤 다음 패널에 최신 initial을 전달한다.
클라이언트가 보낸 JSON은 신뢰 경계 밖의 입력이다. 현재 테스트의 검증은 형식과 논리 일관성 검사이며, 부정 수정 방지/서명 인증이 아니다.
revision은 해당 상태의 변경 횟수이며 서버 전역 이벤트 ID가 아니다. 인계 중복 방지는 현재 마운트 내 ref 잠금이다.
JSX 내부의 미공개 정답이나 향후 대사를 저장하지 않았다. API 키·진짜 비밀은 JSX/URL에 넣지 않는다.

## Worker
`worker.js`는 에셋까지 포함한 ES module 단일 파일. 추가 라이브러리·R2·KV 바인딩 없이 배포 가능.
기존 Worker를 덮어쓰지 말고 `mystery-scene-lab13`이라는 별도 Worker로 생성한다.
CLI 사용 시 Cloudflare 인증 후 `npx wrangler deploy` (wrangler.jsonc 포함). 대시보드에서는 worker.js의 내용을 붙여 넣어 배포한다.

- GET /health : 정상 여부
- GET /manifest.json : 에셋 목록
- GET /assets/body.svg 등 : 내장 에셋
- GET /render.svg : 기본 장면 완성 SVG
- GET /render.svg?state=URL인코딩된JSON : 전달된 상태의 완성 SVG

배포 주소를 `workerBase="https://실제주소.workers.dev"`로 넘기면 JSX의 저장·연결 탭에 Markdown 이미지 URL이 나온다. JSX는 Worker에 fetch하지 않는다.
Worker는 외부 URL을 가져오지 않고 허용된 내장 에셋만 사용한다. SVG 안의 이미지는 data URL로 포함하므로 이미지로 표시할 때 외부 하위 리소스가 차단되는 문제를 피한다.
SVG 지원 여부는 채팅 플랫폼에서 별도 확인해야 한다. PNG 변환·매 프레임 생성·GIF·동영상은 이번 범위에 없다.
긴 상태는 URL 길이 제한에 걸릴 수 있다. 다음 단계에서 필요하면 서버에 스냅샷을 저장하고 짧은 ID로 조회하는 구조로 확장한다.
Worker는 상태를 저장하지 않으며, 민감한 대사를 URL에 넣으면 브라우저 기록·로그에 남을 수 있다.

## 구조 / 다음 GPT 인계
- src/core.mjs: 순수 상태 전이·스키마 검증·체크포인트·인계 규약
- src/IntegrationScene13.view.jsx: 호스트 중립 UI
- IntegrationScene13.jsx: 위 두 파일을 합친 UUMMAI 등록본
- src/render.mjs: 상태 → SVG 완성 이미지
- src/worker.mjs / worker.js: Worker 원본 / 단일 배포본
- public/assets: 기존 인물 레이어 + 이번에 코드로 만든 두 배경
- build.mjs: JSX/웹/Worker 생성; 생성 파일 직접 편집보다 원본 수정 권장
- test/core.test.mjs: 조사 순서·불변조건·SVG escaping·Worker 경로 검증

실제 UUMMAI에서 JSX 등록, 이미지 허용, sendMessage 수신까지는 사용자 환경에서 검증이 필요하다. 플랫폼 자동 동기화나 Worker 실배포 완료로 혼동하지 말 것. 배포 여부와 검사 기록은 TEST_RESULTS.md를 확인한다.
