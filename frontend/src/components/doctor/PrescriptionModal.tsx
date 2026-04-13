import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { X, Plus, Trash2, Pill } from 'lucide-react';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PrescriptionModalProps {
  visitId: string;
  patientId: string;
  patientName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const PrescriptionModal = ({ visitId, patientId, patientName, onClose, onSuccess }: PrescriptionModalProps) => {
  const [medications, setMedications] = useState<Medication[]>([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);
  const [generalInstructions, setGeneralInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const handleSubmit = async () => {
    // Validate
    const validMedications = medications.filter(m => m.name.trim() && m.dosage.trim());
    
    if (validMedications.length === 0) {
      toast.error('Please add at least one medication with name and dosage');
      return;
    }

    setLoading(true);
    try {
      await api.post('/doctor/prescription', {
        visitId,
        medications: validMedications.map(m => ({
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration,
          instructions: m.instructions,
        })),
        instructions: generalInstructions.trim() || null
      });
      
      toast.success('Prescription sent to pharmacy');
      onSuccess();
    } catch (error: any) {
      console.error('[PrescriptionModal] Submit failed:', error);
      toast.error(error.response?.data?.error || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-green-500" />
              Create Prescription
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
          {/* Medications List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-200">Medications</h3>
              <Button
                onClick={addMedication}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </div>

            {medications.map((med, index) => (
              <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-300">Medication #{index + 1}</span>
                  {medications.length > 1 && (
                    <button
                      onClick={() => removeMedication(index)}
                      className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Medication Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Medication Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) => updateMedication(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-50 focus:border-green-500 focus:outline-none"
                      placeholder="e.g., Amoxicillin"
                      required
                    />
                  </div>

                  {/* Dosage */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Dosage <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-50 focus:border-green-500 focus:outline-none"
                      placeholder="e.g., 500mg"
                      required
                    />
                  </div>

                  {/* Frequency */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Frequency
                    </label>
                    <input
                      type="text"
                      value={med.frequency}
                      onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-50 focus:border-green-500 focus:outline-none"
                      placeholder="e.g., 3 times daily"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={med.duration}
                      onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-50 focus:border-green-500 focus:outline-none"
                      placeholder="e.g., 7 days"
                    />
                  </div>

                  {/* Instructions */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Instructions
                    </label>
                    <input
                      type="text"
                      value={med.instructions}
                      onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-50 focus:border-green-500 focus:outline-none"
                      placeholder="e.g., Take with food"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* General Instructions */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              General Instructions
            </label>
            <textarea
              value={generalInstructions}
              onChange={(e) => setGeneralInstructions(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900 text-slate-50 focus:border-green-500 focus:outline-none resize-none"
              rows={3}
              placeholder="Additional instructions for the patient (e.g., Complete full course, avoid alcohol)"
            />
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
              className="flex-1 bg-green-500 hover:bg-green-600"
              isLoading={loading}
            >
              <Pill className="w-4 h-4 mr-2" />
              Send to Pharmacy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
