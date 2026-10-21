import { useFrame } from '@react-three/fiber'
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { Quaternion, TorusGeometry, Vector3 } from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { RING_RADIUS, hitTarget } from '../../config/hitTarget'
import { useAudio } from '../../useAudio'
import { spaceshipPosition } from './CameraController'

function randomPoint(scale?: Vector3) {
	return new Vector3(
		Math.random() * 2 - 1,
		Math.random() * 2 - 1,
		Math.random() * 2 - 1
	).multiply(scale || new Vector3(1, 1, 1))
}

export function Targets({
	setTargetCount,
}: {
	setTargetCount: Dispatch<SetStateAction<number | null>>
}) {
	const [targets, setTargets] = useState(() => {
		const arr = []

		for (let i = 0; i < 20; i++) {
			arr.push({
				center: randomPoint(new Vector3(120, 120, 300)),
				direction: randomPoint().normalize(),
				hit: false,
			})
		}

		return arr
	})

	useEffect(() => {
		setTargetCount(targets.length)
	}, [targets, setTargetCount])

	const geometry = useMemo(() => {
		const geometries: TorusGeometry[] = []

		targets.forEach((target) => {
			const torusGeometry = new TorusGeometry(RING_RADIUS, 0.2, 80, 25)

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

	const playPing = useAudio('/assets/sounds/ping.mp3')

	useFrame(() => {
		const hitIndices: number[] = []

		targets.forEach((target, index) => {
			if (hitTarget(spaceshipPosition, target.center, target.direction)) {
				hitIndices.push(index)

				playPing()
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
