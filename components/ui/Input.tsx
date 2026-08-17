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
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 ${
              error 
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-red-900 bg-red-50/50' 
                : 'border-slate-200 text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white hover:border-slate-300 shadow-sm'
            } ${iconLeft ? 'pl-10 rtl:pl-3.5 rtl:pr-10' : ''} ${iconRight ? 'pr-10 rtl:pr-3.5 rtl:pl-10' : ''} ${className}`}
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
