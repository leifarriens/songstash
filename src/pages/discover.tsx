import { useEffect, useReducer, useRef, useState } from 'react';
import { BsPlayCircle, BsStopCircleFill } from 'react-icons/bs';
import { trpc } from '../utils/trpc';
import { Audio } from 'react-loader-spinner';
import { AiOutlineClose } from 'react-icons/ai';
import { getGenres } from '../services';
import { InferGetStaticPropsType } from 'next';
import { Search } from '../modules/Search';
import classNames from 'classnames';
import { Input } from '../components/Input';

const initialFilterState = {
  genres: new Set<string>(),
  artists: new Set<SpotifyApi.ArtistObjectFull>(),
};

interface FilterState {
  genres: Set<string>;
  artists: Set<SpotifyApi.ArtistObjectFull>;
}

type FilterAction =
  | { type: 'ADD_GENRE'; payload: string }
  | { type: 'REMOVE_GENRE'; payload: string }
  | { type: 'ADD_ARTIST'; payload: SpotifyApi.ArtistObjectFull }
  | { type: 'REMOVE_ARTIST'; payload: string }
  | { type: 'RESET' };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'ADD_GENRE':
      return {
        ...state,
        genres: new Set(state.genres).add(action.payload),
      };
    case 'REMOVE_GENRE':
      const genres = new Set(state.genres);
      genres.delete(action.payload);

      return { ...state, genres };
    case 'ADD_ARTIST':
      return {
        ...state,
        artists: new Set(state.artists).add(action.payload),
      };
    case 'REMOVE_ARTIST':
      const artists = new Set(
        Array.from(state.artists).filter(
          (artist) => artist.id !== action.payload,
        ),
      );
      return { ...state, artists };
    case 'RESET':
      return initialFilterState;
    default:
      return state;
  }
}

function Discover({ genres }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [filters, dispatch] = useReducer(filterReducer, initialFilterState);
  const [filterQuery, setFilterQuery] = useState('');

  return (
    <div className="mb-4 mx-auto max-w-4xl px-6">
      <h1 className="text-3xl font-bold text-center my-8 md:text-6xl md:my-16">
        Songstash discover
      </h1>

      <Input
        type="search"
        value={filterQuery}
        onChange={(e) => setFilterQuery(e.target.value)}
        placeholder="Filter genres..."
      />

      <div className="flex flex-wrap gap-1 md:gap-1 my-2">
        {genres
          .filter((g) => {
            if (!filterQuery) return !g.includes('-');
            if (filterQuery !== '') {
              return g.includes(filterQuery.toLowerCase());
            }
          })
          .map((g) => (
            <button
              key={g}
              className="mb-1 p-2 text-xs text-neutral-300 bg-neutral-800 rounded-xl hover:bg-neutral-600 hover:text-white md:text-sm md:mb-2"
              onClick={() => dispatch({ type: 'ADD_GENRE', payload: g })}
            >
              {g}
            </button>
          ))}
      </div>
      <Search
        placeholder="Filter artists"
        onArtistClick={(artist) => {
          dispatch({ type: 'ADD_ARTIST', payload: artist });
        }}
      />
      <div className="my-6">
        <div className="mb-2 text-neutral-200 text-sm">Results based on:</div>
        {Array.from(filters.artists).map(({ id, name }) => (
          <span
            key={id}
            className="inline-flex gap-1 bg-neutral-600 mr-2 py-1 px-2 rounded-md bg-opacity-60"
          >
            {name}
            <button
              onClick={() => dispatch({ type: 'REMOVE_ARTIST', payload: id })}
            >
              <AiOutlineClose />
            </button>
          </span>
        ))}
        {Array.from(filters.genres).map((genre) => (
          <span
            key={genre}
            className="inline-flex gap-1 bg-neutral-600 mr-2 py-1 px-2 rounded-md bg-opacity-60"
          >
            {genre}
            <button
              onClick={() => dispatch({ type: 'REMOVE_GENRE', payload: genre })}
            >
              <AiOutlineClose />
            </button>
          </span>
        ))}
        <button
          className="hover:underline"
          onClick={() => dispatch({ type: 'RESET' })}
        >
          clear
        </button>
      </div>
      <Recommendations
        genres={Array.from(filters.genres)}
        artists={Array.from(filters.artists).map((a) => a.id)}
      />
    </div>
  );
}

function Recommendations({
  genres,
  artists,
}: {
  genres: string[];
  artists: string[];
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<number | null>(null);
  const { data, error, fetchStatus } = trpc.recommendations.useQuery(
    { genres, artists, limit: 30 },
    { enabled: genres.length > 0 || artists.length > 0 },
  );

  useEffect(() => {
    setPreviewUrl(null);
  }, [genres]);

  function handleTrackPlay(sourceUrl: string | null) {
    if (!sourceUrl) return;
    setPlaybackProgress(null);
    setPreviewUrl(sourceUrl);
  }

  function handleTrackStop() {
    setPreviewUrl(null);
    setPlaybackProgress(null);
  }

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
            <Track
              key={track.id}
              track={track}
              currentlyPlaying={previewUrl}
              currentPlaybackProgress={
                track.preview_url === previewUrl ? playbackProgress : null
              }
              onPlay={handleTrackPlay}
              onStop={handleTrackStop}
            />
          ))}
        </>
      )}
      <AudioPlayer
        src={previewUrl}
        onPause={() => setPreviewUrl(null)}
        onPlaybackProgressChange={(progress) => setPlaybackProgress(progress)}
      />
    </div>
  );
}

function AudioPlayer({
  src,
  onPause,
  onPlaybackProgressChange,
}: {
  src: string | null;
  onPause: () => void;
  onPlaybackProgressChange: (progress: number) => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25;
    }
  }, []);

  useEffect(() => {
    audioRef.current?.load();
  }, [src]);

  function handleLoaded() {
    audioRef.current?.play();
  }

  function handleTimeUpdate(e: React.SyntheticEvent<HTMLAudioElement, Event>) {
    if (audioRef.current && audioRef.current.duration) {
      onPlaybackProgressChange(
        audioRef.current.currentTime / audioRef.current.duration,
      );
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        onLoadedData={handleLoaded}
        onPause={onPause}
        onTimeUpdate={handleTimeUpdate}
      >
        {src && <source src={src} type="audio/mpeg" />}
      </audio>
    </>
  );
}

function Track({
  track,
  currentlyPlaying,
  currentPlaybackProgress,
  onPlay,
  onStop,
}: {
  track: SpotifyApi.RecommendationTrackObject;
  currentlyPlaying: string | null;
  currentPlaybackProgress: number | null;
  onPlay: (sourceUrl: string | null) => void;
  onStop: () => void;
}) {
  const isPlaying = track.preview_url
    ? currentlyPlaying === track.preview_url
    : false;

  function handlePlayClick() {
    if (isPlaying) {
      onStop();
    } else {
      onPlay(track.preview_url);
    }
  }

  return (
    <div
      key={track.id}
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
          {track.album.images[2] && (
            <img
              src={track.album.images[2].url}
              alt={track.album.name}
              className="w-16 h-16 aspect-square object-cover shadow-lg"
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

          {track.preview_url && (
            <TrackPlayButton
              value={currentPlaybackProgress ?? 0}
              isPlaying={isPlaying}
              onPlayClick={handlePlayClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TrackPlayButton({
  value = 0.01,
  isPlaying,
  onPlayClick,
}: {
  value: number;
  isPlaying: boolean;
  onPlayClick: () => void;
}) {
  const c = '24px';
  const r = '13px';
  const strokeWidth = '4px';
  const strokeDash = 80;

  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
  const strokeDashoffset = lerp(strokeDash, 0, value) + 'px';

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
          style={{ transition: 'all 0.1s linear' }}
        />
      </svg>
      <button
        className="text-2xl absolute left-0 top-0 transform translate-x-1/2 translate-y-1/2"
        onClick={onPlayClick}
      >
        {!isPlaying ? <BsPlayCircle /> : <BsStopCircleFill />}
      </button>
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

export async function getStaticProps() {
  const genres = await getGenres();

  return {
    props: {
      genres,
    },
  };
}

export default Discover;
