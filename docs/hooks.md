# Hooks

Todos os hooks abaixo são exportados diretamente de `@luminix/mui-cms` e devem ser usados dentro da árvore de componentes do `LuminixCms`.

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

Retorna uma função para definir o título da página.

```ts
const setTitle = useSetPageTitle();

useEffect(() => {
    setTitle('Minha página');
}, []);
```

### useSearch

Retorna o valor atual da busca global e uma função para atualizá-la.

```ts
const [search, setSearch] = useSearch();
```

### useHasSearch

Retorna `true` se a tela atual suporta busca.

```ts
const hasSearch = useHasSearch(); // boolean
```

### useBackButton

Retorna `true` se o botão voltar está visível e uma função para navegar.

```ts
const [hasBack, goBack] = useBackButton();
```

### useHasBackButton

Retorna apenas o booleano indicando se o botão voltar está ativo.

```ts
const hasBack = useHasBackButton(); // boolean
```

---

## Estado da tabela

### useTable

Acessa o estado completo da tabela (itens, loading, erro, paginação, ordenação, seleção).

```ts
const {
    items,
    loading,
    error,
    page,
    perPage,
    sort,
    tab,
    refresh,
} = useTable();
```

### useSelection

Gerencia a seleção de linhas da tabela.

```ts
const {
    selected,          // Collection<Model>
    isSelected,        // (item: Model) => boolean
    toggle,            // (item: Model) => void
    toggleAll,         // () => void
    clearSelection,    // () => void
    isAllSelected,     // boolean
} = useSelection();
```

### useCurrentModel

Retorna a classe do modelo ativo na tela atual (disponível dentro de um `ModelProvider`).

```ts
const ModelClass = useCurrentModel(); // typeof ModelType
```

---

## Interface e notificações

### useNotify

Retorna uma função para exibir notificações toast.

```ts
const notify = useNotify();

notify('Salvo com sucesso!', 'success');
notify('Algo deu errado.', 'error');
notify('Atenção!', 'warning');
notify('Informação.', 'info');
```

A assinatura completa da `NotifyFunction`:

```ts
type NotifyFunction = (message: string, severity?: 'success' | 'error' | 'warning' | 'info') => void;
```

### useNotifications

Acessa o estado interno das notificações (lista atual e função de exibição). Útil para criar providers de notificação customizados.

```ts
const { notifications, notify } = useNotifications();
```

### useDisplaceNotifications

Retorna a função interna de remoção de notificações da fila.

### useDialog

Retorna uma função para abrir diálogos modais.

```ts
const dialog = useDialog();

dialog({
    title: 'Confirmar exclusão',
    message: 'Esta ação não pode ser desfeita.',
    type: 'confirm',           // 'alert' | 'confirm'
    onConfirm: () => { /* ... */ },
    onCancel:  () => { /* ... */ },
});
```

### useLayoutConfig

Acessa e modifica a configuração de layout (estado do drawer, breakpoint, etc.).

```ts
const { drawerOpen, setDrawerOpen, breakpoint } = useLayoutConfig();
```

### useIsDesktopMode

Retorna `true` quando a tela está acima do breakpoint configurado.

```ts
const isDesktop = useIsDesktopMode(); // boolean
```

### useMenu

Retorna os itens do menu lateral gerados pelo `CmsService`.

```ts
const menuItems = useMenu(); // MenuItem[]
```

---

## Eventos e ações

### useActionEvent

Monta o objeto `ActionCallbackEvent` com as funções `navigate`, `refresh`, `notify`, `dialog` e `t` — usado como argumento nos callbacks de ações.

```ts
const event = useActionEvent();
// event.navigate('/posts')
// event.refresh()
// event.notify('Salvo!', 'success')
// event.dialog({ title: '...' })
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

## Teclado

### useKeyPress

Detecta se uma tecla específica está pressionada.

```ts
const isShiftPressed = useKeyPress('Shift');
```

### useKeyChord

Detecta combinações de teclas (atalhos). Chama o callback quando a sequência é detectada.

```ts
useKeyChord(['Control', 'k'], () => {
    // abre busca
});
```

---

## Próximos passos

- [Ações](acoes.md) — como definir ações estáticas, de instância e em massa
- [Extensibilidade](extensibilidade.md) — customizações via redutores
- [Volta ao índice](index.md)
