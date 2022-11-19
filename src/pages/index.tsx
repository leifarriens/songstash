import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { CoverWall } from '../modules/CoverWall';
import { prisma } from '../server/db/client';
import { getMultipleArtists } from '../services';

const Create = dynamic(() => import('../modules/Create'), {
  suspense: true,
});

export default function HomePage({
  covers,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💽</text></svg>"
        />
        <title>Songstash</title>
      </Head>

      <main className="px-5 mt-72 md:mt-96">
        <h1 className="text-4xl text-center tracking-tight font-bold text-white sm:text-6xl sm:tracking-tight lg:text-[4rem] xl:text-[6rem] 2xl:text-[6.5rem] xl:tracking-tight">
          <span>
            Welcome to{' '}
            <span className="text-gradient from-pink-600 to-pink-400">
              songstash
            </span>
          </span>
        </h1>

        <Suspense>
          <Create />
        </Suspense>

        <CoverWall covers={covers} />

        <section className="my-128">
          <h2 className="text-center text-5xl font-bold mb-4">
            Instant setup discography sites for Artists
          </h2>

          <p className="text-center text-lg font-semibold">
            Songstash is for quick and easy arrangement of Artist discogrpahy
            websites
          </p>

          <h3 className="text-center mt-16 text-2xl font-semibold text-neutral-200">
            Anyone can setup a site any artist
          </h3>
        </section>
      </main>
    </>
  );
}

export async function getStaticProps({}: GetStaticPropsContext) {
  const dbEntries = await prisma.artist.findMany({
    take: 40,
    orderBy: [
      {
        created_at: 'desc',
      },
    ],
  });

  const artists = await getMultipleArtists(dbEntries.map((a) => a.spotifyId));

  const covers = artists.map((artist) => artist.images[2]).reverse();

  return {
    props: {
      artists,
      covers,
    },
    revalidate: 60,
  };
}
