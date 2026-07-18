export function ControlsToggle({
	visible,
	onToggle,
}: {
	visible: boolean
	onToggle: () => void
}) {
	return (
		<button
			type='button'
			onClick={onToggle}
			className='button'
			aria-expanded={visible}
		>
			{visible ? 'Hide' : 'Show'} Controls
		</button>
	)
}
