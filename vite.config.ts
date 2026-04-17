import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    conditions: ['import', 'module', 'browser', 'default'],
    dedupe: ['react', 'react-dom'],
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    css: true,
    env: {
      NODE_ENV: 'test',
    },
    deps: {
      optimizer: {
        web: {
          include: [
            'react',
            'react-dom',
            '@testing-library/react',
            '@testing-library/jest-dom',
          ],
        },
      },
    },
  },
});
