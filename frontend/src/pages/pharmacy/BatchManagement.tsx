import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Package } from 'lucide-react';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { pharmacyModuleSubnav } from '../../navigation/moduleSubnavItems';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

interface StockRow {
  id: string;
  batchNumber: string;
  quantityInStock: number;
  expiryDate: string;
  receivedDate: string | null;
  supplier: string | null;
  manufacturer: string | null;
  status: string;
  drug: { drugName: string; genericName?: string | null };
}

function batchStatus(expiryIso: string, stockStatus: string): 'active' | 'expiring' | 'expired' {
  if (stockStatus === 'EXPIRED') return 'expired';
  const exp = new Date(expiryIso);
  exp.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (exp < today) return 'expired';
  const soon = new Date(today);
  soon.setDate(soon.getDate() + 90);
  if (exp <= soon) return 'expiring';
  return 'active';
}

export const BatchManagement: React.FC = () => {
  const [batches, setBatches] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await api.get('/pharmacy/stock', { params: { limit: 200 } });
      setBatches(resp.data?.data?.stocks ?? []);
    } catch {
      toast.error('Failed to load stock batches.');
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Batch Management</h1>

      <ModuleSubnav items={pharmacyModuleSubnav} ariaLabel="Pharmacy sections" />

      {loading ? (
        <p className="text-gray-600 mt-4">Loading…</p>
      ) : (
        <div className="space-y-4 mt-4">
          {batches.length === 0 ? (
            <Card className="p-6">
              <p className="text-gray-600">No stock batches on file.</p>
            </Card>
          ) : (
            batches.map((batch) => {
              const drugLabel =
                batch.drug.drugName + (batch.drug.genericName ? ` (${batch.drug.genericName})` : '');
              const status = batchStatus(batch.expiryDate, batch.status);
              const mfg = batch.receivedDate ? batch.receivedDate.slice(0, 10) : '—';

              return (
                <Card key={batch.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{drugLabel}</h3>
                        <p className="text-sm text-gray-600">Batch: {batch.batchNumber}</p>
                        <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                          <div>
                            <span className="text-gray-600">Quantity:</span>
                            <span className="ml-2 font-medium">{batch.quantityInStock} units</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Received:</span>
                            <span className="ml-2">{mfg}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Exp Date:</span>
                            <span className="ml-2">{batch.expiryDate.slice(0, 10)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Supplier: {batch.supplier || '—'}
                          {batch.manufacturer ? ` • Mfr: ${batch.manufacturer}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge
                        variant={status === 'active' ? 'success' : status === 'expiring' ? 'warning' : 'danger'}
                      >
                        {status}
                      </Badge>
                      <Button variant="outline" size="sm" type="button" disabled>
                        View Details
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
