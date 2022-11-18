import { useEffect, useState } from 'react';

export const CoverWall = ({
  artists,
}: {
  artists: SpotifyApi.ArtistObjectFull[];
}) => {
  const size = useWindowSize();
  const covers = artists.map((artist) => {
    return artist.images[1];
  });

  return (
    <div className="absolute inset-0 flex justify-center items-center -z-30 overflow-hidden">
      {covers.map((cover) => (
        <div
          key={cover.url}
          className="absolute"
          style={{
            transform: getRandomScreenTranslate(size),
          }}
        >
          <img
            className="aspect-square object-cover  blur-lg brightness-50"
            src={cover.url}
            alt=""
          />
        </div>
      ))}
    </div>
  );
};

interface WindowSize {
  width: undefined | number;
  height: undefined | number;
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('load', handleResize);

    handleResize();
  }, []);

  return windowSize;
}

function getRandomScreenTranslate(size: WindowSize) {
  if (!size.width || !size.height) {
    return `translate(0,0)`;
  }

  return `translate(${randomIntFromInterval(
    (size.width / 2) * -1,
    size.width / 2,
  )}px, ${randomIntFromInterval((size.height / 2) * -1, size.height / 2)}px`;
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
