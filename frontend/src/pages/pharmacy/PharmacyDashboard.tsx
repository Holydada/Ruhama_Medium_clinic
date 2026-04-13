import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { pharmacyModuleSubnav } from '../../navigation/moduleSubnavItems';
import { formatTime } from '../../lib/utils';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientName: string;
  cardNumber: string;
  doctor: string;
  medications: number;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'normal' | 'urgent';
  orderedAt: string;
}

export const PharmacyDashboard = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [lowStockItems, setLowStockItems] = useState<Array<{ name: string; stock: number; reorderLevel: number }>>([]);
  const [todayDispensedCount, setTodayDispensedCount] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dispensingId, setDispensingId] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [queueResp, lowStockResp, allRxResp, dailyFinanceResp] = await Promise.all([
        api.get('/prescriptions/queue'),
        api.get('/pharmacy/stock/alerts'),
        api.get('/prescriptions', { params: { limit: 300 } }),
        api.get('/finance/reports/daily'),
      ]);
      const queueRows = queueResp.data?.data || [];
      const mappedQueue: Prescription[] = queueRows.map((r: any) => ({
        id: r.id,
        prescriptionNumber: r.prescriptionNumber || r.id,
        patientName: r.patient?.fullName || 'Unknown Patient',
        cardNumber: r.patient?.cardNumber || 'N/A',
        doctor: r.doctor?.fullName || 'Unknown Doctor',
        medications: r.items?.length || 0,
        status: r.status === 'DISPENSED' ? 'completed' : r.status === 'IN_PROGRESS' ? 'in-progress' : 'pending',
        priority: r.priority === 'URGENT' ? 'urgent' : 'normal',
        orderedAt: r.createdAt || new Date().toISOString(),
      }));
      setPrescriptions(mappedQueue);

      const lowRows = lowStockResp.data?.data || [];
      setLowStockItems(
        lowRows.map((s: any) => ({
          name: s.drugName || s.genericName || 'Unnamed Drug',
          stock: Number(s.quantityInStock || 0),
          reorderLevel: Number(s.reorderLevel || 1),
        }))
      );

      const allPrescriptions = allRxResp.data?.data?.prescriptions || [];
      const today = new Date().toISOString().slice(0, 10);
      const dispensedToday = allPrescriptions.filter((p: any) => {
        const date = String(p.dispensedAt || p.updatedAt || p.createdAt || '').slice(0, 10);
        return p.status === 'DISPENSED' && date === today;
      }).length;
      setTodayDispensedCount(dispensedToday);
      setTodayRevenue(Number(dailyFinanceResp.data?.data?.totalRevenue || 0));
    } catch (error) {
      console.error('Failed to load pharmacy dashboard', error);
      setPrescriptions([]);
      setLowStockItems([]);
      setTodayDispensedCount(0);
      setTodayRevenue(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const dispensePrescription = async (id: string) => {
    setDispensingId(id);
    try {
      await api.post(`/prescriptions/${id}/dispense`);
      await loadData();
      toast.success('Prescription dispensed successfully.');
    } catch (error) {
      console.error('Failed to dispense prescription', error);
      toast.error('Dispense failed. Please retry.');
    } finally {
      setDispensingId(null);
    }
  };

  const stats = useMemo(
    () => ({
      pendingPrescriptions: prescriptions.filter((p) => p.status !== 'completed').length,
      dispensedToday: todayDispensedCount,
      lowStock: lowStockItems.length,
      revenue: todayRevenue,
    }),
    [prescriptions, lowStockItems, todayDispensedCount, todayRevenue]
  );

  const getStatusBadge = (status: Prescription['status']) => {
    const variants = {
      pending: { variant: 'warning' as const, label: 'Pending' },
      'in-progress': { variant: 'info' as const, label: 'In Progress' },
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
            <h1 className="text-3xl font-bold text-slate-50">Pharmacy Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage prescriptions and inventory</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/pharmacy/stock')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Stock Management
            </Button>
            <Button variant="outline" size="sm" onClick={() => void loadData()} isLoading={isLoading}>
              Refresh
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/pharmacy/stock-entry')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Entry
            </Button>
          </div>
        </div>

        <ModuleSubnav items={pharmacyModuleSubnav} ariaLabel="Pharmacy sections" />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending</p>
                <p className="text-3xl font-bold text-amber-400 mt-1">{stats.pendingPrescriptions}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Dispensed Today</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">{stats.dispensedToday}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Low Stock Items</p>
                <p className="text-3xl font-bold text-red-400 mt-1">{stats.lowStock}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Revenue Today (Cash Desk)</p>
                <p className="text-3xl font-bold text-sky-400 mt-1">{stats.revenue} ETB</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prescription Queue */}
          <div className="lg:col-span-2">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Prescription Queue</CardTitle>
                <CardDescription>{prescriptions.length} prescriptions waiting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 transition-all"
                  >
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-sky-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-50">{prescription.patientName}</p>
                        <Badge variant="info" size="sm">{prescription.cardNumber}</Badge>
                        {prescription.priority === 'urgent' && (
                          <Badge variant="danger" size="sm">Urgent</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>📋 {prescription.prescriptionNumber}</span>
                        <span>👨‍⚕️ {prescription.doctor}</span>
                        <span>💊 {prescription.medications} items</span>
                        <span>🕐 {formatTime(prescription.orderedAt)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {getStatusBadge(prescription.status)}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => void dispensePrescription(prescription.id)}
                        isLoading={dispensingId === prescription.id}
                        disabled={prescription.status === 'completed'}
                      >
                        Dispense
                      </Button>
                    </div>
                  </div>
                ))}
                {prescriptions.length === 0 && (
                  <p className="text-sm text-slate-400">No prescription queue items right now.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Alert */}
          <div>
            <Card variant="elevated" className="border-2 border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Low Stock Alert
                </CardTitle>
                <CardDescription>Items below reorder level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {lowStockItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl border border-red-500/20 bg-red-500/5"
                  >
                    <p className="font-semibold text-slate-50 mb-2">{item.name}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Current Stock</span>
                      <span className="font-bold text-red-400">{item.stock}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Reorder Level</span>
                      <span className="text-slate-300">{item.reorderLevel}</span>
                    </div>
                    <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500"
                        style={{ width: `${Math.max(0, Math.min(100, (item.stock / Math.max(item.reorderLevel, 1)) * 100))}%` }}
                      />
                    </div>
                  </div>
                ))}
                <Button variant="danger" className="w-full" onClick={() => navigate('/pharmacy/inventory-alerts')}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Review alerts & reorder
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
