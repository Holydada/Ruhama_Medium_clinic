import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Search, User } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { receptionModuleSubnav } from '../../navigation/moduleSubnavItems';

interface UltrasoundBooking {
  id: string;
  patientName: string;
  cardNumber: string;
  type: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  amount: number;
  paymentStatus: 'paid' | 'pending';
}

export const UltrasoundBooking: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookings, setBookings] = useState<UltrasoundBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [patientResults, setPatientResults] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    patientSearch: '',
    selectedPatient: null as any,
    ultrasoundType: '',
    preferredDate: '',
    notes: '',
    visitId: '',
    isFollowUp: 'false',
  });

  const ultrasoundTypes = [
    'Obstetric Ultrasound',
    'Abdominal Ultrasound',
    'Pelvic Ultrasound',
    'Thyroid Ultrasound',
    'Breast Ultrasound',
    'Renal Ultrasound',
  ];

  const [patientVisits, setPatientVisits] = useState<any[]>([]);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const [resp, txResp] = await Promise.all([
        api.get('/ultrasound', { params: { limit: 50 } }),
        api.get('/finance/transactions', { params: { transactionType: 'ULTRASOUND_FEE', limit: 200 } }),
      ]);
      const rows = resp.data?.data?.orders || [];
      const txRows = txResp.data?.data?.transactions || [];
      const mapped: UltrasoundBooking[] = rows.map((row: any) => ({
        // Payment is inferred from finance transactions linked by order number in description.
        // Keeps booking view aligned with actual cashier actions.
        id: row.id,
        patientName: row.patient?.fullName || 'Unknown',
        cardNumber: row.patient?.cardNumber || 'N/A',
        type: row.ultrasoundType || 'Ultrasound',
        date: (row.scheduledDate || row.createdAt || new Date().toISOString()).slice(0, 10),
        time: row.scheduledDate
          ? new Date(row.scheduledDate).toTimeString().slice(0, 5)
          : 'N/A',
        status:
          row.status === 'COMPLETED' ? 'completed' :
          row.status === 'CANCELLED' ? 'cancelled' : 'scheduled',
        amount: Number(row.price || 0),
        paymentStatus: txRows.some((tx: any) =>
          String(tx.description || '').includes(String(row.orderNumber || '')) &&
          tx.paymentStatus === 'PAID'
        )
          ? 'paid'
          : 'pending',
      }));
      setBookings(mapped);
    } catch (_error) {
      toast.error('Failed to load ultrasound bookings.');
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadBookings();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!formData.patientSearch.trim() || formData.selectedPatient) {
        setPatientResults([]);
        return;
      }
      try {
        const resp = await api.get('/patients', {
          params: { search: formData.patientSearch, limit: 8 },
        });
        setPatientResults(resp.data?.data?.patients || []);
      } catch (_error) {
        setPatientResults([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [formData.patientSearch, formData.selectedPatient]);

  const loadPatientVisits = async (patientId: string) => {
    try {
      const resp = await api.get('/visits', { params: { limit: 100 } });
      const rows = resp.data?.data?.visits || [];
      setPatientVisits(rows.filter((v: any) => v.patient?.id === patientId));
    } catch (_error) {
      setPatientVisits([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selectedPatient?.id || !formData.visitId || !formData.ultrasoundType) {
      toast.info('Please select patient, visit, and ultrasound type.');
      return;
    }
    setIsSaving(true);
    try {
      await api.post('/ultrasound', {
        visitId: formData.visitId,
        patientId: formData.selectedPatient.id,
        ultrasoundType: formData.ultrasoundType,
        isFollowUp: formData.isFollowUp === 'true',
        clinicalIndication: formData.notes || 'Reception booking',
        scheduledDate: formData.preferredDate || undefined,
      });
      toast.success('Ultrasound booking created successfully.');
      setShowBookingForm(false);
      setFormData({
        patientSearch: '',
        selectedPatient: null,
        ultrasoundType: '',
        preferredDate: '',
        notes: '',
        visitId: '',
        isFollowUp: 'false',
      });
      await loadBookings();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to create ultrasound booking.');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedTypePrice = useMemo(() => (formData.isFollowUp === 'true' ? 400 : 200), [formData.isFollowUp]);
  const filteredBookings = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter((b) =>
      b.patientName.toLowerCase().includes(q) ||
      b.cardNumber.toLowerCase().includes(q) ||
      b.type.toLowerCase().includes(q)
    );
  }, [bookings, searchTerm]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ultrasound Booking</h1>
          <p className="text-gray-600 mt-1">Schedule ultrasound examinations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => void loadBookings()} isLoading={isLoading}>
            Refresh
          </Button>
          <Button variant="primary" onClick={() => setShowBookingForm(true)}>
            New Booking
          </Button>
        </div>
      </div>

      <ModuleSubnav items={receptionModuleSubnav} ariaLabel="Reception workflow" />

      {showBookingForm ? (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Book Ultrasound</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              icon={Search}
              label="Search Patient"
              placeholder="Enter card number or name..."
              value={formData.patientSearch}
              onChange={(e) => setFormData({ ...formData, patientSearch: e.target.value })}
            />

            {formData.patientSearch && !formData.selectedPatient && (
              <div className="space-y-2">
                {patientResults.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="w-full rounded border border-gray-200 p-3 text-left hover:bg-blue-50"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        selectedPatient: p,
                        patientSearch: '',
                      }));
                      void loadPatientVisits(p.id);
                    }}
                  >
                    <p className="font-medium text-gray-900">{p.fullName}</p>
                    <p className="text-xs text-gray-600">{p.cardNumber}</p>
                  </button>
                ))}
              </div>
            )}

            {formData.selectedPatient && (
              <div className="rounded border border-blue-200 bg-blue-50 p-3">
                <p className="font-medium text-gray-900">{formData.selectedPatient.fullName}</p>
                <p className="text-xs text-gray-600">{formData.selectedPatient.cardNumber}</p>
              </div>
            )}

            <Select
              label="Visit"
              required
              value={formData.visitId}
              onChange={(e) => setFormData({ ...formData, visitId: e.target.value })}
            >
              <option value="">Select visit...</option>
              {patientVisits.map((visit) => (
                <option key={visit.id} value={visit.id}>
                  {visit.id.slice(0, 8)}... - {visit.serviceType}
                </option>
              ))}
            </Select>

            <Select
              label="Ultrasound Type"
              required
              value={formData.ultrasoundType}
              onChange={(e) => setFormData({ ...formData, ultrasoundType: e.target.value })}
            >
              <option value="">Select type...</option>
              {ultrasoundTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Preferred Date"
                type="datetime-local"
                required
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              />
              <Select
                label="Visit Category"
                value={formData.isFollowUp}
                onChange={(e) => setFormData({ ...formData, isFollowUp: e.target.value })}
              >
                <option value="false">One-time</option>
                <option value="true">Follow-up</option>
              </Select>
            </div>

            {formData.ultrasoundType && (
              <Card className="p-4 bg-blue-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">{formData.ultrasoundType}</p>
                    <p className="text-sm text-gray-600">Pricing based on clinic rule</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{selectedTypePrice} ETB</p>
                </div>
              </Card>
            )}

            <div className="flex gap-3">
              <Button type="submit" variant="primary" className="flex-1" isLoading={isSaving}>
                Book & Collect Payment
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowBookingForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="p-4">
            <Input
              icon={Search}
              placeholder="Search booking by patient, card, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Card>
          {filteredBookings.map(booking => (
            <Card key={booking.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{booking.patientName}</h3>
                    <p className="text-sm text-gray-600">{booking.cardNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{booking.type}</p>
                  <p className="text-sm text-gray-600">{booking.date} at {booking.time}</p>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <Badge variant={booking.status === 'completed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'info'}>
                    {booking.status}
                  </Badge>
                  <Badge variant={booking.paymentStatus === 'paid' ? 'success' : 'warning'}>
                    Payment: {booking.paymentStatus}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
          {filteredBookings.length === 0 && !isLoading && (
            <Card className="p-6">
              <p className="text-sm text-gray-600">No ultrasound bookings available.</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
