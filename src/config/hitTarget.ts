import { Vector3 } from 'three'

export const RING_RADIUS = 1
// Half the ring thickness the ship may pierce while crossing the ring plane.
const RING_HALF_DEPTH = 0.5

const tempV = new Vector3()
const tempDir = new Vector3()
const tempProjected = new Vector3()

export function hitTarget(
	position: Vector3,
	center: Vector3,
	direction: Vector3
) {
	tempV.copy(position).sub(center)

	const dist = direction.dot(tempV)

	tempDir.copy(direction).multiplyScalar(dist)
	tempProjected.copy(position).sub(tempDir)

	const hitDist = tempProjected.distanceTo(center)

	return hitDist < RING_RADIUS && Math.abs(dist) < RING_HALF_DEPTH
}
