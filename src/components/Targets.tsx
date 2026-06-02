import { useFrame } from '@react-three/fiber'
import { useMemo, useState } from 'react'
import { type BufferGeometry, Quaternion, TorusGeometry, Vector3 } from 'three'
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
		let geo: BufferGeometry

		targets.forEach((target) => {
			const torusGeometry = new TorusGeometry(TARGET_RAD, 0.2, 80, 25)

			torusGeometry.applyQuaternion(
				new Quaternion().setFromUnitVectors(
					new Vector3(0, 0, 1),
					target.direction
				)
			)
			torusGeometry.translate(target.center.x, target.center.y, target.center.z)

			if (!geo) geo = torusGeometry
			else geo = mergeGeometries([geo, torusGeometry])
		})

		return geo
	}, [targets])

	useFrame(() => {
		targets.forEach((target) => {
			const v = spaceshipPosition.clone().sub(target.center)
			const dist = target.direction.dot(v)
			const projected = spaceshipPosition
				.clone()
				.sub(target.direction.clone().multiplyScalar(dist))
			const hitDist = projected.distanceTo(target.center)

			if (hitDist < TARGET_RAD && Math.abs(dist) < 0.5) {
				target.hit = true
			}
		})

		const targetHit = targets.find((target) => target.hit)

		if (targetHit) {
			setTargets(targets.filter((target) => !target.hit))
		}
	})

	return (
		<mesh geometry={geometry}>
			<meshStandardMaterial roughness={0.5} metalness={0.5} color='#B03400' />
		</mesh>
	)
}
