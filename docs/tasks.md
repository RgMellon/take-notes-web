# Tasks — take-notes-web Refactor

Status: `[ ]` pendente · `[x]` concluído · `[~]` em progresso

---

## Fase 1 — Fundação

### T01 — Instalar dependências
- [ ] `yarn add react-router-dom`
- [ ] Confirmar que `axios`, `@tanstack/react-query` e `zod` já estão no `package.json`

### T02 — Variável de ambiente
- [ ] Criar `.env` na raiz com `VITE_API_URL=http://localhost:3000`
- [ ] Confirmar que `src/app/config/env.ts` já valida `VITE_API_URL` com Zod ✓

### T03 — Tipos de domínio
Criar em `src/app/types/`:
- [ ] `Book.ts` — `{ id, title, author, createdAt, updatedAt }`
- [ ] `Chapter.ts` — `{ id, bookId, number, title, tags, status: 'DRAFT' | 'STRUCTURED', createdAt, updatedAt }`
- [ ] `Note.ts` — `{ id, chapterId, content, updatedAt }`
- [ ] `Structured.ts` — `{ id, chapterId, markdownContent, frontmatter: Record<string, unknown>, generatedAt }`

### T04 — Services
Criar em `src/app/services/`:
- [ ] `BookService.ts` — `getBooks`, `getBookById`, `createBook`, `updateBook`, `deleteBook`
- [ ] `ChapterService.ts` — `getChapters`, `getChapterById`, `createChapter`, `updateChapter`, `deleteChapter`
- [ ] `NoteService.ts` — `getNote`, `upsertNote`
- [ ] `StructuredService.ts` — `generate`, `getStructured`

### T05 — Hooks de query
Criar em `src/app/hooks/query/`:
- [ ] `useBooks.ts` — `GET /books`
- [ ] `useChapters.ts` — `GET /books/:bookId/chapters`
- [ ] `useNote.ts` — `GET /chapters/:chapterId/note`
- [ ] `useStructured.ts` — `GET /chapters/:chapterId/structured`

### T06 — Hooks de mutation
Criar em `src/app/hooks/mutations/`:
- [ ] `useCreateBook.ts` — invalida `['books']`
- [ ] `useUpdateBook.ts` — invalida `['books']`
- [ ] `useDeleteBook.ts` — invalida `['books']`
- [ ] `useCreateChapter.ts` — invalida `['chapters', bookId]`
- [ ] `useUpdateChapter.ts` — invalida `['chapters', bookId]`
- [ ] `useDeleteChapter.ts` — invalida `['chapters', bookId]`
- [ ] `useUpsertNote.ts` — invalida `['note', chapterId]`
- [ ] `useGenerateStructured.ts` — invalida `['structured', chapterId]` + `['chapters', bookId]` (status muda)

---

## Fase 2 — Roteamento e App.tsx

### T07 — Configurar router
- [ ] Criar `src/app/router.tsx` com as rotas:
  - `/` → `Books`
  - `/books/:bookId` → `Studio`
- [ ] Atualizar `App.tsx` para usar `RouterProvider` + `QueryClientProvider`

---

## Fase 3 — Componentes globais

### T08 — Mover MarkdownPreview
- [ ] Mover `src/components/markdown-preview.tsx` → `src/ui/components/MarkdownPreview/index.tsx`
- [ ] Atualizar imports

### T09 — Reorganizar utils e estilos
- [ ] Mover `src/lib/utils.ts` → `src/app/libs/utils.ts`
- [ ] Mover `src/styles.css` → `src/ui/styles/global.css`
- [ ] Atualizar import do `styles.css` em `main.tsx`
- [ ] Mover `src/components/ui/button.tsx` → `src/ui/components/ui/button.tsx`

---

## Fase 4 — Página Books

### T10 — Componente BookCard
- [ ] Criar `src/ui/pages/Books/components/BookCard/index.tsx`
  - Exibe título, autor, contador de capítulos
  - Ação de navegar para `/books/:id`
  - Ação de deletar

### T11 — Componente CreateBookModal
- [ ] Criar `src/ui/pages/Books/components/CreateBookModal/index.tsx`
  - Form com campos `title` e `author`
  - Submit chama `useCreateBook`

### T12 — Página Books
- [ ] Criar `src/ui/pages/Books/useBooksController.ts`
  - Usa `useBooks`, `useCreateBook`, `useDeleteBook`
  - Controla estado do modal
- [ ] Criar `src/ui/pages/Books/index.tsx`
  - Lista de `BookCard`
  - Botão "Novo livro" abre `CreateBookModal`
  - Estado vazio com CTA

---

## Fase 5 — Página Studio

### T13 — Componente Sidebar
- [ ] Criar `src/ui/pages/Studio/components/Sidebar/index.tsx`
  - Lista capítulos do livro
  - Indicador de status `DRAFT` / `STRUCTURED`
  - Botão de adicionar capítulo
  - Busca por título

### T14 — Componente ChapterHeader
- [ ] Criar `src/ui/pages/Studio/components/ChapterHeader/index.tsx`
  - Exibe número, título (editável), tags, status
  - Edição de título chama `useUpdateChapter`

### T15 — Componente NoteEditor
- [ ] Criar `src/ui/pages/Studio/components/NoteEditor/index.tsx`
  - Textarea para nota bruta
  - Auto-save com debounce chamando `useUpsertNote`
  - Contador de palavras/caracteres

### T16 — Componente GenerationBar
- [ ] Criar `src/ui/pages/Studio/components/GenerationBar/index.tsx`
  - Botão "Gerar Markdown"
  - Chama `useGenerateStructured`
  - Estado de loading

### T17 — Componente StructuredViewer
- [ ] Criar `src/ui/pages/Studio/components/StructuredViewer/index.tsx`
  - Tabs: Preview / Split / Raw
  - Usa `MarkdownPreview` para renderizar
  - Botões de copiar e baixar `.md`

### T18 — Controller e View do Studio
- [ ] Criar `src/ui/pages/Studio/useStudioController.ts`
  - Lê `bookId` do `useParams`
  - Gerencia capítulo selecionado
  - Orquestra todos os hooks
- [ ] Criar `src/ui/pages/Studio/index.tsx`
  - Compõe Sidebar + ChapterHeader + NoteEditor + GenerationBar + StructuredViewer

---

## Fase 6 — Limpeza

### T19 — Remover código legado
- [ ] Deletar `src/lib/chapters.ts`
- [ ] Deletar `src/lib/` (se vazia)
- [ ] Deletar `src/components/` (após migração)
- [ ] Remover lógica de `localStorage` de capítulos do `App.tsx`
- [ ] Remover modal de API key do `App.tsx`

### T20 — Atualizar documentação
- [ ] Atualizar `docs/overview.md` com nova stack e arquitetura
- [ ] Marcar tasks concluídas neste arquivo

---

## Decisões tomadas

- **Auth:** sem autenticação agora, mas router já preparado para receber rotas protegidas no futuro (estrutura separada em `app/router.tsx`)
- **Books vazio:** lista vazia com botão "Novo livro"
- **Export .zip:** removido
- **Tema:** fixo no dark
