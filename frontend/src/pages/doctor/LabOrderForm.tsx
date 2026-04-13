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
import { ArrowLeft, Save, AlertTriangle, Search, TestTube, User } from 'lucide-react';

interface Patient { 
  id: string; 
  cardNumber: string; 
  fullName: string;
  sex?: string;
  age?: number;
  photoUrl?: string;
  gender?: string; // Alternative to sex
}

interface Test { id: string; name: string; category: string; price: number; }

interface LabOrderFormProps {
  patient?: Patient;
  visitId?: string;
  embedded?: boolean;
}

export const LabOrderForm = ({ patient: patientProp, visitId: visitIdProp, embedded }: LabOrderFormProps = {}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientIdFromUrl = searchParams.get('patientId');
  const visitIdFromUrl = searchParams.get('visitId');
  
  // Use prop values if provided (embedded mode), otherwise use URL params
  const visitId = visitIdProp || visitIdFromUrl;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [queuePatients, setQueuePatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patientProp || null);
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [priority, setPriority] = useState<'ROUTINE' | 'URGENT' | 'STAT'>('ROUTINE');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
    
    // If patient is provided as prop, skip loading
    if (patientProp) {
      setLoading(false);
      return;
    }
    
    loadQueuePatients();
    if (patientIdFromUrl) {
      loadPatient(patientIdFromUrl);
    } else {
      // Try to load current consultation
      loadCurrentConsultation();
    }
  }, [patientIdFromUrl, patientProp]);

  const loadQueuePatients = async () => {
    try {
      const response = await api.get('/doctor/queue');
      console.log('Queue response:', response.data);
      const queue = response.data.data || response.data || [];
      
      const mappedPatients = queue.map((item: any) => {
        // Handle different response formats
        const patient = item.patient || item;
        return {
          id: patient.id,
          fullName: patient.fullName,
          cardNumber: patient.cardNumber,
          sex: patient.sex,
          age: patient.age,
          photoUrl: patient.photoUrl,
        };
      });
      
      setQueuePatients(mappedPatients);
      console.log('Loaded queue patients:', mappedPatients);
    } catch (error: any) {
      console.error('Failed to load queue patients:', error);
      // Silent - no toast notification
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
        });
      }
    } catch (error) {
      // No current consultation - that's fine
      console.log('No current consultation');
    } finally {
      setLoading(false);
    }
  };

  const loadTests = async () => {
    // Define mock tests
    const mockTests = [
      { id: 'cbc', name: 'Complete Blood Count (CBC)', category: 'Hematology', price: 150 },
      { id: 'esr', name: 'Erythrocyte Sedimentation Rate (ESR)', category: 'Hematology', price: 80 },
      { id: 'blood-group', name: 'Blood Group & Rh', category: 'Hematology', price: 100 },
      { id: 'fbs', name: 'Fasting Blood Sugar (FBS)', category: 'Chemistry', price: 120 },
      { id: 'rbs', name: 'Random Blood Sugar (RBS)', category: 'Chemistry', price: 100 },
      { id: 'urinalysis', name: 'Urinalysis (Routine)', category: 'Urine', price: 90 },
      { id: 'hiv', name: 'HIV Rapid Test', category: 'Serology', price: 200 },
      { id: 'hbsag', name: 'HBsAg (Hepatitis B)', category: 'Serology', price: 180 },
      { id: 'malaria', name: 'Blood Film for Malaria', category: 'Parasitology', price: 120 },
      { id: 'stool', name: 'Stool Examination (Ova & Parasites)', category: 'Parasitology', price: 100 },
    ];

    try {
      console.log('Loading lab tests...');
      const response = await api.get('/lab/tests');
      console.log('Lab tests response:', response.data);
      const testsData = response.data.data || response.data || [];
      
      // If API returns empty or no tests, use mock tests
      if (!testsData || testsData.length === 0) {
        console.log('No tests from API, using mock tests');
        setTests(mockTests);
        // Silent - no toast notification
      } else {
        setTests(testsData);
        console.log('Loaded tests:', testsData.length);
      }
    } catch (error: any) {
      console.error('Failed to load tests:', error);
      console.error('Error response:', error.response?.data);
      
      // Fallback to mock tests when API fails
      setTests(mockTests);
      // Silent - no toast notification
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
    if (!selectedPatient || selectedTests.length === 0) {
      toast.error('Select patient and at least one test');
      return;
    }
    
    setSubmitting(true);
    try {
      console.log('[LabOrderForm] Submitting lab order:', {
        patientId: selectedPatient.id,
        visitId: visitIdFromUrl,
        testIds: selectedTests,
        priority,
        clinicalNotes: clinicalNotes.trim()
      });
      
      const response = await api.post('/doctor/lab-orders', {
        patientId: selectedPatient.id,
        visitId: visitIdFromUrl || undefined,
        testIds: selectedTests, // Send as array of IDs directly
        priority: priority,
        clinicalNotes: clinicalNotes.trim() || undefined,
      });
      
      console.log('[LabOrderForm] Lab order created successfully:', response.data);
      toast.success('Lab order created successfully!');
      
      // Navigate back to doctor dashboard
      setTimeout(() => {
        navigate('/doctor-dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('[LabOrderForm] Failed to create lab order:', error);
      console.error('[LabOrderForm] Error response:', error.response?.data);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create order';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Failed to create lab order');
    } finally {
      setSubmitting(false);
    }
  };

  const groupedTests = tests.reduce((acc, test) => {
    if (!acc[test.category]) acc[test.category] = [];
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, Test[]>);

  if (loading) {
    return (
      <div className={embedded ? "p-4" : "min-h-screen bg-gray-50 p-6"} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="text-center">
          <TestTube className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  const formContent = (
    <div className="space-y-6">
      {!embedded && (
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate(-1)} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Lab Order</h1>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Create a new laboratory test order</p>
          </div>
        </div>
      )}

        {!selectedPatient ? (
          <Card>
            <CardHeader><CardTitle>Select Patient</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  Select a patient from your queue or search for any patient
                </AlertDescription>
              </Alert>
              
              {/* Queue Patients */}
              {queuePatients.length > 0 ? (
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
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    No patients in your queue. Search for a patient below to create a lab order.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Search */}
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Select Tests</CardTitle></CardHeader>
              <CardContent>
                {tests.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      Loading tests... If this persists, please refresh the page.
                    </AlertDescription>
                  </Alert>
                ) : (
                  Object.entries(groupedTests).map(([category, categoryTests]) => (
                    <div key={category} className="mb-4">
                      <h3 className="font-semibold text-slate-50 dark:text-slate-50 mb-2">{category}</h3>
                      <div className="space-y-2">
                        {categoryTests.map(test => (
                          <label key={test.id} className="flex items-center gap-2 p-2 hover:bg-slate-700/50 rounded cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={selectedTests.includes(test.id)} 
                              onChange={(e) => {
                                if (e.target.checked) setSelectedTests([...selectedTests, test.id]);
                                else setSelectedTests(selectedTests.filter(id => id !== test.id));
                              }}
                              className="w-4 h-4"
                            />
                            <span className="text-slate-50 flex-1">{test.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Order Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                    <option value="ROUTINE">Routine</option>
                    <option value="URGENT">Urgent</option>
                    <option value="STAT">STAT</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Notes</label>
                  <Textarea value={clinicalNotes} onChange={(e) => setClinicalNotes(e.target.value)} rows={3} />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              {!embedded && (
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/doctor-dashboard')}>Cancel</Button>
              )}
              <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
                {submitting ? 'Creating...' : <><Save className="w-4 h-4 mr-2" />Create Order</>}
              </Button>
            </div>
          </form>
        )}
      </div>
    );
  
  if (embedded) {
    return formContent;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
        {formContent}
      </div>
    </div>
  );
};
