# INFINIVERSE

**Every World Contains Another.**

A browser exploration game, beginning with a 1 × 1 km alien island, a hovercraft, and a seamlessly repeating ocean.

## Current status

**Phase 2 is playable locally.** The hovercraft test range has a marked gate, a bounded practice area, and live speed and position readouts.

Read the [Phase 1 game design](docs/PHASE_1_GAME_DESIGN.md) for the map layout, controls, ocean wrapping, hazards, respawn rules, architecture, and acceptance checks.

## First playable release

- Pilot an original hovercraft across land and water.
- Explore five landmarks in a 1 × 1 km island region.
- Activate three beacons and return to the starting dock.
- Travel through a surrounding ocean that wraps back to the same region.
- Avoid a moving storm and an electrical hazard field.
- Restart at the dock, with run progress reset, after hitting a danger.
- Use desktop or touch controls with adjustable graphics and optional sound.

The test range is available now. The island, beacons, repeating ocean, and hazards are later milestones.

## Development roadmap

| Phase | Deliverable | Status |
| --- | --- | --- |
| 1 | Game design and first-release scope | Complete |
| 2 | Application, hovercraft controls, and camera | Complete |
| 3 | Island, ocean, landmarks, and beacons | Planned |
| 4 | Seamless repeating world | Planned |
| 5 | Hazards, restart, and completion | Planned |
| 6 | Visual polish, mobile support, and QA | Planned |
| 7 | Verified production publication | Planned |

The larger procedural universe and nested world zoom remain future expansions after this playable slice.

## Run the prototype

Use Node.js 22.12 or newer and pnpm 11.25.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Vite and select **Start flight**. The game requires WebGL 2.

| Control | Action |
| --- | --- |
| WASD or arrow keys | Accelerate, brake, reverse, and steer |
| Hold Shift while accelerating | Boost |
| Drag the scene | Orbit the chase camera |
| Scroll or pinch | Adjust the camera distance |
| R or Reset | Return to the launch pad |
| Escape or Pause | Pause or resume flight |
| On-screen hold buttons | Steer, accelerate, brake, and boost on touch screens |

Phase 2 uses React, TypeScript, Vite, Three.js, and React Three Fiber. The flight simulation runs at a fixed time step and is separate from input handling and scene rendering.

`pnpm build` runs the TypeScript check and creates the production bundle. The Phase 2 browser check covered keyboard acceleration and release, turning, camera orbit and zoom, pause, and reset. The on-screen accelerator was exercised with pointer input at a 390px viewport. Physical phone and pinch testing are pending.

## Vercel

[Open the Phase 1 design preview](https://infiniverse-saurodip-chowdhurys-projects.vercel.app). Vercel sign-in is required. The Phase 2 test range runs locally.

## References

- [Bruno Simon](https://bruno-simon.com/) — playful vehicle exploration in an interactive 3D world.
- [Island Explorer](https://www.ericrhea.com/island-explorer.html) — browser landscape and exploration reference.

All game assets and implementation will be original or appropriately licensed.
