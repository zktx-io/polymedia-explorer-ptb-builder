# Polymedia Explorer

![Polymedia Explorer](./src/explorer/public/img/open-graph.webp)

A fork of the original Sui Explorer, which has been discontinued by Mysten Labs.

# Installation

```bash
pnpm install
```

# top-level pnpm commands

### `pnpm lint`

Run linting check (ESLint).

### `pnpm lint -- --fix`

Run linting check (ESLint) and fix errors when possible.

### `pnpm clean`

Delete `dist/`, `node_modules/`, etc.

# src/explorer pnpm commands

### `pnpm dev`

Start the dev server on http://localhost:3000/

### `pnpm build`

Builds the app for production to the `build` folder.

It bundles React in production mode and optimizes the build for the best performance.

### `pnpm preview`

Build the app for production and serve it on on http://localhost:3000/

### `pnpm typecheck`

Run TypeScript compiler to perform a type check on the project

### `pnpm test`

Run end-to-end browser tests using the website as connected to the static JSON dataset.

### `pnpm tunnel`

Expose the local server on port 3000 to the internet using Localtunnel.

## To run end-to-end localnet test

Start validators locally:

```bash
cargo run --bin sui-test-validator
```

In a a separate terminal, you can now run the end-to-end tests:

```bash
pnpm --filter sui-explorer playwright test
```
