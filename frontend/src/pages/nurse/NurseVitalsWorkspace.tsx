import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { VitalsEntry } from './VitalsEntry';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { nurseModuleSubnav } from '../../navigation/moduleSubnavItems';

function ageFromDob(dob?: string | null): number {
  if (!dob) return 0;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return 0;
  const diff = Date.now() - d.getTime();
  return Math.max(0, Math.floor(diff / (365.25 * 24 * 3600 * 1000)));
}

export const NurseVitalsWorkspace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const presetVisitId = (location.state as { visitId?: string } | null)?.visitId;
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(presetVisitId || '');

  const load = async () => {
    setLoading(true);
    try {
      const resp = await api.get('/visits', {
        params: {
          date: new Date().toISOString().slice(0, 10),
          limit: 150,
        },
      });
      const rows = resp.data?.data?.visits || [];
      setVisits(rows.filter((v: any) => v.status !== 'COMPLETED'));
    } catch {
      toast.error('Failed to load visits.');
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (presetVisitId && visits.some((v) => v.id === presetVisitId)) {
      setSelectedId(presetVisitId);
    }
  }, [presetVisitId, visits]);

  const selected = visits.find((v) => v.id === selectedId);
  const patientPayload = useMemo(() => {
    if (!selected?.patient) return null;
    const p = selected.patient;
    return {
      id: p.id,
      cardNumber: p.cardNumber || '-',
      fullName: p.fullName || 'Unknown',
      age: ageFromDob(p.dateOfBirth),
      gender: p.sex === 'FEMALE' ? 'Female' : p.sex === 'MALE' ? 'Male' : '—',
    };
  }, [selected]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" onClick={() => navigate('/nurse-dashboard')}>
            Back
          </Button>
          <Button variant="outline" size="sm" onClick={() => void load()} isLoading={loading}>
            Refresh visits
          </Button>
        </div>

        <ModuleSubnav items={nurseModuleSubnav} ariaLabel="Nursing navigation" />

        <Card className="p-4 border border-slate-800 bg-slate-900/40">
          <label className="text-sm font-medium text-slate-300">Active visit</label>
          <select
            className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-50 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">Select visit…</option>
            {visits.map((v) => (
              <option key={v.id} value={v.id}>
                {v.patient?.cardNumber || '—'} — {v.patient?.fullName || 'Patient'} ({v.serviceType} · {v.status})
              </option>
            ))}
          </select>
          {visits.length === 0 && !loading && (
            <p className="mt-2 text-sm text-slate-500">No open visits for today.</p>
          )}
        </Card>

        {patientPayload && selectedId && (
          <VitalsEntry
            key={selectedId}
            visitId={selectedId}
            patient={patientPayload}
            onCancel={() => navigate('/nurse-dashboard')}
            onAfterSuccess={() => {
              setSelectedId('');
              void load();
            }}
          />
        )}
      </div>
    </div>
  );
};
