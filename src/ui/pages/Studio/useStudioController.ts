import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useChapters } from '@/app/hooks/query/useChapters';
import { useNote } from '@/app/hooks/query/useNote';
import { useStructured } from '@/app/hooks/query/useStructured';
import { useCreateChapter } from '@/app/hooks/mutations/useCreateChapter';
import { useUpdateChapter } from '@/app/hooks/mutations/useUpdateChapter';
import { useUpsertNote } from '@/app/hooks/mutations/useUpsertNote';
import { useGenerateStructured } from '@/app/hooks/mutations/useGenerateStructured';

export function useStudioController() {
  const { bookId = '' } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [mode, setMode] = useState<'notes' | 'result'>('notes');

  const { chapters, isLoading: isLoadingChapters } = useChapters(bookId);

  const currentChapterId = selectedChapterId ?? chapters[0]?.id ?? '';
  const currentChapter = chapters.find(c => c.id === currentChapterId) ?? null;

  const { note } = useNote(currentChapterId);
  const { structured } = useStructured(currentChapterId);

  const { createChapter, isLoading: isCreating } = useCreateChapter(bookId);
  const { updateChapter, isLoading: isUpdating } = useUpdateChapter(bookId);
  const { upsertNote } = useUpsertNote(currentChapterId);
  const { generate, isLoading: isGenerating } = useGenerateStructured(bookId, currentChapterId);

  async function handleAddChapter() {
    try {
      const nextNumber = Math.max(0, ...chapters.map(c => c.number)) + 1;
      const { chapter } = await createChapter({ number: nextNumber, title: `Capítulo ${nextNumber}` });
      setSelectedChapterId(chapter.id);
      setMode('notes');
    } catch {
      toast.error('Erro ao criar capítulo.');
    }
  }

  async function handleUpdateTitle(title: string) {
    if (!currentChapter) return;
    try {
      await updateChapter({ id: currentChapter.id, payload: { title } });
    } catch {
      toast.error('Erro ao atualizar título.');
    }
  }

  async function handleSaveNote(content: string) {
    try {
      await upsertNote({ content });
    } catch {
      toast.error('Erro ao salvar nota.');
    }
  }

  async function handleGenerate() {
    try {
      await generate();
      setMode('result');
      toast.success('Markdown gerado e salvo.');
    } catch {
      toast.error('Erro ao gerar Markdown.');
    }
  }

  function handleBack() {
    navigate('/');
  }

  return {
    bookId,
    chapters,
    isLoadingChapters,
    currentChapter,
    currentChapterId,
    note,
    structured,
    mode,
    setMode,
    isCreating,
    isUpdating,
    isGenerating,
    handleAddChapter,
    handleUpdateTitle,
    handleSaveNote,
    handleGenerate,
    handleBack,
    handleSelectChapter: setSelectedChapterId,
  };
}
