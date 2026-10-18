// Admin paneldan (/admin, serverdagi PocketBase) keladigan jonli ma'lumotlar.
// Server javob bermasa (masalan, Netlify'da) sayt src/data.js dagi ma'lumotlar bilan ishlaydi.
import { lang, setCustom } from './i18n.js';

export const API = '/api';
export const fileUrl = (r, name, thumb) =>
  `${API}/files/${r.collectionId}/${r.id}/${encodeURIComponent(name)}${thumb ? `?thumb=${thumb}` : ''}`;

async function get(path) {
  const res = await fetch(`${API}/collections/${path}`, { signal: AbortSignal.timeout(2500) });
  if (!res.ok || !res.headers.get('content-type')?.includes('json')) throw new Error(res.status);
  return (await res.json()).items;
}

const [settings, news, gallery, texts] = await Promise.all([
  get('settings/records?perPage=1').then((x) => x[0] ?? null),
  get('news/records?sort=-date&perPage=12'),
  get('gallery/records?sort=-created&perPage=500'),
  get('texts/records?perPage=1000&fields=key,en,uz'),
].map((p) => p.catch(() => null)));

// Saytda bosib tahrirlangan matnlar: "ui.*" → interfeys (src/i18n.js), qolgani → src/data.js yo'li
const clean = (s) => s.replace(/[<>]/g, '').replace(/"/g, '”');
const dataTexts = {};
const uiTexts = {};
for (const r of texts ?? []) {
  const value = r[lang]?.trim();
  if (!value) continue;
  if (r.key.startsWith('ui.')) uiTexts[r.key.slice(3)] = clean(value);
  else dataTexts[r.key] = clean(value);
}
setCustom(uiTexts);

// localize(data) natijasiga tahrirlangan matnlarni qo'yadi ("professions.2.title" kabi yo'llar)
export function withTexts(data) {
  for (const [path, value] of Object.entries(dataTexts)) {
    const keys = path.split('.');
    if (keys.some((k) => k === '__proto__' || k === 'constructor' || k === 'prototype')) continue;
    const last = keys.pop();
    const obj = keys.reduce((o, k) => o?.[k], data);
    if (!obj || !(last in obj)) continue;
    if (typeof obj[last] === 'number') {
      const n = Number(value.replace(/[^\d.]/g, ''));
      if (n) obj[last] = n;
    } else obj[last] = value;
  }
  return data;
}

// Tanlangan tildagi matn, bo'lmasa ikkinchi tildagisi
export const pick = (r, key) => (r[`${key}_${lang}`] || r[`${key}_${lang === 'en' ? 'uz' : 'en'}`] || '').trim();

export { gallery, news };

// Admin paneldagi sozlamalar src/data.js dagilarning ustidan yoziladi
export function applySettings(site) {
  const s = settings;
  if (!s) return site;
  const set = (obj, key, value) => value && (obj[key] = value);
  set(site, 'phone', s.phone);
  set(site, 'email', s.email);
  set(site, 'address', pick(s, 'address'));
  set(site, 'workHours', pick(s, 'hours'));
  set(site, 'telegram', s.telegram);
  set(site, 'instagram', s.instagram);
  set(site, 'map', s.map?.trim());
  site.admission.open = !!s.admission_open;
  set(site.admission, 'deadline', pick(s, 'deadline'));
  set(site.admission, 'applyUrl', s.apply_url);
  return site;
}

// Xarita manzili: koordinata, Google Maps havolasi (@lat,lng bilan), <iframe> kodi yoki qidiruv matni
export function mapSrc(value) {
  let v = value.trim();
  v = v.match(/src="([^"]+)"/)?.[1] ?? v;
  if (/^https:\/\/(www\.)?google\.[a-z.]+\/maps\/embed\?/.test(v)) return v;
  const at = v.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ?? v.match(/^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/);
  const q = at ? `${at[1]},${at[2]}` : v;
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=16&hl=${lang}&output=embed`;
}
