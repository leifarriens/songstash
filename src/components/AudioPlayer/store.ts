import create from 'zustand';

interface AudioPlayerState {
  src: string | null;
  progress: number;
  play: (src: string) => void;
  stop: () => void;
  setProgress: (progress: number) => void;
}

export const useAudioPlayerStore = create<AudioPlayerState>((set) => ({
  src: null,
  progress: 0,
  play: (src) => set(() => ({ src, progress: 0 })),
  stop: () => set(() => ({ src: null, progress: 0 })),
  setProgress: (progress) => set(() => ({ progress })),
}));
