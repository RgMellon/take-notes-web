import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChapterService } from '@/app/services/ChapterService';

export function useUpdateChapter(bookId: string) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ChapterService.UpdatePayload }) =>
      ChapterService.updateChapter(bookId, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters', bookId] });
    },
  });

  return { updateChapter: mutateAsync, isLoading: isPending };
}
