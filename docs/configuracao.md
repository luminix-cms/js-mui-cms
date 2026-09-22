# Configuração

## Tema MUI

O `LuminixCms` aceita uma prop `theme` do tipo `ThemeOptions` (Material-UI). O tema padrão é:

```ts
{
    palette: {
        primary:   { main: '#1d9798' },
        secondary: { main: '#fa510c' },
    },
}
```

Para sobrescrever, passe seu próprio objeto:

```tsx
<LuminixCms
    theme={{
        palette: {
            primary:   { main: '#3f51b5' },
            secondary: { main: '#f50057' },
        },
        typography: {
            fontFamily: 'Inter, sans-serif',
        },
    }}
/>
```

O modo de cor padrão é `auto`: segue automaticamente a preferência do sistema operacional (`prefers-color-scheme: dark`).

### colorScheme

Use a prop `colorScheme` para controlar o modo de cor:

| Valor | Comportamento |
|-------|--------------|
| `'auto'` (padrão) | Segue a preferência do sistema operacional |
| `'light'` | Sempre usa o tema claro |
| `'dark'` | Sempre usa o tema escuro |

```tsx
// sempre claro
<LuminixCms colorScheme="light" />

// sempre escuro
<LuminixCms colorScheme="dark" />

// automático (padrão — mantém o comportamento anterior)
<LuminixCms colorScheme="auto" />
```

### darkTheme

Quando `colorScheme="auto"`, use `darkTheme` para fornecer um objeto de tema distinto para o modo escuro. O `theme` continuará sendo o tema claro.

```tsx
<LuminixCms
    colorScheme="auto"
    theme={{
        palette: {
            primary: { main: '#1d9798' },
        },
    }}
    darkTheme={{
        palette: {
            primary: { main: '#90caf9' },
        },
    }}
/>
```

> **Nota:** `darkTheme` só tem efeito quando `colorScheme="auto"`. Para `colorScheme="dark"`, passe diretamente o tema desejado via `theme`.

### themeArgs

Para argumentos adicionais do `createTheme` (ex.: variáveis de componentes):

```tsx
<LuminixCms
    theme={{ palette: { primary: { main: '#1d9798' } } }}
    themeArgs={[{ components: { MuiButton: { defaultProps: { disableElevation: true } } } }]}
/>
```

---

## Layout

O layout é configurado via chave `luminix.admin.layout` na configuração da aplicação (injetada pelo `luminix/frontend`). As opções disponíveis são definidas pelo tipo `CmsConfig`:

```ts
type CmsConfig = {
    layout?: {
        breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // padrão: 'md'
        drawer?: {
            width?: number; // largura do Drawer em px
        };
        appBar?: {
            height?: number; // altura da AppBar em px
            color?: string;  // cor de fundo da AppBar
        };
    };
};
```

No Laravel, publique e edite o arquivo de configuração do `luminix/admin` para definir esses valores.

---

## URL base do painel

Por padrão, o painel é montado em `/admin`. Para alterar, configure `luminix.admin.url` no backend:

```php
// config/luminix.php
'admin' => [
    'url' => '/painel',
],
```

O `CmsServiceProvider` lê esse valor e configura o `basename` do `react-router-dom` automaticamente.

---

## Marca do painel

O logotipo da barra superior (`Layout.AppLogo`) vem de `luminix.admin.brand`, publicado pelo `luminix/admin`:

```php
// config/luminix.php
'admin' => [
    'brand' => [
        'name'      => 'Acme',                // texto alternativo; padrão: app.name
        'logo'      => '/brand/acme.svg',     // URL servida pela aplicação
        'logo_dark' => '/brand/acme-dark.svg', // opcional, usada no tema escuro
    ],
],
```

| Situação | Logotipo exibido |
|---|---|
| Nenhum `logo` configurado | Marca do Luminix (comportamento anterior) |
| Apenas `logo` | O mesmo arquivo nos temas claro e escuro |
| `logo` e `logo_dark` | `logo_dark` no tema escuro, `logo` no claro |

O tema considerado é o resolvido pelo `LuminixCms` a partir de [`colorScheme`](#colorscheme): com `colorScheme="light"`, o logotipo claro é exibido mesmo que o sistema operacional prefira o modo escuro.

Para um logotipo que não seja uma imagem, substitua o componente `'Layout.AppLogo'` via redutor `componentMap` (veja [Extensibilidade](extensibilidade.md)).

---

## Operadores de filtro disponíveis

Os operadores usados nos filtros da tabela também são configuráveis via `luminix.admin.filter.operators`. O conjunto padrão inclui:

`equals`, `notEquals`, `contains`, `startsWith`, `endsWith`, `greaterThan`, `greaterThanOrEquals`, `lessThan`, `lessThanOrEquals`, `between`, `notBetween`, `null`, `notNull`, `relation`

---

## Providers customizados

Para registrar providers adicionais na inicialização da aplicação, use a prop `providers` do `LuminixCms`:

```tsx
import { LuminixCms } from '@luminix/mui-cms';
import { ServiceProvider } from '@luminix/support';

class MyProvider extends ServiceProvider {
    register() { /* ... */ }
    boot()     { /* ... */ }
}

<LuminixCms providers={[MyProvider]} />
```

Os providers `CmsServiceProvider` e `i18NextServiceProvider` são sempre incluídos automaticamente.

---

## Próximos passos

- [Componentes](componentes.md) — `LuminixCms`, `Link` e providers de contexto
- [Extensibilidade](extensibilidade.md) — customizações via redutores
- [Volta ao índice](index.md)
