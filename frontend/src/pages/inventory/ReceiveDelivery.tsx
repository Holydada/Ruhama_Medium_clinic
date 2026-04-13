import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

export const ReceiveDelivery = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    supplierName: '',
    invoiceNumber: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    items: [{ drugName: '', quantity: 0, batchNumber: '', expiryDate: '', unitPrice: 0 }],
  });

  const addItem = () => {
    setFormData({...formData, items: [...formData.items, { drugName: '', quantity: 0, batchNumber: '', expiryDate: '', unitPrice: 0 }]});
  };

  const removeItem = (index: number) => {
    setFormData({...formData, items: formData.items.filter((_, i) => i !== index)});
  };

  const updateItem = (index: number, field: string, value: any) => {
    const items = [...formData.items];
    items[index] = {...items[index], [field]: value};
    setFormData({...formData, items});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/inventory/receive', formData);
      toast.success('Delivery received successfully');
      navigate('/inventory-dashboard');
    } catch (error) {
      toast.error('Failed to receive delivery');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate('/inventory-dashboard')} variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
          <h1 className="text-3xl font-bold text-slate-50">Receive Delivery</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Delivery Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Supplier Name *</label>
                  <Input value={formData.supplierName} onChange={(e) => setFormData({...formData, supplierName: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Invoice Number *</label>
                  <Input value={formData.invoiceNumber} onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Delivery Date *</label>
                  <Input type="date" value={formData.deliveryDate} onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})} required />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Items</span>
                <Button type="button" onClick={addItem} variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" />Add Item</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="p-4 border border-slate-700 rounded space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-50">Item {index + 1}</h4>
                    {formData.items.length > 1 && (
                      <Button type="button" onClick={() => removeItem(index)} variant="outline" size="sm"><X className="w-4 h-4" /></Button>
                    )}
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Drug Name *</label>
                      <Input value={item.drugName} onChange={(e) => updateItem(index, 'drugName', e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Quantity *</label>
                      <Input type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))} required />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Batch Number *</label>
                      <Input value={item.batchNumber} onChange={(e) => updateItem(index, 'batchNumber', e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Expiry Date *</label>
                      <Input type="date" value={item.expiryDate} onChange={(e) => updateItem(index, 'expiryDate', e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Unit Price *</label>
                      <Input type="number" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))} required />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/inventory-dashboard')}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
              {submitting ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Receive Delivery</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
