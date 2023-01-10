import { useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { IOScrollView } from 'react-native-intersection-observer';
import shallow from 'zustand/shallow';
import { trpc } from '../../../utils/trpc';
import { useAudioStore } from '../store';
import { FilterState } from './Filter';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { Track } from './Track';
import { TrackRecommendation } from '@songstash/api';

interface RecommendationsProps {
  filters: FilterState;
}

export function Recommendations({ filters }: RecommendationsProps) {
  const ioScrollViewRef = useRef<ScrollView | null>(null);
  // const [scroll, setScroll] = useState(0);
  // const [isScrolling, setIsScrolling] = useState(false);
  const height = Dimensions.get('window').height;
  const [nextTrack, setNextTrack] = useState<TrackRecommendation | null>(null);
  const { currentTrack, setCurrentTrack } = useAudioStore(
    (state) => ({
      currentTrack: state.currentTrack,
      setCurrentTrack: state.setCurrentTrack,
    }),
    shallow,
  );

  const { playTrack, unloadTrack, pause, resume } = useAudioPlayer({
    loop: true,
  });

  const { data } = trpc.recommendations.useQuery(
    {
      genres: filters.genres,
      artists: filters.artists.map(({ id }) => id),
      limit: 30,
    },
    {
      staleTime: Infinity,
      enabled: filters.genres.length + filters.artists.length > 0,
      trpc: { abortOnUnmount: true },
    },
  );

  useEffect(() => {
    unloadTrack();
    setCurrentTrack(null);
    setNextTrack(null);
    // FIXME: breaks rules of hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // play track on currentTrack track change
  useEffect(() => {
    if (currentTrack) {
      playTrack(currentTrack);
    }
  }, [currentTrack, playTrack]);

  async function handleTrackInViewChange(
    track: TrackRecommendation,
    inView: boolean,
  ) {
    if (inView) {
      if (!currentTrack) {
        setCurrentTrack(track);
      }
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
  // FIXME: Fast scrolling breaks audio player & current track state
  return (
    <>
      <IOScrollView
        ref={ioScrollViewRef}
        className="bg-black mb-2"
        // onScrollBeginDrag={() => setIsScrolling(true)}
        // onScrollEndDrag={() => setIsScrolling(false)}
        snapToInterval={height}
        snapToAlignment="center"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
      >
        {data &&
          data.map((track) => (
            <Track
              key={track.id}
              height={height}
              track={track}
              onInViewChange={handleTrackInViewChange}
              onLongPressStart={() => pause()}
              onLongPressEnd={() => resume()}
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
