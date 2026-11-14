import { X } from 'lucide-react';
import { Button } from '@/ui/components/ui/button';

interface DeleteBookModalProps {
  bookTitle: string;
  isLoading: boolean;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export function DeleteBookModal({ bookTitle, isLoading, onConfirm, onClose }: DeleteBookModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Confirmar exclusão"
        className="auth-modal"
        onClick={e => e.stopPropagation()}
      >
        <Button variant="ghost" size="icon" className="modal-close" onClick={onClose} aria-label="Fechar">
          <X />
        </Button>
        <h2 className="modal-title">Excluir livro</h2>
        <p className="modal-description">
          Tem certeza que deseja excluir <strong>{bookTitle}</strong>? Essa ação não pode ser desfeita.
        </p>
        <div className="modal-actions">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Excluindo…' : 'Excluir'}
          </Button>
        </div>
      </section>
    </div>
  );
}
