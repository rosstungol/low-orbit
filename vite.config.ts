import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig, lazyPlugins } from 'vite-plus'

// https://vite.dev/config/
export default defineConfig({
	staged: {
		'*': 'vp check --fix',
	},
	// Mirrors the previous Biome formatter configuration.
	fmt: {
		useTabs: true,
		tabWidth: 2,
		printWidth: 80,
		singleQuote: true,
		jsxSingleQuote: true,
		semi: false,
		trailingComma: 'es5',
		sortImports: true,
	},
	lint: {
		jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
		rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
		options: { typeAware: true, typeCheck: true },
	},
	plugins: lazyPlugins(() => [
		react(),
		babel({ presets: [reactCompilerPreset()] }),
	]),
	build: {
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						if (
							id.includes('/node_modules/three/') ||
							id.includes('/node_modules/@react-three/') ||
							id.includes('/node_modules/three-stdlib/')
						) {
							return 'three'
						}

						if (id.includes('/node_modules/postprocessing/')) {
							return 'postprocessing'
						}

						return 'vendor'
					}
				},
			},
		},
	},
})
