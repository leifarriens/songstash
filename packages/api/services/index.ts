import SpotifyWebApi from 'spotify-web-api-node';

import { getAccessToken } from './token';

export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export async function getArtist(artistId: string) {
  await getAccessToken();

  const { body } = await spotifyApi.getArtist(artistId);

  return body;
}

interface GetPageOptions {
  limit?: number;
  offset?: number;
}

interface GetArtistAlbumsOptions extends GetPageOptions {
  country?: string;
}

export async function getArtistAlbums(
  artistId: string,
  { limit = 20, offset = 0, country = 'DE' }: GetArtistAlbumsOptions = {},
) {
  await getAccessToken();

  const { body: albums } = await spotifyApi.getArtistAlbums(artistId, {
    country,
    limit,
    offset,
    include_groups: 'album,single',
  });

  return albums;
}

export async function getMultipleArtists(artistIds: string[]) {
  await getAccessToken();

  const { body } = await spotifyApi.getArtists(artistIds);

  return body.artists;
}

export async function searchArtist(
  query: string,
  { limit = 20, offset = 0 }: GetPageOptions = {},
) {
  await getAccessToken();

  const { body } = await spotifyApi.searchArtists(query, {
    market: 'de',
    include_external: 'audio',
    limit,
    offset,
  });

  return body.artists;
}

export async function getGenres() {
  await getAccessToken();

  const { body } = await spotifyApi.getAvailableGenreSeeds();

  return body.genres;
}

export async function getRecommendations(
  { genres, artists }: { genres: string[]; artists: string[] },
  { limit = 20 }: GetPageOptions = {},
) {
  await getAccessToken();

  const { body } = await spotifyApi.getRecommendations({
    seed_genres: genres,
    seed_artists: artists,
    limit,
  });

  return body.tracks.filter((track) => track.preview_url);
}
