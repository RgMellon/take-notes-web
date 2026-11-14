import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBooks } from '@/app/hooks/query/useBooks';
import { useCreateBook } from '@/app/hooks/mutations/useCreateBook';
import { useDeleteBook } from '@/app/hooks/mutations/useDeleteBook';
import type { BookService } from '@/app/services/BookService';

export function useBooksController() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<{ id: string; title: string } | null>(null);

  const { books, isLoading } = useBooks();
  const { createBook, isLoading: isCreating } = useCreateBook();
  const { deleteBook, isLoading: isDeleting } = useDeleteBook();

  function handleOpen(id: string) {
    navigate(`/books/${id}`);
  }

  async function handleCreate(payload: BookService.CreatePayload) {
    try {
      const { book } = await createBook(payload);
      toast.success('Livro criado!');
      setModalOpen(false);
      navigate(`/books/${book.id}`);
    } catch {
      toast.error('Erro ao criar livro.');
    }
  }

  function handleDeleteRequest(id: string, title: string) {
    setBookToDelete({ id, title });
  }

  async function handleDeleteConfirm() {
    if (!bookToDelete) return;
    try {
      await deleteBook(bookToDelete.id);
      toast.success('Livro removido.');
      setBookToDelete(null);
    } catch {
      toast.error('Erro ao remover livro.');
    }
  }

  return {
    books,
    isLoading,
    isCreating,
    isDeleting,
    modalOpen,
    setModalOpen,
    bookToDelete,
    setBookToDelete,
    handleOpen,
    handleCreate,
    handleDeleteRequest,
    handleDeleteConfirm,
  };
}
