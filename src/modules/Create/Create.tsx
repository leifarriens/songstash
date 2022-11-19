import { useRouter } from 'next/router';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { artistInput, artistUrl } from '../../utils/validators';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export default function Create() {
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
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
          tabIndex={0}
          className="w-full backdrop-blur-md text-lg appearance-none rounded-xl border-2 border-transparent transition-colors py-3 px-6 bg-opacity-60 bg-neutral-800 text-center focus:bg-opacity-80 focus:border-gray-300 focus:outline-none"
          type="text"
          {...register('value')}
          placeholder="Enter Spotify Artist URL or ID"
        />
        <button
          type="submit"
          disabled={isSubmitted}
          className="w-full sm:w-auto mt-6 font-medium text-base py-3 px-5 rounded-xl bg-gradient-to-r from-pink-600 to-pink-400 transition-colors disabled:opacity-70"
        >
          Create songstash
        </button>
      </form>
    </div>
  );
}
