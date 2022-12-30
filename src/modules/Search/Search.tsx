import React, { BaseSyntheticEvent, useRef, useState } from 'react';
import useSearch from './hooks/useSearch';
import { InView } from 'react-intersection-observer';
import { Audio } from 'react-loader-spinner';
import { Input } from '../../components/Input';

interface SearchProps {
  placeholder?: string;
  onArtistClick?: (artist: SpotifyApi.ArtistObjectFull) => void;
}

/**
 * @param placeholder Input placeholder value.
 * @param onArtistClick When passed a callback function the default behavior of the link is prevented.
 */
export function Search({
  placeholder = 'Search artist',
  onArtistClick,
}: SearchProps) {
  const [query, setQuery] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const {
    data: results,
    fetchNextPage,
    hasNextPage,
    isInitialLoading,
    isFetchingNextPage,
  } = useSearch(query, { limit: 5 });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.action = '/' + query;
      formRef.current.submit();
    }
  }

  function handleArtistClick(
    e: BaseSyntheticEvent,
    artist: SpotifyApi.ArtistObjectFull,
  ) {
    if (onArtistClick) {
      e.preventDefault();
      onArtistClick(artist);
      setQuery('');
    }
  }

  return (
    <div className="relative">
      <form ref={formRef} onSubmit={handleSubmit}>
        <Input
          type="search"
          className="w-full text-lg transition-colors py-3 px-6 text-center"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder={`${placeholder}...`}
        />
      </form>

      {results && (
        <div className="scrollbar absolute w-full mt-4 p-4 rounded-xl backdrop-blur-md bg-neutral-800 bg-opacity-80 max-h-64 overflow-y-auto z-40">
          {results &&
            results.pages.map((groupe, i) => (
              <React.Fragment key={i}>
                {groupe?.items.map((artist) => {
                  const image = artist.images[2];
                  return (
                    <a
                      key={artist.id}
                      href={`/${artist.id}`}
                      onClick={(e) => handleArtistClick(e, artist)}
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
