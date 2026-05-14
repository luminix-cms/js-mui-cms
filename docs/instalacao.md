# Instalação

## Via luminix/admin (recomendado)

O caminho mais simples é usar o pacote Laravel `luminix/admin`, que instala e configura todas as dependências automaticamente:

```bash
composer require luminix/admin
php artisan luminix:admin-ui
```

O comando `luminix:admin-ui` publica os arquivos JavaScript em `resources/js/`, instala as dependências npm e configura o Vite. Após isso, basta compilar:

```bash
npm run build
# ou, em desenvolvimento:
npm run dev
```

O painel estará disponível em `/admin`.

> Consulte a documentação do `luminix/admin` para detalhes sobre middleware, permissões e configuração do servidor.

---

## Instalação manual

Se preferir integrar a biblioteca em um projeto React existente, instale as dependências:

```bash
npm install @luminix/mui-cms \
  @luminix/core \
  @luminix/react \
  @luminix/support \
  @mui/material \
  @mui/icons-material \
  @emotion/react \
  @emotion/styled \
  @fontsource/roboto \
  i18next \
  react-i18next \
  react-router-dom@6.25.1
```

### Ponto de entrada

```tsx
// src/main.tsx
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { LuminixCms } from '@luminix/mui-cms';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <LuminixCms />
    </React.StrictMode>
);
```

### Pré-requisitos no backend

A instalação manual requer que o backend Laravel já tenha os pacotes `luminix/backend` e `luminix/frontend` configurados, com `@luminixEmbed()` presente no template Blade que carrega o JavaScript.

---

## Dependências peer

| Pacote | Versão mínima |
|---|---|
| `react` | ^18.3.1 |
| `react-dom` | ^18.3.1 |
| `react-router-dom` | 6.25.1 |
| `@mui/material` | ^5.16.5 |
| `@mui/icons-material` | ^5.16.5 |
| `@emotion/react` | ^11.13.0 |
| `@emotion/styled` | ^11.13.0 |
| `@fontsource/roboto` | ^5.0.12 |
| `@luminix/core` | ^1.0.0 |
| `@luminix/react` | ^1.0.0 |
| `@luminix/support` | ^1.0.1 |
| `i18next` | ^23.12.2 |
| `react-i18next` | ^15.0.1 |

---

## Próximos passos

- [Configuração](configuracao.md) — personalize o tema e o layout
- [Componentes](componentes.md) — conheça o `LuminixCms` e os providers
- [Volta ao índice](index.md)
