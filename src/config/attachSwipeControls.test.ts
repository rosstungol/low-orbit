import { expect, test } from 'vite-plus/test'

import { attachControls } from './attachControls'
import { attachSwipeControls } from './attachSwipeControls'
import { controls } from './controls'

interface TouchPoint {
	identifier: number
	clientX: number
	clientY: number
}

const listeners: Record<string, (e: unknown) => void> = {}

// The handlers only read touches/changedTouches as array-likes, so plain
// objects drive them; window is stubbed to capture the listeners.
globalThis.window = {
	addEventListener: (type: string, fn: (e: unknown) => void) => {
		listeners[type] = fn
	},
	removeEventListener: () => {},
} as unknown as Window & typeof globalThis

globalThis.document = {
	addEventListener: () => {},
	removeEventListener: () => {},
	hidden: false,
} as unknown as Document

attachSwipeControls()
attachControls()

function touchEvent(
	touches: TouchPoint[],
	changedTouches: TouchPoint[] = touches
) {
	return { touches, changedTouches, preventDefault() {} }
}

function touch(
	identifier: number,
	clientX: number,
	clientY: number
): TouchPoint {
	return { identifier, clientX, clientY }
}

test('a swipe with one finger steers, and lifting it stops steering', () => {
	const finger = touch(1, 100, 100)

	listeners.touchstart(touchEvent([finger]))

	listeners.touchmove(touchEvent([touch(1, 0, 100)]))
	expect(controls.a).toBe(true)

	listeners.touchend(touchEvent([]))
	expect(controls.a).toBe(false)
})

test('steering continues with a remaining finger after the tracked one lifts', () => {
	// Finger 1 is tracked (first in changedTouches); finger 2 rests far away.
	listeners.touchstart(
		touchEvent([touch(2, 300, 300), touch(1, 100, 100)], [touch(1, 100, 100)])
	)
	expect(controls.shift).toBe(true)

	// Finger 1 lifts; finger 2 stays and becomes the steering finger.
	listeners.touchend(touchEvent([touch(2, 300, 300)], [touch(1, 100, 100)]))
	expect(controls.shift).toBe(false)

	// A move of finger 2 now steers, measured from its adopted position.
	listeners.touchmove(touchEvent([touch(2, 150, 300)]))
	expect(controls.a).toBe(true)
})

test('touch release preserves held keyboard keys', () => {
	// Clear touch state left over from the previous test.
	listeners.touchend(touchEvent([]))
	expect(controls.a).toBe(false)

	listeners.keydown({ key: 'w' })
	listeners.keydown({ key: 'Shift' })
	expect(controls.w).toBe(true)
	expect(controls.shift).toBe(true)

	// One finger swipes left while W and Shift stay held on the keyboard.
	listeners.touchstart(touchEvent([touch(3, 100, 100)]))
	listeners.touchmove(touchEvent([touch(3, 0, 100)]))
	expect(controls.a).toBe(true)
	expect(controls.w).toBe(true)

	// Second finger engages turbo, then lifts: touch shift goes away but the
	// keyboard Shift must survive.
	listeners.touchstart(
		touchEvent([touch(3, 0, 100), touch(4, 300, 300)], [touch(4, 300, 300)])
	)
	expect(controls.shift).toBe(true)
	listeners.touchend(touchEvent([touch(3, 0, 100)], [touch(4, 300, 300)]))
	expect(controls.shift).toBe(true)

	// Releasing the touch clears touch steering, not the held W.
	listeners.touchend(touchEvent([]))
	expect(controls.a).toBe(false)
	expect(controls.w).toBe(true)

	listeners.keyup({ key: 'w' })
	listeners.keyup({ key: 'Shift' })
	expect(controls.w).toBe(false)
	expect(controls.shift).toBe(false)
})
