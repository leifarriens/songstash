export const initialFilterState = {
  genres: [],
  artists: [],
};

export interface FilterState {
  genres: string[];
  artists: SpotifyApi.ArtistObjectFull[];
}

export type FilterAction =
  | { type: 'ADD_GENRE'; payload: string }
  | { type: 'REMOVE_GENRE'; payload: string }
  | { type: 'ADD_ARTIST'; payload: SpotifyApi.ArtistObjectFull }
  | { type: 'REMOVE_ARTIST'; payload: string }
  | { type: 'RESET' };

export function filterReducer(
  state: FilterState,
  action: FilterAction,
): FilterState {
  switch (action.type) {
    case 'ADD_GENRE':
      return {
        ...state,
        genres: Array.from(new Set(state.genres).add(action.payload)),
      };
    case 'REMOVE_GENRE':
      const genres = new Set(state.genres);
      genres.delete(action.payload);

      return { ...state, genres: Array.from(genres) };
    case 'ADD_ARTIST':
      return {
        ...state,
        artists: Array.from(new Set(state.artists).add(action.payload)),
      };
    case 'REMOVE_ARTIST':
      const artists = Array.from(state.artists).filter(
        (artist) => artist.id !== action.payload,
      );

      return { ...state, artists };
    case 'RESET':
      return initialFilterState;
    default:
      return state;
  }
}
