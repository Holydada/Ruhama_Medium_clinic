import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Search, Plus } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { labModuleSubnav } from '../../navigation/moduleSubnavItems';

interface Test {
  id: string;
  code: string;
  name: string;
  category?: string;
  price: number;
  turnaroundTime?: number;
  sampleType?: string;
  isActive: boolean;
}

export const TestCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    testCode: '',
    testName: '',
    testCategory: '',
    sampleType: '',
    normalRange: '',
    unit: '',
    price: '',
    turnaroundTime: '',
    description: '',
  });

  const loadCatalog = async () => {
    setIsLoading(true);
    try {
      const resp = await api.get('/lab/tests');
      const rows = resp.data?.data || [];
      const mapped: Test[] = rows.map((row: any) => ({
        id: row.id,
        code: row.testCode,
        name: row.testName,
        category: row.testCategory,
        price: Number(row.price || 0),
        turnaroundTime: row.turnaroundTime ? Number(row.turnaroundTime) : undefined,
        sampleType: row.sampleType,
        isActive: row.isActive !== false,
      }));
      setTests(mapped);
    } catch (_error) {
      toast.error('Failed to load test catalog.');
      setTests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCatalog();
  }, []);

  const filteredTests = useMemo(
    () =>
      tests.filter(
        (test) =>
          test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          test.code.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [tests, searchTerm]
  );

  const createTest = async () => {
    if (!form.testCode || !form.testName) {
      toast.info('Test code and test name are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/lab/tests', {
        testCode: form.testCode.trim(),
        testName: form.testName.trim(),
        testCategory: form.testCategory || undefined,
        sampleType: form.sampleType || undefined,
        normalRange: form.normalRange || undefined,
        unit: form.unit || undefined,
        price: form.price ? Number(form.price) : undefined,
        turnaroundTime: form.turnaroundTime ? Number(form.turnaroundTime) : undefined,
        description: form.description || undefined,
      });

      toast.success('Lab test created successfully.');
      setForm({
        testCode: '',
        testName: '',
        testCategory: '',
        sampleType: '',
        normalRange: '',
        unit: '',
        price: '',
        turnaroundTime: '',
        description: '',
      });
      setShowCreate(false);
      await loadCatalog();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to create lab test.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Test Catalog</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => void loadCatalog()} isLoading={isLoading}>
            Refresh
          </Button>
          <Button variant="primary" onClick={() => setShowCreate((prev) => !prev)}>
            <Plus className="w-4 h-4 mr-2" />
            {showCreate ? 'Close Form' : 'Add Test'}
          </Button>
        </div>
      </div>

      <ModuleSubnav items={labModuleSubnav} ariaLabel="Laboratory sections" />

      {showCreate && (
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Test Code"
              required
              placeholder="e.g. CBC"
              value={form.testCode}
              onChange={(e) => setForm((prev) => ({ ...prev, testCode: e.target.value }))}
            />
            <Input
              label="Test Name"
              required
              placeholder="e.g. Complete Blood Count"
              value={form.testName}
              onChange={(e) => setForm((prev) => ({ ...prev, testName: e.target.value }))}
            />
            <Input
              label="Category"
              placeholder="e.g. Hematology"
              value={form.testCategory}
              onChange={(e) => setForm((prev) => ({ ...prev, testCategory: e.target.value }))}
            />
            <Input
              label="Sample Type"
              placeholder="e.g. Blood"
              value={form.sampleType}
              onChange={(e) => setForm((prev) => ({ ...prev, sampleType: e.target.value }))}
            />
            <Input
              label="Price (ETB)"
              type="number"
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
            />
            <Input
              label="Turnaround Time (minutes)"
              type="number"
              value={form.turnaroundTime}
              onChange={(e) => setForm((prev) => ({ ...prev, turnaroundTime: e.target.value }))}
            />
            <Input
              label="Normal Range"
              placeholder="e.g. 4.0 - 10.0"
              value={form.normalRange}
              onChange={(e) => setForm((prev) => ({ ...prev, normalRange: e.target.value }))}
            />
            <Input
              label="Unit"
              placeholder="e.g. g/dL"
              value={form.unit}
              onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
            />
          </div>
          <div className="mt-3">
            <Input
              label="Description"
              placeholder="Optional notes"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="mt-4">
            <Button variant="primary" onClick={() => void createTest()} isLoading={isSubmitting}>
              Save Test
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-4 mb-6">
        <Input
          icon={Search}
          placeholder="Search tests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTests.map(test => (
          <Card key={test.id} className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-900">{test.name}</h3>
                <p className="text-sm text-gray-600">Code: {test.code}</p>
              </div>
              <Badge variant={test.isActive ? 'success' : 'default'}>
                {test.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-600">Category:</span> {test.category || 'N/A'}</div>
              <div><span className="text-gray-600">Price:</span> {test.price} ETB</div>
              <div><span className="text-gray-600">TAT:</span> {test.turnaroundTime ? `${test.turnaroundTime} min` : 'N/A'}</div>
              <div><span className="text-gray-600">Sample:</span> {test.sampleType || 'N/A'}</div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTests.length === 0 && !isLoading && (
        <Card className="p-8 mt-4">
          <p className="text-sm text-gray-600 text-center">No lab tests found.</p>
        </Card>
      )}
    </div>
  );
};
