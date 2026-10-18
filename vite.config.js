import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { imagetools } from 'vite-imagetools';
import { UI } from './src/ui-text.js';

const SITE = 'https://texnikum2son.com';
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

// Build tayyorlagan index.html dan o'zbekcha nusxa: dist/uz/index.html.
// Sarlavha, tavsif va index.html dagi data-i18n matnlari oldindan o'zbekcha yoziladi,
// shunda Google /uz/ sahifani o'zbekcha qidiruvlarda ko'rsatadi.
function uzPage() {
  return {
    name: 'uz-page',
    apply: 'build',
    async writeBundle({ dir }) {
      const uz = (key) => {
        const v = UI[key]?.uz;
        if (typeof v !== 'string') throw new Error(`uz-page: "${key}" uchun o'zbekcha matn yo'q`);
        return v;
      };
      let html = await readFile(join(dir, 'index.html'), 'utf8');
      const swap = (from, to) => {
        if (!html.includes(from)) throw new Error(`uz-page: index.html da topilmadi: ${from}`);
        html = html.replace(from, to);
      };
      swap('<html lang="en">', '<html lang="uz">');
      swap(`<link rel="canonical" href="${SITE}/" />`, `<link rel="canonical" href="${SITE}/uz/" />`);
      swap(`<meta property="og:url" content="${SITE}/" />`, `<meta property="og:url" content="${SITE}/uz/" />`);
      swap('<meta property="og:locale" content="en_US" />', '<meta property="og:locale" content="uz_UZ" />');
      swap('<meta property="og:locale:alternate" content="uz_UZ" />', '<meta property="og:locale:alternate" content="en_US" />');
      html = html.replace(/<title>[^<]*<\/title>/, `<title>${uz('metaTitle')}</title>`);
      html = html.replace(/<[a-z][^>]*\bdata-i18n-(content|aria)="(\w+)"[^>]*>/g, (tag, kind, key) =>
        tag.replace(kind === 'content' ? /(?<![\w-])content="[^"]*"/ : /(?<![\w-])aria-label="[^"]*"/, (a) => `${a.split('=')[0]}="${attr(uz(key))}"`),
      );
      html = html.replace(/(<(\w+)\b[^>]*\bdata-i18n="(\w+)"[^>]*>)[\s\S]*?(<\/\2>)/g, (_, open, tag, key, close) => open + uz(key) + close);
      await mkdir(join(dir, 'uz'), { recursive: true });
      await writeFile(join(dir, 'uz', 'index.html'), html);
    },
  };
}

export default defineConfig({
  // "/" — /uz/ sahifasi ham bir xil /assets/ fayllarini ishlatadi
  base: '/',
  plugins: [tailwindcss(), imagetools(), uzPage()],
  // Lokal sinov: admin panel serveri (PocketBase) 8095-portda ishlayotgan bo'lsa
  server: { proxy: { '/api': 'http://127.0.0.1:8095' } },
  preview: { proxy: { '/api': 'http://127.0.0.1:8095' } },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      input: { main: 'index.html', admin: 'admin/index.html' },
      output: { manualChunks: (id) => (id.includes('node_modules/three') ? 'three' : undefined) },
    },
  },
});
