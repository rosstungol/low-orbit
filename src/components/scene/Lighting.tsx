export function Lighting() {
	return (
		<>
			<directionalLight
				color={'#F1F9F0'}
				intensity={20}
				position={[-50, -30, -200]}
			/>
			<directionalLight
				color={'#D5B9D5'}
				intensity={10}
				position={[-80, 50, 75]}
			/>
		</>
	)
}
