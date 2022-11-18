import '../styles/index.css';
import { Inter } from '@next/font/google';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const inter = Inter();

import type { AppType } from 'next/app';
import { trpc } from '../utils/trpc';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <div className={inter.className}>
        <Component {...pageProps} />
      </div>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </>
  );
};

export default trpc.withTRPC(MyApp);
