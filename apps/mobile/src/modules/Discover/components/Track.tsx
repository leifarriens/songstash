import {
  Image,
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  Linking,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { InView } from 'react-native-intersection-observer';
import * as Progress from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';
import { useAudioStore } from '../store';
import { useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface TrackProps {
  track: SpotifyApi.RecommendationTrackObject;
  height: number;
  onInViewChange: (
    track: SpotifyApi.RecommendationTrackObject,
    inView: boolean,
  ) => void;
  onPress: () => void;
}

export function Track({ track, height, onInViewChange, onPress }: TrackProps) {
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const isCurrent = track.id === currentTrack?.id;

  const toggleBookmark = () => setIsBookmarked((curr) => !curr);

  const doubleTab = Gesture.Tap().numberOfTaps(2).onStart(toggleBookmark);
  const tab = Gesture.Tap().onStart(() => onPress());

  return (
    <GestureDetector gesture={tab}>
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
          className="absolute inset-0 opacity-40"
        />
        <View className="flex justify-center items-center px-8 pt-8">
          <View style={styles.shadow}>
            <GestureDetector gesture={doubleTab}>
              <Image
                source={{ uri: track.album.images[1].url }}
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
    <View className="flex flex-row">
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
