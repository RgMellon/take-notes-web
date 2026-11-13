# Estrutura de Pastas — React Web

## Visão Geral

Separação clara entre **lógica** (`app/`) e **interface** (`ui/`), com path alias `@/*` → `src/`.

```
src/
├── app/
│   ├── config/       # env.ts validado com Zod
│   ├── context/      # Contexts globais (AuthContext, ThemeContext)
│   ├── hooks/
│   │   ├── app/      # Hooks utilitários (useDebounce, useLocalStorage)
│   │   ├── mutations/# Hooks de escrita (useCreateNote, useUpdateChapter)
│   │   └── query/    # Hooks de leitura (useNotes, useChapter)
│   ├── libs/         # Setup de libs externas (queryClient.ts)
│   ├── schemas/      # Schemas Zod globais
│   ├── services/     # Camada HTTP (Service.ts + recursos)
│   ├── types/        # Tipos de domínio (Note.ts, Chapter.ts)
│   └── utils/        # Funções puras reutilizáveis
├── ui/
│   ├── assets/       # Imagens, SVGs, fontes
│   ├── components/   # Componentes reutilizáveis globais
│   │   └── ui/       # Primitivos shadcn/ui (button, input, etc.)
│   ├── pages/        # Páginas da aplicação
│   │   └── Home/
│   │       ├── components/
│   │       ├── index.tsx
│   │       └── useHomeController.ts
│   └── styles/       # Tokens de design, utilitários CSS
├── App.tsx           # Entry point — providers globais
└── main.tsx          # Montagem do React DOM
```

## Regras de Decisão

| Pergunta | Resposta |
|---|---|
| É visual (JSX, Tailwind)? | → `ui/` |
| É lógica, tipo, serviço? | → `app/` |
| Componente usado em 2+ páginas? | → `ui/components/` |
| Componente exclusivo de uma página? | → `ui/pages/[Page]/components/` |
| Hook que busca dados? | → `app/hooks/query/` |
| Hook que altera dados? | → `app/hooks/mutations/` |
| Hook utilitário sem API? | → `app/hooks/app/` |
| Context global? | → `app/context/` |
| Context de uma feature? | → dentro da pasta da feature |
| Tipo de domínio? | → `app/types/` |
| Config de lib externa? | → `app/libs/` |

## Path Alias

```typescript
// tsconfig.json → "@/*": ["./src/*"]

import { useAuth } from '@/app/context/AuthContext/useAuth';
import { Button } from '@/ui/components/ui/button';
import { Header } from './components/Header'; // relativo para locais
```

## Estrutura de Componente

```
ComponentName/
├── index.tsx
└── variants.ts   # CVA variants (se necessário)
```

## Estrutura de Página

```
PageName/
├── components/
├── index.tsx               # View (JSX puro)
└── usePageController.ts    # Lógica
```
