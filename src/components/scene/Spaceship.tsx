import { useGLTF } from '@react-three/drei/core/Gltf'
import { type JSX, type RefObject, useEffect } from 'react'
import type { Group, Mesh, MeshStandardMaterial } from 'three'
import type { GLTF } from 'three-stdlib'

import { setShipRadius } from '../../config/shipBounds'

type GLTFResult = GLTF & {
	nodes: {
		defaultMaterial: Mesh
	}
	materials: {
		lambert1: MeshStandardMaterial
	}
}

type SpaceshipProps = JSX.IntrinsicElements['group'] & {
	meshRef?: RefObject<Group | null>
}

export function Spaceship(props: SpaceshipProps) {
	const { meshRef, ...groupProps } = props
	const { nodes, materials } = useGLTF(
		'/assets/models/spaceship.glb'
	) as unknown as GLTFResult

	useEffect(() => {
		const geometry = nodes.defaultMaterial.geometry
		if (!geometry.boundingSphere) {
			geometry.computeBoundingSphere()
		}
		if (geometry.boundingSphere) {
			setShipRadius(geometry.boundingSphere.radius)
		}
	}, [nodes])

	return (
		<group ref={meshRef} {...groupProps} dispose={null}>
			<mesh
				castShadow
				receiveShadow
				geometry={nodes.defaultMaterial.geometry}
				material={materials.lambert1}
				userData={{ name: 'defaultMaterial' }}
			/>
		</group>
	)
}
