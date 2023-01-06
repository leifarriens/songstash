import { NextSeo } from 'next-seo';

export default function NotFound() {
  return (
    <>
      <NextSeo nofollow noindex />

      <main className="mt-96">
        <h1 className="text-center text-5xl font-bold">Artist Id not found</h1>
      </main>
    </>
  );
}
