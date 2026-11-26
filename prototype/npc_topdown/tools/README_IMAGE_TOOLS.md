# 트로메라 인물 그림 도구 3종 설명서

## 준비 (한 번만)
- Python 3.10 이상
- `pip install numpy pillow scipy matplotlib opencv-python`
- 네 파일(`hair_lock.py`, `char_layers.py`, `blank_kit.py`, `expr_extract.py`)을 **같은 폴더**에 둔다.
  `char_layers.py`는 `expr_extract.py`를 불러 쓴다.
- 모든 도구는 그림 크기·위치를 바꾸지 않는다(표시 규칙: 같은 인물 그림 사이 확대·축소·이동 금지).
- 내용과 상관없는 일반 이미지 처리라, 공개 저장소에 못 올리는 그림도 각자 PC에서 그대로 돌리면 된다.

## 파일 이름 규칙 (공통)
`번호-직업-자세-표정.png` 예) `05-pianist-default-neutral.png`
- 자세: `default` / `think` / `point` / `crossed`
- 표정: `neutral smile laugh suspicious surprised troubled embarrassed annoyed sad furious panic darksmile`
- 달걀귀신(얼굴 비운 기본판): `번호-직업-자세-blank.png`, 공통 마스크: `번호-직업-자세-mask.png`

---

## 1. blank_kit.py — 달걀귀신 점검·마무리
원본 자세 그림과 얼굴을 비운 그림을 비교해 ① 바뀐 범위 점검 ② 투명 바탕 입히기 ③ 표정 인페인트용 공통 마스크 만들기.

```
python3 -I blank_kit.py <원본 폴더> <빈 얼굴 폴더> <출력 폴더> [--preview 확인.png]
```
- 원본 폴더: `…-neutral.png`(투명 배경 원본)
- 빈 얼굴 폴더: `…-blank.png`(NovelAI 인페인트 결과, 흰 배경이어도 됨)
- 출력: 투명 바탕을 입힌 `…-blank.png` + `…-mask.png`
- 화면에 '바깥 변경' 경고가 나오면 얼굴 밖(머리 윤곽·몸)까지 바뀐 것 → 다시 인페인트.
- 얼굴 안쪽이 지저분한 건 괜찮다(표정 조각이 늘 덮는 자리).

## 2. hair_lock.py — 앞머리 고정
앞머리가 눈을 가리는 인물용. 표정을 넣을 때 NovelAI가 앞머리 가닥까지 새로 그려 표정마다 앞머리가 달라지는 문제를 없앤다.
달걀귀신 기본판의 앞머리를 '뚜껑'으로 고정하고, 표정 그림에서는 피부 위의 바뀐 곳만 쓴다.

```
python3 -I hair_lock.py --base 기본판-blank.png --var 표정1.png 표정2.png … --out 출력폴더
```
출력(표정마다 3개)
- `표정-face.png`: 투명 얼굴 조각(앞머리에 가린 곳은 이미 잘림). **화면 조립은 기본판 위에 이 한 장.**
- `표정-preview.png`: 합성 결과
- `표정-check.png`: 원본 | 결과 | 차이 지도(빨강=버린 앞머리, 초록=쓴 곳)

조절값
- `--skin-tol 28`: 피부색 허용 거리. 키우면 앞머리 가장자리까지 표정을 쓰고, 줄이면 더 엄격하게 앞머리를 지킨다.
- `--feather 2.0`: 경계 흐림. 이음매가 보이면 3~4로.
- `--edge 1.2`: 앞머리 가장자리 보호 폭.

주의
- 기본판과 표정은 **반드시 같은 그림에서 인페인트로** 만든다(새로 생성한 그림은 안 맞음). 크기가 다르면 멈춘다.
- 인페인트 마스크에 앞머리가 들어가도 괜찮다(도구가 되돌림).

## 3. char_layers.py — 인물 레이어 묶기(화면용)
자세 그림 + 표정들을 화면용 webp 조각과 표(json)로 묶는다. 옛 방식(neutral 바탕+표정+표정 마스크)과 달걀귀신 방식(blank+공통 mask+모든 표정)을 둘 다 받는다.

```
python3 -I char_layers.py <인물id> <원본 폴더> <출력 폴더> --table 표.json [--preview 미리보기.png] [--fresh]
```
- `--table`: 결과를 적을 표. **각자 PC에서는 꼭 지정**(안 하면 저장소의 `src/assets.web.json`을 찾는다).
- `--preview`: 자세·표정별 얼굴을 늘어놓은 확인용 그림.
- `--fresh`: 그 인물 항목을 새로 만듦(없으면 이번에 찾은 파일만 덮어씀).
- 표정 조각 경계 처리는 `expr_extract.py`가 한다(테두리 띠·회색 면 제거, 흰 번짐 정리, 턱 고정).
- 참고: 표에 적히는 눈 위치(`eye`, `ed`)는 예전 자동 맞춤용 값이다. 지금 표시 규칙(인물별 배율·y값 1개)에서는 화면 보정에 쓰지 않는다.

---

## 권장 순서 (인물 한 명, 한 자세)
1. 원본 자세 그림 `…-neutral.png` 준비
2. NovelAI로 얼굴 비우기 → `blank_kit.py`로 점검·투명 바탕·공통 마스크
3. 공통 마스크로 표정 인페인트(표정별 png)
4. 앞머리가 눈을 가리면 `hair_lock.py`, 아니면 `char_layers.py`로 묶기
5. `-check.png` / `--preview` 그림으로 눈 점검
