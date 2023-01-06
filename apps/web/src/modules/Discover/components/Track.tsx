import classNames from 'classnames';
import { PlayButton, useAudioPlayerStore } from '@components/AudioPlayer';

interface TrackProps {
  track: SpotifyApi.RecommendationTrackObject;
}

export function Track({ track }: TrackProps) {
  const audio = useAudioPlayerStore();

  const isPlaying = audio.src === track.preview_url;

  const image = track.album.images[2];

  return (
    <div
      className={classNames(
        'relative p-4 mb-4 transition-transform before:absolute before:rounded-xl before:-z-10 before:inset-0 before:bg-opacity-80 before:backdrop-blur-md before:bg-neutral-800 content-[""] before:saturate-50',
        {
          'scale-105': isPlaying,
          'before:bg-gradient-to-r from-pink-500 to-pink-400': isPlaying,
        },
      )}
    >
      <div className="flex items-center gap-4">
        <a href={track.external_urls.spotify} rel="noreferrer" target="_blank">
          {image && (
            <img
              src={image.url}
              alt={track.album.name}
              width={image.width}
              height={image.height}
              className="aspect-square object-cover shadow-lg"
              loading="lazy"
            />
          )}
        </a>

        <div className="w-full flex justify-between">
          <div>
            <a
              href={track.external_urls.spotify}
              rel="noreferrer"
              target="_blank"
            >
              {track.name}
            </a>

            <br />
            <div className="text-sm">
              {track.artists.map((artist) => (
                <ArtistLink key={artist.id} {...artist} />
              ))}
            </div>
          </div>

          {track.preview_url && <PlayButton src={track.preview_url} />}
        </div>
      </div>
    </div>
  );
}

function ArtistLink({ name, id }: SpotifyApi.ArtistObjectSimplified) {
  return (
    <span className='text-neutral-300 after:content-[","] after:mr-1 last:after:content-[""]'>
      <a
        className="hover:underline"
        href={`/${id}`}
        rel="noreferrer"
        target="_blank"
      >
        {name}
      </a>
    </span>
  );
}
