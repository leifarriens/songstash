import '../styles/index.css';
import { Inter } from '@next/font/google';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import classNames from 'classnames';

const inter = Inter();

import type { AppType } from 'next/app';
import { trpc } from '../utils/trpc';
import Link from 'next/link';
import Head from 'next/head';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" />
        <title>Songstash</title>
      </Head>
      <div
        className={classNames(inter.className, 'min-h-screen flex flex-col')}
      >
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
