import { useEffect, useReducer, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import { IOScrollView, InView } from 'react-native-intersection-observer';
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as Progress from 'react-native-progress';
import { trpc } from '../../utils/trpc';
import { filterReducer, FilterState, initialFilterState } from './filter';
import { Filter } from './components/Filter';
import { useAudioStore } from '../store';

export function Discover() {
  const [filters, dispatch] = useReducer(filterReducer, initialFilterState);

  return (
    <View>
      <Filter filters={filters} dispatch={dispatch} />

      <Recommendations filters={filters} />
    </View>
  );
}

interface RecommendationsProps {
  filters: FilterState;
}

function Recommendations({ filters }: RecommendationsProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const height = Dimensions.get('window').height;
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] =
    useState<SpotifyApi.RecommendationTrackObject | null>(null);
  const [nextTrack, setNextTrack] =
    useState<SpotifyApi.RecommendationTrackObject | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { current, setCurrent, updatePlayback } = useAudioStore();

  const { data, isFetching, refetch } = trpc.recommendations.useQuery(
    {
      genres: Array.from(filters.genres),
      artists: [],
    },
    {
      enabled: Array.from(filters.genres).length > 0,
    },
  );

  useEffect(() => {
    setCurrentTrack(null);
    setNextTrack(null);

    if (sound) {
      // try {
      //   sound.stopAsync();
      //   sound.unloadAsync();
      // } catch (error) {
      //   console.log(error);
      // }

      setSound(null);
    }
  }, [filters, data]);

  function handlePlaybackStatusUpdate(status: AVPlaybackStatus) {
    if (status.isLoaded) {
      updatePlayback(status);

      // FIXME: replay track now working
      // if (status.didJustFinish) {
      //   sound?.replayAsync();
      // }
    }
  }

  async function playTrack(track: SpotifyApi.RecommendationTrackObject) {
    const { sound } = await Audio.Sound.createAsync(
      {
        uri: track.preview_url!,
      },
      {
        isLooping: false,
      },
      handlePlaybackStatusUpdate,
    );

    setSound(sound);

    await sound.playAsync();
    setCurrent(track);
    setIsPlaying(true);
  }

  // play track on current track change
  useEffect(() => {
    if (currentTrack) {
      playTrack(currentTrack);
    }
  }, [currentTrack]);

  useEffect(() => {
    return sound
      ? () => {
          setIsPlaying(false);
          console.log('Unloading Sound');
          sound.stopAsync();
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    // Move next
    if (nextTrack && !currentTrack) {
      setCurrentTrack(nextTrack);
      setNextTrack(null);
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

  return (
    <>
      <IOScrollView
        className="bg-black mb-8"
        // contentContainerStyle={{ backgroundColor: 'black' }}
        onScrollBeginDrag={() => setIsScrolling(true)}
        onScrollEndDrag={() => setIsScrolling(false)}
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
            />
          ))}
      </IOScrollView>
      <View className="absolute bottom-8">
        <Text className="text-white">Current: {currentTrack?.name}</Text>
        <Text className="text-white">Next: {nextTrack?.name}</Text>
      </View>
    </>
  );
}

interface TrackProps {
  track: SpotifyApi.RecommendationTrackObject;
  height: number;
  onInViewChange: (
    track: SpotifyApi.RecommendationTrackObject,
    inView: boolean,
  ) => void;
}

function Track({ track, height, onInViewChange }: TrackProps) {
  const { current, progress } = useAudioStore();
  const isCurrent = track.id === current?.id;

  return (
    <InView
      key={track.id}
      className="relative flex justify-center items-center"
      style={{ height }}
      onChange={(inView) => onInViewChange(track, inView)}
    >
      <ImageBackground
        blurRadius={18}
        resizeMode="cover"
        source={{ uri: track.album.images[1].url }}
        className="absolute inset-0 opacity-40"
      />
      <View className="flex justify-center items-center px-8">
        <Image
          source={{ uri: track.album.images[1].url }}
          className="w-64 h-64 bg-neutral-500 shadow-xl mb-4"
        />
        <View className="flex items-center">
          <Text className="text-neutral-500">{track.artists[0].name}</Text>
          <Text className="text-white text-lg">{track.name}</Text>
        </View>
        <Progress.Pie progress={isCurrent ? progress : 0} size={50} />
      </View>
    </InView>
  );
}
