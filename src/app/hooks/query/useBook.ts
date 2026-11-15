import { useQuery } from '@tanstack/react-query';
import { BookService } from '@/app/services/BookService';

export function useBook(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: () => BookService.getBookById(id),
    enabled: !!id,
  });

  return { book: data?.book, isLoading };
}
