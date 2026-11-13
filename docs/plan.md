# Plano de Refatoração + Implementação — take-notes-web

## Contexto

O front atual é um monólito em `App.tsx` (~300 linhas) com toda lógica, estado e JSX misturados. Ele era standalone (localStorage + OpenAI direto), mas agora existe um backend NestJS completo com persistência real em PostgreSQL.

O objetivo é refatorar o front para consumir a API do back, seguindo rigorosamente as rules do projeto.

---

## Mapeamento: Front atual → Back

| Front atual (localStorage) | Back (API REST) |
|---|---|
| `Chapter` (tipo local) | `GET /books/:bookId/chapters` |
| `raw_notes` no estado | `PUT /chapters/:chapterId/note` |
| `optimized_markdown` no estado | `GET /chapters/:chapterId/structured` |
| `fetch` direto para OpenAI | `POST /chapters/:chapterId/generate` |
| `topics` no estado | `tags` retornadas pelo back após generate |
| Livro hardcoded (DDIA) | `POST /books` + `GET /books` |
| `localStorage` para persistência | PostgreSQL via API |

---

## Novos tipos de domínio

```
app/types/
├── Book.ts       ← { id, title, author, createdAt, updatedAt }
├── Chapter.ts    ← { id, bookId, number, title, tags, status: 'DRAFT' | 'STRUCTURED' }
├── Note.ts       ← { id, chapterId, content, updatedAt }
└── Structured.ts ← { id, chapterId, markdownContent, frontmatter, generatedAt }
```

---

## Novos services

```
app/services/
├── Service.ts          ← já existe (classe base axios)
├── BookService.ts      ← CRUD de livros
├── ChapterService.ts   ← CRUD de capítulos (nested em /books/:bookId/chapters)
├── NoteService.ts      ← GET + PUT /chapters/:chapterId/note
└── StructuredService.ts← POST /generate + GET /structured
```

---

## Novos hooks

```
app/hooks/
├── query/
│   ├── useBooks.ts           ← GET /books
│   ├── useChapters.ts        ← GET /books/:bookId/chapters
│   ├── useNote.ts            ← GET /chapters/:chapterId/note
│   └── useStructured.ts      ← GET /chapters/:chapterId/structured
└── mutations/
    ├── useCreateBook.ts      ← POST /books
    ├── useUpdateBook.ts      ← PATCH /books/:id
    ├── useDeleteBook.ts      ← DELETE /books/:id
    ├── useCreateChapter.ts   ← POST /books/:bookId/chapters
    ├── useUpdateChapter.ts   ← PATCH /books/:bookId/chapters/:id
    ├── useDeleteChapter.ts   ← DELETE /books/:bookId/chapters/:id
    ├── useUpsertNote.ts      ← PUT /chapters/:chapterId/note
    └── useGenerateStructured.ts ← POST /chapters/:chapterId/generate
```

---

## Nova estrutura de páginas

O app atual é uma única tela. Após o refactor, terá duas páginas:

```
ui/pages/
├── Books/                        ← lista de livros (home)
│   ├── components/
│   │   ├── BookCard/             ← card de um livro
│   │   └── CreateBookModal/      ← modal de criação
│   ├── index.tsx
│   └── useBooksController.ts
└── Studio/                       ← workspace de um livro (tela atual)
    ├── components/
    │   ├── Sidebar/              ← lista de capítulos
    │   ├── ChapterHeader/        ← título, número, tags, status
    │   ├── NoteEditor/           ← textarea de notas brutas
    │   ├── StructuredViewer/     ← preview/raw/split do markdown
    │   ├── GenerationBar/        ← botão de gerar + status
    │   └── ApiKeyModal/          ← removido (chave fica no back)
    ├── index.tsx
    └── useStudioController.ts
```

---

## Roteamento

Instalar `react-router-dom` e criar duas rotas:

```
/           → Books (lista de livros)
/books/:id  → Studio (workspace do livro)
```

```
app/
└── (sem pasta navigation — web usa react-router-dom diretamente nos controllers)
```

---

## Mudanças no App.tsx

O `App.tsx` vira apenas providers globais:

```tsx
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

---

## O que muda na lógica de geração

Hoje: front chama OpenAI diretamente com a chave do usuário.
Depois: front chama `POST /chapters/:chapterId/generate` → back chama Gemini/OpenAI.

- Remove `apiKey` state, `showApiKey` state e o modal de chave
- Remove `ragInstructions` e `validateMarkdown` do front (lógica fica no back)
- O status do capítulo (`DRAFT` | `STRUCTURED`) vem do back — não precisa de estado local

---

## O que é reaproveitado

| Arquivo atual | Destino |
|---|---|
| `src/components/markdown-preview.tsx` | `ui/components/MarkdownPreview/index.tsx` |
| `src/components/ui/button.tsx` | `ui/components/ui/button.tsx` (mantém) |
| `src/lib/utils.ts` | `app/libs/utils.ts` |
| `src/styles.css` | `ui/styles/global.css` |
| `src/lib/chapters.ts` → `chapterTitles` | descartado (títulos vêm do back) |
| `src/lib/chapters.ts` → `filename()` | `app/utils/filename.ts` |
| `src/lib/chapters.ts` → `ragInstructions` | descartado (prompt fica no back) |
| `src/lib/chapters.ts` → `validateMarkdown` | descartado (validação fica no back) |

---

## Ordem de execução

### Fase 1 — Fundação (sem UI)
1. Criar tipos de domínio (`app/types/`)
2. Criar services (`app/services/`)
3. Criar hooks de query (`app/hooks/query/`)
4. Criar hooks de mutation (`app/hooks/mutations/`)
5. Instalar e configurar `react-router-dom`

### Fase 2 — Páginas
6. Criar página `Books` (lista + criação de livros)
7. Criar página `Studio` (workspace — refactor do App.tsx atual)
8. Migrar `App.tsx` para apenas providers + router

### Fase 3 — Componentes globais
9. Mover `MarkdownPreview` para `ui/components/`
10. Reorganizar `ui/styles/`

### Fase 4 — Limpeza
11. Remover `src/lib/chapters.ts` (lógica migrada ou descartada)
12. Remover modal de API key
13. Remover `localStorage` de capítulos
14. Atualizar `docs/overview.md`

---

## Dependências a instalar

```bash
yarn add react-router-dom
yarn add -D @types/react-router-dom  # se necessário
```

---

## Variável de ambiente necessária

```env
# .env
VITE_API_URL=http://localhost:3000
```
