import { useEffect, useState } from 'react';

export const NetworkStatusBanner = () => {
  const [online, setOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  if (online) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[110] bg-amber-600 text-amber-50 text-center text-sm font-medium py-2 px-4 shadow-md"
      role="status"
    >
      You appear to be offline. Check Wi‑Fi or mobile data before recording payments or clinical data.
    </div>
  );
};
