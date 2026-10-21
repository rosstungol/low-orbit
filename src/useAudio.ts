import { useCallback, useEffect, useRef } from 'react'

export function useAudio(src: string) {
	const ref = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		const audio = new Audio(src)
		audio.preload = 'auto'
		ref.current = audio

		return () => {
			audio.pause()
			audio.src = ''
			ref.current = null
		}
	}, [src])

	return useCallback(() => {
		if (ref.current) {
			ref.current.currentTime = 0
			void ref.current.play().catch(() => {})
		}
	}, [])
}
