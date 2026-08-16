import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', iconLeft, iconRight, error, ...props }, ref) => {
    return (
      <div className={`w-full flex flex-col gap-1.5 ${className}`}>
        <div className="relative flex items-center w-full">
          {iconLeft && (
            <div className="absolute left-3 rtl:left-auto rtl:right-3 text-gray-400 pointer-events-none">
              {iconLeft}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:shadow-sm ${
              error 
                ? 'border-red-300 focus:border-red-500 text-red-900 bg-red-50' 
                : 'border-gray-200 text-gray-900 focus:border-blue-500 bg-surface'
            } ${iconLeft ? 'pl-10 rtl:pl-4 rtl:pr-10' : ''} ${iconRight ? 'pr-10 rtl:pr-4 rtl:pl-10' : ''}`}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3 rtl:right-auto rtl:left-3 text-gray-400">
              {iconRight}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
