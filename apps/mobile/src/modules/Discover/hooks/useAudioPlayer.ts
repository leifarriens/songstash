import { TrackRecommendation } from '@songstash/api';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { useCallback, useEffect, useState } from 'react';
import { useAudioStore } from '../store';

export function useAudioPlayer({
  loop = true,
  onTrackFinish,
}: {
  loop?: boolean;
  onTrackFinish?: () => void;
}) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const updatePlayback = useAudioStore((state) => state.updatePlayback);
  const setIsPlaying = useAudioStore((state) => state.setIsPlaying);

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handlePlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (status.isLoaded) {
        updatePlayback(status);

        if (status.didJustFinish && onTrackFinish) {
          onTrackFinish();
        }

        // DISCUSS: handle playing state here ?
        // setIsPlaying(status.isPlaying);
      }
    },
    [onTrackFinish, updatePlayback],
  );

  const playTrack = useCallback(
    async (track: TrackRecommendation) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { sound } = await Audio.Sound.createAsync(
        {
          uri: track.preview_url,
        },
        {
          isLooping: loop,
          shouldPlay: true,
        },
        handlePlaybackStatusUpdate,
        false,
      );

      setSound(sound);

      setIsPlaying(true);
    },
    [handlePlaybackStatusUpdate, loop, setIsPlaying],
  );

  async function togglePlayback() {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await sound?.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    }
  }

  async function pause() {
    console.log('try pause');
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await sound?.pauseAsync();
        setIsPlaying(false);
      }
    }
  }

  async function resume() {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && !status.isPlaying) {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  }

  function unloadTrack() {
    setSound(null);
    setIsPlaying(false);
  }

  return { sound, playTrack, togglePlayback, pause, resume, unloadTrack };
}
