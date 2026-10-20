import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig, lazyPlugins } from 'vite-plus'

// https://vite.dev/config/
export default defineConfig({
	staged: {
		'*': 'vp check --fix',
	},
	// Formatting options ported from the former biome.json (formatter + javascript.formatter blocks).
	// biome's nursery rule `useSortedClasses` sorted Tailwind classes; this
	// project has no Tailwind yet, so `sortTailwindcss` can be enabled when it
	// is adopted.
	fmt: {
		useTabs: true,
		tabWidth: 2,
		printWidth: 80,
		endOfLine: 'lf',
		singleQuote: true,
		jsxSingleQuote: true,
		semi: false,
		trailingComma: 'es5',
		quoteProps: 'as-needed',
		bracketSameLine: false,
		bracketSpacing: true,
		arrowParens: 'always',
		// biome assist.source.organizeImports
		sortImports: true,
	},
	lint: {
		ignorePatterns: ['dist/**', 'build/**'],
		// Rule categories standing in for biome's `linter.rules.recommended: true`.
		// Biome's recommended rules live in its correctness, suspicious, style,
		// complexity and performance groups and all ran at error severity, so the
		// matching oxlint categories run at error severity too. Oxlint's categories
		// are broader than biome's recommended subsets; the rules below where the
		// two disagree are switched back off.
		categories: {
			correctness: 'error',
			suspicious: 'error',
			style: 'error',
			perf: 'error',
		},
		// Oxlint enables eslint/typescript/unicorn/oxc by default; setting `plugins`
		// replaces that base set, so it is listed in full. React and jsx-a11y are
		// added because biome's recommended set covers React and accessibility rules.
		plugins: ['eslint', 'react', 'jsx-a11y', 'typescript', 'unicorn', 'oxc'],
		jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
		rules: {
			'vite-plus/prefer-vite-plus-imports': 'error',
			// Oxlint rules that fire on this codebase even though biome's config
			// (verified clean with `biome check` before the migration) did not
			// enforce them: biome has no recommended counterpart, or the concern is
			// handled elsewhere (import sorting moved to `fmt.sortImports`, which
			// replaces biome's organizeImports assist). Kept off to preserve the
			// lint behavior the project had under biome.
			'eslint/arrow-body-style': 'off',
			'eslint/capitalized-comments': 'off',
			'eslint/curly': 'off',
			'eslint/func-style': 'off',
			'eslint/id-length': 'off',
			'eslint/max-params': 'off',
			'eslint/max-statements': 'off',
			'eslint/no-magic-numbers': 'off',
			'eslint/no-shadow': 'off',
			'eslint/no-ternary': 'off',
			'eslint/one-var': 'off',
			'eslint/prefer-destructuring': 'off',
			'eslint/sort-imports': 'off',
			'eslint/sort-keys': 'off',
			'typescript/consistent-return': 'off',
			'typescript/no-unsafe-type-assertion': 'off',
			'typescript/prefer-for-of': 'off',
			'typescript/prefer-readonly': 'off',
			// oxlint's react/purity flags Math.random() inside the useMemo that seeds
			// the space-dust buffers; biome had no equivalent rule and the pattern is
			// intentional, so it stays off.
			'react/purity': 'off',
			// React rules biome did not enforce either (JSX transform is automatic,
			// so `React` in scope is not required; biome places no limits on JSX
			// depth, prop spreading or component definition style).
			'react/function-component-definition': 'off',
			'react/jsx-curly-brace-presence': 'off',
			'react/jsx-max-depth': 'off',
			'react/jsx-props-no-spreading': 'off',
			'react/react-in-jsx-scope': 'off',
			'unicorn/consistent-function-scoping': 'off',
			'unicorn/filename-case': 'off',
			'unicorn/no-invalid-remove-event-listener': 'off',
			'unicorn/no-null': 'off',
			'unicorn/no-zero-fractions': 'off',
			'unicorn/numeric-separators-style': 'off',
			'unicorn/prefer-global-this': 'off',
		},
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
