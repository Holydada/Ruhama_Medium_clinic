import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Activity, MapPin } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { nurseModuleSubnav } from '../../navigation/moduleSubnavItems';

interface VisitRow {
  id: string;
  fullName: string;
  cardNumber: string;
  serviceType: string;
  status: string;
  doctor: string;
  visitDate: string;
}

export const PatientMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [loading, setLoading] = useState(false);

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
      const mapped: VisitRow[] = rows
        .filter((v: any) => v.status !== 'COMPLETED')
        .map((v: any) => ({
          id: v.id,
          fullName: v.patient?.fullName || 'Unknown',
          cardNumber: v.patient?.cardNumber || '—',
          serviceType: v.serviceType || 'OPD',
          status: v.status || 'REGISTERED',
          doctor: v.assignedDoctor?.fullName || 'Unassigned',
          visitDate: v.visitDate,
        }));
      setVisits(mapped);
    } catch {
      toast.error('Failed to load visits for monitoring.');
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const stats = useMemo(() => {
    const waiting = visits.filter((v) => v.status === 'REGISTERED' || v.status === 'IN_QUEUE').length;
    const inCare = visits.filter((v) => v.status === 'IN_CONSULTATION').length;
    const emergency = visits.filter((v) => v.serviceType === 'EMERGENCY').length;
    return { total: visits.length, waiting, inCare, emergency };
  }, [visits]);

  const statusBadge = (status: string) => {
    if (status === 'IN_CONSULTATION') return <Badge variant="info">In consultation</Badge>;
    if (status === 'IN_QUEUE') return <Badge variant="warning">In queue</Badge>;
    return <Badge variant="default">Registered</Badge>;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient monitoring</h1>
          <p className="text-gray-600 mt-1">Today&apos;s open visits — use Vitals to record measurements (audit trail).</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void load()} isLoading={loading}>
          Refresh
        </Button>
      </div>

      <ModuleSubnav items={nurseModuleSubnav} ariaLabel="Nursing navigation" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Active visits</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Waiting / queued</p>
          <p className="text-2xl font-bold text-amber-600">{stats.waiting}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">In consultation</p>
          <p className="text-2xl font-bold text-sky-600">{stats.inCare}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Emergency (today)</p>
          <p className="text-2xl font-bold text-red-600">{stats.emergency}</p>
        </Card>
      </div>

      <div className="space-y-3">
        {visits.map((v) => (
          <Card key={v.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-sky-100 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{v.fullName}</h3>
                  <p className="text-sm text-gray-600 font-mono">{v.cardNumber}</p>
                  <p className="text-sm text-gray-700 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {v.serviceType} · {v.doctor}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Vitals are not summarized here — record them under Vitals to store an auditable entry.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {statusBadge(v.status)}
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate('/nurse/vitals', { state: { visitId: v.id } })}
                >
                  Record vitals
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {visits.length === 0 && !loading && (
        <p className="text-center text-sm text-gray-600 py-10">No open visits for today.</p>
      )}
    </div>
  );
};
