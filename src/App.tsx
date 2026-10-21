import { useEffect, useState } from 'react'

import { SpaceScene } from './components/scene/SpaceScene'
import { ControlsToggle } from './components/ui/ControlsToggle'
import { GameControls } from './components/ui/GameControls'
import { ResetPosition } from './components/ui/ResetPosition'
import { RestartButton } from './components/ui/RestartButton'
import { StartButton } from './components/ui/StartButton'
import { TargetCount } from './components/ui/TargetCount'
import { useAudio } from './useAudio'

function App() {
	const [started, setStarted] = useState<boolean>(false)
	const [targetsLeft, setTargetsLeft] = useState<number | null>(null)
	const [controlsVisible, setControlsVisible] = useState<boolean>(true)
	const playSound = useAudio('/assets/sounds/success.mp3')

	useEffect(() => {
		if (targetsLeft === 0) playSound()
	}, [targetsLeft, playSound])

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
