import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { AlertTriangle } from 'lucide-react';
import { toast } from '../../lib/toast';

export const AdverseEventReporting: React.FC = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    eventType: '',
    severity: 'minor',
    description: '',
    immediateAction: '',
    reportedTo: ''
  });

  const eventTypes = [
    'Medication Error',
    'Fall',
    'Pressure Ulcer',
    'Infection',
    'Equipment Failure',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Adverse event reported successfully.');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="w-8 h-8 text-red-600" />
        <h1 className="text-3xl font-bold text-gray-900">Adverse Event Reporting</h1>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Patient Name"
            required
            value={formData.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
          />

          <Select
            label="Event Type"
            required
            value={formData.eventType}
            onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
          >
            <option value="">Select event type...</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>

          <Select
            label="Severity"
            required
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
          >
            <option value="minor">Minor</option>
            <option value="moderate">Moderate</option>
            <option value="major">Major</option>
            <option value="critical">Critical</option>
          </Select>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what happened..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Immediate Action Taken
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={3}
              value={formData.immediateAction}
              onChange={(e) => setFormData({ ...formData, immediateAction: e.target.value })}
            />
          </div>

          <Input
            label="Reported To"
            required
            value={formData.reportedTo}
            onChange={(e) => setFormData({ ...formData, reportedTo: e.target.value })}
            placeholder="Supervisor name..."
          />

          <Button type="submit" variant="danger" className="w-full">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Submit Report
          </Button>
        </form>
      </Card>
    </div>
  );
};
