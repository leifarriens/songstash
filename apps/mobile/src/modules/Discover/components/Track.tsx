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
}

export function Track({ track, height, onInViewChange }: TrackProps) {
  const { currentTrack, progress } = useAudioStore();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const isCurrent = track.id === currentTrack?.id;

  const toggleBookmark = () => setIsBookmarked((curr) => !curr);

  const doubleTab = Gesture.Tap().numberOfTaps(2).onStart(toggleBookmark);

  return (
    <InView
      key={track.id}
      className="relative flex justify-center items-center"
      style={{ height }}
      onChange={(inView) => onInViewChange(track, inView)}
    >
      <TouchableWithoutFeedback onPress={() => console.log('hi')}>
        <>
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

              <TouchableOpacity onPress={() => Linking.openURL(track.uri)}>
                <Text className="text-white text-2xl font-bold text-center">
                  {track.name}
                </Text>
              </TouchableOpacity>
            </View>
            {/* <Progress.Pie
              color="#e5e5e5"
              borderWidth={0}
              progress={isCurrent ? progress : 0}
              size={36}
            />
            <TouchableOpacity onPress={toggleBookmark}>
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={36}
                color="white"
              />
            </TouchableOpacity> */}
          </View>
        </>
      </TouchableWithoutFeedback>
    </InView>
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
      {artists.map(({ id, name, uri }, i) => {
        const isLast = i + 1 === artists.length;
        return (
          <TouchableOpacity key={id} onPress={() => Linking.openURL(uri)}>
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
