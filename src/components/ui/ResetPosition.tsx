import { requestReset } from '../../config/updateSpaceshipAxis'

export function ResetPosition() {
	return (
		<div className='reset-container'>
			<button type='button' onClick={requestReset} className='button'>
				Reset Position
			</button>
		</div>
	)
}
