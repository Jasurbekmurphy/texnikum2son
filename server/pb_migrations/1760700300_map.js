/// <reference path="../pb_data/types.d.ts" />
// Sozlamalarga xarita maydoni: koordinata, Google Maps havolasi yoki joylashtirish kodi
migrate(
  (app) => {
    const settings = app.findCollectionByNameOrId('settings');
    settings.fields.add(new TextField({ name: 'map', max: 3000 }));
    app.save(settings);
  },
  (app) => {
    const settings = app.findCollectionByNameOrId('settings');
    settings.fields.removeByName('map');
    app.save(settings);
  },
);
