# 안정화 검증 — 2026-11-01

기준 커밋: `09304210cea07a5e669f0277624c9014671e8639`.

- 생성 파일 일치 검사: 통과. `build.mjs --check`가 드리프트를 거부한다.
- 등록용 JSX TypeScript 구문 검사: 오류 0.
- 코어/Worker/등록본 동일성 Node 회귀: **33/33 통과**.
- 기존 Lab13 회귀: **5/5 통과**.
- Lab13 웹·등록본·통합 Worker 빌드: 성공.
- 아래는 실제 headless Chromium + React 18 독립 실행 시험이다. 실제 UUMMAI가 아니다. 서버 실패·저장 왕복은 route mock을 사용했다.
- 폰트: Noto Sans KR로 모바일 화면 검사. 320px 대사 화면 시각 확인.

- viewport 320: overflow, rapid movement and restore PASS
- viewport 360: overflow, rapid movement and restore PASS
- viewport 390: overflow, rapid movement and restore PASS
- viewport 768: overflow, rapid movement and restore PASS
- long dialogue: replay disclosure, interrupt, failed send retry and rapid submit PASS
- same panel new props remount PASS
- invalid initial blocks silent reset PASS
- delayed world, duplicate saves, failed save retry, server restore PASS
- failed autosync remains retryable at same revision PASS
- failed external world with no checkpoint retains usable built-in map PASS
- 24 SVG assets: whitespace optimization pixel-identical PASS
- browser runtime errors: 0

한계: 실제 UUMMAI fetch/포인터/sendMessage 왕복, UUMMAI 모바일 웹뷰의 키보드 동작은 미검증. 이번 Worker 후보는 실배포하지 않았다. CI 정의를 강화했지만 원격 실행 결과는 해당 PR의 체크 결과를 확인해야 한다.
