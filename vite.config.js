import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  base: './',
  plugins: [tailwindcss(), imagetools()],
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
