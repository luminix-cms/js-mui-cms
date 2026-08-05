# Ações

O sistema de ações permite adicionar comportamentos às telas de listagem dos modelos. Existem três tipos:

| Tipo | Contexto | Exemplo de uso |
|---|---|---|
| **Estáticas** | Nível de listagem, sem item selecionado | "Criar novo post" |
| **De instância** | Por linha da tabela | "Editar", "Excluir" |
| **Em massa** | Múltiplos itens selecionados | "Excluir selecionados", "Restaurar" |

> Ações de instância são itens do menu "⋮" de cada linha. O que acontece ao **clicar na linha** é um
> mecanismo separado — os manipuladores de clique de linha, documentados em
> [Extensibilidade — rowClickHandlers](extensibilidade.md#rowclickhandlers-e-rownameclickhandlers).

---

## ActionCallbackEvent

Todo callback de ação recebe um objeto `ActionCallbackEvent` com utilitários prontos:

```ts
type ActionCallbackEvent = {
    navigate: (path: string) => void;  // navega para uma rota interna
    refresh:  () => void;              // recarrega a listagem atual
    notify:   NotifyFunction;          // (notification: string | Notification) => void
    dialog:   DialogFunction;          // (message: string | DialogMessage) => Promise<boolean | string>
    t:        TFunction;               // função de tradução (i18next)
};
```

Ações de instância recebem também `item: ModelType` (o registro da linha):

```ts
type InstanceActionCallbackEvent = ActionCallbackEvent & {
    item: Model;
};
```

Ações em massa recebem `selected: Collection<Model>` (todos os itens selecionados):

```ts
type MassActionCallbackEvent = ActionCallbackEvent & {
    selected: Collection<Model>;
};
```

---

## Ações estáticas (StaticAction)

Aparecem na barra de ferramentas da listagem (ex.: botão "Criar").

```ts
type StaticAction = {
    key?:     string;
    label:    string;
    icon?:    React.ReactNode;
    callback: (e: ActionCallbackEvent) => void;
};
```

**Padrão registrado:** "Create {Model}" — navega para a rota de criação quando a aba ativa não é "trashed".

### Adicionar uma ação estática global

```ts
import { Cms } from '@luminix/mui-cms';

Cms.reducer('staticActions', (actions, ModelClass, tab) => [
    ...actions,
    {
        key: 'export',
        label: 'Exportar CSV',
        callback: ({ notify }) => {
            // lógica de exportação
            notify({ message: 'Exportação iniciada!', severity: 'info' });
        },
    },
]);
```

### Adicionar ação apenas para um modelo específico

```ts
Cms.reducer('staticPostActions', (actions, ModelClass, tab) => [
    ...actions,
    {
        key: 'publish-all',
        label: 'Publicar todos',
        callback: async ({ refresh, notify }) => {
            await fetch('/api/posts/publish-all', { method: 'POST' });
            refresh();
            notify({ message: 'Posts publicados!', severity: 'success' });
        },
    },
]);
```

---

## Ações de instância (InstanceAction)

Aparecem no menu de contexto de cada linha da tabela.

```ts
type InstanceAction = {
    key?:     string;
    label:    string;
    icon?:    React.ReactNode;
    callback: (e: InstanceActionCallbackEvent) => void;
};
```

**Padrão registrado:**
- "Send to trash" / "Delete permanently" — para modelos com/sem soft deletes.
- "Restore" + "Delete permanently" — quando a aba ativa é "trashed".

### Adicionar ação de instância

```ts
import { Cms } from '@luminix/mui-cms';

Cms.reducer('instanceActions', (actions, ModelClass, tab) => [
    ...actions,
    {
        label: 'Ver detalhes',
        callback: ({ item, navigate }) => {
            navigate(`/posts/${item.getKey()}/detalhes`);
        },
    },
]);
```

---

## Ações em massa (MassAction)

Aparecem quando um ou mais itens estão selecionados na tabela.

```ts
type MassAction = {
    key:      string;        // obrigatório — identificador único
    label:    string;
    callback: (e: MassActionCallbackEvent) => void;
};
```

**Padrão registrado:**
- "Send to trash" / "Delete permanently" — conforme soft deletes e aba ativa.
- "Restore" + "Delete permanently" — na aba "trashed".

### Adicionar ação em massa

```ts
import { Cms } from '@luminix/mui-cms';
import { Http } from '@luminix/core';

Cms.reducer('massActions', (actions, ModelClass, tab) => [
    ...actions,
    {
        key: 'archive',
        label: 'Arquivar selecionados',
        callback: async ({ selected, refresh, notify, dialog }) => {
            const confirmed = await dialog({
                title:   'Arquivar itens',
                message: `Deseja arquivar ${selected.count()} itens?`,
                type:    'confirm',
            });
            if (confirmed) {
                const ids = selected.map(item => item.getKey()).toArray();
                await Http.post('/api/posts/archive', { ids });
                refresh();
                notify('Itens arquivados!');
            }
        },
    },
]);
```

---

## Ações padrão (comportamento automático)

O `CmsServiceProvider` registra automaticamente as ações padrão com prioridade `0`. Suas ações customizadas podem ser adicionadas com prioridade maior (padrão `undefined`) para aparecerem antes ou depois das padrão.

Para remover uma ação padrão, filtre pelo `key`:

```ts
Cms.reducer('staticActions', (actions) =>
    actions.filter(a => a.key !== 'create')
);
```

---

## Próximos passos

- [Extensibilidade](extensibilidade.md) — redutores em profundidade e como encadear transformações
- [Extensibilidade — rowClickHandlers](extensibilidade.md#rowclickhandlers-e-rownameclickhandlers) — controlar o clique na linha da tabela
- [Hooks](hooks.md) — `useActionEvent` para montar o evento manualmente em componentes customizados
- [Volta ao índice](index.md)
