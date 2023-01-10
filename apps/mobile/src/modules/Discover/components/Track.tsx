import {
  Image,
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { InView } from 'react-native-intersection-observer';
import * as Progress from 'react-native-progress';
import { useAudioStore } from '../store';
import { useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { TrackRecommendation } from '@songstash/api';

interface TrackProps {
  track: TrackRecommendation;
  height: number;
  onInViewChange: (track: TrackRecommendation, inView: boolean) => void;
  onPress?: () => void;
  onLongPress?: () => void;
  onLongPressStart?: () => void;
  onLongPressEnd?: () => void;
}

export function Track({
  track,
  height,
  onInViewChange,
  onLongPressStart,
  onLongPressEnd,
}: TrackProps) {
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const [, setIsBookmarked] = useState(false);
  const isCurrent = track.id === currentTrack?.id;
  const cover = track.album.images[1];

  const toggleBookmark = () => setIsBookmarked((curr) => !curr);

  const doubleTab = Gesture.Tap().numberOfTaps(2).onStart(toggleBookmark);
  const longPress = Gesture.LongPress()
    .minDuration(300)
    .onStart(() => onLongPressStart && onLongPressStart())
    .onEnd(() => onLongPressEnd && onLongPressEnd());

  return (
    <GestureDetector gesture={longPress}>
      <InView
        key={track.id}
        className="relative flex justify-center items-center"
        style={{ height }}
        onChange={(inView) => onInViewChange(track, inView)}
      >
        <ImageBackground
          blurRadius={8}
          resizeMode="cover"
          source={{ uri: track.album.images[2].url }}
          className="absolute inset-0 opacity-50"
        />
        <View className="flex justify-center items-center px-8 pt-8">
          <View style={styles.shadow}>
            <GestureDetector gesture={doubleTab}>
              <Image
                source={{ uri: cover.url, cache: 'force-cache' }}
                className="w-64 h-64 bg-neutral-500 mb-4"
              />
            </GestureDetector>
          </View>
          <View className="flex items-center">
            <ArtistLinks artists={track.artists} />

            <TouchableOpacity
              onPress={() => Linking.openURL(track.external_urls.spotify)}
            >
              <Text className="text-white text-2xl font-bold text-center">
                {track.name}
              </Text>
            </TouchableOpacity>
          </View>
          {isCurrent ? <ProgressIndicator /> : <View style={{ height: 36 }} />}
          {/* <TouchableOpacity onPress={toggleBookmark}>
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={36}
                color="white"
              />
            </TouchableOpacity> */}
        </View>
      </InView>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 13,
  },
});

interface ArtistLinkProps {
  artists: SpotifyApi.ArtistObjectSimplified[];
}

function ArtistLinks({ artists }: ArtistLinkProps) {
  return (
    <View className="flex flex-row flex-wrap justify-center">
      {artists.map(({ id, name, external_urls }, i) => {
        const isLast = i + 1 === artists.length;
        return (
          <TouchableOpacity
            key={id}
            onPress={() => Linking.openURL(external_urls.spotify)}
          >
            <Text className="text-lg text-neutral-400">
              {name}
              {!isLast && ', '}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function ProgressIndicator() {
  const progress = useAudioStore((state) => state.progress);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  return (
    <Progress.Pie
      color={isPlaying ? 'rgba(229, 229, 229, 0.8)' : 'rgba(100,100,100,0.5)'}
      borderWidth={0}
      progress={progress}
      size={36}
    />
  );
}
