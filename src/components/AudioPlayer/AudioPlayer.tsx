import { useEffect, useRef } from 'react';
import { useAudioPlayerStore } from './store';

interface AudioPlayerProps {
  playlist?: string[];
}

export function AudioPlayer({ playlist }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audio = useAudioPlayerStore();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25;
    }

    if (playlist) {
      audio.setPlaylist(playlist);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        audio.next();
      }

      if (e.key === 'ArrowUp') {
        audio.previous();
      }
    };

    // NOTE: Prevents audio from resuming after remounting
    // FIXME: breaks rules of hooks
    audio.stop();

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
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

  function handleTrackEnded() {
    if (playlist) {
      audio.next();
    } else {
      audio.stop();
    }
  }

  return (
    <audio
      ref={audioRef}
      onLoadedData={handleLoaded}
      onEnded={handleTrackEnded}
      onTimeUpdate={handleTimeUpdate}
    >
      {audio.src && <source src={audio.src} type="audio/mpeg" />}
    </audio>
  );
}
