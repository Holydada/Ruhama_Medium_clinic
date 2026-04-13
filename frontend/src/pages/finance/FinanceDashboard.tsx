import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { financeModuleSubnav } from '../../navigation/moduleSubnavItems';
import { formatCurrency, formatDate } from '../../lib/utils';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { getLang, setLang, t, type AppLang } from '../../lib/i18n';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  paymentMethod: 'cash' | 'bank';
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export const FinanceDashboard = () => {
  const navigate = useNavigate();
  const [lang, setLanguage] = useState<AppLang>(getLang());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [closeout, setCloseout] = useState<{
    date: string;
    totals: { collected: number; pending: number; refunded: number; net: number };
    paidCount: number;
    pendingCount: number;
    refundedCount: number;
  } | null>(null);

  const loadFinanceData = async () => {
    setIsLoading(true);
    try {
      const [dailyResp, txResp, closeoutResp] = await Promise.all([
        api.get('/finance/reports/daily'),
        api.get('/finance/transactions', { params: { limit: 200 } }),
        api.get('/finance/closeout/daily'),
      ]);
      const rows = txResp.data?.data?.transactions || [];
      const mapped: Transaction[] = rows.map((row: any) => ({
        id: row.id,
        type: 'income',
        category: row.transactionType,
        amount: Number(row.amount),
        description: row.description || row.transactionType,
        paymentMethod: row.paymentMethod === 'BANK_TRANSFER' ? 'bank' : 'cash',
        date: row.transactionDate,
        status:
          row.paymentStatus === 'PAID'
            ? 'completed'
            : row.paymentStatus === 'CANCELLED'
            ? 'cancelled'
            : 'pending',
      }));
      setTransactions(mapped);
      setCloseout(closeoutResp.data?.data || null);
    } catch (error) {
      console.error('Failed to load finance dashboard', error);
      toast.error('Failed to load finance dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadFinanceData();
    // Auto-refresh every 30 seconds to pick up new lab/injection/pharmacy transactions
    const interval = setInterval(() => void loadFinanceData(), 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayTx = transactions.filter((t) => t.date.slice(0, 10) === today);
    const todayRevenue = todayTx
      .filter((t) => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    const pendingPayments = transactions.filter((t) => t.status === 'pending').length;
    return {
      todayRevenue,
      todayExpenses: 0,
      netIncome: todayRevenue,
      pendingPayments,
    };
  }, [transactions]);

  const revenueBreakdown = useMemo(() => {
    const byType = transactions.reduce((acc, tx) => {
      if (tx.status !== 'completed') return acc;
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);
    const total = Object.values(byType).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(byType).map(([category, amount]) => ({
      category,
      amount,
      count: transactions.filter((t) => t.category === category).length,
      percentage: (amount / total) * 100,
    }));
  }, [transactions]);

  const recentTransactions = useMemo(() => transactions.slice(0, 10), [transactions]);
  const pendingCharges = useMemo(
    () => transactions.filter((t) => t.status === 'pending').slice(0, 8),
    [transactions]
  );

  const getStatusBadge = (status: Transaction['status']) => {
    const variants = {
      completed: { variant: 'success' as const, label: 'Completed' },
      pending: { variant: 'warning' as const, label: 'Pending' },
      cancelled: { variant: 'error' as const, label: 'Cancelled' },
    };
    const { variant, label } = variants[status];
    return <Badge variant={variant} size="sm">{label}</Badge>;
  };

  const getPaymentMethodIcon = (method: Transaction['paymentMethod']) => {
    const icons = {
      cash: '💵',
      bank: '🏦',
    };
    return icons[method];
  };

  const paymentTotals = useMemo(() => {
    const completed = transactions.filter((t) => t.status === 'completed');
    const total = completed.reduce((sum, t) => sum + t.amount, 0);
    const cash = completed
      .filter((t) => t.paymentMethod === 'cash')
      .reduce((sum, t) => sum + t.amount, 0);
    const bank = completed
      .filter((t) => t.paymentMethod === 'bank')
      .reduce((sum, t) => sum + t.amount, 0);
    return { total: total || 1, cash, bank };
  }, [transactions]);

  const markPendingAsPaid = async (transactionId: string) => {
    setPayingId(transactionId);
    try {
      await api.patch(`/finance/transactions/${transactionId}/pay`);
      await loadFinanceData();
    } catch (error) {
      console.error('Failed to mark transaction as paid', error);
      toast.error('Failed to mark transaction as paid.');
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Finance Dashboard</h1>
            <p className="text-slate-400 mt-1">
              {formatDate(new Date())} • {t(lang, 'financialOverview')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-300">{t(lang, 'language')}</label>
            <select
              value={lang}
              onChange={(e) => {
                const next = e.target.value as AppLang;
                setLanguage(next);
                setLang(next);
              }}
              className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
            >
              <option value="en">English</option>
              <option value="am">አማርኛ</option>
            </select>
            <Button variant="outline" size="sm" type="button" onClick={() => navigate('/finance/revenue')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Revenue reports
            </Button>
            <Button variant="primary" size="sm" type="button" onClick={() => navigate('/finance/transactions')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Transactions
            </Button>
          </div>
        </div>

        <ModuleSubnav items={financeModuleSubnav} ariaLabel="Finance sections" />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="elevated" className="border-2 border-emerald-500/20">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Today's Revenue</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">{formatCurrency(stats.todayRevenue)}</p>
                <p className="text-xs text-emerald-500 mt-1">Live data</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="border-2 border-red-500/20">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Today's Expenses</p>
                <p className="text-3xl font-bold text-red-400 mt-1">{formatCurrency(stats.todayExpenses)}</p>
                <p className="text-xs text-red-500 mt-1">Configured expenses not linked yet</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="border-2 border-sky-500/20">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Net Income</p>
                <p className="text-3xl font-bold text-sky-400 mt-1">{formatCurrency(stats.netIncome)}</p>
                <p className="text-xs text-sky-500 mt-1">Calculated from collected income</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending Payments</p>
                <p className="text-3xl font-bold text-amber-400 mt-1">{stats.pendingPayments}</p>
                <p className="text-xs text-slate-500 mt-1">Awaiting cashier confirmation</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Breakdown */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Today's income by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueBreakdown.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-sky-500/20 flex items-center justify-center text-sm font-bold text-emerald-400">
                        {item.percentage.toFixed(0)}%
                      </div>
                      <div>
                        <p className="font-semibold text-slate-50">{item.category}</p>
                        <p className="text-xs text-slate-400">{item.count} transactions</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-emerald-400">{formatCurrency(item.amount)}</p>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-sky-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Closeout */}
        <Card variant="elevated" className="border-2 border-amber-500/20">
          <CardHeader>
            <CardTitle>{t(lang, 'dailyCloseoutAndReconciliation')}</CardTitle>
            <CardDescription>
              {closeout?.date || 'Today'} cash/bank reconciliation snapshot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="rounded-lg border border-slate-800 p-3">
                <p className="text-xs text-slate-400">Collected</p>
                <p className="text-lg font-bold text-emerald-400">{formatCurrency(closeout?.totals.collected || 0)}</p>
              </div>
              <div className="rounded-lg border border-slate-800 p-3">
                <p className="text-xs text-slate-400">Pending</p>
                <p className="text-lg font-bold text-amber-400">{formatCurrency(closeout?.totals.pending || 0)}</p>
              </div>
              <div className="rounded-lg border border-slate-800 p-3">
                <p className="text-xs text-slate-400">Refunded</p>
                <p className="text-lg font-bold text-red-400">{formatCurrency(closeout?.totals.refunded || 0)}</p>
              </div>
              <div className="rounded-lg border border-slate-800 p-3">
                <p className="text-xs text-slate-400">Net</p>
                <p className="text-lg font-bold text-sky-400">{formatCurrency(closeout?.totals.net || 0)}</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Paid: {closeout?.paidCount || 0} | Pending: {closeout?.pendingCount || 0} | Refunded: {closeout?.refundedCount || 0}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t(lang, 'recentTransactions')}</CardTitle>
                <CardDescription>Latest financial activities</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => void loadFinanceData()} isLoading={isLoading}>
                Refresh
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Payment</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <Badge variant={transaction.type === 'income' ? 'success' : 'error'} size="sm">
                          {transaction.type === 'income' ? '↓ Income' : '↑ Expense'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-300 font-medium">{transaction.category}</td>
                      <td className="py-4 px-4 text-sm text-slate-400">{transaction.description}</td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-300">
                          {getPaymentMethodIcon(transaction.paymentMethod)} {transaction.paymentMethod}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`text-sm font-bold ${transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(transaction.status)}</td>
                      <td className="py-4 px-4 text-right">
                        {transaction.status === 'pending' ? (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => void markPendingAsPaid(transaction.id)}
                            isLoading={payingId === transaction.id}
                          >
                            Mark Paid
                          </Button>
                        ) : (
                          <Badge variant={transaction.status === 'completed' ? 'success' : 'error'} size="sm">
                            {transaction.status === 'completed' ? 'Paid' : 'Cancelled'}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Cashier Pending Charges */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>{t(lang, 'cashierPendingCharges')}</CardTitle>
            <CardDescription>Mark pending system charges as paid</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingCharges.length === 0 && (
              <p className="text-sm text-slate-400">No pending charges right now.</p>
            )}
            {pendingCharges.map((charge) => (
              <div
                key={charge.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-100">{charge.category}</p>
                  <p className="text-xs text-slate-400">{charge.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-amber-400">{formatCurrency(charge.amount)}</p>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => void markPendingAsPaid(charge.id)}
                    isLoading={payingId === charge.id}
                  >
                    {t(lang, 'markPaid')}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payment Methods Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>💵</span>
                Cash Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-50 mb-2">{formatCurrency(paymentTotals.cash)}</p>
              <p className="text-sm text-slate-400">
                {((paymentTotals.cash / paymentTotals.total) * 100).toFixed(1)}% of collected revenue
              </p>
              <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${(paymentTotals.cash / paymentTotals.total) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🏦</span>
                Bank Transfers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-50 mb-2">{formatCurrency(paymentTotals.bank)}</p>
              <p className="text-sm text-slate-400">
                {((paymentTotals.bank / paymentTotals.total) * 100).toFixed(1)}% of collected revenue
              </p>
              <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500"
                  style={{ width: `${(paymentTotals.bank / paymentTotals.total) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
