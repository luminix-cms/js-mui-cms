# Introdução

`@luminix/mui-cms` é a camada de interface do ecossistema Luminix: uma biblioteca de componentes React construída sobre o Material-UI que entrega um painel administrativo (CMS) completo e extensível, pronto para ser integrado a qualquer aplicação Laravel.

## O ecossistema Luminix

O Luminix é composto por pacotes que cooperam em camadas bem definidas:

```
Laravel (servidor)
├── luminix/backend    → Gera endpoints REST automáticos para modelos Eloquent
└── luminix/frontend   → Injeta dados de boot no HTML via @luminixEmbed()

    ↓ dados chegam ao navegador

JavaScript (cliente)
├── @luminix/support   → Utilitários, padrões Reducible/Macroable, cliente HTTP
├── @luminix/core      → Contêiner de app, sistema de modelos, roteamento
├── @luminix/react     → Hooks e componentes React base (formulários, paginação)
└── @luminix/mui-cms   → Interface MUI: layout, tabelas, filtros, notificações
```

O pacote `luminix/admin` (Laravel) orquestra toda a integração: publica os arquivos React, configura o Vite e serve o painel em `/admin`.

## Responsabilidades de cada camada

### luminix/backend
Aplica a trait `LuminixModel` nos modelos Eloquent e expõe automaticamente endpoints REST em `/luminix-api/*`. Suporta filtros avançados, paginação, ordenação, soft deletes e controle de acesso via Laravel Gates.

Documentação: `luminix/backend/docs/`

### luminix/frontend
Fornece a diretiva Blade `@luminixEmbed()` que injeta no HTML o manifesto de modelos e rotas, configuração da aplicação, usuário autenticado e token CSRF — tudo o que o frontend JavaScript precisa para inicializar.

Documentação: `luminix/frontend/docs/`

### @luminix/support
Base de infraestrutura: coleções, manipulação de strings/objetos/arrays, cliente HTTP com axios, container de aplicação e os padrões `Reducible` e `Macroable` usados em toda a stack.

Documentação: `@luminix/support/docs/`

### @luminix/core
Fachadas de alto nível (`App`, `Auth`, `Config`, `Model`, `Route`) e o sistema de modelos com suporte a relacionamentos e queries encadeadas.

Documentação: `@luminix/core/docs/`

### @luminix/react
Camada React: `LuminixProvider`, `ModelForm`, hooks de formulário (`useForm`), paginação (`usePagination`), requisições (`useQuery`) e acesso a coleções (`useCollection`).

Documentação: `@luminix/react/docs/`

### @luminix/mui-cms _(esta biblioteca)_
Interface completa: layout responsivo com AppBar e Drawer, tabelas com filtros, ações (estáticas, de instância, em massa), sistema de notificações, diálogos e todas as extensões via redutores.

### luminix/admin _(não documentado ainda)_
Pacote Laravel que integra tudo: publica os arquivos React em `resources/js/`, configura o Vite, registra as rotas do painel e serve a SPA em `/admin`. É o ponto de entrada recomendado para quem quer usar o Luminix CMS em um projeto Laravel sem precisar configurar cada peça manualmente.

## Fluxo de dados

1. O Laravel renderiza o HTML com `@luminixEmbed()` — que injeta boot data e manifesto.
2. O JavaScript inicializa o contêiner de aplicação via `@luminix/core`.
3. O `LuminixCms` monta a SPA com `react-router-dom` e Material-UI.
4. O painel descobre os modelos pelo manifesto e gera rotas, menus e telas automaticamente.
5. Toda requisição de dados passa pelo cliente HTTP de `@luminix/support` com o token CSRF já configurado.

---

## Próximos passos

- [Instalação](instalacao.md) — como instalar e configurar o ambiente de desenvolvimento
- [Configuração](configuracao.md) — tema MUI, layout e opções disponíveis
- [Volta ao índice](index.md)
