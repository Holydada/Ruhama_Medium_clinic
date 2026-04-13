import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface AlertProps {
  children: ReactNode;
  variant?: 'default' | 'destructive' | 'warning' | 'success' | 'info';
  className?: string;
}

interface AlertDescriptionProps {
  children: ReactNode;
  className?: string;
}

interface AlertTitleProps {
  children: ReactNode;
  className?: string;
}

export const Alert = ({ children, variant = 'default', className }: AlertProps) => {
  const variantStyles = {
    default: 'bg-slate-800/50 border-slate-700 text-slate-300',
    destructive: 'bg-red-950/20 border-red-500 text-red-400',
    warning: 'bg-yellow-950/20 border-yellow-500 text-yellow-400',
    success: 'bg-green-950/20 border-green-500 text-green-400',
    info: 'bg-blue-950/20 border-blue-500 text-blue-400',
  };

  return (
    <div
      className={cn(
        'relative w-full rounded-xl border p-4 flex items-start gap-3',
        variantStyles[variant],
        className
      )}
      role="alert"
    >
      {children}
    </div>
  );
};

export const AlertTitle = ({ children, className }: AlertTitleProps) => {
  return (
    <h5 className={cn('mb-1 font-medium leading-none tracking-tight', className)}>
      {children}
    </h5>
  );
};

export const AlertDescription = ({ children, className }: AlertDescriptionProps) => {
  return (
    <div className={cn('text-sm [&_p]:leading-relaxed', className)}>
      {children}
    </div>
  );
};
