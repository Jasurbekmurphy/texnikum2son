# Galereya rasmlari

Rasm yoki qisqa videoni shu papkaga tashlang, sayt uni o'zi topadi. Kod yozish shart emas.

- Rasmlar: `.jpg`, `.jpeg`, `.png`, `.webp`. Build paytida avtomatik kichraytiriladi (webp), telefondagi katta rasmlar ham bo'laveradi.
- Videolar: `.mp4` yoki `.webm`, 5–15 soniya, ovozsiz yaxshi (sahifada ovozsiz aylanib turadi). Hajmi 10 MB dan oshmasin.
- Fayl nomi rasm ostidagi yozuv bo'ladi: `payvand-ustaxonasi.jpg` → "Payvand ustaxonasi". Oxiridagi raqamlar tashlab yuboriladi (`darsda-2.jpg` → "Darsda").
- Ingliz tilidagi yozuvni `src/data.js` → `galleryText.captions` ga qo'shing (kalit: raqamsiz fayl nomi, masalan `'payvand-ustaxonasi': { en: 'Welding workshop', uz: 'Payvand ustaxonasi' }`). Qo'shilmasa, ikkala tilda fayl nomi ko'rinadi.
- Papka nomi bo'lim (filtr) bo'ladi. Yo'nalish papkalari 3D kampusdagi o'sha ustaxona panelida ham chiqadi:

| Papka | Bo'lim |
|---|---|
| `it/` | IT va raqamli axborotlar |
| `housing/` | Turar joy servisi |
| `auto/` | Avtoservis |
| `welding/` | Payvandchilik |
| `cooking/` | Oshpazlik |
| `tailoring/` | Tikuvchilik |
| `metal/` | Metallga ishlov berish |
| boshqa har qanday nom, masalan `tadbirlar/`, `kampus/` | "Tadbirlar", "Kampus" |

Papkaga rasm qo'shib GitHub'ga push qiling: CI saytni yig'adi, serverda `bash /var/www/texnikum2son/deploy-update.sh` ni ishga tushiring.
Papkada birorta rasm bo'lmasa, Galereya bo'limi saytda ko'rinmaydi.
