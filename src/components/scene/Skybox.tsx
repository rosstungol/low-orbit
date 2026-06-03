import { Environment } from '@react-three/drei/core/Environment'

export function Skybox() {
	return (
		<Environment
			background
			files={[
				'/assets/images/nx.avif',
				'/assets/images/px.avif',
				'/assets/images/py.avif',
				'/assets/images/ny.avif',
				'/assets/images/nz.avif',
				'/assets/images/pz.avif',
			]}
		/>
	)
}
