import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Clock, Users } from 'lucide-react';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { nurseModuleSubnav } from '../../navigation/moduleSubnavItems';

export const ShiftHandover: React.FC = () => {
  const [handoverNotes, setHandoverNotes] = useState('');

  const currentShift = {
    nurse: 'Nurse Fatuma',
    shift: 'Morning (8:00 - 16:00)',
    patientsCount: 12,
    criticalPatients: 2
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Shift handover completed.');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Shift Handover</h1>

      <ModuleSubnav items={nurseModuleSubnav} ariaLabel="Nursing navigation" />

      <Card className="p-6 mb-6 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Current Nurse</p>
            <p className="font-bold text-gray-900">{currentShift.nurse}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Shift</p>
            <p className="font-medium text-gray-900">{currentShift.shift}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Patients</p>
            <p className="text-2xl font-bold text-blue-600">{currentShift.patientsCount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Critical Patients</p>
            <p className="text-2xl font-bold text-red-600">{currentShift.criticalPatients}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Handover Notes
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={8}
              value={handoverNotes}
              onChange={(e) => setHandoverNotes(e.target.value)}
              placeholder="Important information for the next shift..."
            />
          </div>

          <Button type="submit" variant="primary" className="w-full">
            <Clock className="w-4 h-4 mr-2" />
            Complete Handover
          </Button>
        </form>
      </Card>
    </div>
  );
};
