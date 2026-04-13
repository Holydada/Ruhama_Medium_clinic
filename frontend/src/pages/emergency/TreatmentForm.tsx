import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import {
  Activity,
  Pill,
  Scissors,
  FileText,
  ArrowLeft,
  Save,
  AlertTriangle,
  Plus,
  X,
} from 'lucide-react';

interface EmergencyCase {
  id: string;
  caseNumber: string;
  patient: {
    id: string;
    fullName: string;
    age?: number;
    sex: 'MALE' | 'FEMALE';
    photoUrl?: string;
    allergies?: string;
  };
  chiefComplaint: string;
  triageLevel?: string;
}

interface Procedure {
  name: string;
  performedBy: string;
  notes?: string;
}

interface Medication {
  name: string;
  dose: string;
  route: string;
  time: string;
}

interface TreatmentData {
  caseId: string;
  procedures: Procedure[];
  medications: Medication[];
  treatmentNotes: string;
  responseToTreatment: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    oxygenSaturation?: number;
  };
}

export const TreatmentForm = () => {
  const navigate = useNavigate();
  const { caseId } = useParams<{ caseId: string }>();
  const [emergencyCase, setEmergencyCase] = useState<EmergencyCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TreatmentData>({
    caseId: caseId || '',
    procedures: [],
    medications: [],
    treatmentNotes: '',
    responseToTreatment: '',
    vitalSigns: {},
  });

  const [newProcedure, setNewProcedure] = useState<Procedure>({
    name: '',
    performedBy: '',
    notes: '',
  });

  const [newMedication, setNewMedication] = useState<Medication>({
    name: '',
    dose: '',
    route: 'IV',
    time: new Date().toTimeString().slice(0, 5),
  });

  useEffect(() => {
    if (caseId) {
      loadEmergencyCase();
    }
  }, [caseId]);

  const loadEmergencyCase = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/emergency/cases/${caseId}`);
      setEmergencyCase(response.data.data);
    } catch (error) {
      console.error('Failed to load emergency case', error);
      toast.error('Failed to load emergency case');
      navigate('/emergency-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProcedure = () => {
    if (!newProcedure.name.trim() || !newProcedure.performedBy.trim()) {
      toast.error('Procedure name and performer are required');
      return;
    }

    setFormData(prev => ({
      ...prev,
      procedures: [...prev.procedures, { ...newProcedure }],
    }));

    setNewProcedure({ name: '', performedBy: '', notes: '' });
    toast.success('Procedure added');
  };

  const handleRemoveProcedure = (index: number) => {
    setFormData(prev => ({
      ...prev,
      procedures: prev.procedures.filter((_, i) => i !== index),
    }));
  };

  const handleAddMedication = () => {
    if (!newMedication.name.trim() || !newMedication.dose.trim()) {
      toast.error('Medication name and dose are required');
      return;
    }

    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, { ...newMedication }],
    }));

    setNewMedication({
      name: '',
      dose: '',
      route: 'IV',
      time: new Date().toTimeString().slice(0, 5),
    });
    toast.success('Medication added');
  };

  const handleRemoveMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.treatmentNotes.trim()) {
      toast.error('Treatment notes are required');
      return;
    }

    if (!formData.responseToTreatment.trim()) {
      toast.error('Response to treatment is required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.post('/emergency/treatment', formData);
      toast.success('Treatment documented successfully');
      navigate('/emergency-dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to document treatment';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-400">Loading emergency case...</p>
        </div>
      </div>
    );
  }

  if (!emergencyCase) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-50 mb-2">Case Not Found</h3>
            <p className="text-slate-400 mb-4">Unable to load emergency case information.</p>
            <Button onClick={() => navigate('/emergency-dashboard')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/emergency-dashboard')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-50">Emergency Treatment</h1>
              <p className="text-slate-400 mt-1">Case #{emergencyCase.caseNumber}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <ProfileAvatar
                    src={emergencyCase.patient.photoUrl}
                    name={emergencyCase.patient.fullName}
                    size="lg"
                  />
                  <div>
                    <h3 className="font-semibold text-slate-50">{emergencyCase.patient.fullName}</h3>
                    <p className="text-sm text-slate-400">
                      {emergencyCase.patient.sex} • {emergencyCase.patient.age || 'Age unknown'}
                    </p>
                  </div>
                </div>

                {emergencyCase.patient.allergies && (
                  <Alert className="border-red-500 bg-red-950/20">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <AlertDescription className="text-red-400">
                      <strong>ALLERGIES:</strong> {emergencyCase.patient.allergies}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-xs font-semibold text-slate-300 mb-1">Chief Complaint</p>
                  <p className="text-sm text-slate-50">{emergencyCase.chiefComplaint}</p>
                </div>

                {emergencyCase.triageLevel && (
                  <div>
                    <p className="text-xs font-semibold text-slate-300 mb-1">Triage Level</p>
                    <Badge variant="warning">{emergencyCase.triageLevel}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Treatment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-500 bg-red-950/20">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              {/* Procedures */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scissors className="w-5 h-5" />
                    Procedures Performed
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Existing Procedures */}
                  {formData.procedures.length > 0 && (
                    <div className="space-y-2">
                      {formData.procedures.map((proc, index) => (
                        <div key={index} className="flex items-start justify-between p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-50">{proc.name}</p>
                            <p className="text-sm text-slate-400">By: {proc.performedBy}</p>
                            {proc.notes && <p className="text-sm text-slate-300 mt-1">{proc.notes}</p>}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveProcedure(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Procedure */}
                  <div className="space-y-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-sm font-semibold text-slate-300">Add Procedure</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Procedure name"
                        value={newProcedure.name}
                        onChange={(e) => setNewProcedure({ ...newProcedure, name: e.target.value })}
                      />
                      <Input
                        placeholder="Performed by"
                        value={newProcedure.performedBy}
                        onChange={(e) => setNewProcedure({ ...newProcedure, performedBy: e.target.value })}
                      />
                    </div>
                    <Input
                      placeholder="Notes (optional)"
                      value={newProcedure.notes}
                      onChange={(e) => setNewProcedure({ ...newProcedure, notes: e.target.value })}
                    />
                    <Button type="button" onClick={handleAddProcedure} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Procedure
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Medications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="w-5 h-5" />
                    Medications Administered
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Existing Medications */}
                  {formData.medications.length > 0 && (
                    <div className="space-y-2">
                      {formData.medications.map((med, index) => (
                        <div key={index} className="flex items-start justify-between p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-50">{med.name}</p>
                            <p className="text-sm text-slate-400">
                              {med.dose} • {med.route} • {med.time}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMedication(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Medication */}
                  <div className="space-y-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-sm font-semibold text-slate-300">Add Medication</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Medication name"
                        value={newMedication.name}
                        onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                      />
                      <Input
                        placeholder="Dose"
                        value={newMedication.dose}
                        onChange={(e) => setNewMedication({ ...newMedication, dose: e.target.value })}
                      />
                      <select
                        value={newMedication.route}
                        onChange={(e) => setNewMedication({ ...newMedication, route: e.target.value })}
                        className="px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                      >
                        <option value="IV">IV</option>
                        <option value="IM">IM</option>
                        <option value="SC">SC</option>
                        <option value="PO">PO</option>
                        <option value="SL">SL</option>
                      </select>
                      <Input
                        type="time"
                        value={newMedication.time}
                        onChange={(e) => setNewMedication({ ...newMedication, time: e.target.value })}
                      />
                    </div>
                    <Button type="button" onClick={handleAddMedication} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Medication
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Vital Signs Monitoring */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Post-Treatment Vital Signs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Blood Pressure"
                      placeholder="120/80"
                      value={formData.vitalSigns?.bloodPressure || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, bloodPressure: e.target.value }
                      })}
                    />
                    <Input
                      label="Heart Rate (bpm)"
                      type="number"
                      placeholder="72"
                      value={formData.vitalSigns?.heartRate || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, heartRate: e.target.value ? parseFloat(e.target.value) : undefined }
                      })}
                    />
                    <Input
                      label="Temperature (°C)"
                      type="number"
                      step="0.1"
                      placeholder="36.5"
                      value={formData.vitalSigns?.temperature || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, temperature: e.target.value ? parseFloat(e.target.value) : undefined }
                      })}
                    />
                    <Input
                      label="O2 Saturation (%)"
                      type="number"
                      placeholder="98"
                      value={formData.vitalSigns?.oxygenSaturation || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, oxygenSaturation: e.target.value ? parseFloat(e.target.value) : undefined }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Treatment Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Treatment Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Treatment Notes *
                    </label>
                    <textarea
                      value={formData.treatmentNotes}
                      onChange={(e) => setFormData({ ...formData, treatmentNotes: e.target.value })}
                      placeholder="Document all treatments, procedures, and interventions performed..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Response to Treatment *
                    </label>
                    <textarea
                      value={formData.responseToTreatment}
                      onChange={(e) => setFormData({ ...formData, responseToTreatment: e.target.value })}
                      placeholder="Document patient's response to treatment, improvement, or deterioration..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/emergency-dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Treatment Record
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
