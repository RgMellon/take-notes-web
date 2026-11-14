# ADR-001 — Edição direta do documento estruturado sem IA

## Status

Aceito

## Contexto

Toda vez que o usuário clicava em "Gerar Markdown", o fluxo completo era acionado: nota bruta → IA → upsert. Não havia distinção entre uma primeira geração e uma regeneração após pequenas edições. Qualquer ajuste no documento gerado — mesmo uma linha — exigia gastar tokens desnecessariamente.

## Decisão

O `StructuredViewer` passou a ter dois fluxos distintos:

- **Salvar edições** — o campo raw markdown virou um `textarea` editável. O botão "Salvar edições" só é habilitado quando há mudança (`isDirty`). Ao salvar, chama `PUT /chapters/:chapterId/structured` via `useUpdateStructured`, sem passar pela IA.
- **Gerar novamente** — mantém o fluxo original via `POST /chapters/:chapterId/generate`, acionando a IA e sobrescrevendo o documento.

No controller (`useStudioController`), os dois handlers são independentes: `handleUpdateStructured` e `handleGenerate`.

## Consequências

- Edições pontuais no markdown não consomem tokens
- O usuário tem controle explícito sobre quando acionar a IA
- O `StructuredViewer` gerencia um estado local `draft` para refletir edições em tempo real no preview antes de salvar
- O botão "Gerar novamente" continua disponível para quando o usuário quiser regenerar tudo a partir da nota bruta
