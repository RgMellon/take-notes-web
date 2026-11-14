import type { Note } from '@/app/types/Note';
import { Service } from './Service';

export class NoteService extends Service {
  static async getNote(chapterId: string): Promise<NoteService.NoteResponse> {
    const { data } = await this.client.get<NoteService.NoteResponse>(`/chapters/${chapterId}/note`);
    return data;
  }

  static async upsertNote(chapterId: string, payload: NoteService.UpsertPayload): Promise<NoteService.UpsertResponse> {
    const { data } = await this.client.put<NoteService.UpsertResponse>(`/chapters/${chapterId}/note`, payload);
    return data;
  }
}

export namespace NoteService {
  export type NoteResponse = Note;
  export type UpsertPayload = { content: string };
  export type UpsertResponse = Note;
}
