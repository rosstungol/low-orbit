import { useEffect, useMemo } from 'react'
import { AdditiveBlending, BufferAttribute, BufferGeometry } from 'three'

const vertexShader = `
attribute float size;

void main() {
	vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
	gl_PointSize = size * (100.0 / -mvPosition.z);
	gl_Position = projectionMatrix * mvPosition;
}
`

const fragmentShader = `
void main() {
	float d = distance(gl_PointCoord, vec2(0.5));
	if (d > 0.5) discard;
	gl_FragColor = vec4(0.18, 0.12, 0.18, 1.0);
}
`

export function SpaceDust({ count = 600000, radius = 1600 }) {
	const geometry = useMemo(() => {
		const geometry = new BufferGeometry()

		const positions = new Float32Array(count * 3)
		const sizes = new Float32Array(count)

		for (let i = 0; i < count; i++) {
			const r = radius * Math.cbrt(Math.random())
			const theta = Math.random() * Math.PI * 2
			const phi = Math.acos(2 * Math.random() - 1)
			const sinPhi = Math.sin(phi)

			positions[i * 3 + 0] = r * sinPhi * Math.cos(theta)
			positions[i * 3 + 1] = r * sinPhi * Math.sin(theta)
			positions[i * 3 + 2] = r * Math.cos(phi)

			sizes[i] = 0.8 + Math.random() * 1.5
		}

		geometry.setAttribute('position', new BufferAttribute(positions, 3))
		geometry.setAttribute('size', new BufferAttribute(sizes, 1))

		return geometry
	}, [count, radius])

	useEffect(() => {
		return () => {
			geometry.dispose()
		}
	}, [geometry])

	return (
		<points geometry={geometry} frustumCulled={false}>
			<shaderMaterial
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
				depthWrite={false}
				blending={AdditiveBlending}
				transparent
			/>
		</points>
	)
}
