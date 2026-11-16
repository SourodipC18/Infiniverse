import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { BackSide, Group, MathUtils, Vector3 } from 'three'
import { FIXED_STEP, spawn, stepCraft, type FlightInput } from './flight'
import { freshSurvey, surfaceHeight, updateSurvey, type Survey } from './island'
import { IslandScene } from './IslandScene'

const skyVertex = `
varying vec3 direction;
void main() {
  direction = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`
const skyFragment = `
varying vec3 direction;
void main() {
  vec3 ray = normalize(direction);
  vec3 color = mix(vec3(.39,.25,.40), vec3(.033,.027,.083), smoothstep(-.05,.55,ray.y));
  float sunset = pow(max(dot(ray, normalize(vec3(-.75,.07,-.6))), 0.), 12.);
  color += vec3(.48,.21,.10) * sunset * exp(-abs(ray.y-.07)*5.);
  gl_FragColor = vec4(color, 1.);
}`

function Sky() {
  const stars = useMemo(() => {
    let state = 843
    const random = () => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0
      return state / 4294967296
    }
    return new Float32Array(Array.from({ length: 520 }, () => {
      const angle = random() * Math.PI * 2
      const y = .16 + random() * .83
      const radius = Math.sqrt(1 - y * y)
      return [Math.cos(angle) * radius * 1080, y * 1080, Math.sin(angle) * radius * 1080]
    }).flat())
  }, [])

  return <>
    <fog attach="fog" args={['#77627f', 105, 820]} />
    <hemisphereLight args={['#c9ccff', '#383148', 2.35]} />
    <directionalLight position={[-35, 32, -22]} color="#ffd0a4" intensity={3.1} />
    <mesh>
      <sphereGeometry args={[1500, 40, 24]} />
      <shaderMaterial vertexShader={skyVertex} fragmentShader={skyFragment} side={BackSide} depthWrite={false} />
    </mesh>
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[stars, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e4ddfa" size={1.25} transparent opacity={.7} fog={false} />
    </points>
  </>
}

function Hovercraft() {
  return <>
    <mesh position-y={.15} scale={[1.52, .38, 2.37]}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#ded3bc" metalness={.52} roughness={.28} flatShading />
    </mesh>
    <mesh position={[0, .44, -.21]} scale={[.76, .39, 1.22]}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#233d59" metalness={.48} roughness={.22} />
    </mesh>
    {[-1.12, 1.12].map(x => (
      <group key={x} position={[x, 0, .53]}>
        <mesh rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[.32, .52, 1.82, 8]} />
          <meshStandardMaterial color="#3a3d58" metalness={.5} roughness={.38} />
        </mesh>
        <mesh position-z={.93}>
          <circleGeometry args={[.34, 16]} />
          <meshBasicMaterial color="#85ffe1" />
        </mesh>
      </group>
    ))}
    <mesh position={[0, .13, 1.85]}>
      <boxGeometry args={[.62, .11, .08]} />
      <meshBasicMaterial color="#ffc779" />
    </mesh>
  </>
}

export function Range({ input, onTelemetry, onSurvey, survey, reducedMotion }: {
  input: FlightInput
  onTelemetry: (speed: number, x: number, z: number, heading: number) => void
  onSurvey: (survey: Survey) => void
  survey: Survey
  reducedMotion: boolean
}) {
  const craftMesh = useRef<Group>(null)
  const craft = useRef(spawn())
  const run = useRef(freshSurvey())
  const viewedReset = useRef(-1)
  const accumulator = useRef(0)
  const timer = useRef(0)
  const vectors = useMemo(() => ({
    position: new Vector3(), lookTarget: new Vector3(), smoothedLook: new Vector3(),
  }), [])

  useFrame(({ camera, clock }, delta) => {
    if (!craftMesh.current) return
    const resetting = viewedReset.current !== input.reset
    if (resetting) {
      viewedReset.current = input.reset
      craft.current = spawn()
      accumulator.current = 0
      run.current = freshSurvey()
      onSurvey(run.current)
    }

    const state = craft.current
    if (!input.paused) {
      accumulator.current += Math.min(delta, .1)
      while (accumulator.current >= FIXED_STEP) {
        stepCraft(state, input, FIXED_STEP)
        accumulator.current -= FIXED_STEP
      }
      const next = updateSurvey(run.current, state, input.activate)
      input.activate = false
      if (next !== run.current) {
        run.current = next
        onSurvey(next)
      }
      if (performance.now() > input.orbitUntil && Math.abs(state.speed) > .2) {
        input.orbit = MathUtils.damp(input.orbit, 0, 2.6, delta)
      }
    }
    const bob = reducedMotion || input.paused ? 0 : Math.sin(clock.elapsedTime * 2.8) * .075
    const height = surfaceHeight(state.x, state.z)
    craftMesh.current.position.set(state.x, height + .79 + bob, state.z)
    craftMesh.current.rotation.set(0, -state.heading, reducedMotion ? 0 : -state.steering * state.speed * .009)

    const angle = state.heading + input.orbit
    const groundDistance = input.distance * Math.cos(input.pitch)
    vectors.position.set(
      state.x - Math.sin(angle) * groundDistance,
      height + 1.35 + input.distance * Math.sin(input.pitch),
      state.z + Math.cos(angle) * groundDistance,
    )
    vectors.position.y = Math.max(vectors.position.y, surfaceHeight(vectors.position.x, vectors.position.z) + 1.2)
    vectors.lookTarget.set(state.x + 2 * Math.sin(state.heading), height + 1.06, state.z - 2 * Math.cos(state.heading))
    if (resetting) {
      camera.position.copy(vectors.position)
      vectors.smoothedLook.copy(vectors.lookTarget)
    } else {
      camera.position.lerp(vectors.position, 1 - Math.exp(-8 * delta))
      vectors.smoothedLook.lerp(vectors.lookTarget, 1 - Math.exp(-10 * delta))
    }
    camera.position.y = Math.max(camera.position.y, surfaceHeight(camera.position.x, camera.position.z) + 1.2)
    camera.lookAt(vectors.smoothedLook)

    timer.current += delta
    if (resetting || timer.current >= .1) {
      onTelemetry(Math.round(state.speed * 3.6), state.x, state.z, state.heading)
      timer.current = 0
    }
  })

  return <>
    <Sky />
    <IslandScene survey={survey} reducedMotion={reducedMotion} />
    <group ref={craftMesh}>
      <Hovercraft />
    </group>
  </>
}
