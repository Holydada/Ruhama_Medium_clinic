import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { X, Plus, Trash2, TestTube } from 'lucide-react';

interface LabTest {
  testName: string;
  testCode: string;
  instructions: string;
}

interface LabOrderModalProps {
  visitId: string;
  patientName: string;
  onClose: () => void;
  onSuccess: () => void;
}

// Common lab tests
const COMMON_TESTS = [
  { name: 'Complete Blood Count', code: 'CBC' },
  { name: 'Lipid Profile', code: 'LIPID' },
  { name: 'Liver Function Test', code: 'LFT' },
  { name: 'Renal Function Test', code: 'RFT' },
  { name: 'Blood Glucose (Fasting)', code: 'FBS' },
  { name: 'Blood Glucose (Random)', code: 'RBS' },
  { name: 'HbA1c', code: 'HBA1C' },
  { name: 'Thyroid Function Test', code: 'TFT' },
  { name: 'Urinalysis', code: 'UA' },
  { name: 'Stool Examination', code: 'STOOL' },
  { name: 'Blood Group & Rh', code: 'BG' },
  { name: 'ESR', code: 'ESR' },
  { name: 'Malaria Test', code: 'MALARIA' },
  { name: 'Pregnancy Test', code: 'PREG' },
  { name: 'HIV Test', code: 'HIV' },
  { name: 'Hepatitis B', code: 'HEPB' },
  { name: 'Hepatitis C', code: 'HEPC' },
];

export const LabOrderModal = ({ visitId, patientName, onClose, onSuccess }: LabOrderModalProps) => {
  const [tests, setTests] = useState<LabTest[]>([
    { testName: '', testCode: '', instructions: '' }
  ]);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [urgency, setUrgency] = useState<'ROUTINE' | 'URGENT' | 'STAT'>('ROUTINE');
  const [loading, setLoading] = useState(false);
  const [availableTests, setAvailableTests] = useState<Array<{ id: string; testCode: string; testName: string }>>([]);
  const [patientId, setPatientId] = useState<string>('');

  // Load available tests and visit details
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load available tests
        const testsResp = await api.get('/lab/tests');
        setAvailableTests(testsResp.data.data || []);
        
        // Load visit to get patient ID
        const visitResp = await api.get(`/visits/${visitId}`);
        setPatientId(visitResp.data.data?.patientId || visitResp.data.data?.patient?.id || '');
      } catch (error) {
        console.error('[LabOrderModal] Failed to load data:', error);
      }
    };
    loadData();
  }, [visitId]);

  const addTest = () => {
    setTests([...tests, { testName: '', testCode: '', instructions: '' }]);
  };

  const removeTest = (index: number) => {
    if (tests.length > 1) {
      setTests(tests.filter((_, i) => i !== index));
    }
  };

  const updateTest = (index: number, field: keyof LabTest, value: string) => {
    const updated = [...tests];
    updated[index][field] = value;
    setTests(updated);
  };

  const selectCommonTest = (index: number, testName: string, testCode: string) => {
    const updated = [...tests];
    updated[index].testName = testName;
    updated[index].testCode = testCode;
    setTests(updated);
  };

  const handleSubmit = async () => {
    // Validate
    const validTests = tests.filter(t => t.testName.trim() && t.testCode.trim());
    
    if (validTests.length === 0) {
      toast.error('Please add at least one test with name and code');
      return;
    }

    if (!patientId) {
      toast.error('Patient ID not found');
      return;
    }

    // Map test codes to IDs, or create new tests
    const testIds: string[] = [];
    for (const test of validTests) {
      let existingTest = availableTests.find(t => t.testCode === test.testCode);
      if (existingTest) {
        testIds.push(existingTest.id);
      } else {
        // If test doesn't exist, we'll need to create it
        // For now, just use the test code as ID (backend will handle creation)
        testIds.push(test.testCode);
      }
    }

    setLoading(true);
    try {
      await api.post('/doctor/lab-order', {
        visitId,
        tests: validTests,
        clinicalNotes: clinicalNotes.trim() || null,
        urgency
      });
      
      toast.success('Lab order sent to laboratory');
      onSuccess();
    } catch (error: any) {
      console.error('[LabOrderModal] Submit failed:', error);
      toast.error(error.response?.data?.error || 'Failed to create lab order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5 text-purple-500" />
              Create Lab Order
            </CardTitle>
            <p className="text-sm text-slate-400 mt-1">Patient: {patientName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Urgency Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['ROUTINE', 'URGENT', 'STAT'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setUrgency(level)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    urgency === level
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="font-semibold">{level}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tests List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-200">Laboratory Tests</h3>
              <Button
                onClick={addTest}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Test
              </Button>
            </div>

            {tests.map((test, index) => (
              <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-300">Test #{index + 1}</span>
                  {tests.length > 1 && (
                    <button
                      onClick={() => removeTest(index)}
                      className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Quick Select Common Tests */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Quick Select (Common Tests)
                  </label>
                  <select
                    onChange={(e) => {
                      const selected = COMMON_TESTS.find(t => t.code === e.target.value);
                      if (selected) {
                        selectCommonTest(index, selected.name, selected.code);
                      }
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-50 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">-- Select a common test --</option>
                    {COMMON_TESTS.map((t) => (
                      <option key={t.code} value={t.code}>
                        {t.name} ({t.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Test Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Test Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={test.testName}
                      onChange={(e) => updateTest(index, 'testName', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-50 focus:border-purple-500 focus:outline-none"
                      placeholder="e.g., Complete Blood Count"
                      required
                    />
                  </div>

                  {/* Test Code */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Test Code <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={test.testCode}
                      onChange={(e) => updateTest(index, 'testCode', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-50 focus:border-purple-500 focus:outline-none"
                      placeholder="e.g., CBC"
                      required
                    />
                  </div>

                  {/* Instructions */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Special Instructions
                    </label>
                    <input
                      type="text"
                      value={test.instructions}
                      onChange={(e) => updateTest(index, 'instructions', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-50 focus:border-purple-500 focus:outline-none"
                      placeholder="e.g., Fasting required, 12-hour fast"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Clinical Notes / Indication
            </label>
            <textarea
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900 text-slate-50 focus:border-purple-500 focus:outline-none resize-none"
              rows={3}
              placeholder="Clinical indication for tests (e.g., Suspected infection, Follow-up diabetes)"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="primary"
              className="flex-1 bg-purple-500 hover:bg-purple-600"
              isLoading={loading}
            >
              <TestTube className="w-4 h-4 mr-2" />
              Send to Laboratory
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
