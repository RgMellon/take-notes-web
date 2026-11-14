import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StructuredService } from '@/app/services/StructuredService';

export function useUpdateStructured(chapterId: string) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: StructuredService.UpdatePayload) =>
      StructuredService.updateStructured(chapterId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['structured', chapterId] });
    },
  });

  return { updateStructured: mutateAsync, isLoading: isPending };
}
