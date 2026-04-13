import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Clock, User, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { receptionModuleSubnav } from '../../navigation/moduleSubnavItems';

interface QueuePatient {
  id: string;
  cardNumber: string;
  name: string;
  age: number;
  gender: string;
  priority: 'emergency' | 'urgent' | 'routine';
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
  department: string;
  doctor: string;
  arrivalTime: string;
  waitTime: number;
  queueNumber: number;
}

export const QueueManagement: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('waiting');
  const [patients, setPatients] = useState<QueuePatient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const departments = ['all', 'OPD', 'Laboratory', 'Pharmacy', 'Ultrasound'];
  const statuses = ['waiting', 'in-progress', 'completed', 'cancelled'];

  const loadQueue = async () => {
    setIsLoading(true);
    try {
      const resp = await api.get('/visits', { params: { limit: 300 } });
      const rows = resp.data?.data?.visits || [];
      const mapped: QueuePatient[] = rows.map((row: any, index: number) => {
        const created = row.createdAt || row.visitDate || new Date().toISOString();
        const waitTime = Math.max(1, Math.floor((Date.now() - new Date(created).getTime()) / 60000));
        const service = String(row.serviceType || 'OPD');
        return {
          id: row.id,
          cardNumber: row.patient?.cardNumber || '-',
          name: row.patient?.fullName || 'Unknown',
          age: 0,
          gender: row.patient?.sex || '-',
          priority: waitTime > 60 ? 'emergency' : waitTime > 30 ? 'urgent' : 'routine',
          status:
            row.status === 'IN_CONSULTATION'
              ? 'in-progress'
              : row.status === 'COMPLETED'
              ? 'completed'
              : row.status === 'CANCELLED'
              ? 'cancelled'
              : 'waiting',
          department:
            service === 'LAB' ? 'Laboratory' :
            service === 'PHARMACY' ? 'Pharmacy' :
            service === 'ULTRASOUND' ? 'Ultrasound' : 'OPD',
          doctor: row.doctor?.fullName || 'Unassigned',
          arrivalTime: new Date(created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          waitTime,
          queueNumber: index + 1,
        };
      });
      setPatients(mapped);
    } catch (error) {
      console.error('Failed to load queue', error);
      toast.error('Failed to load reception queue.');
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadQueue();
  }, []);

  const updateVisitStatus = async (id: string, status: 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED') => {
    setActioningId(id);
    try {
      await api.patch(`/visits/${id}/status`, { status });
      toast.success(`Visit moved to ${status}.`);
      await loadQueue();
    } catch (error) {
      console.error('Failed to update visit status', error);
      toast.error('Failed to update visit status.');
    } finally {
      setActioningId(null);
    }
  };

  const filteredPatients = useMemo(
    () =>
      patients.filter((p) => {
        const deptMatch = selectedDepartment === 'all' || p.department === selectedDepartment;
        const statusMatch = p.status === selectedStatus;
        return deptMatch && statusMatch;
      }),
    [patients, selectedDepartment, selectedStatus]
  );

  const stats = useMemo(
    () => ({
      waiting: patients.filter((p) => p.status === 'waiting').length,
      inProgress: patients.filter((p) => p.status === 'in-progress').length,
      completed: patients.filter((p) => p.status === 'completed').length,
      avgWaitTime: patients.length > 0 ? Math.round(patients.reduce((acc, p) => acc + p.waitTime, 0) / patients.length) : 0,
    }),
    [patients]
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Queue Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage patient queues</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2" onClick={() => void loadQueue()} isLoading={isLoading}>
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <ModuleSubnav items={receptionModuleSubnav} ariaLabel="Reception workflow" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Waiting</p><p className="text-2xl font-bold text-blue-600">{stats.waiting}</p></div><Clock className="w-8 h-8 text-blue-600" /></div></Card>
        <Card className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">In Progress</p><p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p></div><User className="w-8 h-8 text-yellow-600" /></div></Card>
        <Card className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Completed</p><p className="text-2xl font-bold text-green-600">{stats.completed}</p></div><CheckCircle className="w-8 h-8 text-green-600" /></div></Card>
        <Card className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Avg Wait Time</p><p className="text-2xl font-bold text-gray-900">{stats.avgWaitTime}m</p></div><Clock className="w-8 h-8 text-gray-600" /></div></Card>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <div className="flex gap-2 flex-wrap">
              {departments.map((dept) => (
                <Button key={dept} variant={selectedDepartment === dept ? 'primary' : 'outline'} size="sm" onClick={() => setSelectedDepartment(dept)}>
                  {dept}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex gap-2 flex-wrap">
              {statuses.map((status) => (
                <Button key={status} variant={selectedStatus === status ? 'primary' : 'outline'} size="sm" onClick={() => setSelectedStatus(status)}>
                  {status.replace('-', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredPatients.length === 0 ? (
          <Card className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No patients in queue</p>
          </Card>
        ) : (
          filteredPatients.map((patient) => (
            <Card key={patient.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">{patient.queueNumber}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                      <Badge variant={patient.priority === 'emergency' ? 'danger' : patient.priority === 'urgent' ? 'warning' : 'default'}>{patient.priority}</Badge>
                      <Badge variant={patient.status === 'waiting' ? 'info' : patient.status === 'in-progress' ? 'warning' : patient.status === 'completed' ? 'success' : 'danger'}>
                        {patient.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{patient.cardNumber}</span><span>•</span><span>{patient.age}y, {patient.gender}</span><span>•</span><span>{patient.department}</span><span>•</span><span>{patient.doctor}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Arrived: {patient.arrivalTime}</span><span>•</span><span>Wait: {patient.waitTime} min</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {patient.status === 'waiting' && (
                    <Button variant="primary" size="sm" onClick={() => void updateVisitStatus(patient.id, 'IN_CONSULTATION')} isLoading={actioningId === patient.id}>
                      Call Next
                    </Button>
                  )}
                  {patient.status === 'in-progress' && (
                    <Button variant="success" size="sm" onClick={() => void updateVisitStatus(patient.id, 'COMPLETED')} isLoading={actioningId === patient.id}>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Complete
                    </Button>
                  )}
                  {(patient.status === 'waiting' || patient.status === 'in-progress') && (
                    <Button variant="outline" size="sm" onClick={() => void updateVisitStatus(patient.id, 'CANCELLED')} isLoading={actioningId === patient.id}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
