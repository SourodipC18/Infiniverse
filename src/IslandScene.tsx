import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef, type RefObject } from 'react'
import { BufferAttribute, BufferGeometry, Color, DoubleSide, Object3D, PlaneGeometry, type InstancedMesh } from 'three'
import { BEACONS, CAUSEWAY, CELL_SIZE, DOCK, isLit, surfaceHeight, terrainHeight, type Point, type Survey } from './island'

import { HazardMarker } from './HazardMarkers'
import { HAZARD_IDS } from './hazards'

const stone = new Color('#50425f')
const grass = new Color('#427879')
const sand = new Color('#bf9b88')
const deep = new Color('#17264b')
const teal = new Color('#54bba9')

function landscapeGeometry(ocean: boolean) {
  const size = ocean ? CELL_SIZE : 1040
  const segments = ocean ? 160 : 192
  const geometry = new PlaneGeometry(size, size, segments, segments).rotateX(-Math.PI / 2)
  const positions = geometry.attributes.position
  const colors = new Float32Array(positions.count * 3)
  const color = new Color()
  const depths = new Float32Array(positions.count)
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index)
    const z = positions.getZ(index)
    const h = terrainHeight(x, z)
    if (ocean) {
      positions.setY(index, .015)
      depths[index] = h
      color.copy(deep).lerp(teal, Math.max(0, Math.min(1, (h + 10) / 11)))
    } else {
      positions.setY(index, h)
      color.copy(sand).lerp(grass, Math.max(0, Math.min(1, (h - 1) / 7)))
      color.lerp(stone, Math.max(0, Math.min(.92, (h - 15) / 31)))
      color.multiplyScalar(.92 + .08 * Math.sin(x * .28 + z * .37))
    }
    color.toArray(colors, index * 3)
  }
  geometry.setAttribute('color', new BufferAttribute(colors, 3))
  if (ocean) geometry.setAttribute('seabed', new BufferAttribute(depths, 1))
  geometry.computeVertexNormals()
  return geometry
}

function Ocean({ geometry, uniforms }: {
  geometry: PlaneGeometry
  uniforms: { time: { value: number } }
}) {
  return <mesh geometry={geometry}>
    <shaderMaterial uniforms={uniforms} vertexColors
      vertexShader={`
        varying vec2 water;
        varying float depth;
        varying vec3 tint;
        varying float range;
        attribute float seabed;
        void main() {
          depth = seabed;
          water = position.xz;
          tint = color;
          vec4 view = modelViewMatrix * vec4(position, 1.);
          range = length(view.xyz);
          gl_Position = projectionMatrix * view;
        }
      `}
      fragmentShader={`
        uniform float time;
        varying vec2 water;
        varying float depth;
        varying vec3 tint;
        varying float range;
        void main() {
          // Integer cycles over each tile keep the wave phase continuous.
          vec2 phase = water * (6.28318530718 / ${CELL_SIZE}.0);
          float swell = sin(dot(phase, vec2(43., 79.)) + time*.9)
            * sin(dot(phase, vec2(10., -61.)) - time*.52);
          float glint = smoothstep(.72,.99,swell) * .046;
          vec3 base = tint * (.95 + swell*.09) + vec3(glint*.5,glint,glint);
          float ripples = sin(dot(phase, vec2(261., 91.)) - time*1.6);
          float shore = 1. - smoothstep(.22, 2.6, abs(depth + .85 + swell*.5));
          float foam = shore * smoothstep(-.3,.8,swell*.6+ripples*.4);
          base += vec3(.25,.54,.52)*foam;
          vec3 haze = vec3(.31,.22,.33);
          gl_FragColor = vec4(mix(base, haze, smoothstep(125., 710., range)), 1.);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `} />
  </mesh>
}

function trailGeometry() {
  const vertices: number[] = []
  const indices: number[] = []
  function trail(a: Point, b: Point, width: number) {
    const count = Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / 2)
    const scale = width / Math.hypot(b.x - a.x, b.z - a.z)
    const dx = (b.z - a.z) * scale
    const dz = (a.x - b.x) * scale
    const offset = vertices.length / 3
    for (let i = 0; i <= count; i += 1) {
      const t = i / count
      const x = a.x + (b.x - a.x) * t
      const z = a.z + (b.z - a.z) * t
      for (const sign of [-1, 1]) {
        const px = x + dx * sign
        const pz = z + dz * sign
        vertices.push(px, surfaceHeight(px, pz) + .16, pz)
      }
      const n = offset + 2 * i
      if (i < count) indices.push(n, n + 2, n + 1, n + 1, n + 2, n + 3)
    }
  }
  trail(DOCK, { x: -265, z: 184 }, 5)
  trail({ x: -265, z: 184 }, CAUSEWAY, 4.4)
  BEACONS.forEach(beacon => trail(CAUSEWAY, beacon, 4.4))
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function Dock() {
  return <group position={[DOCK.x, surfaceHeight(DOCK.x, DOCK.z), DOCK.z]}>
    <mesh position-y={-.16}>
      <cylinderGeometry args={[8, 8.8, .5, 12]} />
      <meshStandardMaterial color="#46536b" metalness={.25} roughness={.65} />
    </mesh>
    <mesh rotation-x={-Math.PI / 2} position-y={.12}>
      <ringGeometry args={[6.5, 6.8, 40]} />
      <meshBasicMaterial color="#99ffe1" />
    </mesh>
    {[-9, 9].map(x => <group key={x} position={[x, 0, -6]}>
      <mesh position-y={2.4}><boxGeometry args={[1.2, 5, 1.2]} /><meshStandardMaterial color="#3d4159" /></mesh>
      <mesh position-y={5.1}><boxGeometry args={[1.6, .55, 1.6]} /><meshBasicMaterial color="#a3f9da" /></mesh>
    </group>)}
  </group>
}

function Causeway() {
  return <group position={[CAUSEWAY.x, surfaceHeight(CAUSEWAY.x, CAUSEWAY.z), CAUSEWAY.z]}>
    {[-9, 9].map(x => <group key={x} position={[x, 0, 0]}>
      <mesh position-y={4}><boxGeometry args={[2.2, 9, 3]} /><meshStandardMaterial color="#45475c" /></mesh>
      <mesh position-y={8.6}><boxGeometry args={[2.3, .4, 3]} /><meshBasicMaterial color="#70f0dc" /></mesh>
    </group>)}
    <mesh position-y={8}><boxGeometry args={[20, 1.05, 3.1]} /><meshStandardMaterial color="#525168" /></mesh>
  </group>
}

function Landmark({ index, lit }: { index: number; lit: boolean }) {
  const beacon = BEACONS[index]
  const lamp = lit ? '#77ffcb' : beacon.color
  return <group position={[beacon.x, surfaceHeight(beacon.x, beacon.z), beacon.z]}>
    <mesh position-y={.55}>
      <cylinderGeometry args={[4.2, 5.5, 1.3, 8]} />
      <meshStandardMaterial color="#494253" metalness={.25} roughness={.54} />
    </mesh>
    <mesh position-y={3.7}>
      <cylinderGeometry args={[.74, 1.2, 6.6, 6]} />
      <meshStandardMaterial color="#313048" />
    </mesh>
    <mesh position-y={7}>
      <octahedronGeometry args={[1.8]} />
      <meshBasicMaterial color={lamp} />
    </mesh>
    <mesh position-y={30}>
      <cylinderGeometry args={[.28, .71, 46, 8, 1, true]} />
      <meshBasicMaterial color={lamp} transparent opacity={lit ? .42 : .25} depthWrite={false} />
    </mesh>
    {index === 0 && <group position={[-10, 0, -9]}>
      <mesh position-y={6}><cylinderGeometry args={[2.3, 3.5, 12, 6]} /><meshStandardMaterial color="#74606b" /></mesh>
      <mesh position-y={12}><cylinderGeometry args={[6.1, 4.5, 1.9, 8]} /><meshStandardMaterial color="#5c5268" /></mesh>
      <mesh position-y={13.5}><coneGeometry args={[4.8, 1.6, 8]} /><meshBasicMaterial color="#e9bd92" /></mesh>
    </group>}
    {index === 1 && Array.from({ length: 8 }, (_, i) => {
      const a = i * Math.PI / 4
      const x = Math.cos(a) * 13
      const z = Math.sin(a) * 13
      const base = terrainHeight(beacon.x + x, beacon.z + z) - terrainHeight(beacon.x, beacon.z)
      const height = 3 + (i * 7 % 6)
      return <mesh key={i} position={[x, base + height * .46, z]} rotation={[.12, a, -.09]}>
        <boxGeometry args={[2.6, height, 2.4]} />
        <meshStandardMaterial color={i % 2 ? '#977a7a' : '#6a5769'} flatShading />
      </mesh>
    })}
    {index === 2 && Array.from({ length: 12 }, (_, i) => {
      const a = i * 2.4
      const radius = 9 + (i % 4) * 3
      const x = Math.cos(a) * radius
      const z = Math.sin(a) * radius
      const base = terrainHeight(beacon.x + x, beacon.z + z) - terrainHeight(beacon.x, beacon.z)
      return <mesh key={i} position={[x, base + 2, z]} scale={[1.1, 2.2 + i % 4, 1.1]} rotation={[.22, a, -.24]}>
        <octahedronGeometry args={[1.6]} />
        <meshStandardMaterial color={i % 2 ? '#9783de' : '#73cfdc'} emissive="#684cb0" emissiveIntensity={.37} flatShading />
      </mesh>
    })}
  </group>
}

const rockPoints = Array.from({ length: 560 }, (_, i) => {
  const x = 840 * (((i + 1) * .6180339887) % 1 - .5)
  const z = 780 * (((i + 1) * .4142135623) % 1 - .5)
  const y = terrainHeight(x, z)
  return { x, y, z, angle: i * 2.4, scale: .28 + (i % 8) * .115 }
}).filter(p => p.y > 2 && p.y < 35 &&
  [DOCK, CAUSEWAY, ...BEACONS].every(site => Math.hypot(site.x - p.x, site.z - p.z) > 28))

function Outcrops() {
  const mesh = useRef<InstancedMesh>(null)
  useLayoutEffect(() => {
    if (!mesh.current) return
    const transform = new Object3D()
    const color = new Color()
    rockPoints.forEach((p, i) => {
      transform.position.set(p.x, p.y + .18, p.z)
      transform.rotation.set(.17, p.angle, -.16)
      transform.scale.set(p.scale, p.scale * (i % 4 === 0 ? 2.5 : 1.1), p.scale * 1.6)
      transform.updateMatrix()
      mesh.current?.setMatrixAt(i, transform.matrix)
      mesh.current?.setColorAt(i, color.set(i % 3 === 0 ? '#66718b' : '#5c5372'))
    })
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
    mesh.current.computeBoundingSphere()
  }, [])

  return <instancedMesh ref={mesh} args={[undefined, undefined, rockPoints.length]}>
    <dodecahedronGeometry args={[1.4, 0]} />
    <meshStandardMaterial roughness={.81} flatShading />
  </instancedMesh>
}

const tileOffsets = [-CELL_SIZE, 0, CELL_SIZE]

export function IslandScene({ survey, reducedMotion, elapsed, detail }: { survey: Survey; reducedMotion: boolean; elapsed: RefObject<number>; detail: boolean }) {
  const terrain = useMemo(() => landscapeGeometry(false), [])
  const paths = useMemo(trailGeometry, [])
  const water = useMemo(() => landscapeGeometry(true), [])
  const uniforms = useMemo(() => ({ time: { value: 0 } }), [])
  useFrame((_, dt) => { if (!reducedMotion) uniforms.time.value += Math.min(.1, dt) })

  return <>{tileOffsets.flatMap(x => tileOffsets.map(z => (
    <group key={`${x}:${z}`} position={[x, 0, z]}>
      <mesh geometry={terrain}><meshStandardMaterial vertexColors roughness={.93} flatShading /></mesh>
      <Ocean geometry={water} uniforms={uniforms} />
      <mesh geometry={paths}><meshStandardMaterial color="#968887" roughness={.91} side={DoubleSide} /></mesh>
      {detail && <Outcrops />}
      <Dock />
      <Causeway />
      {HAZARD_IDS.map(id => <HazardMarker key={id} id={id} elapsed={elapsed} reducedMotion={reducedMotion} />)}
      {BEACONS.map((beacon, index) => <Landmark key={beacon.id} index={index} lit={isLit(survey, index)} />)}
    </group>
  )))}</>
}
