import SpotifyWebApi from 'spotify-web-api-node';

import { prisma } from '../server/db/client';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export async function getAccessToken() {
  const currentToken = spotifyApi.getAccessToken();

  // HACK: sould when when currentToken has expired
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

interface GetArtistAlbumsOptions {
  limit?: number;
  offset?: number;
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

export async function getNewestArtists(artistIds: string[]) {
  await getAccessToken();

  const { body } = await spotifyApi.getArtists(artistIds);

  return body.artists;
}
