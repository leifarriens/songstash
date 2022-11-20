import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { CoverWall } from '../modules/CoverWall';
import { prisma } from '../server/db/client';
import { getMultipleArtists } from '../services';
import { Search } from '../modules/Search';
import CountUp from 'react-countup';
import { InView } from 'react-intersection-observer';
import Image from 'next/image';

const Create = dynamic(() => import('../modules/Create'), {
  ssr: false,
});

export default function HomePage({
  covers,
  artists,
  artistsCount,
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

      <CoverWall covers={covers} />

      <main className="mt-72 md:mt-96">
        <div className="px-5">
          <h1 className="text-5xl text-center tracking-tight font-bold text-white sm:text-7xl sm:tracking-tight lg:text-[4rem] xl:text-[6rem] xl:tracking-tight">
            <span>
              Welcome to{' '}
              <span className="text-gradient from-pink-600 to-pink-400">
                songstash
              </span>
            </span>
          </h1>

          <h2 className="text-center text-2xl font-semibold mt-4">
            Instant discography websites for artists
          </h2>

          <Search />

          <section className="my-128">
            <h2 className="text-center text-5xl font-bold mb-4">
              Instantly setup discography sites for Artists
            </h2>

            <p className="text-center text-lg font-semibold">
              Songstash is for quick and easy arrangement of Artist discography
              websites
            </p>

            <p className="text-center mt-16 text-2xl font-semibold text-neutral-200">
              Anyone can setup a site for any artist
            </p>

            <Suspense>
              <Create />
            </Suspense>
          </section>
        </div>

        <section className="my-128">
          <div className="text-center font-bold">
            <CountUp end={artistsCount} separator={'.'}>
              {({ countUpRef, start }) => (
                <div>
                  <span
                    ref={countUpRef}
                    className="text-8xl text-gradient from-orange-400 to-orange-600"
                  />
                  <InView onChange={(inView) => inView && start()} />
                </div>
              )}
            </CountUp>

            <span className="text-2xl">pages created</span>
          </div>
        </section>

        <section className="py-28 bg-neutral-900 bg-opacity-90 backdrop-blur-lg mt-96">
          <div className="mx-auto max-w-4xl px-5">
            <h3 className="text-center text-6xl font-bold">New on songstash</h3>

            <div className="grid sm:grid-cols-2 gap-8 mt-28">
              {artists.map((artist) => {
                return (
                  <article
                    key={artist.id}
                    className="flex flex-col items-center"
                  >
                    <img
                      width={224}
                      height={224}
                      className="w-56 h-w-56 aspect-square"
                      src={artist.images[1].url}
                      alt=""
                    />
                    <a
                      href={`/${artist.id}`}
                      className="text-center text-xl font-semibold mt-4"
                    >
                      {artist.name}
                    </a>
                  </article>
                );
              })}
            </div>

            <h4 className="text-center text-3xl font-bold mt-32">
              Create new artist page
            </h4>
            <Suspense>
              <Create />
            </Suspense>
          </div>
        </section>
      </main>
    </>
  );
}

export async function getStaticProps({}: GetStaticPropsContext) {
  const dbEntries = await prisma.artist.findMany({
    take: 35,
    orderBy: [
      {
        created_at: 'desc',
      },
    ],
  });

  const artistsCount = await prisma.artist.count();

  const artists = await getMultipleArtists(dbEntries.map((a) => a.spotifyId));

  const covers = artists.map((artist) => artist.images[2]).reverse();

  artists.length = 12;

  return {
    props: {
      covers,
      artists,
      artistsCount,
    },
    revalidate: 60,
  };
}
