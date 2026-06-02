import { useMemo, useState } from 'react'
import { Quaternion, TorusGeometry, Vector3 } from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

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
			})
		}

		return arr
	})

	const geometry = useMemo(() => {
		let geo

		targets.forEach((target) => {
			const torusGeo = new TorusGeometry(TARGET_RAD, 0.2, 80, 25)

			torusGeo.applyQuaternion(
				new Quaternion().setFromUnitVectors(
					new Vector3(0, 0, 1),
					target.direction
				)
			)
			torusGeo.translate(target.center.x, target.center.y, target.center.z)

			if (!geo) geo = torusGeo
			else geo = mergeGeometries([geo, torusGeo])
		})

		return geo
	}, [targets])

	return (
		<mesh geometry={geometry}>
			<meshStandardMaterial roughness={0.5} metalness={0.5} color='#B03400' />
		</mesh>
	)
}
