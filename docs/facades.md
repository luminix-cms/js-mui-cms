# Facades

As facades são a interface pública dos serviços internos da biblioteca. Elas seguem o padrão `Reducible`, o que significa que qualquer método pode ser extendido via redutores.

## Cms

Facade do `CmsService`. Gerencia rotas, menu, componentes e ações do painel.

```ts
import { Cms } from '@luminix/mui-cms';
```

### Métodos

#### `Cms.getRoutes(): RouteObject[]`

Retorna as rotas registradas no painel (formato do `react-router-dom`).

#### `Cms.getMenuItems(): MenuItem[]`

Retorna os itens do menu lateral. Por padrão inclui o Dashboard e um item para cada modelo do manifesto.

#### `Cms.getComponents(): Record<string, React.ComponentType>`

Retorna o mapa de componentes registrados (ver [Componentes](componentes.md)).

#### `Cms.getComponent(name: string): React.ComponentType`

Retorna um componente pelo nome.

#### `Cms.getModelFormProps(item: ModelType): ModelFormProps`

Retorna as props do `ModelForm` para um item específico.

#### `Cms.getMassActions(ModelClass, currentTab): MassAction[]`

Retorna as ações em massa disponíveis para o modelo e aba ativos.

#### `Cms.getInstanceActions(ModelClass, currentTab): InstanceAction[]`

Retorna as ações de instância (por linha) disponíveis.

#### `Cms.getStaticActions(ModelClass, currentTab): StaticAction[]`

Retorna as ações estáticas (nível de listagem, ex.: "Criar novo").

### Redutores disponíveis

| Redutor | Assinatura | Uso |
|---|---|---|
| `cmsRoutes` | `(routes, components, models) => routes` | Adicionar/modificar rotas |
| `componentMap` | `(map) => map` | Substituir componentes internos |
| `menuItems` | `(items, models) => items` | Personalizar o menu lateral |
| `wireModelFormProps` | `(props, item) => props` | Alterar props do formulário por modelo |
| `massActions` | `(actions, ModelClass, tab) => actions` | Adicionar/remover ações em massa |
| `instanceActions` | `(actions, ModelClass, tab) => actions` | Adicionar/remover ações de instância |
| `staticActions` | `(actions, ModelClass, tab) => actions` | Adicionar/remover ações estáticas |
| `model{Name}Columns` | `() => Column[]` | Definir colunas da tabela por modelo |
| `mass{Name}Actions` | idem massActions | Ações em massa específicas por modelo |
| `instance{Name}Actions` | idem instanceActions | Ações de instância específicas por modelo |
| `static{Name}Actions` | idem staticActions | Ações estáticas específicas por modelo |

> `{Name}` é o nome do modelo em StudlyCase. Ex.: `modelPostColumns`, `massPostActions`.

---

## Filter

Facade do `FilterService`. Gerencia os filtros avançados da tabela.

```ts
import { Filter } from '@luminix/mui-cms';
```

### Métodos

#### `Filter.getInputType(type: string): string`

Converte o tipo PHP/Eloquent do atributo no tipo de input HTML correspondente.

| Tipo do modelo | Input retornado |
|---|---|
| `int`, `float`, `number` | `number` |
| `date` | `date` |
| `datetime`, `timestamp` | `datetime-local` |
| `bool`, `boolean` | `boolean` |
| `autocomplete` | `autocomplete` |
| demais | `text` |

#### `Filter.getOperators(): string[]`

Retorna a lista de operadores configurada em `luminix.admin.filter.operators`.

#### `Filter.getMatchingOperators(column: FilterColumn): InputOption[]`

Retorna os operadores aplicáveis a uma coluna específica, filtrando por tipo e nullable.

#### `Filter.getFilterableColumns(ModelClass): FilterColumn[]`

Retorna as colunas filtráveis do modelo (atributos não ocultos e relacionamentos).

#### `Filter.checkIfCanApplyFilters(columnsFilter: FilteredColumn[]): boolean`

Verifica se o estado atual dos filtros é válido para envio (retorna `true` se houver filtro incompleto).

### Redutores disponíveis

| Redutor | Assinatura | Uso |
|---|---|---|
| `filterableColumns` | `(columns, ModelClass) => columns` | Adicionar/remover colunas filtráveis |

---

## Icon

Serviço de gerenciamento de ícones. **Não** é uma facade `Reducible`; é um singleton instanciado diretamente.

```ts
import { Icon } from '@luminix/mui-cms';
```

### Ícones registrados por padrão

A biblioteca pré-registra os seguintes ícones do `@mui/icons-material`:

`Add`, `AddCircleOutline`, `ArrowDownward`, `ArrowDropDown`, `ArrowUpward`, `CategoryOutlined`, `ChevronLeft`, `ChevronRight`, `Close`, `DashboardOutlined`, `ExpandLess`, `ExpandMore`, `FilterList`, `FirstPage`, `HighlightOffOutlined`, `LastPage`, `Menu`, `MoreVert`, `PeopleOutlined`, `Search`, `SwapVert`

### Métodos

#### `Icon.registerIcon(name, component)`

Registra um ícone individual:

```ts
import { Icon } from '@luminix/mui-cms';
import { Star } from '@mui/icons-material';

Icon.registerIcon('Star', Star);
```

#### `Icon.registerIcon(iconMap)`

Registra múltiplos ícones de uma vez:

```ts
import { Star, Home } from '@mui/icons-material';

Icon.registerIcon({ Star, Home });
```

#### `Icon.make(name: string): React.ComponentType`

Retorna o componente do ícone pelo nome.

#### `Icon.render(name: string, props?): React.ReactNode`

Renderiza o ícone como nó React:

```ts
Icon.render('Star', { fontSize: 'small', color: 'primary' })
```

#### `Icon.forModel(model: string, icon: string)`

Associa um ícone a um modelo. O nome do modelo deve ser o `schemaName` (snake_case):

```ts
Icon.forModel('post', 'Article');
Icon.forModel('user', 'PeopleOutlined'); // já registrado por padrão
```

#### `Icon.all(): string[]`

Lista os nomes de todos os ícones registrados.

---

## Próximos passos

- [Hooks](hooks.md) — hooks para uso em componentes customizados
- [Ações](acoes.md) — como definir ações para os modelos
- [Extensibilidade](extensibilidade.md) — redutores em profundidade
- [Volta ao índice](index.md)
