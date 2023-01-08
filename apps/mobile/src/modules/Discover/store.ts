import create from 'zustand';
import { AVPlaybackStatusSuccess } from 'expo-av';

type AudioUpdate = AVPlaybackStatusSuccess;
export type Track = SpotifyApi.RecommendationTrackObject | null;

interface AudioState {
  currentTrack: Track;
  duration: number | null;
  progress: number;
  isPlaying: boolean;
  setCurrentTrack: (track: Track) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  updatePlayback: (update: AudioUpdate) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentTrack: null,
  duration: null,
  progress: 0,
  isPlaying: false,
  setCurrentTrack: (track: Track) => set(() => ({ currentTrack: track })),
  setIsPlaying: (isPlaying: boolean) => set(() => ({ isPlaying })),
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
