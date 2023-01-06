import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { WindowSize } from '../types';

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  const handleResize = useDebouncedCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, 500);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return windowSize;
}
