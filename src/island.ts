export type Point = { x: number; z: number }

export const WORLD_HALF = 500
export const WATER_LEVEL = 0
export const DOCK = { x: -326, z: 246, name: 'Arrival Dock' }
export const CAUSEWAY = { x: 40, z: 30, name: 'Central Causeway' }

export const BEACONS = [
  { id: 'ridge', name: 'Ridge Lookout', x: -180, z: -220, color: '#ffd688' },
  { id: 'ruins', name: 'Ancient Ruins', x: 190, z: -210, color: '#ffab7d' },
  { id: 'grove', name: 'Crystal Grove', x: 250, z: 120, color: '#b9a0ff' },
] as const

export const ACTIVATION_RADIUS = 24
export const RETURN_RADIUS = 32
const ALL_BEACONS = (1 << BEACONS.length) - 1

export type Survey = { beacons: number; complete: boolean }

export const freshSurvey = (): Survey => ({ beacons: 0, complete: false })

export function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.z - b.z)
}

export function isLit(survey: Survey, index: number) {
  return (survey.beacons & (1 << index)) !== 0
}

export function nearbyBeacon(survey: Survey, position: Point) {
  return BEACONS.findIndex((beacon, index) => !isLit(survey, index) && distance(beacon, position) <= ACTIVATION_RADIUS)
}

export function updateSurvey(survey: Survey, position: Point, activate = false): Survey {
  if (survey.complete) return survey
  const index = activate ? nearbyBeacon(survey, position) : -1
  const beacons = index < 0 ? survey.beacons : survey.beacons | (1 << index)
  const complete = beacons === ALL_BEACONS && distance(DOCK, position) <= RETURN_RADIUS
  return beacons === survey.beacons && !complete ? survey : { beacons, complete }
}

function smooth(min: number, max: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - min) / (max - min)))
  return t * t * (3 - 2 * t)
}

function mound(x: number, z: number, cx: number, cz: number, size: number, height: number) {
  return height * Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / size ** 2)
}

export function terrainHeight(x: number, z: number) {
  const angle = Math.atan2(z, x)
  const edge = 1 + .07 * Math.sin(5 * angle + .7) + .045 * Math.cos(8 * angle - .4)
  const radius = Math.hypot(x / 425, z / 385) / edge
  const shelf = 1 - smooth(.72, 1.19, radius)
  const undulation = 2.1 * Math.sin(x * .024 + z * .018) + 1.6 * Math.cos(z * .044 - x * .011)
  const hills = mound(x, z, -185, -215, 118, 36)
    + mound(x, z, 115, -84, 88, 25)
    + mound(x, z, 263, 113, 106, 13)
    + mound(x, z, -225, 52, 102, 13)
  return -11 + shelf * (23 + undulation + hills)
}

export function surfaceHeight(x: number, z: number) {
  return Math.max(WATER_LEVEL, terrainHeight(x, z))
}
