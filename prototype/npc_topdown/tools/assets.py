"""그림 에셋 가공기 — 원본(통 이미지) → 공개용 레이어 + 주소 표.

사용: python3 -I tools/assets.py <매니페스트.json>

- 인물: 같은 자세·의상에서 표정만 다른 통 이미지 여러 장을 받는다.
  기본 표정 1장을 '몸' 레이어로 쓰고, 나머지는 기본과 달라진 부분만 잘라 '표정 조각'으로 만든다.
  (차분 자동 추출: 픽셀을 비교해 달라진 영역의 사각형만 저장)
- 배경: 2:3 세로 화면에 맞게 가운데를 잘라 줄인다.
- 파일 이름은 내용 해시(예: 3fa9c2d1e0b4.webp)라 이름만으로는 무엇인지 알 수 없다(스포일러 방지).
- 결과: <out_dir>/*.webp 와 <table> (JSX에 끼워 넣을 주소 표)

매니페스트 예:
{
  "url": "https://.../assets/pub/",            # 공개 주소 앞부분
  "out_dir": "../../assets/pub", "table": "src/assets.web.json",
  "height": 960,                                 # 인물 레이어 세로 픽셀
  "chars": {"companion": {"def": "평상시", "faces": {"평상시": "assets_src/test/yuri_평상시.png", ...}}},
  "bg": {"정원": "assets_src/test/bg_classroom.webp"}
}
"""
import hashlib, io, json, os, sys
import numpy as np
from PIL import Image

DIFF = 24      # 이 값보다 크게 달라진 픽셀만 '바뀐 부분'으로 본다(압축 잡음 무시)
PAD = 6        # 조각 가장자리 여유(경계선 이음매 방지)


def save(im, out_dir, q, lossless=False):
    buf = io.BytesIO()
    im.save(buf, 'WEBP', quality=q, method=6, lossless=lossless)
    data = buf.getvalue()
    name = hashlib.sha1(data).hexdigest()[:12] + '.webp'
    with open(os.path.join(out_dir, name), 'wb') as f:
        f.write(data)
    return name, len(data)


def changed_box(a, b):
    """두 RGBA 이미지에서 DIFF 이상 달라진 픽셀의 경계 사각형.
    투명 픽셀 속 숨은 색 차이는 무시하도록 알파를 곱한 색으로 비교한다."""
    A = np.asarray(a).astype(np.int32)
    B = np.asarray(b).astype(np.int32)
    pa = A[..., :3] * A[..., 3:4] // 255
    pb = B[..., :3] * B[..., 3:4] // 255
    d = np.maximum(np.abs(pa - pb).max(axis=2), np.abs(A[..., 3] - B[..., 3]))
    ys, xs = np.where(d > DIFF)
    if not len(ys):
        return None
    return (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)


def char(spec, root, out_dir, height, report):
    faces = {k: Image.open(os.path.join(root, v)).convert('RGBA') for k, v in spec['faces'].items()}
    sizes = {im.size for im in faces.values()}
    if len(sizes) != 1:
        raise SystemExit('표정 이미지 크기가 서로 다릅니다: %s' % sizes)
    # 모든 표정의 불투명 영역을 합친 범위로 잘라 여백을 없앤다
    box = None
    for im in faces.values():
        b = im.getbbox()
        box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
    scale = height / (box[3] - box[1])
    size = (round((box[2] - box[0]) * scale), height)
    faces = {k: im.crop(box).resize(size, Image.LANCZOS) for k, im in faces.items()}
    base = faces[spec['def']]
    src, n = save(base, out_dir, 88)
    report.append('  몸(%s) %dx%d %dKB' % (spec['def'], size[0], size[1], n // 1024))
    out = {'src': src, 'w': size[0], 'h': size[1], 'def': spec['def'], 'faces': {}}
    for k, im in faces.items():
        if k == spec['def']:
            continue
        b = changed_box(base, im)
        if not b:
            report.append('  %s: 기본과 같음(건너뜀)' % k)
            continue
        b = (max(0, b[0] - PAD), max(0, b[1] - PAD), min(size[0], b[2] + PAD), min(size[1], b[3] + PAD))
        area = (b[2] - b[0]) * (b[3] - b[1]) / (size[0] * size[1])
        f, n = save(im.crop(b), out_dir, 90)
        out['faces'][k] = {'src': f, 'x': b[0], 'y': b[1], 'w': b[2] - b[0], 'h': b[3] - b[1]}
        report.append('  %s 조각 %dx%d (화면의 %.1f%%) %dKB%s' % (k, b[2] - b[0], b[3] - b[1], area * 100, n // 1024,
                      '  ⚠ 넓음: 표정 외 부분도 달라졌을 수 있음' if area > 0.25 else ''))
    return out


def background(path, out_dir):
    im = Image.open(path).convert('RGB')
    w, h = im.size
    tw = min(w, round(h * 2 / 3))          # 2:3 세로로 가운데 자르기
    th = round(tw * 3 / 2)
    if th > h:
        th, tw = h, round(h * 2 / 3)
    left, top = (w - tw) // 2, (h - th) // 2
    im = im.crop((left, top, left + tw, top + th)).resize((600, 900), Image.LANCZOS)
    return save(im, out_dir, 80)


def main(manifest):
    root = os.path.dirname(os.path.abspath(manifest))
    m = json.load(open(manifest, encoding='utf-8'))
    out_dir = os.path.join(root, m['out_dir'])
    os.makedirs(out_dir, exist_ok=True)
    table, report = {'url': m['url'], 'chars': {}, 'bg': {}}, []
    for cid, spec in m.get('chars', {}).items():
        report.append('인물 ' + cid)
        table['chars'][cid] = char(spec, root, out_dir, m.get('height', 960), report)
    for area, path in m.get('bg', {}).items():
        name, n = background(os.path.join(root, path), out_dir)
        table['bg'][area] = name
        report.append('배경 %s %dKB' % (area, n // 1024))
    # 탐색 화면: 전체 맵 이미지 + 인물 걷기 스프라이트 묶음(tools/pixelart.py 결과). 도트라 무손실로 저장.
    if m.get('map'):
        im = Image.open(os.path.join(root, m['map'])).convert('RGBA'); name, n = save(im, out_dir, 100, True)
        table['map'] = {'src': name, 'w': im.width, 'h': im.height}; report.append('맵 %dx%d %dKB' % (im.width, im.height, n // 1024))
    if m.get('sprites'):
        im = Image.open(os.path.join(root, m['sprites'])).convert('RGBA'); name, n = save(im, out_dir, 100, True)
        meta = json.load(open(os.path.join(root, m['sprites_meta']), encoding='utf-8'))
        table['sprites'] = {'src': name, 'w': im.width, 'h': im.height, 'ids': meta['ids'], 'cw': meta['cw'], 'ch': meta['ch']}
        report.append('스프라이트 %d명 %dKB' % (len(meta['ids']), n // 1024))
    with open(os.path.join(root, m['table']), 'w', encoding='utf-8') as f:
        json.dump(table, f, ensure_ascii=False, indent=1)
    used = {c['src'] for c in table['chars'].values()} | {f['src'] for c in table['chars'].values() for f in c['faces'].values()} | set(table['bg'].values()) | {table[k]['src'] for k in ('map', 'sprites') if k in table}
    for name in os.listdir(out_dir):            # 표에서 빠진 옛 파일 정리
        if name.endswith('.webp') and name not in used:
            os.remove(os.path.join(out_dir, name))
    print('\n'.join(report))


if __name__ == '__main__':
    main(sys.argv[1])
