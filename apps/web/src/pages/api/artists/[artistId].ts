import { prisma } from '../../../server/db/client';

import type { NextApiRequest, NextApiResponse } from 'next';
import { getArtist } from '@songstash/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const query = req.query;

  const artistId = Array.isArray(query.artistId)
    ? query.artistId[0]
    : query.artistId;

  if (!artistId) {
    return res.status(404).end();
  }

  const artist = await prisma.artist.findUnique({
    where: { spotifyId: artistId },
  });

  if (artist) {
    return res.json(artist);
  }

  const { name, id } = await getArtist(artistId);

  const slug = name
    .replaceAll('$', 's')
    .replaceAll(' ', '')
    .replace(/[^\w\s]/gi, '')
    .toLowerCase();

  // TODO: handle artist slug duplicates
  const newArtist = await prisma.artist.create({
    data: { spotifyId: id, slug },
  });

  res.status(200).send(newArtist);
}
