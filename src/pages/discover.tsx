import { getGenres } from '../services';
import { InferGetStaticPropsType } from 'next';
import { NextSeo } from 'next-seo';
import { Discover } from '../modules/Discover';

function DiscoverPage({
  genres,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo
        title="Songstash Discover"
        description="Discover new music based on your liking! Powered by songstash"
      />

      <main className="flex-1 mb-4 px-5 w-full">
        <Discover genres={genres} />
      </main>
    </>
  );
}

export async function getStaticProps() {
  const genres = await getGenres();

  return {
    props: {
      genres,
    },
  };
}

export default DiscoverPage;
