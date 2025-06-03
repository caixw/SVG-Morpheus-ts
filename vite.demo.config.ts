import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// 读取 package.json 获取版本号
const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));
const version = packageJson.version;

export default defineConfig({
  root: 'demos',
  base: './',
  publicDir: '../public', // 指向项目根目录的public文件夹
  build: {
    outDir: '../dist-demo',
    emptyOutDir: true,
    target: ['es2022', 'chrome89', 'firefox89', 'safari15'],
    minify: 'terser',
    terserOptions: {
      format: {
        comments: /^!/,  // 保留以 /*! 开头的注释
      },
    },
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'demos/index.html'),
      },
      external: [],
      output: {
        format: 'es',
        entryFileNames: '[name]-[hash].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash].[ext]',
        banner: () => `/*!
 * SVG Morpheus TypeScript Demo - Compiled Version
 * Version: v${version}
 * Build Date: ${new Date().toISOString()}
 * Repository: https://github.com/adoin/SVG-Morpheus-ts
 */`,
      }
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'svg-morpheus-ts': resolve(__dirname, 'src/index.ts'),
    },
  },
  server: {
    port: 9111,
  },
}); 