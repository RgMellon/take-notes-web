import { test, expect } from '@playwright/test';

const BOOKS = [
  { id: '1', title: 'Clean Architecture', author: 'Robert C. Martin', createdAt: '', updatedAt: '' },
  { id: '2', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', createdAt: '', updatedAt: '' },
];

test.beforeEach(async ({ page }) => {
  await page.route('**/books', async route => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: BOOKS });
    } else {
      await route.continue();
    }
  });

  await page.route('**/books/1', async route => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill({ status: 204, body: '' });
    } else {
      await route.continue();
    }
  });
});

test('exibe a lista de livros', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Clean Architecture')).toBeVisible();
  await expect(page.getByText('Designing Data-Intensive Applications')).toBeVisible();
});

test('abre o modal de confirmação ao clicar em deletar', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /deletar livro/i }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText('Clean Architecture').nth(1)).toBeVisible();
});

test('fecha o modal ao clicar em Cancelar sem excluir', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /deletar livro/i }).first().click();
  await page.getByRole('button', { name: /cancelar/i }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByText('Clean Architecture')).toBeVisible();
});

test('fecha o modal ao clicar no overlay sem excluir', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /deletar livro/i }).first().click();
  await page.locator('.modal-overlay').click({ position: { x: 10, y: 10 } });
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByText('Clean Architecture')).toBeVisible();
});

test('exclui o livro e remove da lista após confirmar', async ({ page }) => {
  let deleted = false;

  await page.route('**/books', async route => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: deleted ? [BOOKS[1]] : BOOKS });
    } else {
      await route.continue();
    }
  });

  await page.route('**/books/1', async route => {
    if (route.request().method() === 'DELETE') {
      deleted = true;
      await route.fulfill({ status: 204, body: '' });
    } else {
      await route.continue();
    }
  });

  await page.goto('/');
  await page.getByRole('button', { name: /deletar livro/i }).first().click();
  await page.getByRole('button', { name: /^excluir$/i }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByText('Clean Architecture')).not.toBeVisible();
  await expect(page.getByRole('main').getByText('Designing Data-Intensive Applications')).toBeVisible();
});
