import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
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
        globals: {
          // No external dependencies currently
        },
      },
    },
  },
  server: {
    port: 9000,
    open: '/demos/object.html',
  },
}); 