import { Trash2, BookOpen } from 'lucide-react';
import type { Book } from '@/app/types/Book';
import { Button } from '@/ui/components/ui/button';

interface BookCardProps {
  book: Book;
  onOpen: (id: string) => void;
  onDelete: (id: string, title: string) => void;
  isDeleting: boolean;
}

export function BookCard({ book, onOpen, onDelete, isDeleting }: BookCardProps) {
  return (
    <div className="book-card">
      <div className="book-card-body" onClick={() => onOpen(book.id)}>
        <div className="book-card-icon"><BookOpen size={20} strokeWidth={1.5} /></div>
        <div>
          <p className="book-card-title">{book.title}</p>
          <p className="book-card-author">{book.author}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="book-card-delete"
        disabled={isDeleting}
        onClick={() => onDelete(book.id, book.title)}
        aria-label="Deletar livro"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
