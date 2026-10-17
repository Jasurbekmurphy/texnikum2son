// Admin paneldan (/admin, serverdagi PocketBase) keladigan jonli ma'lumotlar.
// Server javob bermasa (masalan, Netlify'da) sayt src/data.js dagi ma'lumotlar bilan ishlaydi.
import { lang } from './i18n.js';

export const API = '/api';
export const fileUrl = (r, name, thumb) =>
  `${API}/files/${r.collectionId}/${r.id}/${encodeURIComponent(name)}${thumb ? `?thumb=${thumb}` : ''}`;

async function get(path) {
  const res = await fetch(`${API}/collections/${path}`, { signal: AbortSignal.timeout(2500) });
  if (!res.ok || !res.headers.get('content-type')?.includes('json')) throw new Error(res.status);
  return (await res.json()).items;
}

const [settings, news, gallery] = await Promise.all([
  get('settings/records?perPage=1').then((x) => x[0] ?? null),
  get('news/records?sort=-date&perPage=12'),
  get('gallery/records?sort=-created&perPage=500'),
].map((p) => p.catch(() => null)));

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
  site.admission.open = !!s.admission_open;
  set(site.admission, 'deadline', pick(s, 'deadline'));
  set(site.admission, 'applyUrl', s.apply_url);
  return site;
}
