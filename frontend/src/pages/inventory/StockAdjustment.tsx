import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import { AlertTriangle, Save } from 'lucide-react';

export default function StockAdjustment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    itemId: '',
    adjustmentType: 'INCREASE',
    quantity: '',
    reason: 'DAMAGED',
    notes: '',
    requiresApproval: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/v1/inventory/adjustments', {
        ...formData,
        quantity: parseInt(formData.quantity)
      });

      toast.success('Stock adjustment created successfully');
      navigate('/inventory');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create adjustment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Stock Adjustment</h1>
          <p className="text-slate-400 mt-1">Adjust inventory quantities with reason</p>
        </div>

        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-yellow-500 font-medium">Important</p>
                <p className="text-slate-300 text-sm">
                  Stock adjustments require supervisor approval and create permanent audit records.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Adjustment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Item *
                </label>
                <Input
                  value={formData.itemId}
                  onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                  placeholder="Search item..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Adjustment Type *
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.adjustmentType}
                    onChange={(e) => setFormData({ ...formData, adjustmentType: e.target.value })}
                    required
                  >
                    <option value="INCREASE">Increase</option>
                    <option value="DECREASE">Decrease</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Quantity *
                  </label>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Reason *
                </label>
                <select
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                >
                  <option value="DAMAGED">Damaged</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="THEFT">Theft/Loss</option>
                  <option value="FOUND">Found/Recovered</option>
                  <option value="CORRECTION">Inventory Correction</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Notes *
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Detailed explanation for this adjustment..."
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="approval"
                  checked={formData.requiresApproval}
                  onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="approval" className="text-slate-300">
                  Requires supervisor approval
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Adjustment'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/inventory')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
