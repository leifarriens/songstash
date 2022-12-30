import { trpc } from '@utils/trpc';
import { Audio } from 'react-loader-spinner';
import { Track } from './Track';
import { AudioPlayer } from '@components/AudioPlayer';

export function Recommendations({
  genres,
  artists,
}: {
  genres: string[];
  artists: string[];
}) {
  const { data, error, fetchStatus } = trpc.recommendations.useQuery(
    { genres, artists, limit: 30 },
    { enabled: genres.length > 0 || artists.length > 0 },
  );

  if (fetchStatus === 'fetching')
    return (
      <div className="flex justify-center">
        <Audio width={28} height={28} color="pink" />
      </div>
    );

  if (error) return <div>An error has occurred</div>;

  return (
    <div>
      {data && data.map((track) => <Track key={track.id} track={track} />)}

      <AudioPlayer />
    </div>
  );
}
