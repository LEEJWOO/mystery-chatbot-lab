#!/usr/bin/env python3
"""의상 레이어 뽑기: 옷 입은 그림 − 맨몸 기준판 = 투명 의상 조각.

  python3 -I outfit_layer.py --body 맨몸.png --dressed 옷입은그림.png --out 의상.png [--chin Y] [--preview 확인.png]

- 두 그림은 같은 인물·같은 자세·같은 캔버스여야 한다(크기·위치 보정 없음, 다르면 멈춤).
- 의상 = 두 그림이 다른 곳(턱 아래). 맨몸에 없는 곳까지 퍼진 옷자락(치마 등)도 포함.
- 옷 안의 구멍(피부색 비슷한 흰 옷 등)은 메운다. 옷 가장자리로 흘러내린 머리카락처럼 두 그림이 같은 곳은 빠지고,
  화면에서는 몸 그림의 머리카락이 그대로 보인다(앞머리 레이어가 따로 필요 없음).
- 턱 위(얼굴)는 의상에 넣지 않는다. 표정은 따로 얹는다. 모자처럼 턱 위 소품이 의상이면 --chin 0.
화면 조립 순서: 몸(맨몸 기준판) → 의상 → 표정.
"""
import argparse, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from body_base import load, chin_y, smooth


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--body', required=True); ap.add_argument('--dressed', required=True); ap.add_argument('--out', required=True)
    ap.add_argument('--chin', type=int); ap.add_argument('--preview')
    a = ap.parse_args()
    B, D = load(a.body), load(a.dressed)
    if B.shape != D.shape:
        sys.exit(f'크기가 다름: {a.body} {B.shape[1]}x{B.shape[0]} / {a.dressed} {D.shape[1]}x{D.shape[0]} (보정하지 않음)')
    chin = a.chin if a.chin is not None else chin_y(D)
    ab, ad = B[..., 3:4] / 255, D[..., 3:4] / 255
    pre = lambda X, al: X[..., :3] * al           # 투명도를 곱한 색끼리 비교
    diff = np.abs(pre(B, ab) - pre(D, ad)).sum(2)
    PAD = 12   # 캔버스 가장자리에서 모폴로지가 깎이지 않게 반사 패딩
    diff = np.pad(diff, PAD, mode='reflect')
    w = smooth(diff, 18, 60)
    m = nd.binary_opening(w > .5, iterations=1)
    lab, n = nd.label(m)
    if n:
        sizes = nd.sum(np.ones_like(lab), lab, range(1, n + 1))
        m = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 60])
    m = nd.binary_closing(m, iterations=6)
    # 옷 안의 구멍(피부색과 비슷한 아이보리·흰 옷)은 메운다. 구멍 속 픽셀도 옷 입은 그림 그대로라
    # 그 자리를 지나는 머리카락도 같은 모습으로 덮여 화면 결과는 바뀌지 않는다.
    if chin:
        m[:chin - 2 + PAD] = False
    m = nd.binary_fill_holes(m)
    w = np.maximum(w * nd.binary_dilation(m, iterations=2), m.astype(np.float32))
    w = nd.gaussian_filter(w, .6)[PAD:-PAD, PAD:-PAD]
    if chin:
        ramp = np.clip((np.arange(D.shape[0]) - (chin - 2)) / 6, 0, 1)[:, None]
        w = w * ramp
    out = D.copy(); out[..., 3] = D[..., 3] * np.clip(w, 0, 1)
    Image.fromarray(out.astype(np.uint8)).save(a.out)
    # 검증: 몸 위에 의상을 얹은 결과가 옷 입은 그림과 얼마나 같은가
    oa = out[..., 3:4] / 255
    comp_rgb = out[..., :3] * oa + B[..., :3] * ab * (1 - oa)
    comp_a = oa + ab * (1 - oa)
    rgb = np.where(comp_a > 0, comp_rgb / np.maximum(comp_a, 1e-6), 0)
    below = np.arange(D.shape[0])[:, None] > (chin or 0) + 6
    err = (np.abs(rgb - D[..., :3]).sum(2) > 30) & (D[..., 3] > 200) & np.broadcast_to(below, D.shape[:2])
    print(f'턱 y={chin}  의상 {int((out[..., 3] > 128).sum())}px  재조립 오차 {int(err.sum())}px')
    if a.preview:
        def onbg(rgbx, al, bg):
            return rgbx * al + np.array(bg, np.float32) * (1 - al)
        p1 = onbg(D[..., :3], ad, (70, 70, 70))
        p2 = onbg(out[..., :3], oa, (70, 70, 70))
        p3 = onbg(rgb, comp_a[..., :1] if comp_a.ndim == 3 else comp_a[..., None], (70, 70, 70))
        p4 = p3.copy(); p4[err] = [255, 40, 40]
        sheet = np.concatenate([p1, p2, p3, p4], 1).astype(np.uint8)
        im = Image.fromarray(sheet); im.thumbnail((2400, 2400)); im.save(a.preview)
        print('확인 그림: 옷 입은 그림 | 의상 조각 | 몸+의상 | 오차(빨강)')


if __name__ == '__main__':
    main()
