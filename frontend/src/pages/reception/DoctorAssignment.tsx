import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { isAxiosError } from 'axios';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { receptionModuleSubnav } from '../../navigation/moduleSubnavItems';

interface Doctor {
  id: string;
  fullName: string;
  department?: string;
  employmentType?: 'FULL_TIME' | 'PART_TIME';
}

interface VisitQueueItem {
  id: string;
  patient: {
    fullName: string;
    cardNumber: string;
  };
  serviceType: string;
}

export const DoctorAssignment = () => {
  const location = useLocation();
  const [queue, setQueue] = useState<VisitQueueItem[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedVisit, setSelectedVisit] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedVisitItem = useMemo(
    () => queue.find((v) => v.id === selectedVisit),
    [queue, selectedVisit]
  );

  const loadData = async () => {
    console.log('=== LOADING DOCTOR ASSIGNMENT DATA ===');
    setLoading(true);
    try {
      const [doctorsResp, visitsResp] = await Promise.all([
        api.get('/auth/doctors'),
        api.get('/visits', {
          params: {
            status: 'REGISTERED',
            serviceType: 'OPD',
            limit: 100,
            unassignedOnly: 'true',
          },
        }),
      ]);

      console.log('Doctors response:', doctorsResp.data);
      console.log('Visits response:', visitsResp.data);

      const doctorsList = doctorsResp.data?.data || [];
      const visitsList = visitsResp.data?.data?.visits || [];

      console.log('Doctors count:', doctorsList.length);
      console.log('Unassigned visits count:', visitsList.length);
      console.log('Visits:', visitsList);

      setDoctors(doctorsList);
      setQueue(visitsList);
    } catch (error) {
      console.error('Failed to load doctor assignment data', error);
      const msg = isAxiosError(error)
        ? (error.response?.data as { error?: string | { message?: string } })?.error
        : undefined;
      const text =
        typeof msg === 'string'
          ? msg
          : typeof msg === 'object' && msg?.message
            ? msg.message
            : 'Failed to load doctor assignment data.';
      toast.error(text);
    } finally {
      setLoading(false);
      console.log('=== DOCTOR ASSIGNMENT DATA LOADED ===');
    }
  };

  const visitIdFromNav = (location.state as { visitId?: string } | null)?.visitId;

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    if (!visitIdFromNav || queue.length === 0) return;
    console.log('Visit ID from navigation:', visitIdFromNav);
    if (queue.some((v) => v.id === visitIdFromNav)) {
      setSelectedVisit(visitIdFromNav);
    }
  }, [visitIdFromNav, queue]);

  const handleAssign = async () => {
    if (!selectedDoctor || !selectedVisit) {
      toast.info('Please select a patient visit and a doctor.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.patch(`/visits/${selectedVisit}/assign-doctor`, {
        doctorId: selectedDoctor,
      });
      toast.success('Doctor assigned successfully.');
      setSelectedDoctor(null);
      setSelectedVisit('');
      await loadData();
    } catch (error) {
      console.error('Failed to assign doctor', error);
      const data = isAxiosError(error) ? (error.response?.data as { error?: unknown }) : undefined;
      let message = 'Failed to assign doctor.';
      if (data?.error) {
        if (typeof data.error === 'string') message = data.error;
        else if (typeof data.error === 'object' && data.error && 'message' in data.error) {
          message = String((data.error as { message: string }).message);
        }
      }
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Doctor Assignment</h1>
            <p className="text-slate-400 mt-1">Assign registered OPD visits to available doctors</p>
          </div>
          <Button variant="outline" onClick={() => void loadData()} isLoading={loading}>
            Refresh
          </Button>
        </div>

        <ModuleSubnav items={receptionModuleSubnav} ariaLabel="Reception workflow" />

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Unassigned OPD Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
              value={selectedVisit}
              onChange={(e) => setSelectedVisit(e.target.value)}
            >
              <option value="">Select visit...</option>
              {queue.map((visit) => (
                <option key={visit.id} value={visit.id}>
                  {visit.patient.cardNumber} - {visit.patient.fullName}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Available Doctors</CardTitle>
            <CardDescription>Approved active doctors are shown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doctor) => {
                const isSelected = selectedDoctor === doctor.id;
                return (
                  <button
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-sky-500/10'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-50">{doctor.fullName}</h3>
                        <p className="text-sm text-slate-400">{doctor.department || 'General'}</p>
                      </div>
                      <Badge variant="info" size="sm">
                        {doctor.employmentType === 'PART_TIME' ? 'Part-Time' : 'Full-Time'}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {selectedVisitItem && (
          <Card variant="bordered">
            <CardContent className="text-sm text-slate-300">
              Selected patient: <span className="font-semibold text-slate-100">{selectedVisitItem.patient.fullName}</span>
              {' '}({selectedVisitItem.patient.cardNumber})
            </CardContent>
          </Card>
        )}
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => window.history.back()}>
            Back
          </Button>
          <Button
            type="button"
            variant="primary"
            className="flex-1"
            onClick={handleAssign}
            isLoading={isSubmitting}
            disabled={!selectedDoctor}
          >
            {isSubmitting ? 'Assigning...' : 'Assign to Doctor'}
          </Button>
        </div>
      </div>
    </div>
  );
};
