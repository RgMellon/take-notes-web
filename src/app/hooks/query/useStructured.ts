import { useQuery } from '@tanstack/react-query';
import { StructuredService } from '@/app/services/StructuredService';

export function useStructured(chapterId: string) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['structured', chapterId],
    queryFn: () => StructuredService.getStructured(chapterId),
    enabled: !!chapterId,
  });

  return { structured: data?.structured, isLoading, refetch };
}
