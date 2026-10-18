import * as raw from './data.js';
import { localize, t } from './i18n.js';
import { icon } from './icons.js';
import { fileUrl, gallery as uploaded, pick, withTexts } from './content.js';

// src/gallery/ ichidagi rasm va videolar build paytida avtomatik topiladi.
// Papka nomi = bo'lim, fayl nomi = yozuv (batafsil: src/gallery/README.md).
const thumbs = import.meta.glob('./gallery/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
  query: { w: '800', format: 'webp', quality: '74', as: 'img' },
});
const fulls = import.meta.glob('./gallery/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
  query: { w: '2000', format: 'webp', quality: '82' },
});
const videos = import.meta.glob('./gallery/**/*.{mp4,webm,MP4,WEBM}', { eager: true, import: 'default', query: '?url' });

const { professions, galleryText } = withTexts(localize(raw));
const byProf = new Map(professions.map((p) => [p.id, p]));
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Papka (bo'lim) nomidan: filtr tugmasidagi qisqa nom (group) va rasm ustidagi to'liq nom (title)
function describe(folder) {
  const prof = byProf.get(folder);
  const other = galleryText.folders[folder || 'kampus'] ?? cap(folder.replace(/[-_]+/g, ' '));
  const group = prof ? (prof.label ?? prof.title) : other;
  const title = prof ? prof.title : other;
  return { folder, group, title, color: prof?.color, rank: prof ? professions.indexOf(prof) : 99 };
}

function parse(path) {
  const parts = path.replace('./gallery/', '').split('/');
  const file = parts.pop();
  const info = describe(parts[0] ?? '');
  const slug = file.replace(/\.[^.]+$/, '').replace(/[-_ ]*\d+$/, '');
  // Tarjima bo'lsa (src/data.js → galleryText), aks holda fayl nomining o'zi
  const caption = galleryText.captions[slug] ?? slug.replace(/[-_]+/g, ' ').trim();
  return { ...info, caption: caption ? cap(caption) : info.title };
}

// Admin paneldan yuklangan rasm/videolar (yangilari birinchi)
function fromAdmin(r) {
  const info = describe(r.category);
  const caption = pick(r, 'caption').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const base = { ...info, path: r.id, caption: caption ? cap(caption) : info.title };
  return /\.(mp4|webm)$/i.test(r.file)
    ? { ...base, type: 'video', src: fileUrl(r, r.file), w: r.width || 16, h: r.height || 9 }
    : { ...base, type: 'img', thumb: fileUrl(r, r.file, '800x0'), full: fileUrl(r, r.file), w: r.width || 4, h: r.height || 3 };
}

const bundled = [
  ...Object.entries(thumbs).map(([path, t]) => ({ ...parse(path), path, type: 'img', thumb: t.src, w: t.w, h: t.h, full: fulls[path] })),
  ...Object.entries(videos).map(([path, src]) => ({ ...parse(path), path, type: 'video', src, w: 16, h: 9 })),
].sort((a, b) => a.path.localeCompare(b.path, 'uz', { numeric: true }));

export const media = [...(uploaded ?? []).map(fromAdmin), ...bundled]
  .map((m, seq) => ({ ...m, seq }))
  .sort((a, b) => a.rank - b.rank || a.seq - b.seq);

export const mediaFor = (folder) => media.filter((m) => m.folder === folder);

// ---------------- Kartochka ----------------
const tile = (m, i) => {
  const live = m.type === 'video';
  const body = live
    ? `<video class="kb size-full object-cover" src="${m.src}#t=0.1" muted loop playsinline preload="metadata"></video>`
    : `<img class="kb size-full object-cover" src="${m.thumb}" width="${m.w}" height="${m.h}" alt="${m.caption}" loading="lazy" decoding="async" />`;
  return `<button type="button" class="gal-tile reveal group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-brand-100 text-left ring-1 ring-white/70 sm:mb-4" style="--d:${(i % 4) * 70}ms;--kx:${(i * 37) % 7 - 3}%;--ky:${(i * 53) % 7 - 3}%;aspect-ratio:${m.w}/${m.h}" data-gal="${i}" aria-label="${m.caption}">
    ${body}
    ${live ? `<span class="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur"><span class="size-1.5 animate-pulse rounded-full bg-red-500"></span>${t('live')}</span>` : ''}
    <span class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent p-3 pt-10 text-white transition duration-500 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
      <span class="block text-[11px] font-bold tracking-wider uppercase opacity-80" ${m.color ? `style="color:color-mix(in oklab, ${m.color} 45%, white)"` : ''}>${m.group}</span>
      <span class="block text-sm font-semibold">${m.caption}</span>
    </span>
  </button>`;
};

// Faqat ko'rinib turgan videolar o'ynaydi, rasmlar ko'ringanda sekin "nafas oladi"
const liveIO =
  typeof IntersectionObserver !== 'undefined' &&
  new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        e.target.classList.toggle('live', e.isIntersecting);
        const v = e.target.querySelector('video');
        if (v) e.isIntersecting && !document.hidden ? v.play().catch(() => {}) : v.pause();
      }),
    { threshold: 0.35 },
  );

// ---------------- Lightbox ----------------
let box;
let list = [];
let at = 0;

function ensureBox() {
  if (box) return box;
  box = document.createElement('dialog');
  box.className = 'gal-box';
  box.setAttribute('aria-label', t('navGallery'));
  box.innerHTML = `
    <div class="absolute inset-0 grid place-items-center p-3 sm:p-12" data-stage></div>
    <div class="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-3 text-white sm:p-5">
      <p class="min-w-0 text-sm"><span class="block text-xs font-bold tracking-wider text-sky-300 uppercase" data-group></span><span class="font-semibold" data-cap></span></p>
      <div class="flex items-center gap-2"><span class="text-xs tabular-nums opacity-70" data-num></span>
      <button class="gal-btn" data-go="x" aria-label="${t('close')}">${icon('x')}</button></div>
    </div>
    <button class="gal-btn absolute top-1/2 left-3 -translate-y-1/2 sm:left-5" data-go="-1" aria-label="${t('prev')}">${icon('left')}</button>
    <button class="gal-btn absolute top-1/2 right-3 -translate-y-1/2 sm:right-5" data-go="1" aria-label="${t('next')}">${icon('right')}</button>`;
  document.body.append(box);
  box.addEventListener('click', (e) => {
    const go = e.target.closest('[data-go]')?.dataset.go;
    if (go === 'x' || e.target === box || e.target.matches('[data-stage]')) return box.close();
    if (go) show(at + +go);
  });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(at + 1);
    if (e.key === 'ArrowLeft') show(at - 1);
  });
  box.addEventListener('close', () => {
    box.querySelector('video')?.pause();
    document.documentElement.style.overflow = '';
  });
  // Barmoq bilan surish
  let x0 = null;
  box.addEventListener('pointerdown', (e) => (x0 = e.clientX));
  box.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) show(at + (dx < 0 ? 1 : -1));
  });
  return box;
}

function show(i) {
  at = (i + list.length) % list.length;
  const m = list[at];
  const stage = box.querySelector('[data-stage]');
  stage.innerHTML =
    m.type === 'video'
      ? `<video class="gal-media" src="${m.src}" autoplay muted loop playsinline controls></video>`
      : `<img class="gal-media" src="${m.full}" alt="${m.caption}" />`;
  box.querySelector('[data-group]').textContent = m.title;
  box.querySelector('[data-cap]').textContent = m.caption;
  box.querySelector('[data-num]').textContent = `${at + 1} / ${list.length}`;
  box.querySelectorAll('[data-go="1"],[data-go="-1"]').forEach((b) => (b.hidden = list.length < 2));
  // Qo'shni rasmlarni oldindan yuklab qo'yamiz
  [list[(at + 1) % list.length], list[(at - 1 + list.length) % list.length]].forEach((n) => n?.full && (new Image().src = n.full));
}

export function openLightbox(items, i = 0) {
  if (!items.length) return;
  list = items;
  ensureBox();
  show(i);
  if (!box.open) box.showModal();
  document.documentElement.style.overflow = 'hidden';
}

// ---------------- Bo'lim ----------------
export function renderGallery(onReveal) {
  const section = document.querySelector('#galereya');
  if (!media.length) return false;
  section.hidden = false;
  const groups = [...new Set(media.map((m) => m.group))];
  const chips = section.querySelector('#galFilters');
  const grid = section.querySelector('#galGrid');
  let current = media;

  const draw = (items) => {
    current = items;
    grid.innerHTML = items.map((m, i) => tile(m, i)).join('');
    grid.querySelectorAll('.gal-tile').forEach((t) => liveIO && liveIO.observe(t));
    onReveal?.(grid);
  };

  if (groups.length > 1) {
    chips.innerHTML = [t('galleryAll'), ...groups]
      .map((g, i) => `<button type="button" class="gal-chip" aria-pressed="${i === 0}" data-group="${i ? g : ''}">${g}</button>`)
      .join('');
    chips.addEventListener('click', (e) => {
      const b = e.target.closest('[data-group]');
      if (!b) return;
      chips.querySelectorAll('[data-group]').forEach((c) => c.setAttribute('aria-pressed', c === b));
      draw(b.dataset.group ? media.filter((m) => m.group === b.dataset.group) : media);
    });
  }
  grid.addEventListener('click', (e) => {
    const t = e.target.closest('[data-gal]');
    if (t) openLightbox(current, +t.dataset.gal);
  });
  document.addEventListener('visibilitychange', () => document.hidden && grid.querySelectorAll('video').forEach((v) => v.pause()));
  draw(media);
  return true;
}
