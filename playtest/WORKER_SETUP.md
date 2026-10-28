# 기존 Cloudflare Worker 연동 안내

현재 GitHub 저장소 `LEEJWOO/mystery-chatbot-lab`에는 `lab13` 프로젝트와 **수동 실행 전용** `.github/workflows/lab13-worker-deploy.yml`이 존재한다. 현재 설정된 Worker 이름은 `mystery-scene-lab13`이다. 본 변경은 기존 `/health`, `/manifest.json`, `/render.svg`, `/assets/*`를 보존하고 `/hub/*` 경로를 추가하도록 설계했다.

## 설치/배포 순서

1. 제공 패키지의 `playtest/` 폴더를 GitHub 저장소 루트에 추가한다. `integration/lab13/src/worker.mjs`를 기존 `lab13/src/worker.mjs`에 반영한다. 기존 Worker의 외부 코드 및 URL을 무작정 삭제하지 않는다.
2. GitHub에서 **Settings → Secrets and variables → Actions**를 열어 `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`가 등록돼 있는지 확인한다. 값 자체는 채팅에 공유하지 않는다. API 토큰은 `mystery-scene-lab13` 기존 Worker 배포에 필요한 최소 권한만 부여한다.
3. 기존 GitHub Actions `Deploy Lab13 Worker`의 `workflow_dispatch`를 **변경사항을 포함하는 브랜치에서 수동 실행**한다. 이 워크플로는 배포 전에 `lab13` 테스트를 실행한다. 기존 Worker를 변경하므로 승인 없이 실행하지 않는다.
4. 완료 후 Actions 로그에서 실제 배포 URL을 확인한다. `<실제 배포 URL>/health`의 기존 응답과 `<실제 배포 URL>/hub/health`, `<실제 배포 URL>/hub/world.json`, `<실제 배포 URL>/hub/sprites/curator/front.svg`가 모두 정상인지 검증한다.
5. UUMMAI에서 JSX 등록명을 `MysteryTestHub`로 하고 첫 메시지에 `<MysteryTestHub worldUrl="<실제 배포 URL>/hub/world.json" />`를 넣는다. 외부 네트워크가 막히면 URL 속성을 빼고 내장 맵으로 시작한다.

## 서버 저장은 별도 승인 단계

Worker 소스에는 `/hub/state/{slot}` API가 구현돼 있지만 **Cloudflare KV 바인딩 `HUB_SAVES`가 없으면 HTTP 503으로 비활성화**된다. 활성화하려면 Cloudflare에서 KV namespace를 만들고 기존 Worker의 `HUB_SAVES` 바인딩을 추가해야 한다. 오타/타 사용자 접근을 방지하기 위해 브라우저가 생성한 긴 무작위 복구 키(Bearer)를 요구하며, 복구 키를 분실하면 서버 데이터를 찾을 수 없다. 저장 TTL은 30일이다. 이 저장 방식은 간단한 테스트용이며 상용 계정 인증을 대체하지 않는다.

GitHub Actions Secret 조회는 현재 연결된 GitHub 도구에서 지원하지 않는다. 배포 성공, CORS, UUMMAI의 fetch 허용 여부도 실제 연결 후 검증해야 한다.