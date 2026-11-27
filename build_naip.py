#!/usr/bin/env python3
"""Build the NAIP ground texture + water mask from the four local quadrants.

Quadrants (USDA NAIP, public domain, baked 2026-11-19):
  naip-mv-nw.jpg = lonMin..lonMid, latMid..latMax (north-west)
  naip-mv-ne.jpg = lonMid..lonMax, latMid..latMax
  naip-mv-sw.jpg = lonMin..lonMid, latMin..latMid
  naip-mv-se.jpg = lonMid..lonMax, latMin..latMid
AOI: lon -87.94188..-87.83877, lat 37.89451..37.9776 (LOD1 manifest).

Water mask: NAIP darkness (river water is dark) AND DEM elevation < 346 ft.
The DEM-only low mask over-selects Kentucky bottomland south of the river;
the NAIP darkness is what separates actual water from low land.
Orientation is verified by agreement between NAIP-dark cells and DEM-low
cells (also tested against flips).
"""
import json, os
import numpy as np
from PIL import Image

WORK = os.path.dirname(os.path.abspath(__file__))
SRC = "/home/hatch/workspace/ts-spaces/tri-state-open-world-playable/assets"
AOI = {"lonMin": -87.94188, "lonMax": -87.83877,
       "latMin": 37.89451, "latMax": 37.9776}

quads = {}
for name in ("nw", "ne", "sw", "se"):
    im = Image.open(os.path.join(SRC, "naip-mv-%s.jpg" % name)).convert("RGB")
    assert im.size == (2048, 2048), (name, im.size)
    quads[name] = im

mosaic = Image.new("RGB", (4096, 4096))
mosaic.paste(quads["nw"], (0, 0))
mosaic.paste(quads["ne"], (2048, 0))
mosaic.paste(quads["sw"], (0, 2048))
mosaic.paste(quads["se"], (2048, 2048))
tex = mosaic.resize((2048, 2048), Image.LANCZOS)
tex.save(os.path.join(WORK, "assets", "naip-aoi.jpg"), quality=82)
print("TEXTURE: assets/naip-aoi.jpg %d bytes" % os.path.getsize(
    os.path.join(WORK, "assets", "naip-aoi.jpg")))

# Downscale mosaic to the 200x200 DEM grid (row 0 = north).
small = np.asarray(mosaic.resize((200, 200), Image.BILINEAR)).astype(float)
bright = small.mean(axis=2)  # 0..255
dem = json.load(open(os.path.join(WORK, "data", "dem.json")))
h = np.array(dem["heights_m"]).reshape(200, 200)
low = h <= 105.4  # 346 ft

# Sweep a brightness threshold; report water cells and agreement with low DEM.
for T in (60, 70, 80, 90, 100):
    dark = bright < T
    water = dark & low
    agree = (dark & low).sum() / max(1, dark.sum())
    print("T=%3d dark=%5d water(dark&low)=%5d  frac of dark that is low: %.2f" % (
        T, int(dark.sum()), int(water.sum()), agree))

# Orientation check: agreement of dark&low under flips (assumed orientation
# should win by a wide margin if the mosaic is the right way up).
T = 80
dark = bright < T
def score(d, l):
    return int((d & l).sum())
print("ORIENTATION dark&low: as-is=%d vflip=%d hflip=%d both=%d" % (
    score(dark, low), score(dark[::-1, :], low),
    score(dark[:, ::-1], low), score(dark[::-1, ::-1], low)))

# Final mask at T=80, as ASCII map (100 cols x 50 rows) for eyeballing.
water = dark & low
print("WATER MAP (100x50, # = water):")
for r in range(0, 200, 4):
    line = ""
    for c in range(0, 200, 2):
        line += "#" if water[r:r + 4, c:c + 2].any() else "."
    print(line)

def _runs(row):
    out, c = [], 0
    while c < len(row):
        if row[c]:
            a = c
            while c < len(row) and row[c]:
                c += 1
            out.append((a, c - 1))
        else:
            c += 1
    return out

runs = []
for r in range(200):
    for a, b in _runs(water[r]):
        runs.append([r, a, b])
print("WATER RUNS: %d cells in %d runs" % (int(water.sum()), len(runs)))
json.dump({"threshold_brightness": 80, "threshold_m": 105.4,
           "rows": 200, "cols": 200, "runs": runs},
          open(os.path.join(WORK, "data", "river.json"), "w"))
print("river.json rewritten from NAIP+DEM water mask")
