import React from 'react';
import { InView } from 'react-intersection-observer';
import dayjs from '../../lib/dayjs';
import { capitalizeFirstLetter } from '../../utils/helpers';
import { trpc } from '../../utils/trpc';

export const InfiniteAlbums = ({
  artist,
  albums,
}: {
  artist: SpotifyApi.SingleArtistResponse;
  albums: SpotifyApi.ArtistsAlbumsResponse;
}) => {
  const limit = albums.limit;

  const { data, fetchNextPage, isFetchingNextPage } =
    trpc.albums.useInfiniteQuery(
      { artistId: artist.id, limit },
      {
        getNextPageParam: (lastPage) => {
          if (lastPage.offset + limit < lastPage.total) {
            return lastPage.offset + limit;
          }
          return undefined;
        },
        initialData: {
          pageParams: [limit],
          pages: [albums],
        },
      },
    );
  return (
    <>
      {data?.pages.map((groupe, i) => (
        <React.Fragment key={i}>
          {groupe.items.map((album) => {
            return (
              <article key={album.id} className="mt-12 mb-12">
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
                    />
                  </a>
                </div>
                <h3 className="text-lg font-semibold">{album.name}</h3>
                <div className="text-xs text-slate-300">
                  <span>{album.release_date}</span>{' '}
                  <span>({dayjs(album.release_date).fromNow()})</span>
                </div>
                <div className="">
                  {capitalizeFirstLetter(album.album_type)}
                </div>
              </article>
            );
          })}
        </React.Fragment>
      ))}

      <InView onChange={(inView) => inView && fetchNextPage()} />
    </>
  );
};
