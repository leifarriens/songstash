import { z } from 'zod';
import { procedure, router } from '../trpc';
import { getArtistAlbums, searchArtist } from '../../services';

export const appRouter = router({
  search: procedure
    .input(
      z.object({
        query: z.string().min(3),
        limit: z.number().int().min(1).max(10),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 20;
      const offset = input.cursor ?? 0;

      return await searchArtist(input.query, { limit, offset });
    }),
  albums: procedure
    .input(
      z.object({
        artistId: z.string(),
        limit: z.number().int().min(1).max(50).nullish(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 20;
      const offset = input.cursor ?? 0;

      const albums = await getArtistAlbums(input.artistId, { limit, offset });
      return albums;
    }),
});

export type AppRouter = typeof appRouter;
