import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { TrendingDown } from 'lucide-react';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { financeModuleSubnav } from '../../navigation/moduleSubnavItems';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { formatDate } from '../../lib/utils';

interface RefundRow {
  id: string;
  transactionNumber: string;
  amount: number;
  transactionDate: string;
  description: string | null;
  patientName?: string;
}

const defaultRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 90);
  return { from: start.toISOString().slice(0, 10), to: end.toISOString().slice(0, 10) };
};

export const ExpenseTracking: React.FC = () => {
  const init = defaultRange();
  const [dateFrom, setDateFrom] = useState(init.from);
  const [dateTo, setDateTo] = useState(init.to);
  const [loading, setLoading] = useState(false);
  const [refunds, setRefunds] = useState<RefundRow[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await api.get('/finance/transactions', {
        params: {
          startDate: dateFrom,
          endDate: dateTo,
          paymentStatus: 'REFUNDED',
          limit: 200,
        },
      });
      const rows = resp.data?.data?.transactions ?? [];
      setRefunds(
        rows.map((row: any) => ({
          id: row.id,
          transactionNumber: row.transactionNumber,
          amount: Number(row.amount),
          transactionDate: row.transactionDate,
          description: row.description,
          patientName: row.patient?.fullName,
        }))
      );
    } catch {
      toast.error('Failed to load refund transactions.');
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalRefunds = refunds.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Expense Tracking</h1>
      </div>

      <ModuleSubnav items={financeModuleSubnav} ariaLabel="Finance sections" />

      <Card className="p-4 mb-6 bg-amber-50 border-amber-200">
        <p className="text-sm text-amber-900">
          General ledger expenses are not implemented yet. This view lists <strong>refunded</strong> payments in
          finance as cash outflows for the selected period.
        </p>
      </Card>

      <Card className="p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <Input label="From Date" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input label="To Date" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <p className="text-xs text-gray-500 mt-2">Change dates to refresh the list.</p>
      </Card>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total refunds</p>
            <p className="text-3xl font-bold text-red-600">{totalRefunds.toLocaleString()} ETB</p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </Card>

      {loading ? (
        <p className="text-gray-600">Loading…</p>
      ) : (
        <div className="space-y-4">
          {refunds.length === 0 ? (
            <Card className="p-6">
              <p className="text-gray-600">No refunded transactions in this range.</p>
            </Card>
          ) : (
            refunds.map((r) => (
              <Card key={r.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{r.description || r.transactionNumber}</h3>
                    <p className="text-sm text-gray-600">
                      {r.transactionNumber}
                      {r.patientName ? ` • ${r.patientName}` : ''} • {formatDate(r.transactionDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-red-600">{r.amount.toLocaleString()} ETB</p>
                    <Badge variant="warning">refunded</Badge>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
