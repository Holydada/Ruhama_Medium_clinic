import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Search, Download, Filter, TrendingUp, DollarSign, CreditCard, Banknote } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { financeModuleSubnav } from '../../navigation/moduleSubnavItems';

interface Transaction {
  id: string;
  transactionId: string;
  date: string;
  time: string;
  patientName: string;
  cardNumber: string;
  service: string;
  amount: number;
  paymentMethod: 'cash' | 'bank';
  status: 'completed' | 'pending' | 'refunded';
  receivedBy?: string;
  receiptNumber?: string;
  refundRequested?: boolean;
}

export const TransactionHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterService, setFilterService] = useState('all');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refundAction, setRefundAction] = useState<{ id: string; mode: 'request' | 'approve' } | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [isRefundSubmitting, setIsRefundSubmitting] = useState(false);

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash': return <Banknote className="w-4 h-4" />;
      case 'bank': return <CreditCard className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'refunded': return 'danger';
      default: return 'warning';
    }
  };

  const filteredTransactions = useMemo(() => transactions.filter(txn => {
    const matchesSearch = 
      txn.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (txn.receiptNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || txn.date === filterDate;
    const matchesMethod = filterMethod === 'all' || txn.paymentMethod === filterMethod;
    const matchesService = filterService === 'all' || txn.service === filterService;
    return matchesSearch && matchesDate && matchesMethod && matchesService;
  }), [transactions, searchTerm, filterDate, filterMethod, filterService]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const resp = await api.get('/finance/transactions', {
        params: {
          startDate: filterDate || undefined,
          paymentMethod: filterMethod === 'all' ? undefined : filterMethod.toUpperCase(),
          transactionType: filterService === 'all' ? undefined : filterService,
          limit: 300,
        },
      });
      const rows = resp.data?.data?.transactions || [];
      const mapped: Transaction[] = rows.map((row: any) => {
        const dt = new Date(row.transactionDate);
        return {
          id: row.id,
          transactionId: row.transactionNumber,
          date: dt.toISOString().slice(0, 10),
          time: dt.toTimeString().slice(0, 5),
          patientName: row.patient?.fullName || 'N/A',
          cardNumber: row.patient?.cardNumber || '-',
          service: row.transactionType,
          amount: Number(row.amount),
          paymentMethod: row.paymentMethod === 'BANK_TRANSFER' ? 'bank' : 'cash',
          status:
            row.paymentStatus === 'PAID'
              ? 'completed'
              : row.paymentStatus === 'REFUNDED'
              ? 'refunded'
              : 'pending',
          receivedBy: row.collectedBy?.fullName,
          receiptNumber: row.referenceNumber || '-',
          refundRequested: String(row.description || '').includes('REFUND_REQUESTED'),
        };
      });
      setTransactions(mapped);
    } catch (e) {
      console.error('Failed to load transactions', e);
      toast.error('Failed to load transactions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTransactions();
  }, []);

  const markPaid = async (id: string) => {
    try {
      await api.patch(`/finance/transactions/${id}/pay`, {});
      await loadTransactions();
      toast.success('Transaction marked as paid.');
    } catch (e) {
      console.error('Failed to mark transaction paid', e);
      toast.error('Failed to mark transaction as paid.');
    }
  };

  const requestRefund = async (id: string, reason: string) => {
    try {
      await api.post(`/finance/transactions/${id}/refund-request`, { reason });
      await loadTransactions();
      toast.success('Refund request submitted.');
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to request refund.');
    }
  };

  const approveRefund = async (id: string, reason: string) => {
    try {
      await api.post(`/finance/transactions/${id}/refund-approve`, { reason });
      await loadTransactions();
      toast.success('Refund approved.');
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to approve refund.');
    }
  };

  const submitRefundAction = async () => {
    if (!refundAction) return;
    if (!refundReason.trim()) {
      toast.info('Reason is required.');
      return;
    }
    setIsRefundSubmitting(true);
    try {
      if (refundAction.mode === 'request') {
        await requestRefund(refundAction.id, refundReason.trim());
      } else {
        await approveRefund(refundAction.id, refundReason.trim());
      }
      setRefundAction(null);
      setRefundReason('');
    } finally {
      setIsRefundSubmitting(false);
    }
  };

  const stats = {
    totalRevenue: transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    totalTransactions: transactions.length,
    cashTransactions: transactions.filter(t => t.paymentMethod === 'cash' && t.status === 'completed').length,
    bankTransactions: transactions.filter(t => t.paymentMethod === 'bank' && t.status === 'completed').length,
    pendingAmount: transactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0)
  };

  const handleExport = () => {
    if (filteredTransactions.length === 0) {
      toast.info('No transactions available to export.');
      return;
    }
    const headers = [
      'Transaction ID',
      'Date',
      'Time',
      'Patient Name',
      'Card Number',
      'Service',
      'Amount',
      'Payment Method',
      'Status',
      'Receipt Number',
      'Received By',
    ];
    const rows = filteredTransactions.map((txn) => [
      txn.transactionId,
      txn.date,
      txn.time,
      txn.patientName,
      txn.cardNumber,
      txn.service,
      String(txn.amount),
      txn.paymentMethod,
      txn.status,
      txn.receiptNumber || '',
      txn.receivedBy || '',
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transaction-history-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Transaction report exported.');
  };

  const printTransactionSlip = (txn: Transaction) => {
    const amount = `${txn.amount.toFixed(2)} ETB`;
    const content = `
      <html>
        <head>
          <title>Transaction Slip ${txn.transactionId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
            .slip { max-width: 420px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 16px; }
            .header { text-align: center; margin-bottom: 12px; }
            .title { font-size: 20px; font-weight: bold; }
            .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #eee; }
            .row:last-child { border-bottom: none; }
            .label { color: #555; }
            .value { font-weight: 600; }
            .amount { font-size: 20px; color: #065f46; font-weight: 700; }
            .footer { margin-top: 14px; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="slip">
            <div class="header">
              <div class="title">Payment Slip</div>
              <div>Ruhama Clinic Management System</div>
            </div>
            <div class="row"><span class="label">Transaction ID</span><span class="value">${txn.transactionId}</span></div>
            <div class="row"><span class="label">Receipt No</span><span class="value">${txn.receiptNumber || '-'}</span></div>
            <div class="row"><span class="label">Date</span><span class="value">${txn.date} ${txn.time}</span></div>
            <div class="row"><span class="label">Patient</span><span class="value">${txn.patientName}</span></div>
            <div class="row"><span class="label">Card Number</span><span class="value">${txn.cardNumber}</span></div>
            <div class="row"><span class="label">Service</span><span class="value">${txn.service}</span></div>
            <div class="row"><span class="label">Payment Method</span><span class="value">${txn.paymentMethod.toUpperCase()}</span></div>
            <div class="row"><span class="label">Status</span><span class="value">${txn.status.toUpperCase()}</span></div>
            <div class="row"><span class="label">Received By</span><span class="value">${txn.receivedBy || '-'}</span></div>
            <div class="row"><span class="label">Amount</span><span class="amount">${amount}</span></div>
            <div class="footer">Generated ${new Date().toLocaleString()}</div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    const win = window.open('', '_blank', 'width=700,height=900');
    if (!win) {
      toast.error('Popup blocked. Please allow popups to print slip.');
      return;
    }
    win.document.open();
    win.document.write(content);
    win.document.close();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600 mt-1">View and manage all financial transactions</p>
        </div>
        <Button variant="primary" onClick={handleExport} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      <ModuleSubnav items={financeModuleSubnav} ariaLabel="Finance sections" />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalRevenue} ETB</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cash Payments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cashTransactions}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Banknote className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingAmount} ETB</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      {refundAction && (
        <Card className="p-4 mb-6 border-amber-300 bg-amber-50">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-semibold text-amber-900">
                {refundAction.mode === 'request' ? 'Request Refund' : 'Approve Refund'}
              </p>
              <p className="text-xs text-amber-700">Provide the required reason before continuing.</p>
            </div>
            <textarea
              className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm"
              rows={3}
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder={
                refundAction.mode === 'request'
                  ? 'Enter refund request reason...'
                  : 'Enter approval note/reason...'
              }
            />
            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm" onClick={() => void submitRefundAction()} isLoading={isRefundSubmitting}>
                Confirm
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRefundAction(null);
                  setRefundReason('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            icon={Search}
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Input
            type="date"
            label="Date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />

          <Select
            label="Payment Method"
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
          >
            <option value="all">All Methods</option>
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
          </Select>

          <Select
            label="Service Type"
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
          >
            <option value="all">All Services</option>
            <option value="Card Fee">Card Fee</option>
            <option value="ULTRASOUND_FEE">Ultrasound</option>
            <option value="LAB_FEE">Laboratory</option>
            <option value="INJECTION_FEE">Injection</option>
            <option value="CARD_FEE">Card Fee</option>
          </Select>
          <Button variant="outline" onClick={() => void loadTransactions()} isLoading={isLoading}>
            Refresh
          </Button>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{txn.transactionId}</div>
                    <div className="text-xs text-gray-500">{txn.receiptNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div>{txn.date}</div>
                    <div className="text-xs text-gray-500">{txn.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{txn.patientName}</div>
                    <div className="text-xs text-gray-500">{txn.cardNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {txn.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-bold text-gray-900">{txn.amount} ETB</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(txn.paymentMethod)}
                      <span className="text-sm text-gray-600 capitalize">{txn.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(txn.status)}>
                      {txn.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => printTransactionSlip(txn)}>
                        Print Slip
                      </Button>
                      {txn.status === 'pending' && (
                        <Button variant="primary" size="sm" onClick={() => void markPaid(txn.id)}>
                          Mark Paid
                        </Button>
                      )}
                      {txn.status === 'completed' && !txn.refundRequested && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setRefundAction({ id: txn.id, mode: 'request' });
                            setRefundReason('');
                          }}
                        >
                          Request Refund
                        </Button>
                      )}
                      {txn.status === 'completed' && txn.refundRequested && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setRefundAction({ id: txn.id, mode: 'approve' });
                            setRefundReason('');
                          }}
                        >
                          Approve Refund
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredTransactions.length === 0 && (
        <Card className="p-12 text-center mt-6">
          <p className="text-gray-500">No transactions found</p>
        </Card>
      )}

      {/* Summary Footer */}
      <Card className="p-4 mt-6 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
          <div className="text-lg font-bold text-gray-900">
            Total: {filteredTransactions.reduce((sum, t) => sum + t.amount, 0)} ETB
          </div>
        </div>
      </Card>
    </div>
  );
};
