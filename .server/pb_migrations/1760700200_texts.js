/// <reference path="../pb_data/types.d.ts" />
// Saytda bosib tahrirlangan matnlar (?edit=1). key: "ui.heroTitle" yoki "professions.2.title".
// Bo'sh qiymat = asl matn (src/data.js, src/i18n.js) ishlatiladi.
migrate(
  (app) => {
    app.save(
      new Collection({
        type: 'base',
        name: 'texts',
        listRule: '',
        viewRule: '',
        fields: [
          { name: 'key', type: 'text', required: true, max: 120 },
          { name: 'en', type: 'text', max: 20000 },
          { name: 'uz', type: 'text', max: 20000 },
          { name: 'created', type: 'autodate', onCreate: true },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE UNIQUE INDEX idx_texts_key ON texts (key)'],
      }),
    );
  },
  (app) => app.delete(app.findCollectionByNameOrId('texts')),
);
