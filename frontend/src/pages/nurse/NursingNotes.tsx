import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import {
  ArrowLeft,
  Save,
  FileText,
  AlertTriangle,
  Search,
  Clock,
  Lock,
  Edit,
  Eye,
} from 'lucide-react';
import { formatDateTime } from '../../lib/nurseUtils';

interface Patient {
  id: string;
  cardNumber: string;
  fullName: string;
  age?: number;
  sex: 'MALE' | 'FEMALE';
  photoUrl?: string;
}

interface Visit {
  id: string;
  visitDate: string;
  chiefComplaint?: string;
}

interface NursingNote {
  id: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  createdAt: string;
  createdBy: string;
  isLocked: boolean;
  canEdit: boolean;
}

interface NoteFormData {
  visitId: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  noteType: 'ADMISSION' | 'PROGRESS' | 'DISCHARGE' | 'INCIDENT' | '';
}

export const NursingNotes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeVisit, setActiveVisit] = useState<Visit | null>(null);
  const [existingNotes, setExistingNotes] = useState<NursingNote[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const [formData, setFormData] = useState<NoteFormData>({
    visitId: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    noteType: '',
  });

  const noteTemplates = {
    ADMISSION: {
      subjective: 'Patient admitted with...',
      objective: 'Vital signs: BP ___, HR ___, Temp ___, RR ___, SpO2 ___\nGeneral appearance: \nLevel of consciousness: ',
      assessment: 'Patient appears...',
      plan: 'Monitor vital signs every ___ hours\nAdminister medications as ordered\nProvide comfort measures',
    },
    PROGRESS: {
      subjective: 'Patient reports...',
      objective: 'Current vital signs: \nActivity level: \nIntake/Output: ',
      assessment: 'Patient condition is...',
      plan: 'Continue current care plan\nMonitor for changes',
    },
    DISCHARGE: {
      subjective: 'Patient ready for discharge, reports...',
      objective: 'Stable vital signs\nAmbulating independently\nNo acute distress',
      assessment: 'Patient meets discharge criteria',
      plan: 'Discharge instructions provided\nFollow-up appointment scheduled\nPrescriptions given',
    },
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setSearching(true);
    try {
      const response = await api.get(`/patients/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data.data);
      if (response.data.data.length === 0) {
        toast.info('No patients found');
      }
    } catch (error) {
      console.error('Search failed', error);
      toast.error('Failed to search patients');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectPatient = async (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchResults([]);
    setSearchQuery('');
    
    // Load active visit
    setLoading(true);
    try {
      const [visitResp, notesResp] = await Promise.all([
        api.get(`/patients/${patient.id}/active-visit`),
        api.get(`/patients/${patient.id}/nursing-notes`),
      ]);
      
      if (visitResp.data.data) {
        setActiveVisit(visitResp.data.data);
        setFormData(prev => ({ ...prev, visitId: visitResp.data.data.id }));
      } else {
        toast.error('No active visit found for this patient');
        setSelectedPatient(null);
      }
      
      setExistingNotes(notesResp.data.data || []);
    } catch (error) {
      console.error('Failed to load visit', error);
      toast.error('Failed to load patient visit');
      setSelectedPatient(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof NoteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const applyTemplate = (type: keyof typeof noteTemplates) => {
    const template = noteTemplates[type];
    setFormData(prev => ({
      ...prev,
      subjective: template.subjective,
      objective: template.objective,
      assessment: template.assessment,
      plan: template.plan,
      noteType: type,
    }));
    toast.success('Template applied');
  };

  const validateForm = (): boolean => {
    if (!formData.visitId) {
      setError('No active visit selected');
      return false;
    }
    if (!formData.subjective.trim()) {
      setError('Subjective section is required');
      return false;
    }
    if (!formData.objective.trim()) {
      setError('Objective section is required');
      return false;
    }
    if (!formData.assessment.trim()) {
      setError('Assessment section is required');
      return false;
    }
    if (!formData.plan.trim()) {
      setError('Plan section is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      await api.post('/nurse/nursing-notes', formData);
      toast.success('Nursing note saved successfully');
      
      // Reload notes
      const notesResp = await api.get(`/patients/${selectedPatient?.id}/nursing-notes`);
      setExistingNotes(notesResp.data.data || []);
      
      // Reset form
      setFormData({
        visitId: formData.visitId,
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
        noteType: '',
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to save nursing note';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/nurse-dashboard')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-50">Nursing Notes</h1>
              <p className="text-slate-400 mt-1">SOAP-N format documentation</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert className="border-red-500 bg-red-950/20">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Search & Info */}
          <div className="lg:col-span-1 space-y-6">
            {!selectedPatient ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Search Patient
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <Input
                      type="text"
                      placeholder="Search by name or card..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button
                      onClick={handleSearch}
                      disabled={searching}
                      variant="primary"
                      className="w-full"
                    >
                      {searching ? 'Searching...' : 'Search'}
                    </Button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="space-y-2">
                      {searchResults.map((patient) => (
                        <button
                          key={patient.id}
                          onClick={() => handleSelectPatient(patient)}
                          className="w-full p-3 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors text-left"
                        >
                          <p className="font-medium text-slate-50">{patient.fullName}</p>
                          <p className="text-sm text-slate-400">Card #{patient.cardNumber}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="border-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-sm">Selected Patient</span>
                      <Button
                        onClick={() => {
                          setSelectedPatient(null);
                          setActiveVisit(null);
                          setExistingNotes([]);
                          setFormData({
                            visitId: '',
                            subjective: '',
                            objective: '',
                            assessment: '',
                            plan: '',
                            noteType: '',
                          });
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Change
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-3">
                      <ProfileAvatar
                        src={selectedPatient.photoUrl}
                        name={selectedPatient.fullName}
                        size="md"
                      />
                      <div>
                        <p className="font-semibold text-slate-50">{selectedPatient.fullName}</p>
                        <p className="text-sm text-slate-400">Card #{selectedPatient.cardNumber}</p>
                      </div>
                    </div>
                    {activeVisit && (
                      <div className="text-sm text-slate-400">
                        <p>Visit: {formatDateTime(new Date(activeVisit.visitDate))}</p>
                        {activeVisit.chiefComplaint && (
                          <p className="mt-1">Complaint: {activeVisit.chiefComplaint}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Note Templates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Quick Templates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      onClick={() => applyTemplate('ADMISSION')}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Admission Note
                    </Button>
                    <Button
                      onClick={() => applyTemplate('PROGRESS')}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Progress Note
                    </Button>
                    <Button
                      onClick={() => applyTemplate('DISCHARGE')}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Discharge Note
                    </Button>
                  </CardContent>
                </Card>

                {/* Previous Notes */}
                {existingNotes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-sm">Previous Notes ({existingNotes.length})</span>
                        <Button
                          onClick={() => setShowHistory(!showHistory)}
                          variant="outline"
                          size="sm"
                        >
                          {showHistory ? 'Hide' : 'Show'}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    {showHistory && (
                      <CardContent>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {existingNotes.map((note) => (
                            <div
                              key={note.id}
                              className="p-3 rounded-lg border border-slate-700 text-sm"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-400">
                                  {formatDateTime(new Date(note.createdAt))}
                                </span>
                                {note.isLocked && (
                                  <Lock className="w-3 h-3 text-slate-500" />
                                )}
                              </div>
                              <p className="text-slate-300 text-xs line-clamp-2">
                                {note.subjective}
                              </p>
                              <p className="text-slate-500 text-xs mt-1">By: {note.createdBy}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )}
              </>
            )}
          </div>

          {/* SOAP-N Form */}
          <div className="lg:col-span-2">
            {selectedPatient && activeVisit ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      New Nursing Note
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Note Type (Optional)
                      </label>
                      <Select
                        value={formData.noteType}
                        onValueChange={(value) => handleInputChange('noteType', value)}
                      >
                        <option value="">Select type...</option>
                        <option value="ADMISSION">Admission</option>
                        <option value="PROGRESS">Progress</option>
                        <option value="DISCHARGE">Discharge</option>
                        <option value="INCIDENT">Incident</option>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        S - Subjective (Patient's statements) *
                      </label>
                      <Textarea
                        value={formData.subjective}
                        onChange={(e) => handleInputChange('subjective', e.target.value)}
                        placeholder="What the patient says... complaints, symptoms, feelings..."
                        rows={3}
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        O - Objective (Your observations) *
                      </label>
                      <Textarea
                        value={formData.objective}
                        onChange={(e) => handleInputChange('objective', e.target.value)}
                        placeholder="Vital signs, physical findings, observations..."
                        rows={4}
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        A - Assessment (Your nursing assessment) *
                      </label>
                      <Textarea
                        value={formData.assessment}
                        onChange={(e) => handleInputChange('assessment', e.target.value)}
                        placeholder="Your professional assessment of the patient's condition..."
                        rows={3}
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        P - Plan (Nursing interventions) *
                      </label>
                      <Textarea
                        value={formData.plan}
                        onChange={(e) => handleInputChange('plan', e.target.value)}
                        placeholder="Nursing care plan, interventions, monitoring..."
                        rows={3}
                        className="w-full"
                        required
                      />
                    </div>

                    <Alert className="border-blue-500 bg-blue-950/20">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <AlertDescription className="text-blue-300 text-sm">
                        Note: You will have 15 minutes to edit this note after saving. After that, it will be locked.
                      </AlertDescription>
                    </Alert>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setFormData({
                            visitId: formData.visitId,
                            subjective: '',
                            objective: '',
                            assessment: '',
                            plan: '',
                            noteType: '',
                          });
                        }}
                      >
                        Clear Form
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
                            Save Note
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Select a patient to create a nursing note</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
