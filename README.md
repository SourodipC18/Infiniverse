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

### How to run these development prompts

Copy the shared instructions and **one numbered prompt** into the development session for the active Infiniverse checkout. Run the prompts in order. Each one starts from the last accepted milestone and ends with a result you can playtest.

> **Shared instructions:** Inspect the active game checkout, its assets, and its current build and preview commands. Read the previous milestone's verification notes. If the checkout lacks a required prerequisite, identify it before implementing dependent work. Reuse suitable assets and document any missing assets or licensing needs. Preserve the starting island, working controls and map, existing activities, and streaming behaviour unless this prompt explicitly changes them. Keep ambient hazards and character routes clear of protected activity lanes. Implement this milestone through normal gameplay, run the production build, and follow the acceptance check in the running game. Report what changed, which route or location you tested, any relevant performance observations, and anything you could not verify. Keep screenshots or short clips when the acceptance check calls for visual evidence. Leave space travel for Phase 3.

### 2.3 — Districts and roadside scenery

#### 2.3.1 — Survey the world and map the districts

**Build prompt.** Drive the four routes from 2.2 and record the existing landmarks, approach directions, grades, terrain seams, and stretches that feel empty. Plan an anchor destination, smaller stops, and a connected local loop in each direction. Mark the junctions, bridges, service lanes, lookout points, and space reserved for future activities. Use the existing game map and road data where practical so the plan matches the world players can drive.

**Acceptance check.** Trace a route from the island to every district and back to the highway. Confirm each proposed footprint has enough driveable space without overlapping an existing activity or narrowing the main boost lanes.

#### 2.3.2 — Set the district layout and density standard

**Build prompt.** Use Crossroads Village as the first complete district. Lay out the main street, square, side streets, and building plots before decorating. Vary building orientation and spacing according to frontage, views, and terrain. Establish how wide the roads and turning areas need to be, how soon signs should appear, and which roadside details are readable at cruising speed. Reuse those standards across the other districts.

**Acceptance check.** Approach from two directions at normal speed. Find the square without fast travel, make a full local loop, and compare the view from the junction, the main street, and the square.

#### 2.3.3 — Finish Lantern Harbor

**Build prompt.** Shape the waterfront around a usable crossing and two banks with distinct functions. Connect bridges, docks, shore paths, shops, and service yards. Leave clear vehicle access at the dock ramps and bridge ends. Place quay furniture and lanterns along the pedestrian edge, using them to show where the public paths go. Build an approach view that reveals the water and bridge before the player reaches the turn.

**Acceptance check.** Drive in from the island, cross each public bridge, and return along the shore. Check that deck surfaces and rail collisions line up and that the waterfront remains visible from the driving camera.

#### 2.3.4 — Add storefronts and side streets to Crossroads Village

**Build prompt.** Develop the square from 2.3.2 into a village centre with a market, distinct storefronts, houses, a quieter lane, and rear service access. Give buildings signs and a reason to face the street. Use doors, awnings, benches, planters, and delivery bays to make the street feel used. Reserve walking routes, gathering areas, and sheltered spots for 2.4.

**Acceptance check.** Follow a signed turn from the highway, drive around the square, find two distinct businesses, and leave via a side street. Verify that the hovercraft has room to turn without climbing kerbs or clipping scenery.

#### 2.3.5 — Finish Cherry Gardens and the orchard road

**Build prompt.** Use planting rows, orchard blocks, hedges, paths, and farm structures to give the area a recognisable layout. Connect a barn or packing shed to a service road, link that road to the village, and retain a separate space for the existing crate challenge. Leave habitat pockets near tree cover and clear approaches into the estate.

**Acceptance check.** Follow the village road to the garden, identify the orchard and service yard from the normal camera, and reach and retry the crate challenge without driving through the planted rows.

#### 2.3.6 — Build the northern forest and ridge district

**Build prompt.** Create a forest approach that opens onto a hillside lodge, cabins, and a signed ridge trail. Alternate enclosed woodland with clearings and broad views. Use slope-aware placement for the buildings and paths, provide a driveable pullout at the overlook, and reserve a ridge crest with a clear approach and landing for a later stunt.

**Acceptance check.** Drive from the highway through the trees to the lodge and take the ridge trail back. Check sightlines at crests and verify that trees and scenery stay outside the intended driving line.

#### 2.3.7 — Build the southern farms and market district

**Build prompt.** Connect farmsteads, barns, irrigated fields, and a roadside market with visible work lanes and a small number of crossings. Vary field size, orientation, and planting so the view changes as you drive. Reserve delivery pickup and drop-off areas with room to turn. Use hedges and irrigation lines to guide drivers toward safe entrances.

**Acceptance check.** Drive from the highway to a farmhouse, cross the irrigation route, and reach the market by a second road. Check that field access stays legible and that a future delivery route can use both approaches.

#### 2.3.8 — Build the western quarry and workshop district

**Build prompt.** Shape quarry benches, cuts, and haul roads around a workshop yard and the existing Meadow Stunt Park. Give the district a recognisable approach using terrain, buildings, and signage. Separate the through road, service yard, spectator space, and future stunt lines. Connect the park to the rest of the district without routing general traffic across jump approaches or landings.

**Acceptance check.** Enter through the workshop approach, follow a quarry loop, and reach the stunt park from the road. Check grades, collision at retaining walls, and the ability to turn back from the lowest point.

#### 2.3.9 — Fill the drives between districts

**Build prompt.** Review each highway from the driver's point of view and add scenery where the next destination disappears from view. Choose details that belong to the adjacent region, such as an orchard edge, wooded slope, trailhead, farm stand, or quarry access road. Vary the spacing and preserve clear sightlines through bends. Give quieter stretches a view, a terrain change, or a visible turnoff.

**Acceptance check.** Capture a continuous normal-speed drive along each route. Use the footage to identify and fix weak stretches. Include ordinary roadside views in the evidence alongside the main landmarks.

#### 2.3.10 — Add navigation and usable businesses

**Build prompt.** Add readable approach signs, map labels, and local directions for each district. Make at least one stop per district usable through an existing interaction pattern, such as a harbor route board, farm pickup point, lodge trail sign, or workshop trial start. Give each interaction a clear prompt and a safe place to stop.

**Acceptance check.** Starting on the island, find a selected stop using the map and signs, activate its interaction, then rejoin the highway. Verify that signs and map labels agree and remain useful without fast travel.

#### 2.3.11 — Fit buildings, paths, and collisions to the terrain

**Build prompt.** Audit large props, building entrances, bridges, fences, retaining walls, and marked shortcuts. Match collision to visible surfaces, ground the objects on slopes, and keep road joins smooth across streaming boundaries. Check spawning and unloading for large sites that occupy more than one terrain chunk.

**Acceptance check.** Drive representative junctions and bridges slowly and at boost where the route allows it. Leave and return to each district, checking for floating objects, invisible collisions, missing landmarks, and objects remaining after unload.

#### 2.3.12 — Review all four regions before population

**Build prompt.** Drive every main route and its local loops, review comparisons against the village benchmark, and fix the largest gaps in density, visibility, and local navigation. Mark the final gathering areas, wildlife pockets, crossings, and service routes for 2.4. Update any map labels and handoff notes changed by the review.

**Acceptance check.** Save normal-view evidence from each district and at least one stretch between districts per route. List every populated area planned for 2.4 and the closest signed turnoff for reaching it.

### 2.4 — People, wildlife, and ambient movement

#### 2.4.1 — Inventory character assets and plan population

**Build prompt.** Inspect the existing models, rigs, and animations for people, wildlife, and service vehicles. Identify which can be reused with a consistent visual style. For each district, define roles or species, gathering spots, routes, cover or refuge, and expected visible counts. Document missing models before committing to species or routines that need them.

**Acceptance check.** Every planned population group has a suitable model or a documented asset gap, a place to spawn, a safe space to move, and a route or habitat that makes sense for that location.

#### 2.4.2 — Build shared placement and streaming

**Build prompt.** Implement reusable spawn groups tied to district and terrain ownership. Ground characters at their spawn points, assign stable layouts on return, and cap the number active around the player. Keep one owner per group so overlapping terrain chunks do not duplicate characters. Clean up models, animation updates, and routes when their area unloads.

**Acceptance check.** Place demonstration groups in two adjacent districts. Drive back and forth across a loading boundary and verify counts, grounding, and cleanup.

#### 2.4.3 — Make Crossroads Village the busy population benchmark

**Build prompt.** Fill the square and adjacent street with customers, shopkeepers, walkers, and people waiting near suitable props. Give them staggered loops between storefronts, stalls, benches, and side streets. Start with **6–12 visible people** from the ordinary driving camera and adjust after watching the scene from several approaches.

**Acceptance check.** Park near the square and observe a full routine cycle, then drive a loop through the village. Check for dead corners, synchronized movement, crowd clumping, and characters walking through buildings.

#### 2.4.4 — Give each region different human activity

**Build prompt.** Extend the village routines with work-specific stops: dock workers near quays, farm workers near sheds and rows, lodge visitors near trailheads, and workshop staff and spectators at the quarry and park. Vary how long people stay at each stop. Use smaller groups at outposts and reserve busier groups for public spaces.

**Acceptance check.** Visit one busy and one quiet stop in each region. The activity should suit the place and be visible from the road or a natural pullout.

#### 2.4.5 — Add believable wildlife in orchards and fields

**Build prompt.** Use verified animal models for groups near orchard cover, field edges, and hedges. Implement short bouts of wandering, resting, and regrouping. Ground animals on uneven terrain, space individuals so they stay recognisable, and keep spawn points within cover or visible habitat. Start with **3–6 visible animals** in an active habitat and tune from the gameplay camera.

**Acceptance check.** Approach from two local roads and stop to observe the group. Confirm that the animals are recognisable, move independently, and stay clear of buildings and crop walls.

#### 2.4.6 — Extend wildlife to forest and waterfront habitats

**Build prompt.** Add forest groups near clearings and safe shoreline groups where suitable assets exist. Give habitats different movement areas, cover, and ways for the player to spot them. Keep ground animals on land, away from steep cuts, and outside high-speed approach lanes. Place viewpoints or pullouts where wildlife can be observed naturally.

**Acceptance check.** Visit the habitats from their intended approach roads. Confirm that each group stays in its habitat, appears from a practical viewing distance, and behaves consistently on return.

#### 2.4.7 — React to the hovercraft

**Build prompt.** Detect approaching vehicles early enough for people to step aside and for animals to scatter toward cover. Use a bounded refuge route with a short recovery period before routine movement resumes. Tune the response using approach direction and speed so a parked hovercraft does not keep everyone scattering. Provide reactions for nearby ambient impacts where they fit the habitat.

**Acceptance check.** Try a slow approach, a normal pass, and a fast pass along an adjacent road. Check that reactions are readable, characters do not move into the hovercraft's path, and routines resume afterward.

#### 2.4.8 — Add occasional service traffic

**Build prompt.** Add a small number of service vehicles with predictable loops between workshops, farms, or harbor service roads. Define pullouts and turnaround space. Give vehicles simple following and yielding behaviour where their roads meet. Keep them away from timed activity courses, designated boost lanes, and jump landings.

**Acceptance check.** Follow a service vehicle through a complete route and test a junction encounter from both directions. Confirm the player can pass safely and that traffic resets cleanly after leaving and returning.

#### 2.4.9 — Coordinate population with activities and hazards

**Build prompt.** Set explicit areas where spectators may gather, where traffic may pass, and where characters should stay clear during a race, jump, or crate challenge. Ensure ambient meteor targeting and evacuation behaviour keep routes readable near busy areas. Resume normal routines after completion, cancellation, or respawn.

**Acceptance check.** Start, finish, abandon, and retry an activity beside a populated district. Observe an ambient hazard in free roam and confirm the population and activity states recover correctly.

#### 2.4.10 — Tune visibility, density, and performance

**Build prompt.** Measure crowd and wildlife counts from normal gameplay, then tune visibility distance, update frequency, and group size on representative desktop and touch configurations. Preserve lively views near the player and reduce work farther away. Watch for delayed spawns when approaching a district at boost and for abrupt disappearance in clear view.

**Acceptance check.** Compare busy squares, habitats, quiet routes, and fast approaches. Record frame-time observations and visible counts, and adjust the density where the scene looks empty or performance drops.

#### 2.4.11 — Prove the world feels alive on return visits

**Build prompt.** Run a full population playtest across all four regions. Park, drive through, leave the streaming area, and return to each major district. Fix repeated choreography, duplicates, stuck characters, empty activity hotspots, and reactions that look wrong at normal camera distance. Document unresolved asset limitations and any scenes that need later improvement.

**Acceptance check.** Provide an in-game clip or screenshot sequence of a busy square, rural work area, wildlife habitat, and service route. Confirm that characters move and react in play and that revisiting districts restores the intended population.

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
