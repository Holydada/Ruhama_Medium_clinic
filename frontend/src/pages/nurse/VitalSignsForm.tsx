import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import {
  Activity,
  Heart,
  Thermometer,
  Weight,
  Ruler,
  ArrowLeft,
  Save,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import {
  calculateBMI,
  isVitalAbnormal,
  parseBP,
  validateVitalSigns,
  calculateAge,
} from '../../lib/nurseUtils';

interface Patient {
  id: string;
  fullName: string;
  cardNumber: string;
  sex: 'MALE' | 'FEMALE';
  dateOfBirth: string;
  photoUrl?: string;
}

interface Visit {
  id: string;
  visitNumber: number;
  visitType: string;
}

interface VitalSignsData {
  visitId: string;
  patientId: string;
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  painScore?: number;
  notes?: string;
}

interface PreviousVitals {
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  recordedAt: string;
}

export const VitalSignsForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const visitId = searchParams.get('visitId');
  const patientId = searchParams.get('patientId');

  const [patient, setPatient] = useState<Patient | null>(null);
  const [visit, setVisit] = useState<Visit | null>(null);
  const [previousVitals, setPreviousVitals] = useState<PreviousVitals | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState<VitalSignsData>({
    visitId: visitId || '',
    patientId: patientId || '',
  });

  useEffect(() => {
    if (patientId && visitId) {
      loadPatientData();
    }
  }, [patientId, visitId]);

  const loadPatientData = async () => {
    setLoading(true);
    try {
      const [patientResp, visitResp, vitalsResp] = await Promise.all([
        api.get(`/patients/${patientId}`),
        api.get(`/visits/${visitId}`),
        api.get(`/nurse/vital-signs/patient/${patientId}/latest`).catch(() => ({ data: { data: null } })),
      ]);
      
      setPatient(patientResp.data.data);
      setVisit(visitResp.data.data);
      setPreviousVitals(vitalsResp.data.data);
    } catch (error) {
      console.error('Failed to load patient data', error);
      toast.error('Failed to load patient information');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof VitalSignsData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationErrors([]);
    setError(null);
  };

  const calculateBMIValue = (): number => {
    if (formData.weight && formData.height) {
      return calculateBMI(formData.weight, formData.height);
    }
    return 0;
  };

  const getVitalTrend = (current?: number, previous?: number): 'up' | 'down' | 'same' | null => {
    if (!current || !previous) return null;
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'same';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'same' | null) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-red-400" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-blue-400" />;
    if (trend === 'same') return <Minus className="w-4 h-4 text-slate-400" />;
    return null;
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    // At least one vital sign must be recorded
    const hasAnyVital = formData.bloodPressure || 
                        formData.heartRate || 
                        formData.respiratoryRate || 
                        formData.temperature || 
                        formData.oxygenSaturation || 
                        formData.weight || 
                        formData.height;
    
    if (!hasAnyVital) {
      errors.push('At least one vital sign must be recorded');
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
    
    setSubmitting(true);
    setError(null);
    
    try {
      await api.post('/nurse/vital-signs', formData);
      
      toast.success('Vital signs recorded successfully');
      navigate('/nurse-dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to record vital signs';
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
          <p className="text-slate-400">Loading patient information...</p>
        </div>
      </div>
    );
  }

  if (!patient || !visit) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-50 mb-2">Patient Not Found</h3>
            <p className="text-slate-400 mb-4">Unable to load patient information.</p>
            <Button onClick={() => navigate('/nurse-dashboard')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bmi = calculateBMIValue();
  const age = calculateAge(patient.dateOfBirth);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/nurse-dashboard')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-50">Record Vital Signs</h1>
              <p className="text-slate-400 mt-1">Quick vital signs entry</p>
            </div>
          </div>
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
                    src={patient.photoUrl}
                    name={patient.fullName}
                    size="lg"
                  />
                  <div>
                    <h3 className="font-semibold text-slate-50">{patient.fullName}</h3>
                    <p className="text-sm text-slate-400">Card: {patient.cardNumber}</p>
                    <p className="text-sm text-slate-400">
                      {patient.sex} • {age} years old
                    </p>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-slate-400">Visit:</span>
                  <span className="ml-2 text-slate-300">
                    #{visit.visitNumber} ({visit.visitType})
                  </span>
                </div>

                {/* Previous Vitals */}
                {previousVitals && (
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <p className="text-xs font-semibold text-slate-300 mb-2">Previous Vitals</p>
                    <div className="space-y-1 text-xs text-slate-400">
                      {previousVitals.bloodPressure && (
                        <div>BP: {previousVitals.bloodPressure}</div>
                      )}
                      {previousVitals.heartRate && (
                        <div>HR: {previousVitals.heartRate} bpm</div>
                      )}
                      {previousVitals.temperature && (
                        <div>Temp: {previousVitals.temperature}°C</div>
                      )}
                      {previousVitals.oxygenSaturation && (
                        <div>SpO2: {previousVitals.oxygenSaturation}%</div>
                      )}
                      <div className="text-slate-500 mt-2">
                        {new Date(previousVitals.recordedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Vital Signs Form */}
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

              {/* Vital Signs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Vital Signs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Blood Pressure */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Heart className="w-4 h-4 inline mr-1" />
                        Blood Pressure
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={formData.bloodPressure || ''}
                          onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                          placeholder="120/80"
                          className={formData.bloodPressure && parseBP(formData.bloodPressure) && 
                            (isVitalAbnormal('systolicBP', parseBP(formData.bloodPressure)!.systolic) ||
                             isVitalAbnormal('diastolicBP', parseBP(formData.bloodPressure)!.diastolic))
                            ? 'border-red-500' : ''}
                        />
                        {previousVitals?.bloodPressure && (
                          <span className="text-xs text-slate-500 whitespace-nowrap">
                            was {previousVitals.bloodPressure}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Heart Rate */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Heart Rate (bpm)
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={formData.heartRate || ''}
                          onChange={(e) => handleInputChange('heartRate', e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="72"
                          className={formData.heartRate && isVitalAbnormal('heartRate', formData.heartRate) 
                            ? 'border-red-500' : ''}
                        />
                        {getTrendIcon(getVitalTrend(formData.heartRate, previousVitals?.heartRate))}
                      </div>
                    </div>

                    {/* Respiratory Rate */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Respiratory Rate (/min)
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={formData.respiratoryRate || ''}
                          onChange={(e) => handleInputChange('respiratoryRate', e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="16"
                          className={formData.respiratoryRate && isVitalAbnormal('respiratoryRate', formData.respiratoryRate) 
                            ? 'border-red-500' : ''}
                        />
                        {getTrendIcon(getVitalTrend(formData.respiratoryRate, previousVitals?.respiratoryRate))}
                      </div>
                    </div>

                    {/* Temperature */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Thermometer className="w-4 h-4 inline mr-1" />
                        Temperature (°C)
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          step="0.1"
                          value={formData.temperature || ''}
                          onChange={(e) => handleInputChange('temperature', e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="36.5"
                          className={formData.temperature && isVitalAbnormal('temperature', formData.temperature) 
                            ? 'border-red-500' : ''}
                        />
                        {getTrendIcon(getVitalTrend(formData.temperature, previousVitals?.temperature))}
                      </div>
                    </div>

                    {/* Oxygen Saturation */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Oxygen Saturation (%)
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={formData.oxygenSaturation || ''}
                          onChange={(e) => handleInputChange('oxygenSaturation', e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="98"
                          className={formData.oxygenSaturation && isVitalAbnormal('oxygenSaturation', formData.oxygenSaturation) 
                            ? 'border-red-500' : ''}
                        />
                        {getTrendIcon(getVitalTrend(formData.oxygenSaturation, previousVitals?.oxygenSaturation))}
                      </div>
                    </div>

                    {/* Pain Score */}
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

                    {/* Weight */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Weight className="w-4 h-4 inline mr-1" />
                        Weight (kg)
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          step="0.1"
                          value={formData.weight || ''}
                          onChange={(e) => handleInputChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="70.0"
                        />
                        {getTrendIcon(getVitalTrend(formData.weight, previousVitals?.weight))}
                      </div>
                    </div>

                    {/* Height */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Ruler className="w-4 h-4 inline mr-1" />
                        Height (cm)
                      </label>
                      <Input
                        type="number"
                        value={formData.height || ''}
                        onChange={(e) => handleInputChange('height', e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="170"
                      />
                    </div>
                  </div>

                  {/* BMI Display */}
                  {bmi > 0 && (
                    <div className="mt-4 p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-300">Body Mass Index (BMI)</p>
                          <p className="text-xs text-slate-400">
                            {bmi < 18.5 && 'Underweight'}
                            {bmi >= 18.5 && bmi < 25 && 'Normal weight'}
                            {bmi >= 25 && bmi < 30 && 'Overweight'}
                            {bmi >= 30 && 'Obese'}
                          </p>
                        </div>
                        <p className="text-3xl font-bold text-slate-50">{bmi.toFixed(1)}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any observations or notes about the vital signs..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                  />
                </CardContent>
              </Card>

              {/* Submit Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/nurse-dashboard')}
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
                      Recording...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Record Vital Signs
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
