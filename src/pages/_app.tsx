import '../styles/index.css';
import { Inter } from '@next/font/google';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const inter = Inter();

import type { AppType } from 'next/app';
import { trpc } from '../utils/trpc';
import Link from 'next/link';
import Head from 'next/head';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📀</text></svg>"
        />
        <title>Songstash</title>
      </Head>
      <div className={inter.className}>
        <Component {...pageProps} />
        <footer>
          <div className="text-center text-sm text-neutral-400 my-8">
            <Link href="/" className="hover:underline hover:text-neutral-200">
              songstash
            </Link>{' '}
            powered by{' '}
            <a
              href="https://spotify.com/"
              rel="noreferrer"
              target="_blank"
              className="hover:underline hover:text-green-400"
            >
              spotify
            </a>
          </div>
        </footer>
      </div>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </>
  );
};

export default trpc.withTRPC(MyApp);
