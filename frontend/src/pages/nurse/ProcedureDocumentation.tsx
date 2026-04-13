import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { FileText } from 'lucide-react';
import { toast } from '../../lib/toast';

export const ProcedureDocumentation: React.FC = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    procedure: '',
    indication: '',
    technique: '',
    findings: '',
    complications: 'none',
    outcome: ''
  });

  const procedures = [
    'Wound Dressing',
    'Catheterization',
    'IV Insertion',
    'NG Tube Insertion',
    'Suture Removal',
    'Blood Draw'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Procedure documented successfully.');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Procedure Documentation</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Patient Name"
            required
            value={formData.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
          />

          <Select
            label="Procedure"
            required
            value={formData.procedure}
            onChange={(e) => setFormData({ ...formData, procedure: e.target.value })}
          >
            <option value="">Select procedure...</option>
            {procedures.map(proc => (
              <option key={proc} value={proc}>{proc}</option>
            ))}
          </Select>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Indication</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={2}
              value={formData.indication}
              onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technique</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={3}
              value={formData.technique}
              onChange={(e) => setFormData({ ...formData, technique: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Findings</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={3}
              value={formData.findings}
              onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
            />
          </div>

          <Select
            label="Complications"
            value={formData.complications}
            onChange={(e) => setFormData({ ...formData, complications: e.target.value })}
          >
            <option value="none">None</option>
            <option value="minor">Minor</option>
            <option value="major">Major</option>
          </Select>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Outcome</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={2}
              value={formData.outcome}
              onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full">
            <FileText className="w-4 h-4 mr-2" />
            Save Documentation
          </Button>
        </form>
      </Card>
    </div>
  );
};
