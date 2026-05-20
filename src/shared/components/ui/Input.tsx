import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 outline-none transition
            placeholder:text-gray-400
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400
            ${error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : 'border-gray-300'}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
