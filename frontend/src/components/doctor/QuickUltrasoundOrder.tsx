import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

interface QuickUltrasoundOrderProps {
  patientId: string;
  visitId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const QuickUltrasoundOrder = ({ patientId, visitId, onSuccess, onCancel }: QuickUltrasoundOrderProps) => {
  const [formData, setFormData] = useState({
    ultrasoundType: '',
    isFollowUp: false,
    clinicalIndication: '',
    scheduledDate: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const ultrasoundTypes = [
    'Obstetric Ultrasound',
    'Abdominal Ultrasound',
    'Pelvic Ultrasound',
    'Renal Ultrasound',
    'Thyroid Ultrasound',
    'Breast Ultrasound',
    'Cardiac Echo',
    'Vascular Doppler',
    'Musculoskeletal Ultrasound',
    'Other',
  ];

  const handleSubmit = async () => {
    if (!formData.ultrasoundType) {
      toast.error('Please select ultrasound type');
      return;
    }

    if (!visitId) {
      toast.error('No active visit found');
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        visitId,
        patientId,
        ultrasoundType: formData.ultrasoundType,
        isFollowUp: formData.isFollowUp,
        clinicalIndication: formData.clinicalIndication,
      };

      if (formData.scheduledDate) {
        payload.scheduledDate = new Date(formData.scheduledDate).toISOString();
      }

      await api.post('/doctor/ultrasound-orders', payload);

      const price = formData.isFollowUp ? 400 : 200;
      toast.success(`Ultrasound order created (${price} ETB)`);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create ultrasound order');
    } finally {
      setSubmitting(false);
    }
  };

  const price = formData.isFollowUp ? 400 : 200;

  return (
    <div className="space-y-4">
      {/* Ultrasound Type */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Ultrasound Type *
        </label>
        <Select
          value={formData.ultrasoundType}
          onChange={(e) => setFormData({ ...formData, ultrasoundType: e.target.value })}
          required
        >
          <option value="">Select ultrasound type...</option>
          {ultrasoundTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </div>

      {/* Follow-up */}
      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
        <input
          type="checkbox"
          id="isFollowUp"
          checked={formData.isFollowUp}
          onChange={(e) => setFormData({ ...formData, isFollowUp: e.target.checked })}
          className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
        />
        <label htmlFor="isFollowUp" className="flex-1 cursor-pointer">
          <span className="text-sm font-medium text-slate-200">Follow-up Ultrasound</span>
          <p className="text-xs text-slate-400 mt-1">
            Check if this is a follow-up study (400 ETB instead of 200 ETB)
          </p>
        </label>
      </div>

      {/* Price Display */}
      <div className="p-3 bg-blue-950/20 border border-blue-500/50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-300">Estimated Cost:</span>
          <span className="text-lg font-bold text-blue-400">{price} ETB</span>
        </div>
      </div>

      {/* Clinical Indication */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Clinical Indication
        </label>
        <Textarea
          value={formData.clinicalIndication}
          onChange={(e) => setFormData({ ...formData, clinicalIndication: e.target.value })}
          placeholder="Enter clinical indication or reason for ultrasound..."
          rows={3}
        />
      </div>

      {/* Scheduled Date */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Preferred Date (Optional)
        </label>
        <Input
          type="datetime-local"
          value={formData.scheduledDate}
          onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
          min={new Date().toISOString().slice(0, 16)}
        />
        <p className="text-xs text-slate-500 mt-1">
          Leave empty for immediate scheduling
        </p>
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
          {submitting ? 'Creating Order...' : `Create Order (${price} ETB)`}
        </Button>
      </div>
    </div>
  );
};
