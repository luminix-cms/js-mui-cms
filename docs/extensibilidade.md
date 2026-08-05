# Extensibilidade

O `@luminix/mui-cms` foi projetado para ser profundamente customizável sem exigir fork ou modificação do código-fonte. O mecanismo central é o padrão **Reducible** de `@luminix/support`.

## O padrão Reducible

Um serviço `Reducible` expõe "pontos de extensão" chamados **redutores**. Cada redutor é uma cadeia de funções que transforma um valor. O resultado final é a composição de todas as funções registradas, aplicadas em ordem de prioridade.

```ts
// assinatura geral
ServiceFacade.reducer(
    'nomeDoReducer',         // string — nome do ponto de extensão
    (valorAtual, ...args) => novoValor,  // função transformadora
    prioridade               // number — menor número roda primeiro (padrão: 10)
);
```

Os redutores internos do `CmsServiceProvider` usam prioridade `0`. Registre os seus com prioridade maior para rodar depois (comportamento aditivo) ou menor para rodar antes (comportamento de pré-processamento).

---

## Onde registrar redutores

Os redutores devem ser registrados **antes** da aplicação inicializar. O lugar ideal é dentro de um `ServiceProvider` customizado:

```ts
// src/providers/AppServiceProvider.ts
import { ServiceProvider } from '@luminix/support';
import { Cms, Icon, Filter } from '@luminix/mui-cms';
import { Star } from '@mui/icons-material';

class AppServiceProvider extends ServiceProvider {
    register() {
        // registre ícones aqui
        Icon.registerIcon('Star', Star);
    }

    boot() {
        // registre redutores aqui
        Cms.reducer('menuItems', (items) => [
            ...items,
            {
                key: 'relatorios',
                text: 'Relatórios',
                to: '/relatorios',
                icon: Icon.render('Star'),
            },
        ]);
    }
}

export default AppServiceProvider;
```

E passe o provider para o `LuminixCms`:

```tsx
import { LuminixCms } from '@luminix/mui-cms';
import AppServiceProvider from './providers/AppServiceProvider';

<LuminixCms providers={[AppServiceProvider]} />
```

---

## Redutores do CmsService

### componentMap

Substitui componentes internos do painel:

```ts
import MeuLayout from './components/MeuLayout';

Cms.reducer('componentMap', (map) => ({
    ...map,
    Layout: MeuLayout,
}));
```

### menuItems

Personaliza o menu lateral:

```ts
Cms.reducer('menuItems', (items, models) => {
    // remove modelos do menu
    return items.filter(item => item.key !== 'user');
});
```

### cmsRoutes

Adiciona rotas customizadas ao painel. A estrutura de rotas é um array com **um único elemento raiz** que envolve o `Layout` e os providers. Todas as páginas são filhas desse elemento raiz via `children`. Para que o layout (AppBar, Drawer, Notification, Dialog) seja aplicado na nova página, a rota deve ser adicionada em `routes[0].children`:

```ts
import Relatorios from './views/Relatorios';

Cms.reducer('cmsRoutes', (routes, components) => {
    const [root, ...rest] = routes;
    return [
        {
            ...root,
            children: [
                ...(root.children ?? []),
                {
                    path: '/relatorios',
                    element: <Relatorios />,
                },
            ],
        },
        ...rest,
    ];
});
```

> Adicionar a rota fora de `routes[0].children` (ex.: `[...routes, { path: '...' }]`) faz a página renderizar sem o Layout do painel.

### LogoutButton

O botão de logout no rodapé do drawer pode ser personalizado de duas formas:

**1. Apenas o comportamento ao clicar** — via `Cms.logoutUsing()` no `boot()` do seu `ServiceProvider`:

```ts
class AppServiceProvider extends ServiceProvider {
    boot() {
        Cms.logoutUsing(() => {
            // lógica de logout customizada
            window.location.href = '/login';
        });
    }
}
```

**2. Aparência e comportamento completos** — substituindo o componente `'Layout.Drawer.LogoutButton'`:

```tsx
import React from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import type { LogoutButtonProps } from '@luminix/mui-cms';

const MeuLogout: React.FC<LogoutButtonProps> = ({ collapsed }) => (
    <ListItem disablePadding>
        <ListItemButton onClick={() => { /* minha lógica */ }}>
            <ListItemIcon><ExitToApp /></ListItemIcon>
            {!collapsed && <ListItemText primary="Sair do sistema" />}
        </ListItemButton>
    </ListItem>
);

// No boot() do seu ServiceProvider:
Cms.reducer('componentMap', (map) => ({
    ...map,
    'Layout.Drawer.LogoutButton': MeuLogout,
}));
```

O componente recebe a prop `collapsed: boolean` — `true` quando o drawer está recolhido no modo desktop.

---

### wireModelFormProps

Personaliza o formulário de modelo:

```ts
import { Cms } from '@luminix/mui-cms';

Cms.reducer('wireModelFormProps', (props, item) => {
    if (item?.getType() === 'post') {
        return {
            ...props,
            // adicione campos confirmados, campos ocultos, etc.
        };
    }
    return props;
});
```

### model{Name}Columns

Define as colunas da tabela para um modelo específico:

```ts
Cms.reducer('modelPostColumns', () => [
    { key: 'title',      label: 'Título',     scope: 'row', component: 'th' },
    { key: 'author',     label: 'Autor',      align: 'right' },
    { key: 'created_at', label: 'Criado em',  align: 'right', size: 'small' },
]);
```

> A convenção de nome é `model` + nome do modelo em StudlyCase + `Columns`.  
> Ex.: `modelBlogPostColumns` para o modelo `blog_post`.

### rowClickHandlers e row{Name}ClickHandlers

Controlam o que acontece ao clicar em uma linha da tabela de listagem. O redutor acumula uma lista de
**manipuladores** (`RowClickHandler`), e todos são executados, em ordem, no clique.

O `CmsServiceProvider` registra um manipulador padrão em `rowClickHandlers` (prioridade `0`) que navega para
a página de exibição/edição do item — exatamente o comportamento histórico. Itens na lixeira (`deletedAt`)
recebem uma lista vazia, e por isso a linha fica inerte e sem o cursor de ponteiro.

```ts
// adiciona um manipulador para todos os modelos
Cms.reducer('rowClickHandlers', (handlers) => [
    ...handlers,
    ({ item, notify }) => notify(`Você clicou em ${item.getLabel()}`),
]);

// adiciona um manipulador só para o modelo `post`
Cms.reducer('rowPostClickHandlers', (handlers) => [...handlers, meuManipulador]);
```

> A convenção de nome é `row` + nome do modelo em StudlyCase + `ClickHandlers`.  
> Ex.: `rowBlogPostClickHandlers` para o modelo `blog_post`.

O redutor genérico roda primeiro, e o seu resultado é a entrada do redutor por modelo. Retornar uma lista
nova (em vez de espalhar `handlers`) na cadeia por modelo, portanto, descarta o manipulador padrão:

```ts
// substitui completamente o comportamento do clique para `post`
Cms.reducer('rowPostClickHandlers', () => [meuManipulador]);
```

Como esse é o caso de uso mais comum, o `CmsService` oferece dois atalhos — veja
[`Cms.onRowClick` e `Cms.clearRowClickHandlers`](facades.md#cms) — que dispensam conhecer a convenção de
nomes:

```ts
class AppServiceProvider extends ServiceProvider {
    boot() {
        // usa o CRUD automático sem a página de criação/edição:
        // remove a navegação padrão e abre um preview somente-leitura
        Cms.clearRowClickHandlers('post');

        Cms.onRowClick(({ item, dialog }) => dialog({
            title: item.getLabel(),
            message: item.excerpt,
            type: 'alert',
        }), 'post');
    }
}
```

Para deixar a linha totalmente inerte, basta limpar a cadeia e não registrar nada:

```ts
Cms.clearRowClickHandlers('post');
```

> O provider da aplicação inicializa **depois** do `CmsServiceProvider`, então o manipulador padrão já
> existe quando o seu `boot()` roda — limpar e registrar no `boot()` sempre funciona.

O manipulador recebe um [`RowClickEvent`](tipos.md#rowclickevent): os mesmos utilitários das ações de
instância (`item`, `navigate`, `notify`, `dialog`, `refresh`, `t`) mais o `mouseEvent` do React, útil para
ler teclas modificadoras.

---

## Redutores do FilterService

### filterableColumns

Adiciona ou remove colunas do painel de filtros:

```ts
import { Filter } from '@luminix/mui-cms';

Filter.reducer('filterableColumns', (columns, ModelClass) => {
    if (ModelClass.getSchemaName() === 'post') {
        return [
            ...columns,
            {
                key: 'category_id',
                label: 'Categoria',
                type: 'autocomplete',
                nullable: true,
                is_relation: true,
            },
        ];
    }
    return columns;
});
```

---

## Redutores do Model (@luminix/core)

O `@luminix/core` expõe o redutor `model` (e `model{Name}`) para customizar a classe de modelo:

```ts
import { Model } from '@luminix/core';

Model.reducer('modelPost', (Base) => {
    return class extends Base {
        static plural() { return 'Posts do Blog'; }
        static icon()   { return Icon.render('Article'); }
    };
});
```

Consulte a documentação do `@luminix/core` para a lista completa de redutores de modelo.

---

## Prioridades

| Prioridade | Quando usar |
|---|---|
| `0` | Valores padrão da biblioteca (já usados internamente) |
| `1`–`9` | Extensões do pacote `luminix/admin` ou integrações |
| `10` (padrão) | Customizações da aplicação |
| `> 10` | Overrides que precisam sobrescrever customizações anteriores |

---

## Próximos passos

- [Ações](acoes.md) — exemplos práticos de redutores de ações
- [Facades](facades.md) — referência completa dos redutores disponíveis por serviço
- [Volta ao índice](index.md)
