import { Circle, Hash } from 'lucide-react';
import { cn } from '@/app/libs/utils';
import type { Chapter } from '@/app/types/Chapter';

interface ChapterHeaderProps {
  chapter: Chapter;
  onTitleChange: (title: string) => void;
  isUpdating: boolean;
}

export function ChapterHeader({ chapter, onTitleChange, isUpdating }: ChapterHeaderProps) {
  return (
    <section className="chapter-header">
      <div className="chapter-kicker">
        <span className="eyebrow">Capítulo</span>
        <span className="number-input">{String(chapter.number).padStart(2, '0')}</span>
        <span className={cn('pill', chapter.status === 'STRUCTURED' && 'ready')}>
          <Circle size={7} />
          {chapter.status === 'STRUCTURED' ? 'MD otimizado para RAG' : 'Rascunho bruto'}
        </span>
      </div>

      <textarea
        aria-label="Título do capítulo"
        className="title-input"
        rows={2}
        defaultValue={chapter.title}
        key={chapter.id}
        disabled={isUpdating}
        onBlur={e => {
          const val = e.target.value.trim();
          if (val && val !== chapter.title) onTitleChange(val);
        }}
      />

      {chapter.tags.length > 0 && (
        <div className="tags">
          <Hash size={13} className="text-muted-foreground" />
          {chapter.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      )}
    </section>
  );
}
