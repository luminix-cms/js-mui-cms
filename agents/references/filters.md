# The filter panel

The funnel icon in the table toolbar opens a builder of filter rows — column, operator, value — that
compiles to `where[...]` query params. Those params are forwarded verbatim to the model's index
endpoint, so every operator is resolved by `luminix/backend`, not here.

## Query-string contract

| Row | Query param |
|---|---|
| `status` equals `active` | `where[status]=active` |
| `title` contains `api` | `where[title:contains]=api` |
| `created_at` between two dates | `where[created_at:between][0]=…&[1]=…` |
| a relation column | `where[project:relation][0]={id}` |

`equals` is the implicit operator and is left out of the key. A `datetime-local` value is sent as an
ISO string. This is also the shape to hand-write when you deep-link into a listing from a cell or a
menu item.

**Applying a filter rewrites the whole query string.** The panel builds a fresh set of params from
its rows, so `q`, `order_by`, `page`, `per_page` and `tab` are dropped on Apply. Clearing removes
only the `where[...]` keys.

## Which columns the panel offers

`Filter.getFilterableColumns(ModelClass)` returns, from the model schema: every attribute that is
not `hidden`, `appended` or `virtual`, typed by its cast when it has one and by its PHP type
otherwise; plus one `autocomplete` column per relation, marked `is_relation`. A `FilterColumn` is
`{ key, label, type, nullable, is_relation }`.

```ts
Filter.reducer('filterableColumns', (columns, ModelClass) => columns.filter((c) => c.key !== 'token'));
```

Hiding a column here hides it from the panel only; the endpoint still accepts a hand-written
`where[token]` unless `luminix/backend`'s `api.filter.exclude` blocks it.

## Operators

The list comes from the boot payload, at `luminix.admin.filter.operators` — `luminix/admin` fills it
from the backend's registered operators, macros included, so a custom operator reaches the dropdown
with no frontend work. `Filter.getOperators()` returns it raw;
`Filter.getMatchingOperators(column)` returns the subset a given column may use, as
`{ key, label }` options with the comparisons relabelled `=`, `!=`, `>`, `>=`, `<`, `<=`.

The subset is narrowed by the column's *input* type, which `Filter.getInputType(type)` derives:

| Schema type | Input |
|---|---|
| `int`, `float`, `number` | `number` |
| `date` | `date` |
| `datetime`, `timestamp` | `datetime-local` |
| `bool`, `boolean` | `boolean` |
| `autocomplete` | `autocomplete` |
| anything else | `text` |

- `like` is never offered
- `relation` only on relation columns
- `text` inputs lose the ordering operators (`greaterThan`, `between`, and their kin)
- `number`, `date`, `datetime-local` and `boolean` lose the substring operators (`contains`,
  `startsWith`, `endsWith`)
- `null` / `notNull` only on nullable columns

## `checkIfCanApplyFilters` reads backwards

It returns `true` when a row is **incomplete**, because it is wired straight to the Apply button's
`disabled` prop. An empty builder is "applicable"; a row missing its key, operator or value — or
either end of a `between` — is not.
