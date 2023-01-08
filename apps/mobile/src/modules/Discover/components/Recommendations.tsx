import { useEffect, useState } from 'react';
import { Dimensions, RefreshControl, View, Text } from 'react-native';
import { IOScrollView } from 'react-native-intersection-observer';
import shallow from 'zustand/shallow';
import { trpc } from '../../../utils/trpc';
import { useAudioStore } from '../store';
import { FilterState } from '../filter';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { Track } from './Track';

interface RecommendationsProps {
  filters: FilterState;
}

export function Recommendations({ filters }: RecommendationsProps) {
  // const [isScrolling, setIsScrolling] = useState(false);
  const height = Dimensions.get('window').height;
  const [nextTrack, setNextTrack] =
    useState<SpotifyApi.RecommendationTrackObject | null>(null);
  const { currentTrack, setCurrentTrack } = useAudioStore(
    (state) => ({
      currentTrack: state.currentTrack,
      setCurrentTrack: state.setCurrentTrack,
    }),
    shallow,
  );

  const { playTrack, unloadTrack, togglePlayback } = useAudioPlayer();

  const { data, isFetching, refetch } = trpc.recommendations.useQuery(
    {
      genres: filters.genres,
      artists: [],
      limit: 30,
    },
    {
      staleTime: Infinity,
      enabled: filters.genres.length > 0,
    },
  );

  useEffect(() => {
    setCurrentTrack(null);
    setNextTrack(null);

    unloadTrack();
  }, [filters, data]);

  // play track on currentTrack track change
  useEffect(() => {
    if (currentTrack) {
      playTrack(currentTrack);
    }
  }, [currentTrack]);

  useEffect(() => {
    // Play next track if no current Track
    if (nextTrack && !currentTrack) {
      setCurrentTrack(nextTrack);
    }
  }, [nextTrack]);

  function handleTrackInViewChange(
    track: SpotifyApi.RecommendationTrackObject,
    inView: boolean,
  ) {
    if (inView) {
      setNextTrack(track);
    }

    // if track leaving viewport is the current track -> play next track
    if (!inView && currentTrack?.id === track.id) {
      if (nextTrack) {
        setCurrentTrack(nextTrack);
      }
    }
  }

  // TODO: Add autoplay on track end, scrollview ref?
  return (
    <>
      <IOScrollView
        className="bg-black mb-2"
        // onScrollBeginDrag={() => setIsScrolling(true)}
        // onScrollEndDrag={() => setIsScrolling(false)}
        snapToInterval={height}
        snapToAlignment="center"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => refetch()}
            tintColor="white"
          />
        }
      >
        {data &&
          data.map((track) => (
            <Track
              key={track.id}
              height={height}
              track={track}
              onInViewChange={handleTrackInViewChange}
              onPress={() => togglePlayback()}
            />
          ))}
      </IOScrollView>
      {/* <View className="absolute bottom-8">
        <Text className="text-white">Current: {currentTrack?.name}</Text>
        <Text className="text-white">Next: {nextTrack?.name}</Text>
      </View> */}
    </>
  );
}
