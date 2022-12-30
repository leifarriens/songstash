import { useReducer } from 'react';
import { Filter } from './components/Filter';
import { Recommendations } from './components/Recommendations';
import { filterReducer, initialFilterState } from './filter';

export function Discover({ genres }: { genres: string[] }) {
  const [filters, dispatch] = useReducer(filterReducer, initialFilterState);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold text-center my-8 md:text-6xl md:my-16">
        Songstash discover
      </h1>

      <Filter genres={genres} filters={filters} dispatch={dispatch} />

      <Recommendations
        genres={Array.from(filters.genres)}
        artists={Array.from(filters.artists).map((a) => a.id)}
      />
    </div>
  );
}
