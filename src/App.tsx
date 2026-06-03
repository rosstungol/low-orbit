import { useState } from 'react'

import { SpaceScene } from './components/scene/SpaceScene'
import { GameControls } from './components/ui/GameControls'
import { RestartButton } from './components/ui/RestartButton'
import { TargetCount } from './components/ui/TargetCount'

function App() {
	const [targetsLeft, setTargetsLeft] = useState<number | null>(null)

	return (
		<main>
			<GameControls />
			{targetsLeft != null && <TargetCount targetCount={targetsLeft} />}
			{targetsLeft === 0 && <RestartButton />}
			<SpaceScene setTargetCount={setTargetsLeft} />
		</main>
	)
}

export default App
