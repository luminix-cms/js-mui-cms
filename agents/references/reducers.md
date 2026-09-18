# Reducers — the extension mechanism

Every list the panel builds is passed through a chain of callbacks before it is used. Registering a
callback is the only supported way to change what the panel shows.

```ts
const unsubscribe = Cms.reducer('menuItems', (items, models) => [...items, myItem], 10);
```

The first argument of the callback is the accumulated value and must be returned; the rest are
context. Mutating the value in place also works — the chain runs inside an Immer draft — but
returning a new array is clearer. The call returns an unsubscribe function.

## Priority

Chains run in ascending priority order; `10` is the default.

| Priority | Who uses it |
|---|---|
| `0` | this package's defaults |
| `1`–`9` | package integrations |
| `10` | app customisations |
| `99` | this package's translation pass over labels |
| `> 99` | a customisation that must win over everything, translation included |

Two consequences. A reducer that must see the final value — wrapping a component, replacing a
whole column set — needs a high priority. And a label you set at the default priority is still
handed to `i18n.t` afterwards, which is usually what you want.

## Failure modes

- **A misspelled reducer name is silent.** The service resolves any unknown property to a reducer
  chain, so `Cms.reducer('menuItem', ...)` registers happily and never runs. There is no warning.
- **A name that collides with a method throws.** `Cms.reducer('getRoutes', ...)` raises
  `ReducerOverrideException` at registration.
- **`{Name}` is StudlyCase of the model's schema name**, and `{Col}` is StudlyCase of the column
  key — `Str.studly` runs the key through camelCase first, so the column `author.name` is
  `...GetAuthorNameContent` and `created_at` is `...GetCreatedAtContent`.

## Index

On the `Cms` facade:

| Reducer | Signature | Documented in |
|---|---|---|
| `cmsRoutes` | `(routes, components, models) => routes` | `routes-and-menu.md` |
| `menuItems` | `(items, models) => items` | `routes-and-menu.md` |
| `componentMap` | `(map) => map` | `component-overrides.md` |
| `model{Name}Columns` | `(columns) => columns` | `listing.md` |
| `model{Name}Get{Col}Content` | `(value, item) => ReactNode` | `listing.md` |
| `model{Name}Tabs` | `(tabs) => tabs` | `listing.md` |
| `perPageOptions` | `(options) => number[]` | `listing.md` |
| `staticActions` / `static{Name}Actions` | `(actions, ModelClass, tab) => actions` | `actions.md` |
| `instanceActions` / `instance{Name}Actions` | `(actions, ModelClass, tab) => actions` | `actions.md` |
| `massActions` / `mass{Name}Actions` | `(actions, ModelClass, tab) => actions` | `actions.md` |
| `rowClickHandlers` / `row{Name}ClickHandlers` | `(handlers, ModelClass, item) => handlers` | `actions.md` |
| `wireModelFormProps` | `(props, item) => props` | `forms.md` |

On the `Filter` facade: `filterableColumns`, `(columns, ModelClass) => columns` -> `filters.md`.

The per-model chain of an action or row click receives the **result** of the generic chain, so a
generic reducer runs first and a per-model one can still discard everything it produced.
