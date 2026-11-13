import type { Book } from '@/app/types/Book';
import { Service } from './Service';

export class BookService extends Service {
  static async getBooks(): Promise<BookService.BooksResponse> {
    const { data } = await this.client.get<BookService.BooksResponse>('/books');
    return data;
  }

  static async getBookById(id: string): Promise<BookService.BookResponse> {
    const { data } = await this.client.get<BookService.BookResponse>(`/books/${id}`);
    return data;
  }

  static async createBook(payload: BookService.CreatePayload): Promise<BookService.BookResponse> {
    const { data } = await this.client.post<BookService.BookResponse>('/books', payload);
    return data;
  }

  static async updateBook(id: string, payload: BookService.UpdatePayload): Promise<BookService.BookResponse> {
    const { data } = await this.client.patch<BookService.BookResponse>(`/books/${id}`, payload);
    return data;
  }

  static async deleteBook(id: string): Promise<void> {
    await this.client.delete(`/books/${id}`);
  }
}

export namespace BookService {
  export type BooksResponse = { books: Book[] };
  export type BookResponse = { book: Book };
  export type CreatePayload = { title: string; author: string };
  export type UpdatePayload = { title?: string; author?: string };
}
