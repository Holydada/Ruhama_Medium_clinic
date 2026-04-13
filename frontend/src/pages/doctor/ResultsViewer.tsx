import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Download, Printer, Search, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

interface LabResult {
  id: string;
  testName: string;
  category: string;
  result: string;
  unit: string;
  normalRange: string;
  status: 'normal' | 'abnormal' | 'critical';
  date: string;
  technician: string;
  verifiedBy: string;
}

interface PatientResult {
  id: string;
  patientName: string;
  cardNumber: string;
  age: number;
  gender: string;
  orderDate: string;
  resultDate: string;
  orderedBy: string;
  results: LabResult[];
}

export const ResultsViewer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeOrderId, setActiveOrderId] = useState('');
  const [patientResults, setPatientResults] = useState<PatientResult | null>(null);

  const categories = ['all', 'Hematology', 'Chemistry', 'Microbiology', 'Serology', 'Urinalysis', 'Other'];

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const resp = await api.get('/lab/orders', { params: { limit: 100 } });
      const rows = resp.data?.data?.orders || [];
      const doneRows = rows.filter((r: any) => r.status === 'VERIFIED' || r.status === 'COMPLETED');
      setOrders(doneRows);
      if (!activeOrderId && doneRows.length > 0) {
        setActiveOrderId(doneRows[0].id);
      }
    } catch (error) {
      console.error('Failed to load lab orders', error);
      toast.error('Failed to load lab results.');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrderDetails = async (orderId: string) => {
    if (!orderId) {
      setPatientResults(null);
      return;
    }
    try {
      const resp = await api.get(`/lab/orders/${orderId}`);
      const order = resp.data?.data;
      if (!order) {
        setPatientResults(null);
        return;
      }

      const mappedResults: LabResult[] = (order.items || []).map((item: any) => {
        const raw = String(item.result || '').trim();
        const numeric = Number(raw);
        const isNumeric = raw !== '' && !Number.isNaN(numeric);
        let status: LabResult['status'] = 'normal';
        if (item.isAbnormal) status = 'abnormal';
        if (isNumeric && (numeric < 2 || numeric > 180)) status = 'critical';

        return {
          id: item.id,
          testName: item.testName || item.test?.testName || 'Test',
          category: item.test?.testCategory || 'Other',
          result: raw || '-',
          unit: item.test?.unit || '-',
          normalRange: item.test?.normalRange || '-',
          status,
          date: new Date(order.completedAt || order.verifiedAt || order.orderedAt).toISOString().slice(0, 10),
          technician: 'Lab Tech',
          verifiedBy: order.verifiedBy?.fullName || 'Pending Verification',
        };
      });

      setPatientResults({
        id: order.id,
        patientName: order.patient?.fullName || 'Unknown',
        cardNumber: order.patient?.cardNumber || '-',
        age: 0,
        gender: order.patient?.sex || '-',
        orderDate: new Date(order.orderedAt).toISOString().slice(0, 10),
        resultDate: new Date(order.verifiedAt || order.completedAt || order.orderedAt).toISOString().slice(0, 10),
        orderedBy: order.orderedBy?.fullName || 'Doctor',
        results: mappedResults,
      });
    } catch (error) {
      console.error('Failed to load lab order details', error);
      toast.error('Failed to load selected lab result details.');
      setPatientResults(null);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  useEffect(() => {
    void loadOrderDetails(activeOrderId);
  }, [activeOrderId]);

  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'default' => {
    switch (status) {
      case 'normal':
        return 'success';
      case 'abnormal':
        return 'warning';
      case 'critical':
        return 'danger';
      default:
        return 'default';
    }
  };

  const filteredResults = useMemo(
    () =>
      (patientResults?.results || []).filter((result) => {
        const matchesSearch = result.testName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || result.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [patientResults, searchTerm, selectedCategory]
  );

  const abnormalCount = (patientResults?.results || []).filter((r) => r.status === 'abnormal').length;
  const criticalCount = (patientResults?.results || []).filter((r) => r.status === 'critical').length;

  const handlePrint = () => window.print();
  const handleDownloadPDF = () => toast.info('PDF export will be enabled in document service phase.');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laboratory Results</h1>
          <p className="text-gray-600 mt-1">View and analyze patient test results</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline" onClick={() => void loadOrders()} isLoading={isLoading}>
            Refresh
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button variant="primary" className="flex items-center gap-2" onClick={handleDownloadPDF}>
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card className="p-4 mb-6">
        <Select label="Select Lab Order" value={activeOrderId} onChange={(e) => setActiveOrderId(e.target.value)}>
          <option value="">Select verified/completed order...</option>
          {orders.map((o: any) => (
            <option key={o.id} value={o.id}>
              {o.orderNumber} - {o.patient?.fullName || 'Unknown'} - {o.status}
            </option>
          ))}
        </Select>
      </Card>

      {!patientResults && (
        <Card className="p-10 text-center mb-6">
          <p className="text-gray-500">No completed/verified lab result selected yet.</p>
        </Card>
      )}

      {patientResults && (
        <>
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{patientResults.patientName}</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div><span className="text-gray-600">Card Number:</span><span className="ml-2 font-medium">{patientResults.cardNumber}</span></div>
                  <div><span className="text-gray-600">Age/Gender:</span><span className="ml-2 font-medium">{patientResults.age}y, {patientResults.gender}</span></div>
                  <div><span className="text-gray-600">Order Date:</span><span className="ml-2 font-medium">{patientResults.orderDate}</span></div>
                  <div><span className="text-gray-600">Result Date:</span><span className="ml-2 font-medium">{patientResults.resultDate}</span></div>
                  <div><span className="text-gray-600">Ordered By:</span><span className="ml-2 font-medium">{patientResults.orderedBy}</span></div>
                </div>
              </div>
              {(abnormalCount > 0 || criticalCount > 0) && (
                <div className="flex gap-2">
                  {criticalCount > 0 && (
                    <Badge variant="danger" className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {criticalCount} Critical
                    </Badge>
                  )}
                  {abnormalCount > 0 && <Badge variant="warning">{abnormalCount} Abnormal</Badge>}
                </div>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4"><p className="text-sm text-gray-600">Total Tests</p><p className="text-2xl font-bold text-gray-900">{patientResults.results.length}</p></Card>
            <Card className="p-4"><p className="text-sm text-gray-600">Normal</p><p className="text-2xl font-bold text-green-600">{patientResults.results.filter((r) => r.status === 'normal').length}</p></Card>
            <Card className="p-4"><p className="text-sm text-gray-600">Abnormal</p><p className="text-2xl font-bold text-yellow-600">{abnormalCount}</p></Card>
            <Card className="p-4"><p className="text-sm text-gray-600">Critical</p><p className="text-2xl font-bold text-red-600">{criticalCount}</p></Card>
          </div>

          <Card className="p-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input icon={Search} placeholder="Search tests..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <Button key={cat} variant={selectedCategory === cat ? 'primary' : 'outline'} size="sm" onClick={() => setSelectedCategory(cat)}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Normal Range</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResults.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="font-medium text-gray-900">{result.testName}</div><div className="text-xs text-gray-500">By {result.technician}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`text-lg font-bold ${result.status === 'critical' ? 'text-red-600' : result.status === 'abnormal' ? 'text-yellow-600' : 'text-gray-900'}`}>{result.result}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{result.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{result.normalRange}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><Badge variant={getStatusVariant(result.status)}>{result.status.toUpperCase()}</Badge></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{result.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
