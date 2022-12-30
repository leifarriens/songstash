import { useEffect, useRef } from 'react';
import { useAudioPlayerStore } from './store';

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audio = useAudioPlayerStore();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25;
    }

    // NOTE: Prevents audio from resuming after remounting
    // FIXME: breaks rules of hooks
    audio.stop();
  }, []);

  useEffect(() => {
    audioRef.current?.load();
  }, [audio.src]);

  const handleLoaded = () => audioRef.current?.play();

  function handleTimeUpdate() {
    if (audioRef.current && audioRef.current.duration) {
      audio.setProgress(
        audioRef.current.currentTime / audioRef.current.duration,
      );
    }
  }

  return (
    <audio
      ref={audioRef}
      onLoadedData={handleLoaded}
      onPause={() => audio.stop()}
      onTimeUpdate={handleTimeUpdate}
    >
      {audio.src && <source src={audio.src} type="audio/mpeg" />}
    </audio>
  );
}
