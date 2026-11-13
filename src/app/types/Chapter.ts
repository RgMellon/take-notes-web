export type ChapterStatus = 'DRAFT' | 'STRUCTURED';

export type Chapter = {
  id: string;
  bookId: string;
  number: number;
  title: string;
  tags: string[];
  status: ChapterStatus;
  createdAt: string;
  updatedAt: string;
};
