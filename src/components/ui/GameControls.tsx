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
				<h3>movement</h3>
				<div className='key-group'>
					<KeyboardKey>W</KeyboardKey>
					<KeyboardKey>A</KeyboardKey>
					<KeyboardKey>S</KeyboardKey>
					<KeyboardKey>D</KeyboardKey>
				</div>
			</div>
			<div>
				<h3>reset position</h3>
				<KeyboardKey>R</KeyboardKey>
			</div>
			<div>
				<h3>turbo</h3>
				<KeyboardKey>shift</KeyboardKey>
			</div>
		</div>
	)
}
