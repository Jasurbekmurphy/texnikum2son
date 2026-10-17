/// <reference path="../pb_data/types.d.ts" />
// Server sozlamalari: nom, manzil, kirishga urinishlarni cheklash.
migrate((app) => {
  const s = app.settings();
  s.meta.appName = 'texnikum2son.com';
  s.meta.appURL = 'https://texnikum2son.com';
  // nginx orqali keladi: haqiqiy IP shu sarlavhada (urinishlarni cheklash uchun kerak)
  s.trustedProxy.headers = ['X-Real-IP'];
  s.rateLimits.enabled = true;
  app.save(s);
});
