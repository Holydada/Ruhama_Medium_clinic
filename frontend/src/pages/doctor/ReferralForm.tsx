import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import { Send, FileText } from 'lucide-react';

export default function ReferralForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    visitId: '',
    referralType: 'SPECIALIST',
    specialty: '',
    facilityName: '',
    facilityAddress: '',
    reason: '',
    clinicalSummary: '',
    investigations: '',
    currentMedications: '',
    urgency: 'ROUTINE'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/v1/doctor/referrals', formData);
      toast.success('Referral created successfully');
      navigate('/doctor/queue');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create referral');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Referral</h1>
          <p className="text-gray-600 mt-1">Create referral to specialist or facility</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Referral Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Referral Type *
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.referralType}
                    onChange={(e) => setFormData({ ...formData, referralType: e.target.value })}
                    required
                  >
                    <option value="SPECIALIST">Specialist Consultation</option>
                    <option value="HOSPITAL">Hospital Admission</option>
                    <option value="DIAGNOSTIC">Diagnostic Center</option>
                    <option value="THERAPY">Therapy/Rehabilitation</option>
                  </select>
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
                    <option value="URGENT">Urgent (within 1 week)</option>
                    <option value="EMERGENCY">Emergency (immediate)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Specialty/Department *
                </label>
                <Input
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="e.g., Cardiology, Orthopedics"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Facility Name *
                </label>
                <Input
                  value={formData.facilityName}
                  onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                  placeholder="Name of hospital or clinic"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Facility Address
                </label>
                <Input
                  value={formData.facilityAddress}
                  onChange={(e) => setFormData({ ...formData, facilityAddress: e.target.value })}
                  placeholder="Address"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clinical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Reason for Referral *
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Brief reason for referral"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Clinical Summary *
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={formData.clinicalSummary}
                  onChange={(e) => setFormData({ ...formData, clinicalSummary: e.target.value })}
                  placeholder="Patient history, examination findings, diagnosis"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Investigations Done
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={formData.investigations}
                  onChange={(e) => setFormData({ ...formData, investigations: e.target.value })}
                  placeholder="Lab results, imaging, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Current Medications
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={formData.currentMedications}
                  onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                  placeholder="List current medications"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              <Send className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Referral'}
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
