# Componentes

## LuminixCms

Componente raiz da aplicação. Deve ser renderizado uma única vez no ponto de entrada do projeto.

```tsx
import { LuminixCms } from '@luminix/mui-cms';

<LuminixCms
    theme={themeOptions}       // ThemeOptions (MUI) — opcional
    themeArgs={[extraTheme]}   // object[] — argumentos adicionais para createTheme
    providers={[MyProvider]}   // ServiceProvider[] — providers adicionais
/>
```

Internamente, o `LuminixCms`:
1. Cria o tema MUI com suporte automático a modo escuro.
2. Registra `CmsServiceProvider` e `i18NextServiceProvider`.
3. Delega a renderização ao `LuminixProvider` de `@luminix/react`, que inicializa o contêiner de aplicação e o roteador.

---

## Link

Componente de navegação interna. Equivale ao `Link` do `react-router-dom`, mas integrado ao sistema de layout da biblioteca.

```tsx
import { Link } from '@luminix/mui-cms';

<Link to="/posts">Ver posts</Link>
```

---

## Providers de contexto

Os providers a seguir são usados internamente pelas views e componentes da biblioteca. Em cenários avançados, você pode usá-los para acessar os contextos em componentes customizados.

### DialogProvider

Fornece o contexto de diálogos modais. Necessário para que `useDialog` funcione.

```tsx
import { DialogProvider } from '@luminix/mui-cms';

<DialogProvider>
    {/* seus componentes */}
</DialogProvider>
```

### NotificationProvider

Fornece o contexto de notificações toast. Necessário para `useNotify`.

```tsx
import { NotificationProvider } from '@luminix/mui-cms';

<NotificationProvider
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // SnackbarProps
    variant="filled" // 'filled' | 'outlined' | 'standard'
>
    {/* seus componentes */}
</NotificationProvider>
```

### LayoutProvider

Gerencia o estado do layout (drawer aberto/fechado, breakpoint, título da página).

```tsx
import { LayoutProvider } from '@luminix/mui-cms';

<LayoutProvider>
    {/* seus componentes */}
</LayoutProvider>
```

### ModelProvider

Disponibiliza a classe de modelo atual para os componentes filhos (ex.: dentro de uma tela de listagem).

```tsx
import { ModelProvider } from '@luminix/mui-cms';

<ModelProvider Model={PostModel}>
    {/* seus componentes */}
</ModelProvider>
```

### TableProvider

Fornece o estado da tabela (seleção, ordenação, paginação) para os componentes de `ModelIndex`.

```tsx
import { TableProvider } from '@luminix/mui-cms';

<TableProvider>
    {/* seus componentes */}
</TableProvider>
```

---

## Componentes internos (registrados via redutor)

O `CmsServiceProvider` registra um mapa de componentes acessível via `Cms.getComponent(name)`. Esses componentes podem ser substituídos por customizados usando o redutor `componentMap`.

| Chave | Componente padrão |
|---|---|
| `Layout` | Layout raiz da aplicação |
| `Dashboard` | Tela inicial |
| `ModelIndex` | Tela de listagem de modelos |
| `ModelItem` | Tela de criação/edição |
| `Error` | Tela de erro |
| `Layout.AppBar` | Barra superior |
| `Layout.AppLogo` | Logo no drawer |
| `Layout.Drawer` | Menu lateral |
| `Layout.SearchBar` | Campo de busca |
| `Layout.BackButton` | Botão voltar |
| `ModelIndex.Filter` | Painel de filtros avançados |
| `ModelIndex.Table` | Tabela de dados |
| `ModelIndex.Pagination` | Paginação |
| `ModelIndex.MassActions` | Ações em massa |
| `ModelIndex.InstanceActions` | Ações por linha |
| `ModelIndex.StaticActions` | Ações globais (ex.: "Criar") |
| `ModelIndex.Tabs` | Abas de filtro (ex.: lixeira) |

Para substituir um componente:

```ts
import { Cms } from '@luminix/mui-cms';
import MeuDashboard from './MeuDashboard';

Cms.reducer('componentMap', (map) => ({
    ...map,
    Dashboard: MeuDashboard,
}));
```

---

## Próximos passos

- [Facades](facades.md) — como usar `Cms`, `Filter` e `Icon`
- [Hooks](hooks.md) — hooks disponíveis para uso em componentes customizados
- [Volta ao índice](index.md)
