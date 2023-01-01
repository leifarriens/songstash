import create from 'zustand';

interface AudioPlayerState {
  src: string | null;
  progress: number;
  playlist: string[];
  play: (src: string) => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  setProgress: (progress: number) => void;
  setPlaylist: (playlist: string[]) => void;
}

export const useAudioPlayerStore = create<AudioPlayerState>((set) => ({
  src: null,
  progress: 0,
  playlist: [],
  play: (src) => set(() => ({ src, progress: 0 })),
  stop: () => set(() => ({ src: null, progress: 0 })),
  next: () =>
    set((state) => {
      const currentlyPlayingIndex = state.playlist.findIndex(
        (src) => src === state.src,
      );
      if (currentlyPlayingIndex + 1 < state.playlist.length) {
        const nextTrackSrc = state.playlist[currentlyPlayingIndex + 1];
        return { src: nextTrackSrc, progress: 0 };
      }

      return { src: null, progress: 0 };
    }),
  previous: () =>
    set((state) => {
      const currentlyPlayingIndex = state.playlist.findIndex(
        (src) => src === state.src,
      );
      if (currentlyPlayingIndex - 1 >= 0) {
        const previousTrackSrc = state.playlist[currentlyPlayingIndex - 1];
        return { src: previousTrackSrc, progress: 0 };
      }
      return { src: null, progress: 0 };
    }),
  setProgress: (progress) => set(() => ({ progress })),
  setPlaylist: (playlist) => set(() => ({ playlist })),
}));
