import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ArrowLeft, Save, Plus, Copy } from 'lucide-react';

interface DrugFormData {
  drugName: string;
  genericName: string;
  brandName: string;
  drugCategory: string;
  dosageForm: string;
  strength: string;
  unit: string;
  description: string;
  sideEffects: string;
  contraindications: string;
  storageConditions: string;
}

const LAST_ENTRY_KEY = 'pharmacy_last_drug_entry';

export const AddDrug = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [lastEntry, setLastEntry] = useState<DrugFormData | null>(null);

  // Drug Details
  const [drugName, setDrugName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [drugCategory, setDrugCategory] = useState('');
  const [dosageForm, setDosageForm] = useState('');
  const [strength, setStrength] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [sideEffects, setSideEffects] = useState('');
  const [contraindications, setContraindications] = useState('');
  const [storageConditions, setStorageConditions] = useState('');

  // Load last entry on mount
  useEffect(() => {
    const saved = localStorage.getItem(LAST_ENTRY_KEY);
    if (saved) {
      try {
        setLastEntry(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse last entry:', error);
      }
    }
  }, []);

  const saveLastEntry = (data: DrugFormData) => {
    localStorage.setItem(LAST_ENTRY_KEY, JSON.stringify(data));
    setLastEntry(data);
  };

  const duplicateLastEntry = () => {
    if (!lastEntry) return;
    
    // Copy all fields except drug name (user should enter new name)
    setGenericName(lastEntry.genericName);
    setBrandName(lastEntry.brandName);
    setDrugCategory(lastEntry.drugCategory);
    setDosageForm(lastEntry.dosageForm);
    setStrength(lastEntry.strength);
    setUnit(lastEntry.unit);
    setDescription(lastEntry.description);
    setSideEffects(lastEntry.sideEffects);
    setContraindications(lastEntry.contraindications);
    setStorageConditions(lastEntry.storageConditions);
    
    toast.success('Last entry duplicated. Enter new drug name.');
  };

  const clearForm = () => {
    setDrugName('');
    setGenericName('');
    setBrandName('');
    setDrugCategory('');
    setDosageForm('');
    setStrength('');
    setUnit('');
    setDescription('');
    setSideEffects('');
    setContraindications('');
    setStorageConditions('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!drugName.trim()) {
      toast.error('Drug name is required');
      return;
    }

    const formData: DrugFormData = {
      drugName: drugName.trim(),
      genericName: genericName.trim(),
      brandName: brandName.trim(),
      drugCategory,
      dosageForm,
      strength,
      unit,
      description,
      sideEffects,
      contraindications,
      storageConditions,
    };

    setSubmitting(true);
    try {
      await api.post('/pharmacy/drugs', {
        drugName: formData.drugName,
        genericName: formData.genericName || undefined,
        brandName: formData.brandName || undefined,
        drugCategory: formData.drugCategory || undefined,
        dosageForm: formData.dosageForm || undefined,
        strength: formData.strength || undefined,
        unit: formData.unit || undefined,
        price: price ? parseFloat(price) : undefined,
        description: formData.description || undefined,
        sideEffects: formData.sideEffects || undefined,
        contraindications: formData.contraindications || undefined,
        storageConditions: formData.storageConditions || undefined,
      });

      // Save as last entry
      saveLastEntry(formData);

      toast.success('Drug added successfully');
      
      // Ask if user wants to add another
      const addAnother = window.confirm('Drug added successfully! Add another drug?');
      if (addAnother) {
        clearForm();
      } else {
        navigate('/pharmacy-dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add drug');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/pharmacy-dashboard')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-slate-50">Add New Drug</h1>
          </div>
          {lastEntry && (
            <Button onClick={duplicateLastEntry} variant="secondary" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Duplicate Last Entry
            </Button>
          )}
        </div>

        {lastEntry && (
          <Card variant="elevated" className="border-sky-500/30 bg-sky-500/5">
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Last added drug:</p>
                  <p className="font-semibold text-slate-100">{lastEntry.drugName}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {lastEntry.dosageForm} {lastEntry.strength} {lastEntry.unit}
                  </p>
                </div>
                <Button onClick={duplicateLastEntry} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Use as Template
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Drug Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={drugName}
                    onChange={(e) => setDrugName(e.target.value)}
                    placeholder="Enter drug name (e.g., Amoxicillin 500mg)"
                    required
                    autoFocus
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Type any drug name - no need to select from a list
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Generic Name</label>
                  <Input
                    value={genericName}
                    onChange={(e) => setGenericName(e.target.value)}
                    placeholder="e.g., Amoxicillin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Brand Name</label>
                  <Input
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g., Amoxil"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <Select value={drugCategory} onValueChange={setDrugCategory}>
                    <option value="">Select category...</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Analgesic">Analgesic</option>
                    <option value="Antipyretic">Antipyretic</option>
                    <option value="Antihypertensive">Antihypertensive</option>
                    <option value="Antidiabetic">Antidiabetic</option>
                    <option value="Antihistamine">Antihistamine</option>
                    <option value="Antacid">Antacid</option>
                    <option value="Vitamin">Vitamin/Supplement</option>
                    <option value="Antiparasitic">Antiparasitic</option>
                    <option value="Antifungal">Antifungal</option>
                    <option value="Antiviral">Antiviral</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Dosage Form</label>
                  <Select value={dosageForm} onValueChange={setDosageForm}>
                    <option value="">Select form...</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Suspension">Suspension</option>
                    <option value="Injection">Injection</option>
                    <option value="Cream">Cream</option>
                    <option value="Ointment">Ointment</option>
                    <option value="Drops">Drops</option>
                    <option value="Inhaler">Inhaler</option>
                    <option value="Suppository">Suppository</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Strength</label>
                  <Input
                    value={strength}
                    onChange={(e) => setStrength(e.target.value)}
                    placeholder="e.g., 500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Unit</label>
                  <Input
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g., mg, ml, IU"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Price (Birr) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., 25.00"
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-slate-500 mt-1">Price per unit in Ethiopian Birr</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Information */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Clinical Information (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Brief description of the drug..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Side Effects</label>
                <Textarea
                  value={sideEffects}
                  onChange={(e) => setSideEffects(e.target.value)}
                  rows={2}
                  placeholder="Common side effects..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Contraindications</label>
                <Textarea
                  value={contraindications}
                  onChange={(e) => setContraindications(e.target.value)}
                  rows={2}
                  placeholder="When not to use this drug..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Storage Conditions</label>
                <Input
                  value={storageConditions}
                  onChange={(e) => setStorageConditions(e.target.value)}
                  placeholder="e.g., Store at room temperature, Keep refrigerated"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/pharmacy-dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={clearForm}
            >
              Clear Form
            </Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
              {submitting ? 'Adding...' : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Drug
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
