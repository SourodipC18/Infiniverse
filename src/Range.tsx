import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Group, MathUtils, Vector3 } from 'three'
import { FIXED_STEP, RANGE_RADIUS, spawn, stepCraft, type FlightInput } from './flight'

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

function Landscape() {
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
      return [Math.cos(angle) * radius * 360, y * 360, Math.sin(angle) * radius * 360]
    }).flat())
  }, [])

  return <>
    <fog attach="fog" args={['#736182', 75, 250]} />
    <hemisphereLight args={['#c9ccff', '#383148', 2.35]} />
    <directionalLight position={[-35, 32, -22]} color="#ffd0a4" intensity={3.1} />
    <mesh>
      <sphereGeometry args={[450, 40, 24]} />
      <shaderMaterial vertexShader={skyVertex} fragmentShader={skyFragment} side={1} depthWrite={false} />
    </mesh>
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[stars, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e4ddfa" size={.62} transparent opacity={.7} fog={false} />
    </points>
    <mesh rotation-x={-Math.PI / 2} position-y={-.1}>
      <planeGeometry args={[700, 700]} />
      <meshStandardMaterial color="#202237" roughness={.94} />
    </mesh>
    <gridHelper args={[216, 36, '#66668e', '#343650']} position-y={-.06} />
    <mesh rotation-x={-Math.PI / 2} position-y={-.02}>
      <ringGeometry args={[RANGE_RADIUS - .18, RANGE_RADIUS, 128]} />
      <meshBasicMaterial color="#ae83ce" transparent opacity={.66} />
    </mesh>
    <mesh rotation-x={-Math.PI / 2} position={[0, -.025, 17]}>
      <ringGeometry args={[4.8, 5, 72]} />
      <meshBasicMaterial color="#83f7df" />
    </mesh>
    {Array.from({ length: 14 }, (_, index) => (
      <mesh key={index} position={[0, -.025, 9 - 3.9 * index]}>
        <boxGeometry args={[.16, .035, 1.65]} />
        <meshBasicMaterial color="#6aabac" />
      </mesh>
    ))}
    {[-8, 8].map(x => (
      <group key={x} position={[x, 0, -37]}>
        <mesh position-y={4.5}>
          <boxGeometry args={[1.3, 9, 1.9]} />
          <meshStandardMaterial color="#333349" metalness={.4} roughness={.42} />
        </mesh>
        <mesh position={[0, 6, 1.01]}>
          <boxGeometry args={[.2, 4.3, .07]} />
          <meshBasicMaterial color="#ffd491" />
        </mesh>
      </group>
    ))}
    <mesh position={[0, 9.1, -37]}>
      <boxGeometry args={[17, .9, 1.5]} />
      <meshStandardMaterial color="#45415d" metalness={.4} roughness={.5} />
    </mesh>
    {Array.from({ length: 23 }, (_, index) => {
      const angle = index * Math.PI * 2 / 23
      const radius = 112 + index % 4 * 9
      const height = 6 + (index * 11 % 17)
      return (
        <mesh key={index} position={[radius * Math.cos(angle), height * .21, radius * Math.sin(angle)]}
          rotation={[.23, angle, -.22]} scale={[1.12, 1, .71]}>
          <dodecahedronGeometry args={[height]} />
          <meshStandardMaterial color={index % 3 === 0 ? '#4c3b5b' : '#35304a'} flatShading />
        </mesh>
      )
    })}
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

export function Range({ input, onTelemetry, reducedMotion }: {
  input: FlightInput
  onTelemetry: (speed: number, x: number, z: number) => void
  reducedMotion: boolean
}) {
  const craftMesh = useRef<Group>(null)
  const craft = useRef(spawn())
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
    }

    const state = craft.current
    if (!input.paused) {
      accumulator.current += Math.min(delta, .1)
      while (accumulator.current >= FIXED_STEP) {
        stepCraft(state, input, FIXED_STEP)
        accumulator.current -= FIXED_STEP
      }
      if (performance.now() > input.orbitUntil && Math.abs(state.speed) > .2) {
        input.orbit = MathUtils.damp(input.orbit, 0, 2.6, delta)
      }
    }
    const bob = reducedMotion || input.paused ? 0 : Math.sin(clock.elapsedTime * 2.8) * .075
    craftMesh.current.position.set(state.x, .79 + bob, state.z)
    craftMesh.current.rotation.set(0, -state.heading, reducedMotion ? 0 : -state.steering * state.speed * .009)

    const angle = state.heading + input.orbit
    const groundDistance = input.distance * Math.cos(input.pitch)
    vectors.position.set(
      state.x - Math.sin(angle) * groundDistance,
      1.35 + input.distance * Math.sin(input.pitch),
      state.z + Math.cos(angle) * groundDistance,
    )
    vectors.lookTarget.set(state.x + 2 * Math.sin(state.heading), 1.06, state.z - 2 * Math.cos(state.heading))
    if (resetting) {
      camera.position.copy(vectors.position)
      vectors.smoothedLook.copy(vectors.lookTarget)
    } else {
      camera.position.lerp(vectors.position, 1 - Math.exp(-8 * delta))
      vectors.smoothedLook.lerp(vectors.lookTarget, 1 - Math.exp(-10 * delta))
    }
    camera.lookAt(vectors.smoothedLook)

    timer.current += delta
    if (resetting || timer.current >= .1) {
      onTelemetry(Math.round(state.speed * 3.6), Math.round(state.x), Math.round(state.z))
      timer.current = 0
    }
  })

  return <>
    <Landscape />
    <group ref={craftMesh}>
      <Hovercraft />
    </group>
  </>
}
