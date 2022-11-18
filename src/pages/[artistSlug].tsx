/* eslint-disable @next/next/no-img-element */
import { GetStaticPathsContext, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import { Artist } from '../modules/Artist';
import { prisma } from '../server/db/client';
import { NextSeo } from 'next-seo';
import { getArtist, getArtistAlbums } from '../services';

type SongstashPageProps = {
  artist: SpotifyApi.SingleArtistResponse;
  albums: SpotifyApi.ArtistsAlbumsResponse;
  slug: string;
  timestamp: string;
};

export default function HomePage({
  artist,
  albums,
  slug,
  timestamp,
}: SongstashPageProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href={artist.images[2].url} />
      </Head>
      <NextSeo
        title={artist.name}
        openGraph={{
          type: 'website',
          url: 'https://songstash.vercel.app/' + slug,
          title: `${artist.name} on songstash`,
          description: 'Open Graph Description',
          images: [
            {
              url: artist.images[1].url,
              width: artist.images[1].width,
              height: artist.images[1].height,
              alt: `${artist.name}`,
            },
          ],
        }}
      />
      <main className="text-center pl-5 pr-5">
        <Artist artist={artist} albums={albums} />
        <div className="mt-8 mb-8 text-xs text-slate-400">{timestamp}</div>
      </main>
    </>
  );
}

export async function getStaticPaths({}: GetStaticPathsContext) {
  const entrys = await prisma.artist.findMany({});

  const paths = entrys.map((entry) => ({
    params: { artistSlug: entry.slug },
  }));

  return { paths, fallback: 'blocking' };
}

interface Params extends ParsedUrlQuery {
  artistSlug: string;
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const { artistSlug } = params as Params;

  if (!artistSlug) {
    return {
      notFound: true,
    };
  }

  const dbArtist = await prisma.artist.findUnique({
    where: { slug: artistSlug },
  });

  if (!dbArtist) {
    return {
      notFound: true,
    };
  }

  const artistId = dbArtist.spotifyId;

  const artist = await getArtist(artistId);
  const albums = await getArtistAlbums(artistId, { limit: 20 });
  const timestamp = new Date().toLocaleString();

  return {
    props: {
      artist,
      albums,
      slug: artistSlug,
      timestamp,
    },
    revalidate: 60 * 60,
  };
}