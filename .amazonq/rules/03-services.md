# Services — Camada de Comunicação com API

## Visão Geral

Toda comunicação HTTP fica nos services via **axios**. Hooks de query/mutation **nunca** fazem chamadas diretas.

```
Hook (query/mutation) → Service → API
```

## Classe Base (`app/services/Service.ts`)

```typescript
import axios from 'axios';
import { env } from '@/app/config/env';

export abstract class Service {
  protected static client = axios.create({
    baseURL: env.api.url,
  });

  static setToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  static removeToken() {
    this.client.defaults.headers.common['Authorization'] = undefined;
  }
}
```

## Padrão de Service Específico

```typescript
import { Service } from './Service';

export class NoteService extends Service {
  static async getNotes(): Promise<NoteService.NotesResponse> {
    const { data } = await this.client.get<NoteService.NotesResponse>('/notes');
    return data;
  }

  static async getNoteById(id: string): Promise<NoteService.NoteResponse> {
    const { data } = await this.client.get<NoteService.NoteResponse>(`/notes/${id}`);
    return data;
  }

  static async createNote(
    payload: NoteService.CreatePayload,
  ): Promise<NoteService.CreateResponse> {
    const { data } = await this.client.post<NoteService.CreateResponse>('/notes', payload);
    return data;
  }

  static async updateNote(id: string, payload: NoteService.UpdatePayload): Promise<void> {
    await this.client.put(`/notes/${id}`, payload);
  }

  static async deleteNote(id: string): Promise<void> {
    await this.client.delete(`/notes/${id}`);
  }
}

export namespace NoteService {
  export type NotesResponse = { notes: Note[] };
  export type NoteResponse = { note: Note };
  export type CreatePayload = { title: string; content: string };
  export type CreateResponse = { id: string };
  export type UpdatePayload = { title?: string; content?: string };
}
```

## Configuração de Ambiente (`app/config/env.ts`)

```typescript
import { z } from 'zod';

const schema = z.object({
  VITE_API_URL: z.string().url(),
});

const parsed = schema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
});

export const env = {
  api: { url: parsed.VITE_API_URL },
};
```

## Convenções

| Regra | Detalhe |
|---|---|
| Herança | Toda service estende `Service` |
| Métodos estáticos | Nunca instancia — `NoteService.getNotes()` |
| Tipagem genérica | `this.client.get<TipoResponse>(url)` |
| Retorno limpo | Sempre retorna `data`, nunca o `AxiosResponse` inteiro |
| Transformação de dados | Feita dentro do método do service |
| Namespace para tipos | `export namespace ServiceName { export type ... }` |
| Tipos de domínio | Ficam em `@/app/types/`, não no namespace |
| Sem try/catch | Service não trata erros — quem consome decide |
| Void em PUT/DELETE | Quando não há response body → `Promise<void>` |

## Regras de Decisão

| Pergunta | Resposta |
|---|---|
| Onde fica a instância do axios? | Na classe base `Service.ts` |
| Onde configuro baseURL? | `app/config/env.ts` validado com Zod |
| Onde transformo dados da API? | Dentro do método do service |
| Onde trato erros HTTP? | No hook de mutation ou no controller |
| Onde ficam tipos de payload/response? | No `namespace` do service |
| Onde ficam tipos de domínio? | Em `@/app/types/` |
