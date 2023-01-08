import { BsPlayCircle, BsStopCircleFill } from 'react-icons/bs';
import shallow from 'zustand/shallow';
import { useAudioPlayerStore } from './store';

interface PlayButtonProps {
  sourceUrl: string;
}

export function PlayButton({ sourceUrl }: PlayButtonProps) {
  const { src, play, stop } = useAudioPlayerStore(
    (state) => ({
      src: state.src,
      play: state.play,
      stop: state.stop,
    }),
    shallow,
  );
  const isPlaying = sourceUrl ? src === sourceUrl : false;

  function handlePlayClick() {
    if (!isPlaying && sourceUrl) {
      play(sourceUrl);
    } else {
      stop();
    }
  }

  return (
    <div className="relative">
      <svg className="w-12 h-12 -rotate-90">
        {isPlaying && <ProgressIndicator />}
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

function ProgressIndicator() {
  const progress = useAudioPlayerStore((state) => state.progress);

  const c = '24px';
  const r = '13px';
  const strokeWidth = '6px';
  const strokeDash = 80;

  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
  const strokeDashoffset = lerp(strokeDash, 0, progress) + 'px';

  return (
    <>
      <circle
        className="w-12 h-12"
        cx={c}
        cy={c}
        r={r}
        fill="transparent"
        strokeWidth={strokeWidth}
        stroke="#ddd"
      />
      <circle
        className="w-12 h-12"
        cx={c}
        cy={c}
        r={r}
        fill="transparent"
        strokeWidth={strokeWidth}
        stroke="#79bd3a"
        strokeDasharray={strokeDash}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{ transition: 'all 50ms linear' }}
      />
    </>
  );
}
