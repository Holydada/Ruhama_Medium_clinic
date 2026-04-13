import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { receptionModuleSubnav } from '../../navigation/moduleSubnavItems';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { formatTime, formatDate } from '../../lib/utils';

interface Appointment {
  id: string;
  appointmentNumber: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  serviceType: string;
  reason?: string;
  status: string;
  patient: {
    id: string;
    cardNumber: string;
    fullName: string;
    phone?: string;
  };
  doctor: {
    id: string;
    fullName: string;
    department?: string;
  };
}

interface Doctor {
  id: string;
  fullName: string;
  department?: string;
  role?: string;
}

interface StaffMember {
  id: string;
  fullName: string;
  role: string;
  department?: string;
  phone?: string;
}

interface StaffData {
  doctors: StaffMember[];
  nurses: StaffMember[];
  injectionStaff: StaffMember[];
  ultrasoundTechs: StaffMember[];
  all: StaffMember[];
}

interface Patient {
  id: string;
  cardNumber: string;
  fullName: string;
  phone?: string;
}

export const AppointmentScheduler = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [staff, setStaff] = useState<StaffData>({ doctors: [], nurses: [], injectionStaff: [], ultrasoundTechs: [], all: [] });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    serviceType: 'OPD' as 'OPD' | 'ULTRASOUND' | 'EMERGENCY' | 'INJECTION',
    reason: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);

  useEffect(() => {
    loadAppointments();
    loadDoctors();
    loadStaff();
  }, [selectedDate, selectedDoctor]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const params: any = { date: selectedDate };
      if (selectedDoctor !== 'all') {
        params.doctorId = selectedDoctor;
      }
      
      const resp = await api.get('/appointments', { params });
      setAppointments(resp.data?.data?.appointments || []);
    } catch (error) {
      console.error('Failed to load appointments', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      const resp = await api.get('/users/doctors');
      setDoctors(resp.data?.data || []);
    } catch (error) {
      console.error('Failed to load doctors', error);
      toast.error('Failed to load doctors list');
    }
  };

  const searchPatients = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      const resp = await api.get('/patients', {
        params: { search: query, limit: 10 },
      });
      setSearchResults(resp.data?.data?.patients || []);
    } catch (error) {
      console.error('Failed to search patients', error);
    }
  };

  const handleCreateAppointment = async () => {
    if (!bookingForm.patientId || !bookingForm.doctorId) {
      toast.error('Please select patient and doctor');
      return;
    }

    try {
      const startDateTime = new Date(`${bookingForm.appointmentDate}T${bookingForm.startTime}:00`);
      const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 minutes

      await api.post('/appointments', {
        patientId: bookingForm.patientId,
        doctorId: bookingForm.doctorId,
        appointmentDate: bookingForm.appointmentDate,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        serviceType: bookingForm.serviceType,
        reason: bookingForm.reason,
      });

      toast.success('Appointment created successfully');
      setShowBookingModal(false);
      resetBookingForm();
      loadAppointments();
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Failed to create appointment';
      toast.error(msg);
    }
  };

  const handleCheckIn = async (appointmentId: string) => {
    try {
      await api.put(`/appointments/${appointmentId}/check-in`);
      toast.success('Patient checked in successfully');
      loadAppointments();
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Failed to check in';
      toast.error(msg);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    const reason = prompt('Please enter cancellation reason:');
    if (!reason) return;

    try {
      await api.put(`/appointments/${appointmentId}/cancel`, { reason });
      toast.success('Appointment cancelled');
      loadAppointments();
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Failed to cancel';
      toast.error(msg);
    }
  };

  const handleUncheckIn = async (appointmentId: string) => {
    try {
      await api.put(`/appointments/${appointmentId}/uncheck-in`);
      toast.success('Patient unchecked-in successfully');
      loadAppointments();
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Failed to uncheck-in';
      toast.error(msg);
    }
  };

  const resetBookingForm = () => {
    setBookingForm({
      patientId: '',
      doctorId: '',
      appointmentDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      serviceType: 'OPD',
      reason: '',
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      SCHEDULED: { variant: 'info' as const, label: 'Scheduled' },
      CONFIRMED: { variant: 'info' as const, label: 'Confirmed' },
      CHECKED_IN: { variant: 'warning' as const, label: 'Checked In' },
      IN_PROGRESS: { variant: 'warning' as const, label: 'In Progress' },
      COMPLETED: { variant: 'success' as const, label: 'Completed' },
      CANCELLED: { variant: 'default' as const, label: 'Cancelled' },
      NO_SHOW: { variant: 'default' as const, label: 'No Show' },
    };
    const config = variants[status] || { variant: 'default' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'SCHEDULED').length,
    checkedIn: appointments.filter(a => a.status === 'CHECKED_IN').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Appointment Scheduler</h1>
            <p className="text-slate-400 mt-1">Manage patient appointments</p>
          </div>
          <Button variant="primary" onClick={() => setShowBookingModal(true)}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Appointment
          </Button>
        </div>

        <ModuleSubnav items={receptionModuleSubnav} ariaLabel="Reception workflow" />

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Today</p>
                <p className="text-3xl font-bold text-slate-50">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Confirmed</p>
                <p className="text-3xl font-bold text-emerald-400">{stats.confirmed}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Checked In</p>
                <p className="text-3xl font-bold text-amber-400">{stats.checkedIn}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Completed</p>
                <p className="text-3xl font-bold text-slate-50">{stats.completed}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-slate-700/50 flex items-center justify-center">
                <svg className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card variant="elevated">
          <CardContent className="flex gap-4">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-48"
            />
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
            >
              <option value="all">All Doctors</option>
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.fullName}</option>
              ))}
            </select>
            <Button variant="outline" onClick={loadAppointments} isLoading={loading}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m14.836 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-14.837-2m14.837 2H15" />
              </svg>
              Refresh
            </Button>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Appointments for {formatDate(selectedDate)}</CardTitle>
            <CardDescription>{appointments.length} appointment(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <svg className="h-16 w-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-slate-400">No appointments for this date</p>
                <Button variant="primary" className="mt-4" onClick={() => setShowBookingModal(true)}>
                  Create First Appointment
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-4 bg-slate-900/80 border border-slate-700 rounded-xl hover:border-slate-600 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-semibold text-sky-400">{formatTime(apt.startTime)}</span>
                          <span className="text-slate-500">→</span>
                          <span className="text-slate-400">{formatTime(apt.endTime)}</span>
                          {getStatusBadge(apt.status)}
                        </div>
                        <p className="text-lg font-medium text-slate-200">{apt.patient.fullName}</p>
                        <p className="text-sm text-slate-400">
                          Card: {apt.patient.cardNumber} • Doctor: {apt.doctor.fullName}
                        </p>
                        {apt.reason && (
                          <p className="text-sm text-slate-500 mt-1">Reason: {apt.reason}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {(apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED') && (
                          <>
                            <Button variant="primary" size="sm" onClick={() => handleCheckIn(apt.id)}>
                              Check In
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleCancel(apt.id)}>
                              Cancel
                            </Button>
                          </>
                        )}
                        {apt.status === 'CHECKED_IN' && (
                          <>
                            <Button variant="warning" size="sm" onClick={() => handleUncheckIn(apt.id)}>
                              Uncheck-in
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleCancel(apt.id)}>
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card variant="elevated" className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Book New Appointment</CardTitle>
              <CardDescription>Schedule a patient appointment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Patient Search */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Patient</label>
                <Input
                  placeholder="Search patient by name or card number..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchPatients(e.target.value);
                  }}
                />
                {searchResults.length > 0 && (
                  <div className="mt-2 border border-slate-700 rounded-xl bg-slate-900 max-h-48 overflow-y-auto">
                    {searchResults.map(patient => (
                      <div
                        key={patient.id}
                        onClick={() => {
                          setBookingForm({...bookingForm, patientId: patient.id});
                          setSearchQuery(`${patient.fullName} (${patient.cardNumber})`);
                          setSearchResults([]);
                        }}
                        className="p-3 hover:bg-slate-800 cursor-pointer border-b border-slate-800 last:border-0"
                      >
                        <p className="text-slate-200 font-medium">{patient.fullName}</p>
                        <p className="text-sm text-slate-400">{patient.cardNumber}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Doctor */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Doctor</label>
                <select
                  value={bookingForm.doctorId}
                  onChange={(e) => setBookingForm({...bookingForm, doctorId: e.target.value})}
                  className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                >
                  <option value="">Select doctor</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.fullName} - {doc.department}</option>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">Date</label>
                  <Input
                    type="date"
                    value={bookingForm.appointmentDate}
                    onChange={(e) => setBookingForm({...bookingForm, appointmentDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">Time</label>
                  <Input
                    type="time"
                    value={bookingForm.startTime}
                    onChange={(e) => setBookingForm({...bookingForm, startTime: e.target.value})}
                  />
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Service Type</label>
                <select
                  value={bookingForm.serviceType}
                  onChange={(e) => setBookingForm({...bookingForm, serviceType: e.target.value as any})}
                  className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                >
                  <option value="OPD">OPD Consultation</option>
                  <option value="ULTRASOUND">Ultrasound</option>
                  <option value="EMERGENCY">Emergency</option>
                  <option value="INJECTION">Injection</option>
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Reason for Visit</label>
                <textarea
                  value={bookingForm.reason}
                  onChange={(e) => setBookingForm({...bookingForm, reason: e.target.value})}
                  className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none resize-none"
                  rows={3}
                  placeholder="Reason for appointment..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => {
                  setShowBookingModal(false);
                  resetBookingForm();
                }}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleCreateAppointment}>
                  Create Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
