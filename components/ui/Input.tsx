import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  error?: string;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', wrapperClassName = '', iconLeft, iconRight, error, ...props }, ref) => {
    return (
      <div className={`w-full flex flex-col gap-1.5 ${wrapperClassName}`}>
        <div className="relative flex items-center w-full">
          {iconLeft && (
            <div className="absolute left-3 rtl:left-auto rtl:right-3 text-gray-400 pointer-events-none z-10">
              {iconLeft}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full rounded-2xl border px-5 py-3.5 text-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:shadow-md ${
              error 
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-red-900 bg-red-50' 
                : 'border-slate-200 text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 bg-surface hover:border-slate-300'
            } ${iconLeft ? 'pl-11 rtl:pl-5 rtl:pr-11' : ''} ${iconRight ? 'pr-11 rtl:pr-5 rtl:pl-11' : ''} ${className}`}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3 rtl:right-auto rtl:left-3 text-gray-400 z-10">
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
