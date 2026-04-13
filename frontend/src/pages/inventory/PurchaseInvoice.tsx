import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ArrowLeft, Save, Plus, Trash2, Upload } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  tin?: string;
}

interface InventoryItem {
  id: string;
  name: string;
  genericName?: string;
  strength?: string;
  form?: string;
}

interface InvoiceItem {
  itemId: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unitCost: number;
}

export const PurchaseInvoice = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Invoice Header
  const [supplierId, setSupplierId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoicePhoto, setInvoicePhoto] = useState<File | null>(null);
  const [invoicePhotoPreview, setInvoicePhotoPreview] = useState('');

  // Invoice Items
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { itemId: '', batchNumber: '', expiryDate: '', quantity: 0, unitCost: 0 },
  ]);

  useEffect(() => {
    loadSuppliers();
    loadItems();
  }, []);

  const loadSuppliers = async () => {
    try {
      const response = await api.get('/inventory/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      toast.error('Failed to load suppliers');
    }
  };

  const loadItems = async () => {
    try {
      const response = await api.get('/inventory/items?limit=1000');
      setItems(response.data.items);
    } catch (error) {
      toast.error('Failed to load items');
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInvoicePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoicePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addInvoiceItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      { itemId: '', batchNumber: '', expiryDate: '', quantity: 0, unitCost: 0 },
    ]);
  };

  const removeInvoiceItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...invoiceItems];
    updated[index] = { ...updated[index], [field]: value };
    setInvoiceItems(updated);
  };

  const calculateTotal = () => {
    return invoiceItems.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supplierId || !invoiceNumber || invoiceItems.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    const validItems = invoiceItems.filter(
      (item) => item.itemId && item.batchNumber && item.expiryDate && item.quantity > 0 && item.unitCost > 0
    );

    if (validItems.length === 0) {
      toast.error('Add at least one valid item');
      return;
    }

    setSubmitting(true);
    try {
      // Upload photo if provided
      let invoicePhotoPath = undefined;
      if (invoicePhoto) {
        const formData = new FormData();
        formData.append('file', invoicePhoto);
        const uploadResponse = await api.post('/uploads/invoice', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        invoicePhotoPath = uploadResponse.data.url;
      }

      // Create purchase invoice
      await api.post('/inventory/purchase-invoices', {
        supplierId,
        invoiceNumber,
        invoiceDate: new Date(invoiceDate),
        invoicePhotoPath,
        items: validItems.map((item) => ({
          itemId: item.itemId,
          batchNumber: item.batchNumber,
          expiryDate: new Date(item.expiryDate),
          quantity: parseInt(item.quantity.toString()),
          unitCost: parseFloat(item.unitCost.toString()),
        })),
      });

      toast.success('Purchase invoice created successfully');
      navigate('/inventory-dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create purchase invoice');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate('/inventory-dashboard')} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-slate-50">New Purchase Invoice</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invoice Header */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Supplier <span className="text-red-500">*</span>
                  </label>
                  <Select value={supplierId} onValueChange={setSupplierId} required>
                    <option value="">Select supplier...</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} {s.tin && `(TIN: ${s.tin})`}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Invoice Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="INV-2024-001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Invoice Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Invoice Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Invoice Photo (Optional)</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded cursor-pointer hover:bg-slate-700">
                    <Upload className="w-4 h-4" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  {invoicePhotoPreview && (
                    <img src={invoicePhotoPreview} alt="Invoice" className="h-20 w-20 object-cover rounded border border-slate-700" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Invoice Items</CardTitle>
                <Button type="button" onClick={addInvoiceItem} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoiceItems.map((item, index) => (
                  <div key={index} className="p-4 border border-slate-700 rounded space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">Item #{index + 1}</span>
                      {invoiceItems.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeInvoiceItem(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      <div className="col-span-2">
                        <label className="block text-sm text-slate-400 mb-1">Item</label>
                        <Select
                          value={item.itemId}
                          onValueChange={(v) => updateInvoiceItem(index, 'itemId', v)}
                        >
                          <option value="">Select item...</option>
                          {items.map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.name} {i.strength && `(${i.strength})`}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Batch #</label>
                        <Input
                          value={item.batchNumber}
                          onChange={(e) => updateInvoiceItem(index, 'batchNumber', e.target.value)}
                          placeholder="Batch"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Expiry</label>
                        <Input
                          type="date"
                          value={item.expiryDate}
                          onChange={(e) => updateInvoiceItem(index, 'expiryDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Qty</label>
                        <Input
                          type="number"
                          value={item.quantity || ''}
                          onChange={(e) => updateInvoiceItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Unit Cost (ETB)</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitCost || ''}
                          onChange={(e) => updateInvoiceItem(index, 'unitCost', parseFloat(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="text-right text-slate-400 text-sm">
                      Line Total: <span className="text-slate-50 font-medium">{(item.quantity * item.unitCost).toFixed(2)} ETB</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 pt-4 border-t border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-slate-300">Total Amount:</span>
                  <span className="text-2xl font-bold text-slate-50">{calculateTotal().toFixed(2)} ETB</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/inventory-dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
              {submitting ? 'Creating...' : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Purchase Invoice
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
