import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { toast } from '../../lib/toast';

interface LabOrderItem {
  id: string;
  testName: string;
  status: string;
  result?: string;
  isAbnormal?: boolean;
}

interface LabOrder {
  id: string;
  orderNumber: string;
  orderedAt: string;
  status: string;
  urgency: string;
  patient: {
    id: string;
    cardNumber: string;
    fullName: string;
    sex: string;
    dateOfBirth: string;
  };
  items: LabOrderItem[];
  orderedBy: {
    fullName: string;
  };
}

const LabQueue = () => {
  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const resp = await api.get('/lab/orders', {
        params: { status: 'PENDING', limit: 50 },
      });
      setOrders(resp.data.data || []);
    } catch (error) {
      console.error('Failed to load lab orders:', error);
      toast.error('Failed to load lab orders');
    } finally {
      setLoading(false);
    }
  };

  const handleAddResult = async (orderId: string, itemId: string) => {
    const result = results[itemId];
    if (!result?.trim()) {
      toast.error('Please enter a result');
      return;
    }

    try {
      await api.post(`/lab/orders/${orderId}/results`, {
        itemId,
        result: result.trim(),
      });
      toast.success('Result added successfully');
      setResults({ ...results, [itemId]: '' });
      loadOrders();
    } catch (error) {
      console.error('Failed to add result:', error);
      toast.error('Failed to add result');
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      await api.patch(`/lab/orders/${orderId}/status`, { status: 'COMPLETED' });
      toast.success('Order marked as completed');
      loadOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to complete order:', error);
      toast.error('Failed to complete order');
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const urgentOrders = pendingOrders.filter(o => o.urgency === 'URGENT');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-50">Laboratory Queue</h1>
          <p className="text-slate-400 mt-1">Pending lab orders and test results</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card variant="elevated">
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm text-slate-400">Pending Orders</p>
                <p className="text-3xl font-bold text-sky-400 mt-1">{pendingOrders.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm text-slate-400">Urgent Orders</p>
                <p className="text-3xl font-bold text-red-400 mt-1">{urgentOrders.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm text-slate-400">Total Tests</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">
                  {orders.reduce((sum, o) => sum + o.items.length, 0)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading && orders.length === 0 ? (
          <Card variant="elevated">
            <CardContent className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-sky-500 mb-4" />
              <p className="text-slate-400">Loading lab orders...</p>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card variant="elevated">
            <CardContent className="py-12 text-center">
              <svg className="mx-auto h-16 w-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-slate-400 text-lg">No pending lab orders</p>
              <p className="text-slate-500 text-sm mt-2">Orders will appear here when doctors request tests</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} variant="elevated">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <CardTitle className="text-lg">{order.patient.fullName}</CardTitle>
                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                          <span className="font-mono">{order.patient.cardNumber}</span>
                          <span>•</span>
                          <span>{order.patient.sex}</span>
                          <span>•</span>
                          <span>{calculateAge(order.patient.dateOfBirth)} years</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.urgency === 'URGENT' && (
                        <Badge variant="error">URGENT</Badge>
                      )}
                      <Badge variant={order.status === 'PENDING' ? 'warning' : 'success'}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 text-sm text-slate-400">
                    <span>Ordered by: {order.orderedBy.fullName}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(order.orderedAt).toLocaleString()}</span>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="border border-slate-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-slate-100">{item.testName}</p>
                            <Badge variant={item.status === 'PENDING' ? 'warning' : 'success'} className="mt-1">
                              {item.status}
                            </Badge>
                          </div>
                        </div>

                        {item.status === 'PENDING' ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={results[item.id] || ''}
                              onChange={(e) => setResults({ ...results, [item.id]: e.target.value })}
                              placeholder="Enter test result..."
                              className="flex-1 px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                            />
                            <Button
                              variant="primary"
                              onClick={() => handleAddResult(order.id, item.id)}
                              disabled={!results[item.id]?.trim()}
                            >
                              Add Result
                            </Button>
                          </div>
                        ) : (
                          <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-3">
                            <p className="text-sm text-slate-400 mb-1">Result:</p>
                            <p className="text-slate-100">{item.result}</p>
                            {item.isAbnormal && (
                              <Badge variant="error" className="mt-2">Abnormal</Badge>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {order.items.every(item => item.status === 'COMPLETED') && order.status === 'PENDING' && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <Button
                        variant="primary"
                        onClick={() => handleCompleteOrder(order.id)}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Mark Order as Completed</span>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LabQueue;
