import { Audio, AVPlaybackStatus } from 'expo-av';
import { useEffect, useState } from 'react';
import { useAudioStore } from '../store';

export function useAudioPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const { updatePlayback } = useAudioStore();

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.stopAsync();
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  function handlePlaybackStatusUpdate(status: AVPlaybackStatus) {
    if (status.isLoaded) {
      updatePlayback(status);
    }
  }

  async function playTrack(track: SpotifyApi.RecommendationTrackObject) {
    const { sound } = await Audio.Sound.createAsync(
      {
        uri: track.preview_url!,
      },
      {
        isLooping: true,
      },
      handlePlaybackStatusUpdate,
    );

    setSound(sound);

    await sound.playAsync();
  }

  function unloadTrack() {
    setSound(null);
  }

  return { playTrack, unloadTrack };
}
