import { trpc } from '@utils/trpc';
import { Audio } from 'react-loader-spinner';
import { Track } from './Track';
import { AudioPlayer } from '@components/AudioPlayer';
import { Button } from '@components/ui';
import { useState } from 'react';
import { FilterState } from '../filter';

interface RecommendationsProps {
  genres: string[];
  artists: string[];
}

export function Recommendations({ genres, artists }: RecommendationsProps) {
  const { data, error, fetchStatus, refetch } = trpc.recommendations.useQuery(
    { genres, artists, limit: 30 },
    {
      enabled: genres.length > 0 || artists.length > 0,
      staleTime: Infinity,
    },
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
      {data && (
        <>
          {data.map((track) => (
            <Track key={track.id} track={track} />
          ))}

          <div className="text-center">
            <Button className="text-sm mt-6" onClick={() => refetch()}>
              Refresh results
            </Button>
          </div>
          {/* HACK: non-null assertion cause tracks without preview url are filtered */}
          <AudioPlayer playlist={data.map((track) => track.preview_url!)} />
        </>
      )}
    </div>
  );
}
