// ============================================================
//  SAYT MA'LUMOTLARI — barcha matnlarni shu fayldan o'zgartiring.
//  "TODO" deb belgilangan joylarni texnikumning haqiqiy
//  ma'lumotlari bilan almashtiring.
// ============================================================

export const site = {
  shortName: 'Paxtaobod 2-son texnikumi',
  fullName: 'Paxtaobod tuman 2-son texnikumi',
  domain: 'texnikum2son.com',
  slogan: "Kasbiy ta'lim, dual ta'lim va amaliy ko'nikmalar",
  phone: '+998 55 201 26 65',
  email: 'info@texnikum2son.com',
  address: "Andijon viloyati, Paxtaobod tumani, Shovruq MFY, Chamanzor ko'chasi",
  workHours: 'Dush–Juma, 08:30–17:00', // TODO: tekshiring
  telegram: 'https://t.me/texnikum2son',
  instagram: 'https://www.instagram.com/paxtaobod_2son_texnikumi',
  // Google Maps → Ulashish → Xaritani joylashtirish → src manzili
  mapEmbed: '', // TODO
  admission: {
    open: true,
    deadline: '25-avgust', // TODO: tekshiring
    applyUrl: 'https://my.edu.uz', // TODO: hujjat topshirish havolasi
  },
};

// Manba: texnikum2son.com (2026-yil oktabr)
export const stats = [
  { value: 610, suffix: '', label: "O'quvchilar", note: 'kunduzgi va dual' },
  { value: 90, suffix: '%', label: 'Ishga joylashish', note: 'bitiruvchilar' },
  { value: 80, suffix: '+', label: 'Korxonalar', note: 'bilan shartnoma' },
  { value: 79, suffix: '', label: 'Xodimlar', note: '28 pedagog, 17 usta' },
  { value: 7, suffix: '', label: "Yo'nalishlar", note: 'zamonaviy kasblar' },
  { value: 65, suffix: '', label: 'Kompyuterlar', note: 'IT sinflarda' },
];

// Dual ta'lim: nazariya texnikumda, amaliyot korxonada
export const dual = [
  { title: 'Nazariy ta’lim', text: 'Malakali pedagoglar bilan auditoriya va raqamli sinflarda.' },
  { title: 'Ustaxonada mashq', text: '17 nafar ishlab chiqarish ta’limi ustasi rahbarligida.' },
  { title: 'Korxonada amaliyot', text: 'Hamkor korxonalarda haqiqiy ish jarayoni.' },
  { title: 'Diplom va ish', text: 'Bitiruvchilar diplom bilan birga ish tajribasiga ega bo‘ladi.' },
];

// Manba: texnikum2son.com
export const metrics = [
  { label: 'Ishga joylashish', value: 90 },
  { label: 'Dual ta’lim qamrovi', value: 85 },
  { label: 'Ustaxonalar jihozlanishi', value: 88 },
  { label: 'Raqamli sinflar', value: 92 },
];

// zone: [x, z] — 3D kampusdagi ustaxona joylashuvi (o'zgartirmang)
// prop: 3D sahnadagi ustaxona belgisi turi
// label: 3D kampusdagi qisqa nom. duration/seats: noma'lum bo'lsa null qoldiring (sahifada ko'rinmaydi).
export const professions = [
  {
    id: 'it',
    title: 'Raqamli axborotlarni qayta ishlash',
    label: 'Raqamli',
    short: 'Kompyuter, ofis dasturlari va ma’lumotlar',
    desc: "Kompyuter savodxonligi, ofis dasturlari, ma'lumotlar bazasi va grafik dizayn asoslarini 65 ga yaqin kompyuterli sinflarda o'rganasiz.",
    duration: null, // TODO
    form: 'Kunduzgi · Dual',
    seats: null, // TODO
    skills: ['Ofis dasturlari', 'Ma’lumotlar bazasi', 'Grafik dizayn', 'Kompyuter yig‘ish'],
    careers: ['Operator', 'Kompyuter mutaxassisi', 'Dizayner yordamchisi'],
    color: '#2563eb',
    prop: 'it',
    zone: [-19, -5],
  },
  {
    id: 'housing',
    title: 'Turar joy servisi ustasi',
    label: 'Servis',
    short: 'Santexnika, elektr va pardozlash',
    desc: "Turar-joy binolarida santexnika, elektr montaj va pardozlash ishlarini bajarish, uy-joyni saqlashni o'rganasiz.",
    duration: null, // TODO
    form: 'Kunduzgi · Dual',
    seats: null, // TODO
    skills: ['Elektr montaj', 'Santexnika', 'Pardozlash', 'Xavfsizlik texnikasi'],
    careers: ['Uy-joy ustasi', 'Elektrik', 'Santexnik'],
    color: '#f59e0b',
    prop: 'housing',
    zone: [19, -5],
  },
  {
    id: 'auto',
    title: "Avtomobillarga texnik xizmat ko'rsatish",
    label: 'Avtoservis',
    short: 'Diagnostika va ta’mirlash',
    desc: "Dvigatel, transmissiya va elektr jihozlarini diagnostika qilish hamda ta'mirlashni avtoustaxonada o'rganasiz.",
    duration: null, // TODO
    form: 'Kunduzgi · Dual',
    seats: null, // TODO
    skills: ['Kompyuter diagnostikasi', 'Dvigatel ta‘miri', 'Yurish qismi', 'Avtoelektrika'],
    careers: ['Avtomexanik', 'Diagnost', 'Avtoelektrik'],
    color: '#ef4444',
    prop: 'auto',
    zone: [-20, 13],
  },
  {
    id: 'welding',
    title: 'Payvandchilik',
    label: 'Payvand',
    short: 'Elektr va gaz payvandlash',
    desc: "Metall konstruksiyalarni turli usullarda payvandlash, chizmalarni o'qish va chok sifatini nazorat qilishni o'rganasiz.",
    duration: null, // TODO
    form: 'Kunduzgi · Dual',
    seats: null, // TODO
    skills: ['Elektr payvand', 'Gaz payvand', 'Chizma o‘qish', 'Metall kesish'],
    careers: ['Payvandchi', 'Montajchi', 'Metall konstruktor'],
    color: '#8b5cf6',
    prop: 'welding',
    zone: [-7, 18],
  },
  {
    id: 'cooking',
    title: 'Oshpazlik',
    label: 'Oshpazlik',
    short: 'Milliy va jahon taomlari',
    desc: "Milliy va xalqaro taomlar tayyorlash, qandolatchilik va oshxona boshqaruvini o'quv oshxonasida o'rganasiz.",
    duration: null, // TODO
    form: 'Kunduzgi · Dual',
    seats: null, // TODO
    skills: ['Milliy taomlar', 'Qandolatchilik', 'Sanitariya qoidalari', 'Menyu tuzish'],
    careers: ['Oshpaz', 'Qandolatchi', 'Oshxona boshlig‘i'],
    color: '#10b981',
    prop: 'cooking',
    zone: [7, 18],
  },
  {
    id: 'tailoring',
    title: 'Tikuvchilik',
    label: 'Tikuvchilik',
    short: 'Kiyim modellashtirish va tikish',
    desc: "Andoza chizish, bichish, tikuv mashinalarida ishlash va kiyim modellashtirishni o'rganasiz.",
    duration: null, // TODO
    form: 'Kunduzgi · Dual',
    seats: null, // TODO
    skills: ['Andoza chizish', 'Bichish', 'Tikuv uskunalari', 'Modellashtirish'],
    careers: ['Tikuvchi', 'Modelyer', 'Bichuvchi'],
    color: '#ec4899',
    prop: 'tailoring',
    zone: [20, 13],
  },
  {
    id: 'metal',
    title: 'Metallarga qayta ishlov berish',
    label: 'Metall',
    short: 'Tokarlik va frezerlash',
    desc: "Tokarlik va frezerlash dastgohlarida ishlash, o'lchov asboblari va texnik chizmani o'qishni o'rganasiz.",
    duration: null, // TODO
    form: 'Kunduzgi · Dual',
    seats: null, // TODO
    skills: ['Tokarlik dastgohi', 'Frezerlash', 'O‘lchov asboblari', 'Chizma o‘qish'],
    careers: ['Tokar', 'Frezerchi', 'Chilangar'],
    color: '#0891b2',
    prop: 'metal',
    zone: [-31, 3],
  },
];

export const features = [
  { title: 'Bepul ta’lim', text: "Davlat buyurtmasi asosida o'qish bepul.", icon: 'gift' }, // TODO: tekshiring
  { title: 'Amaliyotga yo‘naltirilgan', text: "O'quv vaqtining katta qismi ustaxona va korxonalarda o'tadi.", icon: 'wrench' },
  { title: 'Davlat diplomi', text: "Bitiruvchilarga davlat namunasidagi diplom beriladi.", icon: 'award' },
  { title: 'Ishga joylashtirish', text: "Hamkor korxonalar bilan bitiruvchilarni ishga joylashtiramiz.", icon: 'briefcase' },
  { title: 'Zamonaviy ustaxonalar', text: "Yangi uskunalar bilan jihozlangan laboratoriyalar.", icon: 'cpu' },
  { title: 'Sport va to‘garaklar', text: "Sport seksiyalari, ijodiy to'garaklar va tadbirlar.", icon: 'trophy' },
];

export const steps = [
  { title: 'Yo‘nalish tanlang', text: 'Sizga mos kasbni 3D kampusda o‘rganing.', time: 'Iyun' },
  { title: 'Ariza topshiring', text: 'Onlayn yoki qabul komissiyasiga keling.', time: 'Iyul' },
  { title: 'Hujjatlar', text: 'Pasport, attestat, 3×4 rasm, tibbiy ma’lumotnoma.', time: 'Iyul–Avgust' },
  { title: 'Suhbat', text: 'Qisqa suhbat va natijalar e’loni.', time: 'Avgust' },
  { title: 'O‘qishni boshlang', text: 'Yangi o‘quv yili 2-sentabrdan.', time: 'Sentabr' },
];

export const faqs = [
  { q: "Kimlar o'qishga kira oladi?", a: "9 va 11-sinf bitiruvchilari. Ta'lim kunduzgi va dual shaklda olib boriladi." },
  { q: "O'qish pullikmi?", a: "Davlat buyurtmasi asosida o'qish bepul. Kontrakt asosidagi o'rinlar ham mavjud." }, // TODO
  { q: 'Qanday hujjatlar kerak?', a: "Pasport (yoki guvohnoma), ma'lumot hujjati, 3×4 o'lchamdagi 6 dona rasm, 086-shakldagi tibbiy ma'lumotnoma." },
  { q: 'Yotoqxona bormi?', a: "Ha, boshqa hududlardan kelgan o'quvchilar uchun yotoqxona mavjud." }, // TODO
  { q: 'Bitirgandan keyin oliygohga kirsa bo‘ladimi?', a: "Ha, diplom bilan oliy ta'lim muassasalariga hujjat topshirish mumkin." },
];
