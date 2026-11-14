import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteBookModal } from './index';

const defaultProps = {
  bookTitle: 'Clean Architecture',
  isLoading: false,
  onConfirm: vi.fn().mockResolvedValue(undefined),
  onClose: vi.fn(),
};

function renderModal(props = {}) {
  return render(<DeleteBookModal {...defaultProps} {...props} />);
}

describe('DeleteBookModal', () => {
  beforeEach(() => vi.clearAllMocks());

  it('exibe o título do livro na mensagem de confirmação', () => {
    renderModal();
    expect(screen.getByText('Clean Architecture')).toBeInTheDocument();
  });

  it('chama onClose ao clicar no overlay', async () => {
    renderModal();
    await userEvent.click(screen.getByRole('dialog').parentElement!);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('chama onClose ao clicar no botão fechar (X)', async () => {
    renderModal();
    await userEvent.click(screen.getByRole('button', { name: /fechar/i }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('chama onClose ao clicar em Cancelar', async () => {
    renderModal();
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('chama onConfirm ao clicar em Excluir', async () => {
    renderModal();
    await userEvent.click(screen.getByRole('button', { name: /^excluir$/i }));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('não chama onClose ao clicar dentro do modal', async () => {
    renderModal();
    await userEvent.click(screen.getByRole('dialog'));
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('desabilita os botões e exibe "Excluindo…" durante o loading', () => {
    renderModal({ isLoading: true });
    expect(screen.getByRole('button', { name: /excluindo/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeDisabled();
  });
});
