# Data Fetching — Hooks de Query e Mutation

## Organização

```
app/hooks/
├── query/      # Leitura (GET) — useQuery
└── mutations/  # Escrita (POST/PUT/DELETE) — useMutation
```

Hooks **nunca** fazem chamadas HTTP diretamente — sempre delegam para `app/services/`.

## Setup (`app/libs/queryClient.ts`)

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: Infinity },
    mutations: { retry: false },
  },
});
```

Provider em `App.tsx`:

```typescript
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/app/libs/queryClient';

<QueryClientProvider client={queryClient}>
  {children}
</QueryClientProvider>
```

## Hooks de Query (`app/hooks/query/`)

```typescript
// app/hooks/query/useNotes.ts
import { useQuery } from '@tanstack/react-query';
import { NoteService } from '@/app/services/NoteService';

export function useNotes() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notes'],
    queryFn: () => NoteService.getNotes(),
  });

  return { notes: data?.notes, isLoading, refetch };
}
```

### Convenções de Query

- `queryKey`: array — primeiro item é o recurso, demais são parâmetros
- `staleTime: Infinity` já configurado no `queryClient` global
- `enabled`: controla execução condicional — `enabled: !!id`
- `placeholderData: (prev) => prev`: mantém dados anteriores durante refetch

## Hooks de Mutation (`app/hooks/mutations/`)

```typescript
// app/hooks/mutations/useCreateNote.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NoteService } from '@/app/services/NoteService';

export function useCreateNote() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: NoteService.CreatePayload) =>
      NoteService.createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return { createNote: mutateAsync, isLoading: isPending };
}
```

### Convenções de Mutation

- Sempre expõe `mutateAsync` (não `mutate`) — permite `await` no controller
- Renomeia `isPending` → `isLoading` no retorno (consistência)
- `onSuccess` invalida queries relacionadas

## Nomenclatura

| Tipo | Padrão | Exemplo |
|---|---|---|
| Hook de query | `use[Resource]` | `useNotes`, `useChapter` |
| Hook de mutation | `use[Action][Resource]` | `useCreateNote`, `useUpdateChapter` |
| Query key | `['resource', ...params]` | `['notes']`, `['chapter', id]` |
| Retorno de query | `{ resource, isLoading, refetch }` | `{ notes, isLoading, refetch }` |
| Retorno de mutation | `{ action, isLoading }` | `{ createNote, isLoading }` |

## Regras de Decisão

| Situação | Onde colocar |
|---|---|
| Buscar dados (GET) | `app/hooks/query/use[Resource].ts` |
| Alterar dados (POST/PUT/DELETE) | `app/hooks/mutations/use[Action][Resource].ts` |
| Chamada HTTP real | `app/services/[Resource]Service.ts` |
| Tipos de request/response | `namespace` dentro do Service |
| Config do QueryClient | `app/libs/queryClient.ts` |
