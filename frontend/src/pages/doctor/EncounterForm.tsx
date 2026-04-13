import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';

interface Visit {
  id: string;
  patient: {
    id: string;
    fullName: string;
    cardNumber: string;
    age?: number;
    sex: 'MALE' | 'FEMALE';
    photoUrl?: string;
    allergies?: string;
  };
  triage?: {
    chiefComplaint: string;
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
  };
}

export const EncounterForm = () => {
  const navigate = useNavigate();
  const { visitId } = useParams<{ visitId: string }>();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    diagnoses: [''],
    icd10Codes: [''],
  });

  useEffect(() => {
    if (visitId) loadVisit();
  }, [visitId]);

  const loadVisit = async () => {
    try {
      const response = await api.get(`/visits/${visitId}`);
      setVisit(response.data.data);
      if (response.data.data.triage?.chiefComplaint) {
        setFormData(prev => ({ ...prev, subjective: response.data.data.triage.chiefComplaint }));
      }
    } catch (error) {
      toast.error('Failed to load visit');
      navigate('/doctor/queue');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subjective || !formData.assessment) {
      setError('Subjective and Assessment are required');
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post(`/doctor/encounters`, { visitId, ...formData });
      toast.success('Encounter saved successfully');
      navigate('/doctor/queue');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save encounter');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center"><p className="text-gray-600">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate('/doctor/queue')} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Clinical Encounter</h1>
        </div>

        {error && (
          <Alert variant="error">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle>Patient Info</CardTitle></CardHeader>
            <CardContent>
              {visit && (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <ProfileAvatar photoUrl={visit.patient.photoUrl} name={visit.patient.fullName} size="md" />
                    <div>
                      <p className="font-semibold text-gray-900">{visit.patient.fullName}</p>
                      <p className="text-sm text-gray-600">Card #{visit.patient.cardNumber}</p>
                    </div>
                  </div>
                  {visit.patient.allergies && (
                    <Alert variant="error" className="mt-3">
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription className="text-sm">
                        <strong>ALLERGIES:</strong> {visit.patient.allergies}
                      </AlertDescription>
                    </Alert>
                  )}
                  {visit.triage && (
                    <div className="mt-3 p-3 bg-gray-100 rounded text-sm">
                      <p className="text-gray-600">Chief Complaint:</p>
                      <p className="text-gray-900">{visit.triage.chiefComplaint}</p>
                      {visit.triage.bloodPressure && <p className="text-gray-600 mt-2">BP: {visit.triage.bloodPressure}</p>}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader><CardTitle>SOAP Notes</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subjective *</label>
                    <Textarea value={formData.subjective} onChange={(e) => setFormData({...formData, subjective: e.target.value})} rows={3} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Objective</label>
                    <Textarea value={formData.objective} onChange={(e) => setFormData({...formData, objective: e.target.value})} rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assessment *</label>
                    <Textarea value={formData.assessment} onChange={(e) => setFormData({...formData, assessment: e.target.value})} rows={3} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
                    <Textarea value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})} rows={3} />
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/doctor/queue')}>Cancel</Button>
                <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
                  {submitting ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save Encounter</>}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
