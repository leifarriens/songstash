import React from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
  View,
  FlatList,
  Keyboard,
} from 'react-native';

import useSearch from './useSearch';

interface ArtistsFilterProps {
  query: string;
  onArtistPress: (artist: SpotifyApi.ArtistObjectFull) => void;
}

export default function ArtistsFilter({
  query,
  onArtistPress,
}: ArtistsFilterProps) {
  const {
    data: results,
    hasNextPage,
    fetchNextPage,
    isInitialLoading,
    isFetchingNextPage,
  } = useSearch(query, { limit: 5 });

  function handleEndReached() {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }

  if (!results) return null;

  return (
    <View className="flex-1 bg-neutral-800 rounded-lg p-2">
      {isInitialLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ height: 300 }}
          data={results.pages}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.2}
          renderItem={({ item }) => (
            <>
              {item.items.map((artist) => {
                const image = artist.images[2];
                return (
                  <TouchableOpacity
                    key={artist.id}
                    className="flex flex-row items-center gap-3 p-2"
                    onPress={() => {
                      Keyboard.dismiss();
                      onArtistPress(artist);
                    }}
                  >
                    {image ? (
                      <Image
                        source={{ uri: image.url ?? '', cache: 'force-cache' }}
                        className="w-14 h-14 rounded-full"
                      />
                    ) : (
                      <View className="w-14 h-14 rounded-full bg-neutral-200" />
                    )}
                    <Text className="text-lg font-semibold text-neutral-200">
                      {artist.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
          ListFooterComponent={<ListFooter isLoading={isFetchingNextPage} />}
        />
      )}
    </View>
  );
}

const ListFooter = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <View className="h-12 flex items-center justify-center">
      {isLoading && <ActivityIndicator />}
    </View>
  );
};
