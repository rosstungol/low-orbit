export function StartButton({ onStart }: { onStart: () => void }) {
	return (
		<div className='button-container'>
			<button type='button' onClick={onStart}>
				Start Flight
			</button>
		</div>
	)
}
