import { useQuery } from '@tanstack/react-query';
import { NoteService } from '@/app/services/NoteService';

export function useNote(chapterId: string) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['note', chapterId],
    queryFn: () => NoteService.getNote(chapterId),
    enabled: !!chapterId,
  });

  return { note: data?.note, isLoading, refetch };
}
