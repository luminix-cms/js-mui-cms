# Actions and the row click

Three kinds of action, all registered the same way, all receiving the active tab so they can differ
between "All" and "Trashed".

| Kind | Where it appears | Reducer | Extra on the event |
|---|---|---|---|
| Static | listing toolbar; a FAB or SpeedDial on mobile | `staticActions` / `static{Name}Actions` | — |
| Instance | the ⋮ menu on a row | `instanceActions` / `instance{Name}Actions` | `item: Model` |
| Mass | the toolbar select that acts on the checked rows | `massActions` / `mass{Name}Actions` | `selected: Collection<Model>` |

```ts
type StaticAction   = { key?: string; label: string; icon?: ReactNode; callback: (e) => void };
type InstanceAction = StaticAction;                      // callback also gets `item`
type MassAction     = { key: string; label: string; callback: (e) => void };   // `key` required
```

Every callback receives `navigate(path)`, `refresh()`, `notify(...)`, `dialog(...)` and `t` —
i18next's, with `:name` interpolation. `refresh()` re-runs the listing query; `notify` and `dialog`
are the panel's own -> `feedback.md`.

```tsx
Cms.reducer('staticPostActions', (actions, ModelClass, tab) => {
    if (tab === 'trashed') return actions;
    return [...actions, { key: 'import', label: 'Import',
                          callback: (e) => e.navigate(`/${Str.kebab(Post.plural())}/import`) }];
});
```

## The defaults, and removing them

| Tab | Static | Instance | Mass |
|---|---|---|---|
| any but `trashed` | `create` | delete (label follows `softDeletes`) | `delete` |
| `trashed` | none | restore, delete permanently | `restore`, `forceDelete` |

The delete and restore defaults confirm through a dialog, call the model's own method, notify and
then `refresh()`. Remove one by filtering the chain:
`actions.filter((a) => a.key !== 'create')`.

**The instance defaults carry no `key`** — only mass and static defaults do — so filter those by
`label`, and give the instance actions you add a unique label of their own: the row menu keys its
items by label.

Rendering differs with count. One static action is a plain button, or a FAB on mobile; several
become a split button whose main half fires the *selected* entry, or a SpeedDial on mobile. An empty
chain renders nothing at all — no toolbar, no ⋮, no mass-action select, and with no mass actions the
row checkboxes disappear too.

## Row click

The row click is a reducer chain, not an action: every handler returned by
`Cms.getRowClickHandlers(ModelClass, item)` fires on click, and an empty chain leaves the row inert —
no pointer cursor, no hover. The handler event is the instance-action event plus
`mouseEvent: React.MouseEvent`.

```ts
Cms.onRowClick(({ item, dialog }) => dialog({ title: item.getLabel(), message: item.excerpt, type: 'alert' }), 'post');
Cms.clearRowClickHandlers('post');   // drop the default navigation for post
Cms.clearRowClickHandlers();         // drop it everywhere
```

`Cms.onRowClick(handler, model?, priority?)` appends to the per-model chain, or to the generic one
when `model` is omitted, and returns an unsubscribe.

- the default handler navigates to `/{plural-kebab}/{key}` at priority `0`, and is appended only
  while `item.deletedAt` is empty ⇒ **trashed rows are inert** unless you register a handler
- `clearRowClickHandlers(model)` clears that model's chain *and* registers a priority-`0` reducer
  returning `[]`, which discards the generic chain's contribution for that model only; later
  `onRowClick` calls still append
- the click is bound to the data cells only — the checkbox and the ⋮ button do not trigger it, but a
  link you render inside a cell does, so call `e.stopPropagation()` on it

## A listing with no form page

Drop the row navigation, put your own behaviour in, and remove the `create` action as well, or it
routes to a page you deleted:

```ts
boot() {
    Cms.clearRowClickHandlers('post');
    Cms.onRowClick(({ item, dialog, mouseEvent }) => {
        if (mouseEvent.metaKey) return;
        dialog({ title: item.getLabel(), message: item.excerpt, type: 'alert' });
    }, 'post');
    Cms.reducer('staticPostActions', (actions) => actions.filter((a) => a.key !== 'create'));
}
```

## Firing an action's event from your own component

`useActionEvent()` returns the same object an action callback receives, and `useHandleError()` turns
a thrown error — an Axios failure included — into an error toast.
