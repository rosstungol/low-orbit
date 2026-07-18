import type { PerspectiveCamera, Vector3 } from 'three'

import { controls } from './controls'
import { touchState } from './touchState'

let yawVelocity = 0
let pitchVelocity = 0
const angularAccelerationStep = 0.1
const maxAngularVelocity = 2.4
const spaceshipSpeed = 0.2
export let turbo = 0

let resetRequested = false

export function requestReset() {
	resetRequested = true
}

function easeOutQuad(x: number) {
	return 1 - (1 - x) * (1 - x)
}

export function updateSpaceshipAxis(
	x: Vector3,
	y: Vector3,
	z: Vector3,
	spaceshipPosition: Vector3,
	camera: PerspectiveCamera,
	delta: number,
	baseFov = 45
) {
	const frameScale = delta * 60
	const damping = 0.95 ** frameScale

	yawVelocity *= damping
	pitchVelocity *= damping

	if (controls.a || touchState.a) {
		yawVelocity += angularAccelerationStep
	}

	if (controls.d || touchState.d) {
		yawVelocity -= angularAccelerationStep
	}

	if (controls.w || touchState.w) {
		pitchVelocity += angularAccelerationStep
	}

	if (controls.s || touchState.s) {
		pitchVelocity -= angularAccelerationStep
	}

	if (Math.abs(yawVelocity) > maxAngularVelocity)
		yawVelocity = Math.sign(yawVelocity) * maxAngularVelocity

	if (Math.abs(pitchVelocity) > maxAngularVelocity)
		pitchVelocity = Math.sign(pitchVelocity) * maxAngularVelocity

	if (resetRequested) {
		resetRequested = false
		yawVelocity = 0
		pitchVelocity = 0
		turbo = 0

		x.set(1, 0, 0)
		y.set(0, 1, 0)
		z.set(0, 0, 1)

		spaceshipPosition.set(0, 0, 0)
		camera.fov = baseFov
		camera.updateProjectionMatrix()

		return
	}

	x.applyAxisAngle(z, yawVelocity * delta)
	y.applyAxisAngle(z, yawVelocity * delta)

	y.applyAxisAngle(x, pitchVelocity * delta)
	z.applyAxisAngle(x, pitchVelocity * delta)

	x.normalize()
	y.normalize()
	z.normalize()

	if (controls.shift || touchState.shift) {
		turbo += 0.025 * frameScale
	} else {
		turbo *= damping
	}

	turbo = Math.min(Math.max(turbo, 0), 1)

	const turboSpeed = easeOutQuad(turbo) * 0.025

	camera.fov = baseFov + turboSpeed * 900
	camera.updateProjectionMatrix()

	spaceshipPosition.addScaledVector(
		z,
		(-spaceshipSpeed - turboSpeed) * frameScale
	)
}
