import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Audio, AudioListener, AudioLoader } from 'three'

import { turbo } from '../../config/updateSpaceshipAxis'

export function EngineAudio() {
	const audioRef = useRef<Audio | null>(null)

	useEffect(() => {
		let isMounted = true
		const listener = new AudioListener()
		const sound = new Audio(listener)

		new AudioLoader().load('/assets/sounds/engine.mp3', (buffer) => {
			if (!isMounted) return
			sound.setBuffer(buffer)
			sound.setLoop(true)
			sound.setVolume(0.2)
			sound.play()
		})

		audioRef.current = sound

		return () => {
			isMounted = false
			sound.stop()
		}
	}, [])

	useFrame(() => {
		if (!audioRef.current?.isPlaying) return

		const pitch = 1 + turbo * 0.8

		audioRef.current.setPlaybackRate(pitch)
	})

	return null
}
