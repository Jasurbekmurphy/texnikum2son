# Galereya rasmlari

Rasm yoki qisqa videoni shu papkaga tashlang, sayt uni o'zi topadi. Kod yozish shart emas.

- Rasmlar: `.jpg`, `.jpeg`, `.png`, `.webp`. Build paytida avtomatik kichraytiriladi (webp), telefondagi katta rasmlar ham bo'laveradi.
- Videolar: `.mp4` yoki `.webm`, 5–15 soniya, ovozsiz yaxshi (sahifada ovozsiz aylanib turadi). Hajmi 10 MB dan oshmasin.
- Fayl nomi rasm ostidagi yozuv bo'ladi: `payvand-ustaxonasi.jpg` → "Payvand ustaxonasi". Oxiridagi raqamlar tashlab yuboriladi (`darsda-2.jpg` → "Darsda").
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

Papkaga rasm qo'shgach `npm run build` qiling va `dist` papkasini Netlify'ga yuklang.
Papkada birorta rasm bo'lmasa, Galereya bo'limi saytda ko'rinmaydi.
