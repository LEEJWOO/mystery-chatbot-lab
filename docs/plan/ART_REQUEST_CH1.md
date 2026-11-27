# 1장 배경·증거 이미지 요청 (2026-11-28)

지도 타일은 사건이 확정된 뒤에 만든다. 이번 요청은 **대화 배경**(대화·재판 때 인물 뒤에 깔리는 그림)과 **증거 이미지**만.

## 지난번과 달라진 점
- 지난 시험판 배경은 가로 1216×832로 받았다. 화면(세로 360×540)은 이를 꽉 채우려고 **가운데 약 46%만** 보여 줘서 양옆이 크게 잘렸다.
- 이번부터 **세로 832×1216**(NovelAI 세로 기본 크기, 화면과 같은 2:3)으로 받는다. 잘리는 곳이 없다.

## 공통 규격
### 배경
- 세로 **832×1216** PNG, 인물 없음(`no humans, scenery`).
- 무대: 바다 위 외딴 섬의 **폐업한 고급 리조트 호텔**. 직원 없음. 시설은 그대로 쓸 수 있지만 약간 낡고 조용한 분위기(먼지, 일부 가구에 덮개 천).
- 글자·간판 문자 넣지 않기(글자는 화면이 얹음).
- 화면 **아래 1/3은 대사창이 덮는다** → 중요한 소품은 위쪽·가운데.
- 낮(자연광) 기준. 밤 버전은 낮 그림이 확정된 뒤 같은 구도로(인페인트·img2img).
- **그리면 안 되는 것:** 전지(배터리), 숨은 틈·비밀 공간, 시신·혈흔 등 사건 단서. 배경에 단서가 보이면 추리가 깨진다.

### 증거
- 정사각 **1024×1024**, 단색 배경, 물건 하나를 가운데에. 화면에서 320px로 줄여 쓴다.
- 글자 없이(종이류는 빈 종이·흐린 선만. 내용은 화면이 얹음).
- 그림자·손·인물 없이.

## 배경 목록
### A. 먼저 (1장 시작부터 자주 가는 곳) — 17장
| # | 방 | 꼭 들어갈 것 | 태그 예시(영문) |
|---|---|---|---|
| 1 | 로비 | 프런트 데스크, **유리 진열장**(가운데쯤), 정문 유리문 | hotel lobby, reception desk, glass display case, glass entrance doors |
| 2 | 라운지 바 | 그랜드 피아노, 바 카운터 | hotel lounge bar, grand piano, bar counter, bottles |
| 3 | 연회장 | 긴 연회 테이블, 샹들리에 | banquet hall, long dining table, chandelier |
| 4 | 주방 | 업소용 조리대, 냄비·선반 | commercial kitchen, stainless steel counters |
| 5 | 1층 복도 | 넓은 복도, 여러 문 | hotel hallway, carpet, doors |
| 6 | 계단홀 | 위로 가는 계단과 아래로 가는 계단이 둘 다 보이게 | stairwell, stairs going up and down, landing |
| 7 | 2층 복도 | 객실 문이 양쪽으로 늘어선 긴 복도 | long hotel corridor, guest room doors on both sides |
| 8 | 객실 | 침대·창(바다)·책상. **12실 공용 1장** | hotel guest room, bed, window, ocean view |
| 9 | 리넨실 | 선반, 수건·시트 더미, 리넨 카트 | linen room, shelves, folded towels, laundry cart |
| 10 | 휴게 코너 | 소파, 꺼진 자판기, 창 | lounge corner, sofa, vending machine, window |
| 11 | 앞마당 | 호텔 정면 외관, 정문 | resort hotel exterior, front entrance, courtyard |
| 12 | 정원 | 분수, 산책로 | garden, fountain, stone path |
| 13 | 수영장 | **높은 다이빙대**, 데크, 선베드 | outdoor swimming pool, high diving board, pool deck |
| 14 | 탈의실 | 사물함, 벤치 | changing room, lockers, bench |
| 15 | 해변 | 모래사장, 수평선 | beach, sand, ocean, horizon |
| 16 | 선착장 | 배 없는 나무 선착장, 끝의 기둥 | wooden pier, empty dock, no boats |
| 17 | 재판장 | (제안) 증언대가 둥글게 둘러선 어두운 지하 홀, 위엄 있는 분위기 | courtroom, circular witness stands, dark, dramatic lighting |

### B. 나중 (사건이 정해진 뒤) — 9장
바위 해안(물때 구역), 기관실, 와인 저장고, 지하 복도, 재판장 앞, 외벽 산책로, 화장실, 옥상(올려다보는 구도), 식료품 창고(2장용)

### C. 밤 버전 (A가 확정된 뒤, 같은 구도) — 4장
로비, 2층 복도, 정원 또는 해변, 수영장

## 증거 목록
### 확정 (지금 만들어도 됨) — 6장
| # | 물건 | 설명 |
|---|---|---|
| 1 | 팔찌형 스마트 기기 | 참가자 전원이 찬 것과 같은 팔찌. 매끈한 검은 밴드 + 작은 화면 |
| 2 | 팔찌 (전지 슬롯 열림) | 1번과 같은 팔찌, 옆면 슬롯이 옛 PC CD 트레이처럼 튀어나온 모습 |
| 3 | 전지 | 팔찌용 납작한 전지 1개 |
| 4 | 진열장 전지 받침 | 전지를 꽂는 받침대, 칸이 여러 개이고 전부 비어 있음 |
| 5 | 조 편성표 | 빈 종이 한 장(글자 없음, 표 선만 흐리게) |
| 6 | 지배인 규칙 안내 카드 | 고급 호텔 안내 카드 같은 두꺼운 카드(글자 없음) |

### 보류 (1장 사건 ②·③ 확정 뒤)
저스틴이 숨긴 장소와 관련된 물건, 바룬의 행동 흔적, 물때표 등.

## 합계
배경 A 17 + 증거 6 = **23장** 먼저. 그다음 B 9 · C 4 · 보류 증거.
