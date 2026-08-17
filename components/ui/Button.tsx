import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', fullWidth, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none';
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md hover:-translate-y-0.5',
      outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 shadow-sm hover:border-slate-300',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200',
    };

    const classes = `${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
