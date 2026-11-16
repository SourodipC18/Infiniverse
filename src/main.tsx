import { Canvas } from '@react-three/fiber'
import { Component, useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { MathUtils } from 'three'
import { createInput, keyBindings } from './flight'
import { Range } from './Range'
import './style.css'

type Mode = 'ready' | 'driving' | 'paused'

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed
      ? <p role="alert" className="unavailable">The 3D renderer stopped. Reload the page to try again.</p>
      : this.props.children
  }
}

function Game() {
  const [input] = useState(createInput)
  const [mode, setMode] = useState<Mode>('ready')
  const [motion, setMotion] = useState(() => !matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [telemetry, setTelemetry] = useState({ speed: 0, x: 0, z: 17 })
  const [webgl] = useState(() => {
    try {
      const context = document.createElement('canvas').getContext('webgl2')
      if (!context) return false
      context.getExtension('WEBGL_lose_context')?.loseContext()
      return true
    } catch {
      return false
    }
  })
  const surface = useRef<HTMLDivElement>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())

  const transition = useCallback((next: Mode) => {
    input.paused = next !== 'driving'
    input.keys.clear()
    input.touches.clear()
    pointers.current.clear()
    setMode(next)
    if (next === 'driving') surface.current?.focus({ preventScroll: true })
  }, [input])

  const reset = useCallback(() => {
    input.keys.clear()
    input.touches.clear()
    pointers.current.clear()
    input.orbit = 0
    input.pitch = .38
    input.distance = 11
    input.orbitUntil = 0
    input.reset += 1
    if (!input.paused) surface.current?.focus({ preventScroll: true })
  }, [input])

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const changed = (event: MediaQueryListEvent) => setMotion(!event.matches)
    media.addEventListener('change', changed)
    return () => media.removeEventListener('change', changed)
  }, [])

  useEffect(() => {
    const onDown = (event: KeyboardEvent) => {
      if (!webgl || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.code === 'Escape' && !event.repeat && mode !== 'ready') {
        event.preventDefault()
        transition(mode === 'driving' ? 'paused' : 'driving')
      }
      if (mode !== 'driving') return
      if (event.code === 'KeyR' && !event.repeat) reset()
      if (keyBindings[event.code]) {
        event.preventDefault()
        input.keys.add(event.code)
      }
    }
    const onUp = (event: KeyboardEvent) => { input.keys.delete(event.code) }
    const onBlur = () => { if (!input.paused) transition('paused') }
    const onVisibility = () => { if (document.hidden) onBlur() }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    window.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [input, mode, reset, transition, webgl])

  useEffect(() => {
    const element = surface.current
    if (!element) return
    const zoom = (event: WheelEvent) => {
      if (input.paused) return
      event.preventDefault()
      const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 100 : 1
      input.distance = MathUtils.clamp(input.distance + event.deltaY * scale * .011, 6, 23)
    }
    element.addEventListener('wheel', zoom, { passive: false })
    return () => element.removeEventListener('wheel', zoom)
  }, [input])

  const pointerStart = (event: PointerEvent<HTMLDivElement>) => {
    if (input.paused || event.button !== 0 || pointers.current.size >= 2) return
    event.currentTarget.setPointerCapture(event.pointerId)
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
  }

  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const previous = pointers.current.get(event.pointerId)
    if (input.paused || !previous) return
    const next = { x: event.clientX, y: event.clientY }
    const other = [...pointers.current].find(([id]) => id !== event.pointerId)?.[1]
    if (other) {
      const before = Math.hypot(previous.x - other.x, previous.y - other.y)
      const after = Math.hypot(next.x - other.x, next.y - other.y)
      if (before > 0 && after > 0) input.distance = MathUtils.clamp(input.distance * before / after, 6, 23)
    } else {
      input.orbit = MathUtils.euclideanModulo(input.orbit + (next.x - previous.x) * .007 + Math.PI, Math.PI * 2) - Math.PI
      input.pitch = MathUtils.clamp(input.pitch + (next.y - previous.y) * .005, .15, 1.02)
      input.orbitUntil = performance.now() + 1500
    }
    pointers.current.set(event.pointerId, next)
  }

  const releasePointer = (event: PointerEvent<HTMLDivElement>) => { pointers.current.delete(event.pointerId) }
  const report = useCallback((speed: number, x: number, z: number) => {
    setTelemetry(previous => previous.speed === speed && previous.x === x && previous.z === z
      ? previous : { speed, x, z })
  }, [])

  const touchButton = (action: string, label: string, glyph: string) => {
    const release = (event: PointerEvent<HTMLButtonElement>) => { input.touches.delete(event.pointerId) }
    return <button type="button" className={'pad ' + action} aria-label={label}
      onPointerDown={event => {
        if (input.paused || event.button !== 0) return
        event.preventDefault()
        event.currentTarget.setPointerCapture(event.pointerId)
        input.touches.set(event.pointerId, action)
      }}
      onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}>
      {glyph}
    </button>
  }

  return <main className="game">
    <div className="viewport" ref={surface} tabIndex={-1} aria-label="Hovercraft test range"
      onPointerDown={pointerStart} onPointerMove={pointerMove} onPointerUp={releasePointer}
      onPointerCancel={releasePointer} onLostPointerCapture={releasePointer}>
      {webgl && <SceneBoundary>
        <Canvas camera={{ position: [0, 5, 27], fov: 55, near: .15, far: 640 }}
          dpr={[1, 1.65]} gl={{ antialias: true }}>
          <Range input={input} onTelemetry={report} reducedMotion={!motion} />
        </Canvas>
      </SceneBoundary>}
    </div>

    <header className="hud">
      <div className="brand"><span aria-hidden="true" className="mark">✦</span><span>INFINIVERSE</span></div>
      {webgl && mode !== 'ready' && <div className="hud-actions">
        <button type="button" onClick={reset}>Reset</button>
        <button type="button" onClick={() => transition(mode === 'driving' ? 'paused' : 'driving')}>
          {mode === 'driving' ? 'Pause' : 'Resume'}
        </button>
      </div>}
    </header>

    {(!webgl || mode !== 'driving') && <section className="intro" aria-labelledby="screen-title">
      <p className="region">Phase 2 · Flight prototype</p>
      <h1 id="screen-title">{mode === 'paused' ? 'Flight paused' : 'Hovercraft Test Range'}</h1>
      {webgl ? <>
        <p>{mode === 'paused' ? 'Resume when you’re ready to fly.' : 'Take the hovercraft through the marked gate and get a feel for steering, boost, and the chase camera.'}</p>
        <button type="button" className="primary" onClick={() => transition('driving')}>
          {mode === 'paused' ? 'Resume flight' : 'Start flight'} <span aria-hidden="true">→</span>
        </button>
      </> : <p role="alert">This game needs WebGL 2. Try a browser with hardware acceleration enabled.</p>}
    </section>}

    {mode === 'driving' && <div className="touch-controls" aria-label="Touch flight controls">
      <div>{touchButton('left', 'Steer left', '←')}{touchButton('right', 'Steer right', '→')}</div>
      <div>{touchButton('brake', 'Brake and reverse', '−')}{touchButton('boost', 'Boost', '⚡')}{touchButton('drive', 'Accelerate', '↑')}</div>
    </div>}

    {webgl && <footer className="instruments">
      <div className="readout" aria-label="Flight telemetry">
        <span className="readout-label">{telemetry.speed < 0 ? 'Reverse' : 'Speed'}</span>
        <div><output aria-label="Speed">{Math.abs(telemetry.speed)}</output> <span>km/h</span></div>
        <span className="coordinates" aria-label="Position">X {telemetry.x} · Z {telemetry.z}</span>
      </div>
      <p className="keyboard"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Fly
        <span><kbd>Shift</kbd> Boost</span><span>Drag to orbit · Scroll to zoom</span>
      </p>
      <p className="touch-hint">Hold ↑ to fly · Drag to orbit · Pinch to zoom</p>
    </footer>}
  </main>
}

createRoot(document.getElementById('root')!).render(<Game />)
