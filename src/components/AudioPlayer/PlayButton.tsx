import { BsPlayCircle, BsStopCircleFill } from 'react-icons/bs';
import { useAudioPlayerStore } from './store';

interface PlayButtonProps {
  src: string;
}

export function PlayButton({ src }: PlayButtonProps) {
  const audio = useAudioPlayerStore();
  const isPlaying = src ? audio.src === src : false;
  const progress = isPlaying ? audio.progress : 0;

  const c = '24px';
  const r = '13px';
  const strokeWidth = '6px';
  const strokeDash = 80;

  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
  const strokeDashoffset = lerp(strokeDash, 0, progress) + 'px';

  function handlePlayClick() {
    if (!isPlaying && src) {
      audio.play(src);
    } else {
      audio.stop();
    }
  }

  return (
    <div className="relative">
      <svg className="w-12 h-12 -rotate-90">
        <circle
          className="w-12 h-12"
          cx={c}
          cy={c}
          r={r}
          fill="transparent"
          strokeWidth={strokeWidth}
          stroke={isPlaying ? '#ddd' : 'transparent'}
        />
        <circle
          className="w-12 h-12"
          cx={c}
          cy={c}
          r={r}
          fill="transparent"
          strokeWidth={strokeWidth}
          stroke={isPlaying ? '#79bd3a' : 'transparent'}
          strokeDasharray={strokeDash}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'all 50ms linear' }}
        />
      </svg>
      <button
        className="text-2xl absolute left-0 top-0 transform translate-x-1/2 translate-y-1/2"
        onClick={handlePlayClick}
      >
        {!isPlaying ? <BsPlayCircle /> : <BsStopCircleFill />}
      </button>
    </div>
  );
}
