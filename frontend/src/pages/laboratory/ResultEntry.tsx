import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { labModuleSubnav } from '../../navigation/moduleSubnavItems';

interface TestParameter {
  id: string;
  name: string;
  unit: string;
  normalRange: string;
  value?: string;
  status?: 'normal' | 'abnormal' | 'critical';
}

interface LabTest {
  id: string;
  testName: string;
  parameters: TestParameter[];
}

interface LabOrder {
  id: string;
  orderNumber: string;
  patientName: string;
  cardNumber: string;
  doctor: string;
  tests: LabTest[];
  priority: 'routine' | 'urgent' | 'stat';
  orderedAt: string;
  sampleId: string;
}

interface ResultEntryProps {
  order: LabOrder;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export const ResultEntry = ({ order, onSubmit, onCancel }: ResultEntryProps) => {
  const [results, setResults] = useState<Record<string, string>>({});
  const [interpretation, setInterpretation] = useState<'normal' | 'abnormal' | 'critical'>('normal');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const interpretationOptionClass = (value: 'normal' | 'abnormal' | 'critical') => {
    if (interpretation !== value) {
      return 'border-slate-800 bg-slate-900/40 hover:border-slate-700';
    }
    if (value === 'normal') return 'border-emerald-500 bg-emerald-500/10';
    if (value === 'abnormal') return 'border-amber-500 bg-amber-500/10';
    return 'border-red-500 bg-red-500/10';
  };

  const updateResult = (parameterId: string, value: string) => {
    setResults(prev => ({ ...prev, [parameterId]: value }));
  };

  const getParameterStatus = (parameter: TestParameter, value: string): 'normal' | 'abnormal' | 'critical' => {
    if (!value) return 'normal';
    
    // Simple range checking (in real app, would be more sophisticated)
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'normal';
    
    // Mock logic - in real app would parse normalRange properly
    if (parameter.name.includes('WBC')) {
      if (numValue < 4 || numValue > 11) return numValue < 2 || numValue > 20 ? 'critical' : 'abnormal';
    }
    if (parameter.name.includes('Hemoglobin')) {
      if (numValue < 12 || numValue > 16) return numValue < 7 || numValue > 20 ? 'critical' : 'abnormal';
    }
    
    return 'normal';
  };

  const handleComplete = async () => {
    const allParameters = order.tests.flatMap((t) => t.parameters);
    const filled = allParameters.filter((p) => results[p.id] && results[p.id].trim());
    if (filled.length === 0) {
      toast.info('Enter at least one result before saving, or use Save as draft to leave this screen.');
      return;
    }

    setIsSubmitting(true);
    try {
      await Promise.all(
        filled.map(async (param) => {
          const value = results[param.id].trim();
          const status = getParameterStatus(param, value);
          await api.patch(`/lab/orders/items/${param.id}/result`, {
            result: value,
            isAbnormal: status !== 'normal',
            notes: comments || undefined,
          });
        })
      );
      setSuccess(true);
      const pending = allParameters.length - filled.length;
      toast.success(
        pending > 0
          ? `Saved ${filled.length} result(s). ${pending} line(s) still pending — you can add them later or release partial results to the doctor after verification.`
          : 'All entered results saved. Ready for verification.'
      );
    } catch (error) {
      console.error('Failed to save results', error);
      toast.error('Failed to save lab results.');
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
            <h2 className="text-2xl font-bold text-slate-50 mb-2">Results Saved!</h2>
            <p className="text-slate-400 mb-6">Lab results have been recorded and are ready for verification</p>
            
            <div className="space-y-3">
              <Button variant="primary" className="w-full" onClick={onSubmit}>
                Print Results
              </Button>
              <Button variant="secondary" className="w-full" onClick={onCancel}>
                Next Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Lab Result Entry</h1>
            <p className="text-slate-400 mt-1">Enter test results</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={order.priority === 'stat' ? 'danger' : order.priority === 'urgent' ? 'warning' : 'default'}>
              {order.priority.toUpperCase()}
            </Badge>
            <Badge variant="info">{order.orderNumber}</Badge>
          </div>
        </div>

        <ModuleSubnav items={labModuleSubnav} ariaLabel="Laboratory sections" />

        {/* Patient & Order Info */}
        <Card variant="elevated">
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-sky-500/20 to-violet-500/20 flex items-center justify-center text-lg font-bold text-slate-200">
                  {order.patientName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-slate-50 text-lg">{order.patientName}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                    <span>Card: {order.cardNumber}</span>
                    <span>Doctor: {order.doctor}</span>
                    <span>Sample: {order.sampleId}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Ordered</p>
                <p className="font-semibold text-slate-50">{new Date(order.orderedAt).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {order.tests.map((test) => (
          <Card key={test.id} variant="elevated">
            <CardHeader>
              <CardTitle>{test.testName}</CardTitle>
              <CardDescription>Enter test parameters and values</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Parameter</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Result</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Unit</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Normal Range</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {test.parameters.map((param) => {
                      const value = results[param.id] || '';
                      const status = getParameterStatus(param, value);
                      
                      return (
                        <tr key={param.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                          <td className="py-4 px-4 text-sm text-slate-200 font-medium">{param.name}</td>
                          <td className="py-4 px-4">
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => updateResult(param.id, e.target.value)}
                              className="w-32 px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-50 text-center font-mono focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-400">{param.unit}</td>
                          <td className="py-4 px-4 text-sm text-slate-400 font-mono">{param.normalRange}</td>
                          <td className="py-4 px-4">
                            {value && (
                              <Badge
                                variant={
                                  status === 'critical' ? 'danger' :
                                  status === 'abnormal' ? 'warning' :
                                  'success'
                                }
                                size="sm"
                              >
                                {status === 'critical' ? '⚠ Critical' :
                                 status === 'abnormal' ? '⚡ Abnormal' :
                                 '✓ Normal'}
                              </Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Interpretation */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Interpretation</CardTitle>
            <CardDescription>Overall assessment of results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Overall Status
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'normal', label: 'Normal', icon: '✓', color: 'emerald' },
                  { value: 'abnormal', label: 'Abnormal', icon: '⚡', color: 'amber' },
                  { value: 'critical', label: 'Critical', icon: '⚠', color: 'red' },
                ].map((option) => (
                  <label key={option.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="interpretation"
                      value={option.value}
                      checked={interpretation === option.value}
                      onChange={(e) => setInterpretation(e.target.value as any)}
                      className="peer sr-only"
                    />
                    <div className={`p-4 rounded-xl border-2 transition-all text-center ${interpretationOptionClass(option.value as 'normal' | 'abnormal' | 'critical')}`}>
                      <span className="text-2xl mb-2 block">{option.icon}</span>
                      <p className="font-semibold text-slate-50">{option.label}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Comments & Observations
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none resize-none"
                rows={4}
                placeholder="Additional comments, observations, or recommendations..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Technician Info */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Technician Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-900/60 border border-slate-700 rounded-xl">
                <p className="text-sm text-slate-400">Performed By</p>
                <p className="font-semibold text-slate-50">Lab Tech. Yohannes Bekele</p>
              </div>
              <div className="p-3 bg-slate-900/60 border border-slate-700 rounded-xl">
                <p className="text-sm text-slate-400">Date & Time</p>
                <p className="font-semibold text-slate-50">{new Date().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            variant="primary"
            className="flex-1"
            onClick={handleComplete}
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Saving…' : 'Save entered results'}
          </Button>
        </div>
      </div>
    </div>
  );
};
