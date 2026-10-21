import { Vector3 } from 'three'
import { expect, test } from 'vite-plus/test'

import { hitTarget } from './hitTarget'

const center = new Vector3(10, 0, 0)
const direction = new Vector3(0, 0, 1)

test('hit when the ship crosses the ring plane inside the ring', () => {
	expect(hitTarget(new Vector3(10, 0, 0.3), center, direction)).toBe(true)
	expect(hitTarget(new Vector3(10, 0, -0.3), center, direction)).toBe(true)
})

test('miss when the ship is outside the ring radius', () => {
	expect(hitTarget(new Vector3(12, 0, 0), center, direction)).toBe(false)
})

test('miss when the ship is beside the ring plane', () => {
	expect(hitTarget(new Vector3(10, 0, 5), center, direction)).toBe(false)
})
