# `@luminix/mui-cms`

React + Material-UI admin panel for a Luminix application. Mount `<LuminixCms />` once and the
panel builds itself from the model manifest in the boot payload: a route, a listing, a form page
and a menu entry per model. Everything past that — routes, menu, columns, cells, actions, filters,
forms, whole components — is customised by registering reducers on the `Cms` facade from a
`ServiceProvider`, never by forking a component.

## Where to read

| Read this | When |
|---|---|
| `references/getting-started.md` | mounting the panel, theme and colour scheme, the config keys it reads, what exists before you customise anything |
| `references/reducers.md` | how `Cms.reducer` works, the priority scale, the index of every reducer this package applies |
| `references/routes-and-menu.md` | adding a page, replacing a scaffolded one, curating the drawer menu, model icons, the hooks a custom page needs |
| `references/listing.md` | columns and rendered cell content, tabs, sorting, search, rows-per-page, reading table state and selection |
| `references/actions.md` | toolbar / row / bulk actions, their callback events, the defaults, taking over the row click |
| `references/filters.md` | the advanced filter panel, which columns and operators it offers, the `where[]` query string it writes |
| `references/forms.md` | the create/edit page, wiring props into its `<ModelForm>`, replacing the generated inputs |
| `references/feedback.md` | notifications, the confirm/prompt dialog, turning a thrown error into a toast |
| `references/component-overrides.md` | the `componentMap` slots and how to replace or decorate one |

## Owned elsewhere

- Laravel host for this panel, its URL, its gate and the boot data it injects -> `luminix/admin`
- the REST endpoints every listing and form calls, and their per-model gates -> `luminix/backend`
- models, `config()`, `auth()`, query builder, model-class extension -> `@luminix/core`
- `<LuminixProvider>`, `useForm`, `<Form>` / `<ModelForm>`, the `Forms` facade, `usePagination` ->
  `@luminix/react`
- `ServiceProvider`, `Collection`, `Str`, the `Reducible` mixin underneath the facades ->
  `@luminix/support`
- extra form inputs (date pickers, rich text, media) -> `@luminix/react-mui-inputs-plugin`
