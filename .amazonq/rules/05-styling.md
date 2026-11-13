# Styling — Tailwind + shadcn/ui + CVA

## Stack

- **Tailwind CSS v4** — utilitários inline no JSX
- **shadcn/ui** — primitivos em `ui/components/ui/` (nunca editar diretamente)
- **CVA** (class-variance-authority) — variantes de componentes
- **cn()** — merge de classes (`clsx` + `tailwind-merge`)

## cn() helper (`app/libs/utils.ts` ou `ui/components/ui/utils.ts`)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Componente com variantes (CVA)

```
Button/
├── index.tsx
└── variants.ts
```

```typescript
// variants.ts
import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
```

```typescript
// index.tsx
import { cn } from '@/app/libs/utils';
import { buttonVariants } from './variants';
import type { VariantProps } from 'class-variance-authority';

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
```

## Regras de Decisão

| Pergunta | Resposta |
|---|---|
| Componente tem variantes visuais? | → usar CVA em `variants.ts` |
| Precisa combinar classes condicionais? | → usar `cn()` |
| Primitivo de UI reutilizável? | → `ui/components/ui/` (shadcn) |
| Componente de negócio reutilizável? | → `ui/components/` |
| Estilo exclusivo de uma página? | → Tailwind inline no JSX da página |

## Convenções

- Sem arquivos `.css` por componente — tudo via Tailwind
- Tokens de design (cores, fontes) via CSS variables do Tailwind em `ui/styles/`
- Nunca usar `style={{}}` inline exceto para valores dinâmicos impossíveis no Tailwind
