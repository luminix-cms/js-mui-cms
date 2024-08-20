import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    lib: {
        entry: resolve(__dirname, 'src/main.tsx'),
        formats: ['es'],
    },
    outDir: './bundle',
    emptyOutDir: true,
  },
  define: {
    'process.env': process.env
  }

});
