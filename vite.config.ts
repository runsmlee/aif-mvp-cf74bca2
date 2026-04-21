import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    conditions: ['import', 'module', 'browser', 'default'],
    dedupe: ['react', 'react-dom'],
    alias: {
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      '@testing-library/jest-dom': path.resolve('/app/node_modules/@testing-library/jest-dom/dist/index.js'),
      '@testing-library/react': path.resolve('/app/node_modules/@testing-library/react/dist/index.js'),
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
