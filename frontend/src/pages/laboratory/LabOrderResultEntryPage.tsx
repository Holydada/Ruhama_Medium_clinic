import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { labModuleSubnav } from '../../navigation/moduleSubnavItems';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

type LabOrderItemRow = {
  id: string;
  testName: string;
  result: string | null;
  isAbnormal: boolean | null;
  test?: {
    testCode?: string;
    normalRange?: string | null;
  } | null;
};

type LoadedOrder = {
  id: string;
  orderNumber: string;
  status: string;
  priority: string;
  orderedAt: string;
  clinicalNotes?: string | null;
  patient?: { 
    id?: string;
    fullName?: string; 
    cardNumber?: string;
  };
  orderedBy?: { fullName?: string };
  visitId?: string;
  items: LabOrderItemRow[];
};

export function LabOrderResultEntryPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<LoadedOrder | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});
  const [abnormal, setAbnormal] = useState<Record<string, boolean>>({});
  const [totalPrice, setTotalPrice] = useState<string>('');

  useEffect(() => {
    if (!orderId) {
      setLoadError('Missing order.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    void api
      .get(`/lab/orders`)
      .then((resp) => {
        if (cancelled) return;
        const orders = resp.data?.data || [];
        const o = orders.find((order: any) => order.id === orderId);
        
        if (!o?.id) {
          setLoadError('Order not found.');
          setOrder(null);
          return;
        }
        setOrder(o);
        const nextResults: Record<string, string> = {};
        const nextAbn: Record<string, boolean> = {};
        for (const it of o.items || []) {
          nextResults[it.id] = it.result != null ? String(it.result) : '';
          nextAbn[it.id] = Boolean(it.isAbnormal);
        }
        setResults(nextResults);
        setAbnormal(nextAbn);
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError('Could not load this lab order.');
          setOrder(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const priorityUi = (p: string) => {
    if (p === 'STAT') return { label: 'STAT', variant: 'error' as const };
    if (p === 'URGENT') return { label: 'URGENT', variant: 'warning' as const };
    return { label: 'ROUTINE', variant: 'info' as const };
  };

  const saveResults = async () => {
    if (!order?.items?.length) return;
    
    // Validate that all tests have results
    const missingResults = order.items.filter((i) => !results[i.id]?.trim());
    if (missingResults.length > 0) {
      toast.error(`Please enter results for all ${order.items.length} tests`);
      return;
    }

    // Validate total price
    const price = parseFloat(totalPrice);
    if (!totalPrice.trim() || isNaN(price) || price <= 0) {
      toast.error('Please enter a valid total price');
      return;
    }

    setSaving(true);
    try {
      // 1. Save each test result
      for (const item of order.items) {
        await api.post(`/lab/orders/${order.id}/results`, {
          itemId: item.id,
          result: results[item.id].trim(),
          isAbnormal: abnormal[item.id] === true,
        });
      }
      
      // 2. Update order status to COMPLETED
      await api.patch(`/lab/orders/${order.id}/status`, {
        status: 'COMPLETED'
      });

      // 3. Create financial transaction with total price
      await api.post('/finance/transactions', {
        patientId: order.patient?.id,
        visitId: order.visitId,
        transactionType: 'LAB_TEST',
        amount: price,
        paymentMethod: 'CASH',
        paymentStatus: 'PENDING',
        description: `Lab tests for ${order.patient?.fullName || 'Patient'} - Order ${order.orderNumber}`,
      });
      
      toast.success('Results saved, order completed, and sent to finance!');
      navigate('/lab-dashboard');
    } catch (e) {
      const msg = isAxiosError(e) ? (e.response?.data as { error?: string })?.error : undefined;
      toast.error(typeof msg === 'string' ? msg : 'Failed to save lab results.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-slate-400">Loading order…</p>
      </div>
    );
  }

  if (loadError || !order) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 max-w-lg mx-auto space-y-4">
        <Card variant="elevated">
          <CardContent className="py-8 text-center">
            <p className="text-slate-300 mb-4">{loadError || 'Order not found.'}</p>
            <Button type="button" variant="primary" onClick={() => navigate('/lab-dashboard')}>
              Back to lab dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pr = priorityUi(order.priority);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Enter lab results</h1>
            <p className="text-slate-400 mt-1">
              Order <span className="font-mono text-sky-400">{order.orderNumber}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={pr.variant}>{pr.label}</Badge>
            <Badge variant="info">{order.status.replace(/_/g, ' ')}</Badge>
          </div>
        </div>

        <ModuleSubnav items={labModuleSubnav} ariaLabel="Laboratory sections" />

        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <p className="text-slate-500">Patient</p>
                <p className="text-slate-100 font-medium">{order.patient?.fullName || '—'}</p>
                <p className="text-slate-500">{order.patient?.cardNumber || ''}</p>
              </div>
              <div>
                <p className="text-slate-500">Ordered by</p>
                <p className="text-slate-200">{order.orderedBy?.fullName || '—'}</p>
              </div>
              <div>
                <p className="text-slate-500">Ordered at</p>
                <p className="text-slate-200">{new Date(order.orderedAt).toLocaleString()}</p>
              </div>
            </div>
            {order.clinicalNotes ? (
              <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-300">
                <span className="text-slate-500">Clinical note: </span>
                {order.clinicalNotes}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Test Results */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Test Results ({order.items.length} tests)
          </h2>
          
          {order.items.map((item, index) => (
            <Card key={item.id} variant="elevated">
              <CardHeader>
                <CardTitle className="text-lg">
                  {index + 1}. {item.testName}
                </CardTitle>
                <CardDescription>
                  {item.test?.testCode ? `Code: ${item.test.testCode}` : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.test?.normalRange && (
                  <div className="text-sm">
                    <p className="text-slate-500 mb-1">Normal Range</p>
                    <p className="text-slate-300">{item.test.normalRange}</p>
                  </div>
                )}
                
                <label className="block">
                  <span className="text-sm font-medium text-slate-200">
                    Result <span className="text-red-400">*</span>
                  </span>
                  <textarea
                    value={results[item.id] ?? ''}
                    onChange={(e) => setResults((prev) => ({ ...prev, [item.id]: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none resize-none"
                    rows={2}
                    placeholder="Enter test result..."
                    required
                  />
                </label>
                
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={abnormal[item.id] === true}
                    onChange={(e) => setAbnormal((prev) => ({ ...prev, [item.id]: e.target.checked }))}
                    className="rounded border-slate-600"
                  />
                  Mark as abnormal / critical
                </label>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Total Price */}
        <Card variant="elevated" className="border-2 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Total Price (Birr)
            </CardTitle>
            <CardDescription>
              This amount will be sent to finance for patient billing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <label className="block">
              <span className="text-sm font-medium text-slate-200">
                Total Amount <span className="text-red-400">*</span>
              </span>
              <input
                type="number"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-50 text-lg font-semibold placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
              <p className="text-xs text-slate-400 mt-2">
                Enter the total price for all tests in this order
              </p>
            </label>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/lab-dashboard')}
            disabled={saving}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="primary" 
            isLoading={saving} 
            onClick={() => void saveResults()}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Results & Send to Finance
          </Button>
        </div>

        {/* Info Box */}
        <Card variant="elevated" className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="py-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-slate-300">
                <p className="font-medium text-blue-300 mb-1">What happens when you save:</p>
                <ul className="space-y-1 text-slate-400">
                  <li>• Test results will be sent to the doctor</li>
                  <li>• Total price will be sent to finance department</li>
                  <li>• Patient: <span className="text-slate-200 font-medium">{order.patient?.fullName}</span></li>
                  <li>• Order will be marked as COMPLETED</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
