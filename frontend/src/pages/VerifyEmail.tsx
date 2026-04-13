import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing.');
      return;
    }

    api
      .get(`/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(() => {
        setStatus('success');
        setMessage('Your email is verified. You can now login.');
      })
      .catch((error: any) => {
        setStatus('error');
        setMessage(error?.response?.data?.error || 'Verification failed. Please contact admin.');
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-50 mb-3">Email Verification</h1>
        <p
          className={`text-sm ${
            status === 'success'
              ? 'text-emerald-300'
              : status === 'error'
              ? 'text-red-300'
              : 'text-slate-300'
          }`}
        >
          {message}
        </p>
        <div className="mt-6">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

