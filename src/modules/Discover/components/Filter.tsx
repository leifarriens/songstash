import React, { Dispatch, useState } from 'react';
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

  return (
    <div>
      <Input
        type="search"
        value={filterQuery}
        onChange={(e) => setFilterQuery(e.target.value)}
        placeholder="Filter genres..."
      />

      <div className="flex flex-wrap gap-1 md:gap-1 my-2">
        {genres
          .filter((g) => {
            if (!filterQuery) return !g.includes('-');
            if (filterQuery !== '') {
              return g.includes(filterQuery.toLowerCase());
            }
          })
          .map((g) => {
            const selected = Array.from(filters.genres).includes(g);
            const dispatchType = selected ? 'REMOVE_GENRE' : 'ADD_GENRE';
            return (
              <button
                key={g}
                className={classNames(
                  'mb-1 p-2 text-xs text-neutral-300 bg-neutral-800 rounded-xl hover:bg-neutral-600 hover:text-white md:text-sm md:mb-2',
                  { 'bg-neutral-600': selected },
                )}
                onClick={() => dispatch({ type: dispatchType, payload: g })}
              >
                {g}
              </button>
            );
          })}
      </div>
      <Search
        placeholder="Filter artists"
        onArtistClick={(artist) => {
          dispatch({ type: 'ADD_ARTIST', payload: artist });
        }}
      />
      <div className="my-6">
        <div className="mb-2 text-neutral-200 text-sm">Results based on:</div>
        {Array.from(filters.artists).map(({ id, name }) => (
          <span
            key={id}
            className="inline-flex gap-1 bg-neutral-600 mr-2 py-1 px-2 rounded-md bg-opacity-60"
          >
            {name}
            <button
              onClick={() => dispatch({ type: 'REMOVE_ARTIST', payload: id })}
            >
              <AiOutlineClose />
            </button>
          </span>
        ))}
        {Array.from(filters.genres).map((genre) => (
          <span
            key={genre}
            className="inline-flex gap-1 bg-neutral-600 mr-2 py-1 px-2 rounded-md bg-opacity-60"
          >
            {genre}
            <button
              onClick={() => dispatch({ type: 'REMOVE_GENRE', payload: genre })}
            >
              <AiOutlineClose />
            </button>
          </span>
        ))}
        <button
          className="hover:underline"
          onClick={() => dispatch({ type: 'RESET' })}
        >
          clear
        </button>
      </div>
    </div>
  );
}
