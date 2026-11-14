import type { Structured } from '@/app/types/Structured';
import { Service } from './Service';

export class StructuredService extends Service {
  static async generate(chapterId: string): Promise<StructuredService.StructuredResponse> {
    const { data } = await this.client.post<StructuredService.StructuredResponse>(`/chapters/${chapterId}/generate`);
    return data;
  }

  static async getStructured(chapterId: string): Promise<StructuredService.StructuredResponse> {
    const { data } = await this.client.get<StructuredService.StructuredResponse>(`/chapters/${chapterId}/structured`);
    return data;
  }
}

export namespace StructuredService {
  export type StructuredResponse = Structured;
}
