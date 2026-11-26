# 표정 그림 작업 안내 (빈 얼굴 방식) — 그림 담당용

## 1. 무엇이 바뀌었나
- 예전: 기본 표정은 원본 그대로, 나머지 표정만 그 위에 인페인트 → 기본 표정과 다른 표정의 자연스러움이 달랐다.
- 이제: **이목구비 없는 빈 얼굴(달걀귀신형) 그림**을 바탕으로 두고, **기본 표정까지 포함한 모든 표정**을 같은 마스크로 그려 넣는다. 화면은 바탕 위에 표정 조각을 덮는다.
- 예전 방식 파일도 그대로 읽힌다(섞어 써도 됨: 자세마다 blank 파일이 있으면 새 방식, 없으면 예전 방식).

## 2. 자세 하나에 필요한 파일 (예: 영애 기본 자세)
| 파일 | 내용 |
|---|---|
| `02-heiress-default-blank.png` | 빈 얼굴 바탕. 눈썹·눈·코·입만 지우고 앞머리·윤곽·턱선·귀는 그대로. **투명 배경**(예전 바탕과 같은 방식) |
| `02-heiress-default-mask.png` | 자세 공통 마스크 1장. 눈썹 위~입 아래, **얼굴 윤곽선보다 10px 안쪽**까지만 흰색 |
| `02-heiress-default-neutral.png` … `-darksmile.png` | 표정 그림(흰 불투명 배경, 투명 옵션 끔). 빈 얼굴 위에 공통 마스크로 인페인트 |
- 표정별 마스크(`…-smile-mask.png`)를 따로 주면 그쪽을 먼저 쓴다. 없으면 공통 마스크를 쓴다.
- 표정 이름: neutral, smile, laugh, suspicious, surprised, troubled, embarrassed, annoyed, sad, furious, panic, darksmile
- 자세 이름: default, think, point, crossed. 번호·직업: 01-student, 02-heiress, 03-doctor, 04-detective, 05-pianist, 06-magician
- 하라구로(darksmile)는 그림자 없이(화면이 그늘을 덧씌움). 눈 색 태그 필수, 홍채는 위가 진한 그라데이션.

## 3. (선택) 직접 결과 확인하기
보내기 전에 합성 결과를 미리 볼 수 있다. 저장소를 받아 두었다면:
```
pip install pillow numpy scipy matplotlib opencv-python
cd prototype/npc_topdown
python tools/char_layers.py mei <그림 폴더> <임시 출력 폴더> --fresh --table <임시 출력 폴더>/table.json --preview preview.png
```
- `preview.png`: 자세·표정마다 얼굴을 잘라 한 장에 늘어놓은 확인용 그림.
- `--table`을 꼭 붙인다(저장소의 assets.web.json을 건드리지 않게). 출력 폴더의 webp는 확인용이라 지워도 된다.
- 정식 반영(webp 업로드·화면 연결)은 Claude가 한다.

## 4. 보내는 법
- 자세 단위로 묶어 ZIP 1개. 파일 이름은 위 규칙 그대로.
- 원본·마스크는 공개 저장소의 원본 보관 브랜치에도 올라간다 — 노출이 심하거나 잔인한 그림은 따로 알려 줄 것.
