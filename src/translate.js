// Matnlarni tarjima qilish (admin panel va saytda tahrirlash uchun).
// Avval adminning o'z brauzeridan Google Translate'ga so'raymiz: server IP manzilini
// Google bloklashi mumkin, uy/ish internetini esa odatda bloklamaydi.
// Bo'lmasa server orqali (/api/translate, server/pb_hooks/translate.pb.js).
const GTX = 'https://translate.googleapis.com/translate_a/single';

// Uzun matn abzats va gaplar bo'yicha bo'laklarga bo'linadi (URL uzunligi cheklangan)
function chunks(text, size = 1200) {
  const out = [];
  for (const para of text.split(/(\n+)/)) {
    if (para.length <= size) {
      out.push(para);
      continue;
    }
    let cur = '';
    for (const s of para.split(/(?<=[.!?])\s+/)) {
      if (cur && `${cur} ${s}`.length > size) {
        out.push(cur);
        cur = s;
      } else cur = cur ? `${cur} ${s}` : s;
    }
    if (cur) out.push(cur);
  }
  return out;
}

async function viaBrowser(text, from, to) {
  const parts = await Promise.all(
    chunks(text).map(async (c) => {
      if (!c.trim()) return c;
      const res = await fetch(`${GTX}?client=gtx&dt=t&sl=${from}&tl=${to}&q=${encodeURIComponent(c)}`, {
        signal: AbortSignal.timeout(15000),
      });
      const data = await res.json();
      if (!Array.isArray(data?.[0])) throw new Error('google');
      return data[0].map((seg) => seg[0] || '').join('');
    }),
  );
  return parts.join('');
}

async function viaServer(texts, from, to, token) {
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, texts }),
  });
  if (!res.ok) throw new Error(`translate ${res.status}`);
  return (await res.json()).texts;
}

// Tarjima qilingan matnlar ro'yxati; hech biri ishlamasa xato tashlaydi
export async function translate(texts, from, to, token) {
  try {
    return await Promise.all(texts.map((t) => (t.trim() ? viaBrowser(t, from, to) : t)));
  } catch {
    return viaServer(texts, from, to, token);
  }
}
