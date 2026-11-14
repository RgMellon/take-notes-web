import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookCard } from './index';
import type { Book } from '@/app/types/Book';

const book: Book = { id: '1', title: 'Clean Architecture', author: 'Robert C. Martin' };

const defaultProps = {
  book,
  onOpen: vi.fn(),
  onDelete: vi.fn(),
  isDeleting: false,
};

function renderCard(props = {}) {
  return render(<BookCard {...defaultProps} {...props} />);
}

describe('BookCard', () => {
  beforeEach(() => vi.clearAllMocks());

  it('exibe título e autor do livro', () => {
    renderCard();
    expect(screen.getByText('Clean Architecture')).toBeInTheDocument();
    expect(screen.getByText('Robert C. Martin')).toBeInTheDocument();
  });

  it('chama onOpen com o id ao clicar no corpo do card', async () => {
    renderCard();
    await userEvent.click(screen.getByText('Clean Architecture'));
    expect(defaultProps.onOpen).toHaveBeenCalledWith('1');
  });

  it('chama onDelete com id e título ao clicar no botão deletar', async () => {
    renderCard();
    await userEvent.click(screen.getByRole('button', { name: /deletar livro/i }));
    expect(defaultProps.onDelete).toHaveBeenCalledWith('1', 'Clean Architecture');
  });

  it('desabilita o botão deletar durante isDeleting', () => {
    renderCard({ isDeleting: true });
    expect(screen.getByRole('button', { name: /deletar livro/i })).toBeDisabled();
  });
});
