import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getStoredAuth, setStoredAuth } from '../../lib/api';
import { Button } from '../ui/Button';

const DEFAULT_TIMEOUT_MIN = 120; // Increased from 30 to 120 minutes (2 hours)
const WARN_BEFORE_MIN = 10; // Warn 10 minutes before timeout

function readTimeoutMinutes(): number {
  const raw = import.meta.env.VITE_IDLE_TIMEOUT_MINUTES;
  const n = raw !== undefined && raw !== '' ? Number(raw) : DEFAULT_TIMEOUT_MIN;
  return Number.isFinite(n) && n >= 5 ? n : DEFAULT_TIMEOUT_MIN;
}

export const SessionIdleGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showWarning, setShowWarning] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const timeoutMin = readTimeoutMinutes();
  const warnMs = Math.max(1, timeoutMin - WARN_BEFORE_MIN) * 60_000;
  const logoutMs = timeoutMin * 60_000;

  const bump = useCallback(() => {
    lastActivityRef.current = Date.now();
    setShowWarning(false);
  }, []);

  useEffect(() => {
    if (getStoredAuth()?.accessToken) {
      bump();
    }
  }, [location.pathname, bump]);

  useEffect(() => {
    const onActivity = () => {
      if (!getStoredAuth()?.accessToken) return;
      lastActivityRef.current = Date.now();
      setShowWarning(false);
    };
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'] as const;
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, onActivity));
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      const auth = getStoredAuth();
      if (!auth?.accessToken) return;

      const idle = Date.now() - lastActivityRef.current;
      if (idle >= logoutMs) {
        setStoredAuth(null);
        setShowWarning(false);
        navigate('/login', { replace: true });
        return;
      }
      if (idle >= warnMs) {
        setShowWarning(true);
      }
    }, 30_000);

    return () => window.clearInterval(id);
  }, [logoutMs, warnMs, navigate]);

  if (!showWarning || !getStoredAuth()?.accessToken) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="max-w-md w-full rounded-2xl border border-amber-500/40 bg-slate-900 p-6 shadow-xl space-y-3">
        <h2 className="text-lg font-semibold text-amber-100">Session timeout</h2>
        <p className="text-sm text-slate-300">
          You have been inactive. For security on shared clinic computers, you will be logged out soon unless you
          continue.
        </p>
        <div className="flex gap-2 pt-2">
          <Button variant="primary" className="flex-1" type="button" onClick={bump}>
            Continue session
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            type="button"
            onClick={() => {
              setStoredAuth(null);
              setShowWarning(false);
              navigate('/login', { replace: true });
            }}
          >
            Log out now
          </Button>
        </div>
      </div>
    </div>
  );
};
