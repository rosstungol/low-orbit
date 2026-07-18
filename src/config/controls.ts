export type ControlKey = 'a' | 'd' | 'w' | 's' | 'shift'

export type Controls = Record<ControlKey, boolean>

export const controls: Controls = {
	a: false,
	d: false,
	w: false,
	s: false,
	shift: false,
}
