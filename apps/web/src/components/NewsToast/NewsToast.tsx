import { ReactNode, useState } from 'react';
import { IoMdClose } from 'react-icons/io';

interface NewsToastProps {
  children: ReactNode | ReactNode[];
}

export function NewsToast({ children }: NewsToastProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative py-6 bg-gradient-to-l from-pink-500 to-pink-400">
      <div className="mx-auto max-w-4xl text-center px-12">{children}</div>
      <button
        aria-label="Close News"
        className="absolute right-6 top-6"
        onClick={() => setVisible(false)}
      >
        <IoMdClose className="text-2xl" />
      </button>
    </div>
  );
}
