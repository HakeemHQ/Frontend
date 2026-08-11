import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', iconLeft, iconRight, ...props }, ref) => {
    return (
      <div className={`relative flex items-center w-full ${className}`}>
        {iconLeft && (
          <div className="absolute left-3 text-gray-400 pointer-events-none">
            {iconLeft}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${
            iconLeft ? 'pl-10' : ''
          } ${iconRight ? 'pr-10' : ''}`}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3 text-gray-400">
            {iconRight}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
