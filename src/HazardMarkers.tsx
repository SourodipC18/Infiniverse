import { useFrame } from '@react-three/fiber'
import { useRef, type RefObject } from 'react'
import { Group, type Group as GroupType } from 'three'
import { HAZARDS, hazardCenter, type HazardId } from './hazards'
import { surfaceHeight } from './island'

export function HazardMarker({ id, elapsed, reducedMotion }: {
  id: HazardId
  elapsed: RefObject<number>
  reducedMotion: boolean
}) {
  const marker = useRef<GroupType>(null)
  const clouds = useRef<Group>(null)
  const definition = HAZARDS[id]
  const radius = definition.dangerRadius
  useFrame(() => {
    const { x, z } = hazardCenter(id, elapsed.current)
    marker.current?.position.set(x, surfaceHeight(x, z), z)
    if (clouds.current && !reducedMotion) clouds.current.rotation.y = elapsed.current * .09
  })
  const center = hazardCenter(id, 0)
  return <group ref={marker} position={[center.x, surfaceHeight(center.x, center.z), center.z]}>
    {id === 'storm' ? <>
      {[radius, radius * .74].map((r, i) => <mesh key={r} position-y={.12 + .035 * i} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[r - .7, r, 48]} />
        <meshBasicMaterial color={definition.color} transparent opacity={.7 - i * .26} depthWrite={false} />
      </mesh>)}
      <group ref={clouds}>
        {Array.from({ length: 11 }, (_, i) => {
          const a = i * 2.4
          return <mesh key={i} position={[Math.sin(a) * (8 + i), 9 + 4 * i, Math.cos(a) * (8 + i)]}
            scale={[1.6, .48 + .03 * i, 1.35]}>
            <icosahedronGeometry args={[8 + i * .9, 0]} />
            <meshStandardMaterial color={i % 2 ? '#524371' : '#332a55'} emissive="#4b357a" emissiveIntensity={.28} flatShading />
          </mesh>
        })}
      </group>
    </> : <>
      {Array.from({ length: 14 }, (_, i) => {
        const a = i * Math.PI * 2 / 14
        const x = Math.cos(a) * radius
        const z = Math.sin(a) * radius
        const height = surfaceHeight(center.x + x, center.z + z) - surfaceHeight(center.x, center.z)
        return <group key={i} position={[x, height, z]} rotation-y={a}>
          <mesh position-y={1.55}><boxGeometry args={[.66, 3.2, .84]} /><meshStandardMaterial color="#4a3c4f" /></mesh>
          <mesh position-y={3.18}><octahedronGeometry args={[.85]} /><meshBasicMaterial color={definition.color} /></mesh>
        </group>
      })}
      <mesh position-y={5}>
        <octahedronGeometry args={[2.8]} />
        <meshBasicMaterial color={definition.color} wireframe />
      </mesh>
    </>}
  </group>
}
