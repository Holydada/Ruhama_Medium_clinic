import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { labModuleSubnav } from '../../navigation/moduleSubnavItems';

interface QCResult {
  id: string;
  testName: string;
  level: 'Level 1' | 'Level 2' | 'Level 3';
  expectedValue: string;
  observedValue: string;
  status: 'pass' | 'fail';
  date: string;
  performedBy: string;
}

export const QualityControl: React.FC = () => {
  const [qcResults, setQcResults] = useState<QCResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadQcResults = async () => {
    setIsLoading(true);
    try {
      const [completedResp, verifiedResp] = await Promise.all([
        api.get('/lab/orders', { params: { status: 'COMPLETED', limit: 100 } }),
        api.get('/lab/orders', { params: { status: 'VERIFIED', limit: 100 } }),
      ]);

      const completedRows = completedResp.data?.data?.orders || [];
      const verifiedRows = verifiedResp.data?.data?.orders || [];

      const mappedCompleted: QCResult[] = completedRows.map((order: any) => ({
        id: order.id,
        testName: (order.items || []).map((item: any) => item.testName).filter(Boolean).join(', ') || 'Lab Panel',
        level: 'Level 2',
        expectedValue: 'Supervisor verification required',
        observedValue: 'Pending verification',
        status: 'fail',
        date: (order.completedAt || order.orderedAt || new Date().toISOString()).slice(0, 10),
        performedBy: order.orderedBy?.fullName || 'Lab Tech',
      }));

      const mappedVerified: QCResult[] = verifiedRows.map((order: any) => ({
        id: order.id,
        testName: (order.items || []).map((item: any) => item.testName).filter(Boolean).join(', ') || 'Lab Panel',
        level: 'Level 1',
        expectedValue: 'Supervisor verification required',
        observedValue: 'Verified and released',
        status: 'pass',
        date: (order.verifiedAt || order.completedAt || order.orderedAt || new Date().toISOString()).slice(0, 10),
        performedBy: order.verifiedBy?.fullName || order.orderedBy?.fullName || 'Lab Supervisor',
      }));

      setQcResults([...mappedVerified, ...mappedCompleted]);
    } catch (_error) {
      toast.error('Failed to load quality control records.');
      setQcResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadQcResults();
  }, []);

  const summary = useMemo(() => {
    const pass = qcResults.filter((item) => item.status === 'pass').length;
    const fail = qcResults.filter((item) => item.status === 'fail').length;
    return { pass, fail };
  }, [qcResults]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quality Control</h1>
        <Button variant="outline" onClick={() => void loadQcResults()} isLoading={isLoading}>
          Refresh
        </Button>
      </div>

      <ModuleSubnav items={labModuleSubnav} ariaLabel="Laboratory sections" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Pass (Verified Results)</p>
          <p className="text-2xl font-bold text-emerald-600">{summary.pass}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Needs Review</p>
          <p className="text-2xl font-bold text-amber-600">{summary.fail}</p>
        </Card>
      </div>

      <div className="space-y-4">
        {qcResults.map(qc => (
          <Card key={qc.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-gray-900">{qc.testName}</h3>
                  <Badge variant="default">{qc.level}</Badge>
                  <Badge variant={qc.status === 'pass' ? 'success' : 'danger'}>
                    {qc.status === 'pass' ? (
                      <><CheckCircle className="w-3 h-3 mr-1 inline" />PASS</>
                    ) : (
                      <><AlertCircle className="w-3 h-3 mr-1 inline" />FAIL</>
                    )}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Expected:</span>
                    <span className="ml-2 font-medium">{qc.expectedValue}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Observed:</span>
                    <span className="ml-2 font-medium">{qc.observedValue}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-2">{qc.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">By:</span>
                    <span className="ml-2">{qc.performedBy}</span>
                  </div>
                </div>
              </div>
              <Badge variant={qc.status === 'pass' ? 'success' : 'warning'}>
                {qc.status === 'pass' ? 'Ready' : 'Follow-up'}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {qcResults.length === 0 && !isLoading && (
        <Card className="p-8 mt-4">
          <p className="text-sm text-gray-600 text-center">No quality-control records available.</p>
        </Card>
      )}
    </div>
  );
};
