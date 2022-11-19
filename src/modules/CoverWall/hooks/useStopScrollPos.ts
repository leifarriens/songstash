import { useEffect, useState } from 'react';

export default function useStopScrollPos() {
  const [pos, setPos] = useState<number | undefined>();

  useEffect(() => {
    let isScrolling: NodeJS.Timeout;

    function handeScroll() {
      window.clearTimeout(isScrolling);

      isScrolling = setTimeout(function () {
        setPos(window.scrollY);
      }, 500);
    }

    window.addEventListener('scroll', handeScroll);

    return () => window.removeEventListener('scroll', handeScroll);
  }, []);

  return pos;
}
