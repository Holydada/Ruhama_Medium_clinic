import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import {
  Activity,
  Users,
  Clock,
  AlertTriangle,
  Stethoscope,
  RefreshCw,
  ArrowRight,
  Search,
  X,
} from 'lucide-react';

interface QueuePatient {
  id: string;
  visitId: string;
  visitNumber: number;
  visitType: string;
  status: string;
  visitDate: string;
  patient: {
    id: string;
    fullName: string;
    cardNumber: string;
    sex: string;
    age: number;
    phone: string;
    photoUrl?: string;
    allergies?: string;
    hasAllergies: boolean;
    hasDiabetes: boolean;
    hasHypertension: boolean;
    currentMedications?: string;
  };
  chiefComplaint?: string;
  vitals?: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
  };
  triageLevel?: string;
}

interface DoctorStats {
  patientsWaiting: number;
  patientsInProgress: number;
  patientsCompleted: number;
  totalToday: number;
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

export const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DoctorStats>({
    patientsWaiting: 0,
    patientsInProgress: 0,
    patientsCompleted: 0,
    totalToday: 0,
  });
  const [queuePatients, setQueuePatients] = useState<QueuePatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Patient search state
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'phone' | 'card'>('card');
  const [searchResults, setSearchResults] = useState<SearchPatient[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadDashboard();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadDashboard(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    
    try {
      // Load queue and stats in parallel
      const [queueResp, statsResp] = await Promise.all([
        api.get('/doctor/queue'),
        api.get('/doctor/stats')
      ]);
      
      const queue = queueResp.data.data || [];
      const statsData = statsResp.data.data || {};
      
      setQueuePatients(queue);
      setStats(statsData);
    } catch (error: any) {
      console.error('[DoctorDashboard] Load failed:', error);
      if (!silent) {
        toast.error(error.response?.data?.error || 'Failed to load dashboard');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleStartConsultation = (visitId: string) => {
    navigate(`/doctor/encounter/${visitId}`);
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
      
      console.log('[DoctorDashboard] Searching with params:', params);
      
      const resp = await api.get('/patients', { params });
      const patients = resp.data?.data?.patients || [];
      
      console.log('[DoctorDashboard] Found patients:', patients.length);
      
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
      console.error('[DoctorDashboard] Search failed:', error);
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
      
      const visitId = resp.data?.data?.id;
      
      if (visitId) {
        toast.success(`Starting consultation for ${patient.fullName}`);
        // Navigate to encounter page
        navigate(`/doctor/encounter/${visitId}`);
      }
    } catch (error: any) {
      console.error('[DoctorDashboard] Failed to create visit:', error);
      toast.error(error.response?.data?.error || 'Failed to start consultation');
    }
  };

  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const getTriageLevelColor = (level?: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'URGENT': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      case 'SEMI_URGENT': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'NON_URGENT': return 'bg-green-500/20 text-green-400 border-green-500';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Doctor Dashboard</h1>
            <p className="text-slate-400 mt-1">
              {queuePatients.length} {queuePatients.length === 1 ? 'patient' : 'patients'} waiting
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowSearch(true)}
              variant="primary"
            >
              <Search className="w-4 h-4 mr-2" />
              Change Patient
            </Button>
            <Button
              onClick={() => loadDashboard(false)}
              variant="outline"
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
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
                            <ArrowRight className="w-5 h-5 text-slate-400" />
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
                        Search for any patient to start a consultation. Select a search type and enter the patient details.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Waiting</p>
                  <p className="text-3xl font-bold text-yellow-500 mt-1">{stats.patientsWaiting}</p>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">In Progress</p>
                  <p className="text-3xl font-bold text-blue-500 mt-1">{stats.patientsInProgress}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Stethoscope className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Completed Today</p>
                  <p className="text-3xl font-bold text-green-500 mt-1">{stats.patientsCompleted}</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Users className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Today</p>
                  <p className="text-3xl font-bold text-purple-500 mt-1">{stats.totalToday}</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Activity className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Patient Queue ({queuePatients.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {queuePatients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-50 mb-2">No Patients Waiting</h3>
                <p className="text-slate-400">
                  Patients assigned by reception will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {queuePatients.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Patient Photo */}
                      <div className="h-20 w-20 rounded-xl bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.patient.photoUrl ? (
                          <img 
                            src={item.patient.photoUrl} 
                            alt={item.patient.fullName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Users className="w-10 h-10 text-slate-500" />
                        )}
                      </div>

                      {/* Patient Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-slate-50">
                            {item.patient.fullName}
                          </h3>
                          <Badge variant="info" size="sm">
                            {item.patient.cardNumber}
                          </Badge>
                          {item.triageLevel && (
                            <Badge className={getTriageLevelColor(item.triageLevel)} size="sm">
                              {item.triageLevel.replace('_', ' ')}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                          <div>
                            <span className="text-slate-400">Age/Sex:</span>
                            <span className="text-slate-200 ml-2">
                              {item.patient.age}y / {item.patient.sex}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Phone:</span>
                            <span className="text-slate-200 ml-2">{item.patient.phone || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Visit #:</span>
                            <span className="text-slate-200 ml-2">{item.visitNumber}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Type:</span>
                            <span className="text-slate-200 ml-2">{item.visitType}</span>
                          </div>
                        </div>

                        {item.chiefComplaint && (
                          <div className="mb-3 p-3 bg-slate-900/50 rounded-lg">
                            <p className="text-sm text-slate-400 mb-1">Chief Complaint:</p>
                            <p className="text-slate-200">{item.chiefComplaint}</p>
                          </div>
                        )}

                        {/* Vitals */}
                        {item.vitals && (
                          <div className="flex flex-wrap gap-3 mb-3">
                            {item.vitals.temperature && (
                              <div className="px-3 py-1 bg-slate-900/50 rounded-lg text-sm">
                                <span className="text-slate-400">Temp:</span>
                                <span className="text-slate-200 ml-2">{item.vitals.temperature}°C</span>
                              </div>
                            )}
                            {item.vitals.bloodPressure && (
                              <div className="px-3 py-1 bg-slate-900/50 rounded-lg text-sm">
                                <span className="text-slate-400">BP:</span>
                                <span className="text-slate-200 ml-2">{item.vitals.bloodPressure}</span>
                              </div>
                            )}
                            {item.vitals.heartRate && (
                              <div className="px-3 py-1 bg-slate-900/50 rounded-lg text-sm">
                                <span className="text-slate-400">HR:</span>
                                <span className="text-slate-200 ml-2">{item.vitals.heartRate} bpm</span>
                              </div>
                            )}
                            {item.vitals.oxygenSaturation && (
                              <div className="px-3 py-1 bg-slate-900/50 rounded-lg text-sm">
                                <span className="text-slate-400">SpO2:</span>
                                <span className="text-slate-200 ml-2">{item.vitals.oxygenSaturation}%</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Medical Alerts */}
                        {(item.patient.hasAllergies || item.patient.hasDiabetes || item.patient.hasHypertension) && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.patient.hasAllergies && (
                              <Badge variant="error" size="sm">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Allergies: {item.patient.allergies || 'Yes'}
                              </Badge>
                            )}
                            {item.patient.hasDiabetes && (
                              <Badge variant="warning" size="sm">Diabetes</Badge>
                            )}
                            {item.patient.hasHypertension && (
                              <Badge variant="warning" size="sm">Hypertension</Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        <Button
                          onClick={() => handleStartConsultation(item.id)}
                          variant="primary"
                          size="lg"
                        >
                          <Stethoscope className="w-5 h-5 mr-2" />
                          Start Consultation
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
