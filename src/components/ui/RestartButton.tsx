export function RestartButton() {
	return (
		<div className='restart'>
			<button type='button' onClick={() => location.reload()}>
				restart game
			</button>
		</div>
	)
}
