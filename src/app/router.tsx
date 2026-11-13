import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: async () => {
      const { Books } = await import('@/ui/pages/Books');
      return { Component: Books };
    },
  },
  {
    path: '/books/:bookId',
    lazy: async () => {
      const { Studio } = await import('@/ui/pages/Studio');
      return { Component: Studio };
    },
  },
]);
