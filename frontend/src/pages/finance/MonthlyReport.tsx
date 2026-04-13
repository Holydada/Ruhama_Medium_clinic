import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import { Download, TrendingUp, DollarSign, Users } from 'lucide-react';

export default function MonthlyReport() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/v1/finance/monthly-report', { month });
      setReport(response.data.data);
      toast.success('Report generated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monthly Financial Report</h1>
          <p className="text-gray-600 mt-1">Comprehensive monthly revenue analysis</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-50"
              />
              <Button onClick={generateReport} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {report && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Revenue</p>
                      <p className="text-2xl font-bold text-slate-50 mt-1">
                        ${report.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Patients Served</p>
                      <p className="text-2xl font-bold text-slate-50 mt-1">
                        {report.patientsServed}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Users className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Avg per Patient</p>
                      <p className="text-2xl font-bold text-slate-50 mt-1">
                        ${report.avgPerPatient.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Growth</p>
                      <p className="text-2xl font-bold text-green-500 mt-1">
                        +{report.growthPercent}%
                      </p>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end gap-2">
                  {report.dailyTrend.map((day: any, index: number) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${(day.amount / report.maxDaily) * 100}%` }}
                      />
                      <span className="text-xs text-slate-400 mt-2">{day.day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {report.byDepartment.map((dept: any) => (
                      <div key={dept.name} className="flex items-center justify-between">
                        <span className="text-slate-300">{dept.name}</span>
                        <span className="text-slate-50 font-medium">
                          ${dept.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {report.byPaymentMethod.map((method: any) => (
                      <div key={method.name} className="flex items-center justify-between">
                        <span className="text-slate-300">{method.name}</span>
                        <span className="text-slate-50 font-medium">
                          ${method.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
