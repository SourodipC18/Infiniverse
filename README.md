# INFINIVERSE

**Every World Contains Another.**

A browser exploration game, beginning with a 1 × 1 km alien island, a hovercraft, and a seamlessly repeating ocean.

## Current status

**[Play Twilight Island on Vercel](https://infiniverse-saurodip-chowdhurys-projects.vercel.app).** Vercel sign-in is required. Explore Twilight Island, activate its three beacons, and return to Arrival Dock.

Read the [Phase 1 game design](docs/PHASE_1_GAME_DESIGN.md) for the map layout, controls, ocean wrapping, hazards, respawn rules, architecture, and acceptance checks.

## First playable release

- Pilot an original hovercraft across land and water.
- Explore five landmarks in a 1 × 1 km island region.
- Activate three beacons and return to the starting dock.
- Travel through a surrounding ocean that wraps back to the same region.
- Avoid a moving storm and an electrical hazard field.
- Restart at the dock, with run progress reset, after hitting a danger.
- Use desktop or touch controls with adjustable graphics and optional sound.

The island survey now includes an offshore storm and an electrical field. A collision ends the run and returns you to the dock after a short delay, clearing beacon progress. A completed survey stays complete while you explore, until you reset or reload.

## Twilight Island release milestones

| Phase | Deliverable | Status |
| --- | --- | --- |
| 1 | Game design and first-release scope | Complete |
| 2 | Application, hovercraft controls, and camera | Complete |
| 3 | Island, ocean, landmarks, and beacons | Complete |
| 4 | Seamless repeating world | Complete |
| 5 | Hazards, restart, and completion | Complete |
| 6 | Visual polish, mobile support, and QA | Complete |
| 7 | Verified production publication | Complete |

## Open-world roadmap

The next release expands the starting planet into four connected regions. The milestones below describe planned work. The Vercel link above still opens the Twilight Island release.

| Milestone | Deliverable |
| --- | --- |
| 2.1 | Polish the east route from the island through Lantern Harbor, Crossroads Village, and Cherry Gardens. Use this drive to establish the standard for scenery density and visible turnoffs. |
| 2.2 | Build a highway in each cardinal direction, with 2 km measured along the road from the island hub. Connect the highways with back roads, hills, trails, bridges, and shortcuts. |
| 2.3 | Build complete districts and populate the stretches between them with scenery and destinations. |
| 2.4 | Give people and wildlife visible routines and reactions around the world. |
| 2.5 | Add terrain jumps, stunt courses, staged destruction, and marked speed pads that instantly set the hovercraft to 500 km/h in the lane direction. |
| 2.6 | Give each region a repeatable activity and optional discoveries, such as a hill climb, farm delivery, or quarry stunt run. |
| 2.7 | Place a signed gateway and a safe turnaround at the end of each highway. Show all four gateways and their distances on the map. |
| 2.8 | Drive every corridor at cruising and boost speeds. Verify landmark visibility, ordinary stretches between districts, collisions, population, and streaming. |

Phase 3 begins with travel beyond the four planet gateways.

### 2.3 — Districts and roadside scenery

| Subphase | Build | Acceptance check |
| --- | --- | --- |
| **2.3.1 — Lay out destinations** | Mark each district's main landmark, highway turnoff, approach road, local loop, and connections to adjacent areas. Reserve enough terrain for slopes, bridges, service yards, and activity approaches before placing buildings. | From the driver's view, you can see where to turn and reach the district by road. |
| **2.3.2 — Finish the east corridor** | Build a waterfront with docks and quays, a village with a square and several storefronts, and gardens with orchard rows, barns, and service lanes. Give each stop its own silhouette and arrival point. | Drive from the harbor through the village to the gardens. Each stop is recognisable before reaching its map marker. |
| **2.3.3 — Build north, south, and west** | North gets a lodge, hillside cabins, logging yards, and ridge trails. South gets farmsteads, market streets, barns, and irrigation crossings. West gets a quarry, workshops, and Meadow Stunt Park. Use local side streets and yards to make the buildings feel connected. | Each corridor has a recognisable main destination, smaller places to explore, and a local route back to the highway. |
| **2.3.4 — Fill the stretches between districts** | Place farm plots, wooded slopes, roadside stops, trailheads, and overlooks in deliberate groups. Use hill crests and curves to reveal landmarks gradually. Sign turns early enough to take them at cruising speed. | Record an uninterrupted drive in each direction. Revise empty stretches where you pass neither a change in scenery nor a visible destination or turnoff. |
| **2.3.5 — Make places usable** | Add a few purpose-built interactions, such as a market pickup, harbor route board, and garage trial start. Check that entrances, yards, bridges, and paths are driveable and that scenery fits the terrain across loading boundaries. | Find each interaction from the road, use it, and drive away. Return to confirm the district loads consistently. |

### 2.4 — People, wildlife, and ambient movement

| Subphase | Build | Acceptance check |
| --- | --- | --- |
| **2.4.1 — Plan where life belongs** | Assign gathering points, walking routes, work areas, and refuge spots. Place customers near shops, workers at docks and farms, spectators at stunt areas, and wildlife near habitat cover. | Each populated area has a reason to be busy, with space for the hovercraft to pass. |
| **2.4.2 — Give people routines** | Start with simple loops between doors, stalls, benches, and work areas. Stagger timing and mix walking, waiting, and working. Aim initially for **6–12 visible people** from the normal camera in a busy square. | Watch the square from a parked hovercraft and then drive through it. Characters move through the district without clumping at a single spot. |
| **2.4.3 — Add wildlife by habitat** | Give orchards, fields, forest clearings, and shorelines separate placement rules. Start with **3–6 visible animals** in an active habitat using suitable models and simple wandering, resting, and group movement. | Wildlife is easy to notice on nearby side roads. Groups remain in believable habitat and can be seen again on a return visit. |
| **2.4.4 — Add reactions and ambient traffic** | Have people step to the side and wildlife scatter toward cover when the hovercraft approaches. Add occasional service vehicle routes around farms and workshops with clear pullouts and turning space. | Driving past at cruising speed and boost produces readable reactions. Activity stays clear of dedicated boost lanes and jump landings. |
| **2.4.5 — Tune density and streaming** | Keep higher activity around the player, with simpler updates farther away. Stagger spawns and use stable placements on return. Tune busy, quiet, and transitional areas in actual gameplay. | Drive through each population type, turn back across loading boundaries, and check for sudden pop-in, duplicate spawns, dead zones, and frame drops. |

## Run the game locally

Use Node.js 22.12 or newer and pnpm 11.25.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Vite and select **Start flight**. The game requires WebGL 2.

| Control | Action |
| --- | --- |
| WASD or arrow keys | Accelerate, brake, reverse, and steer |
| Hold Shift or the ⚡ touch button | Keep accelerating up to 500 km/h while held |
| Drag the scene | Orbit the chase camera |
| Scroll or pinch | Adjust the camera distance |
| E or Activate beacon | Activate a beacon within 24 m |
| R or Reset | Return to the dock and clear survey progress |
| Escape or Pause | Pause or resume flight |
| On-screen hold buttons | Steer, accelerate, brake, and boost on touch screens |

The game uses React, TypeScript, Vite, Three.js, and React Three Fiber. The flight simulation runs at a fixed time step and is separate from input handling and scene rendering.

`pnpm build` runs TypeScript checks and creates the production bundle. Phase 3 was checked in the browser for rendering, flight, and beacon progress. A flight simulation check covered reaching all three beacons, rejecting out-of-range and duplicate activation, and completing the survey at the dock. Phase 4 rendered in the browser. Simulation checks covered all edges and diagonal corners, camera-relative position across a rebase, 50 consecutive crossings, and shared beacon and dock state. Physical phone testing is pending.

Phase 6 adds shoreline foam, a moonlit sky, terrain detail, thruster trails, and optional engine audio. Graphics and reduced-motion controls are available before flight and while paused. Auto uses Low on coarse pointers and High otherwise. Sound starts muted.

The browser check covered Shift-only boost, graphics settings, reduced motion, the sound toggle, and reset. A local browser fixture positioned the craft beside the electrical field to verify the warning, collision, and automatic return to Arrival Dock. Simulation checks covered sustained keyboard and touch boost, braking, boost release, and a complete three-beacon run with hazards active.

The minimap is schematic. The heading arrow and distance point to the next unlit beacon, or to a nearby beacon you can activate. Beacons can be visited in any order. After all three are active, fly within 32 m of Arrival Dock to finish. Travel in any direction to loop through the surrounding ocean. The 1 km region has a 300 m ocean margin on each side, so the full repeat distance is 1.6 km. Nearby island copies share beacon and dock state. The minimap position wraps at the cell edge.

## Vercel

[Open the playable build](https://infiniverse-saurodip-chowdhurys-projects.vercel.app). Vercel sign-in is required. The production build includes the 500 km/h boost update.

## Assets

All game assets and implementation will be original or appropriately licensed.
