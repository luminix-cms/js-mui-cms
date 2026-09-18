# Getting started

```tsx
import { LuminixCms } from '@luminix/mui-cms';

<LuminixCms providers={[AppServiceProvider]} />
```

One component at the app entry point. It registers `CmsServiceProvider` and
`i18NextServiceProvider`, then hands `providers` and the generated route tree to
`<LuminixProvider>` from `@luminix/react`, so `<LuminixCms>` also accepts every
`LuminixProvider` prop.

| Prop | Effect |
|---|---|
| `theme` | MUI `ThemeOptions`. Default: primary `#1d9798`, secondary `#fa510c` |
| `darkTheme` | used instead of `theme` only when `colorScheme` is `auto` **and** the OS prefers dark |
| `colorScheme` | `'auto'` (default), `'light'` or `'dark'` — sets `palette.mode` |
| `themeArgs` | extra objects, passed to `createTheme()` after the resolved theme |
| `providers` | `ServiceProvider[]`, booted after this package's own |

## The customisation entry point

Everything in these references is registered from a `ServiceProvider` you pass in `providers`.
Nothing is configured by props.

```js
import { ServiceProvider } from '@luminix/support';
import { Cms, Icon } from '@luminix/mui-cms';

export default class AppServiceProvider extends ServiceProvider {
    register() {
        Icon.registerIcon('Star', StarIcon);   // icons and model extension: before boot
    }
    boot() {
        Cms.reducer('menuItems', (items) => [...items, { key: 'reports', text: 'Reports', to: '/reports' }]);
    }
}
```

`CmsServiceProvider` boots first, so its defaults are already registered when your `boot()` runs —
clearing or filtering a default always works from there.

## What you get before customising anything

For every model in the manifest: a listing route, a create route, a show/edit route, a drawer entry,
a "Create {Model}" toolbar action, trash/restore row and bulk actions when the model soft-deletes,
and a row click that navigates to the item. Plus a dashboard at `/`. Model discovery is
`luminix/backend`'s; the manifest reaches the browser through `luminix/frontend`.

## Config keys read from the boot payload

| Key | Used for |
|---|---|
| `luminix.admin.url` | router basename, default `/admin` |
| `luminix.cms.layout` | drawer width, app-bar height and colour, breakpoint -> `routes-and-menu.md` |
| `luminix.admin.filter.operators` | the operator list of the filter panel -> `filters.md` |
| `app.name` | app-bar title, breadcrumb root, document title suffix |
| `app.locale`, `app.fallback_locale`, `trans`, `i18n` | i18next setup, below |

`luminix.admin.*` and `trans` are injected by `luminix/admin`, `app.*` by `luminix/frontend`.
Nothing in the stack writes `luminix.cms.layout` — an app that wants a layout other than the
defaults adds the key to the boot payload itself.

## Translation

i18next is initialised with `app.locale`, the lines in `trans` as its resource bundle, and an
interpolation syntax of `:name` with no closing delimiter — Laravel's, not i18next's `{{name}}`.
Override any init option through the `i18n` config key.

Model `singular()` / `plural()`, column labels, action labels, menu entries and form labels all pass
through `i18n.t`, so a label you register is a translation key as well as a fallback string. The
package's own translation reducers run at priority `99`, after your customisations.

## Two exports that are not where you would look

`useHasBackButton` and `useNotifications` exist but are not exported from the package entry;
neither are the types `MenuItem`, `CmsConfig`, `DialogMessage`, `DialogFunction`, `FilterColumn`,
`FilteredColumn` and `LuminixCmsProps`. Declare the shapes locally rather than importing them.

Setting `CmsServiceProvider.applyUserDefaults = false` before mounting drops the two defaults this
package ships for a `User` model: its three-column listing and the password confirmation field.
