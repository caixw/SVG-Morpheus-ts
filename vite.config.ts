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
      entry: 'src/svg-morpheus.ts',
      name: 'SVGMorpheus',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        switch (format) {
          case 'es':
            return 'svg-morpheus.js';
          case 'cjs':
            return 'svg-morpheus.cjs';
          case 'umd':
            return 'svg-morpheus.umd.js';
          default:
            return `svg-morpheus.${format}.js`;
        }
      },
    },
    rollupOptions: {
      external: [],
      output: {
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