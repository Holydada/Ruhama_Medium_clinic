import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../lib/api';
import { Clock, User, FileText, Calendar } from 'lucide-react';

interface UltrasoundOrder {
  id: string;
  orderNumber: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    cardNumber: string;
    dateOfBirth: Date;
    sex: string;
  };
  studyType: string;
  clinicalIndication: string;
  urgency: 'ROUTINE' | 'URGENT' | 'STAT';
  orderedBy: {
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  status: string;
}

export default function UltrasoundQueue() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<UltrasoundOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'ROUTINE' | 'URGENT' | 'STAT'>('ALL');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await api.get('/api/v1/ultrasound/queue');
      setOrders(response.data.data);
    } catch (error) {
      console.error('Failed to load queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter(o => o.urgency === filter);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'STAT': return 'destructive';
      case 'URGENT': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-slate-400">Loading queue...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Ultrasound Queue</h1>
            <p className="text-slate-400 mt-1">{filteredOrders.length} pending studies</p>
          </div>
          <div className="flex gap-2">
            {(['ALL', 'STAT', 'URGENT', 'ROUTINE'] as const).map((f) => (
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
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:border-blue-500/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/ultrasound/study/${order.id}`)}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <Badge variant={getUrgencyColor(order.urgency)}>
                        {order.urgency}
                      </Badge>
                      <span className="text-slate-400 text-sm">#{order.orderNumber}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-50 font-medium">
                        {order.patient.firstName} {order.patient.lastName}
                      </span>
                      <span className="text-slate-400 text-sm">
                        ({order.patient.cardNumber})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{order.studyType}</span>
                    </div>

                    <div className="text-slate-400 text-sm">
                      {order.clinicalIndication}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Dr. {order.orderedBy.firstName} {order.orderedBy.lastName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <Button>Start Study</Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredOrders.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-slate-400">No pending studies</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
