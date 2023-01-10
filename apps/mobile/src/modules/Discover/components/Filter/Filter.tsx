import { Dispatch, useEffect, useRef, useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterAction, FilterState } from './filter-reducer';
import React from 'react';
import ArtistsFilter from './ArtistsFilter/ArtistsFilter';
import GenresFilter from './GenresFilter/GenresFilter';
import { Badge } from './Badge';

interface FilterProps {
  filters: FilterState;
  dispatch: Dispatch<FilterAction>;
}

export function Filter({ filters, dispatch }: FilterProps) {
  const scrollRef = useRef<ScrollView | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  const numberOfFilters = filters.genres.length + filters.artists.length;
  const maxFilters = numberOfFilters >= 5;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: 0,
      animated: true,
    });
  }, [filters.genres]);

  function handleInputFocus() {
    scrollRef.current?.scrollTo({
      x: 0,
      animated: true,
    });
  }

  return (
    <View className="absolute top-16 z-20 px-3 w-full">
      <TextInput
        placeholder={
          maxFilters
            ? 'Maximum number of filters'
            : 'Search genres or artists...'
        }
        editable={!maxFilters}
        className="px-3 rounded-xl text-white"
        clearButtonMode="always"
        value={filterQuery}
        onChangeText={setFilterQuery}
        onFocus={handleInputFocus}
        style={{
          fontSize: 18,
          paddingVertical: 10,
          backgroundColor: 'rgba(25, 25, 25,0.95)',
        }}
      />

      <ScrollView
        ref={scrollRef}
        horizontal={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ alignItems: 'center' }}
        className="flex py-3"
      >
        {filters.artists.map((artist) => (
          <Badge
            key={artist.id}
            artist={artist}
            selected={true}
            onPress={() =>
              dispatch({ type: 'REMOVE_ARTIST', payload: artist.id })
            }
          />
        ))}

        {filters.genres.map((genre) => (
          <Badge
            key={genre}
            genre={genre}
            selected={filters.genres.includes(genre)}
            onPress={() => dispatch({ type: 'REMOVE_GENRE', payload: genre })}
          />
        ))}

        {numberOfFilters > 0 && (
          <TouchableOpacity
            onPress={() => dispatch({ type: 'RESET' })}
            className="flex flex-row items-center rounded-lg py-1 mr-1"
          >
            <Ionicons name="close-circle" size={26} color="white" />
          </TouchableOpacity>
        )}

        <GenresFilter
          query={filterQuery}
          filters={filters}
          onGenrePress={(genre) => {
            dispatch({ type: 'ADD_GENRE', payload: genre });
            setFilterQuery('');
          }}
        />
      </ScrollView>

      <ArtistsFilter
        query={filterQuery}
        onArtistPress={(artist) => {
          dispatch({ type: 'ADD_ARTIST', payload: artist });
          setFilterQuery('');
        }}
      />
    </View>
  );
}
