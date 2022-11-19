import { useEffect, useState } from 'react';
import { WindowSize } from '../types';

interface CoverProps extends SpotifyApi.ImageObject {
  size: WindowSize;
  listener: unknown;
}

export const Cover = ({ url, size, listener }: CoverProps) => {
  const [translate, setTranslate] = useState('translate(0,0)');

  useEffect(() => {
    setTranslate(getRandomScreenTranslate(size));
  }, [listener, size]);

  return (
    <div
      key={url}
      className="absolute transform-gpu duration-1000 ease-in-out animate-fadein"
      style={{
        transform: translate,
      }}
    >
      <img
        className="aspect-square object-cover blur-sm brightness-50"
        src={url}
        width={220}
        height={220}
        alt=""
      />
    </div>
  );
};

function getRandomScreenTranslate(size: WindowSize) {
  if (!size.width || !size.height) {
    return 'translate(0,0)';
  }

  const x = randomIntInterval((size.width / 3) * -1, size.width / 3);
  const y = randomIntInterval((size.height / 4) * -1, size.height / 4);

  return `translate(${x}px,${y}px)`;
}

function randomIntInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
