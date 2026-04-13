import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { getStoredAuth } from '../lib/api';

export const ForbiddenPage = () => {
  const role = getStoredAuth()?.user?.role;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <p className="text-sm font-semibold text-amber-400 uppercase tracking-widest">Access denied</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-50">You cannot open this area</h1>
      <p className="mt-3 max-w-md text-slate-400 text-sm">
        Your role
        {role ? (
          <>
            {' '}
            (<span className="text-slate-200 font-mono text-xs">{role}</span>) does not include this screen. Use your
            dashboard or ask an administrator if you need access.
          </>
        ) : (
          ' could not be verified.'
        )}
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link to="/login">
          <Button variant="outline" type="button">
            Switch account
          </Button>
        </Link>
        <Link to="/">
          <Button variant="primary" type="button">
            Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
