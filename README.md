# @luminix/mui-cms

Biblioteca de componentes React + Material-UI para construção de painéis administrativos (CMS) integrada ao ecossistema Luminix.

Oferece layout responsivo, tabelas com filtros avançados, ações em massa, formulários de modelo e sistema de notificações — tudo extensível via redutores.

---

## Pré-requisitos

Esta biblioteca faz parte do ecossistema Luminix e requer os projetos complementares para funcionar:

| Projeto | Papel |
|---|---|
| `luminix/backend` | API REST automática via Laravel |
| `luminix/frontend` | Injeção de dados de boot via Blade |
| `luminix/admin` | Pacote Laravel que publica e serve o painel |
| `@luminix/core` | Contêiner de aplicação, modelos e roteamento |
| `@luminix/react` | Hooks e componentes React base |
| `@luminix/support` | Utilitários e padrões de infraestrutura |

> O projeto `luminix/admin` é o ponto de entrada recomendado: ele instala e configura todas as dependências automaticamente.

## Documentação completa

Consulte a documentação detalhada em [`docs/`](docs/index.md):

- [Introdução e ecossistema](docs/introducao.md)
- [Instalação](docs/instalacao.md)
- [Configuração](docs/configuracao.md)
- [Componentes](docs/componentes.md)
- [Facades](docs/facades.md)
- [Hooks](docs/hooks.md)
- [Ações](docs/acoes.md)
- [Extensibilidade](docs/extensibilidade.md)
- [Referência de tipos](docs/tipos.md)

## Licença

MIT
