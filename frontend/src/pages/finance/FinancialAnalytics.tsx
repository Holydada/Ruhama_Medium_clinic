import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { financeModuleSubnav } from '../../navigation/moduleSubnavItems';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function pctChange(current: number, previous: number): number {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export const FinancialAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [revenueCur, setRevenueCur] = useState(0);
  const [revenuePrev, setRevenuePrev] = useState(0);
  const [refundsCur, setRefundsCur] = useState(0);
  const [refundsPrev, setRefundsPrev] = useState(0);
  const [txCountCur, setTxCountCur] = useState(0);
  const [txCountPrev, setTxCountPrev] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    const end = new Date();
    const curStart = ymd(addDays(end, -29));
    const curEnd = ymd(end);
    const prevStart = ymd(addDays(end, -59));
    const prevEnd = ymd(addDays(end, -30));

    try {
      const [revCur, revPrev, refCur, refPrev, paidCur, paidPrev] = await Promise.all([
        api.get('/finance/reports/revenue', { params: { startDate: curStart, endDate: curEnd } }),
        api.get('/finance/reports/revenue', { params: { startDate: prevStart, endDate: prevEnd } }),
        api.get('/finance/transactions', {
          params: { startDate: curStart, endDate: curEnd, paymentStatus: 'REFUNDED', limit: 500 },
        }),
        api.get('/finance/transactions', {
          params: { startDate: prevStart, endDate: prevEnd, paymentStatus: 'REFUNDED', limit: 500 },
        }),
        api.get('/finance/transactions', {
          params: { startDate: curStart, endDate: curEnd, paymentStatus: 'PAID', limit: 500 },
        }),
        api.get('/finance/transactions', {
          params: { startDate: prevStart, endDate: prevEnd, paymentStatus: 'PAID', limit: 500 },
        }),
      ]);

      const r0 = Number(revCur.data?.data?.totalRevenue ?? 0);
      const r1 = Number(revPrev.data?.data?.totalRevenue ?? 0);
      setRevenueCur(r0);
      setRevenuePrev(r1);

      const sumRef = (resp: { data?: { data?: { transactions?: { amount: unknown }[] } } }) =>
        (resp.data?.data?.transactions ?? []).reduce((s, t) => s + Number(t.amount), 0);
      setRefundsCur(sumRef(refCur));
      setRefundsPrev(sumRef(refPrev));

      setTxCountCur((paidCur.data?.data?.transactions ?? []).length);
      setTxCountPrev((paidPrev.data?.data?.transactions ?? []).length);
    } catch {
      toast.error('Failed to load financial analytics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const netCur = revenueCur - refundsCur;
  const netPrev = revenuePrev - refundsPrev;
  const revChange = pctChange(revenueCur, revenuePrev);
  const refChange = pctChange(refundsCur, refundsPrev);
  const netChange = pctChange(netCur, netPrev);
  const avgCur = txCountCur > 0 ? revenueCur / txCountCur : 0;
  const avgPrev = txCountPrev > 0 ? revenuePrev / txCountPrev : 0;
  const avgChange = pctChange(avgCur, avgPrev);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Financial Analytics</h1>
      <p className="text-sm text-gray-600 mb-2">
        Rolling 30-day window vs the prior 30 days. Refunds are shown as outflows; operational expense
        categories are not tracked in this API yet.
      </p>

      <ModuleSubnav items={financeModuleSubnav} ariaLabel="Finance sections" />

      {loading ? (
        <p className="text-gray-600 mt-6">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Paid revenue</p>
                <p className="text-3xl font-bold text-gray-900">{revenueCur.toLocaleString()} ETB</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {revChange >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={revChange >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {revChange >= 0 ? '+' : ''}
                {revChange.toFixed(1)}%
              </span>
              <span className="text-gray-600 text-sm">vs prior 30 days</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Refunds (outflows)</p>
                <p className="text-3xl font-bold text-gray-900">{refundsCur.toLocaleString()} ETB</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {refChange <= 0 ? (
                <TrendingDown className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingUp className="w-4 h-4 text-red-600" />
              )}
              <span className={refChange <= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {refChange >= 0 ? '+' : ''}
                {refChange.toFixed(1)}%
              </span>
              <span className="text-gray-600 text-sm">vs prior 30 days</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Net (revenue − refunds)</p>
                <p className="text-3xl font-bold text-gray-900">{netCur.toLocaleString()} ETB</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {netChange >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={netChange >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {netChange >= 0 ? '+' : ''}
                {netChange.toFixed(1)}%
              </span>
              <span className="text-gray-600 text-sm">vs prior 30 days</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Avg paid ticket</p>
                <p className="text-3xl font-bold text-gray-900">
                  {avgCur.toLocaleString(undefined, { maximumFractionDigits: 0 })} ETB
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">📊</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {avgChange >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={avgChange >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {avgChange >= 0 ? '+' : ''}
                {avgChange.toFixed(1)}%
              </span>
              <span className="text-gray-600 text-sm">vs prior 30 days</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
