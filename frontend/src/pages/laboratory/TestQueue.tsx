import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Search, Clock, AlertCircle, CheckCircle, User } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { labModuleSubnav } from '../../navigation/moduleSubnavItems';

interface TestOrder {
  id: string;
  orderNumber: string;
  patientName: string;
  cardNumber: string;
  age: number;
  gender: string;
  tests: string[];
  priority: 'routine' | 'urgent' | 'stat';
  orderedBy: string;
  orderDate: string;
  orderTime: string;
  status: 'pending' | 'collected' | 'processing' | 'completed';
  sampleType: string;
  waitTime: number;
}

export const TestQueue: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [orders, setOrders] = useState<TestOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const loadQueue = async () => {
    setIsLoading(true);
    try {
      const resp = await api.get('/lab/orders/queue');
      const rows = resp.data?.data || [];
      const mapped: TestOrder[] = rows.map((row: any) => {
        const orderedAt = row.orderedAt || row.createdAt || new Date().toISOString();
        const diffMins = Math.max(1, Math.floor((Date.now() - new Date(orderedAt).getTime()) / 60000));
        return {
          id: row.id,
          orderNumber: row.orderNumber || row.id,
          patientName: row.patient?.fullName || 'Unknown',
          cardNumber: row.patient?.cardNumber || '-',
          age: 0,
          gender: row.patient?.sex || '-',
          tests: (row.items || []).map((i: any) => i.testName).filter(Boolean),
          priority:
            row.priority === 'STAT' ? 'stat' :
            row.priority === 'URGENT' ? 'urgent' : 'routine',
          orderedBy: row.orderedBy?.fullName || 'Doctor',
          orderDate: new Date(orderedAt).toISOString().slice(0, 10),
          orderTime: new Date(orderedAt).toTimeString().slice(0, 5),
          status:
            row.status === 'PENDING' ? 'pending' :
            row.status === 'SAMPLE_COLLECTED' ? 'collected' :
            row.status === 'IN_PROGRESS' ? 'processing' : 'completed',
          sampleType: (row.items?.[0]?.test?.sampleType || 'Sample'),
          waitTime: diffMins,
        };
      });
      setOrders(mapped);
    } catch (error) {
      console.error('Failed to load test queue', error);
      toast.error('Failed to load test queue.');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadQueue();
  }, []);

  const updateStatus = async (id: string, status: 'SAMPLE_COLLECTED' | 'IN_PROGRESS' | 'COMPLETED') => {
    setActioningId(id);
    try {
      await api.patch(`/lab/orders/${id}/status`, { status });
      toast.success(`Order moved to ${status}.`);
      await loadQueue();
    } catch (error) {
      console.error('Failed to update lab status', error);
      toast.error('Failed to update order status.');
    } finally {
      setActioningId(null);
    }
  };

  const getPriorityVariant = (priority: string): 'danger' | 'warning' | 'default' => {
    switch (priority) {
      case 'stat': return 'danger';
      case 'urgent': return 'warning';
      default: return 'default';
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'info' | 'default' => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'collected': return 'info';
      default: return 'default';
    }
  };

  const filteredOrders = useMemo(() => orders.filter(order => {
    const matchesSearch = 
      order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || order.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  }), [orders, searchTerm, filterStatus, filterPriority]);

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    collected: orders.filter(o => o.status === 'collected').length,
    processing: orders.filter(o => o.status === 'processing').length,
    stat: orders.filter(o => o.priority === 'stat').length
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test Queue</h1>
          <p className="text-gray-600 mt-1">Manage laboratory test orders</p>
        </div>
        <Button variant="outline" onClick={() => void loadQueue()} isLoading={isLoading}>Refresh</Button>
      </div>

      <ModuleSubnav items={labModuleSubnav} ariaLabel="Laboratory sections" />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Collected</p>
              <p className="text-2xl font-bold text-blue-600">{stats.collected}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.processing}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-xl">⚗️</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">STAT Orders</p>
              <p className="text-2xl font-bold text-red-600">{stats.stat}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              icon={Search}
              placeholder="Search by patient, card number, or order..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('pending')}
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === 'collected' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('collected')}
            >
              Collected
            </Button>
            <Button
              variant={filterStatus === 'processing' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('processing')}
            >
              Processing
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterPriority === 'stat' ? 'danger' : 'outline'}
              size="sm"
              onClick={() => setFilterPriority(filterPriority === 'stat' ? 'all' : 'stat')}
            >
              STAT Only
            </Button>
          </div>
        </div>
      </Card>

      {/* Queue List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{order.patientName}</h3>
                    <p className="text-sm text-gray-600">
                      {order.cardNumber} • {order.age}y, {order.gender}
                    </p>
                  </div>
                  <Badge variant={getPriorityVariant(order.priority)}>
                    {order.priority.toUpperCase()}
                  </Badge>
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Order Number</p>
                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ordered By</p>
                    <p className="font-medium text-gray-900">{order.orderedBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Order Time</p>
                    <p className="font-medium text-gray-900">{order.orderTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Wait Time</p>
                    <p className="font-medium text-gray-900">{order.waitTime} min</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Tests Ordered ({order.tests.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {order.tests.map((test, idx) => (
                      <Badge key={idx} variant="info">
                        {test}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Sample Type:</span>
                  <span>{order.sampleType}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                {order.status === 'pending' && (
                  <Button variant="primary" size="sm" onClick={() => void updateStatus(order.id, 'SAMPLE_COLLECTED')} isLoading={actioningId === order.id}>
                    Collect Sample
                  </Button>
                )}
                {order.status === 'collected' && (
                  <Button variant="primary" size="sm" onClick={() => void updateStatus(order.id, 'IN_PROGRESS')} isLoading={actioningId === order.id}>
                    Start Processing
                  </Button>
                )}
                <Button
                  variant={order.status === 'processing' ? 'success' : 'outline'}
                  size="sm"
                  type="button"
                  onClick={() => navigate(`/lab/orders/${order.id}/results`)}
                >
                  {order.status === 'processing' ? 'Enter results' : 'Result entry'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No test orders found</p>
        </Card>
      )}
    </div>
  );
};
