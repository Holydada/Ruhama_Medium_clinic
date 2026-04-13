import React, { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Syringe } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

interface InjectionOrderProps {
  patientId?: string;
  visitId?: string;
  patientName?: string;
}

export const InjectionOrder: React.FC<InjectionOrderProps> = ({ patientId, visitId, patientName }) => {
  const [formData, setFormData] = useState({
    patientId: patientId || '',
    visitId: visitId || '',
    patientSearch: patientName || '',
    medication: '',
    dose: '',
    route: 'IM',
    frequency: 'once',
    duration: '1',
    indication: '',
    priority: 'routine',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      patientId: patientId || prev.patientId,
      visitId: visitId || prev.visitId,
      patientSearch: patientName || prev.patientSearch,
    }));
  }, [patientId, visitId, patientName]);

  const routes = ['IM', 'IV', 'SC', 'ID'];
  const medications = ['Diclofenac 75mg', 'Ceftriaxone 1g', 'Vitamin B Complex', 'Dexamethasone 4mg'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.visitId?.trim() || !formData.patientId?.trim()) {
      toast.error('Patient and visit are required. Select a patient in the queue above.');
      return;
    }
    if (!formData.medication.trim() || !formData.dose.trim()) {
      toast.error('Medication and dose are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/injections', {
        visitId: formData.visitId.trim(),
        patientId: formData.patientId.trim(),
        medicationName: formData.medication.trim(),
        dosage: formData.dose.trim(),
        route: formData.route,
        frequency: formData.frequency,
        duration: formData.duration,
      });
      toast.success('Injection order created and sent to the injection queue.');
      setFormData((prev) => ({
        ...prev,
        medication: '',
        dose: '',
        indication: '',
      }));
    } catch (error: unknown) {
      console.error('Failed to create injection order', error);
      const msg =
        isAxiosError(error) && error.response?.data && typeof (error.response.data as { error?: string }).error === 'string'
          ? (error.response.data as { error: string }).error
          : 'Failed to create injection order.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Syringe className="h-6 w-6 text-violet-400" aria-hidden />
            Injection order
          </CardTitle>
          <CardDescription>
            Sends the order to the injection room queue for the current visit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Patient ID"
                required
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                placeholder="Patient UUID"
                disabled={Boolean(patientId)}
                readOnly={Boolean(patientId)}
              />
              <Input
                label="Visit ID"
                required
                value={formData.visitId}
                onChange={(e) => setFormData({ ...formData, visitId: e.target.value })}
                placeholder="Visit UUID"
                disabled={Boolean(visitId)}
                readOnly={Boolean(visitId)}
              />
            </div>

            <Input
              label="Patient"
              value={formData.patientSearch}
              onChange={(e) => setFormData({ ...formData, patientSearch: e.target.value })}
              disabled={Boolean(patientName)}
              readOnly={Boolean(patientName)}
              placeholder="From encounter queue"
            />

            <Select
              label="Medication"
              required
              value={formData.medication}
              onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
            >
              <option value="">Select medication...</option>
              {medications.map((med) => (
                <option key={med} value={med}>
                  {med}
                </option>
              ))}
            </Select>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Dose"
                required
                value={formData.dose}
                onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                placeholder="e.g. 75mg"
              />
              <Select
                label="Route"
                required
                value={formData.route}
                onChange={(e) => setFormData({ ...formData, route: e.target.value })}
              >
                {routes.map((route) => (
                  <option key={route} value={route}>
                    {route}
                  </option>
                ))}
              </Select>
            </div>

            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="routine">Routine</option>
              <option value="urgent">Urgent</option>
              <option value="stat">STAT</option>
            </Select>

            <div>
              <label htmlFor="inj-indication" className="block text-sm font-medium text-slate-300 mb-2">
                Indication (optional)
              </label>
              <textarea
                id="inj-indication"
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none resize-none min-h-[88px]"
                rows={3}
                value={formData.indication}
                onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
                placeholder="Reason for injection (for your records)"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full min-h-[48px]" isLoading={isSubmitting}>
              <Syringe className="w-4 h-4 mr-2" aria-hidden />
              Send to injection queue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
