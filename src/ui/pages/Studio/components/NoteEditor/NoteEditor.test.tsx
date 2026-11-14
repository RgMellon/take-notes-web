import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import { NoteEditor } from './index';

function setup(props?: Partial<React.ComponentProps<typeof NoteEditor>>) {
  const onSave = vi.fn().mockResolvedValue(undefined);
  const utils = render(
    <NoteEditor
      initialContent={props?.initialContent ?? ''}
      onSave={props?.onSave ?? onSave}
      disabled={props?.disabled ?? false}
    />,
  );
  const textarea = screen.getByRole('textbox', { name: /notas de leitura/i });
  return { ...utils, textarea, onSave };
}

describe('NoteEditor', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renderiza o conteúdo inicial', () => {
    const { textarea } = setup({ initialContent: 'Olá mundo' });
    expect(textarea).toHaveValue('Olá mundo');
  });

  it('sincroniza quando initialContent muda', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { textarea, rerender } = setup({ initialContent: 'primeiro' });
    expect(textarea).toHaveValue('primeiro');

    await act(async () => {
      rerender(<NoteEditor initialContent="segundo" onSave={onSave} disabled={false} />);
    });

    expect(textarea).toHaveValue('segundo');
  });

  it('chama onSave com debounce de 600ms após digitar', async () => {
    const { textarea, onSave } = setup();

    fireEvent.change(textarea, { target: { value: 'abc' } });
    expect(onSave).not.toHaveBeenCalled();

    await act(async () => { vi.advanceTimersByTime(600); });
    expect(onSave).toHaveBeenCalledWith('abc');
  });

  it('reinicia o debounce a cada keystroke', async () => {
    const { textarea, onSave } = setup();

    fireEvent.change(textarea, { target: { value: 'a' } });
    vi.advanceTimersByTime(300);
    fireEvent.change(textarea, { target: { value: 'ab' } });
    vi.advanceTimersByTime(300);
    expect(onSave).not.toHaveBeenCalled();

    await act(async () => { vi.advanceTimersByTime(300); });
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith('ab');
  });

  it('exibe "Salvando…" ao digitar e "Salvo localmente" após salvar', async () => {
    const { textarea } = setup();

    expect(screen.getByText('Salvo localmente')).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: 'x' } });
    expect(screen.getByText('Salvando…')).toBeInTheDocument();

    await act(async () => { vi.advanceTimersByTime(600); });
    expect(screen.getByText('Salvo localmente')).toBeInTheDocument();
  });

  it('conta palavras corretamente', () => {
    const { textarea } = setup();
    fireEvent.change(textarea, { target: { value: 'uma frase com quatro' } });
    expect(screen.getByText(/4 palavras/)).toBeInTheDocument();
  });

  it('desabilita o textarea quando disabled=true', () => {
    const { textarea } = setup({ disabled: true });
    expect(textarea).toBeDisabled();
  });
});
