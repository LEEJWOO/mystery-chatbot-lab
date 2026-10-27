# 검증 및 배포 상태 — 2026-10-27

- npm run build: 성공 (UUMMAI JSX + React 웹 실행본 + 단일 Worker 생성)
- npm test: 5개 테스트 모두 성공
- 전체 조사 동선: 09:05 → 09:19, 증거 3개, 자료실 해금
- 벽/거리/잠금/중복 획득: 상태와 시간 보존 검사 성공
- 잘못된 JSON/버전/좌표/해금 순서: 거부 검사 성공
- SVG: XML escaping, Unicode 180자 제한, 외부 참조 없는 data URL 검사 성공
- Worker Request/Response: health, manifest, assets, SVG, HEAD, 잘못된 상태 400, POST 405, 없는 에셋 404 검사 성공
- Cloudflare 실배포: 미완료. 현재 세션의 Cloudflare 대시보드는 로그인 페이지이며 연결 플러그인/CLI 인증이 제공되지 않음.
- 실제 UUMMAI 실행: 미검증. 외부 이미지 및 sendMessage는 해당 플랫폼에서 확인 필요.

## 공개 웹 실행 검증
- GitHub 커밋 8067d94에 최초 업로드, Pages workflow run 40456653243 성공 확인.
- 공개 URL: https://leejwoo.github.io/mystery-chatbot-lab/lab13/dist/
- Cloud Browser에서 실제 버튼으로 전체 동선을 실행: 09:19 / 자료실 / 증거 3개 확인.
- 대사를 임시 변경한 뒤 저장 JSON을 복원: 이전 대사와 revision 12 복원 확인.
- 인계 버튼으로 호스트 수신 결과에 전체 상태와 사용자 문장 전달 확인.
- 인계 성공 후 필드와 행동 버튼 disabled 확인.
- 캐릭터/배경 레이어 정상 표시, 완성 sample-scene.svg 시각 확인.
- 등록용 JSX의 import 없는 컴파일 및 React 서버 렌더 성공.
- 위 검증은 독립 웹 데모이며 UUMMAI 호스트의 실제 sendMessage 검증은 아님.
