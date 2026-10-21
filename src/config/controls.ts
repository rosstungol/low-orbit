export type ControlKey = 'a' | 'd' | 'w' | 's' | 'shift'

export type Controls = Record<ControlKey, boolean>

export const controls: Controls = {
	a: false,
	d: false,
	w: false,
	s: false,
	shift: false,
}

const KEYS: ControlKey[] = ['a', 'd', 'w', 's', 'shift']

// Keyboard and touch hold separate state so one source releasing a key never
// clears a hold from the other; controls is their union.
const keyboard: Controls = {
	a: false,
	d: false,
	w: false,
	s: false,
	shift: false,
}
const touch: Controls = { a: false, d: false, w: false, s: false, shift: false }

function combine() {
	for (const key of KEYS) {
		controls[key] = keyboard[key] || touch[key]
	}
}

export function setKeyboardControl(key: ControlKey, value: boolean) {
	keyboard[key] = value
	combine()
}

export function resetKeyboardControls() {
	for (const key of KEYS) {
		keyboard[key] = false
	}
	combine()
}

export function setTouchControl(key: ControlKey, value: boolean) {
	touch[key] = value
	combine()
}
