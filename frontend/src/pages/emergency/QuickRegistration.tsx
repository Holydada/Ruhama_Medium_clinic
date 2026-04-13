import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import {
  AlertTriangle,
  UserPlus,
  ArrowLeft,
  Clock,
  Ambulance,
} from 'lucide-react';

interface QuickRegistrationData {
  fullName: string;
  age?: number;
  sex: 'MALE' | 'FEMALE' | '';
  phone?: string;
  emergencyContact?: string;
  arrivalMode: 'WALK_IN' | 'AMBULANCE' | 'POLICE' | 'REFERRAL' | '';
  chiefComplaint: string;
  triageLevel: 'CRITICAL' | 'URGENT' | 'SEMI_URGENT' | 'NON_URGENT' | '';
}

export const QuickRegistration = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState<QuickRegistrationData>({
    fullName: '',
    age: undefined,
    sex: '',
    phone: '',
    emergencyContact: '',
    arrivalMode: '',
    chiefComplaint: '',
    triageLevel: '',
  });

  const handleInputChange = (field: keyof QuickRegistrationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationErrors([]);
    setError(null);
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.fullName.trim()) {
      errors.push('Patient name is required');
    }
    
    if (!formData.sex) {
      errors.push('Sex is required');
    }
    
    if (!formData.arrivalMode) {
      errors.push('Arrival mode is required');
    }
    
    if (!formData.chiefComplaint.trim()) {
      errors.push('Chief complaint is required');
    }
    
    if (!formData.triageLevel) {
      errors.push('Triage level is required');
    }
    
    if (formData.age && (formData.age < 0 || formData.age > 150)) {
      errors.push('Age must be between 0 and 150');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Confirm critical triage
    if (formData.triageLevel === 'CRITICAL') {
      const confirmed = window.confirm(
        '⚠️ CRITICAL PATIENT - This will send immediate alerts to all available doctors. Continue?'
      );
      if (!confirmed) return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const response = await api.post('/emergency/quick-registration', {
        ...formData,
        age: formData.age || undefined,
        phone: formData.phone || undefined,
        emergencyContact: formData.emergencyContact || undefined,
      });
      
      const caseData = response.data.data;
      
      toast.success('Emergency case registered successfully');
      
      if (formData.triageLevel === 'CRITICAL') {
        toast.success('🚨 Critical patient alert sent to all doctors', 5000);
      }
      
      // Navigate to emergency dashboard or triage
      navigate(`/emergency-dashboard`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to register emergency case';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getTriageLevelColor = (level: string) => {
    const colors = {
      CRITICAL: 'border-red-500 bg-red-500/10 text-red-400',
      URGENT: 'border-orange-500 bg-orange-500/10 text-orange-400',
      SEMI_URGENT: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
      NON_URGENT: 'border-green-500 bg-green-500/10 text-green-400',
    };
    return colors[level as keyof typeof colors] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/emergency-dashboard')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
                <Ambulance className="w-8 h-8 text-red-500" />
                Quick Emergency Registration
              </h1>
              <p className="text-slate-400 mt-1">Fast intake for emergency patients</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-5 h-5" />
            <span className="text-sm">Target: &lt; 2 minutes</span>
          </div>
        </div>

        {/* Alert Banner */}
        <Alert className="border-red-500 bg-red-950/20">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <AlertDescription className="text-red-400">
            <strong>Emergency Mode:</strong> Minimal information required. Complete details can be added later.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert className="border-red-500 bg-red-950/20">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <AlertDescription>
                <div className="space-y-1">
                  {validationErrors.map((error, index) => (
                    <div key={index} className="text-red-400">{error}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert className="border-red-500 bg-red-950/20">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Patient's full name"
                    className="w-full"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Age (approximate if unknown)
                  </label>
                  <Input
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Age in years"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Sex *
                  </label>
                  <Select
                    value={formData.sex}
                    onValueChange={(value) => handleInputChange('sex', value)}
                  >
                    <option value="">Select sex</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Patient or family phone"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Emergency Contact
                  </label>
                  <Input
                    type="text"
                    value={formData.emergencyContact || ''}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    placeholder="Name and phone"
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Arrival & Triage */}
          <Card>
            <CardHeader>
              <CardTitle>Arrival & Initial Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Arrival Mode *
                  </label>
                  <Select
                    value={formData.arrivalMode}
                    onValueChange={(value) => handleInputChange('arrivalMode', value)}
                  >
                    <option value="">Select arrival mode</option>
                    <option value="WALK_IN">Walk-in</option>
                    <option value="AMBULANCE">Ambulance</option>
                    <option value="POLICE">Police</option>
                    <option value="REFERRAL">Referral</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Triage Level *
                  </label>
                  <Select
                    value={formData.triageLevel}
                    onValueChange={(value) => handleInputChange('triageLevel', value)}
                  >
                    <option value="">Select triage level</option>
                    <option value="CRITICAL">🔴 Critical (Level 1)</option>
                    <option value="URGENT">🟠 Urgent (Level 2)</option>
                    <option value="SEMI_URGENT">🟡 Semi-Urgent (Level 3)</option>
                    <option value="NON_URGENT">🟢 Non-Urgent (Level 4)</option>
                  </Select>
                </div>
              </div>

              {formData.triageLevel && (
                <div className={`p-4 rounded-xl border-2 ${getTriageLevelColor(formData.triageLevel)}`}>
                  <p className="font-semibold">
                    {formData.triageLevel === 'CRITICAL' && '🔴 CRITICAL - Immediate life-threatening'}
                    {formData.triageLevel === 'URGENT' && '🟠 URGENT - Potentially life-threatening'}
                    {formData.triageLevel === 'SEMI_URGENT' && '🟡 SEMI-URGENT - Serious but stable'}
                    {formData.triageLevel === 'NON_URGENT' && '🟢 NON-URGENT - Minor condition'}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Chief Complaint *
                </label>
                <textarea
                  value={formData.chiefComplaint}
                  onChange={(e) => handleInputChange('chiefComplaint', e.target.value)}
                  placeholder="Brief description of the emergency..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Critical Warning */}
          {formData.triageLevel === 'CRITICAL' && (
            <Alert className="border-red-500 bg-red-950/20">
              <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
              <AlertDescription className="text-red-400">
                <strong>⚠️ CRITICAL PATIENT ALERT:</strong> Submitting this form will immediately notify all available doctors and emergency staff.
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/emergency-dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register Emergency Case
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
