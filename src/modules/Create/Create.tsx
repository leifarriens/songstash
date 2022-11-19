import { useState } from 'react';

export const Create = () => {
  const [value, setValue] = useState('');

  return (
    <div className="flex justify-center my-10">
      <form method="GET" action={`/${value}`} className="w-full flex max-w-lg">
        <input
          className="w-full appearance-none border-2 border-transparent rounded-xl py-2 px-4 bg-neutral-800 bg-opacity-50"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter spotify artist id"
        />
        <button
          type="submit"
          disabled={!value}
          className="appearance-none border-2 border-white rounded py-2 px-4 textc ml-4 hover:bg-white hover:text-black disabled:opacity-60 disabled:pointer-events-none"
        >
          Create
        </button>
      </form>
    </div>
  );
};
