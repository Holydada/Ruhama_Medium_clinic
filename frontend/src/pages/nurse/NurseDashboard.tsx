import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatTime, formatDate } from '../../lib/utils';
import { api } from '../../lib/api';
import { Activity, Users, Syringe, AlertTriangle, Clock } from 'lucide-react';

interface DashboardStats {
  triageQueue: number;
  criticalPatients: number;
  injectionQueue: number;
  activePatients: number;
}

export const NurseDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    triageQueue: 0,
    criticalPatients: 0,
    injectionQueue: 0,
    activePatients: 0,
  });
  const [loading, setLoading] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [triageResp, injectionResp, observationResp] = await Promise.all([
        api.get('/nurse/triage/queue'),
        api.get('/nurse/injection-queue', { params: { status: 'PENDING' } }),
        api.get('/nurse/observation-board'),
      ]);

      const triageQueue = triageResp.data?.data || [];
      const injectionQueue = injectionResp.data?.data || [];
      const activePatients = observationResp.data?.data || [];

      const criticalCount = triageQueue.filter(
        (t: any) => t.triageLevel === 'CRITICAL'
      ).length;

      setStats({
        triageQueue: triageQueue.length,
        criticalPatients: criticalCount,
        injectionQueue: injectionQueue.length,
        activePatients: activePatients.length,
      });
    } catch (error) {
      console.error('Failed to load nurse dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    {
      title: 'Triage Patient',
      description: 'Perform initial patient assessment',
      icon: Activity,
      color: 'bg-blue-500',
      onClick: () => navigate('/nurse/triage'),
      badge: stats.triageQueue > 0 ? stats.triageQueue : null,
    },
    {
      title: 'Record Vital Signs',
      description: 'Update patient vital signs',
      icon: Activity,
      color: 'bg-green-500',
      onClick: () => navigate('/nurse/vital-signs'),
    },
    {
      title: 'Injection Queue',
      description: 'Administer pending injections',
      icon: Syringe,
      color: 'bg-purple-500',
      onClick: () => navigate('/nurse/injection-queue'),
      badge: stats.injectionQueue > 0 ? stats.injectionQueue : null,
    },
    {
      title: 'Observation Board',
      description: 'Monitor active patients',
      icon: Users,
      color: 'bg-orange-500',
      onClick: () => navigate('/nurse/observation-board'),
      badge: stats.activePatients > 0 ? stats.activePatients : null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nurse Dashboard</h1>
            <p className="text-gray-600 mt-1">
              {formatDate(new Date())} • {formatTime(new Date())}
            </p>
          </div>
          <Button
            onClick={loadDashboard}
            disabled={loading}
            variant="outline"
            className="gap-2"
          >
            <Clock className="w-4 h-4" />
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Critical Alerts */}
        {stats.criticalPatients > 0 && (
          <Card className="border-red-500 bg-red-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <div>
                  <h3 className="text-lg font-semibold text-red-500">
                    Critical Patients Alert
                  </h3>
                  <p className="text-slate-300">
                    {stats.criticalPatients} critical patient(s) in triage queue
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/nurse/triage?level=CRITICAL')}
                  variant="destructive"
                  className="ml-auto"
                >
                  View Critical Patients
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Triage Queue</p>
                  <p className="text-3xl font-bold text-slate-50 mt-1">
                    {stats.triageQueue}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Critical Patients</p>
                  <p className="text-3xl font-bold text-red-500 mt-1">
                    {stats.criticalPatients}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Injection Queue</p>
                  <p className="text-3xl font-bold text-slate-50 mt-1">
                    {stats.injectionQueue}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Syringe className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Patients</p>
                  <p className="text-3xl font-bold text-slate-50 mt-1">
                    {stats.activePatients}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-slate-50 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:bg-slate-800/50 transition-colors"
                onClick={action.onClick}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`w-16 h-16 ${action.color} rounded-lg flex items-center justify-center relative`}>
                      <action.icon className="w-8 h-8 text-white" />
                      {action.badge && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center p-0"
                        >
                          {action.badge}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-50">{action.title}</h3>
                      <p className="text-sm text-slate-400 mt-1">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent nursing activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-slate-400">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Activity log will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
