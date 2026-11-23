# 로컬 기능 검사 결과

- JSX 구문 분석: TypeScript JSX 파서 오류 0건
- 함수 컴포넌트 초기 렌더링 모의 시험: 372개 요소 순회 성공 (실제 UUMMAI DOM 검증과는 다름)
- Node 기본 기능 테스트: 19/19 통과
- 포함: 시작 상태·시야·8방향 에셋 선택·회전 0초·전진 1칸·벽 충돌·잠긴 문·열쇠·고정 문서·NPC 대화 인계·중복 reply 방지·시간 이벤트·NPC 일정·체크포인트·Worker 경로·인증 및 구버전 저장 보호
- SVG 장면 정적 렌더링: `preview.png` 참고
- 미실행: Cloudflare 실제 배포, UUMMAI의 네트워크 fetch/포인터 이벤트/JSX sendMessage, Cloudflare KV 실제 바인딩, JSX와 LLM 실제 1왕복

유의: 본 검사는 완성품의 모든 경로를 보장하지 않는 로컬 회귀 시험이다.