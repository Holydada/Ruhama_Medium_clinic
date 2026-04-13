import { Fragment, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { labModuleSubnav } from '../../navigation/moduleSubnavItems';
import { Table } from '../../components/ui/Table';
import { formatTime, formatDate } from '../../lib/utils';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

interface TestOrder {
  id: string;
  orderNumber: string;
  patientName: string;
  cardNumber: string;
  doctor: string;
  tests: string[];
  status: 'pending' | 'sample-collected' | 'in-progress' | 'completed' | 'verified';
  priority: 'routine' | 'urgent' | 'stat';
  orderedAt: string;
  sampleCollectedAt?: string;
  completedAt?: string;
  enteredResultCount: number;
  pendingResultCount: number;
}

export const LabDashboard = () => {
  const navigate = useNavigate();
  const [testOrders, setTestOrders] = useState<TestOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [artifactOrderId, setArtifactOrderId] = useState<string | null>(null);
  const [artifactName, setArtifactName] = useState('');
  const [artifactUrl, setArtifactUrl] = useState('');
  const [artifactsByOrder, setArtifactsByOrder] = useState<Record<string, Array<{ id: string; name: string; url: string; createdAt: string }>>>({});

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [queueSearch, setQueueSearch] = useState('');

  const loadLabQueue = async () => {
    setIsLoading(true);
    try {
      const resp = await api.get('/lab/orders');
      const rows = resp.data?.data || [];
      const mapped: TestOrder[] = rows.map((r: any) => ({
        id: r.id,
        orderNumber: r.orderNumber || r.id,
        patientName: r.patient?.fullName || 'Unknown',
        cardNumber: r.patient?.cardNumber || 'N/A',
        doctor: r.orderedBy?.fullName || 'Unknown Doctor',
        tests: (r.items || []).map((it: any) => it.testName).filter(Boolean),
        status:
          r.status === 'PENDING' ? 'pending' :
          r.status === 'SAMPLE_COLLECTED' ? 'sample-collected' :
          r.status === 'IN_PROGRESS' ? 'in-progress' :
          r.status === 'COMPLETED' ? 'completed' : 'verified',
        priority:
          r.urgency === 'STAT' ? 'stat' :
          r.urgency === 'URGENT' ? 'urgent' : 'routine',
        orderedAt: r.orderedAt || r.createdAt || new Date().toISOString(),
        enteredResultCount: Number(r.enteredResultCount) || 0,
        pendingResultCount: Number(r.pendingResultCount) || 0,
      }));
      setTestOrders(mapped);
    } catch (error) {
      console.error('Failed to load lab queue', error);
      setTestOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadLabQueue();
  }, []);

  const updateLabStatus = async (orderId: string, status: string) => {
    setActioningId(orderId);
    try {
      await api.patch(`/lab/orders/${orderId}/status`, { status });
      await loadLabQueue();
      toast.success(`Order moved to ${status}.`);
    } catch (error) {
      console.error('Failed to update lab status', error);
      toast.error('Failed to update lab order status.');
    } finally {
      setActioningId(null);
    }
  };

  const verifyLabOrder = async (orderId: string) => {
    setActioningId(orderId);
    try {
      await api.post(`/lab/orders/${orderId}/verify`);
      await loadLabQueue();
      toast.success('Results released to the doctor (order verified).');
    } catch (error) {
      console.error('Failed to verify lab order', error);
      const msg = isAxiosError(error) ? (error.response?.data as { error?: string })?.error : undefined;
      toast.error(typeof msg === 'string' ? msg : 'Failed to verify lab order.');
    } finally {
      setActioningId(null);
    }
  };

  const stats = useMemo(() => ({
    pendingTests: testOrders.filter((o) => o.status === 'pending').length,
    inProgress: testOrders.filter((o) => o.status === 'in-progress' || o.status === 'sample-collected').length,
    completedToday: testOrders.filter((o) => o.status === 'completed' || o.status === 'verified').length,
    criticalResults: 0,
  }), [testOrders]);

  const getStatusBadge = (status: TestOrder['status']) => {
    const variants = {
      pending: { variant: 'warning' as const, label: 'Pending Sample', icon: '⏳' },
      'sample-collected': { variant: 'info' as const, label: 'Sample Collected', icon: '🧪' },
      'in-progress': { variant: 'info' as const, label: 'In Progress', icon: '🔬' },
      completed: { variant: 'success' as const, label: 'Completed', icon: '✓' },
      verified: { variant: 'success' as const, label: 'Verified', icon: '✓✓' },
    };
    const { variant, label, icon } = variants[status];
    return (
      <Badge variant={variant}>
        <span>{icon}</span>
        {label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: TestOrder['priority']) => {
    const variants = {
      routine: { variant: 'gray' as const, label: 'Routine' },
      urgent: { variant: 'warning' as const, label: 'Urgent' },
      stat: { variant: 'error' as const, label: 'STAT' },
    };
    const { variant, label } = variants[priority];
    return <Badge variant={variant} size="sm">{label}</Badge>;
  };

  const filteredOrders = testOrders.filter((order) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return order.status === 'pending';
    if (activeTab === 'in-progress') return order.status === 'in-progress' || order.status === 'sample-collected';
    if (activeTab === 'completed') return order.status === 'completed' || order.status === 'verified';
    return true;
  });

  const displayedOrders = useMemo(() => {
    const q = queueSearch.trim().toLowerCase();
    if (!q) return filteredOrders;
    return filteredOrders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.patientName.toLowerCase().includes(q) ||
        o.cardNumber.toLowerCase().includes(q) ||
        o.doctor.toLowerCase().includes(q) ||
        o.tests.some((t) => t.toLowerCase().includes(q))
    );
  }, [filteredOrders, queueSearch]);

  const loadArtifacts = async (orderId: string) => {
    try {
      const resp = await api.get(`/lab/orders/${orderId}/artifacts`);
      const rows = resp.data?.data || [];
      setArtifactsByOrder((prev) => ({
        ...prev,
        [orderId]: rows.map((r: any) => {
          const nv = r.newValues as { name?: string; url?: string } | null | undefined;
          return {
            id: r.id,
            name: nv?.name || 'Artifact',
            url: nv?.url || '#',
            createdAt: r.createdAt,
          };
        }),
      }));
    } catch (error) {
      console.error('Failed to load lab artifacts', error);
      toast.error('Failed to load lab artifacts.');
    }
  };

  const addArtifact = async (orderId: string) => {
    if (!artifactName.trim() || !artifactUrl.trim()) {
      toast.info('Artifact name and URL are required.');
      return;
    }
    setActioningId(orderId);
    try {
      await api.post(`/lab/orders/${orderId}/artifacts`, {
        name: artifactName.trim(),
        url: artifactUrl.trim(),
        type: 'RESULT_LINK',
      });
      setArtifactName('');
      setArtifactUrl('');
      await loadArtifacts(orderId);
      toast.success('Lab artifact linked.');
    } catch (error) {
      console.error('Failed to add lab artifact', error);
      toast.error('Failed to add lab artifact.');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Laboratory Dashboard</h1>
            <p className="text-slate-400 mt-1">
              {formatDate(new Date())} • {formatTime(new Date())}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void loadLabQueue()}
              isLoading={isLoading}
            >
              Refresh queue
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => navigate('/lab/verification')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Verification
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => navigate('/lab/catalog')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Catalog
            </Button>
          </div>
        </div>

        <ModuleSubnav items={labModuleSubnav} ariaLabel="Laboratory sections" />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending Tests</p>
                <p className="text-3xl font-bold text-amber-400 mt-1">{stats.pendingTests}</p>
                <p className="text-xs text-slate-500 mt-1">Awaiting sample</p>
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
                <p className="text-sm text-slate-400">In Progress</p>
                <p className="text-3xl font-bold text-sky-400 mt-1">{stats.inProgress}</p>
                <p className="text-xs text-slate-500 mt-1">Being processed</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Completed Today</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">{stats.completedToday}</p>
                <p className="text-xs text-slate-500 mt-1">Results ready</p>
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
                <p className="text-sm text-slate-400">Critical Results</p>
                <p className="text-3xl font-bold text-red-400 mt-1">{stats.criticalResults}</p>
                <p className="text-xs text-slate-500 mt-1">Needs attention</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center animate-pulse">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common laboratory tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="primary"
                className="h-24 flex-col"
                type="button"
                onClick={() => navigate('/lab/samples')}
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="mt-2">Collect sample</span>
              </Button>

              <Button variant="secondary" className="h-24 flex-col" type="button" onClick={() => navigate('/lab/test-queue')}>
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="mt-2">Enter results</span>
              </Button>

              <Button variant="secondary" className="h-24 flex-col" type="button" onClick={() => navigate('/lab/verification')}>
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="mt-2">Verification</span>
              </Button>

              <Button variant="secondary" className="h-24 flex-col" type="button" onClick={() => navigate('/lab/catalog')}>
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <span className="mt-2">Test catalog</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Orders Queue */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Test Orders Queue</CardTitle>
                <CardDescription>Manage laboratory test orders</CardDescription>
              </div>
              <label className="sr-only" htmlFor="lab-queue-search">
                Search orders
              </label>
              <input
                id="lab-queue-search"
                type="search"
                value={queueSearch}
                onChange={(e) => setQueueSearch(e.target.value)}
                placeholder="Search by patient, card, order #, test…"
                autoComplete="off"
                className="min-w-[200px] max-w-md px-4 py-2 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none text-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800" role="tablist" aria-label="Order filters">
              {[
                { id: 'all', label: 'All Orders', count: testOrders.length },
                { id: 'pending', label: 'Pending', count: testOrders.filter(o => o.status === 'pending').length },
                { id: 'in-progress', label: 'In Progress', count: testOrders.filter(o => o.status === 'in-progress' || o.status === 'sample-collected').length },
                { id: 'completed', label: 'Completed', count: testOrders.filter(o => o.status === 'completed' || o.status === 'verified').length },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 min-h-[44px] ${
                    activeTab === tab.id
                      ? 'border-sky-500 text-sky-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Order #</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Patient</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Tests</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Doctor</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Priority</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Ordered</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedOrders.map((order) => (
                    <Fragment key={order.id}>
                    <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-mono text-sky-400">{order.orderNumber}</span>
                          <span className="text-xs text-slate-500">{order.cardNumber}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-semibold">
                            {order.patientName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm text-slate-200 font-medium">{order.patientName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          {order.tests.map((test, idx) => (
                            <span key={idx} className="text-xs text-slate-300">• {test}</span>
                          ))}
                          {(order.enteredResultCount > 0 || order.pendingResultCount > 0) && (
                            <span className="text-[11px] text-slate-500 mt-1">
                              Results: {order.enteredResultCount} entered
                              {order.pendingResultCount > 0 ? ` · ${order.pendingResultCount} pending` : ''}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-300">{order.doctor}</td>
                      <td className="py-4 px-4">{getPriorityBadge(order.priority)}</td>
                      <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-4 px-4 text-sm text-slate-400">{formatTime(order.orderedAt)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {order.status === 'pending' && (
                            <Button
                              type="button"
                              variant="primary"
                              size="sm"
                              onClick={() => void updateLabStatus(order.id, 'SAMPLE_COLLECTED')}
                              isLoading={actioningId === order.id}
                            >
                              Collect Sample
                            </Button>
                          )}
                          {order.status === 'sample-collected' && (
                            <Button
                              type="button"
                              variant="primary"
                              size="sm"
                              onClick={() => void updateLabStatus(order.id, 'IN_PROGRESS')}
                              isLoading={actioningId === order.id}
                            >
                              Start Processing
                            </Button>
                          )}
                          {(order.status === 'pending' || order.status === 'sample-collected' || order.status === 'in-progress') && (
                            <Button
                              type="button"
                              variant="primary"
                              size="sm"
                              onClick={() => navigate(`/lab/orders/${order.id}/results`)}
                            >
                              Enter results
                            </Button>
                          )}
                          {order.enteredResultCount > 0 && order.status !== 'verified' && (
                            <Button
                              type="button"
                              variant="success"
                              size="sm"
                              onClick={() => void verifyLabOrder(order.id)}
                              isLoading={actioningId === order.id}
                              title="Release entered results to the doctor (partial results allowed)"
                            >
                              Release to doctor
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            aria-label="Open test queue and result entry"
                            title="Open test queue"
                            onClick={() => navigate('/lab/test-queue')}
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              const next = artifactOrderId === order.id ? null : order.id;
                              setArtifactOrderId(next);
                              if (next) {
                                await loadArtifacts(order.id);
                              }
                            }}
                          >
                            Artifacts
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {artifactOrderId === order.id && (
                      <tr>
                        <td colSpan={8} className="bg-slate-900/30 px-4 py-3">
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <label className="sr-only" htmlFor={`artifact-name-${order.id}`}>
                                Artifact name
                              </label>
                              <input
                                id={`artifact-name-${order.id}`}
                                value={artifactName}
                                onChange={(e) => setArtifactName(e.target.value)}
                                placeholder="Artifact name (e.g. Microscopy image)"
                                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400"
                              />
                              <label className="sr-only" htmlFor={`artifact-url-${order.id}`}>
                                Artifact URL
                              </label>
                              <input
                                id={`artifact-url-${order.id}`}
                                value={artifactUrl}
                                onChange={(e) => setArtifactUrl(e.target.value)}
                                placeholder="https://... artifact link"
                                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400"
                              />
                              <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                onClick={() => void addArtifact(order.id)}
                                isLoading={actioningId === order.id}
                              >
                                Add Link
                              </Button>
                            </div>
                            <div className="space-y-1">
                              {(artifactsByOrder[order.id] || []).map((a) => (
                                <div key={a.id} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
                                  <div>
                                    <p className="text-sm font-medium text-slate-100">{a.name}</p>
                                    <p className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleString()}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => window.open(a.url, '_blank', 'noopener,noreferrer')}
                                    >
                                      View
                                    </Button>
                                    <a className="text-xs text-sky-400 hover:underline" href={a.url} target="_blank" rel="noreferrer">
                                      Download
                                    </a>
                                  </div>
                                </div>
                              ))}
                              {(artifactsByOrder[order.id] || []).length === 0 && (
                                <p className="text-xs text-slate-500">No artifacts linked yet.</p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {displayedOrders.length === 0 && (
              <div className="text-center py-12">
                <svg className="h-16 w-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-slate-400">No test orders found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Equipment Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Equipment Status</CardTitle>
              <CardDescription>Laboratory equipment monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Hematology Analyzer', status: 'operational', lastMaintenance: '2 days ago' },
                  { name: 'Chemistry Analyzer', status: 'operational', lastMaintenance: '5 days ago' },
                  { name: 'Microscope #1', status: 'operational', lastMaintenance: '1 week ago' },
                  { name: 'Centrifuge', status: 'maintenance', lastMaintenance: 'Today' },
                ].map((equipment, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${equipment.status === 'operational' ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                      <div>
                        <p className="text-sm font-medium text-slate-200">{equipment.name}</p>
                        <p className="text-xs text-slate-500">Last maintenance: {equipment.lastMaintenance}</p>
                      </div>
                    </div>
                    <Badge variant={equipment.status === 'operational' ? 'success' : 'warning'} size="sm">
                      {equipment.status === 'operational' ? 'Operational' : 'Maintenance'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Quality Control</CardTitle>
              <CardDescription>Today's QC status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { test: 'Hematology QC', status: 'passed', time: '08:00 AM' },
                  { test: 'Chemistry QC', status: 'passed', time: '08:15 AM' },
                  { test: 'Glucose QC', status: 'passed', time: '08:30 AM' },
                  { test: 'Lipid Panel QC', status: 'pending', time: 'Not run' },
                ].map((qc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{qc.test}</p>
                      <p className="text-xs text-slate-500">{qc.time}</p>
                    </div>
                    <Badge variant={qc.status === 'passed' ? 'success' : 'warning'} size="sm">
                      {qc.status === 'passed' ? '✓ Passed' : '⏳ Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};