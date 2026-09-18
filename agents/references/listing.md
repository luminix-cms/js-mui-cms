# The listing page

`ModelIndex` renders a paginated table for one model. Its state lives entirely in the URL query
string — `page`, `per_page`, `q`, `order_by`, `tab`, `where[...]` — which it forwards to the model's
index endpoint, so a listing is always linkable and always reproducible.

## Columns

Out of the box a listing has exactly one column: the model's `labeledBy` attribute. Add the rest.

```tsx
Cms.reducer('modelPostColumns', (columns) => [
    ...columns,
    { key: 'author',     label: 'Author',  sortable: false },
    { key: 'created_at', label: 'Date',    align: 'right', size: 'small' },
]);
```

A `Column` is `{ key, label, sortable? }` plus any MUI `TableCellProps` — `align`, `size`, `scope`,
`component` are all forwarded to the cell. `sortable` defaults to `true`.

- return a fresh array with no spread to replace the defaults instead of appending
- a dotted key (`'author.name'`, `'year.year'`) reads an eager-loaded relation or a JSON column
- `label` is fed to `i18n.t` after your reducer, so it doubles as a translation key
- sorting a column writes `order_by={key}:asc|desc`, and the column must be sortable on the API side

## Cell content

`model{Name}Get{Col}Content` decides what a cell renders. It receives the raw attribute value and
the model instance, and may return any node.

```tsx
Cms.reducer('modelPostGetAuthorContent', (_value, post) => {
    if (!post?.authors?.isNotEmpty()) return '-';
    return post.authors.map((a) => (
        <Chip key={a.id} component={Link} to={`/users?where[id]=${a.id}`}
              onClick={(e) => e.stopPropagation()} label={a.name} />
    ));
});
```

Without a content reducer the raw value is rendered: strings and numbers as text, `Date` through
`toLocaleString(app.locale)`, any other object as JSON. On mobile the whole row collapses into one
cell and each value is prefixed with its column label.

**A link inside a cell needs `e.stopPropagation()`** or the row's own click handlers fire too ->
`actions.md`.

## Tabs

`model{Name}Tabs` adds tabs beside the implicit "All". A model that soft-deletes gets a `trashed`
tab already; a model with no tabs renders no tab bar at all.

```ts
Cms.reducer('modelPostTabs', (tabs) => [{ label: 'Published', value: 'published' }, ...tabs]);
```

The active tab is the `tab` query param, `all` when absent. **Switching tabs resets the entire query
string** — search, sort, page and filters all go. The tab value is also what every action reducer
receives as its `tab` argument, but nothing translates it into a server-side filter for you: the
`trashed` tab works because `luminix/backend` understands `?tab=trashed`, and a tab of your own
needs a `scopeBeforeLuminix` or a custom operator on the API side.

## Search, sort, pagination

`q` is written by the app-bar search field, throttled at 500 ms, and focused by `Ctrl + /` on
desktop. The field only appears on a page that called `useSearch()`; the listing does. Read the
current term with `useSearchParams()` from `react-router-dom`.

Clicking a sortable header cycles ascending, descending, unsorted. On mobile the same choice is made
in a dialog behind the sort icon.

Rows-per-page offers `15, 30, 75, 150`; change the list with
`Cms.reducer('perPageOptions', () => [25, 50])`. Values above the API's `api.max_per_page` are
rejected by `luminix/backend` with a 422, not clamped.

## Reading table state

Inside the table subtree — a custom cell, a replaced `ModelIndex.Table` slot:

```tsx
const { columns, columnCount, massActions, items, loading, error, Model, selected } = useTable();
const { selected, indeterminate, allSelected,
        isSelected, handleSelectToggle, handleSelectToggleAll, handleClearSelected } = useSelection();
const ModelClass = useCurrentModel();   // anywhere under a ModelProvider, including the form page
```

`items` is a `Collection` of hydrated models and `selected` a `Collection` of the checked ones;
selection is cleared whenever the model or the loaded page changes. The rows themselves come from
`usePagination()` in `@luminix/react`, which also exposes the `refresh()` that actions call.
