import { NextSeo } from 'next-seo';

export default function ServerError() {
  return (
    <>
      <NextSeo nofollow noindex />

      <main className="mt-96">
        <h1 className="text-center text-5xl font-bold">
          Something went wrong...
        </h1>
      </main>
    </>
  );
}
