export type TouchKey = 'w' | 'a' | 's' | 'd' | 'shift'

export type TouchState = Record<TouchKey, boolean>

export const touchState: TouchState = {
	w: false,
	a: false,
	s: false,
	d: false,
	shift: false,
}
