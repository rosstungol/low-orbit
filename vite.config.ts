import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
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
