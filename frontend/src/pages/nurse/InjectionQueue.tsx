import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import {
  Syringe,
  AlertTriangle,
  Clock,
  User,
  Activity,
  Search,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { formatDateTime } from '../../lib/nurseUtils';

interface InjectionOrder {
  id: string;
  orderNumber: string;
  patient: {
    id: string;
    fullName: string;
    cardNumber: string;
    photoUrl?: string;
    allergies?: string;
  };
  medication: string;
  dosage: string;
  route: 'IV' | 'IM' | 'SC' | 'ID';
  frequency?: string;
  duration?: string;
  orderedBy: {
    fullName: string;
  };
  orderedAt: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  clinicalIndication?: string;
  latestVitals?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    recordedAt: string;
  };
}

export const InjectionQueue = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<InjectionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/nurse/injection-queue', {
        params: { status: statusFilter },
      });
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Failed to load injection queue', error);
      toast.error('Failed to load injection orders');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
    toast.success('Queue refreshed');
  };

  const handleAdminister = (orderId: string) => {
    navigate(`/nurse/injection-administration/${orderId}`);
  };

  const filteredOrders = orders.filter(order =>
    order.patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.patient.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.medication.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRouteColor = (route: string) => {
    const colors = {
      IV: 'bg-blue-500/20 text-blue-400 border-blue-500',
      IM: 'bg-purple-500/20 text-purple-400 border-purple-500',
      SC: 'bg-green-500/20 text-green-400 border-green-500',
      ID: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
    };
    return colors[route as keyof typeof colors] || 'bg-slate-500/20 text-slate-400';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      IN_PROGRESS: 'bg-blue-500/20 text-blue-400 border-blue-500',
      COMPLETED: 'bg-green-500/20 text-green-400 border-green-500',
      CANCELLED: 'bg-red-500/20 text-red-400 border-red-500',
    };
    return colors[status as keyof typeof colors] || 'bg-slate-500/20 text-slate-400';
  };

  const getVitalsAge = (recordedAt: string): string => {
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

  const isVitalsRecent = (recordedAt: string): boolean => {
    const now = new Date();
    const recorded = new Date(recordedAt);
    const diffHours = (now.getTime() - recorded.getTime()) / (1000 * 60 * 60);
    return diffHours < 4; // Vitals should be less than 4 hours old
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-400">Loading injection queue...</p>
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
              <Syringe className="w-8 h-8 text-blue-500" />
              Injection Queue
            </h1>
            <p className="text-slate-400 mt-1">Pending injection orders</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="info" className="text-lg px-4 py-2">
              {filteredOrders.length} Orders
            </Badge>
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

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by patient name, card number, or medication..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
                >
                  <option value="PENDING">Pending Only</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="">All Orders</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Syringe className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-400 mb-2">No Orders Found</h3>
              <p className="text-slate-500">
                {searchTerm
                  ? 'No orders match your search criteria'
                  : 'There are no pending injection orders at this time'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:border-blue-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Patient Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <ProfileAvatar
                        src={order.patient.photoUrl}
                        name={order.patient.fullName}
                        size="lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-50">
                            {order.patient.fullName}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {order.patient.cardNumber}
                          </Badge>
                        </div>

                        {/* Allergy Warning */}
                        {order.patient.allergies && (
                          <Alert className="border-red-500 bg-red-950/20 mb-3">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <AlertDescription className="text-red-400">
                              <strong>ALLERGIES:</strong> {order.patient.allergies}
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Medication Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Medication</p>
                            <p className="font-semibold text-slate-50">{order.medication}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Dosage</p>
                            <p className="font-semibold text-slate-50">{order.dosage}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Route</p>
                            <Badge className={getRouteColor(order.route)}>
                              {order.route}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Status</p>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>

                        {/* Order Info */}
                        <div className="flex items-center gap-6 text-sm text-slate-400">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Ordered by: {order.orderedBy.fullName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatDateTime(new Date(order.orderedAt))}</span>
                          </div>
                        </div>

                        {/* Latest Vitals */}
                        {order.latestVitals && (
                          <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-semibold text-slate-300">Latest Vitals</p>
                              <span
                                className={`text-xs ${
                                  isVitalsRecent(order.latestVitals.recordedAt)
                                    ? 'text-green-400'
                                    : 'text-yellow-400'
                                }`}
                              >
                                {getVitalsAge(order.latestVitals.recordedAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              {order.latestVitals.bloodPressure && (
                                <span className="text-slate-300">
                                  BP: {order.latestVitals.bloodPressure}
                                </span>
                              )}
                              {order.latestVitals.heartRate && (
                                <span className="text-slate-300">
                                  HR: {order.latestVitals.heartRate} bpm
                                </span>
                              )}
                              {order.latestVitals.temperature && (
                                <span className="text-slate-300">
                                  Temp: {order.latestVitals.temperature}°C
                                </span>
                              )}
                            </div>
                            {!isVitalsRecent(order.latestVitals.recordedAt) && (
                              <p className="text-xs text-yellow-400 mt-2">
                                ⚠️ Vitals are more than 4 hours old - consider recording new vitals
                              </p>
                            )}
                          </div>
                        )}

                        {!order.latestVitals && (
                          <Alert className="border-yellow-500 bg-yellow-950/20 mt-3">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            <AlertDescription className="text-yellow-400">
                              No recent vitals recorded - vitals required before administration
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col gap-2">
                      {order.status === 'PENDING' && (
                        <Button
                          onClick={() => handleAdminister(order.id)}
                          variant="primary"
                          size="lg"
                        >
                          <Syringe className="w-4 h-4 mr-2" />
                          Administer
                        </Button>
                      )}
                      {order.status === 'IN_PROGRESS' && (
                        <Button
                          onClick={() => handleAdminister(order.id)}
                          variant="outline"
                          size="lg"
                        >
                          Continue
                        </Button>
                      )}
                      {order.status === 'COMPLETED' && (
                        <Badge variant="success" className="px-4 py-2">
                          Completed
                        </Badge>
                      )}
                    </div>
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
