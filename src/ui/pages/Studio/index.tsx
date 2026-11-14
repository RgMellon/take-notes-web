import { ArrowLeft, BookOpen, ChevronRight, FileText, GitFork, Sparkles } from 'lucide-react';
import { Button } from '@/ui/components/ui/button';
import { Sidebar } from './components/Sidebar';
import { ChapterHeader } from './components/ChapterHeader';
import { NoteEditor } from './components/NoteEditor';
import { GenerationBar } from './components/GenerationBar';
import { StructuredViewer } from './components/StructuredViewer';
import { FlowEditor } from './components/FlowEditor';
import { useStudioController } from './useStudioController';

export function Studio() {
  const {
    chapters,
    isLoadingChapters,
    currentChapter,
    currentChapterId,
    note,
    structured,
    mode,
    setMode,
    isCreating,
    isUpdating,
    isGenerating,
    isUpdatingStructured,
    handleUpdateStructured,
    handleAddChapter,
    handleUpdateTitle,
    handleSaveNote,
    handleGenerate,
    handleBack,
    handleSelectChapter,
    noteEditorRef,
  } = useStudioController();

  if (isLoadingChapters) {
    return <div className="studio"><p className="text-muted-foreground p-8">Carregando…</p></div>;
  }

  return (
    <div className="studio">
      <Sidebar
        bookTitle="Meu livro"
        chapters={chapters}
        selectedId={currentChapterId}
        onSelect={handleSelectChapter}
        onAdd={handleAddChapter}
        isAdding={isCreating}
      />

      <main className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <Button variant="ghost" size="icon" className="size-8" onClick={handleBack} aria-label="Voltar">
              <ArrowLeft className="size-4" />
            </Button>
            <BookOpen size={14} />
            <span>Biblioteca</span>
            <ChevronRight size={12} />
            <span>Capítulo {currentChapter ? String(currentChapter.number).padStart(2, '0') : '—'}</span>
          </div>
        </header>

        {!currentChapter && (
          <div className="empty-result mt-16">
            <BookOpen strokeWidth={1} />
            <span>Nenhum capítulo selecionado.</span>
            <Button onClick={handleAddChapter} disabled={isCreating}>Criar primeiro capítulo</Button>
          </div>
        )}

        {currentChapter && (
          <>
            <ChapterHeader
              chapter={currentChapter}
              onTitleChange={handleUpdateTitle}
              isUpdating={isUpdating}
            />

            <div className="mode-bar">
              <div className="mode-tabs">
                <Button
                  variant="ghost"
                  className={`mode-tab ${mode === 'notes' ? 'active' : ''}`}
                  onClick={() => setMode('notes')}
                >
                  <FileText className="size-3.5" />Captura bruta
                </Button>
                <Button
                  variant="ghost"
                  className={`mode-tab ${mode === 'flow' ? 'active' : ''}`}
                  onClick={() => setMode('flow')}
                >
                  <GitFork className="size-3.5" />Diagrama
                </Button>
                <Button
                  variant="ghost"
                  className={`mode-tab ${mode === 'result' ? 'active' : ''}`}
                  onClick={() => setMode('result')}
                >
                  <Sparkles className="size-3.5" />
                  Markdown RAG
                  {currentChapter.status === 'STRUCTURED' && <span className="status-dot ready" />}
                </Button>
              </div>
            </div>

            {mode === 'notes' && (
              <>
                <NoteEditor
                  ref={noteEditorRef}
                  key={currentChapterId}
                  initialContent={note?.content ?? ''}
                  onSave={handleSaveNote}
                  disabled={isGenerating}
                />
                <GenerationBar
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  hasNote={!!note?.content?.trim()}
                />
              </>
            )}

            {mode === 'flow' && <FlowEditor />}

            {mode === 'result' && (
              <StructuredViewer
                markdown={structured?.markdownContent}
                chapterId={currentChapterId}
                onRegenerate={handleGenerate}
                onSave={handleUpdateStructured}
                isGenerating={isGenerating}
                isSaving={isUpdatingStructured}
                hasNote={!!note?.content?.trim()}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
