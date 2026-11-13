# Rules — take-notes-web

Índice das regras de arquitetura do projeto. Cada chunk cobre um domínio específico.

> **Antes de criar qualquer feature, leia os chunks relevantes abaixo.**

## Chunks

| # | Arquivo | Cobre |
|---|---|---|
| 01 | [rules/01-folder-structure.md](rules/01-folder-structure.md) | Estrutura de pastas, path alias, onde cada arquivo vai |
| 02 | [rules/02-controller-hooks.md](rules/02-controller-hooks.md) | Separação View/Controller, padrão de controller hooks |
| 03 | [rules/03-services.md](rules/03-services.md) | Camada HTTP com axios, classe base Service, namespaces |
| 04 | [rules/04-data-fetching.md](rules/04-data-fetching.md) | React Query — hooks de query e mutation |
| 05 | [rules/05-styling.md](rules/05-styling.md) | Tailwind + shadcn/ui + CVA + cn() |

## Stack

- React 19 + Vite
- TypeScript (strict)
- Tailwind CSS v4
- shadcn/ui
- Axios
- TanStack React Query
- Zod
- Path alias: `@/*` → `src/*`

## Princípios

1. `ui/` é burra — só JSX, sem lógica
2. `app/` é cega — sem JSX, sem Tailwind
3. Toda chamada HTTP passa por um Service
4. Todo hook de dados passa por query/ ou mutations/
5. Toda página com estado tem um controller hook
