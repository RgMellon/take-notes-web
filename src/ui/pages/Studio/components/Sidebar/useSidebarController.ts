import { useState } from 'react';
import type { Chapter } from '@/app/types/Chapter';

interface IUseSidebarControllerParams {
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function useSidebarController({ onDelete, isDeleting }: IUseSidebarControllerParams) {
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<Chapter | null>(null);

  function handleDeleteClick(e: React.MouseEvent, chapter: Chapter) {
    e.stopPropagation();
    setChapterToDelete(chapter);
  }

  async function handleConfirmDelete() {
    if (!chapterToDelete) return;
    await onDelete(chapterToDelete.id);
    setChapterToDelete(null);
  }

  return {
    search,
    setSearch,
    showSearch,
    setShowSearch,
    chapterToDelete,
    setChapterToDelete,
    handleDeleteClick,
    handleConfirmDelete,
    isDeleting,
  };
}
