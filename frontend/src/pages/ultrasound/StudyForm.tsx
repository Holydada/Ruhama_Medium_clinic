import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import { Save, Upload } from 'lucide-react';

export default function StudyForm() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [formData, setFormData] = useState({
    findings: '',
    impression: '',
    recommendations: '',
    images: [] as File[]
  });

  useEffect(() => {
    if (orderId) loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const response = await api.get(`/api/v1/ultrasound/orders/${orderId}`);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Failed to load order:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('findings', formData.findings);
      formDataToSend.append('impression', formData.impression);
      formDataToSend.append('recommendations', formData.recommendations);
      
      formData.images.forEach((file) => {
        formDataToSend.append('images', file);
      });

      await api.post(`/api/v1/ultrasound/studies/${orderId}/complete`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Study completed successfully');
      navigate('/ultrasound/queue');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to complete study');
    } finally {
      setLoading(false);
    }
  };

  if (!order) return <div className="min-h-screen bg-gray-50 p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Ultrasound Study</h1>
          <p className="text-slate-400 mt-1">
            {order.patient.firstName} {order.patient.lastName} - {order.studyType}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Clinical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-slate-400">Study Type</label>
              <p className="text-slate-50">{order.studyType}</p>
            </div>
            <div>
              <label className="text-sm text-slate-400">Clinical Indication</label>
              <p className="text-slate-50">{order.clinicalIndication}</p>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Study Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Findings *
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  value={formData.findings}
                  onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Impression *
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={formData.impression}
                  onChange={(e) => setFormData({ ...formData, impression: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Recommendations
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={formData.recommendations}
                  onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Upload Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, images: Array.from(e.target.files || []) })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50"
                />
                {formData.images.length > 0 && (
                  <p className="text-sm text-slate-400 mt-2">
                    {formData.images.length} image(s) selected
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Complete Study'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/ultrasound/queue')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
