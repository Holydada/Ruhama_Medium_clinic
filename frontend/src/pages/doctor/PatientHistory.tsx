import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDate, formatTime } from '../../lib/utils';

interface Visit {
  id: string;
  date: string;
  doctor: string;
  chiefComplaint: string;
  diagnosis: string;
  prescriptions: string[];
  labTests: string[];
  notes: string;
}

export const PatientHistory = () => {
  const [selectedVisit, setSelectedVisit] = useState<string | null>(null);
  
  const patient = {
    name: 'Abebe Kebede',
    cardNumber: 'RH20240001',
    age: 45,
    gender: 'Male',
    bloodType: 'O+',
    allergies: ['Penicillin'],
    chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
  };

  const visits: Visit[] = [
    {
      id: '1',
      date: new Date().toISOString(),
      doctor: 'Dr. Ahmed Hassan',
      chiefComplaint: 'Fever and headache for 3 days',
      diagnosis: 'Upper Respiratory Tract Infection',
      prescriptions: ['Paracetamol 500mg TID x 5 days', 'Amoxicillin 500mg TID x 7 days'],
      labTests: ['Complete Blood Count'],
      notes: 'Patient advised to rest and increase fluid intake',
    },
    {
      id: '2',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      doctor: 'Dr. Sarah Mohammed',
      chiefComplaint: 'Follow-up for diabetes',
      diagnosis: 'Type 2 Diabetes Mellitus - Controlled',
      prescriptions: ['Metformin 500mg BD', 'Glibenclamide 5mg OD'],
      labTests: ['HbA1C', 'Fasting Blood Glucose'],
      notes: 'Blood sugar levels improving. Continue current medication.',
    },
  ];

  const selectedVisitData = visits.find(v => v.id === selectedVisit);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Patient History</h1>
            <p className="text-slate-400 mt-1">Complete medical timeline</p>
          </div>
          <Button variant="outline" size="sm">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print History
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-sky-500/20 to-violet-500/20 flex items-center justify-center text-2xl font-bold text-slate-200">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-slate-50 text-lg">{patient.name}</p>
                    <p className="text-sm text-slate-400">{patient.cardNumber}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">Age</p>
                    <p className="text-slate-200 font-semibold">{patient.age} years</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Gender</p>
                    <p className="text-slate-200 font-semibold">{patient.gender}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Blood Type</p>
                    <p className="text-slate-200 font-semibold">{patient.bloodType}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Total Visits</p>
                    <p className="text-slate-200 font-semibold">{visits.length}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-2">Allergies</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, idx) => (
                      <Badge key={idx} variant="danger" size="sm">{allergy}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-2">Chronic Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.chronicConditions.map((condition, idx) => (
                      <Badge key={idx} variant="warning" size="sm">{condition}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Visit Timeline</CardTitle>
                <CardDescription>{visits.length} visits recorded</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {visits.map((visit, idx) => (
                    <div
                      key={visit.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedVisit === visit.id
                          ? 'border-sky-500 bg-sky-500/10'
                          : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                      }`}
                      onClick={() => setSelectedVisit(visit.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-sky-500/20 flex items-center justify-center">
                            <span className="text-lg font-bold text-slate-200">{idx + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-bold text-slate-50">{formatDate(visit.date)}</p>
                            <Badge variant="info" size="sm">{formatTime(visit.date)}</Badge>
                          </div>
                          <p className="text-sm text-slate-400 mb-1">Doctor: {visit.doctor}</p>
                          <p className="text-sm text-slate-300">{visit.chiefComplaint}</p>
                          <div className="mt-2">
                            <Badge variant="success" size="sm">{visit.diagnosis}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedVisitData && (
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Visit Details</CardTitle>
                  <CardDescription>{formatDate(selectedVisitData.date)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-300 mb-2">Chief Complaint</p>
                    <p className="text-slate-50">{selectedVisitData.chiefComplaint}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-300 mb-2">Diagnosis</p>
                    <Badge variant="success">{selectedVisitData.diagnosis}</Badge>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-300 mb-2">Prescriptions</p>
                    <div className="space-y-2">
                      {selectedVisitData.prescriptions.map((rx, idx) => (
                        <div key={idx} className="p-3 bg-slate-900/60 border border-slate-700 rounded-lg">
                          <p className="text-sm text-slate-200">{rx}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-300 mb-2">Lab Tests</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedVisitData.labTests.map((test, idx) => (
                        <Badge key={idx} variant="info" size="sm">{test}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-300 mb-2">Notes</p>
                    <p className="text-sm text-slate-400">{selectedVisitData.notes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
