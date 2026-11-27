# Mount Vernon, Indiana — Open World

A fresh, original 3D open world of Mount Vernon, Indiana (Posey County), on the
Ohio River. Built from scratch in November 2026. No code from any other game
project was used here — every line of `index.html` and `app.js` was written for
this build.

**Live site:** deployed on Vercel (see the Vercel project `mount-vernon-open-world`).

## What it is

Walk, fly, or orbit around Mount Vernon: real ground, real buildings, real
streets, the muddy Ohio River, and one flood slider. The only simulation is the
flood slider — a water level, not a forecast.

- **Ground:** Indiana 2020 DEM mosaic (33 tiles, USGS 3DEP / IndianaMap),
  2.5 ft pixels, resampled to a 200×200 grid. Vertical datum treated as NAVD88
  (assumed from source fields, not independently certified).
- **Buildings:** 4,398 LOD1 prisms from IGIO Building Footprints of Indiana
  2016–2020 (LiDAR 2020). Heights are **derived estimates** (Overture Maps
  nearest match where available, 4 m rural median otherwise) — not surveyed,
  not certified, not regulatory.
- **Streets:** 1,109 OpenStreetMap ways (Geofabrik Indiana, 2026-11-18, ODbL).
- **Aerial photo:** USDA NAIP, public domain, four quadrants mosaicked for
  this area (2026-11-19 composite; the live USDA fetch failed from the build
  machine, so the earlier composite is reused).
- **Landmarks:** descriptions from the National Register form for the Mount
  Vernon Downtown Historic District (NPS Form 10-900, 2003). Positions from
  OSM points where available; street-address positions are approximate.
- **People:** Oak Grove Slim is the hero. Cutouts are real family photos,
  used as still figures — nobody is animated.

Base flood elevation **369.1 ft NAVD88** (FEMA FIS 18129CV000A Table 9).
Normal pool **342.5 ft**. The 1937 crest — 59.25 ft on the Mount Vernon gauge,
February 2, 1937 — is a gauge height, not a NAVD88 elevation.

## Files

- `index.html` — start card + HUD (pure HTML/CSS first paint).
- `app.js` — the whole world: terrain, river, flood slider, buildings,
  roads, landmarks, trees, sky, day cycle, orbit/walk/fly + touch controls.
- `assets/three.min.js` — Three.js r152 UMD (MIT), vendored for old-Safari safety.
- `assets/*.b64` — images stored as base64 text (the deploy path is
  text-only); decoded to blob URLs at runtime. Originals are the public-domain
  NAIP aerial and the family's own avatar/cutout images.
- `data/` — the compiled data pack (DEM grid, buildings, roads, river mask,
  POIs, landmarks). Built by `build_data.py` / `build_naip.py` from the
  verified local sources listed above.
- `build_data.py`, `build_naip.py` — the data-pack build scripts.
- `BUILD_LOG.md` — build journal, including what was verified and what was not.

## Notes / honesty labels

- Building heights are estimates; the courthouse, gazebo, and amphitheater
  models are interpretive (built from written descriptions, not measured
  drawings). Downtown storefront positions from street addresses are
  approximate. The riverfront amphitheater is an interpretive addition.
- South of the river, the elevation grid has an inpainted no-data patch
  (Kentucky bottomland) — flat by construction; the photo texture still shows
  the fields.
- Tree placement is seeded scatter on open ground, not a tree survey.
- **Not visually verified:** rendered captures time out in the build sandbox,
  so the live look was never seen there. The user's phone is the visual check.
