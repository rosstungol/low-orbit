export function StartButton({ onStart }: { onStart: () => void }) {
	return (
		<div className='button-container'>
			<button type='button' onClick={onStart} className='button -large'>
				Start Flight
			</button>
		</div>
	)
}
