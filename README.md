# Polymedia Explorer

![Polymedia Explorer](./src/explorer/public/img/open-graph.webp)

A fork of the original Sui Explorer, which was discontinued by Mysten Labs.

## Installation

```bash
pnpm install
```

## pnpm commands - top level

Run these commands from the root directory of the repository.

### `pnpm lint`

Run linting check (ESLint).

### `pnpm lint -- --fix`

Run linting check (ESLint) and fix errors when possible.

### `pnpm clean`

Delete `dist/`, `node_modules/`, etc.

## pnpm commands - src/explorer

Run these commands from the [./src/explorer/](./src/explorer/) directory.

### `pnpm dev`

Start the dev server on http://localhost:3000/

### `pnpm build`

Build the app for production to the `dist` folder.

### `pnpm preview`

Build the app for production and serve it on on http://localhost:3000/

### `pnpm typecheck`

Run the TypeScript compiler to perform a type check on the project.

### `pnpm test`

Run end-to-end browser tests using the website as connected to the static JSON dataset.

### `pnpm tunnel`

Expose the local server on port 3000 to the internet using Localtunnel.

## How to update the repo

```bash
pnpm upgrade --latest --recursive
cd src/explorer
pnpm add @headlessui/react@1 react-resizable-panels@0.0.39 prism-react-renderer@1 vite-plugin-svgr@3
```

TODO: upgrade the dependencies above to their latest versions.
