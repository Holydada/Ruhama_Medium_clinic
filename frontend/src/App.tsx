import { Suspense, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ToastContainer } from './components/ui/ToastContainer';
import { ErrorBoundary } from './components/system/ErrorBoundary';
import { SessionIdleGuard } from './components/system/SessionIdleGuard';
import { NetworkStatusBanner } from './components/system/NetworkStatusBanner';
import { PageLoader } from './components/system/PageLoader';
import { AppRoutes } from './routes/AppRoutes';
import './styles/light-mode-fix.css';

// Light theme controller - applies light mode to all pages
function DarkThemeController() {
  const location = useLocation();
  
  useEffect(() => {
    // Always use light theme for all pages
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark', 'bg-slate-950');
    document.body.classList.add('bg-white');
  }, [location.pathname]);
  
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <DarkThemeController />
        <NetworkStatusBanner />
        <SessionIdleGuard />
        <Suspense fallback={<PageLoader />}>
          <AppRoutes />
        </Suspense>
        <ToastContainer />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
