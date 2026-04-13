import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { FileText, TestTube, Pill, Syringe, Activity } from 'lucide-react';

export default function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      const response = await api.get('/api/v1/doctor/orders', {
        params: { status: filter !== 'ALL' ? filter : undefined }
      });
      setOrders(response.data.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderIcon = (type: string) => {
    switch (type) {
      case 'LAB': return <TestTube className="w-5 h-5 text-purple-500" />;
      case 'PRESCRIPTION': return <Pill className="w-5 h-5 text-green-500" />;
      case 'INJECTION': return <Syringe className="w-5 h-5 text-blue-500" />;
      case 'ULTRASOUND': return <Activity className="w-5 h-5 text-orange-500" />;
      default: return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'IN_PROGRESS': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-1">Track all patient orders</p>
          </div>
          <div className="flex gap-2">
            {(['ALL', 'PENDING', 'COMPLETED'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                onClick={() => setFilter(f)}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      {getOrderIcon(order.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-50">
                          {order.patient.firstName} {order.patient.lastName}
                        </h3>
                        <Badge variant={getStatusVariant(order.status)}>
                          {order.status}
                        </Badge>
                        <Badge>{order.type}</Badge>
                      </div>

                      <p className="text-slate-300 mb-2">{order.description}</p>

                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>Order #{order.orderNumber}</span>
                        <span>•</span>
                        <span>{new Date(order.createdAt).toLocaleString()}</span>
                        {order.completedAt && (
                          <>
                            <span>•</span>
                            <span className="text-green-500">
                              Completed {new Date(order.completedAt).toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {orders.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-slate-400">No orders found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
