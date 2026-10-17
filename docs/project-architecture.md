# Project Architecture

A single-page [React Three Fiber](https://r3f.docs.pmnd.rs) game: fly a spaceship through 20 ring targets in an endless starfield.

## Composition

`index.html` → `src/main.tsx` → `src/App.tsx`

- **`App.tsx`** owns the React UI state (`started`, `targetsLeft`, `controlsVisible`), renders the UI overlay, and mounts `SpaceScene` once the flight starts.
- **`components/scene/SpaceScene.tsx`** is the R3F `<Canvas>`. It composes every scene object and the post-processing chain. `Spaceship` and `CameraController` share one `meshRef`.

## State Model

React state holds UI and discrete game events (such as target hits); frame-rate simulation state lives in mutable module singletons in `src/config/`, so the render loop never triggers re-renders.

| Module                   | Key exports               | Role                                                        |
| ------------------------ | ------------------------- | ----------------------------------------------------------- |
| `controls.ts`            | `controls`                | Keyboard input flags                                        |
| `touchState.ts`          | `touchState`              | Swipe/touch input flags                                     |
| `shipBounds.ts`          | `shipRadius`              | Ship radius from the GLB bounding sphere; drives camera FOV |
| `updateSpaceshipAxis.ts` | `turbo`, `requestReset()` | Flight physics and reset signal                             |

`CameraController` additionally exports the shared `spaceshipPosition` vector, read by `Targets` for collision checks.

## Frame Loop

Each `useFrame` tick mutates Three.js objects in place (`matrixAutoUpdate = false`):

1. **`CameraController`** — reads `controls`/`touchState`, advances the ship basis vectors and position via `updateSpaceshipAxis`, writes the ship matrix, then derives the camera matrix from a slerped ("delayed") rotation for smoothing.
2. **`Targets`** — tests `spaceshipPosition` against each torus; hits are removed from React state and play a sound.
3. **`EngineAudio`** / **`MotionBlur`** — follow `turbo` for playback pitch and blur strength.

## Input

- `attachControls` — keyboard (`wasd`, `shift` for turbo).
- `attachSwipeControls` — touch drag to steer, two fingers for turbo.
- Both are attached in a `CameraController` effect, add window listeners, and write directly into the shared config state.

## Assets & Post-Processing

- `public/assets/` — skybox cube faces (`.avif`), `spaceship.glb`, and `.mp3` sounds.
- `EffectComposer` runs a custom `MotionBlur` effect (turbo-driven) plus `Bloom`.
- `r3f-perf` renders in dev only (`import.meta.env.DEV`).

## Build

- TypeScript project references: `tsconfig.app.json` for `src`, `tsconfig.node.json` for `vite.config.ts`.
- No path aliases; imports are relative.
- Styling is a single global `src/index.css` (plain classes, no CSS modules).
