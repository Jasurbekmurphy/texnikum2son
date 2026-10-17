import * as raw from './data.js';
import { applyStatic, lang, LANGS, localize, setLang, t } from './i18n.js';
import { icon } from './icons.js';
import { media, mediaFor, openLightbox, renderGallery } from './gallery.js';

// Barcha kontent tanlangan tilga aylantiriladi (src/i18n.js)
const { dual, faqs, features, metrics, professions, site, stats, steps } = localize(raw);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const byId = new Map(professions.map((p) => [p.id, p]));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const label = (p) => p.label ?? p.title.split(' ')[0];
const fmt = (n) => n.toLocaleString('ru-RU').replace(/ /g, ' ');

// ---------------- Statik bo'limlar ----------------
const nav = [
  ['#kasblar', t('navPrograms')],
  ['#afzalliklar', t('navWhy')],
  ...(media.length ? [['#galereya', t('navGallery')]] : []),
  ['#dual', t('navDual')],
  ['#qabul', t('navAdmission')],
  ['#savollar', t('navFaq')],
  ['#aloqa', t('navContact')],
];

// EN | UZ almashtirgich
const langSwitch = () =>
  `<div class="lang-switch" role="group" aria-label="${t('language')}">${LANGS.map(
    (l) => `<button type="button" data-lang="${l}" aria-pressed="${l === lang}">${l.toUpperCase()}</button>`,
  ).join('')}</div>`;

function renderStatic() {
  applyStatic();
  $$('[data-slot=lang]').forEach((el) => (el.innerHTML = langSwitch()));
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]');
    if (b) setLang(b.dataset.lang);
  });
  const brand = `<span class="grid size-8 place-items-center rounded-lg bg-brand-600 text-white">${icon('cap', 'size-[18px]')}</span><span class="truncate">${site.shortName}</span>`;
  $('[data-slot=brand]').innerHTML = brand;
  $$('[data-slot=apply]').forEach((a) => Object.assign(a, { href: site.admission.applyUrl, target: '_blank', rel: 'noopener' }));

  const links = nav.map(([h, text]) => `<a href="${h}" class="rounded-lg px-3 py-2 transition hover:bg-brand-50 hover:text-brand-600">${text}</a>`).join('');
  $('#navLinks').innerHTML = links;
  $('#mobileMenu').innerHTML =
    links + `<a class="btn-primary mt-1" href="${site.admission.applyUrl}" target="_blank" rel="noopener">${t('apply')}</a>`;
  const menuBtn = $('#menuBtn');
  menuBtn.innerHTML = icon('menu');
  menuBtn.addEventListener('click', () => {
    const open = $('#mobileMenu').classList.toggle('hidden') === false;
    $('#mobileMenu').classList.toggle('flex', open);
    menuBtn.setAttribute('aria-expanded', open);
  });
  $$('#mobileMenu a').forEach((a) => a.addEventListener('click', () => menuBtn.click()));

  const open = site.admission.open;
  const badge = $('#admissionBadge');
  badge.innerHTML = open
    ? `<span class="size-1.5 animate-pulse rounded-full bg-emerald-500"></span>${t('admissionOpen')}`
    : `<span class="size-1.5 rounded-full bg-slate-400"></span>${t('admissionClosed')}`;
  if (!open) {
    badge.classList.replace('bg-emerald-50', 'bg-slate-100');
    badge.classList.replace('text-emerald-700', 'text-slate-600');
  }
  $('#introEyebrow').textContent = open ? t('openUntil', site.admission.deadline) : site.slogan;

  $('#heroStats').innerHTML = stats
    .slice(0, 3)
    .map(
      (s) => `<div class="rounded-xl bg-white p-3 ring-1 ring-slate-100">
        <p class="text-[11px] font-medium text-slate-500">${s.label}</p>
        <p class="mt-0.5 text-lg font-extrabold">${fmt(s.value)}${s.suffix}</p>
      </div>`,
    )
    .join('');

  $('#stats').innerHTML = stats
    .map(
      (s, i) => `<div class="reveal bg-white px-5 py-8 text-center" style="--d:${i * 80}ms">
        <p class="text-4xl font-extrabold tracking-tight text-brand-600 sm:text-5xl"><span data-count="${s.value}">0</span>${s.suffix}</p>
        <p class="mt-1 font-semibold">${s.label}</p>
        <p class="text-sm text-slate-500">${s.note}</p>
      </div>`,
    )
    .join('');

  $('#profGrid').innerHTML = professions
    .map(
      (p, i) => `<article class="reveal group relative flex flex-col overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-600/10" style="--d:${(i % 3) * 90}ms">
        <div class="absolute -top-16 -right-16 size-40 rounded-full opacity-10 transition group-hover:scale-125" style="background:${p.color}"></div>
        <div class="grid size-12 place-items-center rounded-2xl text-white shadow-lg" style="background:${p.color};box-shadow:0 10px 24px -10px ${p.color}">${icon(p.prop, 'size-6')}</div>
        <h3 class="mt-5 text-xl font-bold">${p.title}</h3>
        <p class="mt-2 flex-1 text-[15px] leading-relaxed text-slate-600">${p.desc}</p>
        <div class="mt-5 flex flex-wrap gap-1.5 text-xs font-semibold">
          ${[p.duration, p.form, p.seats && t('seatsTag', p.seats)]
            .filter(Boolean)
            .map((t) => `<span class="rounded-full bg-slate-100 px-2.5 py-1">${t}</span>`)
            .join('')}
        </div>
        <a href="#" data-show="${p.id}" class="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold" style="color:${p.color}">
          ${t('viewIn3d')} ${icon('arrow', 'size-4 transition group-hover:translate-x-1')}
        </a>
      </article>`,
    )
    .join('');

  $('#features').innerHTML = features
    .map(
      (f, i) => `<div class="reveal rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 transition hover:bg-white/10" style="--d:${(i % 3) * 90}ms">
        <div class="grid size-11 place-items-center rounded-xl bg-brand-500/20 text-sky-300">${icon(f.icon)}</div>
        <h3 class="mt-4 text-lg font-bold">${f.title}</h3>
        <p class="mt-1.5 text-slate-300">${f.text}</p>
      </div>`,
    )
    .join('');

  $('#dualSteps').innerHTML = dual
    .map(
      (d, i) => `<li class="reveal rounded-2xl bg-white p-5 ring-1 ring-slate-100" style="--d:${i * 80}ms">
        <span class="grid size-9 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-600">${i + 1}</span>
        <h3 class="mt-3 font-bold">${d.title}</h3>
        <p class="mt-1 text-sm text-slate-600">${d.text}</p>
      </li>`,
    )
    .join('');

  $('#metrics').innerHTML = metrics
    .map(
      (m) => `<div>
        <div class="flex justify-between gap-4 text-sm font-semibold"><span>${m.label}</span><span class="tabular-nums text-brand-600">${m.value}%</span></div>
        <div class="mt-2 h-2 overflow-hidden rounded-full bg-brand-50"><div class="meter h-full rounded-full bg-brand-600" style="--w:${m.value}%"></div></div>
      </div>`,
    )
    .join('');

  $('#steps').innerHTML = steps
    .map(
      (s, i) => `<li class="relative flex gap-4 lg:flex-col lg:items-center lg:text-center">
        ${i < steps.length - 1 ? '<span class="absolute top-10 bottom-[-24px] left-5 w-0.5 bg-brand-100 lg:top-5 lg:right-[-50%] lg:bottom-auto lg:left-1/2 lg:h-0.5 lg:w-auto"></span>' : ''}
        <span class="relative grid size-10 shrink-0 place-items-center rounded-full bg-brand-600 font-bold text-white ring-4 ring-brand-100">${i + 1}</span>
        <div>
          <p class="text-xs font-semibold text-brand-600">${s.time}</p>
          <h3 class="font-bold">${s.title}</h3>
          <p class="mt-1 text-sm text-slate-600">${s.text}</p>
        </div>
      </li>`,
    )
    .join('');

  $('#faq').innerHTML = faqs
    .map(
      (f, i) => `<details class="reveal group rounded-2xl bg-white p-5 ring-1 ring-slate-100 open:ring-brand-500/40" style="--d:${i * 60}ms">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">${f.q}
          <span class="chev text-slate-400 transition">${icon('down')}</span></summary>
        <p class="mt-3 text-slate-600">${f.a}</p>
      </details>`,
    )
    .join('');

  const contact = [
    ['phone', t('phone'), site.phone, `tel:${site.phone.replace(/\s/g, '')}`],
    ['mail', t('email'), site.email, `mailto:${site.email}`],
    ['pin', t('address'), site.address],
    ['clock', t('hours'), site.workHours],
  ];
  $('#contacts').innerHTML = contact
    .map(
      ([ic, label, val, href]) => `<li class="flex items-center gap-3">
        <span class="grid size-11 place-items-center rounded-xl bg-white/15">${icon(ic)}</span>
        <div><p class="text-sm text-brand-100">${label}</p>
        ${href ? `<a class="font-semibold hover:underline" href="${href}">${val}</a>` : `<p class="font-semibold">${val}</p>`}</div>
      </li>`,
    )
    .join('');
  $('#socials').innerHTML = [
    ['send', 'Telegram', site.telegram],
    ['instagram', 'Instagram', site.instagram],
  ]
    .map(([ic, name, h]) => `<a class="btn bg-white/15 text-white hover:bg-white/25" href="${h}" target="_blank" rel="noopener">${icon(ic, 'size-4')}${name}</a>`)
    .join('');
  $('#map').innerHTML = site.mapEmbed
    ? `<iframe class="size-full min-h-[280px]" src="${site.mapEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${t('map')}"></iframe>`
    : `<div class="grid size-full min-h-[280px] place-items-center text-center text-brand-100"><div>${icon('pin', 'mx-auto size-10')}<p class="mt-2 px-6">${site.address}</p></div></div>`;

  $('#footer').innerHTML = `<p>© ${new Date().getFullYear()} ${site.fullName}</p><p>${site.domain}</p>`;
}

// ---------------- Interaktiv qism ----------------
let campus = null;
let activeId = null;
let tourTimer = null;

function renderDock() {
  $('#dockList').innerHTML = professions
    .map(
      (p) => `<button role="tab" data-id="${p.id}" aria-selected="false"
        class="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white aria-selected:bg-white aria-selected:text-ink aria-selected:shadow-md">
        <span class="grid size-7 place-items-center rounded-lg text-white" style="background:${p.color}">${icon(p.prop, 'size-4')}</span>
        <span class="whitespace-nowrap">${label(p)}</span>
      </button>`,
    )
    .join('');
  $('#dockList').addEventListener('click', (e) => {
    const b = e.target.closest('[data-id]');
    if (b) userSelect(b.dataset.id);
  });

  $('#mapCtrls').innerHTML = [
    ['plus', 'zoomIn', t('zoomIn')],
    ['minus', 'zoomOut', t('zoomOut')],
    ['home', 'home', t('home')],
  ]
    .map(([ic, act, label]) => `<button class="ctrl" data-act="${act}" aria-label="${label}" title="${label}">${icon(ic, 'size-[18px]')}</button>`)
    .join('');
  $('#mapCtrls').addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (!act || !campus) return;
    if (act === 'zoomIn') campus.zoomBy(1.3);
    if (act === 'zoomOut') campus.zoomBy(1 / 1.3);
    if (act === 'home') userSelect(null);
  });
}

function renderPins() {
  $('#pins').innerHTML = professions
    .map(
      (p) => `<button class="pin pointer-events-auto opacity-0 transition-opacity duration-300" data-id="${p.id}" style="color:${p.color}" aria-label="${p.title}">
        <span class="pin-body flex items-center gap-1.5 rounded-full bg-white p-1 text-xs font-bold text-ink shadow-lg ring-1 ring-black/5 transition hover:scale-110 sm:pr-3">
          <span class="grid size-6 place-items-center rounded-full text-white" style="background:${p.color}">${icon(p.prop, 'size-3.5')}</span>
          <span class="hidden whitespace-nowrap sm:inline">${label(p)}</span>
        </span>
        <span class="stem"></span>
      </button>`,
    )
    .join('');
  $('#pins').addEventListener('click', (e) => {
    const b = e.target.closest('[data-id]');
    if (b) userSelect(b.dataset.id);
  });
}

// Shu yo'nalish papkasidagi rasmlar (src/gallery/<id>/) panelda kichik lenta bo'lib chiqadi
function photoStrip(p) {
  const items = mediaFor(p.id);
  if (!items.length) return '';
  return `<p class="mt-4 text-xs font-bold tracking-wider text-slate-400 uppercase">${t('workshopPhotos')}</p>
    <div class="no-scrollbar -mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1">${items
      .slice(0, 8)
      .map(
        (m, i) => `<button type="button" class="strip-thumb" style="--tw-ring-color:${p.color}" data-photo="${i}" aria-label="${m.caption}">
          ${m.type === 'video' ? `<video class="size-full object-cover" src="${m.src}#t=0.1" muted playsinline preload="metadata"></video><span class="absolute inset-0 grid place-items-center text-white">${icon('play', 'size-6 drop-shadow')}</span>` : `<img class="size-full object-cover" src="${m.thumb}" alt="${m.caption}" loading="lazy" />`}
        </button>`,
      )
      .join('')}</div>`;
}

function renderDetail(p) {
  const i = professions.indexOf(p);
  const row = (k, v) => `<div class="flex justify-between gap-3 border-b border-slate-100 py-2 text-sm last:border-0"><span class="text-slate-500">${k}</span><span class="font-semibold">${v}</span></div>`;
  $('#detail').innerHTML = `
    <div class="flex items-start gap-3">
      <div class="grid size-12 shrink-0 place-items-center rounded-2xl text-white shadow-lg" style="background:${p.color}">${icon(p.prop, 'size-6')}</div>
      <div class="min-w-0 flex-1">
        <p class="text-[11px] font-bold tracking-widest uppercase" style="color:${p.color}">${t('program')} · ${String(i + 1).padStart(2, '0')}/${String(professions.length).padStart(2, '0')}</p>
        <h2 class="text-lg leading-tight font-extrabold">${p.title}</h2>
        <p class="text-sm text-slate-500">${p.short}</p>
      </div>
      <div class="flex gap-1">
        <button class="ctrl size-8 ring-1 ring-slate-200 sm:size-9" data-nav="-1" aria-label="${t('prev')}">${icon('left', 'size-4')}</button>
        <button class="ctrl size-8 ring-1 ring-slate-200 sm:size-9" data-nav="1" aria-label="${t('next')}">${icon('right', 'size-4')}</button>
        <button class="ctrl size-8 ring-1 ring-slate-200 sm:size-9" data-nav="0" aria-label="${t('close')}">${icon('x', 'size-4')}</button>
      </div>
    </div>
    <div class="mt-4 flex items-center gap-2 text-xs font-semibold">
      <span class="rounded-md px-2 py-1 ${site.admission.open ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}">${site.admission.open ? t('admissionOpen') : t('admissionClosed')}</span>
      <span class="text-slate-500">${[p.duration, p.form].filter(Boolean).join(' · ')}</span>
    </div>
    <p class="mt-3 text-[15px] leading-relaxed text-slate-600">${p.desc}</p>
    <div class="mt-3">${p.duration ? row(t('duration'), p.duration) : ''}${row(t('studyMode'), p.form)}${p.seats ? row(t('places'), t('placesValue', p.seats)) : ''}</div>
    ${photoStrip(p)}
    <p class="mt-4 text-xs font-bold tracking-wider text-slate-400 uppercase">${t('youLearn')}</p>
    <div class="mt-2 flex flex-wrap gap-1.5">${p.skills.map((s) => `<span class="rounded-lg px-2.5 py-1 text-xs font-semibold" style="background:${p.color}14;color:${p.color}">${s}</span>`).join('')}</div>
    <p class="mt-4 text-xs font-bold tracking-wider text-slate-400 uppercase">${t('careers')}</p>
    <ul class="mt-2 space-y-1.5 text-sm">${p.careers.map((c) => `<li class="flex items-center gap-2"><span class="text-emerald-500">${icon('check', 'size-4')}</span>${c}</li>`).join('')}</ul>
    <a class="btn-primary mt-5 w-full" href="${site.admission.applyUrl}" target="_blank" rel="noopener">${t('applyProgram')} ${icon('arrow', 'size-4')}</a>`;
}

function select(id) {
  activeId = id;
  const p = id ? byId.get(id) : null;
  const detail = $('#detail');
  const lg = matchMedia('(min-width: 1024px)').matches;
  if (p) {
    renderDetail(p);
    detail.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-6', 'lg:translate-x-6');
    detail.scrollTop = 0;
  } else {
    detail.classList.add('opacity-0', 'pointer-events-none', 'translate-y-6', 'lg:translate-x-6');
  }
  $('#intro').classList.toggle('opacity-0', !!p);
  $('#intro').classList.toggle('pointer-events-none', !!p);
  $('#intro').classList.toggle('-translate-y-4', !!p);
  // Mobil: panel ochiq bo'lsa kasblar paneli yashiriladi
  $('#dock').classList.toggle('opacity-0', !!p && !lg);
  $('#dock').classList.toggle('pointer-events-none', !!p && !lg);
  $$('#dockList [data-id]').forEach((b) => b.setAttribute('aria-selected', b.dataset.id === id));
  $(`#dockList [data-id="${id}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  $('#hint')?.remove();
  if (campus) id ? campus.focus(id) : campus.home();
  // Havolani yangilash faqat sayt o'zi ochilganda (iframe/ko'rish oynasi ichida emas)
  if (window.self === window.top) {
    try {
      history.replaceState(null, '', id ? `#kasb-${id}` : location.pathname + location.search);
    } catch {
      /* ba'zi brauzerlar ruxsat bermaydi */
    }
  }
}

function userSelect(id) {
  stopTour();
  select(id);
}

function step(dir) {
  const i = professions.findIndex((p) => p.id === activeId);
  userSelect(professions[(i + dir + professions.length) % professions.length].id);
}

function setTourBtn(playing) {
  $('#tourBtn').innerHTML = playing ? `${icon('pause', 'size-4')} ${t('tourStop')}` : `${icon('play', 'size-4')} ${t('tourPlay')}`;
}

function startTour() {
  let i = Math.max(0, professions.findIndex((p) => p.id === activeId));
  select(professions[i].id);
  tourTimer = setInterval(() => {
    i = (i + 1) % professions.length;
    select(professions[i].id);
  }, 6000);
  setTourBtn(true);
}

function stopTour() {
  if (!tourTimer) return;
  clearInterval(tourTimer);
  tourTimer = null;
  setTourBtn(false);
}

function initInteractive() {
  renderDock();
  renderPins();
  setTourBtn(false);
  $('#tourBtn').addEventListener('click', () => (tourTimer ? stopTour() : startTour()));
  $('#detail').addEventListener('click', (e) => {
    const ph = e.target.closest('[data-photo]');
    if (ph) {
      stopTour();
      return openLightbox(mediaFor(activeId), +ph.dataset.photo);
    }
    const n = e.target.closest('[data-nav]')?.dataset.nav;
    if (n === undefined) return;
    n === '0' ? userSelect(null) : step(+n);
  });
  addEventListener('keydown', (e) => {
    if (!activeId || e.target.closest('input,textarea') || document.querySelector('dialog[open]')) return;
    if (e.key === 'Escape') userSelect(null);
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  $('#profGrid').addEventListener('click', (e) => {
    const a = e.target.closest('[data-show]');
    if (!a) return;
    e.preventDefault();
    $('#hero').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    userSelect(a.dataset.show);
  });
}

async function initCampus() {
  const canvas = $('#campus');
  const loader = $('#loader');
  const hideLoader = () => {
    loader.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => loader.remove(), 800);
  };
  try {
    const { Campus } = await import('./scene/campus.js');
    await document.fonts?.ready; // 3D yozuvlar Inter shriftida chizilishi uchun
    campus = new Campus(canvas, {
      professions,
      reducedMotion,
      gateText: t('gateSign'),
      onSelect: (id) => userSelect(id),
      onHover: (id) => $$('#pins .pin-body').forEach((b) => b.classList.toggle('scale-110', b.parentElement.dataset.id === id)),
    });
    campus.onInteract = () => stopTour();
  } catch (err) {
    console.warn('3D ishga tushmadi:', err);
    canvas.remove();
    $('#pins').remove();
    $('#mapCtrls').remove();
    $('#hint')?.remove();
    $('#hero').classList.add('bg-gradient-to-br', 'from-brand-50', 'to-canvas');
    hideLoader();
    return;
  }

  // HTML belgilarni 3D nuqtalarga bog'lash
  const pins = $$('#pins .pin').map((el) => ({ el, z: campus.zones.get(el.dataset.id), s: { x: 0, y: 0, visible: true } }));
  let first = true;
  campus.onFrame = () => {
    for (const p of pins) {
      campus.project(p.z.anchor, p.s);
      const hide = !p.s.visible || p.el.dataset.id === activeId;
      p.el.style.transform = `translate3d(${p.s.x}px, ${p.s.y}px, 0) translate(-50%, -100%)`;
      p.el.classList.toggle('opacity-0', hide);
      p.el.classList.toggle('pointer-events-none', hide);
    }
    if (first) {
      first = false;
      hideLoader();
    }
  };

  new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? campus.start() : campus.stop())).observe($('#hero'));
  document.addEventListener('visibilitychange', () => (document.hidden ? campus.stop() : campus.start()));
  campus.start();
  // Kuzatuvchi noto'g'ri to'xtatib qo'ysa ham, sahnaga tegilganda animatsiya qayta yuradi
  $('#hero').addEventListener('pointerdown', () => !document.hidden && campus.start());

  const fromHash = location.hash.match(/^#kasb-(\w+)/)?.[1];
  if (fromHash && byId.has(fromHash)) select(fromHash);
}

// ---------------- Scroll effektlari ----------------
let revealIO;
const observeReveal = (root = document) => $$('.reveal', root).forEach((el) => revealIO.observe(el));

function initReveal() {
  const countUp = (el) => {
    const target = +el.dataset.count;
    if (reducedMotion) return (el.textContent = fmt(target));
    const t0 = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / 1400);
      el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  revealIO = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        $$('[data-count]', e.target).forEach(countUp);
        revealIO.unobserve(e.target);
      }),
    { threshold: 0.15 },
  );
  observeReveal();
}

renderStatic();
initInteractive();
initReveal();
renderGallery(observeReveal);
initCampus();
