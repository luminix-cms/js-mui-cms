# Hooks

Todos os hooks abaixo são exportados de `@luminix/mui-cms` e devem ser usados dentro da árvore de componentes do `LuminixCms`.

```ts
import { useNotify, useDialog, useTable, /* ... */ } from '@luminix/mui-cms';
```

---

## Navegação e página

### usePageTitle

Retorna o título atual da página.

```ts
const title = usePageTitle(); // string
```

### useSetPageTitle

Recebe um `title` como argumento e define o título da página enquanto o componente está montado. Remove o título automaticamente no unmount.

```ts
useSetPageTitle('Meus Posts');
```

Não retorna valor.

### useSearch

Torna a barra de busca visível enquanto o componente está montado. Esconde-a automaticamente no unmount.

```ts
useSearch();
```

Não recebe parâmetros nem retorna valor. Para ler o valor atual da busca (query string), use diretamente `useSearchParams` do `react-router-dom`.

### useHasSearch

Retorna `true` se a barra de busca está visível no momento.

```ts
const hasSearch = useHasSearch(); // boolean
```

### useBackButton

Torna o botão voltar visível enquanto o componente está montado. Esconde-o automaticamente no unmount.

```ts
useBackButton();
```

Não recebe parâmetros nem retorna valor.

### useHasBackButton

Retorna `true` se o botão voltar está visível no momento.

```ts
const hasBack = useHasBackButton(); // boolean
```

---

## Estado da tabela

### useTable

Retorna o valor completo do `TableContext`. Disponível dentro de componentes filhos do `TableProvider`.

```ts
const {
    columns,      // Column[]
    columnCount,  // number
    massActions,  // MassAction[]
    items,        // Collection<Model> | undefined
    loading,      // boolean | undefined
    error,        // Error | null
    Model,        // typeof ModelType
    selected,     // Collection<Model>
} = useTable();
```

### useSelection

Retorna utilitários para gerenciar a seleção de linhas da tabela.

```ts
const {
    selected,                // Collection<Model> — itens selecionados (reativo)
    indeterminate,           // boolean — true se parte dos itens está selecionada
    allSelected,             // boolean — true se todos os itens da página estão selecionados
    isSelected,              // (item: Model) => boolean
    handleClearSelected,     // () => void
    handleSelectToggle,      // (item: Model) => void
    handleSelectToggleAll,   // () => void
} = useSelection();
```

### useCurrentModel

Retorna a classe do modelo ativo na tela atual. Disponível dentro de um `ModelProvider`.

```ts
const ModelClass = useCurrentModel(); // typeof ModelType
```

---

## Notificações

### useNotify

Retorna a função `notify` para exibir notificações toast.

```ts
const notify = useNotify();

// forma simplificada
notify('Salvo com sucesso!');

// com objeto completo
notify({
    message:  'Post publicado.',
    severity: 'success',      // 'success' | 'error' | 'warning' | 'info'
    title:    'Sucesso',      // opcional
    actions: [                // opcional — botões de ação no toast
        {
            label: 'Desfazer',
            callback: (e) => {
                // ...
                e.close(); // fecha a notificação que originou a action
            },
        },
    ],
});
```

Apenas uma notificação existe por vez: **uma notificação nova substitui imediatamente a que está sendo exibida** e reinicia o `autoHideDuration`. Em ações sucessivas isso garante que o usuário sempre veja a resposta mais recente, sem fila acumulada para dispensar.

O callback de cada action recebe um evento com `close()`. Clicar em uma action **não** fecha a notificação automaticamente — o fechamento é sempre explícito. Se a notificação já tiver sido substituída por uma mais recente, `close()` não faz nada.

A assinatura completa:

```ts
type NotifyFunction = (notification: string | Notification) => void;

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

type NotificationActionCallbackEvent = {
    close: () => void;
};
```

### useNotifications

Acessa o estado interno do `NotificationContext`. Útil para criar providers de notificação customizados.

```ts
const {
    isOpen,
    notify,
    dismissNotification,
    notifications,   // Notification[] — 0 ou 1 item, nunca acumula
    current,         // Notification | undefined — notificação sendo exibida
    displacement,    // string — deslocamento CSS atual do Snackbar
} = useNotifications();
```

### useDisplaceNotifications

Define o deslocamento (offset) do Snackbar de notificações. Útil para evitar sobreposição com elementos fixos como FABs ou rodapés.

```ts
useDisplaceNotifications(value);
```

- `value: string | number | false` — número de unidades de espaçamento MUI, string CSS ou `false` para restaurar o valor padrão.
- O deslocamento é restaurado automaticamente no unmount.

```ts
// desloca 8 unidades de espaçamento MUI acima do padrão
useDisplaceNotifications(8);

// restaura o deslocamento padrão
useDisplaceNotifications(false);
```

---

## Diálogos

### useDialog

Retorna a função `dialog` para abrir diálogos modais. Retorna uma `Promise` que resolve com o resultado da interação do usuário.

```ts
const dialog = useDialog();

// forma simplificada — abre um alerta
const confirmed = await dialog('Tem certeza?');

// com objeto completo
const result = await dialog({
    title:        'Confirmar exclusão',
    message:      'Esta ação não pode ser desfeita.',
    type:         'confirm',   // 'alert' | 'confirm' | 'prompt'
    dismissable:  true,        // permite fechar clicando fora
    confirmText:  'Excluir',
    cancelText:   'Cancelar',
    // para type: 'prompt':
    defaultValue: '',
    textFieldProps: { label: 'Nome do arquivo' },
});
// result: true (confirmou) | false (cancelou) | string (prompt)
```

A assinatura completa:

```ts
type DialogFunction = (message: string | DialogMessage) => Promise<boolean | string>;

type DialogMessage = {
    title?:          React.ReactNode;
    message:         React.ReactNode;
    type?:           'alert' | 'confirm' | 'prompt';
    dismissable?:    boolean;
    confirmText?:    string;
    cancelText?:     string;
    defaultValue?:   string;           // valor inicial para type 'prompt'
    dialogProps?:    Partial<DialogProps>;
    textFieldProps?: Partial<TextFieldProps>;
};
```

---

## Layout

### useLayoutConfig

Lê um valor da configuração de layout (`CmsConfig['layout']`) pelo caminho (dot notation).

```ts
const drawerWidth = useLayoutConfig('drawer.width', 240);
const appBarColor = useLayoutConfig('appBar.color');
```

Parâmetros:
- `path: string` — caminho no objeto de layout (ex.: `'drawer.width'`, `'appBar.height'`)
- `defaultValue?: unknown` — valor retornado se o caminho não estiver definido

### useIsDesktopMode

Retorna `true` quando a largura da tela está acima do breakpoint configurado em `layout.breakpoint`.

```ts
const isDesktop = useIsDesktopMode(); // boolean
```

### useMenu

Retorna o estado de abertura do Drawer lateral e funções para controlá-lo.

```ts
const {
    open,                // boolean — true se o Drawer está aberto
    handleDrawerOpen,    // () => void
    handleDrawerClose,   // () => void
    toggle,              // () => void
} = useMenu();
```

---

## Eventos e ações

### useActionEvent

Monta o objeto `ActionCallbackEvent` — útil para chamar manualmente callbacks de ações em componentes customizados.

```ts
const event = useActionEvent();

event.navigate('/posts');
event.refresh();
event.notify('Salvo!');
await event.dialog({ message: 'Confirmar?' });
event.t('chave.de.traducao');
```

### useHandleError

Retorna uma função que trata erros de requisição e os exibe como notificação.

```ts
const handleError = useHandleError();

try {
    await model.save();
} catch (err) {
    handleError(err);
}
```

---

## Próximos passos

- [Ações](acoes.md) — como definir ações estáticas, de instância e em massa
- [Extensibilidade](extensibilidade.md) — customizações via redutores
- [Volta ao índice](index.md)
