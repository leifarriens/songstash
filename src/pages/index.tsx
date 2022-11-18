/* eslint-disable @next/next/no-img-element */
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

type SongstashPageProps = {
  artist: SpotifyApi.SingleArtistResponse;
  albums: SpotifyApi.ArtistsAlbumsResponse;
  timestamp: string;
};

export default function HomePage({
  artist,
  albums,
  timestamp,
}: SongstashPageProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href={artist.images[2].url} />
        <title>{artist.name}</title>
      </Head>

      <main>
        <section id="info">
          <div className="hero">
            <h1>{artist.name}</h1>

            <div className="artist--image">
              <img src={artist.images[1].url} alt={`${artist.name} Image`} />
            </div>
          </div>
        </section>

        <section id="releases">
          <h2>Releases</h2>
          {albums.items
            .sort((a, b) => {
              return (
                new Date(b.release_date).getTime() -
                new Date(a.release_date).getTime()
              );
            })
            .map((album) => {
              return (
                <article key={album.id}>
                  <a
                    href={album.external_urls.spotify}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <img
                      src={album.images[1].url}
                      alt={`${album.name} Cover`}
                      loading="lazy"
                    />
                  </a>
                  <h3>{album.name}</h3>
                  <div>Released: {album.release_date}</div>
                  <div>{capitalizeFirstLetter(album.album_type)}</div>
                </article>
              );
            })}
        </section>
        <div className="text-center mt-8">{timestamp}</div>
      </main>

      <div
        className="underlay"
        style={{ backgroundImage: `url(${artist.images[2].url})` }}
      ></div>
    </>
  );
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function getStaticProps({}: GetStaticPropsContext) {
  const artistId = process.env.ARTIST_ID;

  const { body } = await spotifyApi.clientCredentialsGrant();

  spotifyApi.setAccessToken(body.access_token);

  const { body: artist } = await spotifyApi.getArtist(artistId);
  const { body: albums } = await spotifyApi.getArtistAlbums(artistId, {
    country: 'DE',
    limit: 20,
    include_groups: 'album,single',
  });
  const timestamp = new Date().toLocaleString();

  return {
    props: {
      artist,
      albums,
      timestamp,
    },
    revalidate: 60 * 60 * 24,
  };
}
