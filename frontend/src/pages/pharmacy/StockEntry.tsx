import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { pharmacyModuleSubnav } from '../../navigation/moduleSubnavItems';

interface Drug {
  id: string;
  drugName: string;
  genericName?: string;
  strength?: string;
  dosageForm?: string;
}

export const StockEntry = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useNewDrug, setUseNewDrug] = useState(false);
  const [newDrugName, setNewDrugName] = useState('');
  const [form, setForm] = useState({
    drugId: '',
    batchNumber: '',
    quantityInStock: '0',
    unitPrice: '0',
    sellingPrice: '0',
    expiryDate: '',
    manufacturer: '',
    supplier: '',
    reorderLevel: '10',
    location: '',
  });

  const selectedDrug = useMemo(() => drugs.find((d) => d.id === form.drugId), [drugs, form.drugId]);

  const loadDrugs = async () => {
    setIsLoading(true);
    try {
      const resp = await api.get('/pharmacy/drugs');
      setDrugs(resp.data?.data || []);
    } catch (error) {
      console.error('Failed to load drug catalog', error);
      toast.error('Failed to load drug catalog.');
      setDrugs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDrugs();
  }, []);

  const submit = async () => {
    if (useNewDrug) {
      if (!newDrugName.trim() || !form.batchNumber || !form.expiryDate) {
        toast.info('Please complete required fields.');
        return;
      }
    } else {
      if (!form.drugId || !form.batchNumber || !form.expiryDate) {
        toast.info('Please complete required fields.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // If using new drug, create it first
      let drugId = form.drugId;
      if (useNewDrug && newDrugName.trim()) {
        const drugResp = await api.post('/pharmacy/drugs', {
          drugName: newDrugName.trim(),
        });
        drugId = drugResp.data.data.id;
        toast.success('New drug added to catalog');
        // Reload drugs list
        await loadDrugs();
      }

      await api.post('/pharmacy/stock', {
        drugId,
        batchNumber: form.batchNumber,
        quantityInStock: Number(form.quantityInStock),
        unitPrice: Number(form.unitPrice),
        sellingPrice: Number(form.sellingPrice),
        expiryDate: form.expiryDate,
        manufacturer: form.manufacturer || undefined,
        supplier: form.supplier || undefined,
        reorderLevel: Number(form.reorderLevel || 10),
        location: form.location || undefined,
      });

      toast.success('Stock entry created successfully.');
      setForm({
        drugId: '',
        batchNumber: '',
        quantityInStock: '0',
        unitPrice: '0',
        sellingPrice: '0',
        expiryDate: '',
        manufacturer: '',
        supplier: '',
        reorderLevel: '10',
        location: '',
      });
      setNewDrugName('');
      setUseNewDrug(false);
    } catch (error: any) {
      console.error('Failed to create stock entry', error);
      toast.error(error?.response?.data?.error || 'Failed to create stock entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Stock Entry</h1>
            <p className="text-slate-400 mt-1">Add new medicine stock batch to inventory</p>
          </div>
          <Button variant="outline" onClick={() => void loadDrugs()} isLoading={isLoading}>
            Refresh Drugs
          </Button>
        </div>

        <ModuleSubnav items={pharmacyModuleSubnav} ariaLabel="Pharmacy sections" />

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>New Stock Batch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-slate-900/60 border border-slate-700 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!useNewDrug}
                  onChange={() => setUseNewDrug(false)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-slate-300">Select existing drug</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={useNewDrug}
                  onChange={() => setUseNewDrug(true)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-slate-300">Enter new drug name</span>
              </label>
            </div>

            {useNewDrug ? (
              <div>
                <Input
                  label="New Drug Name"
                  required
                  value={newDrugName}
                  onChange={(e) => setNewDrugName(e.target.value)}
                  placeholder="Type drug name (e.g., Amoxicillin 500mg)"
                  autoFocus
                />
                <p className="text-xs text-slate-500 mt-1">
                  This will create a new drug in the catalog and add stock for it
                </p>
              </div>
            ) : (
              <>
                <Select
                  label="Drug"
                  required
                  value={form.drugId}
                  onChange={(e) => setForm((prev) => ({ ...prev, drugId: e.target.value }))}
                >
                  <option value="">Select drug...</option>
                  {drugs.map((drug) => (
                    <option key={drug.id} value={drug.id}>
                      {drug.drugName}{drug.strength ? ` ${drug.strength}` : ''}{drug.dosageForm ? ` (${drug.dosageForm})` : ''}
                    </option>
                  ))}
                </Select>

                {selectedDrug && (
                  <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-300">
                    Selected: {selectedDrug.drugName}{selectedDrug.genericName ? ` - ${selectedDrug.genericName}` : ''}
                  </div>
                )}
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Batch Number" required value={form.batchNumber} onChange={(e) => setForm((p) => ({ ...p, batchNumber: e.target.value }))} />
              <Input label="Expiry Date" required type="date" value={form.expiryDate} onChange={(e) => setForm((p) => ({ ...p, expiryDate: e.target.value }))} />
              <Input label="Quantity" required type="number" value={form.quantityInStock} onChange={(e) => setForm((p) => ({ ...p, quantityInStock: e.target.value }))} />
              <Input label="Reorder Level" type="number" value={form.reorderLevel} onChange={(e) => setForm((p) => ({ ...p, reorderLevel: e.target.value }))} />
              <Input label="Unit Price" required type="number" value={form.unitPrice} onChange={(e) => setForm((p) => ({ ...p, unitPrice: e.target.value }))} />
              <Input label="Selling Price" required type="number" value={form.sellingPrice} onChange={(e) => setForm((p) => ({ ...p, sellingPrice: e.target.value }))} />
              <Input label="Manufacturer" value={form.manufacturer} onChange={(e) => setForm((p) => ({ ...p, manufacturer: e.target.value }))} />
              <Input label="Supplier" value={form.supplier} onChange={(e) => setForm((p) => ({ ...p, supplier: e.target.value }))} />
            </div>

            <Input label="Storage Location" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => window.history.back()}>
                Back
              </Button>
              <Button variant="primary" className="flex-1" onClick={() => void submit()} isLoading={isSubmitting}>
                Save Stock Entry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

