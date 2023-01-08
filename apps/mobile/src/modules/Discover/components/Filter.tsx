import { Dispatch, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import classNames from 'classnames';
import { Ionicons } from '@expo/vector-icons';
import { trpc } from '../../../utils/trpc';
import { FilterAction, FilterState } from '../filter';

interface FilterProps {
  filters: FilterState;
  dispatch: Dispatch<FilterAction>;
}

export function Filter({ filters, dispatch }: FilterProps) {
  const genreScrollRef = useRef<ScrollView | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  const numberOfFilters = filters.genres.length;

  const { data } = trpc.genres.useQuery(undefined, {
    staleTime: Infinity,
  });

  useEffect(() => {
    genreScrollRef.current?.scrollTo({
      x: 0,
      animated: true,
    });
  }, [filters.genres]);

  function handleFilterInputFocus() {
    genreScrollRef.current?.scrollTo({
      x: 0,
      animated: true,
    });
  }

  return (
    <View className="absolute top-16 z-20 px-3 w-full">
      <TextInput
        placeholder="Search genres..."
        className="px-3 bg-neutral-800 rounded-xl text-white"
        clearButtonMode="always"
        value={filterQuery}
        onChangeText={setFilterQuery}
        onFocus={handleFilterInputFocus}
        style={{
          fontSize: 18,
          paddingVertical: 10,
          backgroundColor: 'rgba(55, 55, 55,0.95)',
        }}
      />

      <ScrollView
        ref={genreScrollRef}
        horizontal={true}
        contentContainerStyle={{ alignItems: 'center' }}
        className="flex py-3"
      >
        {filters.genres.reverse().map((genre) => (
          <GenreBadge
            key={genre}
            genre={genre}
            selected={filters.genres.includes(genre)}
            onPress={(genre) =>
              dispatch({ type: 'REMOVE_GENRE', payload: genre })
            }
          />
        ))}

        {/* {filters.genres.length > 0 && (
          <Text className="text-white text-2xl mr-1">|</Text>
        )} */}

        {numberOfFilters > 0 && (
          <TouchableOpacity
            onPress={() => dispatch({ type: 'RESET' })}
            className="flex flex-row items-center rounded-lg py-1 mr-1"
          >
            <Ionicons name="close-circle" size={24} color="white" />
          </TouchableOpacity>
        )}

        {data &&
          data
            .filter((g) => {
              return !filters.genres.includes(g);
            })
            .filter((g) => {
              if (!filterQuery) return !g.includes('-');
              if (filterQuery !== '') {
                return g.includes(filterQuery.toLowerCase());
              }
            })
            .sort((a, b) => {
              // return a.localeCompare(b);
              return a.length - b.length;
            })
            .map((genre) => (
              <GenreBadge
                key={genre}
                genre={genre}
                onPress={(genre) => {
                  dispatch({ type: 'ADD_GENRE', payload: genre });
                  setFilterQuery('');
                }}
              />
            ))}
      </ScrollView>
    </View>
  );
}

function GenreBadge({
  genre,
  selected,
  onPress,
}: {
  genre: string;
  selected?: boolean;
  onPress: (genre: string) => void;
}) {
  return (
    <TouchableOpacity
      className={classNames(
        'flex flex-row items-center bg-neutral-800 rounded-lg px-2 py-1 mr-1',
        {
          'bg-pink-700': selected,
        },
      )}
      onPress={() => onPress(genre)}
    >
      <Text className="text-neutral-300 text-lg">{genre}</Text>
      {selected && <Ionicons name="close" size={18} color="white" />}
    </TouchableOpacity>
  );
}
