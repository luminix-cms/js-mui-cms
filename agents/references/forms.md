# The create / edit page

`ModelItem` serves both `/{plural-kebab}/create` and `/{plural-kebab}/:id`. On create it mounts an
empty model; on edit it awaits `Model.find(id)` and renders nothing until the item resolves. The
form itself is `<ModelForm>` from `@luminix/react`, which builds its inputs from the model schema —
this package supplies the page, the props and the panel chrome around it.

On success it toasts and, when the item was just created, navigates to that item's show route. On
failure it routes the error through `useHandleError()` -> `feedback.md`.

## Props for the form

`wireModelFormProps` is the one reducer the page applies before rendering. It receives an empty
object and the model instance, and whatever it returns is spread onto `<ModelForm>`.

```ts
Cms.reducer('wireModelFormProps', (props, item) =>
    item?.getType() === 'post' ? { ...props, confirmed: 'password' } : props);
```

`Cms.getModelFormProps(item)` runs the same chain, so a hand-written page can spread the identical
props onto its own `<ModelForm>` and inherit every integration.

This package registers one default of its own: `confirmed: 'password'` for a model typed `user`.

## Replacing the generated inputs

The input list belongs to the `Forms` facade in `@luminix/react`, whose per-model reducer is
`selectDefaultInputsFor{Name}`. Two things about doing it from inside the panel:

**Carry other packages' contributions through.** Plugins such as
`@luminix/laravel-permission-for-mui-cms` inject and rewrite inputs through the same reducer, and
they may run after yours. Rebuilding the list wholesale silently drops them; filter them back in, or
raise your `priority` when yours must win.

```ts
Forms.reducer(`selectDefaultInputsFor${Str.studly(alias)}`, (inputs) => [
    ...inputs.filter((i) => i.type === 'csrf'),
    ...getFieldsFor(alias),
    ...inputs.filter((i) => ['roles', 'permissions'].includes(i.type)),
]);
```

**Read boot config at call time, not at module evaluation.** A field schema whose options come from
the payload has to be a function, or it evaluates before the app boots and captures nothing:

```ts
export default () => [
    { name: 'status', type: 'select', options: config('data.constants.postStatuses') ?? [] },
];
```

A relation input is the `autocomplete` + `list` (target model alias) + `foreignKey` triple.

## Placing your own UI between generated inputs

Render the framework inputs by hand and slice the array where the custom block belongs:

```tsx
const inputs    = React.useMemo(() => item ? Forms.getDefaultInputsForModel(item, []) : [], [item]);
const formProps = React.useMemo(() => Cms.getModelFormProps(item), [item]);

<ModelForm {...formProps} key={create ? 'create' : id} item={item} onSubmit={handleSubmit}>
    {inputs.filter(Boolean).slice(0, -1).map(({ key, ...p }) => <ModelForm.Input key={key ?? p.name} {...p} />)}
    <CascadingRegionSection />
    {inputs.filter(Boolean).slice(-1).map(({ key, ...p }) => <ModelForm.Input key={key ?? p.name} {...p} />)}
</ModelForm>
```

Collapse the framework's vertical rhythm with `sx={{ '--luminix-form-spacing': 0 }}`.

To take persistence over entirely — return `false` from `onSubmit`, save the model yourself, push
non-field data through `save({ additionalPayload })` — drop to `<Form>` and the model's error bag:
both belong to `@luminix/react` and `@luminix/core`.
