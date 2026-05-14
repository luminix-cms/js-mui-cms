# Referência de tipos

Todos os tipos abaixo são exportados de `@luminix/mui-cms`.

---

## Ações

### StaticAction

```ts
type StaticAction = {
    key?:     string;
    label:    string;
    icon?:    React.ReactNode;
    callback: (e: ActionCallbackEvent) => void;
};
```

### InstanceAction

```ts
type InstanceAction = {
    key?:     string;
    label:    string;
    icon?:    React.ReactNode;
    callback: (e: InstanceActionCallbackEvent) => void;
};
```

### MassAction

```ts
type MassAction = {
    key:      string;  // obrigatório
    label:    string;
    callback: (e: MassActionCallbackEvent) => void;
};
```

### ActionCallbackEvent

```ts
type ActionCallbackEvent = {
    navigate: (path: string) => void;
    refresh:  () => void;
    notify:   NotifyFunction;
    dialog:   DialogFunction;
    t:        TFunction;  // i18next
};
```

### InstanceActionCallbackEvent

```ts
type InstanceActionCallbackEvent = ActionCallbackEvent & {
    item: ModelType;
};
```

### MassActionCallbackEvent

```ts
type MassActionCallbackEvent = ActionCallbackEvent & {
    selected: Collection<ModelType>;
};
```

---

## Tabela

### Column

Estende `TableCellProps` do MUI:

```ts
type Column = TableCellProps & {
    key:       string;
    label:     string;
    sortable?: boolean;
};
```

---

## Rotas

### RouteObject

Re-exportado de `react-router-dom`. Use para tipar rotas adicionadas via redutor `cmsRoutes`:

```ts
import type { RouteObject } from '@luminix/mui-cms';
```

---

## Configuração

### CmsConfig

```ts
type CmsConfig = {
    layout?: {
        breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
        drawer?: {
            width?: number;
        };
        appBar?: {
            height?: number;
            color?:  string;
        };
    };
};
```

---

## Componente LuminixCms

### LuminixCmsProps

```ts
type LuminixCmsProps = Partial<LuminixProviderProps> & {
    theme?:     ThemeOptions;  // MUI ThemeOptions
    themeArgs?: object[];      // argumentos adicionais para createTheme()
};
```

`LuminixProviderProps` vem de `@luminix/react`. Consulte a documentação desse pacote para ver as props herdadas.

---

## Filtros

### FilterColumn

Representa uma coluna disponível para filtragem:

```ts
type FilterColumn = {
    key:         string;
    label:       string;
    type:        string;   // tipo do atributo (int, date, text, autocomplete, ...)
    nullable:    boolean;
    is_relation: boolean;
};
```

### FilteredColumn

Estado de uma linha ativa no painel de filtros:

```ts
type FilteredColumn = {
    key:      string;
    type:     string;
    operator: string;
    value:    unknown;
};
```

---

## Notificações

### NotifyFunction

```ts
type NotifyFunction = (
    message:   string,
    severity?: 'success' | 'error' | 'warning' | 'info'
) => void;
```

### Notification

```ts
type Notification = {
    id:        string;
    message:   string;
    severity:  'success' | 'error' | 'warning' | 'info';
    open:      boolean;
};
```

---

## Diálogos

### DialogFunction

```ts
type DialogFunction = (message: DialogMessage) => void;
```

### DialogMessage

```ts
type DialogMessage = {
    title:      string;
    message:    string;
    type?:      'alert' | 'confirm';
    onConfirm?: () => void;
    onCancel?:  () => void;
};
```

---

## Menu

### MenuItem

```ts
type MenuItem = {
    key:      string;
    text:     string;
    to?:      string;
    icon?:    React.ReactNode;
    children?: MenuItem[];
};
```

---

## Próximos passos

- [Ações](acoes.md) — como usar esses tipos na prática
- [Extensibilidade](extensibilidade.md) — redutores e customizações
- [Volta ao índice](index.md)
