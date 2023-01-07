import create from 'zustand';
import { AVPlaybackStatusSuccess } from 'expo-av';

type AudioUpdate = AVPlaybackStatusSuccess;

interface AudioState {
  current: SpotifyApi.RecommendationTrackObject | null;
  next: SpotifyApi.RecommendationTrackObject | null;
  duration: number | null;
  progress: number;
  setCurrent: (track: SpotifyApi.RecommendationTrackObject) => void;
  updatePlayback: (update: AudioUpdate) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  current: null,
  next: null,
  duration: null,
  progress: 0,
  setCurrent: (track: SpotifyApi.RecommendationTrackObject) =>
    set(() => ({ current: track })),
  updatePlayback: (update: AudioUpdate) =>
    set(() => {
      if (update.durationMillis && update.playableDurationMillis) {
        return {
          duration: update.playableDurationMillis,
          progress: update.positionMillis / update.playableDurationMillis,
        };
      }

      return { duration: null, progress: 0 };
    }),
}));
