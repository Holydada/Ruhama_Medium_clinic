import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Alert, AlertDescription } from '../ui/Alert';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { Search, Plus, X, AlertTriangle } from 'lucide-react';

interface QuickLabOrderProps {
  patientId: string;
  visitId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface LabTest {
  id: string;
  testName: string;
  category: string;
  price: number;
}

export const QuickLabOrder = ({ patientId, visitId, onSuccess, onCancel }: QuickLabOrderProps) => {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priority, setPriority] = useState<'ROUTINE' | 'URGENT' | 'STAT'>('ROUTINE');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    setLoading(true);
    try {
      const response = await api.get('/lab/tests');
      setTests(response.data.data);
    } catch (error) {
      toast.error('Failed to load lab tests');
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = tests.filter(test =>
    test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTest = (testId: string) => {
    setSelectedTests(prev =>
      prev.includes(testId)
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const handleSubmit = async () => {
    if (selectedTests.length === 0) {
      toast.error('Please select at least one test');
      return;
    }

    if (!visitId) {
      toast.error('No active visit found');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/doctor/lab-orders', {
        visitId,
        patientId,
        testIds: selectedTests,
        priority,
        clinicalNotes,
      });

      toast.success(`Lab order created with ${selectedTests.length} test(s)`);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create lab order');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTestsData = tests.filter(t => selectedTests.includes(t.id));
  const totalPrice = selectedTestsData.reduce((sum, test) => sum + test.price, 0);

  // Common test panels
  const commonPanels = [
    { name: 'CBC + ESR', tests: ['Complete Blood Count', 'ESR'] },
    { name: 'Lipid Panel', tests: ['Total Cholesterol', 'Triglycerides', 'HDL', 'LDL'] },
    { name: 'Liver Function', tests: ['SGOT', 'SGPT', 'ALP', 'Total Bilirubin'] },
    { name: 'Kidney Function', tests: ['Creatinine', 'BUN', 'Uric Acid'] },
  ];

  const selectPanel = (panelTests: string[]) => {
    const testIds = tests
      .filter(t => panelTests.some(pt => t.testName.includes(pt)))
      .map(t => t.id);
    setSelectedTests(prev => [...new Set([...prev, ...testIds])]);
  };

  return (
    <div className="space-y-4">
      {/* Common Panels */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Common Test Panels
        </label>
        <div className="flex flex-wrap gap-2">
          {commonPanels.map(panel => (
            <Button
              key={panel.name}
              onClick={() => selectPanel(panel.tests)}
              variant="outline"
              size="sm"
            >
              <Plus className="w-3 h-3 mr-1" />
              {panel.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Search Tests
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by test name or category..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Selected Tests */}
      {selectedTests.length > 0 && (
        <div className="p-3 bg-blue-950/20 border border-blue-500/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-400">
              Selected Tests ({selectedTests.length})
            </span>
            <span className="text-sm font-medium text-blue-400">
              Total: {totalPrice} ETB
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTestsData.map(test => (
              <Badge
                key={test.id}
                className="bg-blue-500/20 text-blue-300 flex items-center gap-1"
              >
                {test.testName}
                <button
                  onClick={() => toggleTest(test.id)}
                  className="hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Available Tests */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Available Tests
        </label>
        <div className="max-h-64 overflow-y-auto space-y-2 p-2 bg-slate-900/50 rounded-lg">
          {loading ? (
            <p className="text-center text-slate-400 py-4">Loading tests...</p>
          ) : filteredTests.length === 0 ? (
            <p className="text-center text-slate-400 py-4">No tests found</p>
          ) : (
            filteredTests.map(test => (
              <button
                key={test.id}
                onClick={() => toggleTest(test.id)}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  selectedTests.includes(test.id)
                    ? 'border-blue-500 bg-blue-950/20'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-200">{test.testName}</p>
                    <p className="text-xs text-slate-400">{test.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-300">{test.price} ETB</p>
                    {selectedTests.includes(test.id) && (
                      <Badge size="sm" variant="success">Selected</Badge>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Priority
        </label>
        <Select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
        >
          <option value="ROUTINE">Routine</option>
          <option value="URGENT">Urgent</option>
          <option value="STAT">STAT (Immediate)</option>
        </Select>
      </div>

      {/* Clinical Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Clinical Notes (Optional)
        </label>
        <Textarea
          value={clinicalNotes}
          onChange={(e) => setClinicalNotes(e.target.value)}
          placeholder="Enter clinical indication or notes..."
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-slate-700">
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1"
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="primary"
          className="flex-1"
          disabled={submitting || selectedTests.length === 0}
        >
          {submitting ? 'Creating Order...' : `Create Order (${selectedTests.length} tests)`}
        </Button>
      </div>
    </div>
  );
};
