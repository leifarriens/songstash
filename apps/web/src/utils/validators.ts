import { z } from 'zod';

export const artistId = z.string().length(22);
export const artistUrl = z
  .string()
  .url()
  .startsWith('https://open.spotify.com/artist');

export const artistInput = artistUrl.or(artistId);
