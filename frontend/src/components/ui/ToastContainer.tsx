import { useEffect, useState } from 'react';
import { toast, type ToastMessage } from '../../lib/toast';

export const ToastContainer = () => {
  const [items, setItems] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToast) => {
      setItems((prev) => [...prev, newToast]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.id !== newToast.id));
      }, newToast.durationMs || 3500);
    });
    return unsubscribe;
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] space-y-3 pointer-events-none">
      {items.map((item) => {
        const isSuccess = item.type === 'success';
        const isError = item.type === 'error';
        const isInfo = item.type === 'info';

        return (
          <div
            key={item.id}
            className={`
              min-w-[400px] max-w-[500px] rounded-2xl border-2 px-6 py-5 shadow-2xl backdrop-blur-sm
              animate-in fade-in slide-in-from-top-4 duration-300
              ${
                isSuccess
                  ? 'border-emerald-400/50 bg-emerald-950/95 text-emerald-50'
                  : isError
                  ? 'border-red-400/50 bg-red-950/95 text-red-50'
                  : 'border-sky-400/50 bg-sky-950/95 text-sky-50'
              }
            `}
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div
                className={`
                  flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center
                  ${
                    isSuccess
                      ? 'bg-emerald-500/20 border-2 border-emerald-400/40'
                      : isError
                      ? 'bg-red-500/20 border-2 border-red-400/40'
                      : 'bg-sky-500/20 border-2 border-sky-400/40'
                  }
                `}
              >
                {isSuccess && (
                  <svg className="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {isError && (
                  <svg className="h-7 w-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {isInfo && (
                  <svg className="h-7 w-7 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>

              {/* Message */}
              <div className="flex-1">
                <p className="text-base font-semibold leading-relaxed">{item.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
