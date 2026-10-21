# Project Architecture

Low Orbit is a 3D spaceship flying game: React 19 renders the UI overlay, React
Three Fiber renders the scene, and an imperative "game loop" layer in
`src/config/` drives flight physics from module-level state.

## Directory layout

```
index.html              Vite entry, mounts src/main.tsx
src/
  main.tsx              React root (StrictMode), global CSS
  App.tsx               Game state: started, targetsLeft, controlsVisible
  index.css             All styling (plain CSS, no framework)
  components/
    scene/              Everything inside the R3F <Canvas>
    ui/                 DOM overlay (buttons, HUD, control hints)
  config/               Framework-free game logic and input state
public/
  assets/               Models (.glb), cubemap images (.avif), sounds (.mp3)
vite.config.ts          Build config + Vite+ fmt/lint/staged blocks
```

## Layers

| Layer      | Location            | Responsibility                                                                                 |
| ---------- | ------------------- | ---------------------------------------------------------------------------------------------- |
| UI state   | `App.tsx`           | Start/restart flow, target counter, controls visibility. Plain React state.                    |
| Scene      | `components/scene/` | Canvas contents: ship, targets, camera, lighting, skybox, dust, audio, post-processing.        |
| Overlay UI | `components/ui/`    | Pure presentational DOM components over the canvas.                                            |
| Game core  | `config/`           | Input state, flight physics, ship bounds. No React imports; shared as module-level singletons. |

## Scene composition

`SpaceScene.tsx` is the canvas root and composes:

- `CameraController` — per-frame flight math; attaches keyboard/touch listeners,
  writes the ship and camera matrices directly (`matrixAutoUpdate = false`), and
  exports `spaceshipPosition` as the shared position other systems read.
- `Spaceship` — GLTF model; on load measures its bounding sphere into
  `config/shipBounds.ts` so the camera can frame it by aspect ratio.
- `Targets` — 20 randomized tori merged into one geometry; each frame it checks
  the ship against them, plays a ping, removes hits, and reports the count up
  to `App`.
- `SpaceDust`, `Lighting`, `Skybox` — particle field (600k points), directional
  lights, AVIF cubemap environment.
- `EngineAudio`, `MotionBlur`, `Bloom` — turbo-reactive engine sound, a custom
  post-processing effect, and bloom; the first two read the `turbo` export from
  `config/updateSpaceshipAxis.ts`.
- `Perf` overlay, dev builds only.

## Game core (`src/config/`)

| File                                          | Role                                                                                              |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `controls.ts`, `touchState.ts`                | Mutable key-state maps for keyboard and touch.                                                    |
| `attachControls.ts`, `attachSwipeControls.ts` | DOM event listeners (WASD/shift keys, swipes, two-finger turbo); each returns a cleanup function. |
| `updateSpaceshipAxis.ts`                      | Flight physics: yaw/pitch velocities, damping, turbo, reset. Exports `turbo` and `requestReset`.  |
| `shipBounds.ts`                               | Mutable `shipRadius` shared between the model and the camera FOV calculation.                     |

## Data flow

```
DOM events ─▶ controls / touchState (module state)
                     │
                     ▼
        updateSpaceshipAxis()   called each frame from CameraController.useFrame
                     │
        ┌────────────┼──────────────┐
        ▼            ▼              ▼
  ship matrices  spaceshipPosition  turbo
        │            │              │
        │            ▼              ├──▶ EngineAudio (playback rate)
        │       Targets (collisions)└──▶ MotionBlur (effect strength)
        │            │
        ▼            ▼
     camera      setTargetCount ─▶ App state ─▶ HUD / Restart button
```

The split matters: React owns UI and lifecycle, but nothing per-frame goes
through React state — the loop reads and writes module singletons directly.

## Tooling

- **Vite+** (`vp`): dev server, build, format (Oxfmt), lint (Oxlint),
  type-aware checking, staged-file hooks. Config lives in `vite.config.ts`.
- **Bun**: package manager (`packageManager: bun@1.4.3`), lockfile `bun.lock`.
- **TypeScript**: `tsc -b` runs as part of `bun run build`.
