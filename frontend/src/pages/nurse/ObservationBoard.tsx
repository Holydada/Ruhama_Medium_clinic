import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import {
  Activity,
  Heart,
  Thermometer,
  AlertTriangle,
  Clock,
  RefreshCw,
  Filter,
  Eye,
  Pill,
  FileText,
} from 'lucide-react';
import {
  getTriageLevelColor,
  getTriageLevelText,
  isVitalAbnormal,
  parseBP,
} from '../../lib/nurseUtils';

interface PatientObservation {
  id: string;
  patient: {
    id: string;
    fullName: string;
    cardNumber: string;
    photoUrl?: string;
    allergies?: string;
  };
  visit: {
    id: string;
    visitNumber: number;
    triageLevel?: 'CRITICAL' | 'URGENT' | 'SEMI_URGENT' | 'NON_URGENT';
    routedTo?: string;
  };
  latestVitals?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    oxygenSaturation?: number;
    recordedAt: string;
  };
  pendingOrders: {
    injections: number;
    medications: number;
    labs: number;
  };
  location?: string;
  admissionTime: string;
}

export const ObservationBoard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientObservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  const [triageFilter, setTriageFilter] = useState<string>('ALL');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadObservationBoard();
  }, [locationFilter, triageFilter]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadObservationBoard(true);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, locationFilter, triageFilter]);

  const loadObservationBoard = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const params: any = {};
      if (locationFilter !== 'ALL') params.location = locationFilter;
      if (triageFilter !== 'ALL') params.triageLevel = triageFilter;

      const response = await api.get('/nurse/observation-board', { params });
      setPatients(response.data.data || []);
    } catch (error) {
      console.error('Failed to load observation board', error);
      if (!silent) toast.error('Failed to load observation board');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadObservationBoard();
    setRefreshing(false);
    toast.success('Board refreshed');
  };

  const getTimeSinceVitals = (recordedAt: string): string => {
    const now = new Date();
    const recorded = new Date(recordedAt);
    const diffMs = now.getTime() - recorded.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMins}m ago`;
    }
    return `${diffMins}m ago`;
  };

  const isVitalsStale = (recordedAt: string): boolean => {
    const now = new Date();
    const recorded = new Date(recordedAt);
    const diffHours = (now.getTime() - recorded.getTime()) / (1000 * 60 * 60);
    return diffHours > 4;
  };

  const getVitalStatus = (vital: string, value: number): 'normal' | 'abnormal' => {
    return isVitalAbnormal(vital, value) ? 'abnormal' : 'normal';
  };

  const getTimeSinceAdmission = (admissionTime: string): string => {
    const now = new Date();
    const admission = new Date(admissionTime);
    const diffMs = now.getTime() - admission.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMins}m`;
    }
    return `${diffMins}m`;
  };

  const locations = ['ALL', 'OPD', 'EMERGENCY', 'INJECTION', 'ULTRASOUND'];
  const triageLevels = ['ALL', 'CRITICAL', 'URGENT', 'SEMI_URGENT', 'NON_URGENT'];

  const stats = {
    total: patients.length,
    critical: patients.filter(p => p.visit.triageLevel === 'CRITICAL').length,
    staleVitals: patients.filter(p => p.latestVitals && isVitalsStale(p.latestVitals.recordedAt)).length,
    pendingOrders: patients.reduce((sum, p) => 
      sum + p.pendingOrders.injections + p.pendingOrders.medications + p.pendingOrders.labs, 0
    ),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-400">Loading observation board...</p>
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
            <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
              <Eye className="w-8 h-8 text-blue-500" />
              Observation Board
            </h1>
            <p className="text-slate-400 mt-1">Real-time patient monitoring</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-slate-600 bg-slate-900 text-blue-500"
              />
              Auto-refresh (30s)
            </label>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Patients</p>
                  <p className="text-3xl font-bold text-slate-50">{stats.total}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Critical</p>
                  <p className="text-3xl font-bold text-red-500">{stats.critical}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Stale Vitals</p>
                  <p className="text-3xl font-bold text-yellow-500">{stats.staleVitals}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Pending Orders</p>
                  <p className="text-3xl font-bold text-orange-500">{stats.pendingOrders}</p>
                </div>
                <FileText className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-slate-400" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Location:</span>
                <div className="flex gap-2">
                  {locations.map(loc => (
                    <button
                      key={loc}
                      onClick={() => setLocationFilter(loc)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                        locationFilter === loc
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Triage:</span>
                <div className="flex gap-2">
                  {triageLevels.map(level => (
                    <button
                      key={level}
                      onClick={() => setTriageFilter(level)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                        triageFilter === level
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {level === 'ALL' ? 'ALL' : level.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Cards */}
        {patients.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Eye className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-400 mb-2">No Patients</h3>
              <p className="text-slate-500">No patients match the current filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {patients.map((patient) => (
              <Card
                key={patient.id}
                className={`hover:border-blue-500/50 transition-all cursor-pointer ${
                  patient.visit.triageLevel === 'CRITICAL' ? 'border-red-500 border-2' : ''
                }`}
                onClick={() => navigate(`/nurse/patient/${patient.patient.id}`)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Patient Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <ProfileAvatar
                          src={patient.patient.photoUrl}
                          name={patient.patient.fullName}
                          size="md"
                        />
                        <div>
                          <h3 className="font-semibold text-slate-50">{patient.patient.fullName}</h3>
                          <p className="text-sm text-slate-400">{patient.patient.cardNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {patient.visit.triageLevel && (
                          <Badge className={`mb-1 ${getTriageLevelColor(patient.visit.triageLevel)}`}>
                            {getTriageLevelText(patient.visit.triageLevel)}
                          </Badge>
                        )}
                        <p className="text-xs text-slate-500">
                          {getTimeSinceAdmission(patient.admissionTime)}
                        </p>
                      </div>
                    </div>

                    {/* Allergy Warning */}
                    {patient.patient.allergies && (
                      <div className="flex items-center gap-2 p-2 bg-red-950/20 border border-red-500 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-xs text-red-400">
                          <strong>ALLERGIES:</strong> {patient.patient.allergies}
                        </span>
                      </div>
                    )}

                    {/* Vital Signs */}
                    {patient.latestVitals ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-300">Latest Vitals</span>
                          <span
                            className={`text-xs ${
                              isVitalsStale(patient.latestVitals.recordedAt)
                                ? 'text-yellow-400'
                                : 'text-green-400'
                            }`}
                          >
                            {getTimeSinceVitals(patient.latestVitals.recordedAt)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {patient.latestVitals.bloodPressure && (
                            <div className="flex items-center gap-2 text-sm">
                              <Heart className="w-4 h-4 text-slate-400" />
                              <span
                                className={
                                  parseBP(patient.latestVitals.bloodPressure) &&
                                  (isVitalAbnormal('systolicBP', parseBP(patient.latestVitals.bloodPressure)!.systolic) ||
                                   isVitalAbnormal('diastolicBP', parseBP(patient.latestVitals.bloodPressure)!.diastolic))
                                    ? 'text-red-400 font-semibold'
                                    : 'text-slate-300'
                                }
                              >
                                {patient.latestVitals.bloodPressure}
                              </span>
                            </div>
                          )}
                          {patient.latestVitals.heartRate && (
                            <div className="flex items-center gap-2 text-sm">
                              <Activity className="w-4 h-4 text-slate-400" />
                              <span
                                className={
                                  getVitalStatus('heartRate', patient.latestVitals.heartRate) === 'abnormal'
                                    ? 'text-red-400 font-semibold'
                                    : 'text-slate-300'
                                }
                              >
                                {patient.latestVitals.heartRate} bpm
                              </span>
                            </div>
                          )}
                          {patient.latestVitals.temperature && (
                            <div className="flex items-center gap-2 text-sm">
                              <Thermometer className="w-4 h-4 text-slate-400" />
                              <span
                                className={
                                  getVitalStatus('temperature', patient.latestVitals.temperature) === 'abnormal'
                                    ? 'text-red-400 font-semibold'
                                    : 'text-slate-300'
                                }
                              >
                                {patient.latestVitals.temperature}°C
                              </span>
                            </div>
                          )}
                          {patient.latestVitals.oxygenSaturation && (
                            <div className="flex items-center gap-2 text-sm">
                              <Activity className="w-4 h-4 text-slate-400" />
                              <span
                                className={
                                  getVitalStatus('oxygenSaturation', patient.latestVitals.oxygenSaturation) === 'abnormal'
                                    ? 'text-red-400 font-semibold'
                                    : 'text-slate-300'
                                }
                              >
                                SpO2: {patient.latestVitals.oxygenSaturation}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-yellow-950/20 border border-yellow-500 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs text-yellow-400">No vitals recorded</span>
                      </div>
                    )}

                    {/* Pending Orders */}
                    {(patient.pendingOrders.injections > 0 ||
                      patient.pendingOrders.medications > 0 ||
                      patient.pendingOrders.labs > 0) && (
                      <div className="flex items-center gap-3 text-xs">
                        {patient.pendingOrders.injections > 0 && (
                          <Badge variant="warning" className="flex items-center gap-1">
                            <Pill className="w-3 h-3" />
                            {patient.pendingOrders.injections} Injection{patient.pendingOrders.injections > 1 ? 's' : ''}
                          </Badge>
                        )}
                        {patient.pendingOrders.medications > 0 && (
                          <Badge variant="info" className="flex items-center gap-1">
                            <Pill className="w-3 h-3" />
                            {patient.pendingOrders.medications} Med{patient.pendingOrders.medications > 1 ? 's' : ''}
                          </Badge>
                        )}
                        {patient.pendingOrders.labs > 0 && (
                          <Badge variant="info" className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {patient.pendingOrders.labs} Lab{patient.pendingOrders.labs > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Location */}
                    {patient.location && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Location:</span>
                        <Badge variant="outline">{patient.location}</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
