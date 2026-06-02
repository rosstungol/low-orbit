import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'

import { CameraController } from './CameraController'
import { Lighting } from './Lighting'
import { Skybox } from './Skybox'
import { SpaceDust } from './SpaceDust'
import { Spaceship } from './Spaceship'
import { Targets } from './Targets'

export function SpaceScene() {
	const meshRef = useRef<Group | null>(null)

	return (
		<Canvas dpr={[1, 1.5]} className='canvas'>
			<CameraController meshRef={meshRef} />
			<Spaceship meshRef={meshRef} />
			<Lighting />
			<Skybox />
			<SpaceDust />
			<Targets />
		</Canvas>
	)
}
