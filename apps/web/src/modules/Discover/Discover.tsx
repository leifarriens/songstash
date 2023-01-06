import { useReducer } from 'react';
import { Filter } from './components/Filter';
import { Recommendations } from './components/Recommendations';
import { filterReducer, initialFilterState } from './filter';

export function Discover({ genres }: { genres: string[] }) {
  const [filters, dispatch] = useReducer(filterReducer, initialFilterState);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-4xl font-bold text-center mt-8 md:text-6xl md:mt-16">
        Songstash discover
      </h1>
      <div className="text-center my-6 md:my-8">
        <span className="text-sm font-medium ml-2 p-1 uppercase border border-pink-400 bg-pink-400 bg-opacity-30 rounded-md">
          beta
        </span>
      </div>

      <Filter genres={genres} filters={filters} dispatch={dispatch} />

      <Recommendations
        genres={Array.from(filters.genres)}
        artists={Array.from(filters.artists).map((a) => a.id)}
      />
    </div>
  );
}
