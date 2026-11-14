import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NoteService } from '@/app/services/NoteService';

export function useUpsertNote(chapterId: string) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: NoteService.UpsertPayload) =>
      NoteService.upsertNote(chapterId, payload),
    onSuccess: (data) => {
      console.log('[upsertNote] onSuccess data:', data);
      queryClient.setQueryData(['note', chapterId], data);
    },
  });

  return { upsertNote: mutateAsync, isLoading: isPending };
}
