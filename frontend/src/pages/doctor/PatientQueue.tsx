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
  AlertTriangle,
  Clock,
  Users,
  RefreshCw,
  Stethoscope,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { formatDateTime, getTriageLevelColor } from '../../lib/nurseUtils';

interface QueuePatient {
  id: string;
  visitId: string;
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
    triageLevel: string;
    chiefComplaint: string;
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    oxygenSaturation?: number;
    triageTime: string;
  };
  visitType: 'NEW' | 'FOLLOW_UP';
  arrivalTime: string;
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
  hasEncounter: boolean;
}

interface QueueStats {
  waiting: number;
  inProgress: number;
  completed: number;
  averageWaitTime: number;
}

export const PatientQueue = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<QueuePatient[]>([]);
  const [stats, setStats] = useState<QueueStats>({
    waiting: 0,
    inProgress: 0,
    completed: 0,
    averageWaitTime: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'WAITING' | 'IN_PROGRESS'>('WAITING');

  useEffect(() => {
    loadQueue();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadQueue(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadQueue = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    
    try {
      const [queueResp, statsResp] = await Promise.all([
        api.get('/doctor/queue'),
        api.get('/doctor/queue/stats'),
      ]);
      
      setPatients(queueResp.data.data);
      setStats(statsResp.data.data);
    } catch (error) {
      console.error('Failed to load queue', error);
      if (!silent) {
        toast.error('Failed to load patient queue');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadQueue(true);
    toast.success('Queue refreshed');
  };

  const handleStartConsultation = async (visitId: string) => {
    try {
      await api.post(`/doctor/visits/${visitId}/start`);
      navigate(`/doctor/encounter/${visitId}`);
    } catch (error) {
      console.error('Failed to start consultation', error);
      toast.error('Failed to start consultation');
    }
  };

  const getWaitTime = (arrivalTime: string): string => {
    const arrival = new Date(arrivalTime);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - arrival.getTime()) / 60000);
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m`;
    }
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const getWaitTimeColor = (arrivalTime: string): string => {
    const arrival = new Date(arrivalTime);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - arrival.getTime()) / 60000);
    
    if (diffMinutes < 15) return 'text-green-500';
    if (diffMinutes < 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const filteredPatients = patients.filter(p => {
    if (filterStatus === 'ALL') return true;
    return p.status === filterStatus;
  });

  // Sort by priority: Critical first, then by wait time
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    // Critical patients first
    if (a.triage?.triageLevel === 'CRITICAL' && b.triage?.triageLevel !== 'CRITICAL') return -1;
    if (a.triage?.triageLevel !== 'CRITICAL' && b.triage?.triageLevel === 'CRITICAL') return 1;
    
    // Then by wait time (longest first)
    return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-400">Loading patient queue...</p>
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
            <h1 className="text-3xl font-bold text-slate-50">Patient Queue</h1>
            <p className="text-slate-400 mt-1">Manage your patient consultations</p>
          </div>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Waiting</p>
                  <p className="text-3xl font-bold text-yellow-500 mt-1">{stats.waiting}</p>
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
                  <p className="text-3xl font-bold text-blue-500 mt-1">{stats.inProgress}</p>
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
                  <p className="text-3xl font-bold text-green-500 mt-1">{stats.completed}</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Avg Wait Time</p>
                  <p className="text-3xl font-bold text-slate-50 mt-1">{stats.averageWaitTime}m</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'ALL' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('ALL')}
              >
                All Patients
              </Button>
              <Button
                variant={filterStatus === 'WAITING' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('WAITING')}
              >
                Waiting ({stats.waiting})
              </Button>
              <Button
                variant={filterStatus === 'IN_PROGRESS' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('IN_PROGRESS')}
              >
                In Progress ({stats.inProgress})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Patient Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Patients ({sortedPatients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedPatients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No patients in queue</p>
                <p className="text-sm text-slate-500 mt-2">
                  Patients will appear here once they are triaged
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedPatients.map((patient, index) => {
                  const waitTime = getWaitTime(patient.arrivalTime);
                  const waitTimeColor = getWaitTimeColor(patient.arrivalTime);
                  
                  return (
                    <div
                      key={patient.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        patient.triage?.triageLevel === 'CRITICAL'
                          ? 'border-red-500 bg-red-950/10'
                          : patient.status === 'IN_PROGRESS'
                          ? 'border-blue-500 bg-blue-950/10'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          {/* Queue Number */}
                          <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-800 rounded-lg">
                            <span className="text-xs text-slate-400">#{index + 1}</span>
                            <span className={`text-lg font-bold ${waitTimeColor}`}>
                              {waitTime.split('h')[0].split('m')[0]}
                            </span>
                          </div>
                          
                          <ProfileAvatar
                            src={patient.patient.photoUrl}
                            name={patient.patient.fullName}
                            size="md"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-50">
                                {patient.patient.fullName}
                              </h3>
                              {patient.triage && (
                                <Badge className={getTriageLevelColor(patient.triage.triageLevel)}>
                                  {patient.triage.triageLevel}
                                </Badge>
                              )}
                              {patient.triage?.triageLevel === 'CRITICAL' && (
                                <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                              )}
                              <Badge variant={patient.visitType === 'NEW' ? 'default' : 'secondary'} size="sm">
                                {patient.visitType === 'NEW' ? 'New' : 'Follow-up'}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              <span>Card #{patient.patient.cardNumber}</span>
                              <span>•</span>
                              <span>{patient.patient.sex}</span>
                              {patient.patient.age && (
                                <>
                                  <span>•</span>
                                  <span>{patient.patient.age} years</span>
                                </>
                              )}
                            </div>
                            
                            {patient.triage && (
                              <div className="mt-2">
                                <p className="text-sm text-slate-300 mb-1">
                                  <span className="font-medium">Chief Complaint:</span> {patient.triage.chiefComplaint}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                  {patient.triage.bloodPressure && (
                                    <span>BP: {patient.triage.bloodPressure}</span>
                                  )}
                                  {patient.triage.heartRate && (
                                    <span>HR: {patient.triage.heartRate}</span>
                                  )}
                                  {patient.triage.temperature && (
                                    <span>Temp: {patient.triage.temperature}°C</span>
                                  )}
                                  {patient.triage.oxygenSaturation && (
                                    <span>SpO2: {patient.triage.oxygenSaturation}%</span>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {/* Allergy Warning */}
                            {patient.patient.allergies && (
                              <div className="mt-2 flex items-center gap-2 p-2 bg-red-950/20 border border-red-500 rounded">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <span className="text-sm text-red-400">
                                  <strong>ALLERGIES:</strong> {patient.patient.allergies}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {patient.status === 'WAITING' ? (
                            <Button
                              onClick={() => handleStartConsultation(patient.visitId)}
                              variant="primary"
                              size="sm"
                            >
                              <Stethoscope className="w-4 h-4 mr-2" />
                              Start Consultation
                            </Button>
                          ) : patient.status === 'IN_PROGRESS' ? (
                            <Button
                              onClick={() => navigate(`/doctor/encounter/${patient.visitId}`)}
                              variant="primary"
                              size="sm"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Continue
                            </Button>
                          ) : (
                            <Button
                              onClick={() => navigate(`/doctor/patient/${patient.patient.id}`)}
                              variant="outline"
                              size="sm"
                            >
                              View Chart
                            </Button>
                          )}
                          <Button
                            onClick={() => navigate(`/doctor/patient/${patient.patient.id}`)}
                            variant="outline"
                            size="sm"
                          >
                            Patient History
                          </Button>
                          <p className="text-xs text-slate-500 text-center">
                            Arrived: {formatDateTime(new Date(patient.arrivalTime))}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
