import { useDebounce } from 'use-debounce';
import { trpc } from '../../../../../utils/trpc';

interface SearchOptions {
  limit?: number;
}

export default function useSearch(
  query: string,
  { limit = 5 }: SearchOptions = {},
) {
  const [debouncedQuery] = useDebounce(query, 200);

  return trpc.search.useInfiniteQuery(
    { query: debouncedQuery, limit },
    {
      enabled: debouncedQuery.length >= 3,
      staleTime: Infinity,
      getNextPageParam: (lastPage) => {
        if (lastPage === undefined) return undefined;

        if (lastPage.offset + limit < lastPage.total) {
          return lastPage.offset + limit;
        }
        return undefined;
      },
    },
  );
}
