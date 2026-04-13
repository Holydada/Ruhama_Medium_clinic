import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { QuickOrderPanel } from '../../components/doctor/QuickOrderPanel';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  FileText,
  TestTube,
  Pill,
  Stethoscope,
  User,
  Phone,
  MapPin,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { formatDateTime } from '../../lib/nurseUtils';

interface Patient {
  id: string;
  cardNumber: string;
  fullName: string;
  dateOfBirth?: string;
  age?: number;
  sex: 'MALE' | 'FEMALE';
  phone?: string;
  address?: string;
  photoUrl?: string;
  allergies?: string;
  chronicIllnesses?: string;
  bloodType?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

interface Visit {
  id: string;
  visitDate: string;
  visitType: 'NEW' | 'FOLLOW_UP';
  chiefComplaint?: string;
  diagnosis?: string;
  doctorName: string;
  status: string;
}

interface LabResult {
  id: string;
  testName: string;
  result: string;
  status: string;
  orderedDate: string;
  completedDate?: string;
  isAbnormal: boolean;
}

interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedDate: string;
  status: string;
}

interface VitalSigns {
  id: string;
  recordedDate: string;
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  weight?: number;
}

export const PatientChart = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [vitals, setVitals] = useState<VitalSigns[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'visits' | 'labs' | 'prescriptions' | 'vitals'>('visits');

  useEffect(() => {
    if (patientId) {
      loadPatientData();
    }
  }, [patientId]);

  const loadPatientData = async () => {
    setLoading(true);
    try {
      const [patientResp, visitsResp, labsResp, prescriptionsResp, vitalsResp] = await Promise.all([
        api.get(`/patients/${patientId}`),
        api.get(`/patients/${patientId}/visits`),
        api.get(`/patients/${patientId}/lab-results`),
        api.get(`/patients/${patientId}/prescriptions`),
        api.get(`/patients/${patientId}/vitals`),
      ]);
      
      setPatient(patientResp.data.data);
      setVisits(visitsResp.data.data);
      setLabResults(labsResp.data.data);
      setPrescriptions(prescriptionsResp.data.data);
      setVitals(vitalsResp.data.data);
    } catch (error) {
      console.error('Failed to load patient data', error);
      toast.error('Failed to load patient information');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderCreated = () => {
    // Refresh patient data after order is created
    loadPatientData();
    toast.success('Order created successfully');
  };

  const calculateAge = (dob?: string): string => {
    if (!dob) return 'Unknown';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading patient chart...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-50 mb-2">Patient Not Found</h3>
            <p className="text-slate-400 mb-4">Unable to load patient information.</p>
            <Button onClick={() => navigate('/doctor/queue')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Queue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'visits', label: 'Visit History', icon: Calendar, count: visits.length },
    { id: 'labs', label: 'Lab Results', icon: TestTube, count: labResults.length },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill, count: prescriptions.length },
    { id: 'vitals', label: 'Vital Signs', icon: TrendingUp, count: vitals.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/doctor/queue')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-50">Patient Chart</h1>
              <p className="text-slate-400 mt-1">Complete medical history</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Information Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center text-center pb-4 border-b border-slate-700">
                  <ProfileAvatar
                    photoUrl={patient.photoUrl}
                    fullName={patient.fullName}
                    size="xl"
                  />
                  <h3 className="font-semibold text-slate-50 text-lg mt-4">{patient.fullName}</h3>
                  <p className="text-sm text-slate-400">Card #{patient.cardNumber}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-slate-400">Age & Gender</p>
                      <p className="text-slate-50">{calculateAge(patient.dateOfBirth)} • {patient.sex}</p>
                    </div>
                  </div>

                  {patient.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-slate-400">Phone</p>
                        <p className="text-slate-50">{patient.phone}</p>
                      </div>
                    </div>
                  )}

                  {patient.address && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-slate-400">Address</p>
                        <p className="text-slate-50">{patient.address}</p>
                      </div>
                    </div>
                  )}

                  {patient.bloodType && (
                    <div className="flex items-center gap-3 text-sm">
                      <Heart className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-slate-400">Blood Type</p>
                        <p className="text-slate-50">{patient.bloodType}</p>
                      </div>
                    </div>
                  )}
                </div>

                {patient.emergencyContact && (
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-xs font-semibold text-slate-400 mb-2">Emergency Contact</p>
                    <p className="text-sm text-slate-50">{patient.emergencyContact}</p>
                    {patient.emergencyPhone && (
                      <p className="text-sm text-slate-400">{patient.emergencyPhone}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Allergies */}
            {patient.allergies && (
              <Card className="border-red-500 bg-red-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                    Allergies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-300">{patient.allergies}</p>
                </CardContent>
              </Card>
            )}

            {/* Chronic Illnesses */}
            {patient.chronicIllnesses && (
              <Card className="border-yellow-500 bg-yellow-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-400">
                    <Heart className="w-5 h-5" />
                    Chronic Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-300">{patient.chronicIllnesses}</p>
                </CardContent>
              </Card>
            )}

            {/* Quick Order Panel */}
            <QuickOrderPanel
              patientId={patientId!}
              visitId={visits[0]?.id}
              onOrderCreated={handleOrderCreated}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2 overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                        <Badge size="sm">{tab.count}</Badge>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Visit History */}
            {activeTab === 'visits' && (
              <Card>
                <CardHeader>
                  <CardTitle>Visit History ({visits.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {visits.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">No visit history</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {visits.map((visit) => (
                        <div
                          key={visit.id}
                          className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                          onClick={() => navigate(`/doctor/encounter/${visit.id}`)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span className="font-medium text-slate-50">
                                {formatDateTime(new Date(visit.visitDate))}
                              </span>
                              <Badge variant={visit.visitType === 'NEW' ? 'default' : 'info'} size="sm">
                                {visit.visitType}
                              </Badge>
                            </div>
                            <Badge>{visit.status}</Badge>
                          </div>
                          {visit.chiefComplaint && (
                            <p className="text-sm text-slate-400 mb-1">
                              <span className="font-medium">Chief Complaint:</span> {visit.chiefComplaint}
                            </p>
                          )}
                          {visit.diagnosis && (
                            <p className="text-sm text-slate-400 mb-1">
                              <span className="font-medium">Diagnosis:</span> {visit.diagnosis}
                            </p>
                          )}
                          <p className="text-xs text-slate-500">Dr. {visit.doctorName}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Lab Results */}
            {activeTab === 'labs' && (
              <Card>
                <CardHeader>
                  <CardTitle>Lab Results ({labResults.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {labResults.length === 0 ? (
                    <div className="text-center py-8">
                      <TestTube className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">No lab results</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {labResults.map((lab) => (
                        <div
                          key={lab.id}
                          className={`p-4 rounded-lg ${
                            lab.isAbnormal
                              ? 'bg-red-950/20 border border-red-500'
                              : 'bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <TestTube className={`w-4 h-4 ${lab.isAbnormal ? 'text-red-500' : 'text-purple-500'}`} />
                              <span className="font-medium text-slate-50">{lab.testName}</span>
                              {lab.isAbnormal && (
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            <Badge variant={lab.status === 'COMPLETED' ? 'success' : 'default'}>
                              {lab.status}
                            </Badge>
                          </div>
                          {lab.result && (
                            <p className={`text-sm mb-1 ${lab.isAbnormal ? 'text-red-300' : 'text-slate-300'}`}>
                              <span className="font-medium">Result:</span> {lab.result}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>Ordered: {formatDateTime(new Date(lab.orderedDate))}</span>
                            {lab.completedDate && (
                              <span>Completed: {formatDateTime(new Date(lab.completedDate))}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Prescriptions */}
            {activeTab === 'prescriptions' && (
              <Card>
                <CardHeader>
                  <CardTitle>Prescriptions ({prescriptions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {prescriptions.length === 0 ? (
                    <div className="text-center py-8">
                      <Pill className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">No prescriptions</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {prescriptions.map((prescription) => (
                        <div
                          key={prescription.id}
                          className="p-4 bg-slate-800/50 rounded-lg"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Pill className="w-4 h-4 text-green-500" />
                              <span className="font-medium text-slate-50">{prescription.medicationName}</span>
                            </div>
                            <Badge>{prescription.status}</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm text-slate-400 mb-2">
                            <div>
                              <span className="font-medium">Dosage:</span> {prescription.dosage}
                            </div>
                            <div>
                              <span className="font-medium">Frequency:</span> {prescription.frequency}
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span> {prescription.duration}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500">
                            Prescribed: {formatDateTime(new Date(prescription.prescribedDate))}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Vital Signs */}
            {activeTab === 'vitals' && (
              <Card>
                <CardHeader>
                  <CardTitle>Vital Signs History ({vitals.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {vitals.length === 0 ? (
                    <div className="text-center py-8">
                      <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">No vital signs recorded</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {vitals.map((vital) => (
                        <div
                          key={vital.id}
                          className="p-4 bg-slate-800/50 rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Stethoscope className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-slate-400">
                              {formatDateTime(new Date(vital.recordedDate))}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            {vital.bloodPressure && (
                              <div>
                                <p className="text-slate-400">Blood Pressure</p>
                                <p className="text-slate-50 font-medium">{vital.bloodPressure} mmHg</p>
                              </div>
                            )}
                            {vital.heartRate && (
                              <div>
                                <p className="text-slate-400">Heart Rate</p>
                                <p className="text-slate-50 font-medium">{vital.heartRate} bpm</p>
                              </div>
                            )}
                            {vital.temperature && (
                              <div>
                                <p className="text-slate-400">Temperature</p>
                                <p className="text-slate-50 font-medium">{vital.temperature}°C</p>
                              </div>
                            )}
                            {vital.oxygenSaturation && (
                              <div>
                                <p className="text-slate-400">SpO2</p>
                                <p className="text-slate-50 font-medium">{vital.oxygenSaturation}%</p>
                              </div>
                            )}
                            {vital.weight && (
                              <div>
                                <p className="text-slate-400">Weight</p>
                                <p className="text-slate-50 font-medium">{vital.weight} kg</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
