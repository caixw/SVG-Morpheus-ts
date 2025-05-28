import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'demos',
  base: './',
  build: {
    outDir: '../dist-demo',
    emptyOutDir: true,
    target: ['es2022', 'chrome89', 'firefox89', 'safari15'],
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'demos/home.html'),
        index: resolve(__dirname, 'demos/index.html'),
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