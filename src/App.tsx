import { useEffect, useRef, useState } from 'react'

import { SpaceScene } from './components/scene/SpaceScene'
import { ControlsToggle } from './components/ui/ControlsToggle'
import { GameControls } from './components/ui/GameControls'
import { ResetPosition } from './components/ui/ResetPosition'
import { RestartButton } from './components/ui/RestartButton'
import { StartButton } from './components/ui/StartButton'
import { TargetCount } from './components/ui/TargetCount'

function App() {
	const [started, setStarted] = useState<boolean>(false)
	const [targetsLeft, setTargetsLeft] = useState<number | null>(null)
	const [controlsVisible, setControlsVisible] = useState<boolean>(true)
	const sound = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		const audio = new Audio('/assets/sounds/success.mp3')
		audio.preload = 'auto'
		sound.current = audio

		return () => {
			audio.pause()
			audio.src = ''
			sound.current = null
		}
	}, [])

	useEffect(() => {
		if (targetsLeft === 0 && sound.current) {
			sound.current.currentTime = 0
			void sound.current.play().catch(() => {})
		}
	}, [targetsLeft])

	return (
		<main>
			<div className='controls-container'>
				<ControlsToggle
					visible={controlsVisible}
					onToggle={() => setControlsVisible((v) => !v)}
				/>
				{controlsVisible && <GameControls />}
			</div>

			{!started && (
				<StartButton
					onStart={() => {
						setStarted(true)
						setControlsVisible(false)
					}}
				/>
			)}
			{started && <SpaceScene setTargetCount={setTargetsLeft} />}
			{started && <ResetPosition />}

			{targetsLeft != null && <TargetCount targetCount={targetsLeft} />}
			{targetsLeft === 0 && <RestartButton />}
		</main>
	)
}

export default App
