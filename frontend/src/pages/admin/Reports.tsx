import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import { Download, FileText, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const generateReport = async (reportType: string) => {
    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error('Please select date range');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/api/v1/admin/reports/${reportType}`, dateRange, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report-${Date.now()}.pdf`;
      a.click();

      toast.success('Report generated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    {
      id: 'patient-statistics',
      title: 'Patient Statistics',
      description: 'Patient demographics and visit trends',
      icon: Users,
      color: 'blue'
    },
    {
      id: 'financial-summary',
      title: 'Financial Summary',
      description: 'Revenue, expenses, and billing reports',
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 'clinical-activity',
      title: 'Clinical Activity',
      description: 'Procedures, diagnoses, and outcomes',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      id: 'inventory-report',
      title: 'Inventory Report',
      description: 'Stock levels, usage, and expiry',
      icon: FileText,
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Reports</h1>
          <p className="text-slate-400 mt-1">Generate and download system reports</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  End Date
                </label>
                <Input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <Card key={report.id} className="hover:border-blue-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 bg-${report.color}-500/20 rounded-lg`}>
                      <Icon className={`w-6 h-6 text-${report.color}-500`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-50 mb-1">
                        {report.title}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4">
                        {report.description}
                      </p>
                      <Button
                        onClick={() => generateReport(report.id)}
                        disabled={loading}
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
