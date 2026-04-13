import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { labModuleSubnav } from '../../navigation/moduleSubnavItems';

interface PendingResult {
  id: string;
  patientName: string;
  testName: string;
  result: string;
  enteredBy: string;
  entryDate: string;
  status: 'pending' | 'verified' | 'rejected';
}

export const ResultVerification: React.FC = () => {
  const [results, setResults] = useState<PendingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const loadVerificationQueue = async () => {
    setIsLoading(true);
    try {
      const [completedResp, verifiedResp] = await Promise.all([
        api.get('/lab/orders', { params: { status: 'COMPLETED', limit: 100 } }),
        api.get('/lab/orders', { params: { status: 'VERIFIED', limit: 50 } }),
      ]);

      const mapRows = (rows: any[], state: 'pending' | 'verified'): PendingResult[] =>
        rows.map((order: any) => ({
          id: order.id,
          patientName: order.patient?.fullName || 'Unknown Patient',
          testName: (order.items || []).map((it: any) => it.testName).filter(Boolean).join(', ') || 'Lab Panel',
          result: (order.items || [])
            .map((it: any) => `${it.testName}: ${it.result || 'Pending result entry'}`)
            .join(' | '),
          enteredBy: order.orderedBy?.fullName || 'Lab Tech',
          entryDate: (order.completedAt || order.orderedAt || new Date().toISOString()).slice(0, 16).replace('T', ' '),
          status: state,
        }));

      const completedRows = completedResp.data?.data?.orders || [];
      const verifiedRows = verifiedResp.data?.data?.orders || [];
      setResults([...mapRows(completedRows, 'pending'), ...mapRows(verifiedRows, 'verified')]);
    } catch (error) {
      console.error('Failed to load result verification queue', error);
      toast.error('Failed to load result verification queue.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadVerificationQueue();
  }, []);

  const handleVerify = async (id: string) => {
    setActioningId(id);
    try {
      await api.post(`/lab/orders/${id}/verify`);
      toast.success('Result verified successfully.');
      await loadVerificationQueue();
    } catch (error) {
      console.error('Failed to verify result', error);
      toast.error('Failed to verify result.');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActioningId(id);
    try {
      await api.patch(`/lab/orders/${id}/status`, { status: 'IN_PROGRESS' });
      toast.info('Result sent back for rework.');
      await loadVerificationQueue();
    } catch (error) {
      console.error('Failed to reject result', error);
      toast.error('Failed to send result back.');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Result Verification</h1>
        <Button variant="outline" onClick={() => void loadVerificationQueue()} isLoading={isLoading}>
          Refresh
        </Button>
      </div>

      <ModuleSubnav items={labModuleSubnav} ariaLabel="Laboratory sections" />

      <div className="space-y-4">
        {results.length === 0 && !isLoading && (
          <Card className="p-6">
            <p className="text-sm text-gray-600">No completed lab results awaiting verification.</p>
          </Card>
        )}
        {results.map(result => (
          <Card key={result.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{result.patientName}</h3>
                <p className="text-sm text-gray-600">{result.testName}</p>
                <p className="mt-2 text-gray-900">{result.result}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Entered by {result.enteredBy} on {result.entryDate}
                </p>
              </div>
              <div className="flex gap-2">
                {result.status === 'pending' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => void handleVerify(result.id)}
                      isLoading={actioningId === result.id}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verify
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => void handleReject(result.id)}
                      isLoading={actioningId === result.id}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Send Back
                    </Button>
                  </>
                )}
                {result.status !== 'pending' && (
                  <Badge variant={result.status === 'verified' ? 'success' : 'danger'}>
                    {result.status}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
