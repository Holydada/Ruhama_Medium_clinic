import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { FileText, Download, Send } from 'lucide-react';

export default function ReportGeneration() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({
    interpretation: '',
    recommendations: '',
    criticalValues: false
  });

  useEffect(() => {
    loadOrderAndResults();
  }, [orderId]);

  const loadOrderAndResults = async () => {
    try {
      const [orderRes, resultsRes] = await Promise.all([
        api.get(`/api/v1/laboratory/orders/${orderId}`),
        api.get(`/api/v1/laboratory/orders/${orderId}/results`)
      ]);
      setOrder(orderRes.data.data);
      setResults(resultsRes.data.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/api/v1/laboratory/reports/${orderId}/generate`, reportData);
      toast.success('Report generated successfully');
      
      // Download PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lab-report-${orderId}.pdf`;
      a.click();
      
      navigate('/laboratory/queue');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  if (!order) return <div className="min-h-screen bg-gray-50 p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Generate Lab Report</h1>
          <p className="text-slate-400 mt-1">
            {order.patient.firstName} {order.patient.lastName} - Order #{order.orderNumber}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Results Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.id} className="flex justify-between items-center p-3 bg-slate-900 rounded-lg">
                  <div>
                    <p className="text-slate-50 font-medium">{result.testName}</p>
                    <p className="text-sm text-slate-400">{result.testCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-50">{result.value} {result.unit}</p>
                    <p className="text-xs text-slate-400">Ref: {result.referenceRange}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Clinical Interpretation
              </label>
              <textarea
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={reportData.interpretation}
                onChange={(e) => setReportData({ ...reportData, interpretation: e.target.value })}
                placeholder="Enter clinical interpretation..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Recommendations
              </label>
              <textarea
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={reportData.recommendations}
                onChange={(e) => setReportData({ ...reportData, recommendations: e.target.value })}
                placeholder="Enter recommendations..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="critical"
                checked={reportData.criticalValues}
                onChange={(e) => setReportData({ ...reportData, criticalValues: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="critical" className="text-slate-300">
                Contains critical values (requires immediate notification)
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={generateReport} disabled={loading}>
            <FileText className="w-4 h-4 mr-2" />
            {loading ? 'Generating...' : 'Generate & Download Report'}
          </Button>
          <Button variant="outline" onClick={() => navigate('/laboratory/queue')}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
