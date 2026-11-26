#!/usr/bin/env python3
"""앞머리 고정(hair lock): 달걀귀신 기본판의 앞머리를 언제나 맨 위로 되돌린다.

입력
  --base   얼굴을 비운 기본판(달걀귀신) PNG
  --var    같은 기본판에서 인페인트로 눈·입을 넣은 표정 PNG (여러 장)
출력 (--out 폴더)
  <이름>-face.png     투명 캔버스(기본판과 같은 크기)에 '얼굴 조각'만. 앞머리에 가린 곳은 이미 잘려 있음
  <이름>-preview.png  기본판 + 얼굴 조각 합성 결과(화면에 보일 모습)
  <이름>-check.png    원본 표정 | 합성 결과 | 차이 지도(빨강=앞머리가 다시 그려졌던 곳, 초록=쓰는 곳)

원리
  1) 기본판에서 피부색을 재고, 피부가 아닌 곳(앞머리·선)을 '뚜껑'으로 정한다.
  2) 표정 그림에서 기본판과 달라진 곳 중 뚜껑 밖(피부 위)만 얼굴 조각으로 쓴다.
  3) 경계는 부드럽게 섞어 이음매를 없앤다. 크기·위치는 손대지 않는다(표시 규칙).
"""
import argparse, os
import numpy as np
from PIL import Image, ImageFilter


def load(p):
    return np.asarray(Image.open(p).convert('RGBA')).astype(np.float32)


def smooth(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def blur(m, r):
    im = Image.fromarray((np.clip(m, 0, 1) * 255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(r))).astype(np.float32) / 255


def run(base_p, var_ps, out, skin_tol, feather, edge):
    B = load(base_p)
    os.makedirs(out, exist_ok=True)
    for vp in var_ps:
        V = load(vp)
        if V.shape != B.shape:
            raise SystemExit(f'크기가 다름: {vp} {V.shape[:2]} vs 기본판 {B.shape[:2]} (보정하지 않음)')
        d = np.abs(V[..., :3] - B[..., :3]).sum(2)
        changed = smooth(d, 12, 45)
        ys, xs = np.where(changed > 0.5)
        if len(xs) == 0:
            print('변화 없음:', vp); continue
        y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
        # 피부색: 바뀐 영역 상자 안, 기본판의 밝은 픽셀 중앙값
        box = B[y0:y1 + 1, x0:x1 + 1, :3].reshape(-1, 3)
        lum = box.mean(1)
        skin = np.median(box[lum > np.percentile(lum, 70)], 0)
        dist = np.sqrt(((B[..., :3] - skin) ** 2).sum(2))
        hair = smooth(dist, skin_tol, skin_tol * 2.2)          # 1 = 뚜껑(앞머리·선)
        hair = np.maximum(hair, blur(hair, edge) * 1.6).clip(0, 1)  # 가닥 가장자리 보호
        w = blur(changed, feather) * (1 - hair)
        w = np.where(B[..., 3] < 8, 0, w)                       # 캔버스 밖은 안 씀
        face = V.copy(); face[..., 3] = (w * 255)
        name = os.path.splitext(os.path.basename(vp))[0]
        Image.fromarray(face.astype(np.uint8)).save(os.path.join(out, f'{name}-face.png'))
        comp = B.copy()
        a = w[..., None]
        comp[..., :3] = B[..., :3] * (1 - a) + V[..., :3] * a
        Image.fromarray(comp.astype(np.uint8)).save(os.path.join(out, f'{name}-preview.png'))
        # 검사 그림
        pad = 40
        cy0, cy1 = max(0, y0 - pad), min(B.shape[0], y1 + pad)
        cx0, cx1 = max(0, x0 - pad), min(B.shape[1], x1 + pad)
        def rgb(X):
            X = X[cy0:cy1, cx0:cx1]
            bg = np.full(X[..., :3].shape, 40.0)
            al = X[..., 3:4] / 255
            return X[..., :3] * al + bg * (1 - al)
        dm = rgb(B) / 3
        cm = changed[cy0:cy1, cx0:cx1] > 0.5
        hm = hair[cy0:cy1, cx0:cx1] > 0.5
        dm[cm & hm] = [255, 40, 40]
        dm[cm & ~hm] = [40, 210, 60]
        sheet = np.concatenate([rgb(V), rgb(comp), dm], 1).astype(np.uint8)
        Image.fromarray(sheet).save(os.path.join(out, f'{name}-check.png'))
        redrawn = (cm & hm).sum(); used = (cm & ~hm).sum()
        print(f'{name}: 다시 그려진 앞머리 {redrawn}px 버림 / 얼굴 {used}px 사용')


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--base', required=True)
    ap.add_argument('--var', required=True, nargs='+')
    ap.add_argument('--out', required=True)
    ap.add_argument('--skin-tol', type=float, default=28, help='피부색 허용 거리(RGB). 크면 앞머리 가장자리까지 표정을 씀')
    ap.add_argument('--feather', type=float, default=2.0, help='바뀐 영역 경계 흐림 반경')
    ap.add_argument('--edge', type=float, default=1.2, help='앞머리 가장자리 보호 반경')
    a = ap.parse_args()
    run(a.base, a.var, a.out, a.skin_tol, a.feather, a.edge)
