# 최초 메시지

Worker 연결 이전에도 바로 시작하려면 아래 JSX 한 개를 챗봇 첫 메시지에 등록:

```jsx
<MysteryTestHub />
```

Worker 연결과 실제 URL 확인 이후에는:

```jsx
<MysteryTestHub worldUrl="https://확인된-Worker-주소/hub/world.json" />
```

이 메시지는 사용자가 `/기능` 같은 명령을 입력해야 하는 테스트 화면이 아니라 사건의 첫 플레이 화면이다.