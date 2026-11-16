import { distance, type Point } from './island.ts'

export type HazardId = 'storm' | 'field'

export const HAZARDS = {
  storm: { name: 'Offshore storm', dangerRadius: 38, warningRadius: 90, color: '#b1a2ff' },
  field: { name: 'Electrical field', dangerRadius: 19, warningRadius: 47, color: '#ffb969' },
} satisfies Record<HazardId, { name: string; dangerRadius: number; warningRadius: number; color: string }>

export const HAZARD_IDS = ['storm', 'field'] as const
export const RECOVERY_SECONDS = 1.8

export function hazardCenter(id: HazardId, elapsed: number): Point {
  if (id === 'field') return { x: 228, z: -250 }
  return { x: -565 + 34 * Math.sin(elapsed * .062), z: 145 + 144 * Math.sin(elapsed * .044) }
}

export function hazardAt(position: Point, elapsed: number, radius: 'dangerRadius' | 'warningRadius') {
  return HAZARD_IDS.find(id => distance(position, hazardCenter(id, elapsed)) <= HAZARDS[id][radius]) ?? null
}
