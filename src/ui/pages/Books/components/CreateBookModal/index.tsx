import { useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/ui/components/ui/button';
import type { BookService } from '@/app/services/BookService';

interface CreateBookModalProps {
  onClose: () => void;
  onSubmit: (payload: BookService.CreatePayload) => Promise<void>;
  isLoading: boolean;
}

export function CreateBookModal({ onClose, onSubmit, isLoading }: CreateBookModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const title = titleRef.current?.value.trim();
    const author = authorRef.current?.value.trim();
    if (!title || !author) return;
    await onSubmit({ title, author });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Novo livro"
        className="auth-modal"
        onClick={e => e.stopPropagation()}
      >
        <Button variant="ghost" size="icon" className="modal-close" onClick={onClose} aria-label="Fechar">
          <X />
        </Button>
        <h2 className="modal-title">Novo livro</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label className="modal-label">
            Título
            <input ref={titleRef} className="modal-input" placeholder="Ex: Clean Architecture" required />
          </label>
          <label className="modal-label">
            Autor
            <input ref={authorRef} className="modal-input" placeholder="Ex: Robert C. Martin" required />
          </label>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Criando…' : 'Criar livro'}
          </Button>
        </form>
      </section>
    </div>
  );
}
