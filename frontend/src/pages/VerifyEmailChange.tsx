import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { toast } from '../lib/toast';
import { Button } from '../components/ui/Button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const VerifyEmailChange = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    verifyEmailChange(token);
  }, [searchParams]);

  const verifyEmailChange = async (token: string) => {
    try {
      const response = await api.post('/users/confirm-email-change', { token });
      setStatus('success');
      setMessage(`Email successfully changed to ${response.data.data.email}`);
      toast.success('Email changed successfully! Please login with your new email.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Failed to verify email change');
      toast.error(error.response?.data?.error || 'Failed to verify email change');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-sky-500" />
            <h1 className="mt-4 text-2xl font-bold text-white">Verifying Email Change</h1>
            <p className="mt-2 text-slate-400">Please wait while we verify your email change...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h1 className="mt-4 text-2xl font-bold text-white">Email Changed Successfully!</h1>
            <p className="mt-2 text-slate-400">{message}</p>
            <p className="mt-4 text-sm text-slate-500">Redirecting to login page...</p>
            <Button
              onClick={() => navigate('/login')}
              className="mt-6 w-full"
            >
              Go to Login
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
            <h1 className="mt-4 text-2xl font-bold text-white">Verification Failed</h1>
            <p className="mt-2 text-slate-400">{message}</p>
            <div className="mt-6 space-y-2">
              <Button
                onClick={() => navigate('/settings')}
                className="w-full"
              >
                Go to Settings
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="w-full"
              >
                Go to Login
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
