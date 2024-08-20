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
        '@mui/core-downloads-tracker',
        '@mui/private-theming',
        '@mui/styled-engine',
        '@mui/system',
        '@mui/utils',
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
