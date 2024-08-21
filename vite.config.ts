import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

import dts from 'vite-plugin-dts';

import packageJson from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      outDir: './types',
    }),
  ],
  build: {
    lib: {
        entry: resolve(__dirname, 'src/dist.ts'),
        formats: ['es'],
    },
    rollupOptions: {
      external: [
        ...Object.keys(packageJson.peerDependencies),
        'react/jsx-runtime',
        '@mui/material/styles',
        'react-is',
        'object-assign',
        'prop-types',
      ],
    },
    
  },
  // optimizeDeps: {
  //   include: Object.keys(packageJson.peerDependencies),
  //   // include: [
  //   //   '@mui/material > @mui/system',
  //   // ]
  // }
  
})
