import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'dark' | 'light';
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, variant = 'dark', ...props }, ref) => {
    const surface =
      variant === 'light'
        ? 'bg-white text-slate-900 placeholder:text-slate-600 border-slate-300 shadow-sm'
        : 'bg-slate-900/60 text-slate-50 placeholder:text-slate-400 border-slate-700';
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'block w-full px-4 py-3 rounded-xl border',
            surface,
            'focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all',
            'disabled:opacity-60 disabled:cursor-not-allowed resize-none',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
