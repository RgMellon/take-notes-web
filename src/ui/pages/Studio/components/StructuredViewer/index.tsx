import { useState } from 'react';
import { BookOpen, Code2, Columns2, Copy, Download, Eye, Layers, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/app/libs/utils';
import { Button } from '@/ui/components/ui/button';
import { MarkdownPreview } from '@/ui/components/MarkdownPreview';

type View = 'preview' | 'split' | 'raw';

interface StructuredViewerProps {
  markdown: string | undefined;
  chapterId: string;
  onRegenerate: () => void;
  isGenerating: boolean;
  hasNote: boolean;
}

const views = [
  { id: 'preview' as View, icon: Eye, text: 'Preview' },
  { id: 'split' as View, icon: Columns2, text: 'Dividido' },
  { id: 'raw' as View, icon: Code2, text: 'Markdown' },
];

function saveDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function StructuredViewer({ markdown, chapterId, onRegenerate, isGenerating, hasNote }: StructuredViewerProps) {
  const [view, setView] = useState<View>('split');

  async function handleCopy() {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      toast.success('Markdown copiado.');
    } catch {
      toast.error('Não foi possível copiar.');
    }
  }

  function handleDownload() {
    if (!markdown) return;
    saveDownload(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }), 'chapter.md');
  }

  return (
    <section className="results mt-6">
      <div className="results-heading">
        <h2>
          <Layers size={14} className="text-primary" />
          Conhecimento estruturado
          {markdown && <span className="pill ready">Pronto para exportar</span>}
        </h2>
        <div className="view-tabs">
          {views.map(v => (
            <Button
              variant="ghost"
              key={v.id}
              className={cn(view === v.id && 'active')}
              onClick={() => setView(v.id)}
            >
              <v.icon className="size-3" />{v.text}
            </Button>
          ))}
        </div>
      </div>

      <div className={cn('result-panels', view !== 'split' && 'single')}>
        {view !== 'raw' && (
          <div className="result-pane">
            <div className="editor-toolbar">
              <span className="toolbar-label"><Eye size={13} />Preview</span>
              <span className="text-muted-foreground text-[10px]">Visualização</span>
            </div>
            {markdown
              ? <div className="result-content"><MarkdownPreview markdown={markdown} storageKey={chapterId} /></div>
              : <div className="empty-result">
                  <BookOpen strokeWidth={1} />
                  <span>Seu conhecimento começa com uma nota.</span>
                  <span className="text-[10px]">Nenhum Markdown gerado</span>
                </div>}
          </div>
        )}

        {view !== 'preview' && (
          <div className="result-pane">
            <div className="editor-toolbar">
              <span className="toolbar-label">
                <Code2 size={13} />Markdown <span className="font-mono text-muted-foreground text-[9px]">.md</span>
              </span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="size-6" disabled={!markdown} onClick={handleCopy} aria-label="Copiar MD">
                  <Copy className="size-3" />
                </Button>
                <Button variant="ghost" size="icon" className="size-6" disabled={!markdown} onClick={handleDownload} aria-label="Baixar .md">
                  <Download className="size-3" />
                </Button>
              </div>
            </div>
            {markdown
              ? <div className="result-content"><pre className="raw-markdown">{markdown}</pre></div>
              : <div className="empty-result">
                  <Code2 strokeWidth={1} />
                  <span>Markdown pronto para sua base de conhecimento.</span>
                  <span className="text-[10px]">Aguardando geração</span>
                </div>}
          </div>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={onRegenerate} disabled={isGenerating || !hasNote}>
          <Sparkles />
          {isGenerating ? 'Gerando…' : 'Gerar novamente'}
        </Button>
      </div>
    </section>
  );
}
