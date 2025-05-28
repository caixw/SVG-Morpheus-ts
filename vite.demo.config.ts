import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'demos',
  base: './',
  build: {
    outDir: '../dist-demo',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'demos/home.html'),
        index: resolve(__dirname, 'demos/index.html'),
        'debug-bundleSvgs': resolve(__dirname, 'demos/debug-bundleSvgs.html'),
        'test-bundleSvgs': resolve(__dirname, 'demos/test-bundleSvgs.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 9001,
  },
}); 