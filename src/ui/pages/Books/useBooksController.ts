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

  const { books, isLoading } = useBooks();
  const { createBook, isLoading: isCreating } = useCreateBook();
  const { deleteBook, isLoading: isDeleting } = useDeleteBook();

  function handleOpen(id: string) {
    navigate(`/books/${id}`);
  }

  async function handleCreate(payload: BookService.CreatePayload) {
    try {
      await createBook(payload);
      toast.success('Livro criado!');
    } catch {
      toast.error('Erro ao criar livro.');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteBook(id);
      toast.success('Livro removido.');
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
    handleOpen,
    handleCreate,
    handleDelete,
  };
}
