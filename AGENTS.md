# Developing `@luminix/mui-cms`

React + Material-UI admin panel for a Luminix application. `src/` is the whole product; everything
else here is tests, documentation or packaging.

## Two audiences, two trees

| Tree | Written for | Language | Ships |
|---|---|---|---|
| `agents/AGENTS.md` + `agents/references/` | an agent **consuming** the package in an app | English | yes, copied into `dist/` |
| `AGENTS.md` (this file), `CLAUDE.md` | an agent **developing** the package | English | no |
| `README.md` | a human landing on npm | Portuguese | npm always ships it |
| `docs/` | a human reading at tutorial length | Portuguese | no |

`.npmignore` decides the rest. The boundary check, from a tree with a built `dist/`:

```bash
npm pack --dry-run 2>&1
```

The listing must contain `dist/AGENTS.md` and `dist/references/*.md`, and must contain none of
`AGENTS.md`, `CLAUDE.md`, `agents/`, `src/`, `docs/`. The entries that could also match a built
artefact are anchored — `/AGENTS.md`, not `AGENTS.md` — because `.npmignore` follows gitignore
semantics and an unanchored pattern matches at every depth: a bare `AGENTS.md` takes
`dist/AGENTS.md` with it and ships a package whose guide is silently missing. Anchor any new entry
whose name could recur under `dist/`.

The consumer guide travels next to the compiled bundle because an npm package ships no Claude Code
skill: `postbuild` copies `agents/` into `dist/`, and a consumer's agent reads it at
`node_modules/@luminix/mui-cms/dist/AGENTS.md`. It is attached to `build`, not to `build:dist`, so
running `build:dist` alone leaves a `dist/` without the guide.

## Writing `agents/`

- update it when a change is observable from a consuming app: a reducer name, a `componentMap` slot,
  a route name, a config key, a default action, an exported hook, a query-string contract. Internal
  refactors leave it alone
- an API described there that `src/` does not have is a bug in `agents/`
- it describes the behaviour of this commit. What an older release did belongs to the release notes
- every sentence serves the reader's current task and says something the agent could not get from a
  glance at the repository
- describe the package, not the documentation system: no prose about where the guide ships from,
  how it is built or copied, or what else exists in the ecosystem. Name the neighbouring package
  when the answer lives outside this one

## Working here

**The package builds twice, from two entry points, for two ways of consuming it.**

| Script | Entry | Output | For |
|---|---|---|---|
| `build:bundle` | `src/main.tsx` | `bundle/`, IIFE, global `LuminixMuiCms` | a Laravel app with no frontend build — `luminix/admin` serves the file and the panel mounts itself on `#root` |
| `build:dist` | `src/dist.ts` | `dist/` ESM + `types/` | an app that bundles its own frontend and imports `LuminixCms` |

They differ in what they inline. `vite.config.bundle.ts` externalises nothing: React, MUI, i18next
and every `@luminix/*` peer are baked in, along with the Roboto faces and the form stylesheet that
`main.tsx` imports. `vite.config.ts` externalises every `peerDependencies` key plus
`react/jsx-runtime`, `@mui/material/styles`, `react-is`, `object-assign` and `prop-types`, and emits
declarations through `vite-plugin-dts`. A regression that only shows up in one of the two is almost
always something added to or removed from that externals list.

`npm run dev` has no entry document — there is no `index.html` in the tree — so there is no demo app
to open. Exercise a change through the tests, or against a host application.

Tests are vitest on jsdom. `vitest.config.ts` aliases `@luminix/core`, `@luminix/react` and
`@luminix/support` to their **built** `dist/` inside `node_modules`, so a change made in a sibling
package is invisible here until that package is rebuilt.

`version` in `package.json` is deliberately empty; CI stamps it.

A change here is finished when it carries its tests and its documentation: the vitest suite under
`src/__tests__/`, `agents/` when the change is observable from a consuming app, and `docs/` in the
Portuguese tutorial style it already uses. Skip either only when asked to.

## Git

- `v1.x` is the release branch; work on `feat/`/`fix/` branches and merge into it
- every push to `v1.x` runs the tests, builds, publishes to npm as `latest` and cuts a tag +
  Release. `v0.x` does the same as `beta` and a prerelease — and skips the test step
- semver comes from the commit subject: `(MAJOR)` -> major, `(MINOR)` -> minor, absence -> patch
- commit messages and branch names in português
