// ============================================================
//  TIL: sayt ikki tilda. Asosiy til ingliz (en), ikkinchisi o'zbek (uz).
//  Til manzildan olinadi: texnikum2son.com/ → inglizcha, texnikum2son.com/uz/ → o'zbekcha.
//  Shunda Google ikkala sahifani alohida ko'radi va qidiruv tiliga mosini chiqaradi.
//  Interfeys matnlari src/ui-text.js da, kontent src/data.js da.
// ============================================================
import { UI } from './ui-text.js';

export const LANGS = ['en', 'uz'];
export const DEFAULT_LANG = 'en';
export const pathFor = (l) => (l === DEFAULT_LANG ? '/' : `/${l}/`);

const store = (v) => {
  try {
    return v ? localStorage.setItem('lang', v) : localStorage.getItem('lang');
  } catch {
    return null;
  }
};
const fromPath = LANGS.find((l) => l !== DEFAULT_LANG && new RegExp(`^/${l}(/|$)`).test(location.pathname));
export const lang = fromPath ?? DEFAULT_LANG;

// Til sahifasiga havola: boshqa parametrlar (masalan ?edit=1) va #bo'lim saqlanadi
export function langUrl(next, href = location.href) {
  const url = new URL(href);
  url.searchParams.delete('lang');
  url.pathname = pathFor(next);
  return url.pathname + url.search + url.hash;
}

// Eski ?lang=uz havolalari va avval o'zbekchani tanlagan foydalanuvchi uchun bosh sahifadan /uz/ ga o'tish
const asked = new URLSearchParams(location.search).get('lang');
const wanted = LANGS.includes(asked) ? asked : location.pathname === '/' && LANGS.includes(store()) ? store() : null;
if (wanted && wanted !== lang) location.replace(langUrl(wanted));
else if (asked) history.replaceState(null, '', langUrl(lang));

export function setLang(next) {
  store(next);
  if (next !== lang) location.assign(langUrl(next));
}

// { en: '...', uz: '...' } ko'rinishidagi har bir qiymatni tanlangan tilga aylantiradi (ichma-ich ham)
const isPair = (v) => v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).every((k) => LANGS.includes(k)) && Object.keys(v).length > 0;
export function localize(v) {
  if (isPair(v)) return v[lang] ?? v[DEFAULT_LANG];
  if (Array.isArray(v)) return v.map(localize);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, localize(x)]));
  return v;
}

// t('key') yoki t('key', arg) — funksiyali matnlar uchun argument beriladi
// Saytda tahrirlangan matnlar (src/content.js beradi). [matn] → ko'k rangda ajratilgan
let custom = {};
export const setCustom = (map) => (custom = map);
export const highlight = (s) => s.replace(/\[([^\]]+)\]/g, '<span class="text-brand-600">$1</span>');

export function t(key, ...args) {
  const v = UI[key];
  if (!v) return key;
  const s = v[lang] ?? v[DEFAULT_LANG];
  if (typeof s === 'function') return s(...args);
  return custom[key] ? highlight(custom[key]) : s;
}

// index.html dagi data-i18n / data-i18n-aria / data-i18n-content belgilarini to'ldiradi
export function applyStatic(root = document) {
  document.documentElement.lang = lang;
  root.querySelectorAll('[data-i18n]').forEach((el) => (el.innerHTML = t(el.dataset.i18n)));
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  root.querySelectorAll('[data-i18n-content]').forEach((el) => el.setAttribute('content', t(el.dataset.i18nContent)));
  document.title = t('metaTitle');
}
