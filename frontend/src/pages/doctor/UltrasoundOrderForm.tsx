import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { Activity, Send } from 'lucide-react';

export default function UltrasoundOrderForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    visitId: '',
    studyType: '',
    clinicalIndication: '',
    urgency: 'ROUTINE',
    paymentVerified: false
  });

  const studyTypes = [
    'Obstetric Ultrasound',
    'Abdominal Ultrasound',
    'Pelvic Ultrasound',
    'Thyroid Ultrasound',
    'Breast Ultrasound',
    'Musculoskeletal Ultrasound',
    'Vascular Ultrasound',
    'Cardiac Echo',
    'Renal Ultrasound',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.paymentVerified) {
      toast.error('Please verify payment before submitting order');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/v1/doctor/ultrasound-orders', formData);
      toast.success('Ultrasound order created successfully');
      navigate('/doctor/queue');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ultrasound Order</h1>
          <p className="text-gray-600 mt-1">Order ultrasound study for patient</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Study Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Study Type *
                </label>
                <select
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.studyType}
                  onChange={(e) => setFormData({ ...formData, studyType: e.target.value })}
                  required
                >
                  <option value="">Select study type...</option>
                  {studyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Clinical Indication *
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={formData.clinicalIndication}
                  onChange={(e) => setFormData({ ...formData, clinicalIndication: e.target.value })}
                  placeholder="Reason for ultrasound, clinical findings, suspected diagnosis..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Urgency *
                </label>
                <select
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  required
                >
                  <option value="ROUTINE">Routine</option>
                  <option value="URGENT">Urgent (within 24 hours)</option>
                  <option value="STAT">STAT (immediate)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg mb-4">
                <p className="text-yellow-500 text-sm">
                  Ultrasound requires payment verification before order can be submitted.
                  Fee: 200 ETB (one-time) or 400 ETB (follow-up)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="payment"
                  checked={formData.paymentVerified}
                  onChange={(e) => setFormData({ ...formData, paymentVerified: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="payment" className="text-slate-300">
                  I confirm that payment has been verified
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading || !formData.paymentVerified}>
              <Send className="w-4 h-4 mr-2" />
              {loading ? 'Submitting...' : 'Submit Order'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/doctor/queue')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
