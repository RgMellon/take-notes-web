import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from '@/app/libs/queryClient';
import { router } from '@/app/router';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster theme="dark" position="bottom-right" />
    </QueryClientProvider>
  );
}
