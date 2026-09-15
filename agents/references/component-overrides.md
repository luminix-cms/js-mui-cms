# Replacing a built-in component

Every component the panel renders is looked up by name in a map built once, on `booted`, by the
`componentMap` reducer chain. Replacing a slot replaces it everywhere, including inside components
you did not touch.

```tsx
Cms.reducer('componentMap', (map) => ({ ...map, Dashboard: MyDashboard }));
```

Because the map is resolved at boot, a reducer registered after the app has booted has no effect.
Register from a `ServiceProvider`'s `boot()`.

## Slots

| Key | Renders |
|---|---|
| `Layout` | the shell: app bar, drawer, main area |
| `Dashboard` | the page at `/` |
| `ModelIndex` | a model listing |
| `ModelItem` | the create / edit page |
| `Error` | the error page |
| `DesktopPageTitle` | page heading above the content, desktop only |
| `Breadcrumbs` | breadcrumb trail |
| `RecursiveList` | nested menu as a list (drawer) |
| `RecursiveMenu` | nested menu as a popover (collapsed drawer) |
| `Layout.AppBar` | top bar |
| `Layout.AppBar.MenuButton` | drawer toggle |
| `Layout.AppLogo` | logo at the end of the app bar |
| `Layout.Drawer` | sidebar |
| `Layout.Drawer.LogoutButton` | logout entry pinned to the drawer's foot |
| `Layout.SearchBar` | search field |
| `Layout.BackButton` | back button |
| `ModelIndex.Tabs` | the All / Trashed tab bar |
| `ModelIndex.Filter` | the advanced filter panel |
| `ModelIndex.StaticActions` | toolbar actions |
| `ModelIndex.InstanceActions` | the ⋮ row menu |
| `ModelIndex.MassActions` | bulk-action select |
| `ModelIndex.Pagination` | pager |
| `ModelIndex.PaginationDetails` | "showing x–y of z" |
| `ModelIndex.PerPageSwitch` | rows-per-page select |
| `ModelIndex.Sort` | the mobile sort dialog |
| `ModelIndex.Table` | table container, and the `TableProvider` around it |
| `ModelIndex.Table.TableHead` | header row |
| `ModelIndex.Table.TableBody` | body, skeleton and empty state |
| `ModelIndex.Table.TableBody.TableRow` | one row |
| `ModelIndex.Table.TableFooter` | footer |
| `ModelIndex.Table.TableToolbar` | toolbar inside the header |
| `ModelIndex.Table.ShrinkedCell` | the narrow cells holding checkbox and ⋮ |

Replacing `ModelIndex.Table` means replacing the `TableProvider` it mounts, and with it `useTable()`
and `useSelection()` for everything below.

## Decorating instead of replacing

Pull the current component out of the map and return a wrapper that falls back to it. Use a high
priority so you wrap the final component rather than one another package is about to replace:

```tsx
Cms.reducer('componentMap', (components) => {
    const Filter = components['ModelIndex.Filter'];
    return { ...components, 'ModelIndex.Filter': wrapFilter(Filter) };
}, 99);

const wrapFilter = (Filter) => (props) => {
    const Model = useCurrentModel();
    if (Model.getSchemaName() === 'post') return <FilterWrapper {...props}><PostFilterBody /></FilterWrapper>;
    return <Filter {...props} />;
};
```

Branching on `useCurrentModel()` is how one wrapper serves every model without registering a slot
per model — there is no per-model `componentMap`.

## Reading the map

`Cms.getComponent(name)` returns one component and `Cms.getComponents()` the whole map. Prefer them
to importing a component's module: a custom page that renders
`Cms.getComponent('Breadcrumbs')` picks up whatever override is in force.

## Logout

Not a slot — a callback. `Cms.logoutUsing(cb)` replaces what the drawer's logout button does; the
default calls `auth().logout()` from `@luminix/core`.

```ts
Cms.logoutUsing(() => {
    localStorage.removeItem(TOKEN_KEY);
    Route.call('auth.logout').catch(() => {}).finally(() => auth().logout());
});
```
