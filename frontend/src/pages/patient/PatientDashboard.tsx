import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../lib/api';
import { formatDate } from '../../lib/utils';
import { toast } from '../../lib/toast';

type VisitRow = {
  id: string;
  visitDate: string;
  status: string;
  serviceType: string;
  doctor: string | null;
};

export const PatientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{
    fullName: string;
    cardNumber: string;
    sex: string;
    dateOfBirth: string;
    phone: string | null;
    allergies: string | null;
    bloodType: string | null;
  } | null>(null);
  const [visits, setVisits] = useState<VisitRow[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const resp = await api.get('/patient-portal/dashboard');
      const d = resp.data?.data;
      setProfile(d?.profile ?? null);
      setVisits(d?.recentVisits ?? []);
    } catch {
      toast.error('Could not load your health record.');
      setProfile(null);
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">My care</h1>
            <p className="mt-1 text-slate-400">Your visits and clinic profile (read-only)</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void load()} isLoading={loading}>
            Refresh
          </Button>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Information on file at the clinic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            {!profile && !loading && <p className="text-slate-500">No profile loaded.</p>}
            {profile && (
              <dl className="grid gap-2 sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Name</dt>
                  <dd className="font-medium text-slate-100">{profile.fullName}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Card number</dt>
                  <dd className="font-mono text-slate-100">{profile.cardNumber}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Date of birth</dt>
                  <dd>{formatDate(profile.dateOfBirth)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Phone</dt>
                  <dd>{profile.phone || '—'}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Blood type</dt>
                  <dd>{profile.bloodType || '—'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Allergies</dt>
                  <dd>{profile.allergies || 'None recorded'}</dd>
                </div>
              </dl>
            )}
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Recent visits</CardTitle>
            <CardDescription>Latest activity at Ruhama Clinic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {visits.length === 0 && !loading && (
              <p className="text-sm text-slate-500">No visits on file yet.</p>
            )}
            {visits.map((v) => (
              <div
                key={v.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-100">{formatDate(v.visitDate)}</p>
                  <p className="text-xs text-slate-500">
                    {v.serviceType} · {v.doctor || 'Doctor TBD'}
                  </p>
                </div>
                <Badge variant="info" size="sm">
                  {String(v.status).replace(/_/g, ' ')}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
