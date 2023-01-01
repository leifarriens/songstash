interface Buttonprops extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: number;
}

export function Button({ children, className, ...rest }: Buttonprops) {
  const defaultClassNames =
    'font-medium py-3 px-5 rounded-xl bg-gradient-to-r from-pink-600 to-pink-400 transition-colors disabled:opacity-70';
  const classNames = className
    ? defaultClassNames.concat(' ', className)
    : defaultClassNames;
  return (
    <button className={classNames} {...rest}>
      {children}
    </button>
  );
}
