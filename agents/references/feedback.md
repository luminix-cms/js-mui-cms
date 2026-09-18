# Notifications, dialogs and errors

Both are context-based, both are mounted by the panel layout route. A page rendered outside that
route — a top-level `cmsRoutes` entry, or a hand-rolled `<LuminixProvider>` app — gets neither until
it mounts the providers itself:

```tsx
<NotificationProvider><DialogProvider><Outlet /></DialogProvider></NotificationProvider>
```

## Notifications

```tsx
const notify = useNotify();

notify('Saved!');
notify({ message: 'Post published.', severity: 'success', title: 'Success',
         actions: [{ label: 'Undo', callback: (e) => { undo(); e.close(); } }] });
```

`severity` is `'success' | 'error' | 'warning' | 'info'`; `message` and `title` take any node.

**Exactly one notification exists at a time.** A new `notify` replaces the one on screen and
restarts the 6 s auto-hide, so a burst of saves leaves only the last visible and nothing has to be
dismissed twice. The replacement takes any pending actions with it, which is why an undo affordance
belongs on the last notification of a flow and nowhere earlier.

An action click leaves the toast open. Its callback receives `{ close }`; calling `e.close()`
dismisses the notification it belongs to, and does nothing once that notification has been replaced.

```ts
notify({ message: t('Post moved to trash'),
         actions: [{ label: t('Undo'), callback: async (e) => { await item.restore(); e.close(); refresh(); } }] });
```

`useDisplaceNotifications(value)` lifts the Snackbar while the calling component is mounted — MUI
spacing units, or `false` to restore the default. The listing's floating action button already uses
it; reach for it when your own fixed UI would sit under the toast.

`useNotifications()` returns the whole context — `isOpen`, `notify`, `dismissNotification`,
`notifications`, `current`, `displacement` — for a replacement Snackbar. It is not exported from the
package entry; import the context or rebuild what you need.

## Dialogs

`useDialog()` returns an async function. It resolves when the user answers, so an action can await
a confirmation before doing anything.

```tsx
const dialog = useDialog();

await dialog('Post published.');                // a bare string is an `alert` — see below

const result = await dialog({
    title: 'Confirm deletion', message: 'This cannot be undone.',
    type: 'confirm',            // 'alert' | 'confirm' | 'prompt'
    dismissable: true,          // default; false removes the backdrop close
    confirmText: 'Delete', cancelText: 'Cancel',
    defaultValue: '', textFieldProps: { label: 'File name' },   // prompt only
    dialogProps: {},            // passed to MUI's <Dialog>
});
```

`confirm` resolves `true` / `false`, buttons defaulting to Yes / No; `prompt` resolves the typed
string, or `false` on cancel. `alert` shows one button and **always resolves `false`** — it is an
acknowledgement, not a question, so never branch on the result of a bare-string call. Button labels
and the dialog's own strings go through i18next.

## Errors

```tsx
const handleError = useHandleError();
try { await model.save(); } catch (err) { handleError(err); }
```

It notifies with `severity: 'error'`, preferring an Axios response's `message` field over the
JavaScript error's. Anything that is not an `Error` is rethrown rather than swallowed. The same
callback is what `refresh`-style default actions and the form page use, so your own error toasts
look like theirs.
