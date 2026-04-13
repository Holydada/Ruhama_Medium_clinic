import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';
import { Alert, AlertDescription } from '../ui/Alert';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { Plus, X, Search, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface QuickPrescriptionProps {
  patientId: string;
  visitId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface Drug {
  id: string;
  drugName: string;
  genericName?: string;
  strength?: string;
}

interface PrescriptionItem {
  drugId?: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions?: string;
}

export const QuickPrescription = ({ patientId, visitId, onSuccess, onCancel }: QuickPrescriptionProps) => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<PrescriptionItem[]>([]);
  const [currentItem, setCurrentItem] = useState<PrescriptionItem>({
    drugName: '',
    dosage: '',
    frequency: '',
    duration: '',
    quantity: 0,
    instructions: '',
  });
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [clinicalWarnings, setClinicalWarnings] = useState<any>(null);
  const [checkingDrug, setCheckingDrug] = useState(false);

  useEffect(() => {
    loadDrugs();
  }, []);

  const loadDrugs = async () => {
    try {
      const response = await api.get('/pharmacy/drugs');
      setDrugs(response.data.data);
    } catch (error) {
      console.error('Failed to load drugs');
    }
  };

  const filteredDrugs = drugs.filter(drug =>
    drug.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.genericName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectDrug = async (drug: Drug) => {
    setCurrentItem({
      ...currentItem,
      drugId: drug.id,
      drugName: drug.drugName,
    });
    setSearchTerm('');
    
    // Check for clinical warnings
    await checkClinicalWarnings(drug.drugName);
  };

  const checkClinicalWarnings = async (drugName: string) => {
    if (!drugName || !patientId) return;
    
    setCheckingDrug(true);
    try {
      const response = await api.post('/cds/comprehensive-drug-check', {
        patientId,
        drugName,
      });
      
      if (response.data.data && !response.data.data.safe) {
        setClinicalWarnings(response.data.data);
      } else {
        setClinicalWarnings(null);
      }
    } catch (error) {
      console.error('Failed to check drug safety', error);
    } finally {
      setCheckingDrug(false);
    }
  };

  const addItem = () => {
    if (!currentItem.drugName || !currentItem.dosage || !currentItem.frequency || !currentItem.duration) {
      toast.error('Please fill all required fields');
      return;
    }

    setItems([...items, currentItem]);
    setCurrentItem({
      drugName: '',
      dosage: '',
      frequency: '',
      duration: '',
      quantity: 0,
      instructions: '',
    });
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error('Please add at least one medication');
      return;
    }

    if (!visitId) {
      toast.error('No active visit found');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/doctor/prescriptions', {
        visitId,
        patientId,
        items,
        notes,
      });

      toast.success(`Prescription created with ${items.length} medication(s)`);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create prescription');
    } finally {
      setSubmitting(false);
    }
  };

  // Common frequencies
  const frequencies = [
    'Once daily',
    'Twice daily',
    '3 times daily',
    '4 times daily',
    'Every 4 hours',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed',
    'Before meals',
    'After meals',
    'At bedtime',
  ];

  // Common durations
  const durations = [
    '3 days',
    '5 days',
    '7 days',
    '10 days',
    '14 days',
    '21 days',
    '30 days',
    'Until finished',
  ];

  return (
    <div className="space-y-4">
      {/* Clinical Warnings */}
      {clinicalWarnings && (
        <div className="space-y-2">
          {clinicalWarnings.allergyCheck && (
            <Alert className="border-red-500 bg-red-950/20">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <AlertDescription className="text-red-400">
                <strong>ALLERGY ALERT:</strong> {clinicalWarnings.allergyCheck.recommendation}
              </AlertDescription>
            </Alert>
          )}
          
          {clinicalWarnings.interactions?.filter((i: any) => i.severity === 'CRITICAL' || i.severity === 'MAJOR').map((interaction: any, idx: number) => (
            <Alert key={idx} className={`border-${interaction.severity === 'CRITICAL' ? 'red' : 'yellow'}-500 bg-${interaction.severity === 'CRITICAL' ? 'red' : 'yellow'}-950/20`}>
              <AlertTriangle className={`w-4 h-4 text-${interaction.severity === 'CRITICAL' ? 'red' : 'yellow'}-500`} />
              <AlertDescription className={`text-${interaction.severity === 'CRITICAL' ? 'red' : 'yellow'}-400`}>
                <strong>{interaction.severity} INTERACTION:</strong> {interaction.description}
                <br />
                <em>{interaction.recommendation}</em>
              </AlertDescription>
            </Alert>
          ))}
          
          {clinicalWarnings.contraindications?.map((contra: string, idx: number) => (
            <Alert key={idx} className="border-yellow-500 bg-yellow-950/20">
              <Info className="w-4 h-4 text-yellow-500" />
              <AlertDescription className="text-yellow-400">
                {contra}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Current Prescription Items */}
      {items.length > 0 && (
        <div className="p-3 bg-green-950/20 border border-green-500/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-400">
              Prescription Items ({items.length})
            </span>
          </div>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-slate-800/50 rounded-lg flex items-start justify-between"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-200">{item.drugName}</p>
                  <p className="text-sm text-slate-400">
                    {item.dosage} • {item.frequency} • {item.duration}
                  </p>
                  {item.instructions && (
                    <p className="text-xs text-slate-500 mt-1">{item.instructions}</p>
                  )}
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Item */}
      <div className="p-4 bg-slate-800/50 rounded-lg space-y-3">
        <h4 className="font-medium text-slate-200">Add Medication</h4>

        {/* Drug Search */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Medication Name *
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={currentItem.drugName || searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentItem({ ...currentItem, drugName: e.target.value });
              }}
              placeholder="Search or type medication name..."
              className="pl-10"
            />
          </div>
          {searchTerm && filteredDrugs.length > 0 && (
            <div className="mt-2 max-h-40 overflow-y-auto bg-slate-900 border border-slate-700 rounded-lg">
              {filteredDrugs.slice(0, 5).map(drug => (
                <button
                  key={drug.id}
                  onClick={() => selectDrug(drug)}
                  className="w-full p-2 text-left hover:bg-slate-800 transition-colors"
                >
                  <p className="text-sm text-slate-200">{drug.drugName}</p>
                  {drug.genericName && (
                    <p className="text-xs text-slate-400">{drug.genericName}</p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dosage */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Dosage *
          </label>
          <Input
            value={currentItem.dosage}
            onChange={(e) => setCurrentItem({ ...currentItem, dosage: e.target.value })}
            placeholder="e.g., 500mg, 1 tablet, 5ml"
          />
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Frequency *
          </label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {frequencies.slice(0, 6).map(freq => (
              <Button
                key={freq}
                onClick={() => setCurrentItem({ ...currentItem, frequency: freq })}
                variant="outline"
                size="sm"
                className={currentItem.frequency === freq ? 'border-blue-500' : ''}
              >
                {freq}
              </Button>
            ))}
          </div>
          <Input
            value={currentItem.frequency}
            onChange={(e) => setCurrentItem({ ...currentItem, frequency: e.target.value })}
            placeholder="Or type custom frequency..."
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Duration *
          </label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {durations.slice(0, 6).map(dur => (
              <Button
                key={dur}
                onClick={() => setCurrentItem({ ...currentItem, duration: dur })}
                variant="outline"
                size="sm"
                className={currentItem.duration === dur ? 'border-blue-500' : ''}
              >
                {dur}
              </Button>
            ))}
          </div>
          <Input
            value={currentItem.duration}
            onChange={(e) => setCurrentItem({ ...currentItem, duration: e.target.value })}
            placeholder="Or type custom duration..."
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Quantity
          </label>
          <Input
            type="number"
            value={currentItem.quantity || ''}
            onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 0 })}
            placeholder="Total quantity to dispense"
          />
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Instructions (Optional)
          </label>
          <Input
            value={currentItem.instructions}
            onChange={(e) => setCurrentItem({ ...currentItem, instructions: e.target.value })}
            placeholder="e.g., Take with food, Avoid alcohol"
          />
        </div>

        <Button
          onClick={addItem}
          variant="primary"
          size="sm"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to Prescription
        </Button>
      </div>

      {/* General Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          General Notes (Optional)
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional instructions or notes..."
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
          disabled={submitting || items.length === 0}
        >
          {submitting ? 'Creating...' : `Create Prescription (${items.length} items)`}
        </Button>
      </div>
    </div>
  );
};
