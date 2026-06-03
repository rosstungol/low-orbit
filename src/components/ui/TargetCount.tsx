export function TargetCount({ targetCount }: { targetCount: number }) {
	return (
		<div className='target-count'>
			<h2>targets left</h2>
			<h1>{targetCount}</h1>
		</div>
	)
}
