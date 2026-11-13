import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookService } from '@/app/services/BookService';

export function useDeleteBook() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => BookService.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  return { deleteBook: mutateAsync, isLoading: isPending };
}
