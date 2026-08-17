import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', fullWidth, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-600 active:bg-primary-700 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5',
      outline: 'border-2 border-primary bg-surface text-primary hover:bg-primary/5 active:bg-primary/10 hover:shadow-md hover:-translate-y-0.5',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200',
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
