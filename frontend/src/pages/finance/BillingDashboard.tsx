import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { DollarSign, TrendingUp, Users, FileText, Calendar } from 'lucide-react';

export default function BillingDashboard() {
  const [stats, setStats] = useState({
    todayRevenue: 0,
    pendingBills: 0,
    paidBills: 0,
    unpaidBills: 0
  });
  const [recentBills, setRecentBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, billsRes] = await Promise.all([
        api.get('/api/v1/finance/stats'),
        api.get('/api/v1/finance/bills/recent')
      ]);
      setStats(statsRes.data.data);
      setRecentBills(billsRes.data.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing Dashboard</h1>
          <p className="text-gray-600 mt-1">Financial overview and billing management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-gray-600 text-sm">Today's Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${stats.todayRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-success-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-success-600" />
                </div>
              </CardContent>
          </Card>

          <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-gray-600 text-sm">Pending Bills</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingBills}</p>
                </div>
                <div className="p-3 bg-warning-100 rounded-lg">
                  <FileText className="w-6 h-6 text-warning-600" />
                </div>
              </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Paid Bills</p>
                  <p className="text-2xl font-bold text-slate-50 mt-1">{stats.paidBills}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Unpaid Bills</p>
                  <p className="text-2xl font-bold text-slate-50 mt-1">{stats.unpaidBills}</p>
                </div>
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <Users className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                  <div className="flex-1">
                    <p className="text-slate-50 font-medium">
                      {bill.patient.firstName} {bill.patient.lastName}
                    </p>
                    <p className="text-sm text-slate-400">Bill #{bill.billNumber}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-slate-50 font-medium">${bill.totalAmount}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(bill.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={bill.status === 'PAID' ? 'success' : 'warning'}>
                    {bill.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
