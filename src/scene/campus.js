// 3D izometrik kampus: sahna, kamera, tanlash va animatsiyalar.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { C, at, box, cyl, mat, person, sign, sph, strip, tree } from './kit.js';
import { buildWorkshop } from './workshops.js';

const PLAZA = new THREE.Vector3(0, 0, 6);
const CAM_DIR = new THREE.Vector3(38, 52, 60).normalize();
const HOME_TARGET = new THREE.Vector3(0, 0, 3);

export class Campus {
  constructor(canvas, { professions, onSelect, onHover, reducedMotion = false, gateText = '2-SON TEXNIKUM' }) {
    this.canvas = canvas;
    this.professions = professions;
    this.gateText = gateText;
    this.onSelect = onSelect;
    this.onHover = onHover;
    this.reducedMotion = reducedMotion;
    this.coarse = matchMedia('(pointer: coarse)').matches;
    this.ticks = [];
    this.zones = new Map();
    this.active = null;
    this.running = false;
    this.timer = new THREE.Timer();

    this.#initRenderer();
    this.#initScene();
    this.#buildWorld();
    this.#initControls();
    this.#initPicking();
    this.resize();
    this.home(true);
    new ResizeObserver(() => this.resize()).observe(canvas.parentElement);

    // Telefon/planshet GPU xotirasi tugasa WebGL konteksti yo'qoladi (oq ekran, sahna qotadi).
    // Kontekst qaytganda atrof-muhit yoritilishini qayta yaratib, animatsiyani davom ettiramiz.
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.contextLost = true;
    });
    canvas.addEventListener('webglcontextrestored', () => {
      this.contextLost = false;
      this.#buildEnvironment();
      this.timer.reset?.();
    });
  }

  // ---------- Sozlash ----------
  #initRenderer() {
    const r = (this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: false }));
    r.setPixelRatio(Math.min(devicePixelRatio, this.coarse ? 1.5 : 2));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.NeutralToneMapping;
    r.toneMappingExposure = 1.05;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;
  }

  #buildEnvironment() {
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment?.dispose();
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
  }

  #initScene() {
    const s = (this.scene = new THREE.Scene());
    s.background = new THREE.Color(C.bg);
    this.#buildEnvironment();
    s.environmentIntensity = 0.45;

    s.add(new THREE.HemisphereLight('#ffffff', '#b9c8ee', 1.6));
    const sun = new THREE.DirectionalLight('#ffffff', 2.4);
    sun.position.set(-26, 48, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(this.coarse ? 1024 : 2048, this.coarse ? 1024 : 2048);
    Object.assign(sun.shadow.camera, { left: -48, right: 48, top: 42, bottom: -42, near: 1, far: 140 });
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.03;
    sun.shadow.radius = 5;
    s.add(sun);

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -200, 400);
    this.view = { zoom: 1, ox: 0, oy: 0 };
    this.goal = { target: HOME_TARGET.clone(), zoom: 1, ox: 0, oy: 0 };
  }

  #buildWorld() {
    const s = this.scene;
    // Zamin
    const under = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), mat(C.bg, { roughness: 1 }));
    under.rotation.x = -Math.PI / 2;
    under.position.y = -1.6;
    under.receiveShadow = true;
    s.add(under);
    s.add(at(box(76, 1.6, 60, C.baseSide, { r: 0.6 }), 0, -0.8, 4));
    s.add(at(box(75, 0.2, 59, C.base, { r: 0.08, cast: false }), 0, -0.1, 4));

    // Yo'l va mashinalar
    s.add(at(box(75, 0.08, 6.4, C.road, { r: 0.02, cast: false }), 0, 0.04, 29.6));
    for (let x = -34; x < 36; x += 5) s.add(at(box(2.4, 0.04, 0.22, C.lane, { r: 0, cast: false }), x, 0.1, 29.6));
    this.#traffic();

    // Shisha panjara (rasmdagi kabi)
    for (let x = -36; x < 36; x += 3) {
      if (x > -4 && x < 3) continue;
      s.add(at(box(2.8, 1.2, 0.12, '#bfe8d3', { r: 0.03, opts: { transparent: true, opacity: 0.55 } }), x + 1.5, 0.6, 25.8));
      s.add(at(box(0.12, 1.4, 0.16, C.metal, { r: 0.02 }), x, 0.7, 25.8));
    }
    // Darvoza
    const gate = at(sign(this.gateText, 6, 0.8, { bg: C.trim, fg: '#ffffff', size: 58 }), 0, 3.4, 25.8);
    s.add(gate, at(box(0.4, 3.8, 0.4, C.navy), -3.3, 1.9, 25.8), at(box(0.4, 3.8, 0.4, C.navy), 3.3, 1.9, 25.8));
    const gateBack = gate.clone();
    gateBack.rotation.y = Math.PI;
    gateBack.position.z -= 0.02;
    s.add(gateBack);

    // Maysalar
    for (const [x, z, w, d] of [[-27, -17, 16, 9], [26, 4, 10, 6], [-24, 22, 14, 3], [24, 22, 14, 3]]) {
      s.add(at(box(w, 0.1, d, C.lawn, { r: 0.05, cast: false }), x, 0.05, z));
    }

    // Yo'laklar
    s.add(strip(0, 6, 0, -4, 3, C.path), strip(0, 6, 0, 27, 3, C.path));

    this.#mainBuilding();
    this.#plaza();
    this.#sports();
    this.#parking();
    this.#trees();

    // Ustaxonalar
    // Ustaxonalar old tomoni bilan kameraga qaraydi
    const yaw = Math.atan2(CAM_DIR.x, CAM_DIR.z);
    const face = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    for (const p of this.professions) {
      const w = buildWorkshop(p);
      const [x, z] = p.zone;
      const pos = new THREE.Vector3(x, 0, z);
      w.group.position.copy(pos);
      w.group.rotation.y = yaw;
      s.add(w.group);
      this.ticks.push(w.tick);
      const front = pos.clone().addScaledVector(face, 6.4);
      // Maydonchadan ustaxona yonidan aylanib old tomonga boradigan yo'l
      const side = new THREE.Vector3(face.z, 0, -face.x);
      if (side.dot(PLAZA.clone().sub(pos)) < 0) side.negate();
      const corner = front.clone().addScaledVector(side, 5.6);
      const route = [PLAZA.clone(), corner, front].map((v) => v.setY(0.1));
      const behind = PLAZA.clone().sub(pos).dot(face) < 0;
      if (!behind) route.splice(1, 1); // to'g'ridan-to'g'ri borsa bo'ladi
      route[0].addScaledVector(route[1].clone().sub(route[0]).setY(0).normalize(), 6.4); // maydoncha chetidan
      for (let i = 1; i < route.length; i++) s.add(strip(route[i - 1].x, route[i - 1].z, route[i].x, route[i].z, 2.2, C.path));
      this.zones.set(p.id, {
        p,
        group: w.group,
        route,
        center: pos.clone().addScaledVector(face, 2.6),
        front,
        anchor: pos.clone().setY(5.6).addScaledVector(face, -1),
      });
    }

    this.#walkers();
    this.#marker();
  }

  #mainBuilding() {
    const g = new THREE.Group();
    g.add(at(box(24, 7.2, 10, C.wall, { r: 0.2 }), 0, 3.6, 0));
    g.add(at(box(24.3, 0.5, 10.3, C.trim, { r: 0.12 }), 0, 7.3, 0));
    g.add(at(box(23, 0.3, 9, C.wallShade, { r: 0.05 }), 0, 7.6, 0));
    for (let x = -8; x <= 8; x += 4) g.add(at(box(1.6, 0.5, 1.2, '#e2e8f0', { r: 0.08 }), x, 8, -1.5));
    // Derazalar: 2 qavat
    const glass = mat(C.glass, { metalness: 0.35, roughness: 0.15 });
    for (const y of [2.2, 5.1]) {
      for (let x = -10.2; x <= 10.2; x += 2.04) {
        if (Math.abs(x) < 2.5 && y < 3) continue;
        const win = at(box(1.4, 1.6, 0.14, glass, { r: 0.04 }), x, y, 5.02);
        g.add(win);
      }
    }
    // Kirish
    g.add(at(box(4.4, 3.4, 0.4, C.glassDark, { r: 0.08 }), 0, 1.7, 5));
    g.add(at(box(7, 0.3, 3, C.trim, { r: 0.1 }), 0, 3.7, 6.3));
    g.add(at(box(0.25, 3.6, 0.25, C.wall), -3.2, 1.8, 7.5), at(box(0.25, 3.6, 0.25, C.wall), 3.2, 1.8, 7.5));
    g.add(at(box(8, 0.25, 3.4, '#e2e8f0', { r: 0.05 }), 0, 0.12, 6.6));
    const title = sign(this.gateText, 9, 1.1, { bg: '#ffffff', fg: C.trim, size: 62 });
    title.position.set(0, 6.6, 5.08);
    g.add(title);
    g.position.set(0, 0, -10);
    g.traverse((o) => (o.userData.zoneId = '__main'));
    this.scene.add(g);
    this.mainAnchor = new THREE.Vector3(0, 9.5, -10);
  }

  #plaza() {
    const s = this.scene;
    s.add(at(cyl(6.2, 6.2, 0.1, C.path, 48), PLAZA.x, 0.06, PLAZA.z));
    s.add(at(cyl(2.4, 2.6, 0.6, '#e2e8f0', 32), PLAZA.x, 0.3, PLAZA.z));
    const water = at(cyl(2.15, 2.15, 0.1, '#7cc4fa', 32, { metalness: 0.2, roughness: 0.1 }), PLAZA.x, 0.58, PLAZA.z);
    s.add(water, at(cyl(0.35, 0.5, 1.6, '#e2e8f0', 16), PLAZA.x, 0.8, PLAZA.z));
    const jet = at(sph(0.45, '#bae6fd', { transparent: true, opacity: 0.8, flatShading: false }, 2), PLAZA.x, 1.9, PLAZA.z);
    s.add(jet);
    this.ticks.push((t) => jet.scale.set(1, 1 + Math.sin(t * 3) * 0.25, 1));

    // Bayroq (O'zbekiston)
    s.add(at(cyl(0.08, 0.1, 8, C.metal, 8), 4.8, 4, 2.2));
    const cv = document.createElement('canvas');
    cv.width = 192;
    cv.height = 96;
    const ctx = cv.getContext('2d');
    [['#0099b5', 0], ['#ce1126', 31], ['#ffffff', 33], ['#ce1126', 63], ['#1eb53a', 65]].forEach(([c, y]) => {
      ctx.fillStyle = c;
      ctx.fillRect(0, y, 192, 96 - y);
    });
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    const fgeo = new THREE.PlaneGeometry(3, 1.5, 12, 4);
    const flag = new THREE.Mesh(fgeo, new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: 0.9 }));
    flag.castShadow = true;
    flag.position.set(4.8 + 1.5, 7.2, 2.2);
    s.add(flag);
    const base = fgeo.attributes.position.array.slice();
    this.ticks.push((t) => {
      const a = fgeo.attributes.position.array;
      for (let i = 0; i < a.length; i += 3) {
        const u = (base[i] + 1.5) / 3;
        a[i + 2] = Math.sin(base[i] * 2.2 - t * 4) * 0.22 * u;
      }
      fgeo.attributes.position.needsUpdate = true;
      fgeo.computeVertexNormals();
    });

    for (const a of [0.6, 2.2, 3.8, 5.4]) {
      const bench = at(box(1.8, 0.45, 0.6, '#c7d2fe', { r: 0.1 }), PLAZA.x + Math.cos(a) * 5, 0.3, PLAZA.z + Math.sin(a) * 5);
      bench.rotation.y = -a + Math.PI / 2;
      s.add(bench);
    }
  }

  #sports() {
    const g = new THREE.Group();
    g.add(at(box(15, 0.12, 9, '#8fd8a8', { r: 0.05, cast: false }), 0, 0.06, 0));
    const line = mat('#ffffff');
    for (const [w, d, x, z] of [[14, 0.12, 0, -4], [14, 0.12, 0, 4], [0.12, 8, -7, 0], [0.12, 8, 7, 0], [0.12, 8, 0, 0]]) {
      g.add(at(box(w, 0.04, d, line, { r: 0, cast: false }), x, 0.14, z));
    }
    for (const x of [-7, 7]) g.add(at(box(0.3, 1.4, 2.6, '#ffffff', { r: 0.05 }), x, 0.7, 0));
    const ball = at(sph(0.3, '#ffffff', {}, 1), 0, 0.3, 0);
    g.add(ball, at(person('#ef4444'), -3, 0.1, 1), at(person('#2563eb'), 2.5, 0.1, -1.2));
    this.ticks.push((t) => {
      ball.position.set(Math.sin(t * 0.9) * 4, 0.35 + Math.abs(Math.sin(t * 2.7)) * 0.8, Math.sin(t * 1.4) * 2);
    });
    g.position.set(25, 0, -15);
    this.scene.add(g);
  }

  #parking() {
    const g = new THREE.Group();
    g.add(at(box(17, 0.08, 9, C.road, { r: 0.04, cast: false }), 0, 0.05, 0));
    const colors = ['#2563eb', '#ffffff', '#f59e0b', '#94a3b8', '#ef4444'];
    for (let i = 0; i < 5; i++) {
      const x = -6.4 + i * 3.2;
      g.add(at(box(0.1, 0.03, 3.6, '#ffffff', { r: 0, cast: false }), x - 1.6, 0.1, -2.2));
      if (i === 2) continue;
      const car = new THREE.Group();
      car.add(at(box(1.5, 0.6, 2.8, colors[i], { r: 0.25 }), 0, 0.5, 0), at(box(1.35, 0.5, 1.5, C.glassDark, { r: 0.2 }), 0, 1, 0.1));
      g.add(at(car, x, 0, -2.2));
    }
    g.position.set(-25, 0, -15);
    this.scene.add(g);
  }

  #trees() {
    const spots = [
      [-34, -20], [-30, -20], [-17, -20], [-13, -20], [13, -20], [16, -21], [34, -20],
      [-35, -8], [35, -8], [35, 0], [35, 8],
      [-31, 22], [-26, 23], [-19, 23], [-13, 23], [13, 23], [19, 23], [26, 23], [31, 22],
      [-12, -2], [12, -2], [28, 3], [-4.5, 24], [4.5, 24],
    ];
    spots.forEach(([x, z], i) => {
      const t = tree(0.9 + ((i * 37) % 10) / 22, i % 3 ? C.tree : C.treeDark);
      t.position.set(x, 0, z);
      this.scene.add(t);
    });
  }

  #traffic() {
    const bus = new THREE.Group();
    bus.add(at(box(8, 2.6, 2.4, '#ffffff', { r: 0.35 }), 0, 1.7, 0));
    bus.add(at(box(8.05, 0.5, 2.45, C.trim, { r: 0.1 }), 0, 1.1, 0));
    bus.add(at(box(7, 0.8, 2.46, C.glassDark, { r: 0.1 }), -0.2, 2.25, 0));
    for (const x of [-2.6, 2.6]) {
      for (const z of [-1.15, 1.15]) {
        const w = at(cyl(0.45, 0.45, 0.3, '#1f2937', 16), x, 0.45, z);
        w.rotation.x = Math.PI / 2;
        bus.add(w);
      }
    }
    // O'ng tomonlama harakat (O'zbekiston): -x tomonga yuruvchi avtobus kampus tarafidagi bo'lakda,
    // +x tomonga yuruvchi mashinalar narigi bo'lakda.
    bus.position.set(40, 0, 28.2);
    bus.rotation.y = Math.PI;
    this.scene.add(bus);

    const cars = ['#f59e0b', '#64748b'].map((c, i) => {
      const car = new THREE.Group();
      car.add(at(box(2.8, 0.6, 1.5, c, { r: 0.25 }), 0, 0.55, 0), at(box(1.5, 0.5, 1.35, C.glassDark, { r: 0.2 }), -0.1, 1.05, 0));
      car.userData.speed = 7 + i * 3;
      car.userData.off = i * 35;
      car.position.z = 31;
      car.rotation.y = 0;
      this.scene.add(car);
      return car;
    });

    // Avtobus darvoza oldida to'xtaydi
    this.ticks.push((t) => {
      const cycle = 22;
      const k = t % cycle;
      let x;
      if (k < 6) x = 42 - 42 * easeOut(k / 6);
      else if (k < 10) x = 0;
      else x = -42 * easeIn((k - 10) / 12);
      bus.position.x = x;
      cars.forEach((car) => {
        car.position.x = -42 + ((t * car.userData.speed + car.userData.off) % 84);
      });
    });
  }

  #walkers() {
    const shirts = ['#2563eb', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#0ea5e9', '#ffffff'];
    const routes = [];
    const ring = [];
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      ring.push(new THREE.Vector3(PLAZA.x + Math.cos(a) * 7.6, 0.1, PLAZA.z + Math.sin(a) * 7.6));
    }
    const loop = new THREE.CatmullRomCurve3(ring, true);
    for (const z of this.zones.values()) {
      const curve = new THREE.CurvePath();
      for (let i = 1; i < z.route.length; i++) curve.add(new THREE.LineCurve3(z.route[i - 1], z.route[i]));
      routes.push({ curve, ping: true });
    }
    routes.push({ curve: new THREE.LineCurve3(new THREE.Vector3(0, 0.1, 25), new THREE.Vector3(0, 0.1, -3.5)), ping: true });

    const list = [];
    for (let i = 0; i < 18; i++) {
      const r = i < 6 ? { curve: loop, ping: false } : routes[i % routes.length];
      const p = person(shirts[i % shirts.length]);
      p.scale.setScalar(0.95);
      const side = ((i * 7) % 5) / 5 - 0.4;
      this.scene.add(p);
      list.push({ p, r, t: (i * 0.137) % 1, speed: (r.ping ? 0.035 : 0.012) * (0.8 + ((i * 13) % 7) / 14), side });
    }
    const pos = new THREE.Vector3();
    const tan = new THREE.Vector3();
    this.ticks.push((t, dt) => {
      for (const w of list) {
        w.t += w.speed * dt;
        let u = w.t % 1;
        let dir = 1;
        if (w.r.ping) {
          u = w.t % 2;
          if (u > 1) {
            u = 2 - u;
            dir = -1;
          }
        }
        w.r.curve.getPointAt(u, pos);
        w.r.curve.getTangentAt(u, tan).multiplyScalar(dir);
        w.p.position.set(pos.x - tan.z * w.side, Math.abs(Math.sin(t * 9 + w.side * 10)) * 0.06, pos.z + tan.x * w.side);
        w.p.rotation.y = Math.atan2(tan.x, tan.z);
      }
    });
  }

  #marker() {
    const g = new THREE.Group();
    const pin = new THREE.Group();
    pin.add(at(sph(0.7, C.trim, { flatShading: false, roughness: 0.3 }, 3), 0, 1.2, 0));
    const tip = at(new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.1, 24), mat(C.trim, { roughness: 0.3 })), 0, 0.35, 0);
    tip.rotation.x = Math.PI;
    pin.add(tip, at(sph(0.28, '#ffffff', { flatShading: false }, 2), 0, 1.25, 0.5));
    pin.traverse((o) => (o.castShadow = true));
    const ringMat = new THREE.MeshBasicMaterial({ color: C.trim, transparent: true, opacity: 0.5, depthWrite: false });
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.6, 48), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.15;
    g.add(pin, ring);
    g.visible = false;
    this.scene.add(g);

    // Maydonchadan ustaxonagacha "oqib boruvchi" nuqtalar
    const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.22, 12, 8), new THREE.MeshBasicMaterial({ color: C.trim }), 16);
    dots.visible = false;
    this.scene.add(dots);

    this.marker = { g, pin, ring, ringMat, dots };
    const m4 = new THREE.Matrix4();
    const v = new THREE.Vector3();
    this.ticks.push((t) => {
      if (!g.visible) return;
      pin.position.y = 5 + Math.sin(t * 2.5) * 0.35;
      const k = (t * 0.8) % 1;
      ring.scale.setScalar(1 + k * 1.6);
      ringMat.opacity = 0.55 * (1 - k);
      const z = this.zones.get(this.active);
      if (!z) return;
      z.path ||= (() => {
        const c = new THREE.CurvePath();
        for (let i = 1; i < z.route.length; i++) c.add(new THREE.LineCurve3(z.route[i - 1], z.route[i]));
        return c;
      })();
      for (let i = 0; i < 16; i++) {
        const u = (i + ((t * 1.5) % 1)) / 16;
        z.path.getPointAt(Math.min(u, 1), v).setY(0.25);
        const sc = Math.sin(u * Math.PI);
        m4.makeScale(sc, sc, sc).setPosition(v);
        dots.setMatrixAt(i, m4);
      }
      dots.instanceMatrix.needsUpdate = true;
    });
  }

  #initControls() {
    const c = (this.controls = new OrbitControls(this.camera, this.canvas));
    c.enableDamping = true;
    c.dampingFactor = 0.08;
    c.enableZoom = false; // sahifa aylantirilishini to'smasligi uchun; +/- tugmalari bor
    c.enablePan = false;
    c.rotateSpeed = 0.5;
    const az = Math.atan2(CAM_DIR.x, CAM_DIR.z);
    c.minAzimuthAngle = az - 0.9;
    c.maxAzimuthAngle = az + 0.9;
    c.minPolarAngle = 0.55;
    c.maxPolarAngle = 1.15;
    if (this.coarse) {
      // Mobil: barmoq bilan sahifani bemalol aylantirish uchun
      c.enabled = false;
      this.canvas.style.touchAction = 'pan-y';
    }
    c.addEventListener('start', () => this.onInteract?.());
  }

  #initPicking() {
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const pickables = [...[...this.zones.values()].map((z) => z.group)];
    const pick = (e) => {
      const r = this.canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, this.camera);
      const hit = ray.intersectObjects(pickables, true)[0];
      return hit?.object.userData.zoneId ?? null;
    };
    let down = null;
    this.canvas.addEventListener('pointerdown', (e) => (down = { x: e.clientX, y: e.clientY }));
    this.canvas.addEventListener('pointerup', (e) => {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return;
      const id = pick(e);
      if (id) this.onSelect?.(id);
    });
    if (!this.coarse) {
      let last = null;
      this.canvas.addEventListener('pointermove', (e) => {
        if (e.buttons) return;
        const id = pick(e);
        if (id !== last) {
          last = id;
          this.canvas.style.cursor = id ? 'pointer' : '';
          this.onHover?.(id);
        }
      });
    }
  }

  // ---------- Ochiq API ----------
  resize() {
    const el = this.canvas.parentElement;
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (!w || !h) return;
    // Hajm o'zgarsa kanvas tozalanadi: darhol qayta chizamiz, aks holda u oq bo'lib qoladi
    if (this.size && this.size.w === w && this.size.h === h) return;
    this.size = { w, h };
    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    this.wide = w >= 1024;
    this.portrait = aspect < 0.8;
    // Kampus ekranga sig'ishi uchun ko'rinish o'lchami (telefonda yon tomonlar biroz kesiladi)
    const halfH = this.portrait ? 30 / aspect : Math.max(26, 44 / aspect);
    Object.assign(this.camera, { left: -halfH * aspect, right: halfH * aspect, top: halfH, bottom: -halfH });
    this.camera.updateProjectionMatrix();
    Object.assign(this.goal, this.#offsetFor(this.active));
    this.#applyOffset();
    if (!this.contextLost && this.controls) this.renderer.render(this.scene, this.camera);
  }

  // Panellar sahnani to'smasligi uchun kadrni surish (ekran ulushida)
  #offsetFor(id) {
    if (this.wide) return { ox: id ? 0.17 : -0.15, oy: 0 };
    if (this.portrait) return { ox: 0, oy: id ? 0.2 : -0.13 };
    return { ox: 0, oy: id ? 0.15 : 0 };
  }

  #applyOffset() {
    const { w, h } = this.size;
    const { ox, oy } = this.view;
    if (Math.abs(ox) + Math.abs(oy) < 0.0005) this.camera.clearViewOffset();
    else this.camera.setViewOffset(w, h, ox * w, oy * h, w, h);
  }

  home(instant = false) {
    this.active = null;
    this.marker && (this.marker.g.visible = this.marker.dots.visible = false);
    this.goal.target.copy(HOME_TARGET);
    this.goal.zoom = this.portrait ? 1.12 : 1;
    Object.assign(this.goal, this.#offsetFor(null));
    if (instant) {
      this.controls.target.copy(this.goal.target);
      this.camera.position.copy(this.goal.target).addScaledVector(CAM_DIR, 120);
      this.view.zoom = this.camera.zoom = this.goal.zoom;
      this.view.ox = this.goal.ox;
      this.view.oy = this.goal.oy;
      this.camera.updateProjectionMatrix();
      this.controls.update();
    }
  }

  focus(id) {
    const z = this.zones.get(id);
    if (!z) return;
    this.active = id;
    this.goal.target.copy(z.center);
    this.goal.zoom = this.wide ? 2.3 : this.portrait ? 2.5 : 1.9;
    Object.assign(this.goal, this.#offsetFor(id));
    this.marker.g.position.set(z.center.x, 0, z.center.z);
    this.marker.g.visible = this.marker.dots.visible = true;
    if (this.reducedMotion) this.#snap();
  }

  zoomBy(f) {
    this.goal.zoom = THREE.MathUtils.clamp(this.goal.zoom * f, 0.7, 4);
  }

  #snap() {
    const d = this.goal.target.clone().sub(this.controls.target);
    this.controls.target.add(d);
    this.camera.position.add(d);
    this.view.zoom = this.goal.zoom;
    this.view.ox = this.goal.ox;
    this.view.oy = this.goal.oy;
  }

  // Ekran koordinatasi (px) — HTML belgilarini joylash uchun
  project(world, out = { x: 0, y: 0, visible: true }) {
    const v = this._pv || (this._pv = new THREE.Vector3());
    v.copy(world).project(this.camera);
    out.x = (v.x * 0.5 + 0.5) * this.size.w;
    out.y = (-v.y * 0.5 + 0.5) * this.size.h;
    out.visible = v.z < 1 && out.x > -40 && out.x < this.size.w + 40 && out.y > -40 && out.y < this.size.h + 40;
    return out;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.timer.reset?.();
    this.renderer.setAnimationLoop(() => this.#frame());
  }

  stop() {
    this.running = false;
    this.renderer.setAnimationLoop(null);
  }

  #frame() {
    if (this.contextLost) return;
    this.timer.update();
    const dt = Math.min(this.timer.getDelta(), 0.05);
    const t = this.timer.getElapsed();
    // Kampus hayoti (mashinalar, odamlar, uchqunlar) har doim harakatlanadi.
    // Windows'da "Animatsiya effektlari" o'chirilgan bo'lsa ham (prefers-reduced-motion) sahna qotib qolmasin:
    // bunday holatda faqat kameraning uchib borishi o'rniga darhol o'tish ishlatiladi (focus → #snap).
    for (const fn of this.ticks) fn(t, dt);

    // Kamerani silliq maqsadga olib borish
    const k = 1 - Math.pow(0.0025, dt);
    const d = this.goal.target.clone().sub(this.controls.target).multiplyScalar(k);
    this.controls.target.add(d);
    this.camera.position.add(d);
    this.view.zoom += (this.goal.zoom - this.view.zoom) * k;
    this.view.ox += (this.goal.ox - this.view.ox) * k;
    this.view.oy += (this.goal.oy - this.view.oy) * k;
    this.camera.zoom = this.view.zoom;
    this.#applyOffset();
    this.camera.updateProjectionMatrix();
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
    this.onFrame?.(t);
  }
}

const easeOut = (x) => 1 - Math.pow(1 - x, 3);
const easeIn = (x) => x * x * x;
