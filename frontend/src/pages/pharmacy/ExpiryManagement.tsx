import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { AlertTriangle } from 'lucide-react';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { pharmacyModuleSubnav } from '../../navigation/moduleSubnavItems';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

interface ExpiringRow {
  id: string;
  batchNumber: string;
  quantityInStock: number;
  expiryDate: string;
  status: string;
  drug: { drugName: string; genericName?: string | null };
}

function daysUntil(expiryIso: string): number {
  const exp = new Date(expiryIso).setHours(0, 0, 0, 0);
  const now = new Date().setHours(0, 0, 0, 0);
  return Math.round((exp - now) / (24 * 60 * 60 * 1000));
}

export const ExpiryManagement: React.FC = () => {
  const [days, setDays] = useState(90);
  const [rows, setRows] = useState<ExpiringRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await api.get('/pharmacy/stock/expiring', { params: { days } });
      setRows(resp.data?.data ?? []);
    } catch {
      toast.error('Failed to load expiring stock.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Expiry Management</h1>

      <ModuleSubnav items={pharmacyModuleSubnav} ariaLabel="Pharmacy sections" />

      <Card className="p-4 mb-6 mt-4 max-w-md">
        <Input
          label="Within days"
          type="number"
          min={7}
          max={365}
          value={String(days)}
          onChange={(e) => setDays(Math.min(365, Math.max(7, Number(e.target.value) || 90)))}
        />
        <p className="text-xs text-gray-500 mt-2">Shows batches expiring on or before this horizon.</p>
      </Card>

      {loading ? (
        <p className="text-gray-600">Loading…</p>
      ) : (
        <div className="space-y-4 mt-4">
          {rows.length === 0 ? (
            <Card className="p-6">
              <p className="text-gray-600">No batches in this expiry window.</p>
            </Card>
          ) : (
            rows.map((row) => {
              const d = daysUntil(row.expiryDate);
              const drugName =
                row.drug?.drugName +
                (row.drug?.genericName ? ` (${row.drug.genericName})` : '');
              const action = d < 0 ? 'dispose' : d < 30 ? 'return' : 'monitor';

              return (
                <Card
                  key={row.id}
                  className={`p-6 border-l-4 ${
                    d < 0 ? 'border-red-500' : d < 30 ? 'border-orange-500' : 'border-yellow-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          d < 0 ? 'bg-red-100' : d < 30 ? 'bg-orange-100' : 'bg-yellow-100'
                        }`}
                      >
                        <AlertTriangle
                          className={`w-6 h-6 ${
                            d < 0 ? 'text-red-600' : d < 30 ? 'text-orange-600' : 'text-yellow-600'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{drugName}</h3>
                        <p className="text-sm text-gray-600">Batch: {row.batchNumber}</p>
                        <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                          <div>
                            <span className="text-gray-600">Quantity:</span>
                            <span className="ml-2 font-medium">{row.quantityInStock} units</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Expiry Date:</span>
                            <span className="ml-2">{row.expiryDate.slice(0, 10)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Days Until Expiry:</span>
                            <span
                              className={`ml-2 font-bold ${
                                d < 0 ? 'text-red-600' : d < 30 ? 'text-orange-600' : 'text-yellow-600'
                              }`}
                            >
                              {d < 0 ? 'EXPIRED' : `${d} days`}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Status: {row.status}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge
                        variant={
                          action === 'dispose' ? 'danger' : action === 'return' ? 'warning' : 'default'
                        }
                      >
                        {action}
                      </Badge>
                      <Button variant="outline" size="sm" type="button" disabled>
                        Take Action
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
