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

### RowClickEvent

Recebido pelos manipuladores de clique de linha. É o mesmo evento das ações de instância mais o evento de
mouse do React:

```ts
type RowClickEvent = InstanceActionCallbackEvent & {
    mouseEvent: React.MouseEvent;  // útil para ler teclas modificadoras
};
```

### RowClickHandler

```ts
type RowClickHandler = (e: RowClickEvent) => void;
```

Registrado via `Cms.onRowClick()` ou pelos redutores `rowClickHandlers` / `row{Name}ClickHandlers`. Veja
[Extensibilidade](extensibilidade.md#rowclickhandlers-e-rownameclickhandlers).

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

### LogoutButtonProps

Props recebidas pelo componente `Layout.Drawer.LogoutButton`. Relevante ao substituir o componente via redutor `componentMap`.

```ts
type LogoutButtonProps = {
    collapsed?: boolean; // true quando o drawer está recolhido no desktop
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
type NotifyFunction = (notification: string | Notification) => void;
```

### Notification

```ts
type Notification = {
    message:   React.ReactNode;
    severity?: 'success' | 'error' | 'warning' | 'info';
    title?:    React.ReactNode;
    actions?:  NotificationAction[];
};

type NotificationAction = {
    label:    React.ReactNode;
    callback: (e: NotificationActionCallbackEvent) => void;
};
```

### NotificationActionCallbackEvent

Recebido pelo `callback` de uma `NotificationAction`.

```ts
type NotificationActionCallbackEvent = {
    close: () => void;
};
```

- `close()` — fecha a notificação que originou a action. Não faz nada se ela já foi substituída por uma notificação mais recente.

---

## Diálogos

### DialogFunction

```ts
type DialogFunction = (message: string | DialogMessage) => Promise<boolean | string>;
```

### DialogMessage

```ts
type DialogMessage = {
    title?:          React.ReactNode;
    message:         React.ReactNode;
    type?:           'alert' | 'confirm' | 'prompt';
    dismissable?:    boolean;
    confirmText?:    string;
    cancelText?:     string;
    defaultValue?:   string;
    dialogProps?:    Partial<DialogProps>;
    textFieldProps?: Partial<TextFieldProps>;
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
