# DDIA Knowledge Studio

## O que é

Uma aplicação web para transformar notas de leitura do livro **Designing Data-Intensive Applications** (Martin Kleppmann) em Markdown estruturado e otimizado para RAG (Retrieval-Augmented Generation).

A ideia central: você escreve notas brutas enquanto lê o livro, clica em um botão, e a IA converte essas notas em documentos Markdown bem formatados, com frontmatter YAML, hierarquia de títulos consistente e diagramas Mermaid — prontos para serem ingeridos em uma base de conhecimento vetorial.

## Para que serve

- Estudar o livro DDIA de forma estruturada
- Gerar documentos `.md` otimizados para uso em pipelines de RAG
- Exportar os capítulos processados como `.zip` para uso em outras ferramentas

## Stack

| Camada       | Tecnologia                                     |
| ------------ | ---------------------------------------------- |
| Framework    | React 19 + TypeScript                          |
| Build        | Vite 6                                         |
| Estilo       | Tailwind CSS 4                                 |
| Componentes  | Radix UI (Tabs, Tooltip, Slot)                 |
| Markdown     | react-markdown + rehype-highlight + remark-gfm |
| Diagramas    | Mermaid                                        |
| Export       | JSZip                                          |
| Notificações | Sonner                                         |
| IA           | OpenAI API (gpt-4o-mini)                       |

## Como funciona

```
Notas brutas (textarea)
        ↓
  [Gerar Markdown]
        ↓
  OpenAI gpt-4o-mini
  (prompt com regras RAG)
        ↓
  Markdown validado
  (YAML + seções 200–450 palavras + Mermaid)
        ↓
  Preview / Raw / Split view
        ↓
  Export .zip com todos os capítulos prontos
```

## Estrutura do projeto

```
src/
├── App.tsx                  # Componente principal, toda a lógica de estado
├── components/
│   ├── ui/                  # Componentes base (Button, etc.)
│   └── markdown-preview.tsx # Renderizador de Markdown com suporte a Mermaid
├── lib/
│   ├── chapters.ts          # Tipos, títulos dos capítulos, prompt RAG e validação
│   └── utils.ts             # Utilitários gerais
└── styles.css               # Estilos globais (tema dark/light)
```

## Persistência

Tudo é salvo no `localStorage` do navegador — sem backend, sem conta, sem servidor. A chave da OpenAI também fica armazenada localmente.

## Regras do Markdown gerado

O prompt (`ragInstructions` em `chapters.ts`) impõe um conjunto de regras para garantir qualidade para RAG:

- Frontmatter YAML obrigatório (`book`, `chapter`, `chapter_title`, `topics`)
- Um único `#` por documento (título do capítulo)
- Seções `##` e `###` com 200–450 palavras cada
- Títulos contextualizados (sem "Introdução", "Resumo", etc.)
- Cada seção autossuficiente (sem referências relativas como "como vimos acima")
- Diagramas Mermaid com parágrafo explicativo obrigatório

## Como rodar

```bash
yarn install
yarn dev
```

Acesse `http://localhost:5173`, informe sua chave OpenAI nas configurações e comece a escrever suas notas.
