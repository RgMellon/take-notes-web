import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { Check, Circle, FileText } from 'lucide-react';

interface NoteEditorProps {
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  disabled: boolean;
}

export interface NoteEditorHandle {
  flushSave: () => Promise<void>;
}

export const NoteEditor = forwardRef<NoteEditorHandle, NoteEditorProps>(
  function NoteEditor({ initialContent, onSave, disabled }, ref) {
  const [content, setContent] = useState(initialContent);
  const [saveStatus, setSaveStatus] = useState('Salvo localmente');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingContent = useRef<string | null>(null);

  useImperativeHandle(ref, () => ({
    async flushSave() {
      if (timer.current) clearTimeout(timer.current);
      if (pendingContent.current !== null && pendingContent.current.trim()) {
        await onSave(pendingContent.current);
        pendingContent.current = null;
      }
    },
  }));

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  function handleChange(value: string) {
    setContent(value);
    setSaveStatus('Salvando…');
    pendingContent.current = value;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      pendingContent.current = null;
      await onSave(value);
      setSaveStatus('Salvo localmente');
    }, 600);
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <section className="editor-section">
      <div className="editor-toolbar">
        <span className="toolbar-label">
          <FileText size={13} className="text-muted-foreground" />
          Notas de leitura
        </span>
        <span className="save-status">
          {saveStatus.includes('Salvo')
            ? <Check size={12} className="text-success" />
            : <Circle size={9} />}
          {saveStatus}
        </span>
      </div>

      <textarea
        aria-label="Notas de leitura"
        className="editor-text"
        placeholder="Suas notas, ideias e conexões deste capítulo…"
        value={content}
        onChange={e => handleChange(e.target.value)}
        disabled={disabled}
      />

      <footer className="editor-footer">
        <span>
          {wordCount} palavras
          <span className="mx-2">·</span>
          {content.length.toLocaleString('pt-BR')} caracteres
        </span>
        <span>Texto livre</span>
      </footer>
    </section>
  );
});
