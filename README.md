# Low Orbit

A 3D spaceship flying game built with React Three Fiber.

**Live Demo:** [Low Orbit](https://low-orbit.pages.dev/)

## Tech Stack

| Layer                         | Technology                  |
| ----------------------------- | --------------------------- |
| Framework                     | React 19 + TypeScript       |
| 3D Rendering                  | React Three Fiber, Three.js |
| R3F Helpers / Post-Processing | Drei, Postprocessing        |
| Build                         | Vite+ (Vite 8 + Rolldown)   |
| Linter / Formatter            | Vite+ (Oxlint + Oxfmt)      |
| Package Manager               | Bun                         |

## Commands

This project uses [Vite+](https://viteplus.dev) (`vp`) as its unified toolchain and [Bun](https://bun.sh) as its package manager.

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `bun install`     | Install dependencies                     |
| `bun run dev`     | Start the development server             |
| `bun run build`   | Type-check and build for production      |
| `bun run preview` | Preview the production build locally     |
| `bun run check`   | Format, lint, and type-check the project |
| `bun run fmt`     | Format code with Oxfmt                   |
| `bun run lint`    | Lint code with Oxlint                    |

Most scripts wrap the matching Vite+ built-in. The `build` script also runs `tsc -b`; use `vp run build` to include that type check.

A pre-commit hook runs `vp check --fix` on staged files, so formatting and lint fixes are applied automatically when you commit.
