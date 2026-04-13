import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ArrowLeft, Save, AlertTriangle, Search, FileText } from 'lucide-react';

interface Patient { id: string; cardNumber: string; fullName: string; age?: number; sex: 'MALE' | 'FEMALE'; }

export const MedicalCertificateForm = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    certificateType: 'EMPLOYMENT' as 'EMPLOYMENT' | 'MIGRATION' | 'SCHOOL' | 'INSURANCE',
    purpose: '',
    height: '',
    weight: '',
    bloodPressure: '',
    pulse: '',
    vision: '',
    hearing: '',
    cardiovascular: 'NORMAL',
    respiratory: 'NORMAL',
    abdomen: 'NORMAL',
    musculoskeletal: 'NORMAL',
    neurological: 'NORMAL',
    labInvestigations: '',
    finalResult: 'FIT' as 'FIT' | 'UNFIT' | 'FIT_WITH_RESTRICTIONS',
    restrictions: '',
    remarks: '',
  });

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
    if (!selectedPatient) {
      setError('Please select a patient');
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await api.post('/certificates/medical', {
        patientId: selectedPatient.id,
        ...formData,
      });
      toast.success('Medical certificate generated');
      window.open(`/api/v1/certificates/medical/${response.data.data.id}/pdf`, '_blank');
      navigate('/doctor-dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate certificate');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate('/doctor-dashboard')} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
          <h1 className="text-3xl font-bold text-slate-50">Medical Certificate</h1>
        </div>

        {error && (
          <Alert className="border-red-500 bg-red-950/20">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {!selectedPatient ? (
          <Card>
            <CardHeader><CardTitle>Search Patient</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                <Button onClick={handleSearch}><Search className="w-4 h-4 mr-2" />Search</Button>
              </div>
              {patients.map(p => (
                <button key={p.id} onClick={() => setSelectedPatient(p)} className="w-full p-3 border border-slate-700 rounded hover:border-blue-500 text-left">
                  <p className="text-slate-50">{p.fullName}</p>
                  <p className="text-sm text-slate-400">Card #{p.cardNumber} • {p.sex} • {p.age || 'Age unknown'}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-blue-500">
              <CardHeader><CardTitle>Patient: {selectedPatient.fullName}</CardTitle></CardHeader>
            </Card>

            <Card>
              <CardHeader><CardTitle>Certificate Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Certificate Type *</label>
                    <Select value={formData.certificateType} onValueChange={(v: any) => setFormData({...formData, certificateType: v})} required>
                      <option value="EMPLOYMENT">Employment</option>
                      <option value="MIGRATION">Migration</option>
                      <option value="SCHOOL">School</option>
                      <option value="INSURANCE">Insurance</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Purpose</label>
                    <Input value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Physical Examination</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Height (cm)</label>
                    <Input type="number" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Weight (kg)</label>
                    <Input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Blood Pressure</label>
                    <Input value={formData.bloodPressure} onChange={(e) => setFormData({...formData, bloodPressure: e.target.value})} placeholder="120/80" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Pulse</label>
                    <Input value={formData.pulse} onChange={(e) => setFormData({...formData, pulse: e.target.value})} placeholder="72" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>System Examination</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {['cardiovascular', 'respiratory', 'abdomen', 'musculoskeletal', 'neurological'].map(system => (
                  <div key={system} className="grid grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-slate-300 capitalize">{system}</label>
                    <Select value={formData[system as keyof typeof formData] as string} onValueChange={(v) => setFormData({...formData, [system]: v})}>
                      <option value="NORMAL">Normal</option>
                      <option value="ABNORMAL">Abnormal</option>
                    </Select>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Final Assessment</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Lab Investigations</label>
                  <Textarea value={formData.labInvestigations} onChange={(e) => setFormData({...formData, labInvestigations: e.target.value})} rows={2} />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Final Result *</label>
                  <Select value={formData.finalResult} onValueChange={(v: any) => setFormData({...formData, finalResult: v})} required>
                    <option value="FIT">Fit</option>
                    <option value="UNFIT">Unfit</option>
                    <option value="FIT_WITH_RESTRICTIONS">Fit with Restrictions</option>
                  </Select>
                </div>
                {formData.finalResult === 'FIT_WITH_RESTRICTIONS' && (
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Restrictions</label>
                    <Textarea value={formData.restrictions} onChange={(e) => setFormData({...formData, restrictions: e.target.value})} rows={2} />
                  </div>
                )}
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Remarks</label>
                  <Textarea value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} rows={2} />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/doctor-dashboard')}>Cancel</Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
                {submitting ? 'Generating...' : <><Save className="w-4 h-4 mr-2" />Generate Certificate</>}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
