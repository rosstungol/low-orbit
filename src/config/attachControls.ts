import {
	type ControlKey,
	controls,
	resetKeyboardControls,
	setKeyboardControl,
} from './controls'

function isControlKey(key: string): key is ControlKey {
	return key in controls
}

export function attachControls() {
	if (typeof window === 'undefined') {
		return () => {}
	}

	const handleVisibilityChange = () => {
		if (document.hidden) resetKeyboardControls()
	}

	const handleKeyDown = (e: KeyboardEvent) => {
		const key = e.key.toLowerCase()
		if (isControlKey(key)) {
			setKeyboardControl(key, true)
		}
	}

	const handleKeyUp = (e: KeyboardEvent) => {
		const key = e.key.toLowerCase()
		if (isControlKey(key)) {
			setKeyboardControl(key, false)
		}
	}

	window.addEventListener('keydown', handleKeyDown)
	window.addEventListener('keyup', handleKeyUp)
	window.addEventListener('blur', resetKeyboardControls)
	document.addEventListener('visibilitychange', handleVisibilityChange)

	return () => {
		window.removeEventListener('keydown', handleKeyDown)
		window.removeEventListener('keyup', handleKeyUp)
		window.removeEventListener('blur', resetKeyboardControls)
		document.removeEventListener('visibilitychange', handleVisibilityChange)
	}
}
