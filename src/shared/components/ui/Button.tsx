interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'ghost';
}

export function Button({
  children,
  isLoading,
  variant = 'primary',
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-300',
    ghost:
      'bg-transparent text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500 disabled:text-indigo-300',
  };

  return (
    <button
      disabled={disabled ?? isLoading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          처리 중...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
