import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  base: './',
  plugins: [tailwindcss(), imagetools()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: { manualChunks: (id) => (id.includes('node_modules/three') ? 'three' : undefined) },
    },
  },
});
