import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { IOScrollView, InView } from 'react-native-intersection-observer';
import { Audio } from 'expo-av';
import { trpc } from '../../utils/trpc';

export function Discover() {
  return (
    <View className="bg-black">
      <Recommendations />
    </View>
  );
}

function Recommendations() {
  const [isScrolling, setIsScrolling] = useState(false);
  const height = Dimensions.get('window').height;
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [nextTrack, setNextTrack] =
    useState<SpotifyApi.RecommendationTrackObject | null>(null);

  const { data, isFetching, refetch } = trpc.recommendations.useQuery({
    genres: ['jazz'],
    artists: [],
  });

  async function playTrack(track: SpotifyApi.RecommendationTrackObject) {
    setNextTrack(track);
    const { sound } = await Audio.Sound.createAsync(
      {
        uri: track.preview_url!,
      },
      {
        isLooping: false,
      },
      // (status) => console.log(status),
    );

    setSound(sound);

    await sound.playAsync();
  }

  useEffect(() => {
    if (!isScrolling && nextTrack) {
      playTrack(nextTrack);
    }
  }, [nextTrack, isScrolling]);

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.stopAsync();
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  if (!data) return null;

  return (
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
      {data.map((track) => (
        <Track
          key={track.id}
          height={height}
          track={track}
          onTrackPlay={setNextTrack}
        />
      ))}
    </IOScrollView>
  );
}

interface TrackProps {
  track: SpotifyApi.RecommendationTrackObject;
  height: number;
  onTrackPlay: (track: SpotifyApi.RecommendationTrackObject) => void;
}

function Track({ track, height, onTrackPlay }: TrackProps) {
  function handleViewChange(inView: boolean) {
    if (inView) {
      onTrackPlay(track);
    }
  }

  return (
    <InView
      key={track.id}
      className="relative flex justify-center items-center"
      style={{ height }}
      onChange={handleViewChange}
    >
      <ImageBackground
        blurRadius={18}
        resizeMode="cover"
        source={{ uri: track.album.images[1].url }}
        style={{
          opacity: 0.4,
        }}
        className="absolute inset-0"
      />
      <View className="flex justify-center items-center px-8">
        <Image
          source={{ uri: track.album.images[1].url }}
          className="w-56 h-56 bg-neutral-500 shadow-xl mb-4"
        />
        <View className="flex items-center">
          <Text className="text-neutral-500">{track.artists[0].name}</Text>
          <Text className="text-white text-lg">{track.name}</Text>
        </View>
      </View>
    </InView>
  );
}
