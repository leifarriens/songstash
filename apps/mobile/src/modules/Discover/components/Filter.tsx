import { Dispatch, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import classNames from 'classnames';
import { trpc } from '../../../utils/trpc';
import { FilterAction, FilterState } from '../filter';

interface FilterProps {
  filters: FilterState;
  dispatch: Dispatch<FilterAction>;
}

export function Filter({ filters, dispatch }: FilterProps) {
  const genreScrollRef = useRef<ScrollView | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  const { data } = trpc.genres.useQuery(undefined, {
    staleTime: Infinity,
  });

  useEffect(() => {
    genreScrollRef.current?.scrollTo({
      x: 0,
      animated: true,
    });
  }, [filters.genres]);

  return (
    <View className="absolute top-12 z-20 px-3 w-full">
      <View className="mb-10 ">
        <TextInput
          placeholder="Filter genres..."
          className="px-4 bg-neutral-800 bg-opacity-50 rounded-xl text-white"
          clearButtonMode="always"
          value={filterQuery}
          onChangeText={setFilterQuery}
          style={{ fontSize: 20, paddingVertical: 10 }}
        />

        <ScrollView
          ref={genreScrollRef}
          horizontal={true}
          className="flex py-3"
        >
          {Array.from(filters.genres)
            .reverse()
            .map((genre) => (
              <GenreBadge
                key={genre}
                genre={genre}
                selected={true}
                onPress={(genre) =>
                  dispatch({ type: 'REMOVE_GENRE', payload: genre })
                }
              />
            ))}

          {Array.from(filters.genres).length > 0 && (
            <Text className="text-white text-2xl mr-1">|</Text>
          )}

          {data &&
            data
              .filter((g) => {
                return !Array.from(filters.genres).includes(g);
              })
              .filter((g) => {
                if (!filterQuery) return !g.includes('-');
                if (filterQuery !== '') {
                  return g.includes(filterQuery.toLowerCase());
                }
              })
              .sort((a, b) => {
                return a.length - b.length;
              })
              .map((genre) => (
                <GenreBadge
                  key={genre}
                  genre={genre}
                  onPress={(genre) =>
                    dispatch({ type: 'ADD_GENRE', payload: genre })
                  }
                />
              ))}
        </ScrollView>

        {/* <View className="flex flex-row justify-center gap-2 flex-wrap py-2">
          {data &&
            data
              .filter((g) => {
                if (!filterQuery) return !g.includes('-');
                if (filterQuery !== '') {
                  return g.includes(filterQuery.toLowerCase());
                }
              })
              .map((genre) => (
                <TouchableOpacity
                  key={genre}
                  className="p-2 bg-neutral-700 w-auto rounded-xl"
                  onPress={() =>
                    dispatch({ type: 'ADD_GENRE', payload: genre })
                  }
                >
                  <Text className="text-white text-lg">{genre}</Text>
                </TouchableOpacity>
              ))}
        </View> */}
      </View>
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
      className={classNames('bg-neutral-700 rounded p-2 mr-1', {
        'bg-neutral-400': selected,
      })}
      onPress={() => onPress(genre)}
    >
      <Text className="text-white">
        {genre} {selected && 'x'}
      </Text>
    </TouchableOpacity>
  );
}
