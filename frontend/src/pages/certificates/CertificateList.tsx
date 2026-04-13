import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { FileText, Download, Eye, Calendar } from 'lucide-react';

export default function CertificateList() {
  const { patientId } = useParams();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'SICK_LEAVE' | 'MEDICAL'>('ALL');

  useEffect(() => {
    loadCertificates();
  }, [patientId, filter]);

  const loadCertificates = async () => {
    try {
      const response = await api.get(`/api/v1/certificates/patient/${patientId}`, {
        params: { type: filter !== 'ALL' ? filter : undefined }
      });
      setCertificates(response.data.data);
    } catch (error) {
      console.error('Failed to load certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (id: string) => {
    try {
      const response = await api.get(`/api/v1/certificates/${id}/pdf`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${id}.pdf`;
      a.click();
    } catch (error) {
      console.error('Failed to download certificate:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-slate-400">Loading certificates...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Patient Certificates</h1>
            <p className="text-slate-400 mt-1">{certificates.length} certificates</p>
          </div>
          <div className="flex gap-2">
            {(['ALL', 'SICK_LEAVE', 'MEDICAL'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                onClick={() => setFilter(f)}
              >
                {f.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {certificates.map((cert) => (
            <Card key={cert.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-500" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-50">{cert.title}</h3>
                        <Badge>{cert.type.replace('_', ' ')}</Badge>
                      </div>

                      <p className="text-slate-300 mb-2">{cert.diagnosis || cert.purpose}</p>

                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </div>
                        <span>•</span>
                        <span>Certificate #{cert.certificateNumber}</span>
                        <span>•</span>
                        <span>Dr. {cert.doctor.firstName} {cert.doctor.lastName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => downloadCertificate(cert.id)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {certificates.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-slate-400">No certificates found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
