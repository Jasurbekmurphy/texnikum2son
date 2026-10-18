/// <reference path="../pb_data/types.d.ts" />
// POST /api/translate  { from: "uz", to: "en", texts: ["..."] } → { texts: ["..."] }
// Faqat adminlar uchun. Tartib: Google Cloud (kalit bo'lsa) → Google bepul → MyMemory.
// Kalit: /opt/texnikum-pb/.env faylida GOOGLE_TRANSLATE_KEY=...
routerAdd(
  'POST',
  '/api/translate',
  (e) => {
    const body = e.requestInfo().body || {};
    const langs = ['uz', 'en', 'ru'];
    const from = String(body.from || 'uz');
    const to = String(body.to || 'en');
    const texts = Array.isArray(body.texts) ? body.texts.map((t) => String(t ?? '')) : [];
    if (!langs.includes(from) || !langs.includes(to) || from === to) throw new BadRequestError('Til noto‘g‘ri');
    if (!texts.length || texts.length > 100 || texts.join('').length > 30000) throw new BadRequestError('Matn juda ko‘p');

    // Uzun matnni abzats va gaplar bo'yicha bo'laklarga ajratamiz
    const chunks = (text, size) => {
      const out = [];
      for (const para of text.split(/(\n+)/)) {
        if (para.length <= size) {
          out.push(para);
          continue;
        }
        let cur = '';
        for (const s of para.split(/(?<=[.!?])\s+/)) {
          if (cur && (cur + ' ' + s).length > size) {
            out.push(cur);
            cur = s;
          } else cur = cur ? cur + ' ' + s : s;
        }
        if (cur) out.push(cur);
      }
      return out;
    };
    const each = (text, size, one) =>
      chunks(text, size)
        .map((c) => (c.trim() ? one(c) : c))
        .join('')
        .replace(/ +\n/g, '\n');

    const providers = [];
    const key = $os.getenv('GOOGLE_TRANSLATE_KEY');
    if (key) {
      providers.push((list) => {
        const res = $http.send({
          url: 'https://translation.googleapis.com/language/translate/v2?key=' + encodeURIComponent(key),
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ q: list, source: from, target: to, format: 'text' }),
          timeout: 30,
        });
        if (res.statusCode !== 200) throw new Error('google-cloud ' + res.statusCode);
        return res.json.data.translations.map((t) => t.translatedText);
      });
    }
    const gtx = $os.getenv('TRANSLATE_GTX_URL') || 'https://translate.googleapis.com/translate_a/single';
    providers.push((list) =>
      list.map((text) =>
        each(text, 1500, (c) => {
          const res = $http.send({
            url: gtx + '?client=gtx&dt=t&sl=' + from + '&tl=' + to + '&q=' + encodeURIComponent(c),
            timeout: 20,
          });
          if (res.statusCode !== 200 || !Array.isArray(res.json?.[0])) throw new Error('google ' + res.statusCode);
          return res.json[0].map((seg) => seg[0] || '').join('');
        }),
      ),
    );
    providers.push((list) =>
      list.map((text) =>
        each(text, 450, (c) => {
          const res = $http.send({
            url: 'https://api.mymemory.translated.net/get?langpair=' + from + '|' + to + '&q=' + encodeURIComponent(c),
            timeout: 20,
          });
          const out = res.json?.responseData?.translatedText;
          if (res.statusCode !== 200 || !out || res.json.responseStatus != 200) throw new Error('mymemory ' + res.statusCode);
          return out;
        }),
      ),
    );

    const errors = [];
    for (const translate of providers) {
      try {
        return e.json(200, { texts: translate(texts) });
      } catch (err) {
        errors.push(String(err));
      }
    }
    $app.logger().warn('translate failed', 'errors', errors.join('; '));
    return e.json(502, { message: 'Tarjima xizmati javob bermadi' });
  },
  $apis.requireSuperuserAuth(),
);
