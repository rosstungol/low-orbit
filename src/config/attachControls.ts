import { type ControlKey, controls } from './controls'

function isControlKey(key: string): key is ControlKey {
	return key in controls
}

export function attachControls() {
	if (typeof window === 'undefined') {
		return () => {}
	}

	const resetControls = () => {
		controls.a = false
		controls.d = false
		controls.w = false
		controls.s = false
		controls.shift = false
	}

	const handleKeyDown = (e: KeyboardEvent) => {
		const key = e.key.toLowerCase()
		if (isControlKey(key)) {
			controls[key] = true
		}
	}

	const handleKeyUp = (e: KeyboardEvent) => {
		const key = e.key.toLowerCase()
		if (isControlKey(key)) {
			controls[key] = false
		}
	}

	window.addEventListener('keydown', handleKeyDown)
	window.addEventListener('keyup', handleKeyUp)
	window.addEventListener('blur', resetControls)
	document.addEventListener('visibilitychange', () => {
		if (document.hidden) resetControls()
	})

	return () => {
		window.removeEventListener('keydown', handleKeyDown)
		window.removeEventListener('keyup', handleKeyUp)
		window.removeEventListener('blur', resetControls)
		document.removeEventListener('visibilitychange', () => {
			if (document.hidden) resetControls()
		})
	}
}
