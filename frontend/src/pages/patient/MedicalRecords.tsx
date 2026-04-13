import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { FileText, Download, Eye, Calendar } from 'lucide-react';

interface MedicalRecord {
  id: string;
  type: string;
  title: string;
  date: Date;
  provider: string;
  fileUrl?: string;
  status: string;
}

export default function MedicalRecords() {
  const { patientId } = useParams();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    loadRecords();
  }, [patientId]);

  const loadRecords = async () => {
    try {
      const response = await api.get(`/api/v1/patients/${patientId}/records`);
      setRecords(response.data.data);
    } catch (error) {
      console.error('Failed to load records:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = filter === 'ALL' 
    ? records 
    : records.filter(r => r.type === filter);

  const recordTypes = ['ALL', 'LAB_RESULT', 'PRESCRIPTION', 'CERTIFICATE', 'IMAGING', 'CONSULTATION'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-slate-400">Loading records...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Medical Records</h1>
            <p className="text-slate-400 mt-1">{filteredRecords.length} records</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {recordTypes.map((type) => (
            <Button
              key={type}
              variant={filter === type ? 'default' : 'outline'}
              onClick={() => setFilter(type)}
              size="sm"
            >
              {type.replace('_', ' ')}
            </Button>
          ))}
        </div>

        <div className="grid gap-4">
          {filteredRecords.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-500" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-50">{record.title}</h3>
                        <Badge>{record.type.replace('_', ' ')}</Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                        <span>•</span>
                        <span>{record.provider}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {record.fileUrl && (
                      <>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredRecords.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-slate-400">No records found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
