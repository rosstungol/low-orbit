import { touchState } from './touchState'

const SWIPE_THRESHOLD = 20

function setDirectionKeys(dx: number, dy: number) {
	touchState.w = dy < -SWIPE_THRESHOLD
	touchState.s = dy > SWIPE_THRESHOLD
	touchState.a = dx < -SWIPE_THRESHOLD
	touchState.d = dx > SWIPE_THRESHOLD
}

function resetDirectionKeys() {
	touchState.w = false
	touchState.a = false
	touchState.s = false
	touchState.d = false
}

export function attachSwipeControls() {
	if (typeof window === 'undefined') {
		return () => {}
	}

	let touchId: number | null = null
	let startX = 0
	let startY = 0

	const handleTouchStart = (e: TouchEvent) => {
		if (touchId === null && e.changedTouches.length > 0) {
			const touch = e.changedTouches[0]
			touchId = touch.identifier
			startX = touch.clientX
			startY = touch.clientY
		}

		if (e.touches.length >= 2) {
			touchState.shift = true
		}
	}

	const handleTouchMove = (e: TouchEvent) => {
		e.preventDefault()

		for (let i = 0; i < e.touches.length; i++) {
			const touch = e.touches[i]
			if (touch.identifier === touchId) {
				setDirectionKeys(touch.clientX - startX, touch.clientY - startY)
				break
			}
		}

		touchState.shift = e.touches.length >= 2
	}

	const handleTouchEnd = (e: TouchEvent) => {
		let found = false
		for (let i = 0; i < e.touches.length; i++) {
			if (e.touches[i].identifier === touchId) {
				found = true
				break
			}
		}

		if (!found) {
			touchId = null
			resetDirectionKeys()
		}

		touchState.shift = e.touches.length >= 2
	}

	const handleTouchCancel = (e: TouchEvent) => {
		let trackedTouchIsActive = false
		for (let i = 0; i < e.touches.length; i++) {
			if (e.touches[i].identifier === touchId) {
				trackedTouchIsActive = true
				break
			}
		}
		if (!trackedTouchIsActive) {
			touchId = null
			resetDirectionKeys()
		}
		touchState.shift = e.touches.length >= 2
	}

	window.addEventListener('touchstart', handleTouchStart, { passive: true })
	window.addEventListener('touchmove', handleTouchMove, { passive: false })
	window.addEventListener('touchend', handleTouchEnd)
	window.addEventListener('touchcancel', handleTouchCancel)

	return () => {
		window.removeEventListener('touchstart', handleTouchStart)
		window.removeEventListener('touchmove', handleTouchMove)
		window.removeEventListener('touchend', handleTouchEnd)
		window.removeEventListener('touchcancel', handleTouchCancel)
	}
}
