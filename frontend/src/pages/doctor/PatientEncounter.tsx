import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  AlertTriangle,
  User,
  Activity,
  FileText,
  Pill,
  TestTube,
  Syringe,
  Search,
  X,
  Users,
  RefreshCw,
} from 'lucide-react';
import { PrescriptionModal } from '../../components/doctor/PrescriptionModal';
import { LabOrderModal } from '../../components/doctor/LabOrderModal';
import { InjectionOrderModal } from '../../components/doctor/InjectionOrderModal';

interface PatientData {
  visit: {
    id: string;
    visitNumber: number;
    visitType: string;
    visitDate: string;
    status: string;
  };
  patient: {
    id: string;
    cardNumber: string;
    fullName: string;
    sex: string;
    age: number;
    phone: string;
    dateOfBirth: string;
    allergies?: string;
    hasAllergies: boolean;
    hasDiabetes: boolean;
    hasHypertension: boolean;
    hasAsthma: boolean;
    currentMedications?: string;
    medicalHistory?: string;
  };
  currentTriage?: {
    chiefComplaint?: string;
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
  };
}

interface SearchPatient {
  id: string;
  cardNumber: string;
  fullName: string;
  age: number;
  sex: string;
  phone: string;
  photoUrl?: string;
  lastVisit?: string;
  visitCount: number;
}

export const PatientEncounter = () => {
  const { visitId } = useParams<{ visitId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  
  // Encounter form state
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [historyOfPresentIllness, setHistoryOfPresentIllness] = useState('');
  const [reviewOfSystems, setReviewOfSystems] = useState('');
  const [physicalExamination, setPhysicalExamination] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [icdCodes, setIcdCodes] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [followUpInstructions, setFollowUpInstructions] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');
  
  // Modal states
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showLabOrderModal, setShowLabOrderModal] = useState(false);
  const [showInjectionModal, setShowInjectionModal] = useState(false);
  
  // Track if encounter is saved
  const [encounterSaved, setEncounterSaved] = useState(false);
  
  // Patient search state
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'phone' | 'card'>('card');
  const [searchResults, setSearchResults] = useState<SearchPatient[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadPatientData();
  }, [visitId]);

  const loadPatientData = async () => {
    try {
      const response = await api.get(`/doctor/visit/${visitId}`);
      const data = response.data.data;
      setPatientData(data);
      
      // Pre-fill chief complaint from triage
      if (data.currentTriage?.chiefComplaint) {
        setChiefComplaint(data.currentTriage.chiefComplaint);
      }
    } catch (error: any) {
      console.error('[PatientEncounter] Load failed:', error);
      toast.error(error.response?.data?.error || 'Failed to load patient data');
      navigate('/doctor-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEncounter = async () => {
    if (!chiefComplaint.trim() || !diagnosis.trim()) {
      toast.error('Chief complaint and diagnosis are required');
      return;
    }

    setSaving(true);
    try {
      await api.post('/doctor/encounter', {
        visitId,
        chiefComplaint: chiefComplaint.trim(),
        historyOfPresentIllness: historyOfPresentIllness.trim() || null,
        reviewOfSystems: reviewOfSystems.trim() || null,
        physicalExamination: physicalExamination.trim() || null,
        diagnosis: diagnosis.trim(),
        icdCodes: icdCodes.trim() || null,
        treatmentPlan: treatmentPlan.trim() || null,
        followUpInstructions: followUpInstructions.trim() || null,
        followUpDate: followUpDate || null,
        notes: notes.trim() || null,
      });
      
      setEncounterSaved(true);
      toast.success('Encounter saved');
    } catch (error: any) {
      console.error('[PatientEncounter] Save failed:', error);
      toast.error(error.response?.data?.error || 'Failed to save encounter');
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteVisit = async () => {
    if (!encounterSaved) {
      toast.error('Please save the encounter first');
      return;
    }

    try {
      await api.patch(`/doctor/visit/${visitId}/complete`);
      toast.success('Visit completed');
      navigate('/doctor-dashboard');
    } catch (error: any) {
      console.error('[PatientEncounter] Complete failed:', error);
      toast.error(error.response?.data?.error || 'Failed to complete visit');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Build search params based on search type
      const params: any = { limit: 20 };
      
      if (searchBy === 'card') {
        params.cardNumber = searchQuery.trim();
      } else if (searchBy === 'name') {
        params.fullName = searchQuery.trim();
      } else if (searchBy === 'phone') {
        params.phone = searchQuery.trim();
      }
      
      console.log('[PatientEncounter] Searching with params:', params);
      
      const resp = await api.get('/patients', { params });
      const patients = resp.data?.data?.patients || [];
      
      console.log('[PatientEncounter] Found patients:', patients.length);
      
      const mapped: SearchPatient[] = patients.map((p: any) => {
        const lastVisit = p.visits?.[0]?.visitDate || p.registrationDate || new Date().toISOString();
        const age = Math.max(
          0,
          new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear()
        );
        return {
          id: p.id,
          cardNumber: p.cardNumber,
          fullName: p.fullName,
          age,
          sex: p.sex,
          phone: p.phone || '-',
          photoUrl: p.photoUrl || undefined,
          lastVisit,
          visitCount: p.visits?.length || 0,
        };
      });
      
      setSearchResults(mapped);
      
      if (mapped.length === 0) {
        toast.info('No matching patient found.');
      }
    } catch (error) {
      console.error('[PatientEncounter] Search failed:', error);
      setSearchResults([]);
      toast.error('Patient search failed.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPatient = async (patient: SearchPatient) => {
    try {
      // Create a new visit for this patient
      const resp = await api.post('/visits', {
        patientId: patient.id,
        visitType: 'REPEAT',
        serviceType: 'OPD',
      });
      
      const newVisitId = resp.data?.data?.id;
      
      if (newVisitId) {
        toast.success(`Switched to ${patient.fullName}`);
        // Navigate to the new encounter page
        navigate(`/doctor/encounter/${newVisitId}`);
        // Close search and reload
        closeSearch();
        window.location.reload();
      }
    } catch (error: any) {
      console.error('[PatientEncounter] Failed to create visit:', error);
      toast.error(error.response?.data?.error || 'Failed to switch patient');
    }
  };

  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-400">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate('/doctor-dashboard')}
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowSearch(true)}
              variant="outline"
            >
              <Search className="w-4 h-4 mr-2" />
              Change Patient
            </Button>
            <Button
              onClick={handleSaveEncounter}
              variant="primary"
              isLoading={saving}
              disabled={!chiefComplaint.trim() || !diagnosis.trim()}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Encounter
            </Button>
            <Button
              onClick={handleCompleteVisit}
              variant="success"
              disabled={!encounterSaved}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Visit
            </Button>
          </div>
        </div>

        {/* Patient Search Modal */}
        {showSearch && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card variant="elevated" className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Search Patient</CardTitle>
                    <p className="text-sm text-slate-400 mt-1">Find patient by card number, name, or phone</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={closeSearch}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Type Selector */}
                <div className="flex gap-2">
                  {[
                    { id: 'card', label: 'Card Number', icon: '🎫' },
                    { id: 'name', label: 'Name', icon: '👤' },
                    { id: 'phone', label: 'Phone', icon: '📱' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSearchBy(type.id as any)}
                      className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        searchBy === type.id
                          ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg'
                          : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="mr-2">{type.icon}</span>
                      {type.label}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      placeholder={
                        searchBy === 'card'
                          ? 'Enter card number (e.g., RH20240001)'
                          : searchBy === 'name'
                          ? 'Enter patient name'
                          : 'Enter phone number'
                      }
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                      autoFocus
                    />
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={handleSearch} 
                    disabled={isSearching || !searchQuery.trim()}
                  >
                    {isSearching ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-300">
                        Found {searchResults.length} patient(s)
                      </h3>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {searchResults.map((patient) => (
                        <div
                          key={patient.id}
                          onClick={() => handleSelectPatient(patient)}
                          className="flex items-center gap-4 p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500 transition-all cursor-pointer"
                        >
                          {/* Photo */}
                          <div className="h-14 w-14 rounded-xl bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {patient.photoUrl ? (
                              <img 
                                src={patient.photoUrl} 
                                alt={patient.fullName} 
                                className="h-full w-full object-cover" 
                              />
                            ) : (
                              <Users className="w-7 h-7 text-slate-500" />
                            )}
                          </div>

                          {/* Patient Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-bold text-slate-50">{patient.fullName}</h3>
                              <Badge variant="info" size="sm">
                                {patient.cardNumber}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              <span>{patient.age}y • {patient.sex === 'MALE' ? 'Male' : 'Female'}</span>
                              <span>📱 {patient.phone}</span>
                              <span>🔄 {patient.visitCount} visits</span>
                            </div>
                          </div>

                          {/* Action Indicator */}
                          <div className="flex-shrink-0">
                            <Search className="w-5 h-5 text-slate-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {searchQuery && searchResults.length === 0 && !isSearching && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-50 mb-2">No Patient Found</h3>
                    <p className="text-slate-400">
                      No patient found with the search criteria. Try a different search term.
                    </p>
                  </div>
                )}

                {/* Info */}
                {!searchQuery && (
                  <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Search className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-1">Quick Patient Search</h4>
                      <p className="text-sm text-slate-400">
                        Search for any patient to switch to their consultation. Select a search type and enter the patient details.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Patient Info Card */}
        <Card className="border-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-24 w-24 rounded-xl bg-slate-700 flex items-center justify-center">
                <User className="w-12 h-12 text-slate-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-slate-50">
                    {patientData.patient.fullName}
                  </h2>
                  <Badge variant="info">{patientData.patient.cardNumber}</Badge>
                  <Badge variant="default">Visit #{patientData.visit.visitNumber}</Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-slate-400">Age/Sex:</span>
                    <span className="text-slate-200 ml-2">
                      {patientData.patient.age}y / {patientData.patient.sex}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Phone:</span>
                    <span className="text-slate-200 ml-2">{patientData.patient.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Visit Type:</span>
                    <span className="text-slate-200 ml-2">{patientData.visit.visitType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Date:</span>
                    <span className="text-slate-200 ml-2">
                      {new Date(patientData.visit.visitDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Medical Alerts */}
                {(patientData.patient.hasAllergies || patientData.patient.hasDiabetes || 
                  patientData.patient.hasHypertension || patientData.patient.hasAsthma) && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {patientData.patient.hasAllergies && (
                      <Badge variant="error">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Allergies: {patientData.patient.allergies || 'Yes'}
                      </Badge>
                    )}
                    {patientData.patient.hasDiabetes && (
                      <Badge variant="warning">Diabetes</Badge>
                    )}
                    {patientData.patient.hasHypertension && (
                      <Badge variant="warning">Hypertension</Badge>
                    )}
                    {patientData.patient.hasAsthma && (
                      <Badge variant="warning">Asthma</Badge>
                    )}
                  </div>
                )}

                {/* Current Medications */}
                {patientData.patient.currentMedications && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <p className="text-sm text-amber-400 font-semibold mb-1">Current Medications:</p>
                    <p className="text-sm text-slate-200">{patientData.patient.currentMedications}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Vitals */}
            {patientData.currentTriage && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Current Vitals</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {patientData.currentTriage.temperature && (
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-400">Temperature</p>
                      <p className="text-lg font-bold text-slate-50">
                        {patientData.currentTriage.temperature}°C
                      </p>
                    </div>
                  )}
                  {patientData.currentTriage.bloodPressure && (
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-400">Blood Pressure</p>
                      <p className="text-lg font-bold text-slate-50">
                        {patientData.currentTriage.bloodPressure}
                      </p>
                    </div>
                  )}
                  {patientData.currentTriage.heartRate && (
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-400">Heart Rate</p>
                      <p className="text-lg font-bold text-slate-50">
                        {patientData.currentTriage.heartRate} bpm
                      </p>
                    </div>
                  )}
                  {patientData.currentTriage.respiratoryRate && (
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-400">Resp. Rate</p>
                      <p className="text-lg font-bold text-slate-50">
                        {patientData.currentTriage.respiratoryRate} /min
                      </p>
                    </div>
                  )}
                  {patientData.currentTriage.oxygenSaturation && (
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-400">SpO2</p>
                      <p className="text-lg font-bold text-slate-50">
                        {patientData.currentTriage.oxygenSaturation}%
                      </p>
                    </div>
                  )}
                  {patientData.currentTriage.weight && (
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-400">Weight</p>
                      <p className="text-lg font-bold text-slate-50">
                        {patientData.currentTriage.weight} kg
                      </p>
                    </div>
                  )}
                  {patientData.currentTriage.height && (
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-400">Height</p>
                      <p className="text-lg font-bold text-slate-50">
                        {patientData.currentTriage.height} cm
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => setShowPrescriptionModal(true)}
            variant="outline"
            className="h-auto py-6 flex flex-col items-center gap-2 bg-green-500/10 border-green-500 hover:bg-green-500/20"
            disabled={!encounterSaved}
          >
            <Pill className="w-8 h-8 text-green-500" />
            <span className="text-lg font-semibold">Send to Pharmacy</span>
            <span className="text-xs text-slate-400">Create prescription</span>
          </Button>

          <Button
            onClick={() => setShowLabOrderModal(true)}
            variant="outline"
            className="h-auto py-6 flex flex-col items-center gap-2 bg-purple-500/10 border-purple-500 hover:bg-purple-500/20"
            disabled={!encounterSaved}
          >
            <TestTube className="w-8 h-8 text-purple-500" />
            <span className="text-lg font-semibold">Send to Laboratory</span>
            <span className="text-xs text-slate-400">Order lab tests</span>
          </Button>

          <Button
            onClick={() => setShowInjectionModal(true)}
            variant="outline"
            className="h-auto py-6 flex flex-col items-center gap-2 bg-orange-500/10 border-orange-500 hover:bg-orange-500/20"
            disabled={!encounterSaved}
          >
            <Syringe className="w-8 h-8 text-orange-500" />
            <span className="text-lg font-semibold">Send to Injection Room</span>
            <span className="text-xs text-slate-400">Order injection</span>
          </Button>
        </div>

        {!encounterSaved && (
          <Card className="border-amber-500 bg-amber-500/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                <p className="text-amber-400">
                  Save the encounter first before creating orders (prescriptions, lab tests, injections)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Encounter Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Consultation Record
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Chief Complaint */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Chief Complaint <span className="text-red-400">*</span>
              </label>
              <textarea
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-50 focus:border-blue-500 focus:outline-none resize-none"
                rows={2}
                placeholder="Patient's main complaint or reason for visit"
                required
              />
            </div>

            {/* History of Present Illness */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                History of Present Illness
              </label>
              <textarea
                value={historyOfPresentIllness}
                onChange={(e) => setHistoryOfPresentIllness(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-50 focus:border-blue-500 focus:outline-none resize-none"
                rows={4}
                placeholder="Detailed history of the current illness, onset, duration, severity, etc."
              />
            </div>

            {/* Review of Systems */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Review of Systems
              </label>
              <textarea
                value={reviewOfSystems}
                onChange={(e) => setReviewOfSystems(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-50 focus:border-blue-500 focus:outline-none resize-none"
                rows={3}
                placeholder="Systematic review of body systems"
              />
            </div>

            {/* Physical Examination */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Physical Examination
              </label>
              <textarea
                value={physicalExamination}
                onChange={(e) => setPhysicalExamination(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-50 focus:border-blue-500 focus:outline-none resize-none"
                rows={4}
                placeholder="Findings from physical examination"
              />
            </div>

            {/* Diagnosis */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Diagnosis <span className="text-red-400">*</span>
              </label>
              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-50 focus:border-blue-500 focus:outline-none resize-none"
                rows={2}
                placeholder="Primary and secondary diagnoses"
                required
              />
            </div>

            {/* ICD Codes */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                ICD-10 Codes
              </label>
              <input
                type="text"
                value={icdCodes}
                onChange={(e) => setIcdCodes(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-50 focus:border-blue-500 focus:outline-none"
                placeholder="e.g., J02.9, R50.9"
              />
            </div>

            {/* Treatment Plan */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Treatment Plan
              </label>
              <textarea
                value={treatmentPlan}
                onChange={(e) => setTreatmentPlan(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-50 focus:border-blue-500 focus:outline-none resize-none"
                rows={4}
                placeholder="Detailed treatment plan and recommendations"
              />
            </div>

            {/* Follow-up Instructions */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Follow-up Instructions
              </label>
              <textarea
                value={followUpInstructions}
                onChange={(e) => setFollowUpInstructions(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-50 focus:border-blue-500 focus:outline-none resize-none"
                rows={3}
                placeholder="Instructions for patient follow-up"
              />
            </div>

            {/* Follow-up Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Follow-up Date
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-50 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Additional Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-50 focus:border-blue-500 focus:outline-none resize-none"
                rows={3}
                placeholder="Any additional notes or observations"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showPrescriptionModal && (
        <PrescriptionModal
          visitId={visitId!}
          patientId={patientData.patient.id}
          patientName={patientData.patient.fullName}
          onClose={() => setShowPrescriptionModal(false)}
          onSuccess={() => {
            setShowPrescriptionModal(false);
            toast.success('Prescription sent to pharmacy');
          }}
        />
      )}

      {showLabOrderModal && (
        <LabOrderModal
          visitId={visitId!}
          patientName={patientData.patient.fullName}
          onClose={() => setShowLabOrderModal(false)}
          onSuccess={() => {
            setShowLabOrderModal(false);
            toast.success('Lab order sent to laboratory');
          }}
        />
      )}

      {showInjectionModal && (
        <InjectionOrderModal
          visitId={visitId!}
          patientId={patientData.patient.id}
          patientName={patientData.patient.fullName}
          onClose={() => setShowInjectionModal(false)}
          onSuccess={() => {
            setShowInjectionModal(false);
            toast.success('Injection order sent to injection room');
          }}
        />
      )}
    </div>
  );
};
