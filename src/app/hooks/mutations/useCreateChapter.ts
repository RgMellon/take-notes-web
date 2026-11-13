import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChapterService } from '@/app/services/ChapterService';

export function useCreateChapter(bookId: string) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ChapterService.CreatePayload) =>
      ChapterService.createChapter(bookId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters', bookId] });
    },
  });

  return { createChapter: mutateAsync, isLoading: isPending };
}
