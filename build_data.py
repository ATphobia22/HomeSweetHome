#!/usr/bin/env python3
"""Build the Mount Vernon open-world data pack from verified local sources.

Sources (all local, verified 2026-11-27):
- DEM grid: ~/workspace/mount-vernon-ue5/mount-vernon-heightgrid.json
  (Indiana 2020 DEM mosaic, 33 tiles, 200x200 grid, feet; NAVD88 assumed
  per the LOD1 manifest; units/datum flagged PENDING_EVIDENCE in source docs)
- Buildings: ~/workspace/mount-vernon-lod1/outputs/mount-vernon-lod1.geojson
  (4,482 LOD1 prisms, IGIO Building Footprints of Indiana 2016-2020,
  LiDAR 2020; heights DERIVED, NOT regulatory, NOT certified LAG)
- Roads: ~/workspace/mount-vernon-ue5/mount-vernon-roads.geojson
  (1,079 OSM features, Geofabrik Indiana 2026-11-18, ODbL)
- POIs: ~/workspace/mount-vernon-ue5/pois/mount-vernon-pois-for-world.json
  (44 OSM places with lon/lat; x/z recomputed here with CORRECT scales)
- NAIP texture: quadrants in ~/workspace/ts-spaces/tri-state-open-world-playable/assets/
  (USDA NAIP, public domain, baked 2026-11-19; mosaicked here)

Local frame (own definition): origin lon -87.8950, lat 37.9325 (near the
courthouse); x = east metres, z = south metres.
WGS84 scales at 37.9325 N: 87,912.9 m/deg lon, 110,995.2 m/deg lat.
Elevations stored in METRES (converted from feet x 0.3048).
"""
import json, math, os
from collections import Counter

WORK = os.path.dirname(os.path.abspath(__file__))
SRC_UE5 = "/home/hatch/workspace/mount-vernon-ue5"
SRC_LOD1 = "/home/hatch/workspace/mount-vernon-lod1/outputs"
SRC_NAIP = "/home/hatch/workspace/ts-spaces/tri-state-open-world-playable/assets"

LON0, LAT0 = -87.8950, 37.9325
M_LON, M_LAT = 87912.9, 110995.2
FT = 0.3048

def ll2xz(lon, lat):
    return ((lon - LON0) * M_LON, (LAT0 - lat) * M_LAT)

def dp(points, tol):
    """Douglas-Peucker simplification on [(x,z),...]; returns simplified list."""
    if len(points) <= 2:
        return points
    def dist(p, a, b):
        ax, az = a; bx, bz = b; px, pz = p
        dx, dz = bx - ax, bz - az
        L2 = dx * dx + dz * dz
        if L2 == 0:
            return math.hypot(px - ax, pz - az)
        t = max(0.0, min(1.0, ((px - ax) * dx + (pz - az) * dz) / L2))
        return math.hypot(px - (ax + t * dx), pz - (az + t * dz))
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        a, b = stack.pop()
        dmax, idx = 0.0, -1
        for i in range(a + 1, b):
            d = dist(points[i], points[a], points[b])
            if d > dmax:
                dmax, idx = d, i
        if dmax > tol and idx > 0:
            keep[idx] = True
            stack.append((a, idx)); stack.append((idx, b))
    return [p for p, k in zip(points, keep) if k]

# ---------------------------------------------------------------- DEM
dem = json.load(open(os.path.join(SRC_UE5, "mount-vernon-heightgrid.json")))
ROWS, COLS = dem["rows"], dem["cols"]
LON_MIN, LON_MAX = dem["lon_min"], dem["lon_max"]
LAT_MIN, LAT_MAX = dem["lat_min"], dem["lat_max"]
H = dem["heights_ft"]
assert len(H) == ROWS and all(len(r) == COLS for r in H), "grid shape"
# Row 0 = north edge (latMax), row ROWS-1 = south edge (latMin): verified
# 2026-11-27 (row0 mean ~431 ft, row199 mean ~365 ft, river min in south).
flat_m = []
for r in range(ROWS):
    for c in range(COLS):
        flat_m.append(round(H[r][c] * FT, 1))
dem_out = {
    "lonMin": LON_MIN, "lonMax": LON_MAX, "latMin": LAT_MIN, "latMax": LAT_MAX,
    "rows": ROWS, "cols": COLS, "origin": {"lon": LON0, "lat": LAT0},
    "units": "metres", "heights_m": flat_m,
}
json.dump(dem_out, open(os.path.join(WORK, "data", "dem.json"), "w"))
print("DEM: %dx%d, range %.1f..%.1f m, dem.json %d bytes" % (
    COLS, ROWS, min(flat_m), max(flat_m),
    os.path.getsize(os.path.join(WORK, "data", "dem.json"))))

# River mask: cells at/below 344.5 ft (105.0 m). The Ohio River surface is
# ~342.5 ft; the mask is stored as runs per row for a compact river mesh.
THRESH_FT = 344.5
runs = []
for r in range(ROWS):
    c = 0
    while c < COLS:
        if H[r][c] <= THRESH_FT:
            c0 = c
            while c < COLS and H[r][c] <= THRESH_FT:
                c += 1
            runs.append([r, c0, c - 1])
        else:
            c += 1
river_cells = sum(b - a + 1 for _, a, b in runs)
rows_hit = sorted(set(r for r, _, _ in runs))
print("RIVER: %d cells in %d runs, rows %d..%d (lat %.4f..%.4f)" % (
    river_cells, len(runs), min(rows_hit), max(rows_hit),
    LAT_MAX - (max(rows_hit) / (ROWS - 1)) * (LAT_MAX - LAT_MIN),
    LAT_MAX - (min(rows_hit) / (ROWS - 1)) * (LAT_MAX - LAT_MIN)))
json.dump({"threshold_ft": THRESH_FT, "rows": ROWS, "cols": COLS,
           "runs": runs},
          open(os.path.join(WORK, "data", "river.json"), "w"))

# ---------------------------------------------------------------- BUILDINGS
lod1 = json.load(open(os.path.join(SRC_LOD1, "mount-vernon-lod1.geojson")))
buildings = []
dropped = 0
for f in lod1["features"]:
    p = f["properties"]
    h_ft = p["height_proxy_ft"]
    if h_ft is None or h_ft < 1.0:
        dropped += 1
        continue
    ring = f["geometry"]["coordinates"][0]
    pts = [ll2xz(lon, lat) for lon, lat in ring]
    if pts[0] == pts[-1]:
        pts = pts[:-1]
    pts = dp(pts, 1.5)
    if len(pts) < 3:
        dropped += 1
        continue
    flat = []
    for x, z in pts:
        flat.append(round(x, 1)); flat.append(round(z, 1))
    buildings.append([round(p["z_ground_p05_ft"] * FT, 1),
                      round(h_ft * FT, 1), flat])
print("BUILDINGS: %d kept, %d dropped (height<1ft or degenerate ring)" % (
    len(buildings), dropped))
json.dump({"origin": {"lon": LON0, "lat": LAT0},
           "count": len(buildings),
           "buildings": buildings},
          open(os.path.join(WORK, "data", "buildings.json"), "w"))
print("  buildings.json %d bytes" % os.path.getsize(
    os.path.join(WORK, "data", "buildings.json")))

# ---------------------------------------------------------------- ROADS
roads_gj = json.load(open(os.path.join(SRC_UE5, "mount-vernon-roads.geojson")))
CLASSES = ["primary", "trunk", "trunk_link", "tertiary", "tertiary_link",
           "unclassified", "residential", "service", "footway", "cycleway",
           "track", "steps"]
roads = []
kept_classes = Counter()
for f in roads_gj["features"]:
    props = f["properties"]
    cls = props.get("fclass") or "unclassified"
    if cls not in CLASSES:
        cls = "unclassified"
    geom = f["geometry"]
    lines = []
    if geom["type"] == "LineString":
        lines = [geom["coordinates"]]
    elif geom["type"] == "MultiLineString":
        lines = geom["coordinates"]
    else:
        continue
    for line in lines:
        pts = []
        for lon, lat in line:
            if LON_MIN - 0.002 <= lon <= LON_MAX + 0.002 and \
               LAT_MIN - 0.002 <= lat <= LAT_MAX + 0.002:
                pts.append(ll2xz(lon, lat))
        if len(pts) < 2:
            continue
        pts = dp(pts, 2.0)
        if len(pts) < 2:
            continue
        flat = []
        for x, z in pts:
            flat.append(round(x, 1)); flat.append(round(z, 1))
        roads.append([CLASSES.index(cls),
                      props.get("name"), flat])
        kept_classes[cls] += 1
print("ROADS: %d polylines kept; classes %s" % (
    len(roads), dict(kept_classes)))
json.dump({"origin": {"lon": LON0, "lat": LAT0}, "classes": CLASSES,
           "count": len(roads), "roads": roads},
          open(os.path.join(WORK, "data", "roads.json"), "w"))
print("  roads.json %d bytes" % os.path.getsize(
    os.path.join(WORK, "data", "roads.json")))

# ---------------------------------------------------------------- POIs (lon/lat -> correct x/z)
pois_src = json.load(open(os.path.join(
    SRC_UE5, "pois", "mount-vernon-pois-for-world.json")))
pois = []
for pl in pois_src["places"]:
    x, z = ll2xz(pl["lon"], pl["lat"])
    pois.append({"name": pl["name"], "kind": pl["kind"],
                 "lon": pl["lon"], "lat": pl["lat"],
                 "x": round(x, 1), "z": round(z, 1),
                 "source": "Geofabrik Indiana OSM 2026-11-18 (ODbL)"})
json.dump({"origin": {"lon": LON0, "lat": LAT0}, "count": len(pois),
           "places": pois},
          open(os.path.join(WORK, "data", "pois.json"), "w"))
print("POIS: %d places, x/z recomputed with correct scales" % len(pois))
print("DONE")
