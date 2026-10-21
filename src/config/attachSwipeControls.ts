import { setTouchControl } from './controls'

const SWIPE_THRESHOLD = 20

function setDirectionKeys(dx: number, dy: number) {
	setTouchControl('w', dy < -SWIPE_THRESHOLD)
	setTouchControl('s', dy > SWIPE_THRESHOLD)
	setTouchControl('a', dx < -SWIPE_THRESHOLD)
	setTouchControl('d', dx > SWIPE_THRESHOLD)
}

function resetDirectionKeys() {
	setTouchControl('w', false)
	setTouchControl('a', false)
	setTouchControl('s', false)
	setTouchControl('d', false)
}

export function attachSwipeControls() {
	if (typeof window === 'undefined') {
		return () => {}
	}

	let touchId: number | null = null
	let startX = 0
	let startY = 0

	const trackTouch = (touch: Touch) => {
		touchId = touch.identifier
		startX = touch.clientX
		startY = touch.clientY
	}

	// If the tracked finger lifted while others remain, steer with one of them.
	const releaseTrackedTouch = (remaining: TouchList) => {
		if (remaining.length > 0) {
			trackTouch(remaining[0])
		} else {
			touchId = null
		}
		resetDirectionKeys()
	}

	const handleTouchStart = (e: TouchEvent) => {
		if (touchId === null && e.changedTouches.length > 0) {
			trackTouch(e.changedTouches[0])
		}

		if (e.touches.length >= 2) {
			setTouchControl('shift', true)
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

		setTouchControl('shift', e.touches.length >= 2)
	}

	const handleTouchRelease = (e: TouchEvent) => {
		let found = false
		for (let i = 0; i < e.touches.length; i++) {
			if (e.touches[i].identifier === touchId) {
				found = true
				break
			}
		}

		if (!found) {
			releaseTrackedTouch(e.touches)
		}

		setTouchControl('shift', e.touches.length >= 2)
	}

	window.addEventListener('touchstart', handleTouchStart, { passive: true })
	window.addEventListener('touchmove', handleTouchMove, { passive: false })
	window.addEventListener('touchend', handleTouchRelease)
	window.addEventListener('touchcancel', handleTouchRelease)

	return () => {
		window.removeEventListener('touchstart', handleTouchStart)
		window.removeEventListener('touchmove', handleTouchMove)
		window.removeEventListener('touchend', handleTouchRelease)
		window.removeEventListener('touchcancel', handleTouchRelease)
	}
}
