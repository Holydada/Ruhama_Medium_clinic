import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TrendingUp, Download, DollarSign } from 'lucide-react';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { financeModuleSubnav } from '../../navigation/moduleSubnavItems';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

const defaultRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return { from: start.toISOString().slice(0, 10), to: end.toISOString().slice(0, 10) };
};

const formatTypeLabel = (key: string) =>
  key
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const RevenueReports: React.FC = () => {
  const init = defaultRange();
  const [dateFrom, setDateFrom] = useState(init.from);
  const [dateTo, setDateTo] = useState(init.to);
  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [byType, setByType] = useState<Record<string, number>>({});
  const [txCount, setTxCount] = useState(0);

  const runReport = useCallback(async () => {
    if (!dateFrom || !dateTo) {
      toast.error('Choose a date range.');
      return;
    }
    setLoading(true);
    try {
      const resp = await api.get('/finance/reports/revenue', {
        params: { startDate: dateFrom, endDate: dateTo },
      });
      const data = resp.data?.data;
      setTotalRevenue(Number(data?.totalRevenue ?? 0));
      setByType((data?.byType as Record<string, number>) || {});
      setTxCount(Number(data?.transactionCount ?? 0));
    } catch {
      toast.error('Failed to load revenue report.');
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    void runReport();
  }, [runReport]);

  const typeEntries = Object.entries(byType).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Revenue Reports</h1>
        <Button variant="primary" type="button" disabled>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <ModuleSubnav items={financeModuleSubnav} ariaLabel="Finance sections" />

      <Card className="p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <Input label="From Date" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input label="To Date" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <Button variant="primary" className="w-full mt-4" type="button" onClick={() => void runReport()} disabled={loading}>
          {loading ? 'Loading…' : 'Generate Report'}
        </Button>
      </Card>

      {totalRevenue !== null && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-6 col-span-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue (paid)</p>
                  <p className="text-4xl font-bold text-green-600">{totalRevenue.toLocaleString()} ETB</p>
                  <p className="text-sm text-gray-500 mt-1">{txCount} paid transactions in range</p>
                </div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </Card>

            {typeEntries.length === 0 ? (
              <Card className="p-4 col-span-3">
                <p className="text-gray-600">No paid transactions in this range.</p>
              </Card>
            ) : (
              typeEntries.map(([type, amount]) => (
                <Card key={type} className="p-4">
                  <p className="text-sm text-gray-600">{formatTypeLabel(type)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-2xl font-bold text-gray-900">{amount.toLocaleString()} ETB</p>
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
