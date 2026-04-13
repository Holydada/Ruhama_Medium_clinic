import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import { AlertTriangle, Save } from 'lucide-react';
import { calculateBMI } from '@/lib/nurseUtils';

export default function TriageForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<any>(null);
  const [formData, setFormData] = useState({
    visitId: '',
    patientId: '',
    triageLevel: 'NON_URGENT',
    chiefComplaint: '',
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    temperature: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    painScore: '',
    isPregnant: false,
    lmp: '',
    allergies: '',
    chronicIllnesses: '',
    routedTo: 'OPD'
  });

  const bmi = formData.weight && formData.height 
    ? calculateBMI(parseFloat(formData.weight), parseFloat(formData.height))
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.triageLevel === 'CRITICAL') {
      if (!confirm('This is a CRITICAL triage. Are you sure? This will send immediate alert to doctors.')) {
        return;
      }
    }

    setLoading(true);
    try {
      await api.post('/api/v1/nurse/triage', {
        ...formData,
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : undefined,
        respiratoryRate: formData.respiratoryRate ? parseInt(formData.respiratoryRate) : undefined,
        temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
        oxygenSaturation: formData.oxygenSaturation ? parseInt(formData.oxygenSaturation) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        painScore: formData.painScore ? parseInt(formData.painScore) : undefined,
      });

      toast.success(
        formData.triageLevel === 'CRITICAL' 
          ? 'Critical triage recorded! Doctor alerted.' 
          : 'Triage completed successfully'
      );
      
      navigate('/nurse-dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to complete triage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Triage</h1>
          <p className="text-gray-600 mt-1">Initial patient assessment and routing</p>
        </div>

        {patient?.allergies && (
          <Card className="border-error-500 bg-error-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-error-600" />
                <div>
                  <p className="text-error-600 font-bold">ALLERGIES</p>
                  <p className="text-gray-900">{patient.allergies}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Triage Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'CRITICAL', label: 'Critical', color: 'bg-red-500' },
                  { value: 'URGENT', label: 'Urgent', color: 'bg-orange-500' },
                  { value: 'SEMI_URGENT', label: 'Semi-Urgent', color: 'bg-yellow-500' },
                  { value: 'NON_URGENT', label: 'Non-Urgent', color: 'bg-green-500' }
                ].map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, triageLevel: level.value })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.triageLevel === level.value
                        ? `${level.color} border-white`
                        : 'bg-slate-800 border-slate-700'
                    }`}
                  >
                    <p className="text-white font-bold">{level.label}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chief Complaint *</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.chiefComplaint}
                onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                placeholder="Patient's main complaint..."
                required
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vital Signs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Blood Pressure (mmHg)
                  </label>
                  <Input
                    value={formData.bloodPressure}
                    onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                    placeholder="120/80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Heart Rate (bpm)
                  </label>
                  <Input
                    type="number"
                    value={formData.heartRate}
                    onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                    placeholder="72"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Respiratory Rate (breaths/min)
                  </label>
                  <Input
                    type="number"
                    value={formData.respiratoryRate}
                    onChange={(e) => setFormData({ ...formData, respiratoryRate: e.target.value })}
                    placeholder="16"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Temperature (°C)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    placeholder="36.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    SpO2 (%)
                  </label>
                  <Input
                    type="number"
                    value={formData.oxygenSaturation}
                    onChange={(e) => setFormData({ ...formData, oxygenSaturation: e.target.value })}
                    placeholder="98"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Pain Score (0-10)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.painScore}
                    onChange={(e) => setFormData({ ...formData, painScore: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Weight (kg)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Height (cm)
                  </label>
                  <Input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="170"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    BMI
                  </label>
                  <Input
                    value={bmi ? bmi.toFixed(1) : ''}
                    disabled
                    className="bg-slate-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Route Patient To *</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.routedTo}
                onChange={(e) => setFormData({ ...formData, routedTo: e.target.value })}
                required
              >
                <option value="OPD">OPD (Outpatient)</option>
                <option value="EMERGENCY">Emergency</option>
                <option value="ULTRASOUND">Ultrasound</option>
                <option value="INJECTION">Injection Room</option>
              </select>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Complete Triage'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/nurse-dashboard')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
