import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { CoverWall } from '../modules/CoverWall';
import { Create } from '../modules/Create';
import { prisma } from '../server/db/client';
import { getNewestArtists } from '../services';

export default function HomePage({
  artists,
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

      <main>
        <section className="flex justify-center items-center">
          <div className="mt-80 mb-80">
            <h1 className="text-4xl text-center tracking-tight font-bold text-white sm:text-6xl sm:tracking-tight lg:text-[4rem] xl:text-[6rem] 2xl:text-[6.5rem] xl:tracking-tight">
              Welcome to <span className="text-yellow-200">song</span>
              <span className="text-red-500">stash</span>
            </h1>

            <Create />
          </div>
        </section>

        <CoverWall artists={artists} />
      </main>
    </>
  );
}

export async function getStaticProps({}: GetStaticPropsContext) {
  const dbEntries = await prisma.artist.findMany({});

  const artists = await getNewestArtists(dbEntries.map((a) => a.spotifyId));

  return {
    props: {
      artists,
    },
  };
}
