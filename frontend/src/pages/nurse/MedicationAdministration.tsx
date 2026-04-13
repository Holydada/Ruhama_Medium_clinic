import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Pill } from 'lucide-react';
import { toast } from '../../lib/toast';
import { api } from '../../lib/api';

interface MedLine {
  key: string;
  prescriptionId: string;
  prescriptionNumber: string;
  patientName: string;
  cardNumber: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  status: string;
}

export const MedicationAdministration: React.FC = () => {
  const [lines, setLines] = useState<MedLine[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const resp = await api.get('/prescriptions', { params: { limit: 200, status: 'PENDING' } });
      const prescriptions = resp.data?.data?.prescriptions || [];
      const flat: MedLine[] = [];
      for (const rx of prescriptions) {
        const items = rx.items || [];
        for (const it of items) {
          flat.push({
            key: `${rx.id}-${it.id}`,
            prescriptionId: rx.id,
            prescriptionNumber: rx.prescriptionNumber || rx.id,
            patientName: rx.patient?.fullName || 'Unknown',
            cardNumber: rx.patient?.cardNumber || '—',
            drugName: it.drugName || 'Medication',
            dosage: it.dosage || '—',
            frequency: it.frequency || '—',
            duration: it.duration || '—',
            status: rx.status || 'PENDING',
          });
        }
      }
      setLines(flat);
    } catch {
      toast.error('Failed to load pending prescriptions.');
      setLines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medication orders</h1>
          <p className="text-gray-600 mt-1">
            Pending prescriptions from clinicians. Dispensing and labeling are completed in Pharmacy.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void load()} isLoading={loading}>
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {lines.map((row) => (
          <Card key={row.key} className="p-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Pill className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-gray-900">{row.patientName}</h3>
                    <Badge variant="info" size="sm">
                      {row.cardNumber}
                    </Badge>
                    <Badge variant="warning" size="sm">
                      {row.prescriptionNumber}
                    </Badge>
                  </div>
                  <p className="text-lg text-gray-900 mt-1">{row.drugName}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-gray-600">Dose:</span> {row.dosage}
                    </div>
                    <div>
                      <span className="text-gray-600">Frequency:</span> {row.frequency}
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span> {row.duration}
                    </div>
                  </div>
                </div>
              </div>
              <Badge variant="warning">{row.status}</Badge>
            </div>
          </Card>
        ))}
      </div>

      {lines.length === 0 && !loading && (
        <p className="text-center text-sm text-gray-600 py-8">No pending prescription lines.</p>
      )}
    </div>
  );
};
