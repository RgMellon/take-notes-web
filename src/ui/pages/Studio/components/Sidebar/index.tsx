import { useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { cn } from '@/app/libs/utils';
import { Button } from '@/ui/components/ui/button';
import type { Chapter } from '@/app/types/Chapter';

interface SidebarProps {
  bookTitle: string;
  chapters: Chapter[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  isAdding: boolean;
}

export function Sidebar({ bookTitle, chapters, selectedId, onSelect, onAdd, isAdding }: SidebarProps) {
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

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
          <Button
            variant="ghost"
            key={c.id}
            className={cn('chapter-item', selectedId === c.id && 'selected')}
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
    </aside>
  );
}
