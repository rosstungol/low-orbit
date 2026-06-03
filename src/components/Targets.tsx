import { useFrame } from '@react-three/fiber'
import { useMemo, useState } from 'react'
import { Quaternion, TorusGeometry, Vector3 } from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { spaceshipPosition } from './CameraController'

function randomPoint(scale?: Vector3) {
	return new Vector3(
		Math.random() * 2 - 1,
		Math.random() * 2 - 1,
		Math.random() * 2 - 1
	).multiply(scale || new Vector3(1, 1, 1))
}

const TARGET_RAD = 1

const tempV = new Vector3()
const tempDir = new Vector3()
const tempProjected = new Vector3()

export function Targets() {
	const [targets, setTargets] = useState(() => {
		const arr = []

		for (let i = 0; i < 30; i++) {
			arr.push({
				center: randomPoint(new Vector3(120, 120, 300)),
				direction: randomPoint().normalize(),
				hit: false,
			})
		}

		return arr
	})

	const geometry = useMemo(() => {
		const geometries: TorusGeometry[] = []

		targets.forEach((target) => {
			const torusGeometry = new TorusGeometry(TARGET_RAD, 0.2, 80, 25)

			torusGeometry.applyQuaternion(
				new Quaternion().setFromUnitVectors(
					new Vector3(0, 0, 1),
					target.direction
				)
			)
			torusGeometry.translate(target.center.x, target.center.y, target.center.z)

			geometries.push(torusGeometry)
		})

		return geometries.length > 0 ? mergeGeometries(geometries) : undefined
	}, [targets])

	useFrame(() => {
		const hitIndices: number[] = []

		targets.forEach((target, index) => {
			tempV.copy(spaceshipPosition).sub(target.center)

			const dist = target.direction.dot(tempV)

			tempDir.copy(target.direction).multiplyScalar(dist)
			tempProjected.copy(spaceshipPosition).sub(tempDir)

			const hitDist = tempProjected.distanceTo(target.center)

			if (hitDist < TARGET_RAD && Math.abs(dist) < 0.5) {
				hitIndices.push(index)
			}
		})

		if (hitIndices.length > 0) {
			setTargets(targets.filter((_, index) => !hitIndices.includes(index)))
		}
	})

	if (targets.length === 0) {
		return null
	}

	return (
		<mesh geometry={geometry}>
			<meshStandardMaterial
				roughness={0.5}
				metalness={0.5}
				color='#B03400'
				emissive='#B03400'
				emissiveIntensity={200}
			/>
		</mesh>
	)
}
