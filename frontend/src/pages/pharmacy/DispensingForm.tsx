import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../lib/utils';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

interface Medication {
  id: string;
  drugName: string;
  strength: string;
  dosageForm: string;
  quantity: number;
  frequency: string;
  duration: number;
  durationUnit: string;
  instructions: string;
  route: string;
  price: number;
}

interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientName: string;
  cardNumber: string;
  doctor: string;
  diagnosis: string;
  medications: Medication[];
  date: string;
}

interface DispensingFormProps {
  prescription: Prescription;
  onComplete?: () => void;
  onCancel?: () => void;
}

export const DispensingForm = ({ prescription, onComplete, onCancel }: DispensingFormProps) => {
  const [dispensedItems, setDispensedItems] = useState<Record<string, boolean>>({});
  const [counselingChecks, setCounselingChecks] = useState({
    dosageExplained: false,
    sideEffectsDiscussed: false,
    storageInstructionsGiven: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleDispensed = (medId: string) => {
    setDispensedItems(prev => ({
      ...prev,
      [medId]: !prev[medId],
    }));
  };

  const calculateTotal = () => {
    return prescription.medications.reduce((sum, med) => sum + med.price, 0);
  };

  const allDispensed = prescription.medications.every(med => dispensedItems[med.id]);
  const allCounselingDone = Object.values(counselingChecks).every(check => check);

  const handleComplete = async () => {
    if (!allDispensed) {
      toast.info('Please mark all medications as dispensed.');
      return;
    }
    if (!allCounselingDone) {
      toast.info('Please complete all patient counseling checks.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/prescriptions/${prescription.id}/dispense`);
      setSuccess(true);
      toast.success('Dispensing completed successfully.');
    } catch (error) {
      console.error('Failed to complete dispensing', error);
      toast.error('Failed to complete dispensing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card variant="elevated" className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 mb-6">
              <svg className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-50 mb-2">Dispensing Complete!</h2>
            <p className="text-slate-400 mb-6">Medications have been dispensed successfully</p>
            
            <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-400 mb-2">Total Amount</p>
              <p className="text-3xl font-bold text-emerald-400">{formatCurrency(calculateTotal())}</p>
              <p className="text-sm text-slate-400 mt-2">Payment: Cash</p>
            </div>

            <div className="space-y-3">
              <Button variant="primary" className="w-full">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Receipt
              </Button>
              <Button variant="secondary" className="w-full" onClick={onComplete}>
                Next Prescription
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Medication Dispensing</h1>
            <p className="text-slate-400 mt-1">Dispense prescription medications</p>
          </div>
          <Badge variant="info">{prescription.prescriptionNumber}</Badge>
        </div>

        {/* Patient & Prescription Info */}
        <Card variant="elevated">
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500/20 to-sky-500/20 flex items-center justify-center text-lg font-bold text-slate-200">
                  {prescription.patientName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-slate-50 text-lg">{prescription.patientName}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                    <span>Card: {prescription.cardNumber}</span>
                    <span>Doctor: {prescription.doctor}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">Diagnosis: {prescription.diagnosis}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Date</p>
                <p className="font-semibold text-slate-50">{new Date(prescription.date).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medications to Dispense */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Prescribed Medications</CardTitle>
            <CardDescription>
              {Object.values(dispensedItems).filter(Boolean).length} of {prescription.medications.length} dispensed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {prescription.medications.map((med) => {
              const isDispensed = dispensedItems[med.id];
              
              return (
                <div
                  key={med.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isDispensed
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-slate-800 bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-slate-50">{med.drugName}</h3>
                        <Badge variant="info" size="sm">{med.strength}</Badge>
                        <Badge variant="default" size="sm">{med.dosageForm}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-slate-500">Quantity</p>
                          <p className="text-slate-200 font-semibold">{med.quantity} units</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Frequency</p>
                          <p className="text-slate-200 font-semibold">{med.frequency}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Duration</p>
                          <p className="text-slate-200 font-semibold">{med.duration} {med.durationUnit}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Route</p>
                          <p className="text-slate-200 font-semibold capitalize">{med.route}</p>
                        </div>
                      </div>
                      {med.instructions && (
                        <div className="mt-3 p-2 bg-sky-500/5 border border-sky-500/20 rounded-lg">
                          <p className="text-xs text-slate-400">Instructions:</p>
                          <p className="text-sm text-slate-200">{med.instructions}</p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-2xl font-bold text-emerald-400">{formatCurrency(med.price)}</p>
                    </div>
                  </div>

                  {/* Stock Check */}
                  <div className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-700 rounded-lg mb-3">
                    <div>
                      <p className="text-sm text-slate-400">Stock Available</p>
                      <p className="text-sm font-semibold text-emerald-400">150 units • Batch: MED-2024-A • Exp: Dec 2025</p>
                    </div>
                    <Badge variant="success" size="sm">In Stock</Badge>
                  </div>

                  {/* Dispense Button */}
                  <Button
                    type="button"
                    variant={isDispensed ? 'success' : 'primary'}
                    className="w-full"
                    onClick={() => toggleDispensed(med.id)}
                  >
                    {isDispensed ? (
                      <>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Dispensed
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Mark as Dispensed
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Patient Counseling */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Patient Counseling</CardTitle>
            <CardDescription>Ensure patient understands medication use</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { key: 'dosageExplained', label: 'Dosage and frequency explained to patient' },
              { key: 'sideEffectsDiscussed', label: 'Potential side effects discussed' },
              { key: 'storageInstructionsGiven', label: 'Storage instructions provided' },
            ].map(({ key, label }) => (
              <label
                key={key}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  counselingChecks[key as keyof typeof counselingChecks]
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={counselingChecks[key as keyof typeof counselingChecks]}
                  onChange={(e) => setCounselingChecks(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="h-5 w-5 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950"
                />
                <span className="text-slate-200 font-medium">{label}</span>
                {counselingChecks[key as keyof typeof counselingChecks] && (
                  <svg className="h-5 w-5 text-emerald-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </label>
            ))}
          </CardContent>
        </Card>

        {/* Payment */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Payment</CardTitle>
            <CardDescription>Collect payment for medications (cash only)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-700 rounded-xl mb-4">
              <span className="text-slate-300 font-semibold">Total Amount</span>
              <span className="text-3xl font-bold text-emerald-400">{formatCurrency(calculateTotal())}</span>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-center">
              <p className="font-semibold text-slate-100">Cash payment confirmed at cashier desk</p>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            className="flex-1"
            onClick={handleComplete}
            isLoading={isSubmitting}
            disabled={!allDispensed || !allCounselingDone}
          >
            {isSubmitting ? 'Processing...' : 'Complete Dispensing'}
          </Button>
        </div>
      </div>
    </div>
  );
};
