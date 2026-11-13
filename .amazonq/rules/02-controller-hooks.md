# Controller Hooks — Separação de Lógica e UI

## Princípio

A camada `ui/` **nunca** contém regras de negócio, estado complexo ou efeitos colaterais diretamente no JSX. Toda lógica fica em um **Controller Hook** (`use[Name]Controller`) que o componente consome.

A View é **burra** — recebe dados prontos e handlers do controller, e apenas renderiza.

## Estrutura

```
PageOrComponent/
├── index.tsx                  # View (JSX puro)
└── use[Name]Controller.ts     # Toda a lógica
```

## Padrão do Controller Hook

```typescript
export function use[Name]Controller(params?: IParams) {
  // 1. Estado local (useState, useRef)
  // 2. Hooks de dados (useQuery, useMutation, useContext)
  // 3. Efeitos (useEffect)
  // 4. Handlers (funções de ação)

  return {
    // dados para renderização
    // handlers para interação
    // estados de loading/error
  };
}
```

## O que vai no Controller

| Responsabilidade | Exemplo |
|---|---|
| Estado local | `useState`, `useRef` |
| Busca de dados | hooks de `@/app/hooks/query/` |
| Mutações | hooks de `@/app/hooks/mutations/` |
| Formulários | `useForm` + `zodResolver` |
| Efeitos colaterais | `useEffect` |
| Handlers de UI | `handleSubmit`, `handleSelect` |
| Cálculos derivados | lógica baseada em estado |
| Roteamento | `useNavigate` do react-router |

## O que vai na View (index.tsx)

- JSX e renderização condicional
- Desestruturação do retorno do controller
- Composição de componentes
- **Nenhum** `useEffect`, `useState` ou lógica de negócio

## Exemplo — Página

```typescript
// useHomeController.ts
export function useHomeController() {
  const [selected, setSelected] = useState<string | null>(null);
  const { chapters, isLoading } = useChapters();

  function handleSelect(id: string) {
    setSelected(id);
  }

  return { chapters, isLoading, selected, handleSelect };
}

// Home/index.tsx
export function Home() {
  const { chapters, isLoading, selected, handleSelect } = useHomeController();
  // apenas JSX
}
```

## Exemplo — Formulário

```typescript
export function useGoalFormController() {
  const { updateGoal, isLoading } = useUpdateGoal();

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
  });

  const onSubmit = async (data: GoalFormData) => {
    try {
      await updateGoal(data);
      toast.success('Salvo!');
    } catch {
      toast.error('Erro ao salvar.');
    }
  };

  return { form, onSubmit, isLoading };
}
```

## Convenções

- Nome: `use[ComponentName]Controller`
- Arquivo: `.ts` (não `.tsx` — sem JSX)
- Parâmetros via interface `IUse[Name]ControllerParams`
- Retorno: objeto plano com dados e handlers
- Handlers prefixados com `handle` ou verbos (`onSubmit`, `onConfirm`)
- Loading unificado: `isLoading: isPending || isFetching`

## Regras de Decisão

| Pergunta | Resposta |
|---|---|
| Página com estado ou efeitos? | → `use[Page]Controller.ts` |
| Componente com lógica complexa? | → `use[Component]Controller.ts` |
| Componente simples sem estado? | → sem controller |
| Lógica reutilizável entre páginas? | → hook em `@/app/hooks/` |
| Lógica específica de uma página? | → controller dentro da pasta da página |
