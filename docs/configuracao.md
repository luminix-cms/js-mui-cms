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

O modo escuro (`dark`) é ativado automaticamente quando o sistema operacional do usuário preferir `prefers-color-scheme: dark`.

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
