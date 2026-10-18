// ============================================================
//  SAYT MA'LUMOTLARI — barcha matnlarni shu fayldan o'zgartiring.
//  Har bir matn ikki tilda: { en: 'English', uz: "O'zbekcha" }.
//  "TODO" deb belgilangan joylarni texnikumning haqiqiy
//  ma'lumotlari bilan almashtiring.
// ============================================================

export const site = {
  shortName: { en: 'Paxtaobod Tech School No. 2', uz: 'Paxtaobod 2-son texnikumi' },
  fullName: { en: 'Paxtaobod District Technical School No. 2', uz: 'Paxtaobod tuman 2-son texnikumi' },
  domain: 'texnikum2son.com',
  slogan: { en: 'Vocational education, dual training and practical skills', uz: "Kasbiy ta'lim, dual ta'lim va amaliy ko'nikmalar" },
  phone: '+998 55 201 26 65',
  email: 'info@texnikum2son.com',
  address: {
    en: 'Chamanzor Street, Shovruq MFY, Paxtaobod district, Andijan region',
    uz: "Andijon viloyati, Paxtaobod tumani, Shovruq MFY, Chamanzor ko'chasi",
  },
  workHours: { en: 'Mon–Fri, 08:30–17:00', uz: 'Dush–Juma, 08:30–17:00' }, // TODO: tekshiring
  telegram: 'https://t.me/texnikum2son',
  instagram: 'https://www.instagram.com/paxtaobod_2son_texnikumi',
  // Xarita: koordinata ("40.9310, 72.4970"), Google Maps havolasi, joylashtirish (<iframe>) kodi
  // yoki qidiruv matni. Admin paneldan ham o'zgartiriladi.
  map: 'Paxtaobod tumani 2-son texnikumi, Andijon viloyati',
  admission: {
    open: false, // qabul ochilganda: true
    deadline: { en: 'August 25', uz: '25-avgust' }, // TODO: tekshiring
    applyUrl: 'https://my.edu.uz', // TODO: hujjat topshirish havolasi
  },
};

// Manba: texnikum2son.com (2026-yil oktabr)
export const stats = [
  { value: 610, suffix: '', label: { en: 'Students', uz: "O'quvchilar" }, note: { en: 'full-time and dual', uz: 'kunduzgi va dual' } },
  { value: 90, suffix: '%', label: { en: 'Employment', uz: 'Ishga joylashish' }, note: { en: 'of graduates', uz: 'bitiruvchilar' } },
  { value: 80, suffix: '+', label: { en: 'Companies', uz: 'Korxonalar' }, note: { en: 'partnership agreements', uz: 'bilan shartnoma' } },
  { value: 79, suffix: '', label: { en: 'Staff', uz: 'Xodimlar' }, note: { en: '28 teachers, 17 masters', uz: '28 pedagog, 17 usta' } },
  { value: 7, suffix: '', label: { en: 'Programs', uz: "Yo'nalishlar" }, note: { en: 'modern professions', uz: 'zamonaviy kasblar' } },
  { value: 65, suffix: '', label: { en: 'Computers', uz: 'Kompyuterlar' }, note: { en: 'in IT classrooms', uz: 'IT sinflarda' } },
];

// Dual ta'lim: nazariya texnikumda, amaliyot korxonada
export const dual = [
  {
    title: { en: 'Theory', uz: 'Nazariy ta’lim' },
    text: { en: 'With qualified teachers in lecture rooms and digital classrooms.', uz: 'Malakali pedagoglar bilan auditoriya va raqamli sinflarda.' },
  },
  {
    title: { en: 'Workshop training', uz: 'Ustaxonada mashq' },
    text: { en: 'Guided by 17 vocational training masters.', uz: '17 nafar ishlab chiqarish ta’limi ustasi rahbarligida.' },
  },
  {
    title: { en: 'Company placement', uz: 'Korxonada amaliyot' },
    text: { en: 'Real work at partner companies.', uz: 'Hamkor korxonalarda haqiqiy ish jarayoni.' },
  },
  {
    title: { en: 'Diploma and a job', uz: 'Diplom va ish' },
    text: { en: 'Graduates leave with a diploma and work experience.', uz: 'Bitiruvchilar diplom bilan birga ish tajribasiga ega bo‘ladi.' },
  },
];

// Manba: texnikum2son.com
export const metrics = [
  { label: { en: 'Employment', uz: 'Ishga joylashish' }, value: 90 },
  { label: { en: 'Dual education coverage', uz: 'Dual ta’lim qamrovi' }, value: 85 },
  { label: { en: 'Workshop equipment', uz: 'Ustaxonalar jihozlanishi' }, value: 88 },
  { label: { en: 'Digital classrooms', uz: 'Raqamli sinflar' }, value: 92 },
];

const FORM = { en: 'Full-time · Dual', uz: 'Kunduzgi · Dual' };

// zone: [x, z] — 3D kampusdagi ustaxona joylashuvi (o'zgartirmang)
// prop: 3D sahnadagi ustaxona belgisi turi
// label: 3D kampusdagi qisqa nom. duration/seats: noma'lum bo'lsa null qoldiring (sahifada ko'rinmaydi).
export const professions = [
  {
    id: 'it',
    title: { en: 'Digital Information Processing', uz: 'Raqamli axborotlarni qayta ishlash' },
    label: { en: 'Digital', uz: 'Raqamli' },
    short: { en: 'Computers, office software and data', uz: 'Kompyuter, ofis dasturlari va ma’lumotlar' },
    desc: {
      en: 'Learn computer literacy, office software, databases and the basics of graphic design in classrooms with about 65 computers.',
      uz: "Kompyuter savodxonligi, ofis dasturlari, ma'lumotlar bazasi va grafik dizayn asoslarini 65 ga yaqin kompyuterli sinflarda o'rganasiz.",
    },
    duration: null, // TODO
    form: FORM,
    seats: null, // TODO
    skills: {
      en: ['Office software', 'Databases', 'Graphic design', 'PC assembly'],
      uz: ['Ofis dasturlari', 'Ma’lumotlar bazasi', 'Grafik dizayn', 'Kompyuter yig‘ish'],
    },
    careers: { en: ['Computer operator', 'IT specialist', 'Assistant designer'], uz: ['Operator', 'Kompyuter mutaxassisi', 'Dizayner yordamchisi'] },
    color: '#2563eb',
    prop: 'it',
    zone: [-19, -5],
  },
  {
    id: 'housing',
    title: { en: 'Residential Service Technician', uz: 'Turar joy servisi ustasi' },
    label: { en: 'Service', uz: 'Servis' },
    short: { en: 'Plumbing, electrics and finishing', uz: 'Santexnika, elektr va pardozlash' },
    desc: {
      en: 'Learn plumbing, electrical installation and finishing work in residential buildings, and how to keep homes in good repair.',
      uz: "Turar-joy binolarida santexnika, elektr montaj va pardozlash ishlarini bajarish, uy-joyni saqlashni o'rganasiz.",
    },
    duration: null, // TODO
    form: FORM,
    seats: null, // TODO
    skills: {
      en: ['Electrical installation', 'Plumbing', 'Finishing work', 'Safety practices'],
      uz: ['Elektr montaj', 'Santexnika', 'Pardozlash', 'Xavfsizlik texnikasi'],
    },
    careers: { en: ['Building technician', 'Electrician', 'Plumber'], uz: ['Uy-joy ustasi', 'Elektrik', 'Santexnik'] },
    color: '#f59e0b',
    prop: 'housing',
    zone: [19, -5],
  },
  {
    id: 'auto',
    title: { en: 'Automobile Maintenance', uz: "Avtomobillarga texnik xizmat ko'rsatish" },
    label: { en: 'Auto', uz: 'Avtoservis' },
    short: { en: 'Diagnostics and repair', uz: 'Diagnostika va ta’mirlash' },
    desc: {
      en: 'Learn to diagnose and repair engines, transmissions and electrical systems in the auto workshop.',
      uz: "Dvigatel, transmissiya va elektr jihozlarini diagnostika qilish hamda ta'mirlashni avtoustaxonada o'rganasiz.",
    },
    duration: null, // TODO
    form: FORM,
    seats: null, // TODO
    skills: {
      en: ['Computer diagnostics', 'Engine repair', 'Chassis', 'Auto electrics'],
      uz: ['Kompyuter diagnostikasi', 'Dvigatel ta‘miri', 'Yurish qismi', 'Avtoelektrika'],
    },
    careers: { en: ['Auto mechanic', 'Diagnostic technician', 'Auto electrician'], uz: ['Avtomexanik', 'Diagnost', 'Avtoelektrik'] },
    color: '#ef4444',
    prop: 'auto',
    zone: [-20, 13],
  },
  {
    id: 'welding',
    title: { en: 'Welding', uz: 'Payvandchilik' },
    label: { en: 'Welding', uz: 'Payvand' },
    short: { en: 'Electric and gas welding', uz: 'Elektr va gaz payvandlash' },
    desc: {
      en: 'Learn to weld metal structures with different methods, read technical drawings and check weld quality.',
      uz: "Metall konstruksiyalarni turli usullarda payvandlash, chizmalarni o'qish va chok sifatini nazorat qilishni o'rganasiz.",
    },
    duration: null, // TODO
    form: FORM,
    seats: null, // TODO
    skills: {
      en: ['Electric welding', 'Gas welding', 'Reading drawings', 'Metal cutting'],
      uz: ['Elektr payvand', 'Gaz payvand', 'Chizma o‘qish', 'Metall kesish'],
    },
    careers: { en: ['Welder', 'Fitter', 'Metal fabricator'], uz: ['Payvandchi', 'Montajchi', 'Metall konstruktor'] },
    color: '#8b5cf6',
    prop: 'welding',
    zone: [-7, 18],
  },
  {
    id: 'cooking',
    title: { en: 'Culinary Arts', uz: 'Oshpazlik' },
    label: { en: 'Culinary', uz: 'Oshpazlik' },
    short: { en: 'National and world cuisine', uz: 'Milliy va jahon taomlari' },
    desc: {
      en: 'Learn to cook national and international dishes, make pastry and run a kitchen in the training kitchen.',
      uz: "Milliy va xalqaro taomlar tayyorlash, qandolatchilik va oshxona boshqaruvini o'quv oshxonasida o'rganasiz.",
    },
    duration: null, // TODO
    form: FORM,
    seats: null, // TODO
    skills: {
      en: ['National dishes', 'Pastry', 'Food hygiene', 'Menu planning'],
      uz: ['Milliy taomlar', 'Qandolatchilik', 'Sanitariya qoidalari', 'Menyu tuzish'],
    },
    careers: { en: ['Cook', 'Pastry chef', 'Kitchen manager'], uz: ['Oshpaz', 'Qandolatchi', 'Oshxona boshlig‘i'] },
    color: '#10b981',
    prop: 'cooking',
    zone: [7, 18],
  },
  {
    id: 'tailoring',
    title: { en: 'Sewing and Garment Making', uz: 'Tikuvchilik' },
    label: { en: 'Sewing', uz: 'Tikuvchilik' },
    short: { en: 'Garment design and sewing', uz: 'Kiyim modellashtirish va tikish' },
    desc: {
      en: 'Learn pattern drafting, cutting, working on sewing machines and garment design.',
      uz: "Andoza chizish, bichish, tikuv mashinalarida ishlash va kiyim modellashtirishni o'rganasiz.",
    },
    duration: null, // TODO
    form: FORM,
    seats: null, // TODO
    skills: {
      en: ['Pattern drafting', 'Cutting', 'Sewing machines', 'Garment design'],
      uz: ['Andoza chizish', 'Bichish', 'Tikuv uskunalari', 'Modellashtirish'],
    },
    careers: { en: ['Tailor', 'Garment designer', 'Cutter'], uz: ['Tikuvchi', 'Modelyer', 'Bichuvchi'] },
    color: '#ec4899',
    prop: 'tailoring',
    zone: [20, 13],
  },
  {
    id: 'metal',
    title: { en: 'Metal Processing', uz: 'Metallarga qayta ishlov berish' },
    label: { en: 'Metal', uz: 'Metall' },
    short: { en: 'Turning and milling', uz: 'Tokarlik va frezerlash' },
    desc: {
      en: 'Learn to operate lathes and milling machines, use measuring tools and read technical drawings.',
      uz: "Tokarlik va frezerlash dastgohlarida ishlash, o'lchov asboblari va texnik chizmani o'qishni o'rganasiz.",
    },
    duration: null, // TODO
    form: FORM,
    seats: null, // TODO
    skills: {
      en: ['Lathe work', 'Milling', 'Measuring tools', 'Reading drawings'],
      uz: ['Tokarlik dastgohi', 'Frezerlash', 'O‘lchov asboblari', 'Chizma o‘qish'],
    },
    careers: { en: ['Turner', 'Milling operator', 'Machinist'], uz: ['Tokar', 'Frezerchi', 'Chilangar'] },
    color: '#0891b2',
    prop: 'metal',
    zone: [-31, 3],
  },
];

export const features = [
  // TODO: tekshiring
  { title: { en: 'Free education', uz: 'Bepul ta’lim' }, text: { en: 'Tuition is free under the state quota.', uz: "Davlat buyurtmasi asosida o'qish bepul." }, icon: 'gift' },
  {
    title: { en: 'Hands-on learning', uz: 'Amaliyotga yo‘naltirilgan' },
    text: { en: 'Most study time is spent in workshops and at companies.', uz: "O'quv vaqtining katta qismi ustaxona va korxonalarda o'tadi." },
    icon: 'wrench',
  },
  { title: { en: 'State diploma', uz: 'Davlat diplomi' }, text: { en: 'Graduates receive a state-recognised diploma.', uz: 'Bitiruvchilarga davlat namunasidagi diplom beriladi.' }, icon: 'award' },
  {
    title: { en: 'Job placement', uz: 'Ishga joylashtirish' },
    text: { en: 'We help graduates find jobs at partner companies.', uz: 'Hamkor korxonalar bilan bitiruvchilarni ishga joylashtiramiz.' },
    icon: 'briefcase',
  },
  { title: { en: 'Modern workshops', uz: 'Zamonaviy ustaxonalar' }, text: { en: 'Labs fitted with new equipment.', uz: 'Yangi uskunalar bilan jihozlangan laboratoriyalar.' }, icon: 'cpu' },
  {
    title: { en: 'Sports and clubs', uz: 'Sport va to‘garaklar' },
    text: { en: 'Sports teams, creative clubs and events.', uz: "Sport seksiyalari, ijodiy to'garaklar va tadbirlar." },
    icon: 'trophy',
  },
];

export const steps = [
  {
    title: { en: 'Choose a program', uz: 'Yo‘nalish tanlang' },
    text: { en: 'Explore the professions in the 3D campus.', uz: 'Sizga mos kasbni 3D kampusda o‘rganing.' },
    time: { en: 'June', uz: 'Iyun' },
  },
  { title: { en: 'Apply', uz: 'Ariza topshiring' }, text: { en: 'Online or at the admissions office.', uz: 'Onlayn yoki qabul komissiyasiga keling.' }, time: { en: 'July', uz: 'Iyul' } },
  {
    title: { en: 'Documents', uz: 'Hujjatlar' },
    text: { en: 'Passport, school certificate, 3×4 photos, medical certificate.', uz: 'Pasport, attestat, 3×4 rasm, tibbiy ma’lumotnoma.' },
    time: { en: 'July–August', uz: 'Iyul–Avgust' },
  },
  { title: { en: 'Interview', uz: 'Suhbat' }, text: { en: 'A short interview and the results.', uz: 'Qisqa suhbat va natijalar e’loni.' }, time: { en: 'August', uz: 'Avgust' } },
  {
    title: { en: 'Start studying', uz: 'O‘qishni boshlang' },
    text: { en: 'The school year starts on September 2.', uz: 'Yangi o‘quv yili 2-sentabrdan.' },
    time: { en: 'September', uz: 'Sentabr' },
  },
];

export const faqs = [
  {
    q: { en: 'Who can apply?', uz: "Kimlar o'qishga kira oladi?" },
    a: { en: 'Graduates of grades 9 and 11. Study is full-time or dual.', uz: "9 va 11-sinf bitiruvchilari. Ta'lim kunduzgi va dual shaklda olib boriladi." },
  },
  {
    // TODO
    q: { en: 'Do I have to pay tuition?', uz: "O'qish pullikmi?" },
    a: { en: 'Study is free under the state quota. Paid contract places are also available.', uz: "Davlat buyurtmasi asosida o'qish bepul. Kontrakt asosidagi o'rinlar ham mavjud." },
  },
  {
    q: { en: 'Which documents do I need?', uz: 'Qanday hujjatlar kerak?' },
    a: {
      en: 'Passport (or birth certificate), education certificate, six 3×4 photos and a form 086 medical certificate.',
      uz: "Pasport (yoki guvohnoma), ma'lumot hujjati, 3×4 o'lchamdagi 6 dona rasm, 086-shakldagi tibbiy ma'lumotnoma.",
    },
  },
  {
    q: { en: 'Can I go to university after graduating?', uz: 'Bitirgandan keyin oliygohga kirsa bo‘ladimi?' },
    a: { en: 'Yes, with the diploma you can apply to universities.', uz: "Ha, diplom bilan oliy ta'lim muassasalariga hujjat topshirish mumkin." },
  },
];

// Galereya: papka nomlari va rasm yozuvlarining inglizcha tarjimasi.
// Yozuv fayl nomidan olinadi (src/gallery/README.md). Bu yerda bo'lmasa, o'zbekcha nomi ko'rinadi.
export const galleryText = {
  folders: {
    tadbirlar: { en: 'Events', uz: 'Tadbirlar' },
    sport: { en: 'Sports', uz: 'Sport' },
    kampus: { en: 'Campus', uz: 'Kampus' },
  },
  captions: {
    'kompyuter-sinfi': { en: 'Computer classroom', uz: 'Kompyuter sinfi' },
    'moy-almashtirish-ustaxonasi': { en: 'Oil change workshop', uz: 'Moy almashtirish ustaxonasi' },
    'avtoservis-ustaxonasi': { en: 'Auto service workshop', uz: 'Avtoservis ustaxonasi' },
    'payvandlash-mashguloti': { en: 'Welding class', uz: 'Payvandlash mashg‘uloti' },
    'oshpazlik-xonasi': { en: 'Training kitchen', uz: 'Oshpazlik xonasi' },
    'tikuvchilik-ustaxonasi': { en: 'Sewing workshop', uz: 'Tikuvchilik ustaxonasi' },
    'tikuv-sexida-amaliyot': { en: 'Practice at a garment factory', uz: 'Tikuv sexida amaliyot' },
    'texnikum-talabalari': { en: 'Our students', uz: 'Texnikum talabalari' },
    sayohat: { en: 'Field trip', uz: 'Sayohat' },
    '9-may-xotira-va-qadrlash-kuni': { en: 'May 9, Day of Remembrance', uz: '9-may, Xotira va qadrlash kuni' },
    'bayram-tadbiri': { en: 'Celebration', uz: 'Bayram tadbiri' },
    uchrashuv: { en: 'Meeting with students', uz: 'Uchrashuv' },
    'stol-tennisi': { en: 'Table tennis', uz: 'Stol tennisi' },
    'futbol-jamoasi': { en: 'Football team', uz: 'Futbol jamoasi' },
    'andijon-viloyati-jamoasi': { en: 'Andijan region team', uz: 'Andijon viloyati jamoasi' },
  },
};
