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
  Plus,
  Clock,
  Users,
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { formatDateTime, getTriageLevelColor } from '../../lib/nurseUtils';

interface EmergencyCase {
  id: string;
  caseNumber: string;
  patient: {
    id: string;
    fullName: string;
    age?: number;
    sex: 'MALE' | 'FEMALE';
    photoUrl?: string;
  };
  triageLevel: string;
  chiefComplaint: string;
  arrivalTime: string;
  status: 'ACTIVE' | 'COMPLETED' | 'TRANSFERRED';
  hasTriageData: boolean;
  hasTreatmentData: boolean;
  hasDisposition: boolean;
}

interface DashboardStats {
  activeCases: number;
  criticalCases: number;
  todayTotal: number;
  averageWaitTime: number;
}

export const EmergencyDashboard = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState<EmergencyCase[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    activeCases: 0,
    criticalCases: 0,
    todayTotal: 0,
    averageWaitTime: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'CRITICAL'>('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    
    try {
      const [casesResp, statsResp] = await Promise.all([
        api.get('/emergency/cases'),
        api.get('/emergency/stats'),
      ]);
      
      setCases(casesResp.data.data);
      setStats(statsResp.data.data);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
      if (!silent) {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData(true);
    toast.success('Dashboard refreshed');
  };

  const getNextAction = (emergencyCase: EmergencyCase) => {
    if (!emergencyCase.hasTriageData) {
      return {
        label: 'Start Triage',
        path: `/emergency/triage/${emergencyCase.id}`,
        variant: 'primary' as const,
      };
    }
    if (!emergencyCase.hasTreatmentData) {
      return {
        label: 'Document Treatment',
        path: `/emergency/treatment/${emergencyCase.id}`,
        variant: 'primary' as const,
      };
    }
    if (!emergencyCase.hasDisposition) {
      return {
        label: 'Record Disposition',
        path: `/emergency/disposition/${emergencyCase.id}`,
        variant: 'primary' as const,
      };
    }
    return {
      label: 'View Details',
      path: `/emergency/cases/${emergencyCase.id}`,
      variant: 'outline' as const,
    };
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

  const filteredCases = cases.filter(c => {
    // Status filter
    if (filterStatus === 'ACTIVE' && c.status !== 'ACTIVE') return false;
    if (filterStatus === 'CRITICAL' && c.triageLevel !== 'CRITICAL') return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        c.caseNumber.toLowerCase().includes(query) ||
        c.patient.fullName.toLowerCase().includes(query) ||
        c.chiefComplaint.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-400">Loading emergency dashboard...</p>
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
            <h1 className="text-3xl font-bold text-slate-50">Emergency Department</h1>
            <p className="text-slate-400 mt-1">Real-time emergency case management</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={() => navigate('/emergency/quick-registration')}
              variant="primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Emergency Case
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Cases</p>
                  <p className="text-3xl font-bold text-slate-50 mt-1">{stats.activeCases}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Critical Cases</p>
                  <p className="text-3xl font-bold text-red-500 mt-1">{stats.criticalCases}</p>
                </div>
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Today's Total</p>
                  <p className="text-3xl font-bold text-slate-50 mt-1">{stats.todayTotal}</p>
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
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Cases Alert */}
        {stats.criticalCases > 0 && (
          <Card className="border-red-500 bg-red-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <div>
                  <p className="font-semibold text-red-400">
                    {stats.criticalCases} Critical {stats.criticalCases === 1 ? 'Case' : 'Cases'} Require Immediate Attention
                  </p>
                  <p className="text-sm text-red-300 mt-1">
                    Review and prioritize critical patients immediately
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by case number, patient name, or complaint..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'ALL' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('ALL')}
                >
                  All Cases
                </Button>
                <Button
                  variant={filterStatus === 'ACTIVE' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('ACTIVE')}
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === 'CRITICAL' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('CRITICAL')}
                >
                  Critical
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cases List */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Cases ({filteredCases.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCases.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No emergency cases found</p>
                <Button
                  onClick={() => navigate('/emergency/quick-registration')}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Register New Case
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCases.map((emergencyCase) => {
                  const nextAction = getNextAction(emergencyCase);
                  const waitTime = getWaitTime(emergencyCase.arrivalTime);
                  
                  return (
                    <div
                      key={emergencyCase.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        emergencyCase.triageLevel === 'CRITICAL'
                          ? 'border-red-500 bg-red-950/10'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <ProfileAvatar
                            src={emergencyCase.patient.photoUrl}
                            name={emergencyCase.patient.fullName}
                            size="md"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-50">
                                {emergencyCase.patient.fullName}
                              </h3>
                              <Badge className={getTriageLevelColor(emergencyCase.triageLevel)}>
                                {emergencyCase.triageLevel}
                              </Badge>
                              {emergencyCase.triageLevel === 'CRITICAL' && (
                                <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              <span>Case #{emergencyCase.caseNumber}</span>
                              <span>•</span>
                              <span>{emergencyCase.patient.sex}</span>
                              {emergencyCase.patient.age && (
                                <>
                                  <span>•</span>
                                  <span>{emergencyCase.patient.age} years</span>
                                </>
                              )}
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {waitTime}
                              </span>
                            </div>
                            
                            <p className="text-sm text-slate-300 mt-1">
                              {emergencyCase.chiefComplaint}
                            </p>
                            
                            <div className="flex items-center gap-2 mt-2">
                              {emergencyCase.hasTriageData && (
                                <Badge variant="success" size="sm">✓ Triaged</Badge>
                              )}
                              {emergencyCase.hasTreatmentData && (
                                <Badge variant="success" size="sm">✓ Treated</Badge>
                              )}
                              {emergencyCase.hasDisposition && (
                                <Badge variant="success" size="sm">✓ Disposition</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => navigate(nextAction.path)}
                            variant={nextAction.variant}
                            size="sm"
                          >
                            {nextAction.label}
                          </Button>
                          <p className="text-xs text-slate-500 text-center">
                            {formatDateTime(new Date(emergencyCase.arrivalTime))}
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
