import dayjs from '../../lib/dayjs';
import { capitalizeFirstLetter } from '../../utils/helpers';

interface ArtistProps {
  artist: SpotifyApi.SingleArtistResponse;
  albums: SpotifyApi.ArtistsAlbumsResponse;
}

export const Artist = ({ artist, albums }: ArtistProps) => {
  const releases = albums.items.sort((a, b) => {
    return (
      new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
    );
  });

  const newestRelease = releases[0];
  const artistImage = artist.images[0];

  return (
    <div className="text-white">
      <section id="info" className="my-20 px-8">
        <div>
          <div className="my-28">
            <h1 className="text-5xl text-center font-bold text-white tracking-tight sm:text-6xl sm:tracking-tight lg:text-[4rem] xl:text-[6rem] 2xl:text-[6.5rem] xl:tracking-tight">
              {artist.name}
            </h1>
          </div>

          <div className="flex justify-center my-8">
            <img
              src={artistImage.url}
              height={artistImage.height}
              alt={`${artist.name} Image`}
              className="rounded-full aspect-square object-cover max-h-96"
            />
          </div>

          <div className="text-sm">
            {new Intl.NumberFormat('de-DE').format(artist.followers.total)}{' '}
            people following
          </div>

          <div className="text-sm text-slate-300">
            Latest Release: {dayjs(newestRelease.release_date).fromNow()}
          </div>
        </div>
      </section>

      <section id="releases">
        <h2 className="text-2xl font-semibold">Releases</h2>

        {releases.map((album) => {
          return (
            <article key={album.id} className="my-12">
              <div className="flex justify-center mb-4">
                <a
                  href={album.external_urls.spotify}
                  rel="noreferrer"
                  target="_blank"
                >
                  <img
                    src={album.images[1].url}
                    alt={`${album.name} Cover`}
                    loading="lazy"
                    className="shadow-2xl"
                    width={album.images[1].width}
                    height={album.images[1].height}
                  />
                </a>
              </div>
              <div className="text-center text-xs text-neutral-400">
                {album.total_tracks} Tracks
              </div>
              <h3 className="text-lg font-semibold">{album.name}</h3>
              <div className="text-xs text-slate-300">
                <span>{album.release_date}</span>{' '}
                <span>({dayjs(album.release_date).fromNow()})</span>
              </div>
              <div className="">{capitalizeFirstLetter(album.album_type)}</div>
            </article>
          );
        })}

        <a href={artist.external_urls.spotify} rel="noreferrer" target="_blank">
          More on spotify
        </a>
      </section>

      <div
        className="fixed inset-0 -z-50 bg-no-repeat bg-center bg-cover blur-3xl brightness-50"
        style={{ backgroundImage: `url(${artist.images[2].url})` }}
      ></div>
    </div>
  );
};
