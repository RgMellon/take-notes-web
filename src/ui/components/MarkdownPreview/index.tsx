import { useEffect, useId, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

function decodeHtmlEntities(str: string) {
  return str
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function Mermaid({ code }: { code: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const decoded = decodeHtmlEntities(code);
    import('mermaid').then(async ({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, securityLevel: 'loose', theme: 'dark' });
      const result = await mermaid.render(`diagram${id}`, decoded);
      if (active && ref.current) ref.current.innerHTML = result.svg;
    }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [code, id]);

  return error
    ? <pre><code>{code}</code><small>Não foi possível renderizar o diagrama.</small></pre>
    : <div className="mermaid-diagram" ref={ref} />;
}

function HighlightToolbar({ containerRef, onHighlight }: { containerRef: React.RefObject<HTMLDivElement | null>, onHighlight: () => void }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    function onMouseUp() {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) { setPos(null); return; }
      const range = sel.getRangeAt(0);
      const container = containerRef.current;
      if (!container || !container.contains(range.commonAncestorContainer)) { setPos(null); return; }
      const rect = range.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setPos({ x: rect.left - containerRect.left + rect.width / 2, y: rect.top - containerRect.top - 8 });
    }
    document.addEventListener('mouseup', onMouseUp);
    return () => document.removeEventListener('mouseup', onMouseUp);
  }, [containerRef]);

  function handleHighlight() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const mark = document.createElement('mark');
    range.surroundContents(mark);
    sel.removeAllRanges();
    setPos(null);
    onHighlight();
  }

  if (!pos) return null;

  return (
    <button
      className="highlight-toolbar"
      style={{ left: pos.x, top: pos.y }}
      onMouseDown={e => e.preventDefault()}
      onClick={handleHighlight}
    >
      Destacar
    </button>
  );
}

export function MarkdownPreview({ markdown, storageKey }: { markdown: string; storageKey?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, '');

  // restore saved highlights after markdown renders
  useEffect(() => {
    if (!storageKey || !bodyRef.current) return;
    const saved = localStorage.getItem(`highlights:${storageKey}`);
    if (saved) bodyRef.current.innerHTML = saved;
  }, [storageKey, body]);

  function saveHighlights() {
    if (!storageKey || !bodyRef.current) return;
    localStorage.setItem(`highlights:${storageKey}`, bodyRef.current.innerHTML);
  }

  return (
    <div className="markdown-preview-wrapper" ref={containerRef}>
      <HighlightToolbar containerRef={containerRef} onHighlight={saveHighlights} />
      <div className="markdown-body" ref={bodyRef}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            code({ className, children, ...props }) {
              return className?.includes('language-mermaid')
                ? <Mermaid code={String(children).trim()} />
                : <code className={className} {...props}>{children}</code>;
            },
          }}
        >
          {body}
        </ReactMarkdown>
      </div>
    </div>
  );
}
