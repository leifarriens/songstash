import { Dispatch, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { Input } from '@components/ui';
import { Search } from '../../Search';
import { FilterState, FilterAction } from '../filter';
import classNames from 'classnames';

export function Filter({
  genres,
  filters,
  dispatch,
}: {
  genres: string[];
  filters: FilterState;
  dispatch: Dispatch<FilterAction>;
}) {
  const [filterQuery, setFilterQuery] = useState('');

  const numberOfFilters = filters.genres.length + filters.artists.length;

  function handleClear() {
    setFilterQuery('');
    dispatch({ type: 'RESET' });
  }

  return (
    <>
      <Input
        type="search"
        value={filterQuery}
        onChange={(e) => setFilterQuery(e.target.value)}
        placeholder="Filter genres..."
        className="w-full text-center md:w-auto md:text-left"
      />

      <div className="overflow-y-hidden overflow-x-scroll my-2 md:overflow-auto">
        <div className="flex gap-1 py-2 md:flex-wrap">
          {genres
            .filter((g) => {
              if (!filterQuery) return !g.includes('-');
              if (filterQuery !== '') {
                return g.includes(filterQuery.toLowerCase());
              }
            })
            .map((g) => {
              const selected = filters.genres.includes(g);
              const dispatchType = selected ? 'REMOVE_GENRE' : 'ADD_GENRE';
              return (
                <button
                  key={g}
                  className={classNames(
                    'mb-1 py-1 px-2 text-sm text-neutral-200 bg-neutral-800 rounded-md hover:bg-neutral-600',
                    { 'bg-pink-700 text-white': selected },
                  )}
                  onClick={() => dispatch({ type: dispatchType, payload: g })}
                >
                  {g}
                </button>
              );
            })}
        </div>
      </div>

      <Search
        placeholder="Discover by artists"
        onArtistClick={(artist) => {
          dispatch({ type: 'ADD_ARTIST', payload: artist });
        }}
      />

      {numberOfFilters > 0 && (
        <div className="my-6">
          <div className="mb-2 text-neutral-200 text-sm">Results based on:</div>
          {filters.artists.map(({ id, name }) => (
            <span
              key={id}
              className="inline-flex gap-1 bg-neutral-600 mr-2 mb-2 py-1 px-2 rounded-md bg-opacity-60"
            >
              {name}
              <button
                onClick={() => dispatch({ type: 'REMOVE_ARTIST', payload: id })}
              >
                <AiOutlineClose />
              </button>
            </span>
          ))}
          {filters.genres.map((genre) => (
            <span
              key={genre}
              className="inline-flex gap-1 bg-neutral-600 mr-2 mb-2 py-1 px-2 rounded-md bg-opacity-60"
            >
              {genre}
              <button
                onClick={() =>
                  dispatch({ type: 'REMOVE_GENRE', payload: genre })
                }
              >
                <AiOutlineClose />
              </button>
            </span>
          ))}
          <button className="hover:underline" onClick={handleClear}>
            clear
          </button>
        </div>
      )}
    </>
  );
}
