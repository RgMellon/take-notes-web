# AGENTS — Harness para Novas Features

Toda vez que for criar ou modificar uma feature neste projeto, siga este checklist **antes de escrever qualquer código**.

## Checklist obrigatório

### 1. Estrutura
- [ ] Leu [rules/01-folder-structure.md](rules/01-folder-structure.md)?
- [ ] O novo arquivo vai para `app/` (lógica) ou `ui/` (visual)?
- [ ] Componente exclusivo de uma página → `ui/pages/[Page]/components/`
- [ ] Componente reutilizável → `ui/components/`

### 2. Lógica e UI
- [ ] Leu [rules/02-controller-hooks.md](rules/02-controller-hooks.md)?
- [ ] A página/componente tem estado ou efeitos? → criar `use[Name]Controller.ts`
- [ ] O `index.tsx` contém **apenas** JSX?
- [ ] Nenhum `useState`/`useEffect` direto no JSX?

### 3. Comunicação com API
- [ ] Leu [rules/03-services.md](rules/03-services.md)?
- [ ] Existe um `[Resource]Service.ts` para o recurso?
- [ ] O service estende a classe base `Service`?
- [ ] Tipos de payload/response estão no `namespace` do service?

### 4. Data Fetching
- [ ] Leu [rules/04-data-fetching.md](rules/04-data-fetching.md)?
- [ ] Hook de leitura em `app/hooks/query/use[Resource].ts`?
- [ ] Hook de escrita em `app/hooks/mutations/use[Action][Resource].ts`?
- [ ] `onSuccess` invalida as queries relacionadas?

### 5. Styling
- [ ] Leu [rules/05-styling.md](rules/05-styling.md)?
- [ ] Componente com variantes usa CVA em `variants.ts`?
- [ ] Classes condicionais usam `cn()`?
- [ ] Nenhum arquivo `.css` por componente?

## Fluxo de uma feature completa

```
1. Tipo de domínio       → app/types/[Resource].ts
2. Service               → app/services/[Resource]Service.ts
3. Hook de query         → app/hooks/query/use[Resource].ts
4. Hook de mutation      → app/hooks/mutations/use[Action][Resource].ts
5. Controller da página  → ui/pages/[Page]/use[Page]Controller.ts
6. View da página        → ui/pages/[Page]/index.tsx
7. Componentes locais    → ui/pages/[Page]/components/
```
