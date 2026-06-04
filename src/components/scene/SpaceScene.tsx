import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { Perf } from 'r3f-perf'
import { type Dispatch, type SetStateAction, useRef } from 'react'
import type { Group } from 'three'

import { CameraController } from './CameraController'
import { EngineAudio } from './EngineAudio'
import { Lighting } from './Lighting'
import { MotionBlur } from './MotionBlur'
import { Skybox } from './Skybox'
import { SpaceDust } from './SpaceDust'
import { Spaceship } from './Spaceship'
import { Targets } from './Targets'

export function SpaceScene({
	setTargetCount,
}: {
	setTargetCount: Dispatch<SetStateAction<number | null>>
}) {
	const meshRef = useRef<Group | null>(null)

	return (
		<Canvas dpr={[1, 1.5]} className='canvas'>
			<CameraController meshRef={meshRef} />
			<Spaceship meshRef={meshRef} />
			<Targets setTargetCount={setTargetCount} />
			<Lighting />
			<Skybox />
			<SpaceDust />
			<EngineAudio />

			<EffectComposer>
				<MotionBlur />
				<Bloom
					luminanceThreshold={1.0}
					luminanceSmoothing={0.9}
					intensity={0.08}
				/>
			</EffectComposer>

			{import.meta.env.DEV && <Perf position='bottom-right' />}
		</Canvas>
	)
}
