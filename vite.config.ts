import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// 读取 package.json 获取版本号
const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));
const version = packageJson.version;


export default defineConfig(({ mode }) => {
  const isDemo = mode === 'demo';
  
  return {
    // 根据模式设置不同的root
    root: isDemo ? 'demos' : '.',
    base: './',
    publicDir: isDemo ? '../public' : 'public',
    
    plugins: [
      // 只在库模式下使用dts插件
      ...(isDemo ? [] : [dts({ insertTypesEntry: true })]),
    ],
    
    build: isDemo ? {
      // Demo构建配置
      outDir: '../dist-demo',
      emptyOutDir: true,
      target: ['es2022', 'chrome89', 'firefox89', 'safari15'],
      minify: 'terser',
      terserOptions: {
        format: {
          comments: /^!/,
        },
      },
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'demos/index.html'),
        },
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
    } : {
      // 库构建配置
      lib: {
        entry: 'src/index.ts',
        name: 'SVGMorpheus',
        formats: ['es', 'cjs', 'umd'],
        fileName: (format) => {
          switch (format) {
            case 'es':
              return 'index.js';
            case 'cjs':
              return 'index.cjs';
            case 'umd':
              return 'index.umd.js';
            default:
              return `index.${format}.js`;
          }
        },
      },
      rollupOptions: {
        external: [],
        output: {
          exports: 'named',
          globals: {},
        },
      },
    },
    
    server: {
      port: isDemo ? 9111 : 9001,
      open: isDemo ? '/' : '/demos/index.html',
    },
    
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        'svg-morpheus-ts': resolve(__dirname, 'src/index.ts'),
      },
    },
  };
}); 