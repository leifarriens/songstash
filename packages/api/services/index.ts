import SpotifyWebApi from 'spotify-web-api-node';

import { prisma } from '../db/client';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export async function getAccessToken() {
  const currentToken = spotifyApi.getAccessToken();

  // HACK: should fail when when currentToken has expired
  if (currentToken) return;

  const token = await prisma.token.findFirst({
    where: {
      expires: { gt: new Date() },
    },
  });

  if (token) {
    spotifyApi.setAccessToken(token.content);
    return;
  }

  const {
    body: { access_token, expires_in },
  } = await spotifyApi.clientCredentialsGrant();

  const newToken = await prisma.token.create({
    data: {
      content: access_token,
      expires: new Date(Date.now() + expires_in * 1000),
    },
  });

  spotifyApi.setAccessToken(newToken.content);
  return;
}

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
