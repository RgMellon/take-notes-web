import { useQuery } from '@tanstack/react-query';
import { BookService } from '@/app/services/BookService';

export function useBooks() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['books'],
    queryFn: () => BookService.getBooks(),
  });

  return { books: data?.books ?? [], isLoading, refetch };
}
