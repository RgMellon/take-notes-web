import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookService } from '@/app/services/BookService';

export function useCreateBook() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: BookService.CreatePayload) => BookService.createBook(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  return { createBook: mutateAsync, isLoading: isPending };
}
