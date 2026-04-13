import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { toast } from '../../lib/toast';
import { PatientSearch } from '../../components/common/PatientSearch';

interface PrescriptionItem {
  id: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions?: string;
}

interface Prescription {
  id: string;
  prescriptionNumber: string;
  createdAt: string;
  status: string;
  patient: {
    id: string;
    cardNumber: string;
    fullName: string;
    sex: string;
    dateOfBirth: string;
  };
  items: PrescriptionItem[];
  doctor: {
    fullName: string;
  };
}

export const PharmacyQueue = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPrescriptions();
    const interval = setInterval(loadPrescriptions, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadPrescriptions = async () => {
    setLoading(true);
    try {
      const resp = await api.get('/prescriptions', {
        params: { status: 'PENDING', limit: 50 },
      });
      setPrescriptions(resp.data.data || []);
    } catch (error) {
      console.error('Failed to load prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleDispense = async (prescriptionId: string) => {
    try {
      await api.patch(`/prescriptions/${prescriptionId}/dispense`);
      toast.success('Prescription dispensed successfully');
      loadPrescriptions();
    } catch (error: any) {
      console.error('Failed to dispense:', error);
      toast.error(error.response?.data?.error || 'Failed to dispense prescription');
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const pendingPrescriptions = prescriptions.filter(p => p.status === 'PENDING');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-50">Pharmacy Queue</h1>
          <p className="text-slate-400 mt-1">Pending prescriptions to dispense</p>
        </div>

        <div className="mb-6">
          <PatientSearch
            onSelectPatient={(patient) => {
              console.log('Selected patient:', patient);
            }}
            placeholder="Search patient for prescription history..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card variant="elevated">
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm text-slate-400">Pending Prescriptions</p>
                <p className="text-3xl font-bold text-sky-400 mt-1">{pendingPrescriptions.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm text-slate-400">Total Medications</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">
                  {prescriptions.reduce((sum, p) => sum + p.items.length, 0)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm text-slate-400">Dispensed Today</p>
                <p className="text-3xl font-bold text-purple-400 mt-1">0</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading && prescriptions.length === 0 ? (
          <Card variant="elevated">
            <CardContent className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-sky-500 mb-4" />
              <p className="text-slate-400">Loading prescriptions...</p>
            </CardContent>
          </Card>
        ) : prescriptions.length === 0 ? (
          <Card variant="elevated">
            <CardContent className="py-12 text-center">
              <svg className="mx-auto h-16 w-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <p className="text-slate-400 text-lg">No pending prescriptions</p>
              <p className="text-slate-500 text-sm mt-2">Prescriptions will appear here when doctors write them</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <Card key={prescription.id} variant="elevated">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <CardTitle className="text-lg">{prescription.patient.fullName}</CardTitle>
                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                          <span className="font-mono">{prescription.patient.cardNumber}</span>
                          <span>•</span>
                          <span>{prescription.patient.sex}</span>
                          <span>•</span>
                          <span>{calculateAge(prescription.patient.dateOfBirth)} years</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={prescription.status === 'PENDING' ? 'warning' : 'success'}>
                      {prescription.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 text-sm text-slate-400">
                    <span>Prescribed by: Dr. {prescription.doctor.fullName}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(prescription.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {prescription.items.map((item, index) => (
                      <div key={item.id} className="border border-slate-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-100 text-lg">{item.drugName}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                              <div>
                                <p className="text-slate-500">Dosage</p>
                                <p className="text-slate-200 font-medium">{item.dosage}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Frequency</p>
                                <p className="text-slate-200 font-medium">{item.frequency}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Duration</p>
                                <p className="text-slate-200 font-medium">{item.duration}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Quantity</p>
                                <p className="text-slate-200 font-medium">{item.quantity}</p>
                              </div>
                            </div>
                            {item.instructions && (
                              <div className="mt-3 p-3 bg-slate-900/60 border border-slate-700 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">Instructions:</p>
                                <p className="text-sm text-slate-300">{item.instructions}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {prescription.status === 'PENDING' && (
                    <Button
                      variant="primary"
                      onClick={() => handleDispense(prescription.id)}
                      className="w-full"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Dispense Prescription
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
