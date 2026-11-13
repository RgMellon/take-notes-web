import { useEffect, useId, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

function Mermaid({ code }: { code: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setError(false);
    import('mermaid').then(async ({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'dark' });
      const result = await mermaid.render(`diagram${id}`, code);
      if (active && ref.current) ref.current.innerHTML = result.svg;
    }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [code, id]);

  return error
    ? <pre><code>{code}</code><small>Não foi possível renderizar o diagrama.</small></pre>
    : <div className="mermaid-diagram" ref={ref} />;
}

export function MarkdownPreview({ markdown }: { markdown: string }) {
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, '');

  return (
    <div className="markdown-body">
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
  );
}
