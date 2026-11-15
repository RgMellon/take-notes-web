import { X } from 'lucide-react';
import { Button } from '@/ui/components/ui/button';

interface DeleteChapterModalProps {
  chapterTitle: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export function DeleteChapterModal({ chapterTitle, onClose, onConfirm, isLoading }: DeleteChapterModalProps) {
  async function handleConfirm() {
    await onConfirm();
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Excluir capítulo"
        className="auth-modal"
        onClick={e => e.stopPropagation()}
      >
        <Button variant="ghost" size="icon" className="modal-close" onClick={onClose} aria-label="Fechar">
          <X />
        </Button>
        <h2 className="modal-title">Excluir capítulo</h2>
        <p className="modal-description">
          Tem certeza que deseja excluir <strong>{chapterTitle}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className="modal-actions">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isLoading ? 'Excluindo…' : 'Excluir'}
          </Button>
        </div>
      </section>
    </div>
  );
}
