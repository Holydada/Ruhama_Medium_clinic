import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { FileText, Plus, X } from 'lucide-react';

interface Diagnosis {
  id: string;
  code: string;
  description: string;
  type: 'primary' | 'secondary';
}

export const DiagnosisEntry: React.FC = () => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'primary' as 'primary' | 'secondary'
  });

  const commonDiagnoses = [
    { code: 'J00', description: 'Acute nasopharyngitis (common cold)' },
    { code: 'A09', description: 'Diarrhoea and gastroenteritis' },
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'E11', description: 'Type 2 diabetes mellitus' },
    { code: 'J06.9', description: 'Acute upper respiratory infection' }
  ];

  const addDiagnosis = () => {
    if (formData.code && formData.description) {
      setDiagnoses([...diagnoses, { ...formData, id: Date.now().toString() }]);
      setFormData({ code: '', description: '', type: 'secondary' });
    }
  };

  const removeDiagnosis = (id: string) => {
    setDiagnoses(diagnoses.filter(d => d.id !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Diagnosis Entry</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Diagnosis</h2>
        <div className="space-y-4">
          <Select
            label="Common Diagnoses"
            value=""
            onChange={(e) => {
              const selected = commonDiagnoses.find(d => d.code === e.target.value);
              if (selected) {
                setFormData({ ...formData, code: selected.code, description: selected.description });
              }
            }}
          >
            <option value="">Select from common...</option>
            {commonDiagnoses.map(d => (
              <option key={d.code} value={d.code}>{d.code} - {d.description}</option>
            ))}
          </Select>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="ICD-10 Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g., J00"
            />
            <div className="col-span-2">
              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Diagnosis description..."
              />
            </div>
          </div>

          <Select
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'primary' | 'secondary' })}
          >
            <option value="primary">Primary Diagnosis</option>
            <option value="secondary">Secondary Diagnosis</option>
          </Select>

          <Button onClick={addDiagnosis} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Diagnosis
          </Button>
        </div>
      </Card>

      {diagnoses.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Diagnoses List</h2>
          <div className="space-y-3">
            {diagnoses.map(diagnosis => (
              <div key={diagnosis.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={diagnosis.type === 'primary' ? 'success' : 'default'}>
                      {diagnosis.type}
                    </Badge>
                    <span className="font-medium">{diagnosis.code}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{diagnosis.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeDiagnosis(diagnosis.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button variant="primary" className="w-full mt-4">
            <FileText className="w-4 h-4 mr-2" />
            Save Diagnoses
          </Button>
        </Card>
      )}
    </div>
  );
};
