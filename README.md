# Low Orbit

A 3D spaceship flying game built with React Three Fiber.

**Live Demo:** [Low Orbit](https://low-orbit.pages.dev/)

## Tech Stack

| Layer                         | Technology                  |
| ----------------------------- | --------------------------- |
| Framework                     | React 19 + TypeScript       |
| 3D Rendering                  | React Three Fiber, Three.js |
| R3F Helpers / Post-Processing | Drei, Postprocessing        |
| Build                         | Vite+ (Vite 8)              |
| Package Manager               | Bun                         |
| Linter / Formatter            | Oxlint / Oxfmt (via Vite+)  |

## Commands

This project uses [Vite+](https://viteplus.dev) (`vp`) as its unified toolchain and [Bun](https://bun.sh) as its package manager.

| Command            | Description                                                 |
| ------------------ | ----------------------------------------------------------- |
| `bun install`      | Install dependencies                                        |
| `bun run dev`      | Start the dev server                                        |
| `bun run build`    | Type-check (`tsc -b`) and build for production              |
| `bun run preview`  | Preview the production build                                |
| `bun run fix`      | Fix formatting, then lint and type-check (`vp check --fix`) |
| `bun run vp check` | Verify only: format + lint + type check                     |
| `bun run vp fmt`   | Format files                                                |
| `bun run vp lint`  | Lint files                                                  |
