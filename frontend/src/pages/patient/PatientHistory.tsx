import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { Calendar, FileText, Pill, TestTube, Activity } from 'lucide-react';

export default function PatientHistory() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatientHistory();
  }, [patientId]);

  const loadPatientHistory = async () => {
    try {
      const [patientRes, historyRes] = await Promise.all([
        api.get(`/api/v1/patients/${patientId}`),
        api.get(`/api/v1/patients/${patientId}/history`)
      ]);
      setPatient(patientRes.data.data);
      setHistory(historyRes.data.data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-slate-400">Loading patient history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Patient History</h1>
          {patient && (
            <p className="text-slate-400 mt-1">
              {patient.firstName} {patient.lastName} - {patient.cardNumber}
            </p>
          )}
        </div>

        <div className="grid gap-4">
          {history.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    {item.type === 'VISIT' && <Activity className="w-5 h-5 text-blue-500" />}
                    {item.type === 'PRESCRIPTION' && <Pill className="w-5 h-5 text-green-500" />}
                    {item.type === 'LAB' && <TestTube className="w-5 h-5 text-purple-500" />}
                    {item.type === 'DOCUMENT' && <FileText className="w-5 h-5 text-yellow-500" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-slate-50">{item.title}</h3>
                      <Badge>{item.type}</Badge>
                    </div>
                    
                    <p className="text-slate-300 mb-2">{item.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.date).toLocaleDateString()}
                      {item.provider && (
                        <>
                          <span>•</span>
                          <span>{item.provider}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {history.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-slate-400">No history records found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
