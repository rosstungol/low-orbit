export function RestartButton() {
	return (
		<div className='button-container'>
			<button
				type='button'
				onClick={() => location.reload()}
				className='button -large'
			>
				Restart Flight
			</button>
		</div>
	)
}
