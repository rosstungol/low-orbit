import { useGLTF } from '@react-three/drei/core/Gltf'
import type { JSX, RefObject } from 'react'
import type { Group, Mesh, MeshStandardMaterial } from 'three'
import type { GLTF } from 'three-stdlib'

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
