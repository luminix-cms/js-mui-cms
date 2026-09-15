# Routes, menu and the page shell

The route tree is one layout route with every page as a child. Anything pushed into
`routes[0].children` renders inside the panel chrome; a route added at the top level renders bare,
without drawer, app bar or the notification and dialog providers.

## Generated routes

| Path | Route `name` |
|---|---|
| `/` | `luminix.cms.dashboard` |
| `/{plural-kebab}` | `luminix.cms.{model}.index` |
| `/{plural-kebab}/create` | `luminix.cms.{model}.create` |
| `/{plural-kebab}/:id` | `luminix.cms.{model}.show` |

`{plural-kebab}` is `Str.kebab(Model.plural())`, the canonical way to build a model path yourself.
The router's basename is `luminix.admin.url`, so these paths are relative to the panel prefix.

## Add a page inside the shell

```tsx
Cms.reducer('cmsRoutes', (routes) => {
    const [root, ...rest] = routes;
    return [{ ...root, children: [...(root.children ?? []), { path: '/reports', element: <ReportsPage /> }] }, ...rest];
});
```

## Replace a scaffolded page

Find the child route by its `name` and swap its `element` — one component can serve create and show:

```tsx
Cms.reducer('cmsRoutes', (routes) => {
    ['create', 'show'].forEach((action) => {
        const i = routes[0].children.findIndex((r) => r.name === `luminix.cms.post.${action}`);
        routes[0].children[i].element = <PostEditView create={action === 'create'} />;
    });
    return routes;
});
```

## Menu

`menuItems` receives a dashboard entry followed by one entry per model, sorted by schema name, each
with `to` and the model's icon already filled in. An item is
`{ key, text, to?, onClick?, icon?, children?, element? }`; `children` nests a collapsible group and
`element` drops raw JSX in (a `<Divider/>`, say).

**Splice and spread** to curate the order without stranding models added later — consume the entries
you want to place, then spread the remainder back, so a new model still reaches the drawer with no
code change:

```tsx
Cms.reducer('menuItems', (items) => {
    const rest = [...items];
    const take = (key, overrides = {}) => {          // keeps the generated `to` and icon
        const i = rest.findIndex((it) => it.key === key);
        return i === -1 ? null : { ...rest.splice(i, 1)[0], ...overrides };
    };
    return [
        take('dashboard'),
        { key: 'crm', text: 'CRM', icon: Icon.render('PeopleOutlined'),
          children: [take('lead', { text: 'Leads' }), take('project')].filter(Boolean) },
        ...rest,
    ].filter(Boolean);
});
```

For a permission-gated menu, pick by allowlist instead, dropping groups whose children all vanished.
Whether the user may read a model is not a question this package answers: extend the `User` model
through `@luminix/core`, or read your own auth state.

## Model icons

`Icon` is a plain registry, not a reducer chain, so registration is imperative and belongs in
`register()`, before models are built.

```ts
Icon.registerIcon('Star', StarIcon);                    // one, or a { name: Component } map
Icon.forModel('post', 'Star');                          // model alias -> icon, used by the menu
Icon.render('Star', { fontSize: 'small' });             // ReactNode; Icon.make() gives the type
```

Registered by default, and free to reuse: `Add`, `AddCircleOutline`, `ArrowDownward`,
`ArrowDropDown`, `ArrowUpward`, `CategoryOutlined`, `ChevronLeft`, `ChevronRight`, `Close`,
`DashboardOutlined`, `ExpandLess`, `ExpandMore`, `FilterList`, `FirstPage`, `HighlightOffOutlined`,
`LastPage`, `Menu`, `MoreVert`, `PeopleOutlined`, `Search`, `SwapVert`. A model defaults to
`CategoryOutlined`, `user` to `PeopleOutlined`.

Lookups return the **first** registration of a name, so re-registering an existing name does not
replace it — pick a new name. An unregistered name throws rather than rendering nothing.

## Writing a page for the shell

```tsx
useSetPageTitle('Reports');   // app bar + document title, restored on unmount
useBackButton();              // app bar shows a back button while mounted
useSearch();                  // app bar shows the search field while mounted
const isDesktop  = useIsDesktopMode();                    // above the configured breakpoint
const breakpoint = useLayoutConfig('breakpoint', 'md');   // drive a Grid: {...{ [breakpoint]: 6 }}
const { open, handleDrawerOpen, handleDrawerClose, toggle } = useMenu();
```

`useLayoutConfig(path, default)` reads `luminix.cms.layout` by dot notation; the built-in chrome
reads three paths — `drawer.width` (default 280), `appBar.height` (unset, so MUI's toolbar height)
and `breakpoint` (default `md`). `usePageTitle()` and `useMenu()` return the very state the app bar
and drawer use, so a shell of your own stays in step with them, and `Cms.getComponent('Breadcrumbs')`
reuses a framework component with any override in force -> `component-overrides.md`.
