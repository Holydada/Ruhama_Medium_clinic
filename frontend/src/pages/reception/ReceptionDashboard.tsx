import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { receptionModuleSubnav } from '../../navigation/moduleSubnavItems';
import { formatTime, formatDate, formatCurrency } from '../../lib/utils';
import { api } from '../../lib/api';

interface QueuePatient {
  id: string;
  cardNumber: string;
  fullName: string;
  doctor: string;
  status: 'waiting' | 'in-consultation' | 'completed';
  checkInTime: string;
}

export const ReceptionDashboard = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<QueuePatient[]>([]);
  const [loading, setLoading] = useState(false);
  const [todayRevenueEtb, setTodayRevenueEtb] = useState<number | null>(null);

  const stats = useMemo(() => {
    const waiting = queue.filter((q) => q.status === 'waiting').length;
    const inConsultation = queue.filter((q) => q.status === 'in-consultation').length;
    const completed = queue.filter((q) => q.status === 'completed').length;
    return {
      todayPatients: queue.length,
      waiting,
      completed,
      revenue: todayRevenueEtb ?? 0,
      inConsultation,
    };
  }, [queue, todayRevenueEtb]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [resp, dailyResp] = await Promise.all([
        api.get('/visits', {
          params: {
            date: new Date().toISOString().slice(0, 10),
            limit: 200,
          },
        }),
        api.get('/finance/reports/daily').catch(() => ({ data: {} })),
      ]);
      const rev = Number(dailyResp.data?.data?.totalRevenue);
      setTodayRevenueEtb(Number.isFinite(rev) ? rev : 0);
      const visits = resp.data?.data?.visits || [];
      const mapped: QueuePatient[] = visits.map((visit: any) => ({
        id: visit.id,
        cardNumber: visit.patient?.cardNumber || '-',
        fullName: visit.patient?.fullName || 'Unknown',
        doctor: visit.assignedDoctor?.fullName || 'Unassigned',
        status:
          visit.status === 'COMPLETED'
            ? 'completed'
            : visit.status === 'IN_CONSULTATION'
            ? 'in-consultation'
            : 'waiting',
        checkInTime: visit.visitDate,
      }));
      setQueue(mapped);
    } catch (error) {
      console.error('Failed to load reception dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const getStatusBadge = (status: QueuePatient['status']) => {
    const variants = {
      waiting: { variant: 'warning' as const, label: 'Waiting' },
      'in-consultation': { variant: 'info' as const, label: 'In Consultation' },
      completed: { variant: 'success' as const, label: 'Completed' },
    };
    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Reception Dashboard</h1>
            <p className="text-slate-400 mt-1">
              {formatDate(new Date())} • {formatTime(new Date())}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => void loadDashboard()} isLoading={loading}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m14.836 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-14.837-2m14.837 2H15" />
              </svg>
              Refresh
            </Button>
          </div>
        </div>

        <ModuleSubnav items={receptionModuleSubnav} ariaLabel="Reception workflow" />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Today's Patients</p>
                <p className="text-3xl font-bold text-slate-50 mt-1">{stats.todayPatients}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Revenue Today</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">{formatCurrency(stats.revenue)}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Waiting</p>
                <p className="text-3xl font-bold text-amber-400 mt-1">{stats.waiting}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Completed</p>
                <p className="text-3xl font-bold text-slate-50 mt-1">{stats.completed}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-slate-700/50 flex items-center justify-center">
                <svg className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common reception tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <Button 
                variant="primary" 
                className="h-24 flex-col"
                onClick={() => navigate('/reception/new-patient')}
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="mt-2">New Patient</span>
              </Button>

              <Button 
                variant="secondary" 
                className="h-24 flex-col"
                onClick={() => navigate('/reception/repeat-visit')}
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="mt-2">Repeat Visit</span>
              </Button>

              <Button 
                variant="secondary" 
                className="h-24 flex-col"
                onClick={() => navigate('/reception/doctor-assignment')}
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="mt-2">Assign Doctor</span>
              </Button>

              <Button 
                variant="secondary" 
                className="h-24 flex-col"
                onClick={() => navigate('/reception/payment')}
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="mt-2">Payment</span>
              </Button>

              <Button
                variant="secondary"
                className="h-24 flex-col"
                onClick={() => navigate('/reception/ultrasound')}
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <span className="mt-2">Ultrasound</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>More reception tools</CardTitle>
            <CardDescription>Queue operations, services, and scheduling</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <Button variant="secondary" className="h-14 justify-center" onClick={() => navigate('/reception/patients')}>
                Patient management
              </Button>
              <Button variant="secondary" className="h-14 justify-center" onClick={() => navigate('/reception/queue')}>
                Queue management
              </Button>
              <Button variant="secondary" className="h-14 justify-center" onClick={() => navigate('/reception/services')}>
                Service selection
              </Button>
              <Button
                variant="secondary"
                className="h-14 justify-center"
                onClick={() => navigate('/reception/appointments')}
              >
                Appointments
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Queue */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Today's Patient Queue</CardTitle>
            <CardDescription>Real-time patient flow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Card #</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Patient Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Doctor</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Check-in Time</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((patient) => (
                    <tr key={patient.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4 text-sm font-mono text-sky-400">{patient.cardNumber}</td>
                      <td className="py-4 px-4 text-sm text-slate-200 font-medium">{patient.fullName}</td>
                      <td className="py-4 px-4 text-sm text-slate-300">{patient.doctor}</td>
                      <td className="py-4 px-4 text-sm text-slate-400">{formatTime(patient.checkInTime)}</td>
                      <td className="py-4 px-4">{getStatusBadge(patient.status)}</td>
                      <td className="py-4 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate('/reception/doctor-assignment', { state: { visitId: patient.id } })
                          }
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
