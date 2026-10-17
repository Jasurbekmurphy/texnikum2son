/// <reference path="../pb_data/types.d.ts" />
// Admin panel jadvallari: sozlamalar (qabul, aloqa), yangiliklar, galereya.
// Hammasi saytda ochiq o'qiladi, yozish faqat adminlarga (superuser) ruxsat.

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const VIDEO_TYPES = ['video/mp4', 'video/webm'];
const stamps = [
  { name: 'created', type: 'autodate', onCreate: true },
  { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
];
const text = (name, max = 300) => ({ name, type: 'text', max });

migrate(
  (app) => {
    const settings = new Collection({
      type: 'base',
      name: 'settings',
      listRule: '',
      viewRule: '',
      fields: [
        { name: 'admission_open', type: 'bool' },
        text('deadline_en'),
        text('deadline_uz'),
        text('apply_url'),
        text('phone'),
        text('email'),
        text('address_en'),
        text('address_uz'),
        text('hours_en'),
        text('hours_uz'),
        text('telegram'),
        text('instagram'),
        ...stamps,
      ],
    });
    app.save(settings);

    const record = new Record(settings);
    const seed = {
      admission_open: false,
      deadline_en: 'August 25',
      deadline_uz: '25-avgust',
      apply_url: 'https://my.edu.uz',
      phone: '+998 55 201 26 65',
      email: 'info@texnikum2son.com',
      address_en: 'Chamanzor Street, Shovruq MFY, Paxtaobod district, Andijan region',
      address_uz: "Andijon viloyati, Paxtaobod tumani, Shovruq MFY, Chamanzor ko'chasi",
      hours_en: 'Mon–Fri, 08:30–17:00',
      hours_uz: 'Dush–Juma, 08:30–17:00',
      telegram: 'https://t.me/texnikum2son',
      instagram: 'https://www.instagram.com/paxtaobod_2son_texnikumi',
    };
    for (const [k, v] of Object.entries(seed)) record.set(k, v);
    app.save(record);

    app.save(
      new Collection({
        type: 'base',
        name: 'news',
        listRule: 'published = true',
        viewRule: 'published = true',
        fields: [
          { ...text('title_uz'), required: true },
          text('title_en'),
          text('body_uz', 20000),
          text('body_en', 20000),
          { name: 'date', type: 'date', required: true },
          { name: 'image', type: 'file', maxSelect: 1, maxSize: 15 * 1024 * 1024, mimeTypes: IMAGE_TYPES, thumbs: ['800x0'] },
          { name: 'published', type: 'bool' },
          ...stamps,
        ],
        indexes: ['CREATE INDEX idx_news_date ON news (date)'],
      }),
    );

    app.save(
      new Collection({
        type: 'base',
        name: 'gallery',
        listRule: 'published = true',
        viewRule: 'published = true',
        fields: [
          {
            name: 'file',
            type: 'file',
            required: true,
            maxSelect: 1,
            maxSize: 50 * 1024 * 1024,
            mimeTypes: [...IMAGE_TYPES, ...VIDEO_TYPES],
            thumbs: ['800x0'],
          },
          { name: 'category', type: 'text', required: true, max: 40 },
          text('caption_uz'),
          text('caption_en'),
          // Kartochka o'lchami uchun (admin panel yuklashda o'zi aniqlaydi)
          { name: 'width', type: 'number', onlyInt: true, min: 0 },
          { name: 'height', type: 'number', onlyInt: true, min: 0 },
          { name: 'published', type: 'bool' },
          ...stamps,
        ],
      }),
    );
  },
  (app) => {
    for (const name of ['gallery', 'news', 'settings']) app.delete(app.findCollectionByNameOrId(name));
  },
);
