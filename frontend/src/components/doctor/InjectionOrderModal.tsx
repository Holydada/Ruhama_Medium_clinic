import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { X, Syringe } from 'lucide-react';

interface InjectionOrderModalProps {
  visitId: string;
  patientId: string;
  patientName: string;
  onClose: () => void;
  onSuccess: () => void;
}

// Common injection routes
const ROUTES = ['IM', 'IV', 'SC', 'ID'];

// Common medications
const COMMON_MEDICATIONS = [
  'Diclofenac',
  'Dexamethasone',
  'Ceftriaxone',
  'Gentamicin',
  'Metoclopramide',
  'Ranitidine',
  'Furosemide',
  'Hydrocortisone',
  'Vitamin B Complex',
  'Tetanus Toxoid',
];

export const InjectionOrderModal = ({ visitId, patientId, patientName, onClose, onSuccess }: InjectionOrderModalProps) => {
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [route, setRoute] = useState<string>('IM');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validate
    if (!medicationName.trim() || !dosage.trim() || !route) {
      toast.error('Medication name, dosage, and route are required');
      return;
    }

    setLoading(true);
    try {
      await api.post('/doctor/injection-order', {
        visitId,
        medicationName: medicationName.trim(),
        dosage: dosage.trim(),
        route,
        frequency: frequency.trim() || null,
        duration: duration.trim() || null,
        instructions: instructions.trim() || null
      });
      
      toast.success('Injection order sent to injection room');
      onSuccess();
    } catch (error: any) {
      console.error('[InjectionOrderModal] Submit failed:', error);
      toast.error(error.response?.data?.error || 'Failed to create injection order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Syringe className="w-5 h-5 text-orange-500" />
              Create Injection Order
            </CardTitle>
            <p className="text-sm text-slate-400 mt-1">Patient: {patientName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Select Medication */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Quick Select (Common Medications)
            </label>
            <select
              onChange={(e) => setMedicationName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-50 focus:border-orange-500 focus:outline-none"
            >
              <option value="">-- Select a common medication --</option>
              {COMMON_MEDICATIONS.map((med) => (
                <option key={med} value={med}>
                  {med}
                </option>
              ))}
            </select>
          </div>

          {/* Medication Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Medication Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={medicationName}
              onChange={(e) => setMedicationName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900 text-slate-50 focus:border-orange-500 focus:outline-none"
              placeholder="e.g., Diclofenac"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dosage */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Dosage <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900 text-slate-50 focus:border-orange-500 focus:outline-none"
                placeholder="e.g., 75mg"
                required
              />
            </div>

            {/* Route */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Route <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {ROUTES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoute(r)}
                    className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                      route === r
                        ? 'border-orange-500 bg-orange-500/20 text-orange-300'
                        : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                IM = Intramuscular, IV = Intravenous, SC = Subcutaneous, ID = Intradermal
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Frequency
              </label>
              <input
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900 text-slate-50 focus:border-orange-500 focus:outline-none"
                placeholder="e.g., Once, Twice daily"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900 text-slate-50 focus:border-orange-500 focus:outline-none"
                placeholder="e.g., 1 day, 3 days"
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Special Instructions
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900 text-slate-50 focus:border-orange-500 focus:outline-none resize-none"
              rows={3}
              placeholder="e.g., Administer slowly, Monitor for allergic reaction"
            />
          </div>

          {/* Summary Box */}
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <h4 className="text-sm font-semibold text-orange-400 mb-2">Order Summary</h4>
            <div className="space-y-1 text-sm text-slate-300">
              <p><span className="text-slate-400">Medication:</span> {medicationName || '—'}</p>
              <p><span className="text-slate-400">Dosage:</span> {dosage || '—'}</p>
              <p><span className="text-slate-400">Route:</span> {route}</p>
              {frequency && <p><span className="text-slate-400">Frequency:</span> {frequency}</p>}
              {duration && <p><span className="text-slate-400">Duration:</span> {duration}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="primary"
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              isLoading={loading}
            >
              <Syringe className="w-4 h-4 mr-2" />
              Send to Injection Room
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
