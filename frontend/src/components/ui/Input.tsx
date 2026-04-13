import { InputHTMLAttributes, createElement, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode | React.ComponentType<any>;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, icon, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {typeof icon === 'function' ? createElement(icon, { className: 'h-5 w-5' }) : icon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              'block w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400',
              'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100',
              error ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20' : '',
              icon ? 'pl-10 pr-4 py-2.5' : 'px-4 py-2.5',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-error-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
