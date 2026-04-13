import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Calendar, Clock } from 'lucide-react';
import { toast } from '../../lib/toast';

export const FollowUpScheduler: React.FC = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    followUpDate: '',
    followUpTime: '',
    reason: '',
    priority: 'routine',
    reminderDays: '1'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Follow-up scheduled successfully.');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Schedule Follow-Up</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Patient Name"
            required
            value={formData.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              icon={Calendar}
              label="Follow-up Date"
              type="date"
              required
              value={formData.followUpDate}
              onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
            />
            <Input
              icon={Clock}
              label="Follow-up Time"
              type="time"
              required
              value={formData.followUpTime}
              onChange={(e) => setFormData({ ...formData, followUpTime: e.target.value })}
            />
          </div>

          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="routine">Routine</option>
            <option value="urgent">Urgent</option>
          </Select>

          <Input
            label="Reminder (days before)"
            type="number"
            value={formData.reminderDays}
            onChange={(e) => setFormData({ ...formData, reminderDays: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Follow-up</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={3}
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Schedule Follow-Up
          </Button>
        </form>
      </Card>
    </div>
  );
};
