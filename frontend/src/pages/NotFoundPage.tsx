import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <p className="text-sm font-semibold text-sky-400 uppercase tracking-widest">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-50">Page not found</h1>
      <p className="mt-3 max-w-md text-slate-400 text-sm">
        The address may be wrong or this feature is not available for your role. Return to the home page or use your
        dashboard link from the menu.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link to="/">
          <Button variant="outline" type="button">
            Home
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="primary" type="button">
            Staff login
          </Button>
        </Link>
      </div>
    </div>
  );
};
