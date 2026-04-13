import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import {
  AlertTriangle,
  Activity,
  Heart,
  Thermometer,
  ArrowLeft,
  Save,
  Brain,
  Eye,
  MessageSquare,
  Hand,
} from 'lucide-react';
import {
  calculateBMI,
  isVitalAbnormal,
  parseBP,
  getTriageLevelColor,
  getTriageLevelText,
  validateVitalSigns,
  calculateAge,
} from '../../lib/nurseUtils';

interface EmergencyCase {
  id: string;
  caseNumber: string;
  patient: {
    id: string;
    fullName: string;
    age?: number;
    sex: 'MALE' | 'FEMALE';
    phone?: string;
    photoUrl?: string;
  };
  chiefComplaint: string;
  arrivalMode: string;
  arrivalTime: string;
}

interface TriageFormData {
  triageLevel: 'CRITICAL' | 'URGENT' | 'SEMI_URGENT' | 'NON_URGENT' | '';
  chiefComplaint: string;
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  painScore?: number;
  glasgowComaScale: {
    eye: number;
    verbal: number;
    motor: number;
  };
  mechanismOfInjury?: string;
  allergies?: string;
  currentMedications?: string;
  triageNotes: string;
}

export const EmergencyTriage = () => {
  const navigate = useNavigate();
  const { caseId } = useParams<{ caseId: string }>();
  const [emergencyCase, setEmergencyCase] = useState<EmergencyCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState<TriageFormData>({
    triageLevel: '',
    chiefComplaint: '',
    glasgowComaScale: {
      eye: 4,
      verbal: 5,
      motor: 6,
    },
    triageNotes: '',
  });

  useEffect(() => {
    if (caseId) {
      loadEmergencyCase();
    }
  }, [caseId]);

  const loadEmergencyCase = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/emergency/cases/${caseId}`);
      const caseData = response.data.data;
      setEmergencyCase(caseData);
      
      // Pre-fill chief complaint if available
      if (caseData.chiefComplaint) {
        setFormData(prev => ({
          ...prev,
          chiefComplaint: caseData.chiefComplaint,
        }));
      }
    } catch (error) {
      console.error('Failed to load emergency case', error);
      toast.error('Failed to load emergency case');
      navigate('/emergency-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof TriageFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationErrors([]);
    setError(null);
  };

  const handleGCSChange = (field: keyof TriageFormData['glasgowComaScale'], value: number) => {
    setFormData(prev => ({
      ...prev,
      glasgowComaScale: {
        ...prev.glasgowComaScale,
        [field]: value,
      },
    }));
  };

  const calculateGCSTotal = (): number => {
    return formData.glasgowComaScale.eye + 
           formData.glasgowComaScale.verbal + 
           formData.glasgowComaScale.motor;
  };

  const getGCSInterpretation = (total: number): string => {
    if (total <= 8) return 'Severe (Coma)';
    if (total <= 12) return 'Moderate';
    return 'Mild';
  };

  const getGCSColor = (total: number): string => {
    if (total <= 8) return 'text-red-500 bg-red-500/20';
    if (total <= 12) return 'text-yellow-500 bg-yellow-500/20';
    return 'text-green-500 bg-green-500/20';
  };

  const calculateBMIValue = (): number => {
    if (formData.weight && formData.height) {
      return calculateBMI(formData.weight, formData.height);
    }
    return 0;
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.triageLevel) {
      errors.push('Triage level is required');
    }
    
    if (!formData.chiefComplaint.trim()) {
      errors.push('Chief complaint is required');
    }
    
    if (!formData.triageNotes.trim()) {
      errors.push('Triage notes are required');
    }
    
    // Validate vital signs
    const vitalErrors = validateVitalSigns(formData);
    errors.push(...vitalErrors);
    
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
      await api.post(`/emergency/triage`, {
        caseId,
        ...formData,
        gcsTotal: calculateGCSTotal(),
      });
      
      toast.success('Emergency triage completed successfully');
      
      if (formData.triageLevel === 'CRITICAL') {
        toast.success('🚨 Critical patient alert sent to all doctors', {
          duration: 5000,
        });
      }
      
      navigate('/emergency-dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to complete triage';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-400">Loading emergency case...</p>
        </div>
      </div>
    );
  }

  if (!emergencyCase) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-50 mb-2">Case Not Found</h3>
            <p className="text-slate-400 mb-4">Unable to load emergency case information.</p>
            <Button onClick={() => navigate('/emergency-dashboard')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const gcsTotal = calculateGCSTotal();
  const bmi = calculateBMIValue();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
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
              <h1 className="text-3xl font-bold text-slate-50">Emergency Triage</h1>
              <p className="text-slate-400 mt-1">Case #{emergencyCase.caseNumber}</p>
            </div>
          </div>
          <Badge variant="info" className="text-lg px-4 py-2">
            {emergencyCase.arrivalMode}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <ProfileAvatar
                    src={emergencyCase.patient.photoUrl}
                    name={emergencyCase.patient.fullName}
                    size="lg"
                  />
                  <div>
                    <h3 className="font-semibold text-slate-50">{emergencyCase.patient.fullName}</h3>
                    <p className="text-sm text-slate-400">
                      {emergencyCase.patient.sex} • {emergencyCase.patient.age || 'Age unknown'}
                    </p>
                  </div>
                </div>

                {emergencyCase.patient.phone && (
                  <div className="text-sm">
                    <span className="text-slate-400">Phone:</span>
                    <span className="ml-2 text-slate-300">{emergencyCase.patient.phone}</span>
                  </div>
                )}

                <div className="text-sm">
                  <span className="text-slate-400">Arrival Time:</span>
                  <span className="ml-2 text-slate-300">
                    {new Date(emergencyCase.arrivalTime).toLocaleString()}
                  </span>
                </div>

                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-xs font-semibold text-slate-300 mb-1">Initial Complaint</p>
                  <p className="text-sm text-slate-50">{emergencyCase.chiefComplaint}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Triage Form */}
          <div className="lg:col-span-2">
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

              {/* Glasgow Coma Scale */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Glasgow Coma Scale (GCS)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Eye className="w-4 h-4 inline mr-1" />
                        Eye Opening (1-4)
                      </label>
                      <Select
                        value={formData.glasgowComaScale.eye.toString()}
                        onValueChange={(value) => handleGCSChange('eye', parseInt(value))}
                      >
                        <option value="4">4 - Spontaneous</option>
                        <option value="3">3 - To speech</option>
                        <option value="2">2 - To pain</option>
                        <option value="1">1 - None</option>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <MessageSquare className="w-4 h-4 inline mr-1" />
                        Verbal Response (1-5)
                      </label>
                      <Select
                        value={formData.glasgowComaScale.verbal.toString()}
                        onValueChange={(value) => handleGCSChange('verbal', parseInt(value))}
                      >
                        <option value="5">5 - Oriented</option>
                        <option value="4">4 - Confused</option>
                        <option value="3">3 - Inappropriate words</option>
                        <option value="2">2 - Incomprehensible</option>
                        <option value="1">1 - None</option>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Hand className="w-4 h-4 inline mr-1" />
                        Motor Response (1-6)
                      </label>
                      <Select
                        value={formData.glasgowComaScale.motor.toString()}
                        onValueChange={(value) => handleGCSChange('motor', parseInt(value))}
                      >
                        <option value="6">6 - Obeys commands</option>
                        <option value="5">5 - Localizes pain</option>
                        <option value="4">4 - Withdraws from pain</option>
                        <option value="3">3 - Flexion to pain</option>
                        <option value="2">2 - Extension to pain</option>
                        <option value="1">1 - None</option>
                      </Select>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border-2 ${getGCSColor(gcsTotal)}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Total GCS Score</p>
                        <p className="text-xs opacity-75">{getGCSInterpretation(gcsTotal)}</p>
                      </div>
                      <p className="text-4xl font-bold">{gcsTotal}/15</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vital Signs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Vital Signs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Heart className="w-4 h-4 inline mr-1" />
                        Blood Pressure
                      </label>
                      <Input
                        type="text"
                        value={formData.bloodPressure || ''}
                        onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                        placeholder="120/80"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Heart Rate (bpm)
                      </label>
                      <Input
                        type="number"
                        value={formData.heartRate || ''}
                        onChange={(e) => handleInputChange('heartRate', e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="72"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Respiratory Rate (/min)
                      </label>
                      <Input
                        type="number"
                        value={formData.respiratoryRate || ''}
                        onChange={(e) => handleInputChange('respiratoryRate', e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="16"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Thermometer className="w-4 h-4 inline mr-1" />
                        Temperature (°C)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.temperature || ''}
                        onChange={(e) => handleInputChange('temperature', e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="36.5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        O2 Saturation (%)
                      </label>
                      <Input
                        type="number"
                        value={formData.oxygenSaturation || ''}
                        onChange={(e) => handleInputChange('oxygenSaturation', e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="98"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Pain Score (0-10)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        value={formData.painScore || ''}
                        onChange={(e) => handleInputChange('painScore', e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Weight (kg)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.weight || ''}
                        onChange={(e) => handleInputChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="70.0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Height (cm)
                      </label>
                      <Input
                        type="number"
                        value={formData.height || ''}
                        onChange={(e) => handleInputChange('height', e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="170"
                      />
                    </div>

                    {bmi > 0 && (
                      <div className="flex items-center">
                        <div className="p-3 bg-slate-800/50 rounded-lg">
                          <p className="text-xs text-slate-400">BMI</p>
                          <p className="text-lg font-bold text-slate-50">{bmi.toFixed(1)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Triage Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle>Triage Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    {formData.triageLevel && (
                      <Badge className={`mt-2 ${getTriageLevelColor(formData.triageLevel)}`}>
                        {getTriageLevelText(formData.triageLevel)}
                      </Badge>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Chief Complaint *
                    </label>
                    <textarea
                      value={formData.chiefComplaint}
                      onChange={(e) => handleInputChange('chiefComplaint', e.target.value)}
                      placeholder="Primary reason for emergency visit..."
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Mechanism of Injury
                    </label>
                    <Input
                      type="text"
                      value={formData.mechanismOfInjury || ''}
                      onChange={(e) => handleInputChange('mechanismOfInjury', e.target.value)}
                      placeholder="e.g., Motor vehicle accident, fall from height..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Known Allergies
                    </label>
                    <Input
                      type="text"
                      value={formData.allergies || ''}
                      onChange={(e) => handleInputChange('allergies', e.target.value)}
                      placeholder="e.g., Penicillin, None known"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Current Medications
                    </label>
                    <Input
                      type="text"
                      value={formData.currentMedications || ''}
                      onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                      placeholder="List current medications..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Triage Notes *
                    </label>
                    <textarea
                      value={formData.triageNotes}
                      onChange={(e) => handleInputChange('triageNotes', e.target.value)}
                      placeholder="Initial assessment, observations, immediate concerns..."
                      rows={4}
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
                    <strong>⚠️ CRITICAL PATIENT ALERT:</strong> Submitting this triage will immediately notify all available doctors and emergency staff.
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
                      Completing Triage...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Complete Emergency Triage
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
