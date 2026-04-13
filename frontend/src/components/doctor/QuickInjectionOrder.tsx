import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

interface QuickInjectionOrderProps {
  patientId: string;
  visitId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const QuickInjectionOrder = ({ patientId, visitId, onSuccess, onCancel }: QuickInjectionOrderProps) => {
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    route: 'IM',
    frequency: '',
    duration: '',
    specialInstructions: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const routes = [
    { value: 'IM', label: 'Intramuscular (IM)' },
    { value: 'IV', label: 'Intravenous (IV)' },
    { value: 'SC', label: 'Subcutaneous (SC)' },
    { value: 'ID', label: 'Intradermal (ID)' },
  ];

  const commonInjections = [
    { name: 'Diclofenac', dosage: '75mg', route: 'IM' },
    { name: 'Ceftriaxone', dosage: '1g', route: 'IM' },
    { name: 'Dexamethasone', dosage: '8mg', route: 'IM' },
    { name: 'Vitamin B Complex', dosage: '2ml', route: 'IM' },
    { name: 'Furosemide', dosage: '20mg', route: 'IV' },
    { name: 'Metoclopramide', dosage: '10mg', route: 'IM' },
  ];

  const selectCommon = (injection: typeof commonInjections[0]) => {
    setFormData({
      ...formData,
      medicationName: injection.name,
      dosage: injection.dosage,
      route: injection.route,
    });
  };

  const handleSubmit = async () => {
    if (!formData.medicationName || !formData.dosage || !formData.route) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!visitId) {
      toast.error('No active visit found');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/doctor/injection-orders', {
        visitId,
        patientId,
        ...formData,
      });

      toast.success('Injection order created successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create injection order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Common Injections */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Common Injections
        </label>
        <div className="grid grid-cols-2 gap-2">
          {commonInjections.map((injection) => (
            <button
              key={injection.name}
              onClick={() => selectCommon(injection)}
              className="p-3 text-left bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-lg transition-all"
            >
              <p className="font-medium text-slate-200 text-sm">{injection.name}</p>
              <p className="text-xs text-slate-400">
                {injection.dosage} • {injection.route}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Medication Name */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Medication Name *
        </label>
        <Input
          value={formData.medicationName}
          onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
          placeholder="Enter medication name..."
          required
        />
      </div>

      {/* Dosage */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Dosage *
        </label>
        <Input
          value={formData.dosage}
          onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
          placeholder="e.g., 75mg, 1g, 2ml"
          required
        />
      </div>

      {/* Route */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Route of Administration *
        </label>
        <Select
          value={formData.route}
          onChange={(e) => setFormData({ ...formData, route: e.target.value })}
          required
        >
          {routes.map((route) => (
            <option key={route.value} value={route.value}>
              {route.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Frequency (Optional)
        </label>
        <Input
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
          placeholder="e.g., Once daily, Every 8 hours"
        />
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Duration (Optional)
        </label>
        <Input
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          placeholder="e.g., 3 days, 1 week"
        />
      </div>

      {/* Special Instructions */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Special Instructions (Optional)
        </label>
        <Textarea
          value={formData.specialInstructions}
          onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
          placeholder="Any special instructions for the nurse..."
          rows={2}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-slate-700">
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1"
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="primary"
          className="flex-1"
          disabled={submitting}
        >
          {submitting ? 'Creating Order...' : 'Create Injection Order'}
        </Button>
      </div>
    </div>
  );
};
