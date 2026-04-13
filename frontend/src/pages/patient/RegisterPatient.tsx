import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { toast } from '../../lib/toast';
import { ClinicBrandLockup } from '../../components/brand/ClinicBrandLockup';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  cardNumber: z.string().min(3),
  dateOfBirth: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export const RegisterPatient = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await api.post('/auth/register-patient', values);
      toast.success('Account created. Sign in with your email.');
      navigate('/login');
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Registration failed. Check your card number and details.';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto mb-8 flex max-w-md justify-center">
        <ClinicBrandLockup href="/" size="sm" theme="dark" showSubtitle={false} />
      </div>
      <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white">Patient portal signup</h1>
        <p className="mt-2 text-sm text-slate-400">
          Link your clinic card to a secure account. You must already be registered as a patient at reception.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-300">Full name (as on card)</label>
            <input
              {...register('fullName')}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
              autoComplete="name"
            />
            {errors.fullName && <p className="mt-1 text-xs text-rose-400">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Clinic card number</label>
            <input
              {...register('cardNumber')}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-gray-900"
              placeholder="e.g. RH-2025-00001"
              autoComplete="off"
            />
            {errors.cardNumber && <p className="mt-1 text-xs text-rose-400">{errors.cardNumber.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Date of birth</label>
            <input
              {...register('dateOfBirth')}
              type="date"
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
            />
            {errors.dateOfBirth && <p className="mt-1 text-xs text-rose-400">{errors.dateOfBirth.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input
              {...register('email')}
              type="email"
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
              autoComplete="email"
            />
            {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input
              {...register('password')}
              type="password"
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
              autoComplete="new-password"
            />
            {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>}
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
            Create portal account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/login" className="text-sky-400 hover:underline">
            Back to sign in
          </Link>
          {' · '}
          <Link to="/register" className="text-sky-400 hover:underline">
            Staff registration
          </Link>
        </p>
      </div>
    </div>
  );
};
