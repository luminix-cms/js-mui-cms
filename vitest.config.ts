import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@luminix/react': resolve(__dirname, 'node_modules/@luminix/react/dist/react.js'),
            '@luminix/core': resolve(__dirname, 'node_modules/@luminix/core/dist/core.js'),
            '@luminix/support': resolve(__dirname, 'node_modules/@luminix/support/dist/support.js'),
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/__tests__/setup.ts'],
        coverage: {
            provider: 'v8',
        },
    },
});
