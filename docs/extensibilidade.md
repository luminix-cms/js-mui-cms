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
