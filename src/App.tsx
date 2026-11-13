import { useEffect, useRef, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/app/libs/queryClient';
import {
  BookOpen, Layers, Plus, ChevronRight, FileText, Sparkles, Check, Circle,
  Download, Copy, Code2, Eye, Columns2, Sun, Moon, Menu, X, ArrowUpRight,
  Loader2, Search, ShieldCheck, Hash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarkdownPreview } from '@/components/markdown-preview';
import { chapterTitles, filename, ragInstructions, validateMarkdown, type Chapter } from '@/lib/chapters';
import { Toaster, toast } from 'sonner';

const STORAGE_KEY = 'ddia-chapters';

const emptyChapter = (number: number): Chapter => ({
  id: `draft-${number}`,
  chapter_number: number,
  title: chapterTitles[number - 1] ?? 'Novo capítulo',
  raw_notes: '',
  optimized_markdown: '',
  topics: number === 1 ? ['confiabilidade', 'escalabilidade', 'sustentabilidade'] : [],
});

const welcomeNotes = `Confiabilidade, escalabilidade e sustentabilidade\n\nUm sistema de dados precisa continuar funcionando corretamente, mesmo quando as coisas dão errado. Falhas de hardware, erros de software e erros humanos são inevitáveis.\n\nConfiabilidade ≠ ausência de falhas. É a capacidade de tolerar falhas e continuar entregando o resultado esperado.\n\n— Escalabilidade\nNão é um rótulo de "escalável" ou "não escalável". Precisamos descrever a carga: requisições por segundo, proporção de leituras e escritas, usuários ativos...\n\nLatência e tempo de resposta são diferentes. Percentis (p95, p99) mostram o que a média esconde.\n\n— Sustentabilidade\nOperabilidade: facilitar a vida da equipe de operações.\nSimplicidade: reduzir a complexidade, não apenas o número de linhas de código.\nEvolutividade: tornar mudanças futuras mais fáceis.\n\nInsight: não existe uma arquitetura universal. Cada escolha envolve trade-offs.`;

const defaultChapters: Chapter[] = [1, 2, 3, 4, 5, 6].map(n => ({
  ...emptyChapter(n),
  raw_notes: n === 1 ? welcomeNotes : '',
}));

function loadChapters(): Chapter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Chapter[];
  } catch { /* ignore */ }
  return defaultChapters;
}

function saveChapters(chapters: Chapter[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chapters));
}

function saveDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function App() {
  const [chapters, setChapters] = useState<Chapter[]>(loadChapters);
  const [selected, setSelected] = useState(loadChapters()[0]?.id ?? 'draft-1');
  const [theme, setTheme] = useState(() => localStorage.getItem('ddia-theme') ?? 'dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mode, setMode] = useState<'notes' | 'result'>('notes');
  const [view, setView] = useState<'preview' | 'split' | 'raw'>('split');
  const [saving, setSaving] = useState('Salvo localmente');
  const [generating, setGenerating] = useState(false);
  const [issues, setIssues] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('ddia-openai-key') ?? '');
  const [showApiKey, setShowApiKey] = useState(false);
  const pending = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const current = chapters.find(c => c.id === selected) ?? chapters[0];

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  function updateChapters(next: Chapter[]) {
    setChapters(next);
    saveChapters(next);
  }

  function edit(patch: Partial<Chapter>) {
    if (!current) return;
    const next = { ...current, ...patch };
    const timer = pending.current.get(current.id);
    if (timer) clearTimeout(timer);
    setSaving('Salvando…');
    pending.current.set(current.id, setTimeout(() => {
      updateChapters(chapters.map(c => c.id === current.id ? next : c));
      setSaving('Salvo localmente');
      pending.current.delete(current.id);
    }, 400));
    setChapters(list => list.map(c => c.id === current.id ? next : c));
  }

  async function generate() {
    if (!current || generating) return;
    const key = apiKey.trim();
    if (!key) { setShowApiKey(true); toast.error('Informe sua chave OpenAI para gerar o Markdown.'); return; }
    setGenerating(true); setIssues([]);
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: ragInstructions },
            { role: 'user', content: `Capítulo ${current.chapter_number}: ${current.title}\n\nNotas:\n${current.raw_notes}` },
          ],
        }),
      });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error((err as { error?: { message?: string } }).error?.message ?? `HTTP ${res.status}`); }
      const data = await res.json() as { choices: { message: { content: string } }[] };
      const markdown = data.choices[0]?.message?.content ?? '';
      const found = validateMarkdown(markdown);
      const updated = chapters.map(c => c.id === current.id ? { ...c, optimized_markdown: markdown } : c);
      updateChapters(updated);
      setIssues(found);
      setMode('result');
      toast.success('Markdown gerado e salvo.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível gerar o Markdown.');
    } finally {
      setGenerating(false);
    }
  }

  function addChapter() {
    const n = Math.max(0, ...chapters.map(c => c.chapter_number)) + 1;
    const next = emptyChapter(n);
    const updated = [...chapters, next];
    updateChapters(updated);
    setSelected(next.id); setMode('notes'); setSidebarOpen(false);
  }

  async function exportAll() {
    const ready = chapters.filter(c => c.optimized_markdown);
    if (!ready.length) { toast.info('Gere o Markdown de pelo menos um capítulo para exportar.'); return; }
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    ready.forEach(c => zip.file(filename(c), c.optimized_markdown));
    saveDownload(await zip.generateAsync({ type: 'blob' }), 'ddia-knowledge-studio.zip');
  }

  function changeTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next); localStorage.setItem('ddia-theme', next);
  }

  function saveApiKey(key: string) {
    setApiKey(key); localStorage.setItem('ddia-openai-key', key);
  }

  if (!current) return null;
  const readyCount = chapters.filter(c => c.optimized_markdown).length;

  return (
    <QueryClientProvider client={queryClient}>
    <div className="studio">
      <Toaster theme={theme === 'light' ? 'light' : 'dark'} position="bottom-right" />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Layers size={22} strokeWidth={1.5} /></div>
          <div>
            <div className="brand-name">DDIA <span className="text-muted-foreground font-normal">Studio</span></div>
            <div className="brand-sub">KNOWLEDGE WORKSPACE</div>
          </div>
          <Button variant="ghost" size="icon" className="mobile-menu ml-auto" onClick={() => setSidebarOpen(false)} aria-label="Fechar capítulos"><X /></Button>
        </div>

        <div className="book-label">
          <div className="eyebrow">Sua biblioteca</div>
          <p>Projetando Aplicações com<br />Uso Extensivo de Dados</p>
          <small>Martin Kleppmann</small>
        </div>

        <nav className="chapter-nav">
          <div className="nav-heading">
            <span className="eyebrow">Capítulos <span className="ml-2">{chapters.length.toString().padStart(2, '0')}</span></span>
            <Button variant="ghost" size="icon" className="size-5" onClick={() => setShowSearch(v => !v)} title="Buscar capítulo" aria-label="Buscar capítulo"><Search className="size-3" /></Button>
          </div>
          {showSearch && <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar capítulo…" className="mb-3 w-full rounded border bg-background p-2 text-xs" aria-label="Nome do capítulo" />}
          {chapters.filter(c => c.title.toLowerCase().includes(search.toLowerCase())).map(c => (
            <Button variant="ghost" key={c.id} className={`chapter-item ${selected === c.id ? 'selected' : ''}`} onClick={() => { setSelected(c.id); setIssues([]); setSidebarOpen(false); }}>
              <span className="chapter-number">{String(c.chapter_number).padStart(2, '0')}</span>
              <span className="chapter-name">{c.title}
                <span className={`chapter-status ${c.optimized_markdown ? 'ready' : ''}`}>
                  <i className={`status-dot ${c.optimized_markdown ? 'ready' : ''}`} />
                  {c.optimized_markdown ? 'MD otimizado para RAG' : 'Rascunho bruto'}
                </span>
              </span>
            </Button>
          ))}
          <Button variant="ghost" className="mt-3 w-full justify-start text-muted-foreground text-xs" onClick={addChapter}><Plus className="size-3" /> Novo capítulo</Button>
        </nav>

        <div className="sidebar-bottom">
          <div className="progress-line"><span>Seu conhecimento, estruturado</span><span>{readyCount}/{chapters.length}</span></div>
          <div className="progress-track"><progress value={readyCount} max={chapters.length} aria-label="Capítulos otimizados" /></div>
          <div className="account">
            <div className="avatar">DS</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs truncate">Meu espaço de estudo</div>
              <div className="text-muted-foreground text-[10px] mt-1">Sessão local</div>
            </div>
            <Button variant="ghost" size="icon" className="size-7" aria-label="Configurar chave API" title="Chave OpenAI" onClick={() => setShowApiKey(true)}><ArrowUpRight /></Button>
          </div>
        </div>
      </aside>

      {/* Main workspace */}
      <main className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <Button variant="ghost" size="icon" className="mobile-menu" aria-label="Abrir capítulos" onClick={() => setSidebarOpen(true)}><Menu /></Button>
            <BookOpen size={14} /><span>Biblioteca</span><ChevronRight size={12} /><span>Capítulo {String(current.chapter_number).padStart(2, '0')}</span>
          </div>
          <div className="top-actions">
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'} aria-label="Alternar tema" onClick={changeTheme}>{theme === 'dark' ? <Sun /> : <Moon />}</Button>
            <Button variant="outline" size="sm" className="text-[11px]" onClick={exportAll}><Download className="size-3" /><span className="export-label">Exportar capítulos</span><span className="font-mono text-muted-foreground text-[9px]">.zip</span></Button>
          </div>
        </header>

        <section className="chapter-header">
          <div className="chapter-kicker">
            <span className="eyebrow">Capítulo</span>
            <input type="number" min={1} aria-label="Número do capítulo" className="number-input" value={current.chapter_number} onChange={e => { const n = Number(e.target.value); if (n > 0) edit({ chapter_number: n }); }} disabled={generating} />
            <span className={`pill ${current.optimized_markdown ? 'ready' : ''}`}><Circle size={7} />{current.optimized_markdown ? 'MD otimizado para RAG' : 'Rascunho bruto'}</span>
          </div>
          <textarea aria-label="Título do capítulo" className="title-input" rows={2} value={current.title} onChange={e => edit({ title: e.target.value })} disabled={generating} />
          <div className="tags">
            <Hash size={13} className="text-muted-foreground" />
            {current.topics.map(t => <span key={t} className="tag">{t}</span>)}
            <input className="tag-input" aria-label="Tópicos separados por vírgula" placeholder="+ Editar tópicos" defaultValue="" key={current.id} onBlur={e => { if (e.target.value.trim()) { edit({ topics: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }); e.target.value = ''; } }} />
          </div>
        </section>

        <div className="mode-bar">
          <div className="mode-tabs">
            <Button variant="ghost" className={`mode-tab ${mode === 'notes' ? 'active' : ''}`} onClick={() => setMode('notes')}><FileText className="size-3.5" />Captura bruta</Button>
            <Button variant="ghost" className={`mode-tab ${mode === 'result' ? 'active' : ''}`} onClick={() => setMode('result')}><Sparkles className="size-3.5" />Markdown RAG{current.optimized_markdown && <span className="status-dot ready" />}</Button>
          </div>
          <span className="save-status">{saving.includes('Salvo') ? <Check size={12} className="text-success" /> : <Circle size={9} />}{saving}</span>
        </div>

        {mode === 'notes' && <>
          <section className="editor-section">
            <div className="editor-toolbar">
              <span className="toolbar-label"><FileText size={13} className="text-muted-foreground" />Notas de leitura</span>
              <span className="font-mono text-[10px] text-muted-foreground">scratchpad</span>
            </div>
            <textarea aria-label="Notas de leitura" className="editor-text" placeholder="Suas notas, ideias e conexões deste capítulo…" value={current.raw_notes} onChange={e => edit({ raw_notes: e.target.value })} disabled={generating} />
            <footer className="editor-footer">
              <span>{current.raw_notes.trim().split(/\s+/).filter(Boolean).length} palavras <span className="mx-2">·</span>{current.raw_notes.length.toLocaleString('pt-BR')} caracteres</span>
              <span>Texto livre</span>
            </footer>
          </section>
          <div className="generation-bar">
            <div className="generation-meta"><ShieldCheck size={14} className="text-success" /><span>YAML + seções autossuficientes + contexto para embeddings</span></div>
            <Button className="generate-button" onClick={generate} disabled={generating || !current.raw_notes.trim()}>
              {generating ? <Loader2 className="animate-spin" /> : <Sparkles />}
              {generating ? 'Estruturando seu conhecimento…' : 'Gerar Markdown otimizado para RAG'}
              {!generating && <ArrowUpRight className="size-3" />}
            </Button>
          </div>
        </>}

        <section className={`results ${mode === 'result' ? 'mt-6' : ''}`}>
          <div className="results-heading">
            <h2><Layers size={14} className="text-primary" />Conhecimento estruturado {current.optimized_markdown && <span className="pill ready">Pronto para exportar</span>}</h2>
            <div className="view-tabs">
              {([{ id: 'preview', icon: Eye, text: 'Preview' }, { id: 'split', icon: Columns2, text: 'Dividido' }, { id: 'raw', icon: Code2, text: 'Markdown' }] as const).map(v => (
                <Button variant="ghost" key={v.id} className={view === v.id ? 'active' : ''} onClick={() => setView(v.id)}><v.icon className="size-3" />{v.text}</Button>
              ))}
            </div>
          </div>

          {issues.length > 0 && <div className="notice">Revisão necessária antes da ingestão: {issues.join(' · ')}</div>}

          <div className={`result-panels ${view !== 'split' ? 'single' : ''}`}>
            {view !== 'raw' && (
              <div className="result-pane">
                <div className="editor-toolbar"><span className="toolbar-label"><Eye size={13} />Preview</span><span className="text-muted-foreground text-[10px]">Visualização</span></div>
                {current.optimized_markdown
                  ? <div className="result-content"><MarkdownPreview markdown={current.optimized_markdown} /></div>
                  : <div className="empty-result"><BookOpen strokeWidth={1} /><span>Seu conhecimento começa com uma nota.</span><span className="text-[10px]">Nenhum Markdown gerado</span></div>}
              </div>
            )}
            {view !== 'preview' && (
              <div className="result-pane">
                <div className="editor-toolbar">
                  <span className="toolbar-label"><Code2 size={13} />Markdown <span className="font-mono text-muted-foreground text-[9px]">.md</span></span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="size-6" title="Copiar MD" aria-label="Copiar MD" disabled={!current.optimized_markdown} onClick={async () => { try { await navigator.clipboard.writeText(current.optimized_markdown); toast.success('Markdown copiado.'); } catch { toast.error('Não foi possível copiar.'); } }}><Copy className="size-3" /></Button>
                    <Button variant="ghost" size="icon" className="size-6" title="Baixar arquivo .md" aria-label="Baixar arquivo .md" disabled={!current.optimized_markdown} onClick={() => saveDownload(new Blob([current.optimized_markdown], { type: 'text/markdown;charset=utf-8' }), filename(current))}><Download className="size-3" /></Button>
                  </div>
                </div>
                {current.optimized_markdown
                  ? <div className="result-content"><pre className="raw-markdown">{current.optimized_markdown}</pre></div>
                  : <div className="empty-result"><Code2 strokeWidth={1} /><span>Markdown pronto para sua base de conhecimento.</span><span className="text-[10px]">Aguardando geração</span></div>}
              </div>
            )}
          </div>

          {mode === 'result' && (
            <div className="flex justify-end mt-4">
              <Button onClick={generate} disabled={generating || !current.raw_notes.trim()}><Sparkles />{generating ? 'Gerando…' : 'Gerar novamente'}</Button>
            </div>
          )}
        </section>
      </main>

      {/* API Key modal */}
      {showApiKey && (
        <div className="modal-overlay" onClick={() => setShowApiKey(false)}>
          <section role="dialog" aria-modal="true" aria-label="Chave OpenAI" className="auth-modal" onClick={e => e.stopPropagation()}
            style={{ position: 'relative', width: 390, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 30, boxShadow: 'var(--shadow)' }}>
            <Button variant="ghost" size="icon" style={{ position: 'absolute', right: 12, top: 12 }} onClick={() => setShowApiKey(false)} aria-label="Fechar"><X /></Button>
            <Layers className="text-primary mb-4" />
            <div className="eyebrow">DDIA Knowledge Studio</div>
            <h2 style={{ fontSize: 22, margin: '10px 0 25px' }}>Sua chave OpenAI.</h2>
            <p style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 16, lineHeight: 1.7 }}>
              A chave é salva apenas no seu navegador (localStorage) e usada diretamente para chamar a API da OpenAI.
            </p>
            <label style={{ color: 'var(--muted-foreground)', fontSize: 11 }}>
              Chave API (sk-…)
              <input
                type="password"
                autoComplete="off"
                value={apiKey}
                onChange={e => saveApiKey(e.target.value)}
                placeholder="sk-..."
                style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--border)', padding: 11, borderRadius: 5, margin: '6px 0 15px', display: 'block' }}
              />
            </label>
            <Button className="w-full" onClick={() => setShowApiKey(false)}>Salvar e fechar</Button>
          </section>
        </div>
      )}
    </div>
    </QueryClientProvider>
  );
}
