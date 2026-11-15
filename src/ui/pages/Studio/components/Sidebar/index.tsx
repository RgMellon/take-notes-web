import { Plus, Search, Trash2, X } from 'lucide-react';
import { cn } from '@/app/libs/utils';
import { Button } from '@/ui/components/ui/button';
import { DeleteChapterModal } from '../DeleteChapterModal';
import { useSidebarController } from './useSidebarController';
import type { Chapter } from '@/app/types/Chapter';

interface SidebarProps {
  bookTitle: string;
  chapters: Chapter[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => Promise<void>;
  isAdding: boolean;
  isDeleting: boolean;
}

export function Sidebar({ bookTitle, chapters, selectedId, onSelect, onAdd, onDelete, isAdding, isDeleting }: SidebarProps) {
  const {
    search,
    setSearch,
    showSearch,
    setShowSearch,
    chapterToDelete,
    setChapterToDelete,
    handleDeleteClick,
    handleConfirmDelete,
  } = useSidebarController({ onDelete, isDeleting });

  const filtered = chapters.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <aside className="sidebar">
      <div className="brand">
        <div>
          <div className="brand-name">Take Notes</div>
          <div className="brand-sub">KNOWLEDGE WORKSPACE</div>
        </div>
      </div>

      <div className="book-label">
        <div className="eyebrow">Sua biblioteca</div>
        <p>{bookTitle}</p>
      </div>

      <nav className="chapter-nav">
        <div className="nav-heading">
          <span className="eyebrow">
            Capítulos <span className="ml-2">{String(chapters.length).padStart(2, '0')}</span>
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-5"
            onClick={() => setShowSearch(v => !v)}
            aria-label="Buscar capítulo"
          >
            {showSearch ? <X className="size-3" /> : <Search className="size-3" />}
          </Button>
        </div>

        {showSearch && (
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar capítulo…"
            className="mb-3 w-full rounded border bg-background p-2 text-xs"
            aria-label="Buscar capítulo"
          />
        )}

        {filtered.map(c => (
          <div key={c.id} className="group relative flex items-center">
            <Button
              variant="ghost"
              className={cn('chapter-item w-full', selectedId === c.id && 'selected')}
              onClick={() => onSelect(c.id)}
            >
              <span className="chapter-number">{String(c.number).padStart(2, '0')}</span>
              <span className="chapter-name">
                {c.title}
                <span className={cn('chapter-status', c.status === 'STRUCTURED' && 'ready')}>
                  <i className={cn('status-dot', c.status === 'STRUCTURED' && 'ready')} />
                  {c.status === 'STRUCTURED' ? 'MD otimizado para RAG' : 'Rascunho bruto'}
                </span>
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 size-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
              onClick={e => handleDeleteClick(e, c)}
              aria-label={`Excluir ${c.title}`}
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        ))}

        <Button
          variant="ghost"
          className="mt-3 w-full justify-start text-muted-foreground text-xs"
          onClick={onAdd}
          disabled={isAdding}
        >
          <Plus className="size-3" /> Novo capítulo
        </Button>
      </nav>

      {chapterToDelete && (
        <DeleteChapterModal
          chapterTitle={chapterToDelete.title}
          onClose={() => setChapterToDelete(null)}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      )}
    </aside>
  );
}
