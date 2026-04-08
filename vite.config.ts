import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// 读取 package.json 获取版本号
const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));
const version = packageJson.version;

export default defineConfig(({ mode }) => {
	// 根据环境设置 base 路径
	const isGitHubPages = process.env.GITHUB_PAGES === 'true';
	const base = isGitHubPages ? '/SVG-Morpheus-ts/' : '/';

	// 备选方案：也可以使用 import.meta.env
	// 在 .env 文件中设置：VITE_SVG_BASE_PATH=/SVG-Morpheus-ts/
	// 然后在 JS 中使用：import.meta.env.VITE_SVG_BASE_PATH

	const isDemo = mode === 'demo';
	const isDev = mode === 'development' || !mode || mode === 'dev';

	return {
		// 根据模式设置不同的 root
		root: isDemo || isDev ? 'demos' : '.',
		base,
		publicDir: isDemo || isDev ? '../public' : undefined,

		// 定义全局常量，在开发和构建环境都可用
		define: {
			__SVG_BASE_PATH__: JSON.stringify(base),
			__IS_GITHUB_PAGES__: JSON.stringify(isGitHubPages),
		},

		plugins: [
			// 只在库模式下使用 dts 插件
			...(isDemo || isDev ? [] : [dts({ insertTypesEntry: true })]),
		],

		build: isDemo
			? {
					// Demo 构建配置
					outDir: '../docs',
					emptyOutDir: true,
					rolldownOptions: {
						input: './demos/index.html',
						output: {
							format: 'es',
							entryFileNames: '[name]-[hash].js',
							chunkFileNames: '[name]-[hash].js',
							assetFileNames: '[name]-[hash].[ext]',
							postBanner: () => `/*!
 * SVG Morpheus TypeScript Demo - Compiled Version
 * Version: v${version}
 * Build Date: ${new Date().toISOString()}
 * Repository: https://github.com/caixw/SVG-Morpheus-ts
 */`,
						},
					},
				}
			: {
					// 库构建配置
					lib: {
						entry: './src/index.ts',
						name: 'SVGMorpheus',
						formats: ['es', 'cjs'],
						fileName: format => {
							switch (format) {
								case 'es':
									return 'index.js';
								case 'cjs':
									return 'index.cjs';
								default:
									return `index.${format}.js`;
							}
						},
					},
					rolldownOptions: {
						external: [],
						output: {
							exports: 'named',
							globals: {},
							postBanner: () => `/*!
 * SVG Morpheus TypeScript
 * Version: v${version}
 * Build Date: ${new Date().toISOString()}
 * Repository: https://github.com/caixw/SVG-Morpheus-ts
 */`,
						},
					},
				},

		server: {
			port: isDemo ? 9111 : 9001,
			open: isDev ? '/' : isDemo ? '/' : '/demos/index.html',
		},

		resolve: {
			alias: {
				'@': resolve(__dirname, 'src'),
				'@iconsets/svg-morpheus-ts': resolve(__dirname, 'src/index.ts'),
			},
		},
	};
});
