import { useState } from 'react'

import { SpaceScene } from './components/scene/SpaceScene'
import { GameControls } from './components/ui/GameControls'
import { RestartButton } from './components/ui/RestartButton'
import { StartButton } from './components/ui/StartButton'
import { TargetCount } from './components/ui/TargetCount'

function App() {
	const [started, setStarted] = useState<boolean>(false)
	const [targetsLeft, setTargetsLeft] = useState<number | null>(null)

	return (
		<main>
			<GameControls />

			{!started && <StartButton onStart={() => setStarted(true)} />}
			{started && <SpaceScene setTargetCount={setTargetsLeft} />}

			{targetsLeft != null && <TargetCount targetCount={targetsLeft} />}
			{targetsLeft === 0 && <RestartButton />}
		</main>
	)
}

export default App
