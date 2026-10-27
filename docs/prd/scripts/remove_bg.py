# -*- coding: utf-8 -*-
"""Soft-matte pass for the 奶蛙 photos.

The first version used a binary flood-fill mask, which left stair-stepped
edges on several photos. This version keeps the flood fill as a hard
interior protector but rebuilds the silhouette edge from a saturation /
value ramp, so the outline is antialiased and small notches are restored.
"""

import os
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFilter

SIZE_MAP = {
    201301: ("sideways-glance", 0),
    361105: ("kungfu-block", 0),
    191651: ("arms-crossed", 55),
    158335: ("lounging", 12),
    218759: ("lying-looking-up", 55),
    201851: ("thinking", 150),
    192121: ("surprised", 0),
    177740: ("belly-laugh", 70),
}

BOTTOM_CLEANUP = {
    "kungfu-block": 0.78,
    "surprised": 0.80,
    "belly-laugh": 0.80,
    "sideways-glance": 0.85,
    "lounging": 0.85,
    "lying-looking-up": 0.85,
}

WHITE = (255, 255, 255)
SENTINEL = (255, 0, 255)
BG_THRESHOLD = 130


def clamp(x, lo=0.0, hi=1.0):
    return lo if x < lo else hi if x > hi else x


def smoothstep(edge0, edge1, x):
    t = clamp((x - edge0) / (edge1 - edge0))
    return t * t * (3 - 2 * t)


def hsv(px):
    r, g, b = px[:3]
    mx, mn = max(r, g, b), min(r, g, b)
    d = mx - mn
    if d == 0:
        h = 0
    elif mx == r:
        h = (60 * (g - b) / d) % 360
    elif mx == g:
        h = 60 * (b - r) / d + 120
    else:
        h = 60 * (r - g) / d + 240
    return h, (d / mx if mx else 0), mx / 255


def is_background_seed(px):
    r, g, b = px[:3]
    return r > 150 and g > 150 and b > 150


def clear_bottom_shadows(rgba, start_ratio):
    px = rgba.load()
    w, h = rgba.size
    for y in range(int(h * start_ratio), h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            mx, mn = max(r, g, b), min(r, g, b)
            sat = (mx - mn) / mx if mx else 0
            if sat < 0.22 and mx > 60:
                px[x, y] = (r, g, b, 0)


def remove_background(src, dst, bottom_crop=0, cleanup=None):
    im = Image.open(src).convert("RGB")
    im = im.crop((0, 4, im.width, im.height))
    w, h = im.size
    work = im.copy()

    px = work.load()
    gray_flags = []
    sat_vals = []
    val_vals = []
    red_flags = []
    for y in range(h):
        for x in range(w):
            p = px[x, y]
            hh, ss, vv = hsv(p)
            red = vv > 0.55 and ss > 0.35 and (hh < 20 or hh > 340)
            if red:
                px[x, y] = WHITE
            gray_flags.append(ss < 0.10 and vv > 0.30)
            sat_vals.append(ss)
            val_vals.append(vv)
            red_flags.append(red)

    seeds = []
    step = 20
    for x in range(0, w, step):
        seeds.extend(((x, 0), (x, h - 1)))
    for y in range(0, h, step):
        seeds.extend(((0, y), (w - 1, y)))
    for seed in seeds:
        if work.getpixel(seed) == SENTINEL:
            continue
        if is_background_seed(work.getpixel(seed)):
            ImageDraw.floodfill(work, seed, SENTINEL, thresh=BG_THRESHOLD)

    gray = Image.new("L", (w, h))
    gray.putdata([255 if f else 0 for f in gray_flags])
    border_seeds = []
    step = 8
    for x in range(0, w, step):
        border_seeds.extend(((x, 0), (x, h - 1)))
    for y in range(0, h, step):
        border_seeds.extend(((0, y), (w - 1, y)))
    for seed in border_seeds:
        if gray.getpixel(seed) == 255:
            ImageDraw.floodfill(gray, seed, 128)

    sentinel_pixels = work.getdata()
    gray_pixels = gray.getdata()
    binary = Image.new("L", (w, h))
    binary.putdata([
        0 if (p == SENTINEL or g == 128) else 255
        for p, g in zip(sentinel_pixels, gray_pixels)
    ])
    binary = binary.filter(ImageFilter.MinFilter(3))
    binary = binary.filter(ImageFilter.MaxFilter(3))
    binary = binary.filter(ImageFilter.MaxFilter(7))
    binary = binary.filter(ImageFilter.MinFilter(7))
    binary = binary.filter(ImageFilter.MedianFilter(5))

    binary_pixels = list(binary.getdata())
    soft_data = []
    for ss, vv, red, b in zip(sat_vals, val_vals, red_flags, binary_pixels):
        sat_a = smoothstep(0.05, 0.24, ss)
        dark_a = clamp((0.45 - vv) / 0.20)
        a = max(sat_a, dark_a)
        if red and b == 0:
            a = 0.0
        soft_data.append(int(round(a * 255)))
    soft = Image.new("L", (w, h))
    soft.putdata(soft_data)

    interior = binary.filter(ImageFilter.MinFilter(3))
    interior = interior.filter(ImageFilter.GaussianBlur(1.0))
    alpha = ImageChops.lighter(soft, interior)
    # Solid interior: cream belly pixels can land around alpha 180-240,
    # which shows as a translucent grey band over dark backgrounds.
    alpha = alpha.point(lambda v: 0 if v < 14 else (255 if v > 170 else v))
    alpha = alpha.filter(ImageFilter.MaxFilter(7))
    alpha = alpha.filter(ImageFilter.MinFilter(7))
    alpha = alpha.filter(ImageFilter.MinFilter(3))
    alpha = alpha.filter(ImageFilter.MinFilter(3))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.6))

    rgba = im.convert("RGBA")
    rgba.putalpha(alpha)

    if bottom_crop:
        rgba = rgba.crop((0, 0, w, h - bottom_crop))
        alpha = alpha.crop((0, 0, w, h - bottom_crop))
        binary = binary.crop((0, 0, w, h - bottom_crop))
        w, h = rgba.size
        # Keep the cut edge of the body opaque.
        ap, mp = alpha.load(), binary.load()
        for y in range(max(0, h - 3), h):
            for x in range(w):
                if mp[x, y] > 0:
                    ap[x, y] = 255
        rgba.putalpha(alpha)

    if cleanup is not None:
        clear_bottom_shadows(rgba, cleanup)
        alpha = rgba.getchannel("A")

    bbox = alpha.point(lambda v: 255 if v > 16 else 0).getbbox()
    if bbox:
        pad = 6
        bbox = (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(w, bbox[2] + pad),
            min(h, bbox[3] + pad),
        )
        rgba = rgba.crop(bbox)

    rgba.thumbnail((640, 640), Image.LANCZOS)
    rgba.save(dst, "PNG", optimize=True)
    return rgba


def main():
    src_dir, dst_dir = sys.argv[1], sys.argv[2]
    os.makedirs(dst_dir, exist_ok=True)
    made = []
    for name in os.listdir(src_dir):
        path = os.path.join(src_dir, name)
        if not os.path.isfile(path) or not name.lower().endswith((".jpg", ".jpeg", ".png")):
            continue
        entry = SIZE_MAP.get(os.path.getsize(path))
        if not entry:
            print("skip (unknown size):", os.path.getsize(path))
            continue
        slug, crop = entry
        dst = os.path.join(dst_dir, slug + ".png")
        img = remove_background(path, dst, crop, BOTTOM_CLEANUP.get(slug))
        made.append((slug, img.size))
        print("wrote", slug, img.size)


if __name__ == "__main__":
    main()
