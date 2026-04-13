import { Fragment, useEffect, useMemo, useState } from 'react';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { getStoredAuth } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

interface UltrasoundRow {
  id: string;
  orderNumber: string;
  patientName: string;
  cardNumber: string;
  type: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduledDate?: string;
}

export const UltrasoundDashboard = () => {
  const [rows, setRows] = useState<UltrasoundRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [artifactOrderId, setArtifactOrderId] = useState<string | null>(null);
  const [artifactName, setArtifactName] = useState('');
  const [artifactUrl, setArtifactUrl] = useState('');
  const [artifactsByOrder, setArtifactsByOrder] = useState<Record<string, Array<{ id: string; name: string; url: string; createdAt: string }>>>({});

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const resp = await api.get('/ultrasound', { params: { limit: 100 } });
      const orders = resp.data?.data?.orders || [];
      setRows(
        orders.map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber || order.id,
          patientName: order.patient?.fullName || 'Unknown',
          cardNumber: order.patient?.cardNumber || 'N/A',
          type: order.ultrasoundType || 'Ultrasound',
          status: order.status || 'SCHEDULED',
          scheduledDate: order.scheduledDate || undefined,
        }))
      );
    } catch (_error) {
      toast.error('Failed to load ultrasound queue.');
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const updateStatus = async (id: string, status: UltrasoundRow['status']) => {
    setActioningId(id);
    try {
      await api.patch(`/ultrasound/${id}/status`, { status });
      toast.success(`Order moved to ${status}.`);
      await loadOrders();
    } catch (_error) {
      toast.error('Failed to update ultrasound status.');
    } finally {
      setActioningId(null);
    }
  };

  const stats = useMemo(
    () => ({
      scheduled: rows.filter((r) => r.status === 'SCHEDULED').length,
      inProgress: rows.filter((r) => r.status === 'IN_PROGRESS').length,
      completed: rows.filter((r) => r.status === 'COMPLETED').length,
    }),
    [rows]
  );

  const ultrasoundSubnav = useMemo(() => {
    const r = (getStoredAuth()?.user?.role || '').toUpperCase();
    const items: Array<{ to: string; label: string }> = [{ to: '/ultrasound-dashboard', label: 'Overview' }];
    if (r === 'LAB_TECH' || r === 'SUPER_ADMIN') items.push({ to: '/lab-dashboard', label: 'Laboratory' });
    if (r === 'DOCTOR' || r === 'SUPER_ADMIN') items.push({ to: '/doctor-dashboard', label: 'Encounters' });
    items.push({ to: '/staff-chat', label: 'Staff chat' });
    return items;
  }, []);

  const loadArtifacts = async (orderId: string) => {
    try {
      const resp = await api.get(`/ultrasound/${orderId}/artifacts`);
      const rows = resp.data?.data || [];
      setArtifactsByOrder((prev) => ({
        ...prev,
        [orderId]: rows.map((r: any) => ({
          id: r.id,
          name: r.newValues?.name || 'Artifact',
          url: r.newValues?.url || '#',
          createdAt: r.createdAt,
        })),
      }));
    } catch (_error) {
      toast.error('Failed to load artifacts.');
    }
  };

  const addArtifact = async (orderId: string) => {
    if (!artifactName.trim() || !artifactUrl.trim()) {
      toast.info('Artifact name and URL are required.');
      return;
    }
    setActioningId(orderId);
    try {
      await api.post(`/ultrasound/${orderId}/artifacts`, {
        name: artifactName.trim(),
        url: artifactUrl.trim(),
        type: 'REPORT_LINK',
      });
      setArtifactName('');
      setArtifactUrl('');
      await loadArtifacts(orderId);
      toast.success('Ultrasound artifact linked.');
    } catch (_error) {
      toast.error('Failed to add artifact.');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ultrasound Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Manage ultrasound queue and completion workflow.</p>
        </div>
        <Button variant="outline" onClick={() => void loadOrders()} isLoading={isLoading}>
          Refresh
        </Button>
      </div>

      <ModuleSubnav items={ultrasoundSubnav} ariaLabel="Ultrasound navigation" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4"><p className="text-sm text-gray-600">Scheduled</p><p className="text-3xl font-bold text-amber-600">{stats.scheduled}</p></Card>
        <Card className="p-4"><p className="text-sm text-gray-600">In Progress</p><p className="text-3xl font-bold text-sky-600">{stats.inProgress}</p></Card>
        <Card className="p-4"><p className="text-sm text-gray-600">Completed</p><p className="text-3xl font-bold text-emerald-600">{stats.completed}</p></Card>
      </div>

      <Card className="p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 text-sm">Order #</th>
              <th className="text-left py-2 px-2 text-sm">Patient</th>
              <th className="text-left py-2 px-2 text-sm">Type</th>
              <th className="text-left py-2 px-2 text-sm">Schedule</th>
              <th className="text-left py-2 px-2 text-sm">Status</th>
              <th className="text-right py-2 px-2 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <Fragment key={row.id}>
              <tr className="border-b last:border-b-0">
                <td className="py-3 px-2 text-sm">{row.orderNumber}</td>
                <td className="py-3 px-2">
                  <p className="text-sm">{row.patientName}</p>
                  <p className="text-xs text-gray-500">{row.cardNumber}</p>
                </td>
                <td className="py-3 px-2 text-sm">{row.type}</td>
                <td className="py-3 px-2 text-sm">{row.scheduledDate ? new Date(row.scheduledDate).toLocaleString() : 'N/A'}</td>
                <td className="py-3 px-2">
                  <Badge variant={row.status === 'COMPLETED' ? 'success' : row.status === 'IN_PROGRESS' ? 'info' : 'warning'}>
                    {row.status}
                  </Badge>
                </td>
                <td className="py-3 px-2 text-right space-x-2">
                  {row.status === 'SCHEDULED' && (
                    <Button size="sm" variant="primary" onClick={() => void updateStatus(row.id, 'IN_PROGRESS')} isLoading={actioningId === row.id}>
                      Start
                    </Button>
                  )}
                  {row.status === 'IN_PROGRESS' && (
                    <Button size="sm" variant="success" onClick={() => void updateStatus(row.id, 'COMPLETED')} isLoading={actioningId === row.id}>
                      Complete
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      const next = artifactOrderId === row.id ? null : row.id;
                      setArtifactOrderId(next);
                      if (next) {
                        await loadArtifacts(row.id);
                      }
                    }}
                  >
                    Artifacts
                  </Button>
                </td>
              </tr>
            {artifactOrderId === row.id && (
              <tr>
                <td colSpan={6} className="bg-gray-50 py-3 px-2">
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input
                        value={artifactName}
                        onChange={(e) => setArtifactName(e.target.value)}
                        placeholder="Artifact name (e.g. Radiology report)"
                        className="rounded border border-gray-300 px-3 py-2 text-sm"
                      />
                      <input
                        value={artifactUrl}
                        onChange={(e) => setArtifactUrl(e.target.value)}
                        placeholder="https://... report link"
                        className="rounded border border-gray-300 px-3 py-2 text-sm"
                      />
                      <Button size="sm" variant="primary" onClick={() => void addArtifact(row.id)} isLoading={actioningId === row.id}>
                        Add Link
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {(artifactsByOrder[row.id] || []).map((a) => (
                        <div key={a.id} className="flex items-center justify-between rounded border border-gray-200 bg-white px-3 py-2">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{a.name}</p>
                            <p className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => window.open(a.url, '_blank')}>
                              View
                            </Button>
                            <a className="text-sm text-blue-600 hover:underline" href={a.url} target="_blank" rel="noreferrer">
                              Download
                            </a>
                          </div>
                        </div>
                      ))}
                      {(artifactsByOrder[row.id] || []).length === 0 && (
                        <p className="text-xs text-gray-500">No artifacts linked yet.</p>
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
        {rows.length === 0 && !isLoading && (
          <p className="py-8 text-center text-sm text-gray-600">No ultrasound orders available.</p>
        )}
      </Card>
    </div>
  );
};
