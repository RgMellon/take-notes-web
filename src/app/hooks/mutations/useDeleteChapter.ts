import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChapterService } from '@/app/services/ChapterService';

export function useDeleteChapter(bookId: string) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => ChapterService.deleteChapter(bookId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters', bookId] });
    },
  });

  return { deleteChapter: mutateAsync, isLoading: isPending };
}
