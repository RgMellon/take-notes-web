import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NoteService } from '@/app/services/NoteService';

export function useUpsertNote(chapterId: string) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: NoteService.UpsertPayload) =>
      NoteService.upsertNote(chapterId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note', chapterId] });
    },
  });

  return { upsertNote: mutateAsync, isLoading: isPending };
}
