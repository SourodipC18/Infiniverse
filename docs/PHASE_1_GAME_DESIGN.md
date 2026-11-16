# INFINIVERSE — Phase 1 game design

Status: Phase 1 design complete; implementation begins in Phase 2.
Date: 2026-11-16
Repository: https://github.com/SourodipC18/Infiniverse

## 1. First-release direction

Build a browser exploration game inspired by the hands-on, scene-first interaction of Bruno Simon's portfolio. The player pilots a small hovercraft across a 1 × 1 km island region and its surrounding ocean. The ocean wraps continuously. Clearly marked dangers end the current run and return the player to the original dock.

This is the current implementation scope agreed through the project discussion. The original recursive cosmic universe remains a future direction. Nested world zoom, twelve procedural world types, and AI generation are deferred beyond this first release.

The following vehicle, palette, landmarks, and objective are concrete design defaults selected for this first slice; they can be adjusted before their implementation.

## 2. Player experience and objective

1. Arrive at the dock in the hovercraft with a short controls overlay.
2. Learn steering in a safe area and follow the first visible beacon.
3. Explore the island and activate three beacons at the lookout, ruins, and crystal grove.
4. Navigate around a moving storm and an electrical hazard field.
5. Return to the starting dock with all three beacons activated to complete the run.
6. Continue exploring after success, or explicitly start a new run.

Target first successful run: approximately 5–10 minutes, to be validated through playtesting rather than treated as a measured result. Exploration has no time limit. The HUD shows beacon progress and the current objective.

The world is spatially repeating: travelling farther eventually brings the player back to familiar places. This creates continuous travel, with a finite authored region and bounded resource use. The first release does not promise unlimited unique terrain.

## 3. Vehicle and controls

Use a compact, original hovercraft that travels over both land and water. Its silhouette should be readable from the chase camera, with a cyan engine glow and simple animated thrusters.

| Input | Action |
| --- | --- |
| W / Up | Accelerate |
| S / Down | Brake; reverse at low speed |
| A, D / Left, Right | Steer |
| Shift | Boost while held |
| Mouse drag | Orbit the chase camera |
| Mouse wheel | Adjust camera distance within safe limits |
| E | Activate a nearby beacon or dock interaction |
| R | Restart the run |
| Escape | Pause and open settings |
| Mobile left thumb stick | Steer and accelerate |
| Mobile right buttons | Boost, brake, interact |
| Mobile drag outside controls | Orbit the camera |
| Mobile two-finger pinch outside controls | Adjust camera distance |

Initial tuning targets: cruise speed 12 metres/second; boost 22 metres/second. Acceleration, drag, steering, and camera damping are time-based. Tune these values in Phase 2.

The camera follows behind and above the craft, permits temporary orbit, and returns gently behind it when movement resumes. Limit pitch and zoom to avoid passing below terrain. Losing focus clears held input and pauses the game so the craft cannot drift into danger off-screen.

Use a lightweight arcade movement controller first. Ordinary terrain and props block or deflect movement; only explicitly dangerous objects cause failure. Visual hover and tilt do not require a full rigid-body vehicle simulation.

## 4. Region layout

Use metres as design units: one scene unit equals one metre.

The island's authored region occupies a 1,000 × 1,000 metre footprint, centred on (0, 0). Its coastline is irregular and falls within that footprint. A 300 metre ocean margin on each side gives the repeating cell a 1,600 × 1,600 metre period.

Coordinates below are horizontal map coordinates (x, z), not altitude. They are initial layout anchors, subject to terrain and playtest adjustments.

| Landmark | Approximate position | Purpose |
| --- | --- | --- |
| Starting dock | (-260, 180) | Spawn, tutorial, return objective |
| Ridge lookout | (-180, -220) | First beacon; long-distance orientation |
| Ancient ruins | (190, -210) | Second beacon; electrical hazard nearby |
| Crystal grove | (250, 120) | Third beacon; colour and lighting focal point |
| Central causeway | (40, 30) | Connect routes; sheltered alternate path |

A safe route connects all three beacons. Optional shortcuts pass closer to hazards. Low slopes and clear routes keep the craft controllable. Tall landmarks help players orient without needing a full minimap.

Conceptual layout, not a surveyed terrain drawing:

```text
                  NORTH
         ~~~~~~~~~~~~~~~~~~~~~
         ~  Lookout   Ruins  ~
         ~     \\       /     ~
         ~      Causeway    ~
         ~     /       \\    ~
         ~  Dock     Grove  ~
         ~~~~~~~~~~~~~~~~~~~~~
             surrounding ocean
```

## 5. Seamless ocean loop

Maintain a stable local coordinate space with a repeat period of 1,600 metres in x and z. When the player crosses a cell boundary, translate the player and camera together by one period. Preserve velocity, heading, camera offset, and input state.

To prevent visible jumps, render nearby translated copies of the same region wherever they fall inside the view distance. Reuse geometry and materials. Ocean appearance and ambient effects must remain continuous across the boundary. Fog helps the horizon, but the loop must not rely on a fade or loading screen.

Only the logical region owns state. A beacon seen in a neighbouring visual copy is the same beacon, not another collectible. Queries for collisions and interaction use the nearest periodic copy. Hazards, labels, shadows, trails, and camera targets must follow the same wrap convention. Normalize coordinates for very long sessions rather than letting positions grow indefinitely.

Verification planned for Phase 4:
- Cross all four edges at cruise and boost speed.
- Cross each corner diagonally.
- Wrap while orbiting the camera and while reversing.
- Confirm no camera snap, frozen input, duplicate beacon count, or ocean seam.
- Confirm interaction and collisions still work on both sides of a boundary.
- Complete at least 50 boundary crossings while checking memory and object counts.

## 6. Dangers and restart rules

### Hazard A: moving storm

One storm follows a bounded, predictable route offshore. A visible cloud column and water disturbance mark its danger radius. The first version uses a deterministic route, making its behaviour repeatable for debugging. A warning appears before the craft enters the fatal zone.

### Hazard B: electrical field

A cluster of illuminated pylons near the ruins creates a clearly marked fatal zone. A safe route remains available around it. Animated warning pulses and an icon communicate danger without relying on colour alone.

### Failure behaviour

Entering either fatal zone stops the run. Brief feedback identifies the cause, followed by automatic respawn at the original dock. A restart button provides the same reset intentionally.

Reset player position, heading, velocity, camera target, activated beacons, run timer, and hazard timeline. Retain only preferences such as sound, graphics, and tutorial dismissal. No mid-run checkpoints in the first version: failure means starting the challenge again.

Keep the spawn area hazard-free, clear stale input on respawn, and restore control predictably. Reduced-motion mode replaces flashes and camera shake with a restrained visual indicator. Restart must work repeatedly without duplicating event listeners, objects, or audio.

## 7. Visual and sound direction

A stylized alien island at twilight: dark indigo sea, teal shallows, violet rock, cyan hovercraft illumination, and warm gold beacon lights. Use simple, strong shapes with a few memorable landmarks. Aim for a cohesive world that is readable while moving.

Priorities:
1. Terrain silhouette, route readability, hovercraft silhouette, and camera.
2. Ocean motion, sky gradient, lighting, fog, and beacon glow.
3. Restrained particles, hover trails, and optional bloom where performance allows.

The interface stays small: branding and objective at top left, pause/sound/settings at top right, and contextual controls near the bottom. Mobile controls leave the centre of the scene clear.

Sound is optional and begins only after a user interaction. Initial sounds: engine hum, beacon activation, hazard warning, and respawn. Use original or appropriately licensed assets. Honour reduced-motion preferences and supply Low, Medium, High, and Auto graphics settings.

## 8. Architecture and expansion

Planned stack: React, TypeScript, Vite, Three.js, React Three Fiber, drei, and Zustand. Choose compatible stable package versions when scaffolding in Phase 2 and commit the lockfile. Add dependencies only for a demonstrated need.

Separate:
- game simulation: movement, time step, collision, hazard state, restart;
- world data: terrain description, landmarks, routes, spawn, periodic cell;
- rendering: terrain meshes, ocean, craft, effects, neighbouring visual copies;
- input: keyboard, pointer, touch, pause and focus handling;
- interface: onboarding, objective, settings, failure and completion feedback;
- persistence: local preferences, versioned for later changes.

Use a fixed simulation step with a capped catch-up budget, and interpolate rendering where needed. Pause/resume must not cause a large physics jump. Treat configuration as data so new regions and hazards can be added without rewriting the controller.

Later expansion can introduce a region registry and ocean routes that select another region. Keep each region in its own stable local coordinates. Seamless neighbouring regions will need compatible coastlines and explicit connection rules; increasing the map is not just changing a size constant.

Deferred: multiplayer, accounts, cloud saves, Gemini integration, recursive world zoom, procedural cities, combat, inventories, and complex physics.

## 9. Performance and test plan

Performance goals, not results:
- Aim for 60 FPS on capable desktop hardware.
- Aim for an interactive 30 FPS floor on selected mobile test devices.
- Cap pixel ratio and reduce shadows/effects for lower graphics tiers.
- Reuse geometry and materials for repeated regions; unload discarded resources.
- Keep input responsive during asset preparation.
- Avoid growth in scene objects, listeners, or retained resources across repeated runs.

Record actual device, browser, graphics tier, test duration, frame timing and available memory indicators. Do not infer real mobile performance from desktop device emulation.

Planned checks:
- TypeScript validation and production build.
- Focused unit tests for periodic coordinates, beacon deduplication, and restart state.
- Browser checks for movement, interactions, failure, restart, pause, and settings.
- Touch-control checks in emulation plus a physical mobile device when available.
- At least 50 boundary crossings and 50 hazard/restart cycles.
- Refresh and focus-loss behaviour; no unhandled console errors or WebGL context loss.
- Live deployment smoke check after publication.

No implementation or performance tests were run in Phase 1 because it contains design documentation only.

## 10. Delivery phases and completion gates

| Phase | Work | Completion gate |
| --- | --- | --- |
| 1 — Design | This specification, scope and roadmap | Concrete game design committed to GitHub |
| 2 — Foundation | App setup, hovercraft, controls, chase camera | Craft moves reliably in a simple scene |
| 3 — Region | Terrain, ocean, five landmarks, three beacons | Complete navigable region and objective |
| 4 — Ocean loop | Periodic rendering, coordinates and collisions | All boundary and corner cases pass |
| 5 — Challenge | Two hazards, failure, restart, completion | Full run can succeed or fail and restart |
| 6 — Polish and QA | Visuals, sound, settings, mobile, performance | Build and agreed browser checks pass |
| 7 — Publication | GitHub release documentation and Vercel deployment | Live build verified and linked in README |

Review the actual usage meter between phases. No credit total or one-week completion guarantee is assumed. Agree on the next phase's scope before adding optional features.

## 11. References and interpretation

- [Bruno Simon](https://bruno-simon.com/): reference for an interactive 3D world that serves as the website, playful vehicle exploration, and discoverable places. Our vehicle, world, art, and objective will be original.
- [Island Explorer](https://www.ericrhea.com/island-explorer.html): reference for a coherent browser landscape, cinematic camera, and explorable terrain.
- [Aethergate](https://aethergate.cloud/): reference for the broader procedural space direction planned beyond the first region.
- [Zoomquilt](https://zoomquilt.org/): reference for the original project's sense of continuous travel; recursive zoom is deferred.

These references inform the design, not a promise that our first release matches their content volume or finish. No proprietary source or assets are included.

## 12. Hosting status

A live Vercel URL has not been verified. The connected Vercel account rejected project inspection with HTTP 403 for the intended team, requiring team authorization. No deployment success or URL is assumed.

Phase 1 is a design document. The first playable application starts in Phase 2. If an early Vercel preview is published before the playable build, it must be labelled as a design preview and must not claim gameplay is implemented.
