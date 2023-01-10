import React from 'react';
import { trpc } from '../../../../../utils/trpc';
import { Badge } from '../Badge';
import { FilterState } from '../filter-reducer';

interface GenresFilterProps {
  query: string;
  filters: FilterState;
  onGenrePress: (genre: string) => void;
}

export default function GenresFilter({
  query,
  filters,
  onGenrePress,
}: GenresFilterProps) {
  const { data: genres } = trpc.genres.useQuery(undefined, {
    staleTime: Infinity,
  });

  if (!genres) return null;

  return (
    <>
      {genres
        .filter((g) => {
          return !filters.genres.includes(g);
        })
        .filter((g) => {
          if (!query) return !g.includes('-');
          if (query !== '') {
            return g.includes(query.toLowerCase());
          }
        })
        .sort((a, b) => {
          return a.length - b.length;
        })
        .map((genre) => (
          <Badge
            key={genre}
            genre={genre}
            onPress={() => onGenrePress(genre)}
          />
        ))}
    </>
  );
}
