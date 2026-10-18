# texnikum2son.com — 3D interaktiv sayt

Three.js + Tailwind CSS + Vite asosidagi landing sahifa. Bosh ekranda 3D izometrik kampus joylashgan: har bir kasbning o'z ustaxonasi bor, ularni bosish yoki pastki paneldan tanlash mumkin.

## Ishga tushirish

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # tayyor sayt dist/ papkasida
npm run preview   # build natijasini ko'rish
```

## Contabo serverga joylash (texnikum2son.com)

`main` branchiga har push qilinganda GitHub Actions saytni build qiladi va tayyor fayllarni **`dist`** branchiga yozadi. Server faqat shu branchni oladi, unda Node.js kerak emas.

**1. Serverni tayyorlash** (Ubuntu/Debian, `ssh root@SERVER_IP`):
```bash
apt update && apt install -y nginx git certbot python3-certbot-nginx
git clone --depth 1 -b dist https://github.com/Jasurbekmurphy/texnikum2son.git /var/www/texnikum2son
curl -fsSL https://raw.githubusercontent.com/Jasurbekmurphy/texnikum2son/main/deploy/nginx.conf -o /etc/nginx/sites-available/texnikum2son
ln -sf /etc/nginx/sites-available/texnikum2son /etc/nginx/sites-enabled/texnikum2son
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
ufw allow 'Nginx Full' 2>/dev/null || true
```

**2. Squarespace → DNS Settings:** `@` va `www` uchun eski A/CNAME yozuvlarini o'chirib, quyidagilarni qo'shing (MX va TXT yozuvlariga tegmang, ular Google Workspace pochtasi uchun):

| Type | Host | Value |
|---|---|---|
| A | @ | SERVER_IP |
| A | www | SERVER_IP |

**3. HTTPS** (DNS serverga qarab bo'lgach, `ping texnikum2son.com` server IP'sini ko'rsatsa):
```bash
certbot --nginx -d texnikum2son.com -d www.texnikum2son.com --redirect -m info@texnikum2son.com --agree-tos -n
```

**Saytni yangilash** (kodni GitHub'ga push qilgandan 1–2 daqiqa keyin):
```bash
bash /var/www/texnikum2son/deploy-update.sh
```

## Admin panel (https://texnikum2son.com/admin/)

Kod yozmasdan: qabulni ochish/yopish, aloqa ma'lumotlari, yangiliklar va galereyaga rasm/video yuklash. O'zgarishlar saytda darhol ko'rinadi. Ma'lumotlar serverdagi PocketBase'da saqlanadi (`/opt/texnikum-pb`), sayt ularni `/api` orqali o'qiydi. Server javob bermasa, sayt `src/data.js` dagi ma'lumotlar bilan ishlayveradi.

**O'rnatish** (bir marta, serverda):
```bash
bash /var/www/texnikum2son/deploy-update.sh
bash /var/www/texnikum2son/setup-admin.sh
```
Skript PocketBase'ni o'rnatadi, `texnikum-pb` xizmatini yoqadi, nginx'ga `/api` va `/_/` ni qo'shadi va admin email/parolini so'raydi.

- Yana admin qo'shish yoki parolni almashtirish: `sudo -u pocketbase /opt/texnikum-pb/pocketbase superuser upsert EMAIL PAROL --dir=/opt/texnikum-pb/pb_data`
- Zaxira nusxa: https://texnikum2son.com/_/ → Settings → Backups (yoki `/opt/texnikum-pb/pb_data` papkasini nusxalang)
- Jadvallar tuzilishi: `server/pb_migrations/`, server kodi (tarjima): `server/pb_hooks/` (sayt yangilanganda serverga o'zi ko'chiriladi)
- Avto-tarjima (o'zbekcha → inglizcha) bepul Google Translate orqali ishlaydi. U ishlamay qolsa, Google Cloud Translation kalitini `/opt/texnikum-pb/.env` ga `GOOGLE_TRANSLATE_KEY=...` qilib yozing va `systemctl restart texnikum-pb` qiling
- Holatini ko'rish: `systemctl status texnikum-pb`, jurnal: `journalctl -u texnikum-pb -n 50`

## Ma'lumotlarni o'zgartirish

Barcha matnlar bitta faylda: **`src/data.js`**. Asosiy ma'lumotlar (nom, aloqa, 7 yo'nalish, xodimlar, ko'rsatkichlar) texnikum2son.com dan olingan. `TODO` bilan belgilangan joylarni haqiqiy ma'lumotlar bilan almashtiring:

- `site`: nom, telefon, email, manzil, Telegram/Instagram, xarita (`map`), qabul havolasi
- `stats`: raqamlar (o'quvchilar soni, ishga joylashish foizi...)
- `professions`: yo'nalishlar (nomi, tavsifi, muddat, o'rinlar, ko'nikmalar)
- `features`, `steps`, `faqs`: afzalliklar, qabul bosqichlari, savollar
- `dual`, `metrics`: dual ta'lim bosqichlari va ko'rsatkichlar
- `galleryText`: galereya yozuvlari va bo'lim nomlarining tarjimasi

## Ikki til (EN / UZ)

Sayt asosan inglizcha ochiladi, sarlavhadagi **EN / UZ** tugmasi o'zbekchaga o'tkazadi (tanlov eslab qolinadi). O'zbekcha sahifa alohida manzilda: `https://texnikum2son.com/uz/` (build uni `index.html` dan o'zbekcha matnlar bilan tayyorlaydi, Google uni o'zbekcha qidiruvda ko'rsatadi).

- `src/data.js` dagi har bir matn `{ en: '...', uz: '...' }` ko'rinishida: ikkala tilni yonma-yon o'zgartiring.
- Tugmalar, sarlavhalar va boshqa interfeys matnlari: `src/ui-text.js` (`UI` lug'ati).

## Tuzilishi

```
index.html            sahifa tuzilishi (Tailwind klasslari)
src/main.js           UI: panellar, belgilar, sayohat rejimi, animatsiyalar
src/data.js           kontent (en/uz)
src/i18n.js           til tanlash va interfeys matnlari
src/content.js        admin paneldan keladigan jonli ma'lumotlar
src/news.js           Yangiliklar bo'limi
src/admin.js, admin/  admin panel sahifasi
server/pb_migrations  admin panel jadvallari (PocketBase)
src/scene/campus.js   3D sahna, kamera, yorug'lik, harakatlar
src/scene/workshops.js har bir kasb ustaxonasi (3D)
src/scene/kit.js      3D bloklar (box, daraxt, odam, yozuvlar)
```

## Imkoniyatlar

- 3D kampus: ustaxonani bosish → kamera uchib boradi, o'ngda batafsil panel ochiladi
- "Kampus bo'ylab sayohat": yo'nalishlarni avtomatik ko'rsatadi
- Jonli sahna: yuruvchi o'quvchilar, avtobus, hilpirayotgan bayroq, payvand uchqunlari, bug', lift
- Galereya: `src/gallery/` papkasiga rasm yoki video tashlang (batafsil: `src/gallery/README.md`)
- `#kasb-auto` kabi havola bilan to'g'ridan-to'g'ri yo'nalishni ulashish mumkin
- Mobil uchun moslashgan (bottom-sheet panel, sahifa barmoq bilan bemalol aylanadi)
- `prefers-reduced-motion` qo'llab-quvvatlanadi; WebGL bo'lmasa sayt 3D'siz ishlaydi
- Ko'rinmay qolganda 3D render to'xtaydi (batareya tejaladi)

## Hostingga joylash

`npm run build` → `dist/` papkasini hostingga yuklang (cPanel, Netlify, Vercel, Cloudflare Pages yoki GitHub Pages).
