// Har bir kasb uchun 3D ustaxona va uning jonli belgisi.
import * as THREE from 'three';
import { C, at, box, cyl, mat, person, sign, sph } from './kit.js';

// Har bir builder { group, tick(t, dt) } qaytaradi.
const props = {
  it(color) {
    const g = new THREE.Group();
    const desk = at(box(3.2, 0.12, 1.4, C.wall), 0, 0.9, 0);
    g.add(desk, at(box(0.12, 0.9, 1.2, C.metal), -1.4, 0.45, 0), at(box(0.12, 0.9, 1.2, C.metal), 1.4, 0.45, 0));
    const screens = [];
    for (const x of [-0.8, 0.8]) {
      g.add(at(box(0.12, 0.5, 0.12, C.dark), x, 1.2, -0.35));
      const scr = at(box(1.3, 0.8, 0.08, C.dark, { r: 0.04 }), x, 1.75, -0.35);
      const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(1.15, 0.65),
        new THREE.MeshBasicMaterial({ color: '#60a5fa', toneMapped: false }),
      );
      glow.position.set(0, 0, 0.05);
      scr.add(glow);
      screens.push(glow);
      g.add(scr);
    }
    g.add(at(person(color), 0, 0, 1.1));
    // Server shkafi
    const rack = at(box(1, 2.6, 0.9, C.navy), 2.6, 1.3, -0.3);
    const leds = [];
    for (let i = 0; i < 6; i++) {
      const led = at(box(0.6, 0.06, 0.02, '#22c55e', { r: 0, opts: { emissive: '#22c55e', emissiveIntensity: 1 } }), 0, -0.9 + i * 0.35, 0.46);
      led.material = led.material.clone();
      rack.add(led);
      leds.push(led);
    }
    g.add(rack);
    return {
      group: g,
      tick(t) {
        screens.forEach((s, i) => s.material.color.setHSL(0.6 + 0.04 * Math.sin(t * 2 + i), 0.9, 0.62));
        leds.forEach((l, i) => (l.material.emissiveIntensity = Math.sin(t * 6 + i * 1.7) > 0 ? 1.4 : 0.2));
      },
    };
  },

  electric(color) {
    const g = new THREE.Group();
    const poles = [-2.2, 2.2].map((x) => {
      const p = new THREE.Group();
      p.add(at(cyl(0.12, 0.16, 4.2, C.trunk, 10), 0, 2.1, 0));
      p.add(at(box(1.6, 0.14, 0.14, C.dark), 0, 3.9, 0));
      for (const ix of [-0.6, 0, 0.6]) p.add(at(cyl(0.06, 0.06, 0.2, '#e2e8f0', 8), ix, 4.05, 0));
      p.position.x = x;
      g.add(p);
      return p;
    });
    for (const ix of [-0.6, 0, 0.6]) {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-2.2 + ix, 4.12, 0),
        new THREE.Vector3(ix, 3.5, 0),
        new THREE.Vector3(2.2 + ix, 4.12, 0),
      );
      g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.025, 5), mat(C.dark)));
    }
    const transformer = at(box(1.4, 1.4, 1, '#cbd5e1'), 0, 0.7, -0.6);
    transformer.add(at(sign('⚡', 0.7, 0.7, { bg: color, fg: '#ffffff', w: 128, h: 128, size: 90 }), 0, 0.1, 0.51));
    g.add(transformer);
    const bulbMat = new THREE.MeshStandardMaterial({ color: '#fde68a', emissive: '#fbbf24', emissiveIntensity: 2 });
    const bulb = at(new THREE.Mesh(new THREE.IcosahedronGeometry(0.35, 2), bulbMat), 0, 2.4, 0.8);
    g.add(at(cyl(0.04, 0.04, 0.9, C.dark, 6), 0, 2.95, 0.8), bulb);
    g.add(at(person(color), 1.4, 0, 1));
    void poles;
    return {
      group: g,
      tick(t) {
        bulbMat.emissiveIntensity = 1.4 + Math.sin(t * 3) * 0.8 + (Math.random() > 0.97 ? -1 : 0);
      },
    };
  },

  auto(color) {
    const g = new THREE.Group();
    // Ko'targich (lift)
    g.add(at(box(0.3, 2.6, 0.3, C.dark), -1.9, 1.3, 0), at(box(0.3, 2.6, 0.3, C.dark), 1.9, 1.3, 0));
    const lift = new THREE.Group();
    lift.add(at(box(3.6, 0.15, 1.8, '#facc15'), 0, 0, 0));
    const car = new THREE.Group();
    car.add(at(box(3, 0.6, 1.5, color, { r: 0.25 }), 0, 0.55, 0));
    const cabin = at(box(1.7, 0.55, 1.35, '#ffffff', { r: 0.22 }), -0.15, 1.1, 0);
    car.add(cabin, at(box(1.5, 0.4, 1.38, C.glassDark, { r: 0.15 }), -0.15, 1.12, 0));
    for (const [x, z] of [[-1, 0.72], [1, 0.72], [-1, -0.72], [1, -0.72]]) {
      const w = at(cyl(0.32, 0.32, 0.24, '#1f2937', 16), x, 0.3, z);
      w.rotation.x = Math.PI / 2;
      car.add(w);
    }
    lift.add(at(car, 0, 0.08, 0));
    g.add(lift);
    g.add(at(box(0.9, 1, 0.6, '#ef4444'), 2.8, 0.5, -0.4)); // asboblar qutisi
    const mech = at(person('#1d4ed8'), 2.3, 0, 1);
    g.add(mech);
    return {
      group: g,
      tick(t) {
        const s = (Math.sin(t * 0.6) + 1) / 2;
        lift.position.y = 0.1 + s * 1.3;
      },
    };
  },

  welding(color) {
    const g = new THREE.Group();
    g.add(at(box(2.6, 0.15, 1.3, C.dark), 0, 1, 0));
    g.add(at(box(0.15, 1, 1.1, C.metal), -1.1, 0.5, 0), at(box(0.15, 1, 1.1, C.metal), 1.1, 0.5, 0));
    // Metall konstruksiya
    g.add(at(box(1.8, 0.2, 0.2, '#94a3b8'), 0, 1.2, 0), at(box(0.2, 1.2, 0.2, '#94a3b8'), 0.4, 1.7, 0));
    const welder = at(person(color), 0.4, 0, 1.2);
    welder.add(at(box(0.42, 0.3, 0.1, '#111827'), 0, 1.24, -0.18)); // niqob
    welder.rotation.y = Math.PI;
    g.add(welder);
    g.add(at(cyl(0.3, 0.3, 1.4, '#16a34a', 14), -2.2, 0.7, -0.3), at(cyl(0.3, 0.3, 1.4, '#2563eb', 14), -2.2, 0.7, 0.4));

    const N = 60;
    const pos = new Float32Array(N * 3);
    const vel = Array.from({ length: N }, () => new THREE.Vector3());
    const life = new Float32Array(N);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const sparks = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: '#ffb347', size: 4, sizeAttenuation: false, toneMapped: false }),
    );
    const origin = new THREE.Vector3(0.4, 1.35, 0.15);
    g.add(sparks);
    const flash = at(sph(0.14, '#ffffff', { emissive: '#bfdbfe', emissiveIntensity: 3 }), origin.x, origin.y, origin.z);
    flash.material = flash.material.clone();
    g.add(flash);
    return {
      group: g,
      tick(t, dt) {
        const on = Math.sin(t * 1.3) > -0.3;
        flash.visible = on && Math.random() > 0.15;
        for (let i = 0; i < N; i++) {
          life[i] -= dt;
          if (life[i] <= 0 && on) {
            life[i] = 0.3 + Math.random() * 0.5;
            pos.set([origin.x, origin.y, origin.z], i * 3);
            vel[i].set((Math.random() - 0.5) * 3, Math.random() * 2.5, (Math.random() - 0.2) * 3);
          } else if (life[i] > 0) {
            vel[i].y -= 9 * dt;
            pos[i * 3] += vel[i].x * dt;
            pos[i * 3 + 1] = Math.max(0.05, pos[i * 3 + 1] + vel[i].y * dt);
            pos[i * 3 + 2] += vel[i].z * dt;
          } else {
            pos[i * 3 + 1] = -10;
          }
        }
        geo.attributes.position.needsUpdate = true;
      },
    };
  },

  cooking(color) {
    const g = new THREE.Group();
    g.add(at(box(2.8, 1, 1.2, '#e2e8f0'), 0, 0.5, 0));
    g.add(at(box(2.8, 0.08, 1.2, C.dark, { r: 0.02 }), 0, 1.04, 0));
    const pot = at(cyl(0.45, 0.4, 0.6, '#cbd5e1', 18, { metalness: 0.6, roughness: 0.3 }), -0.6, 1.38, 0);
    const pan = at(cyl(0.45, 0.4, 0.15, C.dark, 18), 0.7, 1.15, 0);
    g.add(pot, pan);
    const chef = at(person('#ffffff'), 0, 0, -1.1);
    chef.add(at(cyl(0.18, 0.15, 0.35, '#ffffff', 12), 0, 1.5, 0)); // oshpaz qalpog'i
    g.add(chef);
    // Stol va soyabon
    const table = new THREE.Group();
    table.add(at(cyl(0.7, 0.7, 0.08, '#ffffff', 20), 0, 0.85, 0), at(cyl(0.06, 0.06, 0.85, C.metal, 8), 0, 0.42, 0));
    table.add(at(cyl(0.04, 0.04, 2.2, C.metal, 6), 0, 1.6, 0), at(cyl(0.05, 1.3, 0.4, color, 8), 0, 2.6, 0));
    g.add(at(table, 2.8, 0, 1.4));
    const puffs = Array.from({ length: 6 }, (_, i) => {
      const p = sph(0.22, '#ffffff', { transparent: true, opacity: 0.8, flatShading: false }, 1);
      p.material = p.material.clone();
      p.castShadow = false;
      p.userData.o = i / 6;
      g.add(p);
      return p;
    });
    return {
      group: g,
      tick(t) {
        puffs.forEach((p) => {
          const k = (t * 0.45 + p.userData.o) % 1;
          p.position.set(-0.6 + Math.sin(k * 6 + p.userData.o * 9) * 0.2, 1.7 + k * 2.2, Math.cos(k * 5) * 0.15);
          p.scale.setScalar(0.6 + k * 1.4);
          p.material.opacity = 0.75 * (1 - k);
        });
        pan.rotation.z = Math.sin(t * 4) * 0.05;
      },
    };
  },

  tailoring(color) {
    const g = new THREE.Group();
    // Maneken
    const mannequin = new THREE.Group();
    mannequin.add(at(cyl(0.35, 0.35, 0.06, C.dark, 16), 0, 0.03, 0), at(cyl(0.04, 0.04, 1, C.dark, 6), 0, 0.5, 0));
    mannequin.add(at(cyl(0.25, 0.7, 1.3, color, 18), 0, 1.5, 0), at(sph(0.2, '#f1f5f9', { flatShading: false }, 2), 0, 2.35, 0));
    g.add(at(mannequin, -1.6, 0, 0.6));
    // Tikuv stoli
    g.add(at(box(2, 0.1, 1, '#ffffff'), 0.8, 0.9, -0.2));
    const machine = at(box(0.9, 0.5, 0.35, '#f8fafc'), 0.8, 1.2, -0.3);
    machine.add(at(box(0.18, 0.4, 0.3, '#f8fafc'), -0.36, 0.25, 0));
    g.add(machine, at(box(0.12, 0.85, 0.9, C.metal), 0, 0.45, -0.2), at(box(0.12, 0.85, 0.9, C.metal), 1.6, 0.45, -0.2));
    g.add(at(person('#a855f7'), 0.8, 0, 0.6));
    const rolls = [color, '#38bdf8', '#facc15', '#ffffff'].map((c, i) => {
      const r = at(cyl(0.22, 0.22, 1.6, c, 14), 2.6, 0.22 + (i % 2) * 0.44, -0.6 + Math.floor(i / 2) * 0.5);
      r.rotation.x = Math.PI / 2;
      g.add(r);
      return r;
    });
    void rolls;
    return {
      group: g,
      tick(t) {
        mannequin.rotation.y = t * 0.6;
        machine.position.y = 1.2 + Math.abs(Math.sin(t * 18)) * 0.015;
      },
    };
  },
};

// Turar joy servisi: elektr ustunlari va transformator (elektr montaj qismi)
props.housing = props.electric;

// Metallarga ishlov: tokarlik dastgohi (aylanuvchi patron va detal), parmalash dastgohi
props.metal = (color) => {
  const g = new THREE.Group();
  // Tokarlik dastgohi
  g.add(at(box(3, 0.9, 0.9, C.navy), 0, 0.45, 0));
  g.add(at(box(3.2, 0.12, 1, C.dark), 0, 0.96, 0));
  g.add(at(box(0.8, 0.8, 0.9, color), -1.2, 1.4, 0)); // shpindel bloki
  g.add(at(box(0.5, 0.5, 0.6, color), 1.3, 1.25, 0)); // ketingi babka
  const chuck = at(cyl(0.32, 0.32, 0.25, C.metal, 16, { metalness: 0.7, roughness: 0.3 }), -0.7, 1.4, 0);
  chuck.rotation.z = Math.PI / 2;
  const part = at(cyl(0.12, 0.12, 1.6, '#cbd5e1', 12, { metalness: 0.8, roughness: 0.25 }), 0.25, 1.4, 0);
  part.rotation.z = Math.PI / 2;
  g.add(chuck, part);
  const carriage = at(box(0.45, 0.3, 0.7, '#e2e8f0'), 0, 1.15, 0.25);
  g.add(carriage);
  g.add(at(person(color), 0, 0, 1.1));
  // Parmalash dastgohi
  const drill = new THREE.Group();
  drill.add(at(box(0.8, 0.1, 0.8, C.dark), 0, 0.05, 0), at(cyl(0.08, 0.08, 2.2, C.metal, 8), 0, 1.1, -0.25));
  drill.add(at(box(0.5, 0.5, 0.7, color), 0, 2, -0.05), at(box(0.5, 0.08, 0.5, C.dark), 0, 0.9, 0));
  const bit = at(cyl(0.03, 0.03, 0.4, '#e2e8f0', 6), 0, 1.55, 0.05);
  drill.add(bit);
  g.add(at(drill, 2.8, 0, -0.3));
  // Qirindilar (uchqunsiz, kumushrang)
  const chips = Array.from({ length: 10 }, (_, i) => {
    const c = at(box(0.06, 0.06, 0.06, '#e5e7eb', { r: 0, cast: false }), 0, -10, 0);
    c.userData.o = i / 10;
    g.add(c);
    return c;
  });
  return {
    group: g,
    tick(t) {
      chuck.rotation.x = t * 12;
      part.rotation.x = t * 12;
      carriage.position.x = Math.sin(t * 0.5) * 0.6;
      bit.rotation.y = t * 20;
      bit.position.y = 1.5 + Math.abs(Math.sin(t * 0.8)) * -0.15;
      chips.forEach((c) => {
        const k = (t * 0.9 + c.userData.o) % 1;
        c.position.set(carriage.position.x + k * 0.4, 1.45 - k * k * 0.5, 0.15 + k * 0.5);
        c.rotation.set(k * 9, k * 7, 0);
      });
    },
  };
};

// Pavilyon + belgi. Old tomoni (+z) maydonchaga qaraydi.
export function buildWorkshop(p) {
  const g = new THREE.Group();
  const hall = new THREE.Group();
  hall.add(at(box(8, 3.8, 5.6, C.wall), 0, 1.9, -1.2));
  hall.add(at(box(8.2, 0.35, 5.8, p.color, { r: 0.1 }), 0, 3.95, -1.2));
  hall.add(at(box(7.6, 0.25, 5.2, C.wallShade, { r: 0.05 }), 0, 4.2, -1.2));
  // Darvoza va derazalar
  hall.add(at(box(3, 2.6, 0.12, C.glassDark, { r: 0.04 }), -1.6, 1.3, 1.6));
  for (let i = 0; i < 6; i++) hall.add(at(box(2.9, 0.06, 0.06, '#5b7bc0', { r: 0 }), -1.6, 0.3 + i * 0.4, 1.68));
  hall.add(at(box(2.2, 1.2, 0.1, C.glass, { r: 0.04, opts: { metalness: 0.3, roughness: 0.2 } }), 2.1, 2.1, 1.6));
  const plate = sign((p.label ?? p.title.split(' ')[0]).toUpperCase(), 3.6, 0.6, { bg: '#ffffff', fg: p.color, size: 60 });
  plate.position.set(0, 3.3, 1.62);
  hall.add(plate);
  // Ventilyatorlar tomda (rasmdagi kabi)
  for (const x of [-2.5, 0, 2.5]) hall.add(at(box(1, 0.35, 0.8, '#e2e8f0', { r: 0.08 }), x, 4.45, -2));
  g.add(hall);

  // Old maydoncha
  g.add(at(box(9, 0.08, 4.4, '#f6f8fe', { r: 0.03, cast: false }), 0, 0.04, 3.6));
  const prop = props[p.prop](p.color);
  prop.group.position.set(0, 0.08, 3.6);
  g.add(prop.group);

  g.traverse((o) => (o.userData.zoneId = p.id));
  return { group: g, tick: prop.tick };
}
