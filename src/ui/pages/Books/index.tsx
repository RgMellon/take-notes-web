import { Layers, Plus } from 'lucide-react';
import { Button } from '@/ui/components/ui/button';
import { BookCard } from './components/BookCard';
import { CreateBookModal } from './components/CreateBookModal';
import { useBooksController } from './useBooksController';

export function Books() {
  const {
    books,
    isLoading,
    isCreating,
    isDeleting,
    modalOpen,
    setModalOpen,
    handleOpen,
    handleCreate,
    handleDelete,
  } = useBooksController();

  return (
    <div className="books-page">
      <header className="books-header">
        <div className="brand">
          <div className="brand-mark"><Layers size={22} strokeWidth={1.5} /></div>
          <div>
            <div className="brand-name">Take Notes</div>
            <div className="brand-sub">KNOWLEDGE WORKSPACE</div>
          </div>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="size-4" /> Novo livro
        </Button>
      </header>

      <main className="books-list">
        {isLoading && <p className="books-empty">Carregando…</p>}

        {!isLoading && books.length === 0 && (
          <div className="books-empty-state">
            <Layers size={40} strokeWidth={1} className="text-muted-foreground" />
            <p>Nenhum livro ainda.</p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="size-4" /> Criar primeiro livro
            </Button>
          </div>
        )}

        {books.map(book => (
          <BookCard
            key={book.id}
            book={book}
            onOpen={handleOpen}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        ))}
      </main>

      {modalOpen && (
        <CreateBookModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreate}
          isLoading={isCreating}
        />
      )}
    </div>
  );
}
