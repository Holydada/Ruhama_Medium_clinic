import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ArrowLeft, Save, AlertTriangle, Search, Syringe } from 'lucide-react';

interface Patient { 
  id: string; 
  cardNumber: string; 
  fullName: string; 
  allergies?: string;
  sex?: string;
  age?: number;
  photoUrl?: string;
}

export const InjectionOrderForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientIdFromUrl = searchParams.get('patientId');
  const visitIdFromUrl = searchParams.get('visitId');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [queuePatients, setQueuePatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    route: 'IM' as 'IV' | 'IM' | 'SC' | 'ID',
    frequency: 'ONCE',
    duration: '1',
    indication: '',
    specialInstructions: '',
  });

  useEffect(() => {
    loadQueuePatients();
    if (patientIdFromUrl) {
      loadPatient(patientIdFromUrl);
    } else {
      loadCurrentConsultation();
    }
  }, [patientIdFromUrl]);

  const loadQueuePatients = async () => {
    try {
      const response = await api.get('/doctor/queue');
      const queue = response.data.data || [];
      setQueuePatients(queue.map((item: any) => ({
        id: item.patient.id,
        fullName: item.patient.fullName,
        cardNumber: item.patient.cardNumber,
        sex: item.patient.sex,
        age: item.patient.age,
        photoUrl: item.patient.photoUrl,
        allergies: item.patient.allergies,
      })));
    } catch (error) {
      console.log('Failed to load queue patients');
    }
  };

  const loadPatient = async (patientId: string) => {
    try {
      const response = await api.get(`/patients/${patientId}`);
      setSelectedPatient(response.data.data);
    } catch (error) {
      toast.error('Failed to load patient');
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentConsultation = async () => {
    try {
      const response = await api.get('/doctor/current-consultation');
      if (response.data.data) {
        const consultation = response.data.data;
        setSelectedPatient({
          id: consultation.patient.id,
          fullName: consultation.patient.fullName,
          cardNumber: consultation.patient.cardNumber,
          sex: consultation.patient.sex,
          age: consultation.patient.age,
          photoUrl: consultation.patient.photoUrl,
          allergies: consultation.patient.allergies,
        });
      }
    } catch (error) {
      console.log('No current consultation');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await api.get(`/patients/search?q=${searchQuery}`);
      setPatients(response.data.data);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !formData.medicationName || !formData.dosage) {
      toast.error('Complete all required fields');
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post('/doctor/injection-orders', {
        patientId: selectedPatient.id,
        ...formData,
      });
      toast.success('Injection order created');
      navigate('/doctor/queue');
    } catch (error) {
      toast.error('Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate('/doctor-dashboard')} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Injection Order</h1>
        </div>

        {!selectedPatient ? (
          <Card>
            <CardHeader><CardTitle>Search Patient</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                <Button onClick={handleSearch}><Search className="w-4 h-4 mr-2" />Search</Button>
              </div>
              {patients.map(p => (
                <button key={p.id} onClick={() => setSelectedPatient(p)} className="w-full p-3 border border-gray-300 rounded hover:border-primary-500 text-left">
                  <p className="text-gray-900">{p.fullName}</p>
                  <p className="text-sm text-gray-600">Card #{p.cardNumber}</p>
                  {p.allergies && <p className="text-sm text-error-600">⚠ Allergies: {p.allergies}</p>}
                </button>
              ))}
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-primary-500">
              <CardHeader><CardTitle>Patient: {selectedPatient.fullName}</CardTitle></CardHeader>
              {selectedPatient.allergies && (
                <CardContent>
                  <Alert variant="error">
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription><strong>ALLERGIES:</strong> {selectedPatient.allergies}</AlertDescription>
                  </Alert>
                </CardContent>
              )}
            </Card>

            <Card>
              <CardHeader><CardTitle>Injection Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Medication Name *</label>
                  <Input value={formData.medicationName} onChange={(e) => setFormData({...formData, medicationName: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Dosage *</label>
                    <Input value={formData.dosage} onChange={(e) => setFormData({...formData, dosage: e.target.value})} placeholder="e.g., 500mg" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Route *</label>
                    <Select value={formData.route} onValueChange={(v: any) => setFormData({...formData, route: v})} required>
                      <option value="IV">Intravenous (IV)</option>
                      <option value="IM">Intramuscular (IM)</option>
                      <option value="SC">Subcutaneous (SC)</option>
                      <option value="ID">Intradermal (ID)</option>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Frequency</label>
                    <Select value={formData.frequency} onValueChange={(v) => setFormData({...formData, frequency: v})}>
                      <option value="ONCE">Once</option>
                      <option value="DAILY">Daily</option>
                      <option value="TWICE_DAILY">Twice daily</option>
                      <option value="THREE_TIMES_DAILY">Three times daily</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Duration (days)</label>
                    <Input type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Clinical Indication</label>
                  <Textarea value={formData.indication} onChange={(e) => setFormData({...formData, indication: e.target.value})} rows={2} />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Special Instructions</label>
                  <Textarea value={formData.specialInstructions} onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})} rows={2} />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/doctor-dashboard')}>Cancel</Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
                {submitting ? 'Creating...' : <><Save className="w-4 h-4 mr-2" />Create Order</>}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
