import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookService } from '@/app/services/BookService';

export function useUpdateBook() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BookService.UpdatePayload }) =>
      BookService.updateBook(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  return { updateBook: mutateAsync, isLoading: isPending };
}
