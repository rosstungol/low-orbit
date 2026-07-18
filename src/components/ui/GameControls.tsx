function KeyboardKey({ children }: { children: string }) {
	return (
		<div className='key'>
			<span>{children}</span>
		</div>
	)
}

export function GameControls() {
	return (
		<div className='controls'>
			<div>
				<p>movement</p>
				<div className='key-group'>
					<KeyboardKey>W</KeyboardKey>
					<KeyboardKey>A</KeyboardKey>
					<KeyboardKey>S</KeyboardKey>
					<KeyboardKey>D</KeyboardKey>
				</div>
			</div>
			<div>
				<p>turbo</p>
				<KeyboardKey>shift</KeyboardKey>
			</div>
			<div className='mobile-hint'>
				<p>mobile</p>
				<p className='hint-text'>movement • swipe</p>
				<p className='hint-text'>turbo • 2 fingers</p>
			</div>
		</div>
	)
}
