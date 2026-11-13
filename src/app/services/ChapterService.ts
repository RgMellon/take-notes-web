import type { Chapter } from '@/app/types/Chapter';
import { Service } from './Service';

export class ChapterService extends Service {
  static async getChapters(bookId: string): Promise<ChapterService.ChaptersResponse> {
    const { data } = await this.client.get<ChapterService.ChaptersResponse>(`/books/${bookId}/chapters`);
    return data;
  }

  static async getChapterById(bookId: string, id: string): Promise<ChapterService.ChapterResponse> {
    const { data } = await this.client.get<ChapterService.ChapterResponse>(`/books/${bookId}/chapters/${id}`);
    return data;
  }

  static async createChapter(bookId: string, payload: ChapterService.CreatePayload): Promise<ChapterService.ChapterResponse> {
    const { data } = await this.client.post<ChapterService.ChapterResponse>(`/books/${bookId}/chapters`, payload);
    return data;
  }

  static async updateChapter(bookId: string, id: string, payload: ChapterService.UpdatePayload): Promise<ChapterService.ChapterResponse> {
    const { data } = await this.client.patch<ChapterService.ChapterResponse>(`/books/${bookId}/chapters/${id}`, payload);
    return data;
  }

  static async deleteChapter(bookId: string, id: string): Promise<void> {
    await this.client.delete(`/books/${bookId}/chapters/${id}`);
  }
}

export namespace ChapterService {
  export type ChaptersResponse = { chapters: Chapter[] };
  export type ChapterResponse = { chapter: Chapter };
  export type CreatePayload = { number: number; title: string };
  export type UpdatePayload = { number?: number; title?: string; tags?: string[] };
}
