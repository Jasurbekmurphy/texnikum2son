// Admin panel (/admin): qabul va aloqa, yangiliklar, galereya.
// Ma'lumotlar serverdagi PocketBase'da saqlanadi (server/README.md).
import { galleryText, professions } from './data.js';

const API = '/api';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const fileUrl = (r, name, thumb) => `${API}/files/${r.collectionId}/${r.id}/${encodeURIComponent(name)}${thumb ? `?thumb=${thumb}` : ''}`;

// ---------------- Server bilan ishlash ----------------
let token = localStorage.getItem('pb_token') || '';

async function api(path, { method = 'GET', body } = {}) {
  const headers = token ? { Authorization: token } : {};
  if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';
  const res = await fetch(API + path, { method, headers, body: body && !(body instanceof FormData) ? JSON.stringify(body) : body });
  if (res.status === 401 || res.status === 403) {
    logout();
    throw new Error('Qaytadan kiring');
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const fields = Object.entries(data.data ?? {}).map(([k, v]) => `${k}: ${v.message}`);
    throw new Error([data.message, ...fields].filter(Boolean).join(' · ') || `Xato ${res.status}`);
  }
  return data;
}

const records = (name, query = '') => api(`/collections/${name}/records?perPage=500${query}`).then((d) => d.items);

function status(form, text, ok = true) {
  const el = $('[data-status]', form);
  el.textContent = text;
  el.className = `text-sm font-medium ${ok ? 'text-emerald-600' : 'text-red-600'}`;
}

async function busy(form, fn) {
  const btn = $('button.btn-primary', form);
  btn.disabled = true;
  btn.classList.add('opacity-60');
  try {
    await fn();
  } catch (e) {
    status(form, e.message, false);
  } finally {
    btn.disabled = false;
    btn.classList.remove('opacity-60');
  }
}

// ---------------- Kirish / chiqish ----------------
function logout() {
  token = '';
  localStorage.removeItem('pb_token');
  $('#app').hidden = true;
  $('#login').hidden = false;
}

$('#loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const err = $('#loginError');
  err.hidden = true;
  try {
    const res = await fetch(`${API}/collections/_superusers/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: f.get('email'), password: f.get('password') }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.token) throw new Error(res.status === 404 ? 'Server hali sozlanmagan' : "Email yoki parol noto'g'ri");
    token = data.token;
    localStorage.setItem('pb_token', token);
    start();
  } catch (e) {
    err.textContent = e.message;
    err.hidden = false;
  }
});
$('#logout').addEventListener('click', logout);

// ---------------- Bo'limlar ----------------
$('#tabs').addEventListener('click', (e) => {
  const b = e.target.closest('[data-tab]');
  if (!b) return;
  $$('[data-tab]').forEach((x) => x.setAttribute('aria-pressed', x === b));
  $$('[data-panel]').forEach((p) => (p.hidden = p.dataset.panel !== b.dataset.tab));
});

// ---------------- Qabul va aloqa ----------------
let settingsId = null;
async function loadSettings() {
  const [s] = await records('settings');
  if (!s) return;
  settingsId = s.id;
  const form = $('#settingsForm');
  for (const el of form.elements) {
    if (!el.name) continue;
    if (el.type === 'checkbox') el.checked = !!s[el.name];
    else el.value = s[el.name] ?? '';
  }
}
$('#settingsForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  busy(form, async () => {
    const body = {};
    for (const el of form.elements) if (el.name) body[el.name] = el.type === 'checkbox' ? el.checked : el.value.trim();
    await api(`/collections/settings/records/${settingsId}`, { method: 'PATCH', body });
    status(form, 'Saqlandi. Saytda darhol ko‘rinadi.');
  });
});

// ---------------- Yangiliklar ----------------
let news = [];
const dialog = $('#newsDialog');
const newsForm = $('#newsForm');
let editing = null;

async function loadNews() {
  news = await records('news', '&sort=-date');
  $('#newsList').innerHTML = news.length
    ? news
        .map(
          (n) => `<div class="card flex items-center gap-4 !p-3">
          ${n.image ? `<img src="${fileUrl(n, n.image, '800x0')}" class="size-16 shrink-0 rounded-xl object-cover" alt="" />` : '<div class="size-16 shrink-0 rounded-xl bg-slate-100"></div>'}
          <div class="min-w-0 flex-1">
            <p class="truncate font-bold">${esc(n.title_uz)}</p>
            <p class="text-sm text-slate-500">${n.date.slice(0, 10)} · ${n.published ? '<span class="text-emerald-600">saytda</span>' : 'yashirin'}</p>
          </div>
          <button class="btn-ghost" data-edit="${n.id}">Tahrirlash</button>
          <button class="btn-ghost !text-red-600" data-del="${n.id}">O'chirish</button>
        </div>`,
        )
        .join('')
    : '<p class="card text-slate-500">Hozircha yangilik yo‘q.</p>';
}

function openNews(n) {
  editing = n;
  newsForm.reset();
  $('[data-title]', newsForm).textContent = n ? 'Yangilikni tahrirlash' : 'Yangi yangilik';
  status(newsForm, '');
  for (const el of newsForm.elements) {
    if (!el.name || el.type === 'file') continue;
    if (el.type === 'checkbox') el.checked = n ? !!n[el.name] : true;
    else if (el.name === 'date') el.value = (n?.date || new Date().toISOString()).slice(0, 10);
    else el.value = n?.[el.name] ?? '';
  }
  $('[data-current-image]', newsForm).innerHTML = n?.image
    ? `<img src="${fileUrl(n, n.image, '800x0')}" class="h-28 rounded-xl object-cover" alt="" /><p class="mt-1 text-xs text-slate-500">Yangi rasm tanlasangiz, shu rasm almashadi.</p>`
    : '';
  dialog.showModal();
}

$('#newsAdd').addEventListener('click', () => openNews(null));
dialog.addEventListener('click', (e) => (e.target === dialog || e.target.closest('[data-close]')) && dialog.close());
$('#newsList').addEventListener('click', async (e) => {
  const edit = e.target.closest('[data-edit]')?.dataset.edit;
  const del = e.target.closest('[data-del]')?.dataset.del;
  if (edit) openNews(news.find((n) => n.id === edit));
  if (del && confirm("Yangilik o'chirilsinmi?")) {
    await api(`/collections/news/records/${del}`, { method: 'DELETE' });
    loadNews();
  }
});
newsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  busy(newsForm, async () => {
    const f = new FormData(newsForm);
    f.set('published', newsForm.elements.published.checked);
    f.set('date', `${f.get('date')} 12:00:00.000Z`);
    if (!f.get('image')?.size) f.delete('image');
    await api(editing ? `/collections/news/records/${editing.id}` : '/collections/news/records', {
      method: editing ? 'PATCH' : 'POST',
      body: f,
    });
    dialog.close();
    loadNews();
  });
});

// ---------------- Galereya ----------------
const categories = [
  ...professions.map((p) => [p.id, p.title.uz]),
  ...Object.entries(galleryText.folders).map(([k, v]) => [k, v.uz]),
];
const categoryName = new Map(categories);
$('#categorySelect').innerHTML = categories.map(([id, name]) => `<option value="${id}">${esc(name)}</option>`).join('');

// Kartochka o'lchami uchun rasm/videoning eni va bo'yi
function measure(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const done = (w, h) => {
      URL.revokeObjectURL(url);
      resolve({ width: w || 0, height: h || 0 });
    };
    if (file.type.startsWith('video/')) {
      const v = document.createElement('video');
      v.preload = 'metadata';
      v.onloadedmetadata = () => done(v.videoWidth, v.videoHeight);
      v.onerror = () => done();
      v.src = url;
    } else {
      const img = new Image();
      img.onload = () => done(img.naturalWidth, img.naturalHeight);
      img.onerror = () => done();
      img.src = url;
    }
  });
}

let gallery = [];
async function loadGallery() {
  gallery = await records('gallery', '&sort=-created');
  $('#galleryList').innerHTML = gallery.length
    ? gallery
        .map((g) => {
          const video = /\.(mp4|webm)$/i.test(g.file);
          const media = video
            ? `<video src="${fileUrl(g, g.file)}#t=0.1" class="aspect-square w-full object-cover" muted preload="metadata"></video>`
            : `<img src="${fileUrl(g, g.file, '800x0')}" class="aspect-square w-full object-cover" alt="" loading="lazy" />`;
          return `<div class="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 ${g.published ? '' : 'opacity-50'}">
            ${media}
            <div class="p-3 text-sm">
              <p class="font-semibold">${esc(categoryName.get(g.category) ?? g.category)}</p>
              <p class="truncate text-slate-500">${esc(g.caption_uz) || '&nbsp;'}</p>
              <div class="mt-2 flex gap-2">
                <button class="btn-ghost !px-2.5 !py-1.5 !text-xs" data-toggle="${g.id}">${g.published ? 'Yashirish' : "Ko'rsatish"}</button>
                <button class="btn-ghost !px-2.5 !py-1.5 !text-xs !text-red-600" data-gdel="${g.id}">O'chirish</button>
              </div>
            </div>
          </div>`;
        })
        .join('')
    : '<p class="col-span-full text-slate-500">Hozircha yuklangan fayl yo‘q.</p>';
}

$('#galleryList').addEventListener('click', async (e) => {
  const toggle = e.target.closest('[data-toggle]')?.dataset.toggle;
  const del = e.target.closest('[data-gdel]')?.dataset.gdel;
  if (toggle) {
    const g = gallery.find((x) => x.id === toggle);
    await api(`/collections/gallery/records/${toggle}`, { method: 'PATCH', body: { published: !g.published } });
    loadGallery();
  }
  if (del && confirm("Fayl o'chirilsinmi?")) {
    await api(`/collections/gallery/records/${del}`, { method: 'DELETE' });
    loadGallery();
  }
});

$('#uploadForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  busy(form, async () => {
    const files = [...form.elements.files.files];
    for (const [i, file] of files.entries()) {
      status(form, `Yuklanmoqda: ${i + 1} / ${files.length}`);
      const size = await measure(file);
      const f = new FormData();
      f.set('file', file);
      f.set('category', form.elements.category.value);
      f.set('caption_uz', form.elements.caption_uz.value.trim());
      f.set('caption_en', form.elements.caption_en.value.trim());
      f.set('width', size.width);
      f.set('height', size.height);
      f.set('published', true);
      await api('/collections/gallery/records', { method: 'POST', body: f });
    }
    form.elements.files.value = '';
    status(form, `${files.length} ta fayl yuklandi. Saytda darhol ko‘rinadi.`);
    loadGallery();
  });
});

// ---------------- Boshlash ----------------
async function start() {
  $('#login').hidden = true;
  $('#app').hidden = false;
  try {
    // Token hali amal qiladimi, tekshirib yangilaymiz
    const data = await api('/collections/_superusers/auth-refresh', { method: 'POST' });
    token = data.token;
    localStorage.setItem('pb_token', token);
    await Promise.all([loadSettings(), loadNews(), loadGallery()]);
  } catch (e) {
    if (token) alert(e.message);
  }
}

if (token) start();
else logout();
