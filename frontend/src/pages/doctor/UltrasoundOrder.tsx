import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Search, FileText, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

interface PatientSearchRow {
  id: string;
  fullName: string;
  cardNumber: string;
}

interface VisitRow {
  id: string;
  patientId: string;
  patientName: string;
  cardNumber: string;
  serviceType: string;
}

interface UltrasoundOrderProps {
  patientId?: string;
  visitId?: string;
  patientName?: string;
  cardNumber?: string;
}

export const UltrasoundOrder: React.FC<UltrasoundOrderProps> = ({
  patientId,
  visitId,
  patientName,
  cardNumber,
}) => {
  const [searchPatient, setSearchPatient] = useState('');
  const [patientResults, setPatientResults] = useState<PatientSearchRow[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientSearchRow | null>(
    patientId && patientName && cardNumber
      ? { id: patientId, fullName: patientName, cardNumber }
      : null
  );
  const [selectedVisitId, setSelectedVisitId] = useState(visitId || '');
  const [patientVisits, setPatientVisits] = useState<VisitRow[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    ultrasoundType: 'General Ultrasound',
    isFollowUp: 'false',
    clinicalIndication: '',
    preferredDate: '',
  });

  const ultrasoundTypes = [
    'General Ultrasound',
    'Obstetric Ultrasound',
    'Abdominal Ultrasound',
    'Pelvic Ultrasound',
    'Thyroid Ultrasound',
    'Breast Ultrasound',
    'Renal Ultrasound',
    'Cardiac Echo',
    'Carotid Doppler',
  ];

  const searchPatients = async (query: string) => {
    if (!query.trim() || selectedPatient) {
      setPatientResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const resp = await api.get('/patients', { params: { search: query, limit: 8 } });
      const rows = resp.data?.data?.patients || [];
      setPatientResults(
        rows.map((row: any) => ({
          id: row.id,
          fullName: row.fullName,
          cardNumber: row.cardNumber,
        }))
      );
    } catch (_error) {
      setPatientResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      void searchPatients(searchPatient);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchPatient]);

  const loadVisitsForPatient = async (pid: string) => {
    try {
      const resp = await api.get('/visits', { params: { limit: 50 } });
      const rows = resp.data?.data?.visits || [];
      const matched = rows
        .filter((row: any) => row.patient?.id === pid)
        .map((row: any) => ({
          id: row.id,
          patientId: row.patient.id,
          patientName: row.patient.fullName,
          cardNumber: row.patient.cardNumber,
          serviceType: row.serviceType,
        }));
      setPatientVisits(matched);
      if (!selectedVisitId && matched.length > 0) {
        setSelectedVisitId(matched[0].id);
      }
    } catch (_error) {
      setPatientVisits([]);
    }
  };

  useEffect(() => {
    if (selectedPatient?.id && !visitId) {
      void loadVisitsForPatient(selectedPatient.id);
    }
  }, [selectedPatient?.id, visitId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient?.id || !selectedVisitId) {
      toast.info('Please select a patient and visit first.');
      return;
    }
    if (!formData.clinicalIndication.trim()) {
      toast.info('Clinical indication is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/ultrasound', {
        visitId: selectedVisitId,
        patientId: selectedPatient.id,
        ultrasoundType: formData.ultrasoundType,
        isFollowUp: formData.isFollowUp === 'true',
        clinicalIndication: formData.clinicalIndication,
        scheduledDate: formData.preferredDate || undefined,
      });
      toast.success('Ultrasound order submitted successfully.');
      setFormData({
        ultrasoundType: 'General Ultrasound',
        isFollowUp: 'false',
        clinicalIndication: '',
        preferredDate: '',
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to submit ultrasound order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPrice = useMemo(() => (formData.isFollowUp === 'true' ? 400 : 200), [formData.isFollowUp]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Ultrasound Order</h1>
        <p className="text-gray-600 mt-1">Order ultrasound examinations for patients</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Selection */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient Information</h2>
          
          <div className="mb-4">
            <Input
              icon={Search}
              placeholder="Search patient by name or card number..."
              value={searchPatient}
              disabled={Boolean(patientId)}
              onChange={(e) => setSearchPatient(e.target.value)}
            />
          </div>

          {searchPatient && !selectedPatient && (
            <div className="space-y-2 mb-4">
              {patientResults.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => {
                      setSelectedPatient(patient);
                      setSearchPatient('');
                    }}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer"
                  >
                    <div className="font-medium text-gray-900">{patient.fullName}</div>
                    <div className="text-sm text-gray-600">
                      {patient.cardNumber}
                    </div>
                  </div>
                ))}
              {isSearching && <p className="text-xs text-gray-500">Searching...</p>}
            </div>
          )}

          {selectedPatient && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{selectedPatient.fullName}</h3>
                  <p className="text-sm text-gray-600">{selectedPatient.cardNumber}</p>
                </div>
                {!patientId && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPatient(null);
                      setSelectedVisitId('');
                    }}
                  >
                    Change
                  </Button>
                )}
              </div>
            </div>
          )}

          {!visitId && selectedPatient && (
            <div className="mt-4">
              <Select
                label="Visit"
                required
                value={selectedVisitId}
                onChange={(e) => setSelectedVisitId(e.target.value)}
              >
                <option value="">Select visit...</option>
                {patientVisits.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.id.slice(0, 8)}... - {v.serviceType}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </Card>

        {/* Ultrasound Selection */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ultrasound Request</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Ultrasound Type"
              value={formData.ultrasoundType}
              onChange={(e) => setFormData((prev) => ({ ...prev, ultrasoundType: e.target.value }))}
            >
              {ultrasoundTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>

            <Select
              label="Visit Category"
              value={formData.isFollowUp}
              onChange={(e) => setFormData((prev) => ({ ...prev, isFollowUp: e.target.value }))}
            >
              <option value="false">One-time (200 ETB)</option>
              <option value="true">Follow-up (400 ETB)</option>
            </Select>
          </div>
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
            Estimated charge: <span className="font-semibold">{selectedPrice} ETB</span>
          </div>
        </Card>

        {/* Order Details */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
          <Input
            label="Preferred Date"
            type="datetime-local"
            value={formData.preferredDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, preferredDate: e.target.value }))}
          />

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clinical Indication <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                required
                value={formData.clinicalIndication}
                onChange={(e) => setFormData((prev) => ({ ...prev, clinicalIndication: e.target.value }))}
                placeholder="Reason for ultrasound examination..."
              />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3 text-sm text-yellow-900">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <p>
              Ultrasound fees are generated automatically in finance after order creation (cash workflow).
            </p>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>
            <FileText className="w-4 h-4 mr-2" />
            Submit Order
          </Button>
        </div>
      </form>
    </div>
  );
};
