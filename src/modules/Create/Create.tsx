import { useRef } from 'react';
import { artistInput, artistUrl } from '../../utils/validators';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@components/ui';

export default function Create() {
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ value: string }>({
    resolver: zodResolver(
      z.object({
        value: artistInput,
      }),
    ),
  });

  const onSubmit: SubmitHandler<{ value: string }> = ({ value }) => {
    // value is expected as valid url or valid id
    if (!formRef.current) return;

    const { success: isArtistUrl } = artistUrl.safeParse(value);

    if (!isArtistUrl) {
      formRef.current.action = '/' + value;
      formRef.current.submit();
      return;
    }

    const url = new URL(value);

    formRef.current.action = '/' + url.pathname.split('/')[2];
    formRef.current.submit();
  };

  return (
    <div className="sticky top-8 flex justify-center my-10 self-start">
      <form
        ref={formRef}
        method="GET"
        action="/"
        className="text-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="w-full backdrop-blur-md text-lg appearance-none rounded-xl border-2 border-transparent transition-colors py-3 px-6 bg-opacity-60 bg-neutral-800 text-center focus:bg-opacity-80 focus:border-gray-300 focus:outline-none"
          type="text"
          {...register('value')}
          placeholder="Enter Spotify Artist URL or ID"
        />
        <Button type="submit" className="mt-6" disabled={isSubmitting}>
          Create songstash
        </Button>
      </form>
    </div>
  );
}
