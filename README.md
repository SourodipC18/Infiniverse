# INFINIVERSE

**Every World Contains Another.**

A browser exploration game, beginning with a 1 × 1 km alien island, a hovercraft, and a seamlessly repeating ocean.

## Current status

**Phase 1 — game design is complete.** Gameplay implementation starts in Phase 2.

Read the [Phase 1 game design](docs/PHASE_1_GAME_DESIGN.md) for the map layout, controls, ocean wrapping, hazards, respawn rules, architecture, and acceptance checks.

## First playable release

- Pilot an original hovercraft across land and water.
- Explore five landmarks in a 1 × 1 km island region.
- Activate three beacons and return to the starting dock.
- Travel through a surrounding ocean that wraps back to the same region.
- Avoid a moving storm and an electrical hazard field.
- Restart at the dock, with run progress reset, after hitting a danger.
- Use desktop or touch controls with adjustable graphics and optional sound.

These are planned features, not implemented features.

## Development roadmap

| Phase | Deliverable | Status |
| --- | --- | --- |
| 1 | Game design and first-release scope | Complete |
| 2 | Application, hovercraft controls, and camera | Planned |
| 3 | Island, ocean, landmarks, and beacons | Planned |
| 4 | Seamless repeating world | Planned |
| 5 | Hazards, restart, and completion | Planned |
| 6 | Visual polish, mobile support, and QA | Planned |
| 7 | Verified production publication | Planned |

The larger procedural universe and nested world zoom remain future expansions after this playable slice.

## Planned technology

React, TypeScript, Vite, Three.js, React Three Fiber, drei, and Zustand.
Vitest and Playwright will support focused checks as implementation proceeds.

## Setup and verification

This repository currently contains design documentation. There is no runnable application or installation command yet. Setup instructions will be added with the Phase 2 implementation.

No gameplay, browser, or performance tests have been run yet. Performance goals in the design are targets, not measurements.

## Vercel

**Live URL: pending.**

Vercel team authorization is required before the connected account can inspect or create the intended project. A verified deployment URL will be added here once available. Any early design preview will be labelled separately from the playable game.

## References

- [Bruno Simon](https://bruno-simon.com/) — playful vehicle exploration in an interactive 3D world.
- [Island Explorer](https://www.ericrhea.com/island-explorer.html) — browser landscape and exploration reference.

All game assets and implementation will be original or appropriately licensed.
