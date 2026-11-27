/* Mount Vernon, Indiana — Open World. Written from scratch for this build.
   No repo code. Three.js r152 (UMD, vendored) + public data only.
   Local frame: origin lon -87.8950, lat 37.9325; x = east metres, z = south metres.
   Elevations in metres (data converted from feet x 0.3048). */
(function () {
  'use strict';

  var LON0 = -87.8950, LAT0 = 37.9325;
  var M_LON = 87912.9, M_LAT = 110995.2; // WGS84 metres per degree at 37.9325 N
  var FT = 0.3048;
  var BFE_FT = 369.1, POOL_FT = 342.5;
  var BFE_M = BFE_FT * FT, POOL_M = POOL_FT * FT;
  var RIVER_M = POOL_M; // normal pool surface

  var S = {
    started: false, ready: false, three: null,
    scene: null, camera: null, renderer: null,
    dem: null, buildings: null, roads: null, river: null, pois: null, landmarks: null,
    groundSorted: [], floodMesh: null, floodLevelM: POOL_M,
    skyDome: null, skyUniforms: null, sun: null, hemi: null,
    mode: 'orbit', orbit: { tx: 16, ty: 115, tz: 74, theta: 0.6, phi: 1.05, dist: 420 },
    walk: { x: 16, z: 160, yaw: 0, pitch: -0.05 },
    fly: { x: 16, y: 260, z: 160, yaw: 0, pitch: -0.35 },
    joy: { x: 0, y: 0, active: false },
    flyUp: false, flyDown: false,
    occ: null, occCell: 5, occCols: 0, occRows: 0, occX0: 0, occZ0: 0,
    markers: [], stopMeshes: [], clock: null, timeH: 17.5,
    look: { id: null, x: 0, y: 0, moved: 0 }
  };

  function $(id) { return document.getElementById(id); }
  function frame() { return new Promise(function (res) { requestAnimationFrame(res); }); }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function toast(msg) {
    var t = $('toast'); t.textContent = msg; t.style.display = 'block';
    clearTimeout(t._h); t._h = setTimeout(function () { t.style.display = 'none'; }, 3500);
  }
  function progress(p, text) {
    $('progressFill').style.width = Math.round(p * 100) + '%';
    $('progressText').textContent = text;
  }

  // ---------- terrain height sampling (bilinear on the DEM grid) ----------
  function sampleHeight(x, z) {
    var d = S.dem; if (!d) return 110;
    var xMin = (d.lonMin - LON0) * M_LON, xMax = (d.lonMax - LON0) * M_LON;
    var zMin = (LAT0 - d.latMax) * M_LAT, zMax = (LAT0 - d.latMin) * M_LAT;
    var fx = clamp((x - xMin) / (xMax - xMin), 0, 1) * (d.cols - 1);
    var fz = clamp((z - zMin) / (zMax - zMin), 0, 1) * (d.rows - 1);
    var c0 = Math.floor(fx), r0 = Math.floor(fz);
    var c1 = Math.min(c0 + 1, d.cols - 1), r1 = Math.min(r0 + 1, d.rows - 1);
    var tx = fx - c0, tz = fz - r0, H = d.heights_m;
    var h00 = H[r0 * d.cols + c0], h10 = H[r0 * d.cols + c1];
    var h01 = H[r1 * d.cols + c0], h11 = H[r1 * d.cols + c1];
    return lerp(lerp(h00, h10, tx), lerp(h01, h11, tx), tz);
  }
  function riverCell(r, c) {
    return S._riverMask ? S._riverMask[r * S.dem.cols + c] === 1 : false;
  }

  // ---------- boot ----------
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src; s.onload = resolve;
      s.onerror = function () { reject(new Error('failed to load ' + src)); };
      document.head.appendChild(s);
    });
  }
  function fetchJSON(path) {
    return fetch(path).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + path);
      return r.json();
    });
  }
  // Images are stored as base64 text files (the repo push path is text-only),
  // so decode them to blob URLs at runtime. Works on iOS 15-era Safari.
  function b64ToBlobURL(b64, mime) {
    var bin = atob(b64.replace(/\s/g, ''));
    var len = bin.length, bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: mime }));
  }
  function loadB64Texture(path, mime) {
    return fetch(path).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + path);
      return r.text();
    }).then(function (b64) {
      return new Promise(function (resolve, reject) {
        new S.three.TextureLoader().load(b64ToBlobURL(b64, mime), resolve, undefined, reject);
      });
    });
  }

  async function boot() {
    if (S.started) return; S.started = true;
    $('start').style.display = 'none';
    $('progress').classList.add('on');
    try {
      progress(0.05, 'Loading 3D engine…');
      await loadScript('assets/three.min.js');
      S.three = window.THREE;
      if (!S.three || !S.three.WebGLRenderer) throw new Error('Three.js did not load');
      var files = ['data/dem.json', 'data/buildings.json', 'data/roads.json',
                   'data/river.json', 'data/pois.json', 'data/landmarks.json'];
      var loaded = 0;
      var datas = await Promise.all(files.map(function (f) {
        return fetchJSON(f).then(function (j) {
          loaded++; progress(0.05 + 0.25 * (loaded / files.length), 'Loading map data… (' + loaded + '/' + files.length + ')');
          return j;
        });
      }));
      S.dem = datas[0]; S.buildings = datas[1]; S.roads = datas[2];
      S.river = datas[3]; S.pois = datas[4]; S.landmarks = datas[5];
      S._riverMask = new Uint8Array(S.dem.rows * S.dem.cols);
      S.river.runs.forEach(function (run) {
        for (var c = run[1]; c <= run[2]; c++) S._riverMask[run[0] * S.dem.cols + c] = 1;
      });
      S.groundSorted = S.buildings.buildings.map(function (b) { return b[0]; }).sort(function (a, b) { return a - b; });

      progress(0.32, 'Starting renderer…');
      initRenderer();
      await frame();
      progress(0.36, 'Building ground…');
      await buildTerrain();
      progress(0.52, 'Building the river…');
      await buildRiver();
      progress(0.58, 'Raising the town… (4,398 buildings)');
      await buildBuildings();
      progress(0.74, 'Laying streets…');
      await buildRoads();
      progress(0.80, 'Placing landmarks…');
      await buildLandmarks();
      progress(0.86, 'Planting trees…');
      await buildVegetation();
      progress(0.92, 'Lighting the golden hour…');
      buildSkyAndLights();
      setTimeOfDay(S.timeH);
      setFlood(POOL_FT);
      await frame();
      progress(1, 'Ready.');
      $('progress').classList.remove('on');
      $('hud').classList.add('on');
      S.ready = true;
      S.clock = { last: performance.now() };
      setMode('orbit');
      requestAnimationFrame(tick);
      toast('Welcome to Mount Vernon. Drag to look around — try the flood slider.');
    } catch (err) {
      progress(1, 'Could not start: ' + err.message);
      toast('Something failed to load. Check your connection and try again.');
      S.started = false;
    }
  }

  function initRenderer() {
    var THREE = S.three;
    var container = $('scene');
    var renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xcfd8dd, 2500, 9000);
    var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.5, 14000);
    camera.position.set(16, 260, 600);
    S.renderer = renderer; S.scene = scene; S.camera = camera;
    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    bindPointer();
  }

  // ---------- terrain ----------
  async function buildTerrain() {
    var THREE = S.three, d = S.dem;
    var xMin = (d.lonMin - LON0) * M_LON, xMax = (d.lonMax - LON0) * M_LON;
    var zMin = (LAT0 - d.latMax) * M_LAT, zMax = (LAT0 - d.latMin) * M_LAT;
    var cols = d.cols, rows = d.rows, H = d.heights_m;
    var pos = new Float32Array(cols * rows * 3);
    var uv = new Float32Array(cols * rows * 2);
    var idx = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var i = r * cols + c;
        var h = H[i];
        if (S._riverMask[i] === 1 && h > 104.2) h = 104.2; // carve the channel
        pos[i * 3] = xMin + (c / (cols - 1)) * (xMax - xMin);
        pos[i * 3 + 1] = h;
        pos[i * 3 + 2] = zMin + (r / (rows - 1)) * (zMax - zMin);
        uv[i * 2] = c / (cols - 1);
        uv[i * 2 + 1] = 1 - r / (rows - 1);
      }
      if (r % 50 === 0) await frame();
    }
    for (var r2 = 0; r2 < rows - 1; r2++) {
      for (var c2 = 0; c2 < cols - 1; c2++) {
        var a = r2 * cols + c2, b = a + 1, cc = a + cols, dd = cc + 1;
        idx.push(a, cc, b, b, cc, dd);
      }
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    var tex = await loadB64Texture('assets/naip-aoi.jpg.b64', 'image/jpeg');
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = Math.min(4, S.renderer.capabilities.getMaxAnisotropy());
    var mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: tex }));
    S.scene.add(mesh);
    // skirts: drop the four edges 45 m so no void shows at the map rim
    var skirtPos = [];
    function edge(c0, r0, c1, r1) {
      var steps = 60;
      for (var s = 0; s < steps; s++) {
        var t0 = s / steps, t1 = (s + 1) / steps;
        var xa = xMin + (c0 + (c1 - c0) * t0) / (cols - 1) * (xMax - xMin);
        var za = zMin + (r0 + (r1 - r0) * t0) / (rows - 1) * (zMax - zMin);
        var xb = xMin + (c0 + (c1 - c0) * t1) / (cols - 1) * (xMax - xMin);
        var zb = zMin + (r0 + (r1 - r0) * t1) / (rows - 1) * (zMax - zMin);
        var ya = sampleHeight(xa, za), yb = sampleHeight(xb, zb);
        skirtPos.push(xa, ya, za, xb, yb, zb, xb, yb - 45, zb);
        skirtPos.push(xa, ya, za, xb, yb - 45, zb, xa, ya - 45, za);
      }
    }
    edge(0, 0, cols - 1, 0); edge(cols - 1, 0, cols - 1, rows - 1);
    edge(cols - 1, rows - 1, 0, rows - 1); edge(0, rows - 1, 0, 0);
    var sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.Float32BufferAttribute(skirtPos, 3));
    sg.computeVertexNormals();
    S.scene.add(new THREE.Mesh(sg, new THREE.MeshLambertMaterial({ color: 0x4a3f2a })));
    S._xMin = xMin; S._xMax = xMax; S._zMin = zMin; S._zMax = zMax;
  }

  // ---------- river + flood ----------
  async function buildRiver() {
    var THREE = S.three, d = S.dem;
    var xMin = S._xMin, xMax = S._xMax, zMin = S._zMin, zMax = S._zMax;
    var cw = (xMax - xMin) / (d.cols - 1), ch = (zMax - zMin) / (d.rows - 1);
    var pos = [], col = [];
    var cA = [0.42, 0.32, 0.20], cB = [0.30, 0.22, 0.13]; // muddy Ohio brown
    var runs = S.river.runs;
    for (var i = 0; i < runs.length; i++) {
      var run = runs[i], r = run[0];
      var z0 = zMin + r * ch, z1 = z0 + ch;
      var x0 = xMin + run[1] * cw, x1 = xMin + (run[2] + 1) * cw;
      var mid = (run[1] + run[2]) / 2 / (d.cols - 1);
      var cc = [lerp(cA[0], cB[0], mid), lerp(cA[1], cB[1], mid), lerp(cA[2], cB[2], mid)];
      pos.push(x0, RIVER_M, z0, x1, RIVER_M, z0, x1, RIVER_M, z1);
      pos.push(x0, RIVER_M, z0, x1, RIVER_M, z1, x0, RIVER_M, z1);
      for (var k = 0; k < 6; k++) col.push(cc[0], cc[1], cc[2]);
      if (i % 60 === 0) await frame();
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geo.computeVertexNormals();
    var mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true }));
    S.scene.add(mesh);
    // flood plane: whole area, semi-transparent muddy water, raised by the slider
    var fgeo = new THREE.PlaneGeometry(xMax - xMin, zMax - zMin);
    fgeo.rotateX(-Math.PI / 2);
    var fmesh = new THREE.Mesh(fgeo, new THREE.MeshLambertMaterial({
      color: 0x6b4e2e, transparent: true, opacity: 0.55, depthWrite: false }));
    fmesh.position.set((xMin + xMax) / 2, RIVER_M, (zMin + zMax) / 2);
    fmesh.visible = false;
    S.scene.add(fmesh);
    S.floodMesh = fmesh;
  }

  function setFlood(ft) {
    var m = ft * FT;
    S.floodLevelM = m;
    if (S.floodMesh) {
      S.floodMesh.visible = ft > POOL_FT + 0.05;
      S.floodMesh.position.y = m;
    }
    var label = ft.toFixed(1) + ' ft';
    if (Math.abs(ft - POOL_FT) < 0.05) label += ' · normal pool';
    else if (Math.abs(ft - BFE_FT) < 0.05) label += ' · BFE — base flood';
    else if (ft > BFE_FT) label += ' · above BFE';
    var below = 0;
    var arr = S.groundSorted;
    for (var i = 0; i < arr.length; i++) { if (arr[i] < m) below++; else break; }
    if (ft > POOL_FT + 0.05) label += ' · ' + below + ' buildings below water';
    var el = $('floodRead'); if (el) el.textContent = label;
  }

  // ---------- buildings (one merged mesh, vertex colors) ----------
  async function buildBuildings() {
    var THREE = S.three;
    var list = S.buildings.buildings;
    var palette = [0x9a5b4a, 0xb59a7a, 0x8a8a8a, 0x7a5a4a, 0xcbb89a, 0x6e5a4e, 0xa86a4a];
    var roofs = [0x4a4a4a, 0x5a4632, 0x3f3a36, 0x6b4a35];
    var histPts = S.landmarks.landmarks.filter(function (l) {
      return l.procedural === 'plaque';
    }).map(function (l) { return [l.x, l.z]; });
    var pos = [], col = [];
    var tmpC = new THREE.Color();
    function pushTri(a, b, c, hex) {
      pos.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
      tmpC.setHex(hex);
      for (var k = 0; k < 3; k++) col.push(tmpC.r, tmpC.g, tmpC.b);
    }
    for (var i = 0; i < list.length; i++) {
      var b = list[i], g0 = b[0], h = b[1], ring = b[2];
      var n = ring.length / 2;
      var cx = 0, cz = 0;
      for (var v = 0; v < n; v++) { cx += ring[v * 2]; cz += ring[v * 2 + 1]; }
      cx /= n; cz /= n;
      var historic = false;
      for (var q = 0; q < histPts.length; q++) {
        var dx = cx - histPts[q][0], dz = cz - histPts[q][1];
        if (dx * dx + dz * dz < 900) { historic = true; break; }
      }
      var wallHex = historic ? 0xa33d2a : palette[(i * 2654435761) % palette.length];
      var roofHex = historic ? 0x4a2f28 : roofs[(i * 40503) % roofs.length];
      var y0 = g0, y1 = g0 + h;
      // signed area in (x,z) to fix winding (walls outward, roof up)
      var area = 0;
      for (var e = 0; e < n; e++) {
        var x0 = ring[e * 2], z0 = ring[e * 2 + 1];
        var x1 = ring[((e + 1) % n) * 2], z1 = ring[((e + 1) % n) * 2 + 1];
        area += x0 * z1 - x1 * z0;
      }
      var flip = area > 0;
      for (var e2 = 0; e2 < n; e2++) {
        var ax = ring[e2 * 2], az = ring[e2 * 2 + 1];
        var bx = ring[((e2 + 1) % n) * 2], bz = ring[((e2 + 1) % n) * 2 + 1];
        var A = [ax, y0, az], B = [bx, y0, bz], C = [bx, y1, bz], D = [ax, y1, az];
        if (flip) { pushTri(A, C, B, wallHex); pushTri(A, D, C, wallHex); }
        else { pushTri(A, B, C, wallHex); pushTri(A, C, D, wallHex); }
      }
      // roof: triangulate the ring, force +y normal
      var contour = [];
      for (var v2 = 0; v2 < n; v2++) contour.push(new THREE.Vector2(ring[v2 * 2], ring[v2 * 2 + 1]));
      var tris = null;
      try { tris = THREE.ShapeUtils.triangulateShape(contour, []); } catch (err) { tris = null; }
      if (tris && tris.length) {
        for (var t = 0; t < tris.length; t++) {
          var ia = tris[t][0], ib = tris[t][1], ic = tris[t][2];
          var pa = [ring[ia * 2], y1, ring[ia * 2 + 1]];
          var pb = [ring[ib * 2], y1, ring[ib * 2 + 1]];
          var pc = [ring[ic * 2], y1, ring[ic * 2 + 1]];
          if (flip) pushTri(pa, pc, pb, roofHex); else pushTri(pa, pb, pc, roofHex);
        }
      } else {
        for (var f = 1; f < n - 1; f++) {
          var p0 = [ring[0], y1, ring[1]], p1 = [ring[f * 2], y1, ring[f * 2 + 1]];
          var p2 = [ring[(f + 1) * 2], y1, ring[(f + 1) * 2 + 1]];
          if (flip) pushTri(p0, p2, p1, roofHex); else pushTri(p0, p1, p2, roofHex);
        }
      }
      if (i % 400 === 0) await frame();
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geo.computeVertexNormals();
    S.scene.add(new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true })));
  }

  // ---------- roads (merged ribbons) ----------
  async function buildRoads() {
    var THREE = S.three;
    var widths = { primary: 4.0, trunk: 4.0, trunk_link: 3.5, tertiary: 3.5, tertiary_link: 3.0,
      unclassified: 3.0, residential: 3.0, service: 2.5, footway: 1.2, cycleway: 1.2, track: 2.0, steps: 1.2 };
    var pos = [], col = [];
    var tmpC = new THREE.Color();
    var classes = S.roads.classes;
    for (var i = 0; i < S.roads.roads.length; i++) {
      var rd = S.roads.roads[i], cls = classes[rd[0]], flat = rd[2];
      var w = widths[cls] || 3.0;
      var hex = (cls === 'footway' || cls === 'cycleway' || cls === 'steps') ? 0x777777 :
                (cls === 'track' ? 0x555555 : 0x333333);
      tmpC.setHex(hex);
      var n = flat.length / 2;
      for (var s = 0; s < n - 1; s++) {
        var x0 = flat[s * 2], z0 = flat[s * 2 + 1];
        var x1 = flat[(s + 1) * 2], z1 = flat[(s + 1) * 2 + 1];
        var dx = x1 - x0, dz = z1 - z0, len = Math.hypot(dx, dz) || 1;
        var nx = -dz / len * w, nz = dx / len * w;
        var y0 = Math.max(sampleHeight(x0, z0), 105.5) + 0.3;
        var y1 = Math.max(sampleHeight(x1, z1), 105.5) + 0.3;
        var L0 = [x0 + nx, y0, z0 + nz], R0 = [x0 - nx, y0, z0 - nz];
        var L1 = [x1 + nx, y1, z1 + nz], R1 = [x1 - nx, y1, z1 - nz];
        [L0, R0, R1, L0, R1, L1].forEach(function (p) {
          pos.push(p[0], p[1], p[2]); col.push(tmpC.r, tmpC.g, tmpC.b);
        });
      }
      if (i % 300 === 0) await frame();
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geo.computeVertexNormals();
    S.scene.add(new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true })));
  }

  // ---------- landmarks, markers, cast ----------
  function makeLabelSprite(text) {
    var THREE = S.three;
    var cv = document.createElement('canvas'); cv.width = 512; cv.height = 128;
    var ctx = cv.getContext('2d');
    ctx.fillStyle = 'rgba(10,18,10,0.78)';
    ctx.fillRect(6, 18, 500, 92);
    ctx.strokeStyle = 'rgba(212,160,23,0.9)'; ctx.lineWidth = 4;
    ctx.strokeRect(6, 18, 500, 92);
    ctx.fillStyle = '#ffe9a8'; ctx.font = 'bold 44px -apple-system, Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 66, 480);
    var tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    sp.scale.set(26, 6.5, 1);
    return sp;
  }
  function addMarker(x, z, info, opts) {
    var THREE = S.three;
    var y = sampleHeight(x, z);
    var mesh;
    if (opts && opts.poi) {
      mesh = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 6),
        new THREE.MeshBasicMaterial({ color: 0xffffff }));
      mesh.position.set(x, y + 2.5, z);
    } else {
      mesh = new THREE.Mesh(new THREE.OctahedronGeometry(opts && opts.big ? 1.5 : 0.9),
        new THREE.MeshBasicMaterial({ color: 0xd4a017 }));
      mesh.position.set(x, y + (opts && opts.big ? 7 : 4), z);
      mesh.userData.baseY = mesh.position.y;
      mesh.userData.bob = !!opts && !!opts.big;
      S.stopMeshes.push(mesh);
    }
    mesh.userData.info = info;
    S.scene.add(mesh);
    S.markers.push(mesh);
    if (opts && opts.label) {
      var sp = makeLabelSprite(info.name);
      sp.position.set(x, y + 13, z);
      S.scene.add(sp);
    }
    return mesh;
  }
  function box(w, h, d, color, x, y, z) {
    var THREE = S.three;
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d),
      new THREE.MeshLambertMaterial({ color: color }));
    m.position.set(x, y, z);
    S.scene.add(m);
    return m;
  }

  async function buildLandmarks() {
    var THREE = S.three;
    var byId = {};
    S.landmarks.landmarks.forEach(function (l) { byId[l.id] = l; });
    var gy = function (x, z) { return sampleHeight(x, z); };
    // courthouse: brick block + clock tower + gold dome
    var ch = byId.courthouse, cy = gy(ch.x, ch.z);
    box(36, 11, 26, 0x8e3b2f, ch.x, cy + 5.5, ch.z);
    box(9, 20, 9, 0x8e3b2f, ch.x, cy + 11 + 10, ch.z);
    var dome = new THREE.Mesh(new THREE.SphereGeometry(5, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshPhongMaterial({ color: 0xd4a017, shininess: 90 }));
    dome.position.set(ch.x, cy + 31, ch.z);
    S.scene.add(dome);
    [0, Math.PI].forEach(function (ry) {
      var face = new THREE.Mesh(new THREE.CircleGeometry(1.7, 20),
        new THREE.MeshBasicMaterial({ color: 0xf5f0dc }));
      face.position.set(ch.x, cy + 26, ch.z + (ry === 0 ? 4.6 : -4.6));
      face.rotation.y = ry;
      S.scene.add(face);
    });
    // gazebo on its real footprint
    var gz = byId.gazebo, gzY = gy(gz.x, gz.z);
    var ring = S.buildings.buildings[gz.footprint_building][2];
    var xs = ring.filter(function (_, i) { return i % 2 === 0; });
    var zs = ring.filter(function (_, i) { return i % 2 === 1; });
    var w = Math.max.apply(null, xs) - Math.min.apply(null, xs);
    var dpt = Math.max.apply(null, zs) - Math.min.apply(null, zs);
    box(w + 1, 1.4, dpt + 1, 0x7a4034, gz.x, gzY + 0.7, gz.z);
    for (var p = 0; p < 6; p++) {
      var a = p / 6 * Math.PI * 2;
      var px = gz.x + Math.cos(a) * (w / 2), pz = gz.z + Math.sin(a) * (dpt / 2);
      var post = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.8, 6),
        new THREE.MeshLambertMaterial({ color: 0x5a3a28 }));
      post.position.set(px, gzY + 1.4 + 1.4, pz);
      S.scene.add(post);
    }
    var roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, dpt) / 2 + 1.4, 3.2, 8),
      new THREE.MeshLambertMaterial({ color: 0xa85f3c }));
    roof.position.set(gz.x, gzY + 1.4 + 2.8 + 1.6, gz.z);
    S.scene.add(roof);
    // 1937 flood monument: concrete obelisk
    var fm = byId['flood-monument'], fy = gy(fm.x, fm.z);
    var ob = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.9, 4.6, 4),
      new THREE.MeshLambertMaterial({ color: 0xb8b4a8 }));
    ob.position.set(fm.x, fy + 2.3, fm.z);
    ob.rotation.y = Math.PI / 4;
    S.scene.add(ob);
    // high school field: green plane
    var hf = byId['hs-field'], hy = gy(hf.x, hf.z);
    var field = new THREE.Mesh(new THREE.PlaneGeometry(100, 60),
      new THREE.MeshLambertMaterial({ color: 0x4a7a3a }));
    field.rotation.x = -Math.PI / 2;
    field.position.set(hf.x, hy + 0.25, hf.z);
    S.scene.add(field);
    // amphitheater: three stepped half-rings facing the river (south)
    var am = byId.amphitheater, ay = gy(am.x, am.z);
    for (var s2 = 0; s2 < 3; s2++) {
      var step = new THREE.Mesh(
        new THREE.CylinderGeometry(10 + s2 * 4, 10 + s2 * 4, 1.1, 24, 1, true, Math.PI, Math.PI),
        new THREE.MeshLambertMaterial({ color: 0x9a938a, side: THREE.DoubleSide }));
      step.position.set(am.x, ay + 0.55 + s2 * 1.1, am.z);
      S.scene.add(step);
    }
    box(8, 1, 5, 0x8a8378, am.x, ay + 0.5, am.z + 2);
    // water towers
    [['water-tower-north'], ['water-tower-south']].forEach(function (pair) {
      var wt = byId[pair[0]], wy = gy(wt.x, wt.z);
      for (var l = 0; l < 4; l++) {
        var la = l / 4 * Math.PI * 2 + Math.PI / 4;
        var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 12, 6),
          new THREE.MeshLambertMaterial({ color: 0x8a8a86 }));
        leg.position.set(wt.x + Math.cos(la) * 2.6, wy + 6, wt.z + Math.sin(la) * 2.6);
        S.scene.add(leg);
      }
      var tank = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 7, 16),
        new THREE.MeshLambertMaterial({ color: 0xd8d8d0 }));
      tank.position.set(wt.x, wy + 15.5, wt.z);
      S.scene.add(tank);
      var cap = new THREE.Mesh(new THREE.ConeGeometry(4.4, 2.4, 16),
        new THREE.MeshLambertMaterial({ color: 0xb8b8b0 }));
      cap.position.set(wt.x, wy + 20.2, wt.z);
      S.scene.add(cap);
    });
    // markers: stops get big gold markers + labels; other landmarks small markers
    var stops = S.landmarks.stops;
    S.landmarks.landmarks.forEach(function (l) {
      var isStop = stops.indexOf(l.id) >= 0;
      addMarker(l.x, l.z, {
        name: l.name, kind: l.kind, desc: l.desc, source: l.source,
        approx: l.approx, x: l.x, z: l.z
      }, { big: isStop, label: isStop });
    });
    // POI markers (name only)
    S.pois.places.forEach(function (pl) {
      addMarker(pl.x, pl.z, {
        name: pl.name, kind: pl.kind,
        desc: 'A place in Mount Vernon, from OpenStreetMap.',
        source: pl.source, approx: false, x: pl.x, z: pl.z
      }, { poi: true });
    });
    // cast: still cutout billboards (nobody animated)
    var cast = S.landmarks.cast || [];
    for (var ci = 0; ci < cast.length; ci++) {
      (function (c) {
        loadB64Texture(c.file + '.b64', c.file.slice(-4) === '.png' ? 'image/png' : 'image/webp').then(function (tex) {
          tex.colorSpace = THREE.SRGBColorSpace;
          var iw = tex.image.width, ih = tex.image.height;
          var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
          var hgt = 1.9;
          sp.scale.set(hgt * iw / ih, hgt, 1);
          sp.position.set(c.x, sampleHeight(c.x, c.z) + hgt / 2, c.z);
          sp.userData.info = { name: c.name, kind: 'cast', desc: c.note,
            source: 'Family cutout — a still figure, not animated.', approx: false, x: c.x, z: c.z };
          S.scene.add(sp);
          S.markers.push(sp);
        });
      })(cast[ci]);
    }
    await frame();
  }

  // ---------- vegetation (seeded scatter, instanced) ----------
  async function buildVegetation() {
    var THREE = S.three;
    // occupancy grid, 5 m cells, from buildings + roads + river
    var cell = 5;
    var x0 = S._xMin, z0 = S._zMin;
    var cols = Math.ceil((S._xMax - S._xMin) / cell), rows = Math.ceil((S._zMax - S._zMin) / cell);
    var occ = new Uint8Array(cols * rows);
    function mark(x, z) {
      var c = Math.floor((x - x0) / cell), r = Math.floor((z - z0) / cell);
      if (c >= 0 && c < cols && r >= 0 && r < rows) occ[r * cols + c] = 1;
    }
    function inside(x, z, ring) {
      var n = ring.length / 2, insideFlag = false;
      for (var i = 0, j = n - 1; i < n; j = i++) {
        var xi = ring[i * 2], zi = ring[i * 2 + 1], xj = ring[j * 2], zj = ring[j * 2 + 1];
        if (((zi > z) !== (zj > z)) && (x < (xj - xi) * (z - zi) / (zj - zi) + xi)) insideFlag = !insideFlag;
      }
      return insideFlag;
    }
    var blist = S.buildings.buildings;
    for (var bi = 0; bi < blist.length; bi++) {
      var ring = blist[bi][2], n = ring.length / 2;
      var mnx = 1e9, mxx = -1e9, mnz = 1e9, mxz = -1e9;
      for (var v = 0; v < n; v++) {
        mnx = Math.min(mnx, ring[v * 2]); mxx = Math.max(mxx, ring[v * 2]);
        mnz = Math.min(mnz, ring[v * 2 + 1]); mxz = Math.max(mxz, ring[v * 2 + 1]);
      }
      var c0 = Math.floor((mnx - x0) / cell), c1 = Math.floor((mxx - x0) / cell);
      var r0 = Math.floor((mnz - z0) / cell), r1 = Math.floor((mxz - z0) / cell);
      for (var rr = r0; rr <= r1; rr++) for (var cc = c0; cc <= c1; cc++) {
        if (cc < 0 || cc >= cols || rr < 0 || rr >= rows) continue;
        var px = x0 + (cc + 0.5) * cell, pz = z0 + (rr + 0.5) * cell;
        if (inside(px, pz, ring)) occ[rr * cols + cc] = 1;
      }
      if (bi % 800 === 0) await frame();
    }
    S.roads.roads.forEach(function (rd) {
      var flat = rd[2];
      for (var s = 0; s < flat.length / 2 - 1; s++) {
        var ax = flat[s * 2], az = flat[s * 2 + 1], bx = flat[(s + 1) * 2], bz = flat[(s + 1) * 2 + 1];
        var len = Math.hypot(bx - ax, bz - az), steps = Math.max(1, Math.ceil(len / 2.5));
        for (var k = 0; k <= steps; k++) mark(ax + (bx - ax) * k / steps, az + (bz - az) * k / steps);
      }
    });
    for (var ri = 0; ri < S.dem.rows; ri++) for (var ci2 = 0; ci2 < S.dem.cols; ci2++) {
      if (S._riverMask[ri * S.dem.cols + ci2] === 1) {
        var wx = S._xMin + (ci2 / (S.dem.cols - 1)) * (S._xMax - S._xMin);
        var wz = S._zMin + (ri / (S.dem.rows - 1)) * (S._zMax - S._zMin);
        mark(wx, wz);
      }
    }
    S.occ = occ; S.occCols = cols; S.occRows = rows; S.occX0 = x0; S.occZ0 = z0; S.occCell = cell;
    // scatter trees on free land above the river
    var rnd = mulberry32(20261127);
    var trunkGeo = new THREE.CylinderGeometry(0.18, 0.28, 1.4, 6);
    var canopyGeo = new THREE.ConeGeometry(1.5, 3.4, 8);
    var trunkMat = new THREE.MeshLambertMaterial({ color: 0x5a4030 });
    var canopyMat = new THREE.MeshLambertMaterial({ color: 0x3f6b2f });
    var spots = [];
    var tries = 0;
    var lmPts = S.landmarks.landmarks.map(function (l) { return [l.x, l.z]; });
    while (spots.length < 1400 && tries < 9000) {
      tries++;
      var tx = S._xMin + 60 + rnd() * (S._xMax - S._xMin - 120);
      var tz = S._zMin + 60 + rnd() * (S._zMax - S._zMin - 120);
      var th = sampleHeight(tx, tz);
      if (th < 106) continue;
      var cc3 = Math.floor((tx - x0) / cell), rr3 = Math.floor((tz - z0) / cell);
      if (cc3 < 0 || cc3 >= cols || rr3 < 0 || rr3 >= rows) continue;
      if (occ[rr3 * cols + cc3] === 1) continue;
      var nearLm = false;
      for (var li = 0; li < lmPts.length; li++) {
        var ddx = tx - lmPts[li][0], ddz = tz - lmPts[li][1];
        if (ddx * ddx + ddz * ddz < 225) { nearLm = true; break; }
      }
      if (nearLm) continue;
      spots.push([tx, th, tz, 0.8 + rnd() * 0.6, rnd() * Math.PI * 2]);
    }
    var trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, spots.length);
    var canopies = new THREE.InstancedMesh(canopyGeo, canopyMat, spots.length);
    var m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    var sv = new THREE.Vector3(), pv = new THREE.Vector3();
    for (var ti = 0; ti < spots.length; ti++) {
      var sp = spots[ti];
      e.set(0, sp[4], 0); q.setFromEuler(e);
      pv.set(sp[0], sp[1] + 0.7 * sp[3], sp[2]); sv.set(sp[3], sp[3], sp[3]);
      m4.compose(pv, q, sv); trunks.setMatrixAt(ti, m4);
      pv.set(sp[0], sp[1] + (1.4 + 1.7) * sp[3], sp[2]);
      m4.compose(pv, q, sv); canopies.setMatrixAt(ti, m4);
    }
    trunks.instanceMatrix.needsUpdate = true;
    canopies.instanceMatrix.needsUpdate = true;
    S.scene.add(trunks); S.scene.add(canopies);
    await frame();
  }

  // ---------- sky + lights ----------
  function buildSkyAndLights() {
    var THREE = S.three;
    var uniforms = {
      topColor: { value: new THREE.Color(0x6fa8d8) },
      horizonColor: { value: new THREE.Color(0xf0c98a) },
      groundColor: { value: new THREE.Color(0x5a5140) },
      sunDir: { value: new THREE.Vector3(0, 0.2, 1) },
      sunColor: { value: new THREE.Color(0xffb36b) }
    };
    var skyMat = new THREE.ShaderMaterial({
      uniforms: uniforms, side: THREE.BackSide, depthWrite: false, fog: false,
      vertexShader: 'varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'varying vec3 vDir; uniform vec3 topColor; uniform vec3 horizonColor; uniform vec3 groundColor; uniform vec3 sunDir; uniform vec3 sunColor;' +
        'void main(){ vec3 d = normalize(vDir); float h = d.y;' +
        ' vec3 col = h > 0.0 ? mix(horizonColor, topColor, pow(h, 0.55)) : mix(horizonColor, groundColor, pow(-h, 0.5));' +
        ' float s = pow(max(dot(d, normalize(sunDir)), 0.0), 120.0);' +
        ' float halo = pow(max(dot(d, normalize(sunDir)), 0.0), 8.0);' +
        ' col += sunColor * (s * 1.2 + halo * 0.25); gl_FragColor = vec4(col, 1.0); }'
    });
    var dome = new THREE.Mesh(new THREE.SphereGeometry(6000, 24, 12), skyMat);
    dome.frustumCulled = false;
    S.scene.add(dome);
    S.skyDome = dome; S.skyUniforms = uniforms;
    S.hemi = new THREE.HemisphereLight(0xbcd3e8, 0x8a7a5a, 0.75);
    S.scene.add(S.hemi);
    S.sun = new THREE.DirectionalLight(0xffd9a0, 1.0);
    S.sun.target.position.set(0, 110, 0);
    S.scene.add(S.sun); S.scene.add(S.sun.target);
  }
  function setTimeOfDay(h) {
    S.timeH = h;
    var THREE = S.three;
    var a = (h - 6) / 12 * Math.PI; // 0 at 6 AM (east), PI at 6 PM (west)
    var el = Math.sin(a) * 55 + 3; // degrees
    var elR = el * Math.PI / 180;
    var sd = new THREE.Vector3(Math.cos(a), Math.sin(elR), Math.sin(a)).normalize();
    var day = Math.max(0, Math.sin(a)); // 0 at rise/set, 1 at noon
    var top = new THREE.Color(0x3a5a7d).lerp(new THREE.Color(0x5f9fd0), day);
    var hor = new THREE.Color(0xf0a35e).lerp(new THREE.Color(0xcfd8dd), day);
    var sunC = new THREE.Color(0xffb36b).lerp(new THREE.Color(0xfff2dd), day);
    if (S.skyUniforms) {
      S.skyUniforms.topColor.value.copy(top);
      S.skyUniforms.horizonColor.value.copy(hor);
      S.skyUniforms.sunDir.value.copy(sd);
      S.skyUniforms.sunColor.value.copy(sunC);
    }
    if (S.sun) {
      S.sun.position.copy(sd).multiplyScalar(3000);
      S.sun.color.copy(sunC);
      S.sun.intensity = 0.55 + 0.65 * day;
    }
    if (S.hemi) S.hemi.intensity = 0.55 + 0.25 * day;
    if (S.scene) S.scene.fog.color.copy(hor);
    var hh = Math.floor(h), mm = Math.round((h - hh) * 60);
    var ap = hh >= 12 ? 'PM' : 'AM', h12 = hh % 12 === 0 ? 12 : hh % 12;
    var when = h < 9.5 ? 'morning' : h < 15 ? 'midday' : h < 17 ? 'afternoon' : h < 18.5 ? 'golden hour' : 'dusk';
    var el2 = $('timeRead');
    if (el2) el2.textContent = h12 + ':' + (mm < 10 ? '0' : '') + mm + ' ' + ap + ' · ' + when;
  }

  // ---------- controls ----------
  function occAt(x, z) {
    if (!S.occ) return false;
    var c = Math.floor((x - S.occX0) / S.occCell), r = Math.floor((z - S.occZ0) / S.occCell);
    if (c < 0 || c >= S.occCols || r < 0 || r >= S.occRows) return true;
    return S.occ[r * S.occCols + c] === 1;
  }
  function setMode(m) {
    S.mode = m;
    ['Orbit', 'Walk', 'Fly'].forEach(function (k) {
      $('mode' + k).classList.toggle('active', k.toLowerCase() === m);
    });
    $('stick').classList.toggle('on', m === 'walk' || m === 'fly');
    $('flyBtns').classList.toggle('on', m === 'fly');
    var cam = S.camera;
    if (m === 'walk') {
      S.walk.x = clamp(cam.position.x, S._xMin + 10, S._xMax - 10);
      S.walk.z = clamp(cam.position.z, S._zMin + 10, S._zMax - 10);
      var d = new S.three.Vector3();
      cam.getWorldDirection(d);
      S.walk.yaw = Math.atan2(-d.x, -d.z);
      S.walk.pitch = -0.05;
    } else if (m === 'fly') {
      S.fly.x = cam.position.x; S.fly.y = Math.max(cam.position.y, 20); S.fly.z = cam.position.z;
      var d2 = new S.three.Vector3();
      cam.getWorldDirection(d2);
      S.fly.yaw = Math.atan2(-d2.x, -d2.z);
      S.fly.pitch = Math.asin(clamp(d2.y, -1, 1));
    } else {
      var o = S.orbit;
      var gx = cam.position.x, gz = cam.position.z;
      o.tx = clamp(gx, S._xMin + 10, S._xMax - 10);
      o.tz = clamp(gz, S._zMin + 10, S._zMax - 10);
      o.ty = sampleHeight(o.tx, o.tz) + 8;
      var d3 = new S.three.Vector3();
      cam.getWorldDirection(d3);
      o.theta = Math.atan2(-d3.x, -d3.z);
      o.phi = 1.0;
      o.dist = clamp(cam.position.y - o.ty + 160, 140, 700);
    }
    applyCamera(0);
  }
  function applyCamera(dt) {
    var THREE = S.three, cam = S.camera;
    if (S.mode === 'orbit') {
      var o = S.orbit;
      var sp = Math.sin(o.phi), cp = Math.cos(o.phi);
      cam.position.set(
        o.tx + o.dist * sp * Math.sin(o.theta),
        o.ty + o.dist * cp,
        o.tz + o.dist * sp * Math.cos(o.theta));
      cam.lookAt(o.tx, o.ty, o.tz);
    } else if (S.mode === 'walk') {
      var w = S.walk;
      var sp2 = (S.joy.active ? 7 : 0);
      if (sp2 > 0) {
        var fx = -Math.sin(w.yaw), fz = -Math.cos(w.yaw);
        var rx = -fz, rz = fx;
        var mx = (fx * -S.joy.y + rx * S.joy.x) * sp2 * dt;
        var mz = (fz * -S.joy.y + rz * S.joy.x) * sp2 * dt;
        var nx = w.x + mx, nz = w.z + mz;
        if (!occAt(nx, w.z)) w.x = nx;
        if (!occAt(w.x, nz)) w.z = nz;
        w.x = clamp(w.x, S._xMin + 5, S._xMax - 5);
        w.z = clamp(w.z, S._zMin + 5, S._zMax - 5);
      }
      cam.position.set(w.x, sampleHeight(w.x, w.z) + 1.7, w.z);
      cam.rotation.order = 'YXZ';
      cam.rotation.set(w.pitch, w.yaw, 0);
    } else {
      var f = S.fly;
      var sp3 = (S.joy.active ? 30 : 0);
      if (sp3 > 0) {
        var fx2 = -Math.sin(f.yaw), fz2 = -Math.cos(f.yaw);
        var rx2 = -fz2, rz2 = fx2;
        f.x += (fx2 * -S.joy.y + rx2 * S.joy.x) * sp3 * dt;
        f.z += (fz2 * -S.joy.y + rz2 * S.joy.x) * sp3 * dt;
      }
      if (S.flyUp) f.y += 14 * dt;
      if (S.flyDown) f.y -= 14 * dt;
      f.x = clamp(f.x, S._xMin, S._xMax);
      f.z = clamp(f.z, S._zMin, S._zMax);
      f.y = clamp(f.y, 8, 800);
      cam.position.set(f.x, f.y, f.z);
      cam.rotation.order = 'YXZ';
      cam.rotation.set(f.pitch, f.yaw, 0);
    }
    if (S.skyDome) S.skyDome.position.copy(cam.position);
  }

  function bindPointer() {
    var el = S.renderer.domElement;
    var pointers = new Map();
    var pinchD = 0, pinchMid = null;
    var downX = 0, downY = 0, downT = 0, downCount = 0;
    el.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    el.addEventListener('pointerdown', function (e) {
      el.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, b: e.button });
      if (pointers.size === 1) { downX = e.clientX; downY = e.clientY; downT = performance.now(); downCount = 1; }
      if (pointers.size === 2) {
        var pts = Array.from(pointers.values());
        pinchD = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        pinchMid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      }
    });
    el.addEventListener('pointermove', function (e) {
      if (!pointers.has(e.pointerId)) return;
      var prev = pointers.get(e.pointerId);
      var dx = e.clientX - prev.x, dy = e.clientY - prev.y;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, b: prev.b });
      if (pointers.size === 2) {
        var pts = Array.from(pointers.values());
        var nd = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        var nmid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
        if (S.mode === 'orbit' && pinchD > 0) {
          S.orbit.dist = clamp(S.orbit.dist * pinchD / nd, 40, 1500);
          var mx = nmid.x - pinchMid.x, my = nmid.y - pinchMid.y;
          var o = S.orbit, s = o.dist / 600;
          var fx = -Math.sin(o.theta), fz = -Math.cos(o.theta);
          o.tx += (fx * my + fz * mx) * s * 0.4;
          o.tz += (fz * my - fx * mx) * s * 0.4;
          o.tx = clamp(o.tx, S._xMin, S._xMax); o.tz = clamp(o.tz, S._zMin, S._zMax);
        }
        pinchD = nd; pinchMid = nmid;
        return;
      }
      if (S.mode === 'orbit') {
        if (prev.b === 2) {
          var o2 = S.orbit, s2 = o2.dist / 600;
          var fx2 = -Math.sin(o2.theta), fz2 = -Math.cos(o2.theta);
          o2.tx += (fx2 * dy - (-fz2) * dx) * s2 * 0.4;
          o2.tz += (fz2 * dy - fx2 * dx) * s2 * 0.4;
          o2.tx = clamp(o2.tx, S._xMin, S._xMax); o2.tz = clamp(o2.tz, S._zMin, S._zMax);
        } else {
          S.orbit.theta -= dx * 0.005;
          S.orbit.phi = clamp(S.orbit.phi - dy * 0.005, 0.15, 1.5);
        }
      } else {
        var st = S.mode === 'walk' ? S.walk : S.fly;
        st.yaw -= dx * 0.004;
        st.pitch = clamp(st.pitch - dy * 0.004, -1.2, 1.2);
      }
    });
    function endPointer(e) {
      var wasSingle = pointers.size === 1;
      pointers.delete(e.pointerId);
      if (wasSingle && downCount === 1) {
        var moved = Math.hypot(e.clientX - downX, e.clientY - downY);
        var dtms = performance.now() - downT;
        if (moved < 8 && dtms < 500) handleTap(e.clientX, e.clientY);
      }
      if (pointers.size < 2) pinchD = 0;
    }
    el.addEventListener('pointerup', endPointer);
    el.addEventListener('pointercancel', endPointer);
    el.addEventListener('wheel', function (e) {
      e.preventDefault();
      if (S.mode === 'orbit') S.orbit.dist = clamp(S.orbit.dist * (1 + Math.sign(e.deltaY) * 0.09), 40, 1500);
      else if (S.mode === 'fly') S.fly.y = clamp(S.fly.y * (1 - Math.sign(e.deltaY) * 0.09), 8, 800);
    }, { passive: false });
    // joystick
    var stick = $('stick'), knob = $('stickKnob');
    stick.style.touchAction = 'none';
    var stickId = null;
    function stickMove(e) {
      var r = stick.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var dx = e.clientX - cx, dy = e.clientY - cy;
      var len = Math.hypot(dx, dy), max = 42;
      if (len > max) { dx *= max / len; dy *= max / len; }
      knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      S.joy.x = dx / max; S.joy.y = dy / max;
    }
    stick.addEventListener('pointerdown', function (e) {
      stickId = e.pointerId; stick.setPointerCapture(e.pointerId);
      S.joy.active = true; stickMove(e);
    });
    stick.addEventListener('pointermove', function (e) { if (e.pointerId === stickId) stickMove(e); });
    function stickEnd(e) {
      if (e.pointerId !== stickId) return;
      stickId = null; S.joy.active = false; S.joy.x = 0; S.joy.y = 0;
      knob.style.transform = 'translate(0px,0px)';
    }
    stick.addEventListener('pointerup', stickEnd);
    stick.addEventListener('pointercancel', stickEnd);
    function hold(btn, prop) {
      btn.addEventListener('pointerdown', function (e) { e.preventDefault(); S[prop] = true; });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
        btn.addEventListener(ev, function () { S[prop] = false; });
      });
    }
    hold($('flyUp'), 'flyUp'); hold($('flyDown'), 'flyDown');
  }

  function handleTap(cx, cy) {
    var THREE = S.three;
    var rect = S.renderer.domElement.getBoundingClientRect();
    var nx = ((cx - rect.left) / rect.width) * 2 - 1;
    var ny = -((cy - rect.top) / rect.height) * 2 + 1;
    var rc = new THREE.Raycaster();
    rc.setFromCamera({ x: nx, y: ny }, S.camera);
    var hits = rc.intersectObjects(S.markers, false);
    if (hits.length) showInfo(hits[0].object.userData.info);
    else $('infoCard').classList.remove('on');
  }

  // ---------- info card / stops / about ----------
  var currentInfo = null;
  function showInfo(info) {
    currentInfo = info;
    $('infoKind').textContent = info.kind || 'place';
    $('infoTitle').textContent = info.name;
    $('infoDesc').textContent = info.desc || '';
    $('infoSrc').textContent = info.source ? 'Source: ' + info.source : '';
    var ap = $('infoApprox');
    if (info.approx) { ap.style.display = 'block'; ap.textContent = 'Position is approximate — placed from the street address, not surveyed.'; }
    else ap.style.display = 'none';
    $('infoCard').classList.add('on');
    $('stopsList').classList.remove('on');
  }
  function flyTo(info) {
    if (!info) return;
    setMode('orbit');
    var o = S.orbit;
    o.tx = clamp(info.x, S._xMin + 10, S._xMax - 10);
    o.tz = clamp(info.z, S._zMin + 10, S._zMax - 10);
    o.ty = sampleHeight(o.tx, o.tz) + 6;
    o.dist = 200; o.phi = 0.95;
    applyCamera(0);
    $('infoCard').classList.remove('on');
  }
  function buildStopsList() {
    var wrap = $('stopsButtons');
    wrap.innerHTML = '';
    S.landmarks.stops.forEach(function (id) {
      var l = null;
      S.landmarks.landmarks.forEach(function (m) { if (m.id === id) l = m; });
      if (!l) return;
      var b = document.createElement('button');
      b.className = 'stop'; b.type = 'button';
      b.textContent = l.name;
      b.addEventListener('click', function () {
        showInfo({ name: l.name, kind: l.kind, desc: l.desc, source: l.source, approx: l.approx, x: l.x, z: l.z });
        flyTo({ x: l.x, z: l.z });
      });
      wrap.appendChild(b);
    });
  }

  // ---------- render loop ----------
  function tick(now) {
    if (!S.ready) return;
    requestAnimationFrame(tick);
    var dt = Math.min(0.05, (now - S.clock.last) / 1000 || 0.016);
    S.clock.last = now;
    applyCamera(dt);
    var t = now / 1000;
    for (var i = 0; i < S.stopMeshes.length; i++) {
      var m = S.stopMeshes[i];
      if (m.userData.bob) m.position.y = m.userData.baseY + Math.sin(t * 1.3 + i) * 0.5;
      m.rotation.y += dt * 0.6;
    }
    S.renderer.render(S.scene, S.camera);
  }

  // ---------- wire UI ----------
  function init() {
    // hero avatar on the start card (stored as base64 text; the raw file is binary)
    fetch('assets/oak-grove-slim.webp.b64').then(function (r) { return r.text(); }).then(function (b64) {
      var img = $('heroImg');
      if (img) img.src = b64ToBlobURL(b64, 'image/webp');
    }).catch(function () { /* avatar stays a framed placeholder */ });
    $('playBtn').addEventListener('click', boot);
    $('aboutLink').addEventListener('click', function () { $('about').classList.add('on'); });
    $('aboutBtn').addEventListener('click', function () { $('about').classList.add('on'); });
    $('aboutClose').addEventListener('click', function () { $('about').classList.remove('on'); });
    $('modeOrbit').addEventListener('click', function () { setMode('orbit'); });
    $('modeWalk').addEventListener('click', function () { setMode('walk'); });
    $('modeFly').addEventListener('click', function () { setMode('fly'); });
    $('floodSlider').addEventListener('input', function (e) { setFlood(parseFloat(e.target.value)); });
    $('timeSlider').addEventListener('input', function (e) { setTimeOfDay(parseFloat(e.target.value)); });
    $('stopsBtn').addEventListener('click', function () {
      buildStopsList();
      $('stopsList').classList.toggle('on');
      $('infoCard').classList.remove('on');
    });
    $('stopsClose').addEventListener('click', function () { $('stopsList').classList.remove('on'); });
    $('infoClose').addEventListener('click', function () { $('infoCard').classList.remove('on'); });
    $('flyToBtn').addEventListener('click', function () { flyTo(currentInfo); });
    setFlood(POOL_FT);
    setTimeOfDay(17.5);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
