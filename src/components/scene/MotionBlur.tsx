import { Effect } from 'postprocessing'
import { forwardRef, useMemo } from 'react'
import { Uniform } from 'three'

import { turbo } from '../../config/updateSpaceshipAxis'

const fragmentShader = `
uniform float strength;

float rand2 (vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 delta = uv - vec2(0.5);
  float dist = length(delta);
  vec2 dir = dist > 0.0 ? delta / dist : vec2(0.0);
  float positionalStrength = max(dist - 0.1, 0.0) * 0.1;
  positionalStrength = pow(positionalStrength, 1.5) * 7.0;

  vec4 accum = vec4(0.0);
  for (int i = 0; i < 7; i++) {
    vec2 offs1 = -dir * positionalStrength * strength * ((float(i) + rand2(uv * 5.0)) * 0.2);
    vec2 offs2 = dir * positionalStrength * strength * ((float(i) + rand2(uv * 5.0)) * 0.2);

    accum += texture2D(inputBuffer, uv + offs1);
    accum += texture2D(inputBuffer, uv + offs2);
  }
  accum *= 1.0 / 14.0;

	outputColor = accum;
}`

class MotionBlurImpl extends Effect {
	private strengthUniform: Uniform<number>

	constructor() {
		const strengthUniform = new Uniform(0)

		super('MotionBlur', fragmentShader, {
			uniforms: new Map([['strength', strengthUniform]]),
		})

		this.strengthUniform = strengthUniform
	}

	update() {
		this.strengthUniform.value = turbo
	}
}

export const MotionBlur = forwardRef((_, ref) => {
	const effect = useMemo(() => new MotionBlurImpl(), [])

	return <primitive ref={ref} object={effect} dispose={null} />
})
