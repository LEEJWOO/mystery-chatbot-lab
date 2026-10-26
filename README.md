# Mystery Chatbot Lab — 투명 WebP 화면 전환

AI 추리형 챗봇의 화면 전환을 검증하는 공개 HTML/WebP 데모입니다.

## 페이지
- [메인 데모](https://leejwoo.github.io/mystery-chatbot-lab/)
- [고정 오버레이 및 클릭 통과 테스트](https://leejwoo.github.io/mystery-chatbot-lab/overlay-test.html)
- [애니메이션 WebP](https://leejwoo.github.io/mystery-chatbot-lab/arcane_portal.webp)
- [WebP 내장 단일 HTML](https://leejwoo.github.io/mystery-chatbot-lab/standalone.html)
- [챗봇 출력 코드](./chatbot-snippets.md)

## 파일
- `index.html`: 웹페이지 위에 고정 애니메이션 WebP를 오버레이
- `arcane_portal.webp`: 57프레임 애니메이션, 마지막 프레임은 완전 투명
- `overlay-test.html`: 전체 화면 고정 레이어 시험
- `standalone.html`: WebP base64 포함 단일 파일
- `chatbot-snippets.md`: Markdown, HTML, iframe 호출 코드

## Pages 최초 활성화
GitHub 저장소 → **Settings → Pages → Build and deployment → Deploy from a branch** → **main** / **/(root)** → Save.

이 설정을 완료하면 위 공개 주소에서 실행할 수 있습니다. 코드 업로드만으로 Pages가 무조건 자동 활성화되는 것은 아닙니다.

## 테스트 기준
1. 브라우저 데모가 웹페이지를 가렸다가 마지막에 투명해지는가?
2. 전환 후 하단 버튼을 클릭할 수 있는가?
3. 채팅 앱에서 WebP 이미지 자체를 출력할 수 있는가?
4. HTML/CSS가 허용되는 채팅 앱에서 fixed 전체 화면 오버레이가 표시되는가?

GitHub Pages가 정상이라고 해서 BabeChat 등 모든 채팅 플랫폼에서 HTML·CSS·iframe이 허용되는 것은 아닙니다.
