import { z } from 'zod';

const schema = z.object({
  VITE_API_URL: z.string().url(),
});

const parsed = schema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
});

export const env = {
  api: { url: parsed.VITE_API_URL },
};
