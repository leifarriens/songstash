import React, { useState } from 'react';
import useSearch from './hooks/useSearch';
import { InView } from 'react-intersection-observer';
import { Audio } from 'react-loader-spinner';

export function Search() {
  const [query, setQuery] = useState('');

  const {
    data: results,
    fetchNextPage,
    hasNextPage,
    isInitialLoading,
    isFetchingNextPage,
  } = useSearch(query, { limit: 5 });

  return (
    <div className="relative mx-auto my-10 max-w-md">
      <input
        type="text"
        className="w-full backdrop-blur-md text-lg appearance-none rounded-xl border-2 border-transparent transition-colors py-3 px-6 bg-opacity-60 bg-neutral-800 text-center focus:bg-opacity-80 focus:border-gray-300 focus:outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search artist..."
      />

      {isInitialLoading && (
        <div className="flex justify-center mt-2">
          <Audio width={28} height={28} color="pink" />
        </div>
      )}

      {results && (
        <div className="scrollbar absolute w-full mt-4 p-4 rounded-xl backdrop-blur-md bg-neutral-800 bg-opacity-80 max-h-64 overflow-y-auto">
          {results.pages.map((groupe, i) => (
            <React.Fragment key={i}>
              {groupe?.items.map((artist) => {
                const image = artist.images[2];
                return (
                  <a
                    key={artist.id}
                    href={`/${artist.id}`}
                    className="flex p-2 gap-4 items-center hover:bg-pink-400 hover:bg-opacity-20 mb-4 rounded-full"
                  >
                    <img
                      className="rounded-full shadow-md h-12 w-12 object-cover"
                      width={48}
                      height={48}
                      src={image && image.url}
                      alt=""
                    />
                    <span>{artist.name}</span>
                  </a>
                );
              })}
            </React.Fragment>
          ))}

          {isFetchingNextPage && (
            <div className="flex justify-center mt-2">
              <Audio width={28} height={28} color="pink" />
            </div>
          )}

          {hasNextPage && (
            <InView onChange={(inView) => inView && fetchNextPage()} />
          )}
        </div>
      )}
    </div>
  );
}
