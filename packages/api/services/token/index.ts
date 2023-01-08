import { spotifyApi } from '../';

import { prisma } from '../../db/client';

let tokenExpires: Date | null = null;

/**
 * Checks for valid access token in memory first. Then requests datbase
 * for non-expired token. If also no token in db request new access token
 * from api.
 */
export async function getAccessToken(): Promise<void> {
  const currentToken = spotifyApi.getAccessToken();

  if (currentToken) {
    const now = new Date();
    if (tokenExpires && tokenExpires > now) {
      // token in memory expiration date is after now
      return;
    }
  }

  // check db for nonexpired token
  const token = await prisma.token.findFirst({
    where: {
      expires: { gt: new Date() },
    },
  });

  // if token found set api access token to token
  if (token) {
    setAccessToken(token.content, token.expires);
    return;
  }

  // no nonexpired found -> request new token
  const {
    body: { access_token, expires_in },
  } = await spotifyApi.clientCredentialsGrant();

  const expires = new Date(Date.now() + expires_in * 1000);
  const newToken = await prisma.token.create({
    data: {
      content: access_token,
      expires,
    },
  });

  setAccessToken(newToken.content, expires);
  return;
}

function setAccessToken(accessToken: string, expires: Date) {
  spotifyApi.setAccessToken(accessToken);
  tokenExpires = expires;
}
