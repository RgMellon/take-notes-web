import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StructuredService } from '@/app/services/StructuredService';

export function useGenerateStructured(bookId: string, chapterId: string) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => StructuredService.generate(chapterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['structured', chapterId] });
      queryClient.invalidateQueries({ queryKey: ['chapters', bookId] });
    },
  });

  return { generate: mutateAsync, isLoading: isPending };
}
