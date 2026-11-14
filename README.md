# take-notes-web

Interface web do **DDIA Knowledge Studio** — um workspace para transformar notas brutas de leitura do livro *Designing Data-Intensive Applications* (Martin Kleppmann) em Markdown estruturado e otimizado para RAG (Retrieval-Augmented Generation).

Você escreve notas enquanto lê, clica em gerar, e a IA produz documentos `.md` com frontmatter YAML, hierarquia de títulos consistente e diagramas Mermaid — prontos para ingestão em uma base de conhecimento vetorial.

---

## Screenshots

<table>
  <tr>
    <td><img src="prints/Captura%20de%20Tela%202026-11-14%20às%2007.54.19.png" width="300"/></td>
    <td><img src="prints/Captura%20de%20Tela%202026-11-14%20às%2007.54.32.png" width="300"/></td>
    <td><img src="prints/Captura%20de%20Tela%202026-11-14%20às%2007.55.01.png" width="300"/></td>
  </tr>
  <tr>
    <td><img src="prints/Captura%20de%20Tela%202026-11-14%20às%2007.55.42.png" width="300"/></td>
    <td><img src="prints/Captura%20de%20Tela%202026-11-14%20às%2007.55.58.png" width="300"/></td>
    <td></td>
  </tr>
</table>

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Estilo | Tailwind CSS 4 + CVA |
| Componentes | shadcn/ui (Radix UI) |
| Roteamento | React Router v7 |
| Data fetching | TanStack Query v5 |
| HTTP | Axios |
| Markdown | react-markdown + rehype-highlight + remark-gfm |
| Diagramas | Mermaid |
| Notificações | Sonner |
| Validação | Zod |
| Testes | Vitest + Testing Library |

---

## Como rodar

```bash
# instalar dependências
yarn install

# configurar variável de ambiente
cp .env.example .env
# edite VITE_API_URL com a URL do backend

# rodar em desenvolvimento
yarn dev
```

Acesse `http://localhost:5173`.

```bash
yarn build      # build de produção
yarn preview    # preview do build
yarn test       # rodar testes
yarn lint       # checar lint (zero warnings)
```

### Variável de ambiente

```env
VITE_API_URL=http://localhost:3000
```

---

## Estrutura do projeto

```
src/
├── app/                        # Lógica, dados e configuração
│   ├── config/
│   │   └── env.ts              # Variáveis de ambiente validadas com Zod
│   ├── hooks/
│   │   ├── mutations/          # Hooks de escrita (POST/PUT/DELETE)
│   │   │   ├── useCreateBook.ts
│   │   │   ├── useUpdateBook.ts
│   │   │   ├── useDeleteBook.ts
│   │   │   ├── useCreateChapter.ts
│   │   │   ├── useUpdateChapter.ts
│   │   │   ├── useDeleteChapter.ts
│   │   │   ├── useUpsertNote.ts
│   │   │   ├── useGenerateStructured.ts
│   │   │   └── useUpdateStructured.ts
│   │   └── query/              # Hooks de leitura (GET)
│   │       ├── useBooks.ts
│   │       ├── useChapters.ts
│   │       ├── useNote.ts
│   │       └── useStructured.ts
│   ├── libs/
│   │   ├── queryClient.ts      # Configuração do TanStack Query
│   │   └── utils.ts            # cn() helper (clsx + tailwind-merge)
│   ├── services/               # Camada HTTP — nunca chamada diretamente pela UI
│   │   ├── Service.ts          # Classe base com instância axios
│   │   ├── BookService.ts
│   │   ├── ChapterService.ts
│   │   ├── NoteService.ts
│   │   └── StructuredService.ts
│   ├── types/                  # Tipos de domínio
│   │   ├── Book.ts
│   │   ├── Chapter.ts
│   │   ├── Note.ts
│   │   └── Structured.ts
│   └── router.tsx              # Rotas com lazy loading
├── ui/                         # Interface — JSX, Tailwind, componentes
│   ├── components/
│   │   ├── MarkdownPreview/    # Renderizador de Markdown com suporte a Mermaid
│   │   └── ui/                 # Primitivos shadcn/ui (nunca editar diretamente)
│   │       └── button.tsx
│   ├── pages/
│   │   ├── Books/              # Página inicial — lista de livros
│   │   │   ├── components/
│   │   │   │   ├── BookCard/
│   │   │   │   └── CreateBookModal/
│   │   │   ├── index.tsx
│   │   │   └── useBooksController.ts
│   │   └── Studio/             # Workspace de um livro
│   │       ├── components/
│   │       │   ├── Sidebar/
│   │       │   ├── ChapterHeader/
│   │       │   ├── NoteEditor/
│   │       │   ├── GenerationBar/
│   │       │   └── StructuredViewer/
│   │       ├── index.tsx
│   │       └── useStudioController.ts
│   └── styles/
│       └── global.css
├── test/
│   └── setup.ts
├── App.tsx                     # Entry point — providers globais
└── main.tsx                    # Montagem do React DOM
```

### Rotas

| Path | Página | Descrição |
|---|---|---|
| `/` | `Books` | Lista de livros cadastrados |
| `/books/:bookId` | `Studio` | Workspace de notas e geração de Markdown |

---

## Arquitetura

### Separação `app/` vs `ui/`

Todo o projeto segue uma separação rígida entre lógica e interface:

- `app/` — lógica, tipos, serviços, hooks, configuração. Sem JSX.
- `ui/` — componentes, páginas, estilos. Sem regras de negócio.

### Fluxo de dados

```
UI (View)
  └── Controller Hook (use[Page]Controller)
        └── Query/Mutation Hook (app/hooks/)
              └── Service (app/services/)
                    └── API (axios)
```

A view é **burra** — recebe dados prontos e handlers do controller, e apenas renderiza.

### Controller Hooks

Cada página tem um controller hook que concentra toda a lógica:

```typescript
// ui/pages/Books/useBooksController.ts
export function useBooksController() {
  const { books, isLoading } = useBooks();
  const { createBook } = useCreateBook();
  // estado, handlers, efeitos...
  return { books, isLoading, handleCreate };
}

// ui/pages/Books/index.tsx
export function Books() {
  const { books, isLoading, handleCreate } = useBooksController();
  // apenas JSX
}
```

### Services

Toda comunicação HTTP passa pelos services. Hooks nunca fazem chamadas diretas.

```typescript
// app/services/BookService.ts
export class BookService extends Service {
  static async getBooks(): Promise<BookService.BooksResponse> {
    const { data } = await this.client.get('/books');
    return data;
  }
}
```

### Path alias

```typescript
// tsconfig.json → "@/*": ["./src/*"]

import { useBooks } from '@/app/hooks/query/useBooks';
import { Button } from '@/ui/components/ui/button';
import { BookCard } from './components/BookCard'; // relativo para locais
```

---

## Regras de decisão

| Pergunta | Onde colocar |
|---|---|
| É visual (JSX, Tailwind)? | `ui/` |
| É lógica, tipo, serviço? | `app/` |
| Componente usado em 2+ páginas? | `ui/components/` |
| Componente exclusivo de uma página? | `ui/pages/[Page]/components/` |
| Hook que busca dados (GET)? | `app/hooks/query/` |
| Hook que altera dados (POST/PUT/DELETE)? | `app/hooks/mutations/` |
| Chamada HTTP real? | `app/services/` |
| Tipo de domínio? | `app/types/` |
| Config de lib externa? | `app/libs/` |
| Lógica de uma página? | Controller hook dentro da pasta da página |
| Lógica reutilizável entre páginas? | Hook em `app/hooks/app/` |

## Convenções de nomenclatura

| Tipo | Padrão | Exemplo |
|---|---|---|
| Hook de query | `use[Resource]` | `useBooks`, `useChapters` |
| Hook de mutation | `use[Action][Resource]` | `useCreateBook`, `useDeleteChapter` |
| Controller hook | `use[Page]Controller` | `useBooksController` |
| Query key | `['resource', ...params]` | `['books']`, `['chapters', bookId]` |
| Handler | prefixo `handle` | `handleCreate`, `handleSelect` |
