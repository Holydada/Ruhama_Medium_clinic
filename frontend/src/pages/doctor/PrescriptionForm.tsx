import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ArrowLeft, Save, AlertTriangle, Search, Plus, X, Pill } from 'lucide-react';

interface Patient { 
  id: string; 
  cardNumber: string; 
  fullName: string; 
  allergies?: string;
  sex?: string;
  age?: number;
  photoUrl?: string;
}
interface Drug { id: string; name: string; genericName: string; strength: string; form: string; }

export const PrescriptionForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientIdFromUrl = searchParams.get('patientId');
  const visitIdFromUrl = searchParams.get('visitId');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [queuePatients, setQueuePatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [medications, setMedications] = useState([{ drugId: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrugs();
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

  const loadDrugs = async () => {
    try {
      const response = await api.get('/pharmacy/drugs');
      setDrugs(response.data.data);
    } catch (error) {
      toast.error('Failed to load drugs');
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

  const addMedication = () => {
    setMedications([...medications, { drugId: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || medications.some(m => !m.drugId || !m.dosage)) {
      toast.error('Complete all required fields');
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post('/prescriptions', {
        patientId: selectedPatient.id,
        visitId: visitIdFromUrl || undefined,
        items: medications.map(med => ({
          drugName: drugs.find(d => d.id === med.drugId)?.name || '',
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          quantity: 1,
          instructions: med.instructions?.trim() || undefined,
        })),
      });
      toast.success('Prescription created successfully');
      
      if (visitIdFromUrl) {
        navigate(`/doctor/patient/${selectedPatient.id}`);
      } else {
        navigate('/doctor/queue');
      }
    } catch (error: any) {
      console.error('Failed to create prescription:', error);
      toast.error(error.response?.data?.error || 'Failed to create prescription');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Pill className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate(-1)} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">New Prescription</h1>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Write a prescription for patient</p>
          </div>
        </div>

        {!selectedPatient ? (
          <Card>
            <CardHeader><CardTitle>Select Patient</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  Select a patient from your queue or search for any patient
                </AlertDescription>
              </Alert>
              
              {queuePatients.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-400">Your Current Queue:</p>
                  <div className="grid gap-2">
                    {queuePatients.map(p => (
                      <button 
                        key={p.id} 
                        onClick={() => setSelectedPatient(p)} 
                        className="w-full p-3 border-2 border-blue-500/50 bg-blue-950/20 rounded-lg hover:border-blue-500 text-left transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <ProfileAvatar src={p.photoUrl} name={p.fullName} size="sm" />
                          <div className="flex-1">
                            <p className="font-medium text-slate-50">{p.fullName}</p>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                              <span>Card #{p.cardNumber}</span>
                              {p.sex && <><span>•</span><span>{p.sex}</span></>}
                              {p.age && <><span>•</span><span>{p.age} years</span></>}
                            </div>
                            {p.allergies && (
                              <p className="text-sm text-red-400 mt-1">⚠ Allergies: {p.allergies}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm font-medium text-slate-400 mb-3">Or Search for Any Patient:</p>
                <div className="flex gap-3">
                  <Input 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="Search by name, card number..." 
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
                  />
                  <Button onClick={handleSearch}>
                    <Search className="w-4 h-4 mr-2" />Search
                  </Button>
                </div>
              </div>
              
              {patients.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-400">Search Results:</p>
                  {patients.map(p => (
                    <button 
                      key={p.id} 
                      onClick={() => setSelectedPatient(p)} 
                      className="w-full p-3 border-2 border-slate-700 rounded-lg hover:border-primary-500 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ProfileAvatar src={p.photoUrl} name={p.fullName} size="sm" />
                        <div>
                          <p className="font-medium text-slate-50">{p.fullName}</p>
                          <p className="text-sm text-slate-400">Card #{p.cardNumber}</p>
                          {p.allergies && <p className="text-sm text-red-400">⚠ Allergies: {p.allergies}</p>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-primary-500 bg-primary-950/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <ProfileAvatar
                    src={selectedPatient.photoUrl}
                    name={selectedPatient.fullName}
                    size="lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-50">{selectedPatient.fullName}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                      <span>Card #{selectedPatient.cardNumber}</span>
                      {selectedPatient.sex && (
                        <>
                          <span>•</span>
                          <span>{selectedPatient.sex}</span>
                        </>
                      )}
                      {selectedPatient.age && (
                        <>
                          <span>•</span>
                          <span>{selectedPatient.age} years</span>
                        </>
                      )}
                    </div>
                  </div>
                  {!patientIdFromUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPatient(null)}
                    >
                      Change Patient
                    </Button>
                  )}
                </div>
                {selectedPatient.allergies && (
                  <Alert variant="error" className="mt-4">
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription><strong>ALLERGIES:</strong> {selectedPatient.allergies}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Medications</span>
                  <Button type="button" onClick={addMedication} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />Add Medication
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {medications.map((med, index) => (
                  <div key={index} className="p-4 border border-gray-300 rounded space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Medication {index + 1}</h4>
                      {medications.length > 1 && (
                        <Button type="button" onClick={() => removeMedication(index)} variant="outline" size="sm">
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-sm text-gray-700 mb-1">Drug *</label>
                        <Select value={med.drugId} onValueChange={(v) => updateMedication(index, 'drugId', v)} required>
                          <option value="">Select drug...</option>
                          {drugs.map(d => <option key={d.id} value={d.id}>{d.name} ({d.strength})</option>)}
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-300 mb-1">Dosage *</label>
                        <Input value={med.dosage} onChange={(e) => updateMedication(index, 'dosage', e.target.value)} placeholder="e.g., 500mg" required />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-300 mb-1">Frequency</label>
                        <Select value={med.frequency} onValueChange={(v) => updateMedication(index, 'frequency', v)}>
                          <option value="">Select...</option>
                          <option value="ONCE_DAILY">Once daily</option>
                          <option value="TWICE_DAILY">Twice daily</option>
                          <option value="THREE_TIMES_DAILY">Three times daily</option>
                          <option value="FOUR_TIMES_DAILY">Four times daily</option>
                          <option value="AS_NEEDED">As needed</option>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-300 mb-1">Duration</label>
                        <Input value={med.duration} onChange={(e) => updateMedication(index, 'duration', e.target.value)} placeholder="e.g., 7 days" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-300 mb-1">Instructions</label>
                        <Input value={med.instructions} onChange={(e) => updateMedication(index, 'instructions', e.target.value)} placeholder="e.g., After meals" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/doctor-dashboard')}>Cancel</Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
                {submitting ? 'Creating...' : <><Save className="w-4 h-4 mr-2" />Create Prescription</>}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
