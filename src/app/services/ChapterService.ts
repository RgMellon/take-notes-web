import type { Chapter } from '@/app/types/Chapter';
import { Service } from './Service';

export class ChapterService extends Service {
  static async getChapters(bookId: string): Promise<Chapter[]> {
    const { data } = await this.client.get<Chapter[]>(`/books/${bookId}/chapters`);
    return data;
  }

  static async getChapterById(bookId: string, id: string): Promise<Chapter> {
    const { data } = await this.client.get<Chapter>(`/books/${bookId}/chapters/${id}`);
    return data;
  }

  static async createChapter(bookId: string, payload: ChapterService.CreatePayload): Promise<Chapter> {
    const { data } = await this.client.post<Chapter>(`/books/${bookId}/chapters`, payload);
    return data;
  }

  static async updateChapter(bookId: string, id: string, payload: ChapterService.UpdatePayload): Promise<Chapter> {
    const { data } = await this.client.patch<Chapter>(`/books/${bookId}/chapters/${id}`, payload);
    return data;
  }

  static async deleteChapter(bookId: string, id: string): Promise<void> {
    await this.client.delete(`/books/${bookId}/chapters/${id}`);
  }
}

export namespace ChapterService {
  export type CreatePayload = { number: number; title: string };
  export type UpdatePayload = { number?: number; title?: string; tags?: string[] };
}
