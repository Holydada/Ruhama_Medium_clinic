import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../lib/utils';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { receptionModuleSubnav } from '../../navigation/moduleSubnavItems';

interface PaymentItem {
  id: string;
  description: string;
  amount: number;
  category: 'card_fee' | 'consultation' | 'ultrasound' | 'lab' | 'pharmacy' | 'other';
}

interface PaymentCollectionProps {
  patientName: string;
  cardNumber: string;
  patientId?: string;
  visitId?: string;
  items?: PaymentItem[];
}

const categoryToTransactionType = (category: PaymentItem['category']): string => {
  const map: Record<PaymentItem['category'], string> = {
    card_fee: 'CARD_FEE',
    consultation: 'CONSULTATION_FEE',
    ultrasound: 'ULTRASOUND_FEE',
    lab: 'LAB_FEE',
    pharmacy: 'PHARMACY_SALE',
    other: 'MISCELLANEOUS',
  };
  return map[category] || 'MISCELLANEOUS';
};

export const PaymentCollection = ({
  patientName,
  cardNumber,
  patientId,
  visitId,
  items = [],
}: PaymentCollectionProps) => {
  const navigate = useNavigate();
  const [paymentItems, setPaymentItems] = useState<PaymentItem[]>(items.length > 0 ? items : [
    { id: '1', description: 'Card Fee', amount: 30, category: 'card_fee' }
  ]);
  const [paymentMethod, setPaymentMethod] = useState<'cash'>('cash');
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ackCardFeeDuplicate, setAckCardFeeDuplicate] = useState(false);

  const totalAmount = paymentItems.reduce((sum, item) => sum + item.amount, 0);
  const change = paymentMethod === 'cash' ? Math.max(0, cashAmount - totalAmount) : 0;

  const cardFeeWithoutVisit = useMemo(
    () => paymentItems.some((i) => i.category === 'card_fee') && !visitId,
    [paymentItems, visitId]
  );

  const handleSubmit = async () => {
    if (cashAmount < totalAmount) {
      toast.error('Cash amount is insufficient.');
      return;
    }
    if (cardFeeWithoutVisit && !ackCardFeeDuplicate) {
      toast.error('Confirm card fee: check the box if this charge is intentional and not duplicated.');
      return;
    }

    setIsSubmitting(true);
    try {
      for (const item of paymentItems) {
        await api.post('/finance/transactions', {
          patientId: patientId || undefined,
          visitId: visitId || undefined,
          transactionType: categoryToTransactionType(item.category),
          amount: item.amount,
          paymentMethod: 'CASH',
          description: item.description,
        });
      }
      setSuccess(true);
      toast.success('Payment recorded successfully.');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Payment failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card variant="elevated" className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 mb-6">
              <svg className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-50 mb-2">Payment Successful!</h2>
            <p className="text-slate-400 mb-6">Payment has been recorded</p>
            
            <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-400 mb-2">Amount Paid</p>
              <p className="text-3xl font-bold text-emerald-400">{formatCurrency(totalAmount)}</p>
              {change > 0 && (
                <p className="text-sm text-slate-400 mt-2">Change: {formatCurrency(change)}</p>
              )}
            </div>

            <div className="space-y-3">
              <Button variant="primary" className="w-full" type="button" onClick={() => window.print()}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print receipt
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                type="button"
                onClick={() => navigate('/receptionist-dashboard')}
              >
                Back to reception
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Payment Collection</h1>
            <p className="text-slate-400 mt-1">Collect payment from patient</p>
          </div>
          <Badge variant="info">{cardNumber}</Badge>
        </div>

        <ModuleSubnav items={receptionModuleSubnav} ariaLabel="Reception workflow" />

        <Card variant="elevated">
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-slate-900/60 border border-slate-700 rounded-xl">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500/20 to-sky-500/20 flex items-center justify-center text-lg font-bold text-slate-200">
                {patientName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-semibold text-slate-50 text-lg">{patientName}</p>
                <p className="text-sm text-slate-400">Card: {cardNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {cardFeeWithoutVisit && (
          <Card variant="elevated" className="border-amber-500/40 bg-amber-500/5">
            <CardContent className="pt-6 space-y-3">
              <p className="text-sm text-amber-100 font-medium">Card fee without visit link</p>
              <p className="text-sm text-slate-300">
                New registrations usually create a card-fee charge automatically. Recording another{' '}
                <strong className="text-slate-100">CARD_FEE</strong> here can duplicate revenue. Prefer opening payment
                from the patient&apos;s visit when possible.
              </p>
              <label className="flex items-start gap-2 text-sm text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-slate-600"
                  checked={ackCardFeeDuplicate}
                  onChange={(e) => setAckCardFeeDuplicate(e.target.checked)}
                />
                <span>I confirm this card fee is intentional and not a duplicate charge.</span>
              </label>
            </CardContent>
          </Card>
        )}

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Payment Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-700 rounded-xl">
                  <div>
                    <p className="font-semibold text-slate-50">{item.description}</p>
                    <p className="text-xs text-slate-400 capitalize">{item.category.replace('_', ' ')}</p>
                  </div>
                  <p className="text-xl font-bold text-emerald-400">{formatCurrency(item.amount)}</p>
                </div>
              ))}
              
              <div className="flex items-center justify-between p-4 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl">
                <p className="font-bold text-slate-50 text-lg">Total Amount</p>
                <p className="text-3xl font-bold text-emerald-400">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {[
                { value: 'cash', label: 'Cash', icon: '💵' },
              ].map((method) => (
                <label key={method.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="peer sr-only"
                  />
                  <div className="p-4 rounded-xl border-2 border-slate-700 peer-checked:border-sky-500 peer-checked:bg-sky-500/10 text-center transition-all">
                    <span className="text-3xl mb-2 block">{method.icon}</span>
                    <p className="font-semibold text-slate-200">{method.label}</p>
                  </div>
                </label>
              ))}
            </div>

            {paymentMethod === 'cash' && (
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Cash Received</label>
                <input
                  type="number"
                  value={cashAmount || ''}
                  onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)}
                  className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 text-center text-2xl font-bold focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                  placeholder="0.00"
                />
                {change > 0 && (
                  <p className="mt-2 text-center text-lg font-semibold text-amber-400">
                    Change: {formatCurrency(change)}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            className="flex-1"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : `Collect ${formatCurrency(totalAmount)}`}
          </Button>
        </div>
      </div>
    </div>
  );
};
