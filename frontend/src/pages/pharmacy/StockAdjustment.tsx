import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Search } from 'lucide-react';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { pharmacyModuleSubnav } from '../../navigation/moduleSubnavItems';
import { api } from '../../lib/api';

interface StockPick {
  id: string;
  batchNumber: string;
  quantityInStock: number;
  drug: { drugName: string; genericName?: string | null };
}

export const StockAdjustment: React.FC = () => {
  const [search, setSearch] = useState('');
  const [matches, setMatches] = useState<StockPick[]>([]);
  const [selected, setSelected] = useState<StockPick | null>(null);
  const [searching, setSearching] = useState(false);
  const [formData, setFormData] = useState({
    adjustmentType: 'add',
    quantity: '',
    reason: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const runSearch = useCallback(async () => {
    if (!search.trim()) {
      setMatches([]);
      return;
    }
    setSearching(true);
    try {
      const resp = await api.get('/pharmacy/stock', {
        params: { search: search.trim(), limit: 40 },
      });
      setMatches(resp.data?.data?.stocks ?? []);
    } catch {
      toast.error('Stock search failed.');
      setMatches([]);
    } finally {
      setSearching(false);
    }
  }, [search]);

  useEffect(() => {
    const t = window.setTimeout(() => void runSearch(), 350);
    return () => window.clearTimeout(t);
  }, [runSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      toast.error('Select a batch from search results.');
      return;
    }
    const q = Number(formData.quantity);
    if (!Number.isFinite(q) || q <= 0) {
      toast.error('Enter a positive quantity.');
      return;
    }
    if (!formData.reason) {
      toast.error('Select a reason.');
      return;
    }

    let newQty: number;
    if (formData.adjustmentType === 'add') {
      newQty = selected.quantityInStock + q;
    } else if (formData.adjustmentType === 'remove') {
      newQty = selected.quantityInStock - q;
      if (newQty < 0) {
        toast.error('Cannot remove more than on hand.');
        return;
      }
    } else {
      newQty = Math.floor(q);
      if (newQty < 0) {
        toast.error('New quantity must be zero or greater.');
        return;
      }
    }

    setSubmitting(true);
    try {
      await api.patch(`/pharmacy/stock/${selected.id}`, { quantityInStock: newQty });
      toast.success('Stock updated.');
      setSelected({ ...selected, quantityInStock: newQty });
      setFormData((f) => ({ ...f, quantity: '', notes: '' }));
      void runSearch();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : undefined;
      toast.error(msg || 'Adjustment failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const label =
    formData.adjustmentType === 'correct'
      ? 'New on-hand quantity'
      : 'Quantity to add / remove';

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Stock Adjustment</h1>

      <ModuleSubnav items={pharmacyModuleSubnav} ariaLabel="Pharmacy sections" />

      <Card className="p-6 mt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            icon={Search}
            label="Search batch"
            placeholder="Drug name or batch number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {searching && <p className="text-sm text-gray-500">Searching…</p>}
          {!searching && matches.length > 0 && (
            <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
              {matches.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0 ${
                    selected?.id === m.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelected(m)}
                >
                  <span className="font-medium">{m.drug.drugName}</span>
                  <span className="text-gray-600"> — {m.batchNumber}</span>
                  <span className="text-gray-500"> ({m.quantityInStock} on hand)</span>
                </button>
              ))}
            </div>
          )}

          {selected && (
            <p className="text-sm text-gray-700">
              Selected: <strong>{selected.drug.drugName}</strong> batch <strong>{selected.batchNumber}</strong> —{' '}
              <strong>{selected.quantityInStock}</strong> units
            </p>
          )}

          <Select
            label="Adjustment Type"
            required
            value={formData.adjustmentType}
            onChange={(e) => setFormData({ ...formData, adjustmentType: e.target.value })}
          >
            <option value="add">Add Stock</option>
            <option value="remove">Remove Stock</option>
            <option value="correct">Set absolute quantity</option>
          </Select>

          <Input
            label={label}
            type="number"
            required
            min={0}
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          />

          <Select
            label="Reason"
            required
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          >
            <option value="">Select reason...</option>
            <option value="damaged">Damaged</option>
            <option value="expired">Expired</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
            <option value="correction">Stock Count Correction</option>
          </Select>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            {submitting ? 'Saving…' : 'Submit Adjustment'}
          </Button>
          <p className="text-xs text-gray-500">
            Reason and notes are recorded in the UI only until an inventory audit API is added.
          </p>
        </form>
      </Card>
    </div>
  );
};
