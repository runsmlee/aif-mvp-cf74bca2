import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    conditions: ['import', 'module', 'browser', 'default'],
    dedupe: ['react', 'react-dom'],
    modules: [path.resolve(__dirname, 'node_modules'), '/app/node_modules', 'node_modules'],
    alias: {
      '@testing-library/jest-dom': '/app/node_modules/@testing-library/jest-dom',
    },
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
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/scheduler/')) {
            return 'vendor';
          }
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
  },
});
