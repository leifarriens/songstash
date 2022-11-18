import { useState } from 'react';

export const Create = () => {
  const [value, setValue] = useState('');

  return (
    <div className="flex justify-center mt-10 mb-10">
      <form method="GET" action={`/${value}`} className="w-full flex max-w-lg">
        <input
          className="w-full appearance-none border-2 border-transparent rounded py-2 px-4 bg-neutral-800 bg-opacity-50"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter spotify artist id"
        />
        <button
          type="submit"
          className="appearance-none border-2 border-white rounded py-2 px-4 textc ml-4 hover:bg-white hover:text-black"
        >
          Create
        </button>
      </form>
    </div>
  );
};
