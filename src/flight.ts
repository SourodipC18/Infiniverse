import { DOCK, wrapCoordinate } from "./island.ts"
export const FIXED_STEP = 1 / 120

export type CraftState = {
  x: number
  z: number
  heading: number
  speed: number
  steering: number
}

export const spawn = (): CraftState => ({
  x: DOCK.x,
  z: DOCK.z,
  heading: .28,
  speed: 0,
  steering: 0,
})

export const keyBindings: Record<string, string> = {
  KeyW: 'drive', ArrowUp: 'drive',
  KeyS: 'brake', ArrowDown: 'brake',
  KeyA: 'left', ArrowLeft: 'left',
  KeyD: 'right', ArrowRight: 'right',
  ShiftLeft: 'boost', ShiftRight: 'boost',
}

export type FlightInput = {
  keys: Set<string>
  touches: Map<number, string>
  orbit: number
  pitch: number
  distance: number
  orbitUntil: number
  paused: boolean
  reset: number
  activate: boolean
  recovering: boolean
}

export function createInput(): FlightInput {
  return {
    keys: new Set(), touches: new Map(), orbit: 0, pitch: .38,
    distance: 11, orbitUntil: 0, paused: true, reset: 0, activate: false, recovering: false,
  }
}

function held(input: FlightInput, action: string) {
  for (const code of input.keys) if (keyBindings[code] === action) return true
  for (const touch of input.touches.values()) if (touch === action) return true
  return false
}

function approach(value: number, target: number, maxChange: number) {
  return value + Math.max(-maxChange, Math.min(maxChange, target - value))
}

export function stepCraft(craft: CraftState, input: FlightInput, dt: number) {
  const forward = held(input, 'drive')
  const brake = held(input, 'brake')
  const maxSpeed = held(input, 'boost') ? 22 : 12
  const target = brake ? -5 : forward ? maxSpeed : 0
  const acceleration = brake ? 22 : forward ? 10 : 5
  craft.speed = approach(craft.speed, target, acceleration * dt)

  const steer = Number(held(input, 'right')) - Number(held(input, 'left'))
  craft.steering = approach(craft.steering, steer, 5 * dt)
  if (Math.abs(craft.speed) > .15) {
    const turnRate = (0.55 + Math.min(Math.abs(craft.speed) / 10, 1)) * Math.sign(craft.speed)
    craft.heading += craft.steering * turnRate * dt
  }

  craft.x += Math.sin(craft.heading) * craft.speed * dt
  craft.z -= Math.cos(craft.heading) * craft.speed * dt
  const x = wrapCoordinate(craft.x)
  const z = wrapCoordinate(craft.z)
  const shift = { x: x - craft.x, z: z - craft.z }
  craft.x = x
  craft.z = z
  return shift
}
