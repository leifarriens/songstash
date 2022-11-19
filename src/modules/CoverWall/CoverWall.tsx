import { Cover } from './components/Cover';
import useStopScrollPos from './hooks/useStopScrollPos';
import useWindowSize from './hooks/useWindowSize';

export const CoverWall = ({ covers }: { covers: SpotifyApi.ImageObject[] }) => {
  const size = useWindowSize();
  const scrollPos = useStopScrollPos();

  return (
    <div className="fixed inset-0 flex justify-center items-center -z-30 select-none overflow-hidden animate-fadein">
      {covers.map((cover) => (
        <Cover key={cover.url} {...cover} size={size} listener={scrollPos} />
      ))}
    </div>
  );
};
