import { useEffect, useRef } from 'react';
import { useAudioPlayerStore } from './store';

interface AudioPlayerProps {
  playlist?: string[];
}

export function AudioPlayer({ playlist }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { next, previous, stop, setPlaylist, setProgress, src } =
    useAudioPlayerStore();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25;
    }
  }, []);

  useEffect(() => {
    // NOTE: Prevents audio from resuming after remounting
    stop();
  }, [stop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        next();
      }

      if (e.key === 'ArrowUp') {
        previous();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [next, previous]);

  useEffect(() => {
    if (!playlist) {
      setPlaylist([]);
      return;
    }

    setPlaylist(playlist);
  }, [setPlaylist, playlist]);

  useEffect(() => {
    audioRef.current?.load();
  }, [src]);

  function handleTimeUpdate() {
    if (audioRef.current && audioRef.current.duration) {
      setProgress(audioRef.current.currentTime / audioRef.current.duration);
    }
  }

  function handleTrackEnded() {
    if (playlist) {
      next();
    } else {
      stop();
    }
  }

  return (
    <audio
      ref={audioRef}
      onCanPlay={() => audioRef.current?.play()}
      onEnded={handleTrackEnded}
      onTimeUpdate={handleTimeUpdate}
    >
      {src && <source src={src} type="audio/mpeg" />}
    </audio>
  );
}
