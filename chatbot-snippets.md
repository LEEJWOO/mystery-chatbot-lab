# 챗봇에 출력할 코드

실제 이미지 URL: https://leejwoo.github.io/mystery-chatbot-lab/arcane_portal.webp

## A. Markdown 이미지 — 가장 먼저 검사
```markdown
![마법진 애니메이션](https://leejwoo.github.io/mystery-chatbot-lab/arcane_portal.webp)
```
애니메이션 이미지를 채팅 말풍선 안에 표시하는 시험입니다.

## B. 전체 화면 오버레이 — HTML/CSS를 허용할 때만
```html
<span style="display:block;position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;background:transparent url('https://leejwoo.github.io/mystery-chatbot-lab/arcane_portal.webp') center/cover no-repeat;"></span>
```
챗봇에 실제 출력할 때는 코드블록의 백틱을 빼야 합니다.

## C. 데모 웹페이지 열기
```markdown
[마법진 데모 열기](https://leejwoo.github.io/mystery-chatbot-lab/)
```

## D. iframe 허용 시
```html
<iframe src="https://leejwoo.github.io/mystery-chatbot-lab/" width="360" height="640" style="max-width:100%;border:0"></iframe>
```
iframe은 그 영역 안에만 HTML을 그립니다. 웹페이지 자체를 모든 앱 위에 덮는 것은 아닙니다.

## 중요한 제약
- `content://` 경로는 다른 웹페이지에서 읽을 수 있는 공개 이미지 주소가 아닙니다.
- `standalone.html`을 `![]()`의 이미지 URL로 넣으면 렌더링되지 않습니다. `arcane_portal.webp`를 사용해야 합니다.
- 채팅 플랫폼이 HTML을 텍스트로 출력하거나 CSS를 제거하면 전체 화면 오버레이는 작동하지 않습니다.
- 애니메이션 WebP는 한 번 재생하고 투명한 프레임에서 멈추도록 제작했습니다.
