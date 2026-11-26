"""표정 조각 뽑기: 기본 그림 + (흰 배경 불투명) 표정 인페인트 + 실제 마스크 → 겹쳐 쓸 표정 조각(RGBA).

  python3 -I tools/expr_extract.py <기본.png> <표정.png> <표정-mask.png> <출력.png> [--erode 22] [--feather 6] [--eye]

- NovelAI 인페인트는 마스크 경계 안쪽 약 16px에 회색 띠를 남긴다 → 경계에서 erode px(기본 22) 안쪽만 쓰고 feather px로 섞는다.
- 조각의 투명도 = 섞는 비율 × 기본 그림의 투명도(얼굴은 실루엣 안이라 기본 그림 윤곽을 그대로 쓴다).
- --eye: 조각 안 홍채(채도 높은 청·청록·보라 계열)의 색조·채도·밝기를 기본 그림의 홍채에 맞춘다.
- 출력은 보이는 부분만 잘라 저장하고, 자르기 전 좌표(x, y)를 표준 출력에 JSON으로 남긴다.
"""
import json, sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd
import matplotlib.colors as mc

def load(p, mode): return np.array(Image.open(p).convert(mode)).astype(float)

def extract(base_p, expr_p, mask_p, erode=22, feather=6, eye=False):
    base = load(base_p, 'RGBA'); raw = load(expr_p, 'RGB')
    m = np.array(Image.open(mask_p).convert('L').resize(base.shape[1::-1], Image.NEAREST)) > 127
    w = np.clip((nd.distance_transform_edt(m) - erode) / max(feather, 1), 0, 1)
    rgb = raw.copy()
    if eye:
        hb, hr = mc.rgb_to_hsv(base[..., :3] / 255), mc.rgb_to_hsv(raw / 255)
        iris = lambda h: (h[..., 0] > 0.40) & (h[..., 0] < 0.85) & (h[..., 1] > 0.08) & (h[..., 2] > 0.25)
        zone = w > 0.5
        ib, ir = iris(hb) & zone & (base[..., 3] > 200), iris(hr) & zone
        if ib.sum() > 50 and ir.sum() > 50:
            # 분위수 맞추기: 조각 홍채의 색조·채도·밝기 분포를 기본 그림 홍채 분포로 옮긴다(그라데이션까지 따라감)
            h = hr.copy(); q = np.linspace(0, 1, 33)
            for k in range(3):
                src, dst = np.quantile(hr[..., k][ir], q), np.quantile(hb[..., k][ib], q)
                h[..., k] = np.where(ir, np.interp(hr[..., k], src, dst), h[..., k])
            rgb = mc.hsv_to_rgb(np.clip(h, 0, 1)) * 255
    a = w * base[..., 3]
    out = np.dstack([rgb, a]).clip(0, 255).astype('uint8')
    ys, xs = np.nonzero(a > 0)
    box = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    return Image.fromarray(out).crop(box), box

if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    opt = lambda k, d: int(sys.argv[sys.argv.index(k) + 1]) if k in sys.argv else d
    args = [a for a in args if not a.isdigit()]
    im, box = extract(args[0], args[1], args[2], opt('--erode', 22), opt('--feather', 6), '--eye' in sys.argv)
    im.save(args[3]); print(json.dumps({'x': box[0], 'y': box[1], 'w': box[2] - box[0], 'h': box[3] - box[1]}))
