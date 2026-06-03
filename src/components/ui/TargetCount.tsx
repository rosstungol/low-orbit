export function TargetCount({ targetCount }: { targetCount: number }) {
	return (
		<div className='target-count'>
			<p>targets left</p>
			<span>{targetCount}</span>
		</div>
	)
}
