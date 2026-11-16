import { useEffect, useRef, useState } from 'react'
import { BOOST_LIMIT_KMH } from './flight'

type Engine = { context: AudioContext; rotor: OscillatorNode; volume: GainNode }

export function useFlightAudio(speed: number, active: boolean) {
  const engine = useRef<Engine | null>(null)
  const [enabled, setEnabled] = useState(false)

  async function toggle() {
    if (enabled) {
      setEnabled(false)
      return
    }

    try {
      if (!engine.current) {
        const context = new AudioContext()
        const rotor = context.createOscillator()
        const volume = context.createGain()
        rotor.type = 'triangle'
        volume.gain.value = 0
        rotor.connect(volume).connect(context.destination)
        rotor.start()
        engine.current = { context, rotor, volume }
      }
      await engine.current.context.resume()
      setEnabled(true)
    } catch {
      setEnabled(false)
    }
  }

  useEffect(() => {
    if (!engine.current) return
    const { context, volume, rotor } = engine.current
    const throttle = Math.sqrt(Math.min(Math.abs(speed) / BOOST_LIMIT_KMH, 1))
    volume.gain.setTargetAtTime(enabled && active ? .014 + throttle * .031 : 0, context.currentTime, .12)
    rotor.frequency.setTargetAtTime(48 + throttle * 91, context.currentTime, .12)
  }, [speed, active, enabled])

  useEffect(() => () => {
    if (engine.current) void engine.current.context.close()
  }, [])

  return { enabled, toggle }
}
