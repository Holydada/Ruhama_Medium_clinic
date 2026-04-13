import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api, getStoredAuth, setStoredAuth } from '../lib/api';
import { AppHeader } from '../components/layout/AppHeader';

/**
 * Wraps all authenticated module routes: top bar + outlet.
 * Unauthenticated users are sent to login (same as ProtectedRoute guard).
 */
export const AuthenticatedShell = () => {
  const location = useLocation();
  const [, setProfileRefresh] = useState(0);
  const auth = getStoredAuth();

  useEffect(() => {
    const current = getStoredAuth();
    if (!current?.accessToken) return;
    void api
      .get('/auth/me')
      .then((resp) => {
        const user = resp.data?.data;
        if (user && current.accessToken) {
          setStoredAuth({ ...current, user });
          setProfileRefresh((n) => n + 1);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/dac8830c-c6e9-467c-9b36-cca0e5931c46', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'a30468' },
      body: JSON.stringify({
        sessionId: 'a30468',
        runId: 'debug',
        hypothesisId: 'H3',
        location: 'src/routes/AuthenticatedShell.tsx:onRouteChange',
        message: 'Route change',
        data: {
          pathname: location.pathname,
          hasAuth: Boolean(auth?.accessToken),
          role: auth?.user?.role,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [location.pathname]); // auth is derived from localStorage; role/token changes require reload

  if (!auth?.accessToken || !auth?.user?.role) {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/dac8830c-c6e9-467c-9b36-cca0e5931c46', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'a30468' },
      body: JSON.stringify({
        sessionId: 'a30468',
        runId: 'debug',
        hypothesisId: 'H3',
        location: 'src/routes/AuthenticatedShell.tsx:redirectToLogin',
        message: 'Redirecting to /login due to missing auth',
        data: {
          pathname: location.pathname,
          hasAuth: Boolean(auth?.accessToken),
          role: auth?.user?.role,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
};
