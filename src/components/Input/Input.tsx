interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: number;
}

export function Input({ size, className, ...rest }: InputProps) {
  const defaultClassNames =
    'backdrop-blur-md appearance-none rounded-xl border-2 border-transparent transition-colors py-2 px-4 bg-opacity-60 bg-neutral-800 focus:bg-opacity-60 focus:border-gray-300 focus:outline-none';
  const classNames = className
    ? defaultClassNames.concat(' ', className)
    : defaultClassNames;
  return <input className={classNames} {...rest} />;
}
