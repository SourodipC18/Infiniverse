import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, type RefObject } from 'react'
import { AdditiveBlending, type Group } from 'three'
import { BOOST_SPEED, type CraftState } from './flight'

export function ThrusterTrails({ craft, reducedMotion }: {
  craft: RefObject<CraftState>
  reducedMotion: boolean
}) {
  const trails = useRef<Group>(null)
  const uniforms = useMemo(() => ({ strength: { value: 0 } }), [])
  useFrame(() => {
    const speed = Math.max(0, craft.current.speed)
    if (trails.current) {
      trails.current.visible = !reducedMotion && speed > .5
      trails.current.scale.z = .45 + 1.25 * Math.min(1, speed / BOOST_SPEED)
    }
    uniforms.strength.value = Math.min(1, speed / 16)
  })
  return <group ref={trails} position={[0, -.08, 1.5]}>
    {[-1.12, 1.12].map(x => <mesh key={x} position={[x, 0, 4]} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[1.9, 8]} />
      <shaderMaterial uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending}
        vertexShader={`
          varying vec2 plume;
          void main() {
            plume = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
          }
        `}
        fragmentShader={`
          varying vec2 plume;
          uniform float strength;
          void main() {
            float width = mix(.3,.08,plume.y);
            float side = (plume.x-.5)/width;
            float core = exp(-side*side*2.6);
            float fade = smoothstep(.02, .96, plume.y);
            gl_FragColor = vec4(.21,.93,.86,core*fade*strength*.6);
          }
        `} />
    </mesh>)}
  </group>
}
