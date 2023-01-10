import { Keyboard, Text, Image } from 'react-native';
import classNames from 'classnames';
import { TouchableOpacity } from 'react-native';

type BadgeCommonProps = { selected?: boolean; onPress?: () => void };
type BadgeConditionalProps =
  | { artist?: never; genre?: string }
  | {
      artist?: SpotifyApi.ArtistObjectFull;
      genre?: never;
    };
type BadgeProps = BadgeCommonProps & BadgeConditionalProps;

export function Badge({ selected, genre, artist, onPress }: BadgeProps) {
  function handlePress() {
    Keyboard.dismiss();
    onPress && onPress();
  }

  return (
    <TouchableOpacity
      className={classNames(
        'flex flex-row items-center bg-neutral-800 rounded-lg px-2 py-1 mr-1',
        {
          'bg-pink-700': selected,
        },
      )}
      onPress={handlePress}
    >
      <>
        {artist && (
          <Image
            source={{ uri: artist.images[2].url, cache: 'force-cache' }}
            className="w-5 h-5 mr-1 rounded-full"
          />
        )}
        <Text className="text-neutral-300 text-lg">
          {genre && genre}
          {artist && artist.name}
        </Text>
      </>
    </TouchableOpacity>
  );
}
