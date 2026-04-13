import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import { UserPlus, ArrowRight } from 'lucide-react';

export default function ConvertToFull() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emergencyCase, setEmergencyCase] = useState<any>(null);
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    address: '',
    city: '',
    subcity: '',
    woreda: '',
    kebele: '',
    houseNumber: '',
    emergencyContact: '',
    emergencyContactRelation: '',
    occupation: '',
    maritalStatus: 'SINGLE'
  });

  useEffect(() => {
    loadEmergencyCase();
  }, [caseId]);

  const loadEmergencyCase = async () => {
    try {
      const response = await api.get(`/api/v1/emergency/cases/${caseId}`);
      setEmergencyCase(response.data.data);
    } catch (error) {
      console.error('Failed to load case:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post(`/api/v1/emergency/cases/${caseId}/convert`, formData);
      toast.success('Patient converted to full registration successfully');
      navigate('/emergency-dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to convert patient');
    } finally {
      setLoading(false);
    }
  };

  if (!emergencyCase) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Convert to Full Patient</h1>
          <p className="text-slate-400 mt-1">Complete patient registration</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Case Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Name:</span>
                <span className="text-slate-50 ml-2">{emergencyCase.name}</span>
              </div>
              <div>
                <span className="text-slate-400">Age:</span>
                <span className="text-slate-50 ml-2">{emergencyCase.age}</span>
              </div>
              <div>
                <span className="text-slate-400">Sex:</span>
                <span className="text-slate-50 ml-2">{emergencyCase.sex}</span>
              </div>
              <div>
                <span className="text-slate-400">Phone:</span>
                <span className="text-slate-50 ml-2">{emergencyCase.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Complete Demographics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Date of Birth *
                </label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Marital Status *
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.maritalStatus}
                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                    required
                  >
                    <option value="SINGLE">Single</option>
                    <option value="MARRIED">Married</option>
                    <option value="DIVORCED">Divorced</option>
                    <option value="WIDOWED">Widowed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Occupation
                  </label>
                  <Input
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    City *
                  </label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Subcity *
                  </label>
                  <Input
                    value={formData.subcity}
                    onChange={(e) => setFormData({ ...formData, subcity: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Woreda *
                  </label>
                  <Input
                    value={formData.woreda}
                    onChange={(e) => setFormData({ ...formData, woreda: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Kebele *
                  </label>
                  <Input
                    value={formData.kebele}
                    onChange={(e) => setFormData({ ...formData, kebele: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  House Number
                </label>
                <Input
                  value={formData.houseNumber}
                  onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Contact Phone *
                  </label>
                  <Input
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="+251..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Relation *
                  </label>
                  <Input
                    value={formData.emergencyContactRelation}
                    onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                    placeholder="Mother, Father, Spouse, etc."
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              <UserPlus className="w-4 h-4 mr-2" />
              {loading ? 'Converting...' : 'Convert to Full Patient'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/emergency-dashboard')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
