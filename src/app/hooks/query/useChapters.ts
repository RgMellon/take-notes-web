import { useQuery } from '@tanstack/react-query';
import { ChapterService } from '@/app/services/ChapterService';

export function useChapters(bookId: string) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['chapters', bookId],
    queryFn: () => ChapterService.getChapters(bookId),
    enabled: !!bookId,
  });

  return { chapters: data ?? [], isLoading, refetch };
}
