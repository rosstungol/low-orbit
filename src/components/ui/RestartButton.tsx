export function RestartButton() {
	return (
		<div className='button-container'>
			<button type='button' onClick={() => location.reload()}>
				Restart Flight
			</button>
		</div>
	)
}
