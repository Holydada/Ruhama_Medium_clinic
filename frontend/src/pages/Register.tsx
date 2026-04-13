import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';
import { AuthMarketingBackdrop } from '../components/brand/AuthMarketingBackdrop';
import { ClinicBrandLockup } from '../components/brand/ClinicBrandLockup';

const cardShell =
  'border border-white/20 bg-white/[0.97] shadow-[0_25px_80px_-12px_rgba(15,23,42,0.45)] backdrop-blur-xl ring-1 ring-white/15';

export function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleMapping: Record<string, string> = {
    doctor: 'DOCTOR',
    nurse: 'NURSE',
    receptionist: 'RECEPTIONIST',
    pharmacist: 'PHARMACIST',
    lab_technician: 'LAB_TECH',
    finance: 'FINANCE',
    emergency: 'EMERGENCY',
    injection_room: 'INJECTION_ROOM',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.phone || !formData.role || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: roleMapping[formData.role],
        department: formData.department || undefined,
        password: formData.password,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Failed to submit registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sidePanel = (
    <div className="flex h-full min-h-[22rem] flex-col justify-between gap-10">
      <div className="space-y-8">
        <ClinicBrandLockup href="/" size="lg" theme="dark" darkSurface="glass" subtitleOn="always" />
        <div className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight text-white">Join the care team</h2>
          <p className="max-w-sm text-sm leading-relaxed text-slate-300">
            Register your professional account for review. An administrator approves access; you will receive email
            updates at each step.
          </p>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        © {new Date().getFullYear()} Ruhama Metekiya Medium Clinic
      </p>
    </div>
  );

  if (success) {
    return (
      <AuthMarketingBackdrop showSidePanel sidePanel={sidePanel}>
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex justify-center lg:justify-start lg:hidden">
            <ClinicBrandLockup href="/" size="md" theme="dark" subtitleOn="always" />
          </div>
          <Card className={`w-full p-8 text-center ${cardShell}`}>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-400/30">
              <CheckCircle className="h-9 w-9 text-emerald-600" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Registration submitted</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Your registration has been submitted for approval. If email is configured on the server, you may
              receive a confirmation message; the administrator will also be notified. After approval, you can sign
              in with your email and password.
            </p>
            <div className="mt-8">
              <Link to="/login" className="block">
                <Button className="w-full" size="lg">
                  Return to sign in
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </AuthMarketingBackdrop>
    );
  }

  return (
    <AuthMarketingBackdrop showSidePanel sidePanel={sidePanel}>
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 flex justify-center lg:hidden">
          <ClinicBrandLockup href="/" size="md" theme="dark" subtitleOn="always" />
        </div>

        <Card className={`w-full p-6 sm:p-10 ${cardShell}`}>
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Staff registration</h1>
            <p className="mt-2 text-slate-600">Create your account — access is granted after administrator approval.</p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200/80 bg-red-50/95 p-4 text-red-900 shadow-sm">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <span className="text-sm leading-snug">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Full name *</label>
                <Input
                  variant="light"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email *</label>
                <Input
                  variant="light"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Phone *</label>
                <Input
                  variant="light"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+251 XXX XXX XXX"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Role *</label>
                <Select
                  variant="light"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  options={[
                    { value: '', label: 'Select role' },
                    { value: 'doctor', label: 'Doctor' },
                    { value: 'nurse', label: 'Nurse' },
                    { value: 'receptionist', label: 'Receptionist' },
                    { value: 'pharmacist', label: 'Pharmacist' },
                    { value: 'lab_technician', label: 'Lab technician' },
                    { value: 'finance', label: 'Finance officer' },
                    { value: 'emergency', label: 'Emergency' },
                    { value: 'injection_room', label: 'Injection room' },
                  ]}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
                <Input
                  variant="light"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. General medicine"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Password *</label>
                <Input
                  variant="light"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Confirm password *</label>
                <Input
                  variant="light"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter your password"
                />
              </div>
            </div>

            <div className="rounded-xl border border-sky-200/80 bg-gradient-to-br from-sky-50 to-indigo-50/80 p-4 text-sm text-sky-950 shadow-sm">
              <strong className="font-semibold text-sky-900">Note:</strong>{' '}
              <span className="text-sky-900/90">
                Your account stays pending until an administrator approves it. You will be notified when it is
                activated.
              </span>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit registration'}
            </Button>

            <div className="space-y-2 text-center">
              <Link to="/login" className="text-sm font-medium text-sky-700 hover:text-sky-800">
                Already have an account? Sign in
              </Link>
              <p className="text-sm text-slate-600">
                Patient with a clinic card?{' '}
                <Link to="/register-patient" className="font-medium text-sky-700 hover:text-sky-800">
                  Link your portal account
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </AuthMarketingBackdrop>
  );
}
