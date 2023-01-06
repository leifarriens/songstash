import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '@songstash/api';

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';

  if (process.env.NODE_ENV !== 'development') return process.env.CANONICAL_URL;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: { staleTime: 60, refetchOnWindowFocus: false },
        },
      },
    };
  },
  ssr: false,
});
