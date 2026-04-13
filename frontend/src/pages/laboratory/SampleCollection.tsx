import { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { labModuleSubnav } from '../../navigation/moduleSubnavItems';

interface LabCollectionRow {
  id: string;
  orderNumber: string;
  patientName: string;
  cardNumber: string;
  tests: string;
  priority: 'ROUTINE' | 'URGENT' | 'STAT';
  status: 'PENDING' | 'SAMPLE_COLLECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';
  orderedAt: string;
}

export const SampleCollection = () => {
  const [orders, setOrders] = useState<LabCollectionRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadQueue = async () => {
    setIsLoading(true);
    try {
      const resp = await api.get('/lab/orders/queue');
      const rows = resp.data?.data || [];
      const mapped: LabCollectionRow[] = rows.map((row: any) => ({
        id: row.id,
        orderNumber: row.orderNumber || row.id,
        patientName: row.patient?.fullName || 'Unknown Patient',
        cardNumber: row.patient?.cardNumber || 'N/A',
        tests: (row.items || []).map((item: any) => item.testName).filter(Boolean).join(', ') || 'Lab Panel',
        priority: row.priority || 'ROUTINE',
        status: row.status || 'PENDING',
        orderedAt: row.orderedAt || row.createdAt || new Date().toISOString(),
      }));
      setOrders(mapped);
    } catch (_error) {
      toast.error('Failed to load sample collection queue.');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadQueue();
  }, []);

  const updateOrderStatus = async (orderId: string, status: 'SAMPLE_COLLECTED' | 'IN_PROGRESS') => {
    setActioningId(orderId);
    try {
      await api.patch(`/lab/orders/${orderId}/status`, { status });
      toast.success(status === 'SAMPLE_COLLECTED' ? 'Sample marked as collected.' : 'Sample moved to processing.');
      await loadQueue();
    } catch (_error) {
      toast.error('Failed to update sample status.');
    } finally {
      setActioningId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return orders;
    }
    return orders.filter(
      (order) =>
        order.patientName.toLowerCase().includes(q) ||
        order.cardNumber.toLowerCase().includes(q) ||
        order.orderNumber.toLowerCase().includes(q)
    );
  }, [orders, search]);

  const pending = filtered.filter((order) => order.status === 'PENDING');
  const collected = filtered.filter((order) => order.status === 'SAMPLE_COLLECTED');
  const inProgress = filtered.filter((order) => order.status === 'IN_PROGRESS');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sample Collection</h1>
          <p className="text-sm text-gray-600 mt-1">Collect and track laboratory samples from active orders.</p>
        </div>
        <Button variant="outline" onClick={() => void loadQueue()} isLoading={isLoading}>
          Refresh Queue
        </Button>
      </div>

      <ModuleSubnav items={labModuleSubnav} ariaLabel="Laboratory sections" />

      <Card className="p-4">
        <Input
          label="Search Orders"
          placeholder="Search by patient name, card number, or order number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Pending Sample Collection</p>
          <p className="text-3xl font-bold text-amber-600">{pending.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Collected (Awaiting Processing)</p>
          <p className="text-3xl font-bold text-sky-600">{collected.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">In Processing</p>
          <p className="text-3xl font-bold text-emerald-600">{inProgress.length}</p>
        </Card>
      </div>

      <Card className="p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Order</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Patient</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Tests</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Priority</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b last:border-b-0">
                <td className="py-3 px-2">
                  <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{new Date(order.orderedAt).toLocaleString()}</p>
                </td>
                <td className="py-3 px-2">
                  <p className="text-sm text-gray-900">{order.patientName}</p>
                  <p className="text-xs text-gray-500">{order.cardNumber}</p>
                </td>
                <td className="py-3 px-2 text-sm text-gray-700">{order.tests}</td>
                <td className="py-3 px-2">
                  <Badge variant={order.priority === 'STAT' ? 'danger' : order.priority === 'URGENT' ? 'warning' : 'default'}>
                    {order.priority}
                  </Badge>
                </td>
                <td className="py-3 px-2">
                  <Badge
                    variant={
                      order.status === 'PENDING'
                        ? 'warning'
                        : order.status === 'SAMPLE_COLLECTED'
                        ? 'info'
                        : order.status === 'IN_PROGRESS'
                        ? 'success'
                        : 'default'
                    }
                  >
                    {order.status === 'PENDING'
                      ? 'Pending'
                      : order.status === 'SAMPLE_COLLECTED'
                      ? 'Sample Collected'
                      : order.status === 'IN_PROGRESS'
                      ? 'In Progress'
                      : order.status}
                  </Badge>
                </td>
                <td className="py-3 px-2 text-right">
                  {order.status === 'PENDING' ? (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => void updateOrderStatus(order.id, 'SAMPLE_COLLECTED')}
                      isLoading={actioningId === order.id}
                    >
                      Collect Sample
                    </Button>
                  ) : order.status === 'SAMPLE_COLLECTED' ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => void updateOrderStatus(order.id, 'IN_PROGRESS')}
                      isLoading={actioningId === order.id}
                    >
                      Start Processing
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled>
                      No Action
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && !isLoading && (
          <div className="py-10 text-center text-sm text-gray-500">No lab orders found for sample collection.</div>
        )}
      </Card>
    </div>
  );
};

