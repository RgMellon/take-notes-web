import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MarkdownPreview } from './index';

vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn().mockResolvedValue({ svg: '<svg>diagram</svg>' }),
  },
}));

describe('MarkdownPreview', () => {
  it('renderiza markdown simples', () => {
    render(<MarkdownPreview markdown="**negrito**" />);
    expect(screen.getByText('negrito')).toBeInTheDocument();
  });

  it('remove frontmatter antes de renderizar', () => {
    const markdown = '---\ntitle: Teste\n---\n\nConteúdo real';
    render(<MarkdownPreview markdown={markdown} />);
    expect(screen.getByText('Conteúdo real')).toBeInTheDocument();
    expect(screen.queryByText('title: Teste')).not.toBeInTheDocument();
  });

  it('renderiza bloco mermaid sem erro quando mermaid resolve', async () => {
    render(<MarkdownPreview markdown={'```mermaid\ngraph TD; A-->B\n```'} />);
    await waitFor(() =>
      expect(screen.queryByText(/não foi possível renderizar/i)).not.toBeInTheDocument(),
    );
  });

  it('exibe fallback quando mermaid falha', async () => {
    const mermaid = await import('mermaid');
    vi.mocked(mermaid.default.render).mockRejectedValueOnce(new Error('parse error'));

    render(<MarkdownPreview markdown={'```mermaid\ninvalid\n```'} />);
    await waitFor(() =>
      expect(screen.getByText(/não foi possível renderizar/i)).toBeInTheDocument(),
    );
  });
});
