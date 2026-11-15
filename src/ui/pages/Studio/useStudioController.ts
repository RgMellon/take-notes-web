import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { useChapters } from '@/app/hooks/query/useChapters';
import { useNote } from '@/app/hooks/query/useNote';
import { useStructured } from '@/app/hooks/query/useStructured';
import { useCreateChapter } from '@/app/hooks/mutations/useCreateChapter';
import { useUpdateChapter } from '@/app/hooks/mutations/useUpdateChapter';
import { useDeleteChapter } from '@/app/hooks/mutations/useDeleteChapter';
import { useUpsertNote } from '@/app/hooks/mutations/useUpsertNote';
import { useGenerateStructured } from '@/app/hooks/mutations/useGenerateStructured';
import { useUpdateStructured } from '@/app/hooks/mutations/useUpdateStructured';
import type { NoteEditorHandle } from './components/NoteEditor';

export function useStudioController() {
  const { bookId = '' } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [mode, setMode] = useState<'notes' | 'flow' | 'result'>('notes');
  const noteEditorRef = useRef<NoteEditorHandle>(null);

  const { chapters, isLoading: isLoadingChapters } = useChapters(bookId);

  const currentChapterId = selectedChapterId ?? chapters[0]?.id ?? '';
  const currentChapter = chapters.find(c => c.id === currentChapterId) ?? null;

  const { note } = useNote(currentChapterId);
  const { structured } = useStructured(currentChapterId, currentChapter?.status === 'STRUCTURED');

  const { createChapter, isLoading: isCreating } = useCreateChapter(bookId);
  const { updateChapter, isLoading: isUpdating } = useUpdateChapter(bookId);
  const { deleteChapter, isLoading: isDeleting } = useDeleteChapter(bookId);
  const { upsertNote } = useUpsertNote(currentChapterId);
  const { generate, isLoading: isGenerating } = useGenerateStructured(bookId, currentChapterId);
  const { updateStructured, isLoading: isUpdatingStructured } = useUpdateStructured(currentChapterId);

  async function handleDeleteChapter(id: string) {
    try {
      await deleteChapter(id);
      if (selectedChapterId === id) setSelectedChapterId(null);
    } catch {
      toast.error('Erro ao excluir capítulo.');
    }
  }

  async function handleAddChapter() {
    try {
      const nextNumber = Math.max(0, ...chapters.map(c => c.number)) + 1;
      const chapter = await createChapter({ number: nextNumber, title: `Capítulo ${nextNumber}` });
      setSelectedChapterId(chapter.id);
      setMode('notes');
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.message : null;
      toast.error(message ?? 'Erro ao criar capítulo.');
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
    if (!content.trim()) return;
    try {
      await upsertNote({ content });
    } catch {
      toast.error('Erro ao salvar nota.');
    }
  }

  async function handleUpdateStructured(markdownContent: string) {
    try {
      await updateStructured({ markdownContent });
      toast.success('Markdown salvo.');
    } catch {
      toast.error('Erro ao salvar Markdown.');
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

  async function handleBack() {
    await noteEditorRef.current?.flushSave();
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
    isDeleting,
    handleDeleteChapter,
    isGenerating,
    isUpdatingStructured,
    handleUpdateStructured,
    handleAddChapter,
    handleUpdateTitle,
    handleSaveNote,
    handleGenerate,
    handleBack,
    handleSelectChapter: setSelectedChapterId,
    noteEditorRef,
  };
}
