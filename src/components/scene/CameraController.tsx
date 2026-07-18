import { PerspectiveCamera } from '@react-three/drei/core/PerspectiveCamera'
import { useFrame } from '@react-three/fiber'
import { type RefObject, useEffect } from 'react'
import {
	type Group,
	Matrix4,
	type PerspectiveCamera as PerspectiveCameraType,
	Quaternion,
	Vector3,
} from 'three'

import { attachControls } from '../../config/attachControls'
import { attachSwipeControls } from '../../config/attachSwipeControls'
import { shipRadius } from '../../config/shipBounds'
import { updateSpaceshipAxis } from '../../config/updateSpaceshipAxis'

const x = new Vector3(1, 0, 0)
const y = new Vector3(0, 1, 0)
const z = new Vector3(0, 0, 1)

export const spaceshipPosition = new Vector3(0, 0, 0)

const rotationMatrix = new Matrix4()
const delayedRotationMatrix = new Matrix4()
const delayedQuaternion = new Quaternion()
const quaternionB = new Quaternion()

const spaceshipTranslation = new Matrix4()
const spaceshipMatrix = new Matrix4()

const cameraTranslation = new Matrix4()
const cameraMatrixPosition = new Vector3(0, 0.3, 2.5)
const cameraMatrix = new Matrix4()
const cameraTilt = new Matrix4().makeRotationX(-0.2)
const CAMERA_DISTANCE = cameraMatrixPosition.length()

export function CameraController({
	meshRef,
}: {
	meshRef: RefObject<Group | null>
}) {
	useEffect(() => {
		const cleanup1 = attachControls()
		const cleanup2 = attachSwipeControls()

		return () => {
			cleanup1()
			cleanup2()
		}
	}, [])

	useFrame(({ camera }, delta) => {
		const pc = camera as PerspectiveCameraType
		const aspect = pc.aspect
		const padding = 1.3
		const baseFov =
			2 *
			Math.atan(
				(shipRadius * padding) / (CAMERA_DISTANCE * Math.min(1, aspect))
			) *
			(180 / Math.PI)

		updateSpaceshipAxis(x, y, z, spaceshipPosition, pc, delta, baseFov)

		rotationMatrix.makeBasis(x, y, z)

		spaceshipTranslation.makeTranslation(
			spaceshipPosition.x,
			spaceshipPosition.y,
			spaceshipPosition.z
		)
		spaceshipMatrix.copy(spaceshipTranslation).multiply(rotationMatrix)

		if (meshRef.current != null) {
			meshRef.current.matrixAutoUpdate = false
			meshRef.current.matrix.copy(spaceshipMatrix)
			meshRef.current.matrixWorldNeedsUpdate = true
		}

		const quaternionA = new Quaternion().copy(delayedQuaternion)

		quaternionB.setFromRotationMatrix(rotationMatrix)

		const interpolationFactor60fps = 0.175
		const interpolationFactor =
			1 - (1 - interpolationFactor60fps) ** (delta * 60)
		const interpolatedQuaternion = new Quaternion().copy(quaternionA)

		interpolatedQuaternion.slerp(quaternionB, interpolationFactor)
		delayedQuaternion.copy(interpolatedQuaternion)

		delayedRotationMatrix.identity()
		delayedRotationMatrix.makeRotationFromQuaternion(delayedQuaternion)

		spaceshipTranslation.makeTranslation(
			spaceshipPosition.x,
			spaceshipPosition.y,
			spaceshipPosition.z
		)
		cameraTranslation.makeTranslation(
			cameraMatrixPosition.x,
			cameraMatrixPosition.y,
			cameraMatrixPosition.z
		)
		cameraMatrix
			.copy(spaceshipTranslation)
			.multiply(delayedRotationMatrix)
			.multiply(cameraTilt)
			.multiply(cameraTranslation)

		camera.matrixAutoUpdate = false
		camera.matrix.copy(cameraMatrix)
		camera.matrixWorldNeedsUpdate = true
	})

	return (
		<PerspectiveCamera
			makeDefault
			position={[
				cameraMatrixPosition.x,
				cameraMatrixPosition.y,
				cameraMatrixPosition.z,
			]}
		/>
	)
}
