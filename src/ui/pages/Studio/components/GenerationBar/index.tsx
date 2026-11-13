import { ArrowUpRight, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/ui/components/ui/button';

interface GenerationBarProps {
  onGenerate: () => void;
  isGenerating: boolean;
  hasNote: boolean;
}

export function GenerationBar({ onGenerate, isGenerating, hasNote }: GenerationBarProps) {
  return (
    <div className="generation-bar">
      <div className="generation-meta">
        <ShieldCheck size={14} className="text-success" />
        <span>YAML + seções autossuficientes + contexto para embeddings</span>
      </div>
      <Button
        className="generate-button"
        onClick={onGenerate}
        disabled={isGenerating || !hasNote}
      >
        {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
        {isGenerating ? 'Estruturando seu conhecimento…' : 'Gerar Markdown otimizado para RAG'}
        {!isGenerating && <ArrowUpRight className="size-3" />}
      </Button>
    </div>
  );
}
