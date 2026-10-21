import { type PerspectiveCamera, Vector3 } from 'three'
import { expect, test } from 'vite-plus/test'

import { controls } from './controls'
import { requestReset, updateSpaceshipAxis } from './updateSpaceshipAxis'

const camera = {
	fov: 45,
	updateProjectionMatrix() {},
} as unknown as PerspectiveCamera

function freshAxes() {
	return {
		x: new Vector3(1, 0, 0),
		y: new Vector3(0, 1, 0),
		z: new Vector3(0, 0, 1),
		position: new Vector3(),
	}
}

// The module keeps velocity in module state, so reset before each run.
function reset() {
	requestReset()
	const axes = freshAxes()
	updateSpaceshipAxis(axes.x, axes.y, axes.z, axes.position, camera, 1 / 60)
}

function fly(frames: number, delta: number) {
	reset()
	controls.a = true
	const axes = freshAxes()
	for (let i = 0; i < frames; i++) {
		updateSpaceshipAxis(axes.x, axes.y, axes.z, axes.position, camera, delta)
	}
	controls.a = false
	return axes
}

test('two seconds of holding turn-left land in the same place at 30, 60 and 120 fps', () => {
	const slow = fly(60, 1 / 30)
	const mid = fly(120, 1 / 60)
	const fast = fly(240, 1 / 120)

	// Velocity is frame-rate exact; the remaining difference is Euler
	// integration of the rotation path, which differs slightly by step
	// size (~1.4° after two seconds of turning). A frame-rate bug shows
	// up an order of magnitude larger.
	const tolerance = 0.05

	expect(mid.x.angleTo(slow.x)).toBeLessThan(tolerance)
	expect(fast.x.angleTo(slow.x)).toBeLessThan(tolerance)
	expect(fast.z.angleTo(slow.z)).toBeLessThan(tolerance)
	expect(fast.position.distanceTo(slow.position)).toBeLessThan(1)
})
