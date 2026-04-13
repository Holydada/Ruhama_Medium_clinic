import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Download, TrendingUp, DollarSign } from 'lucide-react';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { pharmacyModuleSubnav } from '../../navigation/moduleSubnavItems';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

const PHARMACY_TYPE = 'PHARMACY_SALE';

const defaultRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return { from: start.toISOString().slice(0, 10), to: end.toISOString().slice(0, 10) };
};

export const SalesReport: React.FC = () => {
  const init = defaultRange();
  const [dateFrom, setDateFrom] = useState(init.from);
  const [dateTo, setDateTo] = useState(init.to);
  const [loading, setLoading] = useState(false);
  const [totalSales, setTotalSales] = useState<number | null>(null);
  const [txCount, setTxCount] = useState(0);

  const load = useCallback(async () => {
    if (!dateFrom || !dateTo) return;
    setLoading(true);
    try {
      const [revResp, txResp] = await Promise.all([
        api.get('/finance/reports/revenue', { params: { startDate: dateFrom, endDate: dateTo } }),
        api.get('/finance/transactions', {
          params: {
            startDate: dateFrom,
            endDate: dateTo,
            paymentStatus: 'PAID',
            transactionType: PHARMACY_TYPE,
            limit: 500,
          },
        }),
      ]);
      const byType = (revResp.data?.data?.byType || {}) as Record<string, number>;
      const pharmacyTotal = Number(byType[PHARMACY_TYPE] ?? 0);
      const rows = txResp.data?.data?.transactions ?? [];
      setTotalSales(pharmacyTotal);
      setTxCount(rows.length);
    } catch {
      toast.error('Failed to load pharmacy sales.');
      setTotalSales(null);
      setTxCount(0);
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    void load();
  }, [load]);

  const averageTransaction = txCount > 0 && totalSales !== null ? Math.round(totalSales / txCount) : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sales Report</h1>
        <Button variant="primary" type="button" disabled>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <ModuleSubnav items={pharmacyModuleSubnav} ariaLabel="Pharmacy sections" />

      <Card className="p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <Input label="From Date" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input label="To Date" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <Button variant="primary" className="w-full mt-4" type="button" onClick={() => void load()} disabled={loading}>
          {loading ? 'Loading…' : 'Refresh'}
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Figures come from finance transactions typed <code className="bg-gray-100 px-1 rounded">{PHARMACY_TYPE}</code>{' '}
          (paid only).
        </p>
      </Card>

      {totalSales !== null && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pharmacy sales</p>
                <p className="text-2xl font-bold text-green-600">{totalSales.toLocaleString()} ETB</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{txCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg transaction</p>
                <p className="text-2xl font-bold text-gray-900">{averageTransaction.toLocaleString()} ETB</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">📊</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div>
              <p className="text-sm text-gray-600">Line-item detail</p>
              <p className="text-lg font-bold text-gray-900 mt-1">Finance / Transactions</p>
              <p className="text-xs text-gray-500 mt-1">Per-drug sales are not stored on the receipt yet.</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
