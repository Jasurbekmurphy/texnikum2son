// ============================================================
//  TIL: sayt ikki tilda. Asosiy til ingliz (en), ikkinchisi o'zbek (uz).
//  Til tanlovi ?lang=uz havolasi yoki brauzer xotirasida saqlanadi.
//  Bu fayldagi matnlar sahifa interfeysi uchun; kontent src/data.js da.
// ============================================================

export const LANGS = ['en', 'uz'];
export const DEFAULT_LANG = 'en';

const read = () => {
  try {
    return localStorage.getItem('lang');
  } catch {
    return null;
  }
};
const fromUrl = new URLSearchParams(location.search).get('lang');
export const lang = LANGS.includes(fromUrl) ? fromUrl : LANGS.includes(read()) ? read() : DEFAULT_LANG;

export function setLang(next) {
  if (next === lang) return;
  try {
    localStorage.setItem('lang', next);
  } catch {}
  const url = new URL(location.href);
  url.searchParams.set('lang', next);
  location.assign(url);
}

// { en: '...', uz: '...' } ko'rinishidagi har bir qiymatni tanlangan tilga aylantiradi (ichma-ich ham)
const isPair = (v) => v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).every((k) => LANGS.includes(k)) && Object.keys(v).length > 0;
export function localize(v) {
  if (isPair(v)) return v[lang] ?? v[DEFAULT_LANG];
  if (Array.isArray(v)) return v.map(localize);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, localize(x)]));
  return v;
}

const UI = {
  metaTitle: { en: 'Paxtaobod Technical School No. 2: choose your profession in a 3D campus', uz: 'Paxtaobod 2-son texnikumi: kasbingizni 3D kampusda tanlang' },
  metaDesc: {
    en: 'Paxtaobod District Technical School No. 2: digital information, culinary arts, sewing, auto service, metal processing, welding and residential services. Full-time and dual education, interactive 3D campus.',
    uz: "Paxtaobod tuman 2-son texnikumi: raqamli axborotlar, oshpazlik, tikuvchilik, avtoservis, metallga ishlov, payvandchilik va turar joy servisi. Kunduzgi va dual ta'lim, interaktiv 3D kampus.",
  },
  ogTitle: { en: 'Paxtaobod Technical School No. 2: 3D campus', uz: 'Paxtaobod tuman 2-son texnikumi: 3D kampus' },
  ogDesc: { en: 'Choose your profession in an interactive 3D campus.', uz: 'Kasbingizni interaktiv 3D kampusda tanlang.' },

  language: { en: 'Language', uz: 'Til' },
  menu: { en: 'Menu', uz: 'Menyu' },
  apply: { en: 'Apply now', uz: 'Hujjat topshirish' },
  navPrograms: { en: 'Programs', uz: 'Kasblar' },
  navWhy: { en: 'Why us', uz: 'Afzalliklar' },
  navGallery: { en: 'Gallery', uz: 'Galereya' },
  navNews: { en: 'News', uz: 'Yangiliklar' },
  navDual: { en: 'Dual education', uz: "Dual ta'lim" },
  navAdmission: { en: 'Admission', uz: 'Qabul' },
  navFaq: { en: 'FAQ', uz: 'Savollar' },
  navContact: { en: 'Contact', uz: 'Aloqa' },
  admissionOpen: { en: 'Admission open', uz: 'Qabul ochiq' },
  admissionClosed: { en: 'Admission closed', uz: 'Qabul yopiq' },
  openUntil: { en: (d) => `Admission open · until ${d}`, uz: (d) => `Qabul ochiq · ${d}gacha` },

  heroAria: { en: 'Interactive 3D campus', uz: 'Interaktiv 3D kampus' },
  loading: { en: 'Loading the 3D campus…', uz: '3D kampus yuklanmoqda…' },
  heroTitle: { en: 'Choose your profession in a <span class="text-brand-600">3D campus</span>', uz: 'Kasbingizni <span class="text-brand-600">3D kampusda</span> tanlang' },
  heroText: {
    en: 'Walk around the workshops, get to know every program and find the profession that suits you.',
    uz: "Ustaxonalarni aylanib chiqing, har bir yo'nalish bilan tanishing va o'zingizga mos kasbni toping.",
  },
  howToApply: { en: 'How to apply', uz: 'Qabul tartibi' },
  tourPlay: { en: 'Campus tour', uz: "Kampus bo'ylab sayohat" },
  tourStop: { en: 'Stop the tour', uz: "Sayohatni to'xtatish" },
  hint: { en: 'Drag to rotate · click a workshop', uz: 'Sichqoncha bilan aylantiring · ustaxonani bosing' },
  dockAria: { en: 'Programs', uz: 'Kasblar' },
  zoomIn: { en: 'Zoom in', uz: 'Yaqinlashtirish' },
  zoomOut: { en: 'Zoom out', uz: 'Uzoqlashtirish' },
  home: { en: 'Whole campus', uz: 'Butun kampus' },
  gateSign: { en: 'TECH SCHOOL No. 2', uz: '2-SON TEXNIKUM' },

  program: { en: 'Program', uz: "Yo'nalish" },
  prev: { en: 'Previous', uz: 'Oldingi' },
  next: { en: 'Next', uz: 'Keyingi' },
  close: { en: 'Close', uz: 'Yopish' },
  duration: { en: 'Duration', uz: "O'qish muddati" },
  studyMode: { en: 'Study mode', uz: "Ta'lim shakli" },
  places: { en: 'Places', uz: "O'rinlar soni" },
  placesValue: { en: (n) => `${n}`, uz: (n) => `${n} ta` },
  seatsTag: { en: (n) => `${n} places`, uz: (n) => `${n} o'rin` },
  youLearn: { en: 'What you learn', uz: "O'rganasiz" },
  careers: { en: 'Where you can work', uz: "Kim bo'lib ishlaysiz" },
  applyProgram: { en: 'Apply for this program', uz: "Shu yo'nalishga hujjat topshirish" },
  workshopPhotos: { en: 'Workshop photos', uz: 'Ustaxonadan suratlar' },
  viewIn3d: { en: 'View in the 3D campus', uz: "3D kampusda ko'rish" },

  programsEyebrow: { en: 'Programs', uz: "Yo'nalishlar" },
  programsTitle: { en: 'Seven in-demand professions', uz: "Talab yuqori bo'lgan 7 ta kasb" },
  programsText: { en: 'Every program combines theory with hands-on practice in the workshop.', uz: "Har bir yo'nalish bo'yicha nazariya va ustaxonadagi amaliyot birga olib boriladi." },
  whyEyebrow: { en: 'Why us', uz: 'Nega aynan biz' },
  whyTitle: { en: 'Study means practice, practice means a job', uz: "O'qish — bu amaliyot, amaliyot — bu ish" },
  newsEyebrow: { en: 'News', uz: 'Yangiliklar' },
  newsTitle: { en: 'Latest from the school', uz: 'Texnikumdagi so‘nggi voqealar' },
  readMore: { en: 'Read more', uz: 'Batafsil' },
  galleryEyebrow: { en: 'Gallery', uz: 'Galereya' },
  galleryTitle: { en: 'Moments from campus life', uz: 'Texnikum hayotidan lavhalar' },
  galleryText: { en: 'Real photos from our workshops, classes and events.', uz: 'Ustaxonalar, darslar va tadbirlardan haqiqiy suratlar.' },
  galleryAll: { en: 'All', uz: 'Barchasi' },
  live: { en: 'LIVE', uz: 'JONLI' },
  dualEyebrow: { en: 'Dual education', uz: "Dual ta'lim" },
  dualTitle: { en: 'Theory at school, practice at a company', uz: 'Nazariya texnikumda, amaliyot korxonada' },
  dualText: {
    en: 'Students work at a real workplace while they study, so they graduate with both a diploma and work experience.',
    uz: "O'quvchi o'qish davomida haqiqiy ish joyida ishlaydi va bitirganda diplom bilan birga ish tajribasiga ham ega bo'ladi.",
  },
  metricsEyebrow: { en: 'Key figures', uz: "Ko'rsatkichlar" },
  admissionEyebrow: { en: 'Admission 2026/2027', uz: 'Qabul 2026/2027' },
  admissionTitle: { en: 'Become a student in 5 steps', uz: "5 qadamda talaba bo'ling" },
  faqEyebrow: { en: 'FAQ', uz: 'Savollar' },
  faqTitle: { en: 'Frequently asked questions', uz: "Ko'p beriladigan savollar" },
  contactEyebrow: { en: 'Contact', uz: 'Aloqa' },
  contactTitle: { en: 'Have a question? Get in touch!', uz: "Savolingiz bormi? Bog'laning!" },
  contactText: { en: 'The admissions office is ready to help you.', uz: 'Qabul komissiyasi sizga yordam berishga tayyor.' },
  phone: { en: 'Phone', uz: 'Telefon' },
  email: { en: 'Email', uz: 'Email' },
  address: { en: 'Address', uz: 'Manzil' },
  hours: { en: 'Working hours', uz: 'Ish vaqti' },
  map: { en: 'Map', uz: 'Xarita' },
};

// t('key') yoki t('key', arg) — funksiyali matnlar uchun argument beriladi
export function t(key, ...args) {
  const v = UI[key];
  if (!v) return key;
  const s = v[lang] ?? v[DEFAULT_LANG];
  return typeof s === 'function' ? s(...args) : s;
}

// index.html dagi data-i18n / data-i18n-aria / data-i18n-content belgilarini to'ldiradi
export function applyStatic(root = document) {
  document.documentElement.lang = lang;
  root.querySelectorAll('[data-i18n]').forEach((el) => (el.innerHTML = t(el.dataset.i18n)));
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  root.querySelectorAll('[data-i18n-content]').forEach((el) => el.setAttribute('content', t(el.dataset.i18nContent)));
  document.title = t('metaTitle');
}
