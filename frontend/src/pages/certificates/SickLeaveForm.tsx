import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import {
  ArrowLeft,
  Save,
  FileText,
  AlertTriangle,
  Search,
  Calendar,
  User,
} from 'lucide-react';

interface Patient {
  id: string;
  cardNumber: string;
  fullName: string;
  age?: number;
  sex: 'MALE' | 'FEMALE';
  phone?: string;
}

interface SickLeaveData {
  patientId: string;
  diagnosis: string;
  numberOfDays: number;
  startDate: string;
  additionalNotes?: string;
}

export const SickLeaveForm = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<SickLeaveData>({
    patientId: '',
    diagnosis: '',
    numberOfDays: 1,
    startDate: new Date().toISOString().split('T')[0],
    additionalNotes: '',
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setSearching(true);
    try {
      const response = await api.get(`/patients/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data.data);
      if (response.data.data.length === 0) {
        toast.info('No patients found');
      }
    } catch (error) {
      console.error('Search failed', error);
      toast.error('Failed to search patients');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData(prev => ({ ...prev, patientId: patient.id }));
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleInputChange = (field: keyof SickLeaveData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const calculateEndDate = (): string => {
    const start = new Date(formData.startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + formData.numberOfDays - 1);
    return end.toLocaleDateString();
  };

  const validateForm = (): boolean => {
    if (!selectedPatient) {
      setError('Please select a patient');
      return false;
    }
    if (!formData.diagnosis.trim()) {
      setError('Diagnosis is required');
      return false;
    }
    if (formData.numberOfDays < 1 || formData.numberOfDays > 365) {
      setError('Number of days must be between 1 and 365');
      return false;
    }
    if (!formData.startDate) {
      setError('Start date is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const response = await api.post('/certificates/sick-leave', formData);
      toast.success('Sick leave certificate generated successfully');
      
      // Open PDF in new tab
      const certificateId = response.data.data.id;
      window.open(`/api/v1/certificates/sick-leave/${certificateId}/pdf`, '_blank');
      
      // Reset form
      setSelectedPatient(null);
      setFormData({
        patientId: '',
        diagnosis: '',
        numberOfDays: 1,
        startDate: new Date().toISOString().split('T')[0],
        additionalNotes: '',
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to generate certificate';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/doctor-dashboard')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-50">Sick Leave Certificate</h1>
              <p className="text-slate-400 mt-1">Generate medical sick leave certificate</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert className="border-red-500 bg-red-950/20">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {/* Patient Search */}
        {!selectedPatient && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Patient
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Search by name or card number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSearch}
                  disabled={searching}
                  variant="primary"
                >
                  {searching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">Search Results:</p>
                  {searchResults.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => handleSelectPatient(patient)}
                      className="w-full p-3 rounded-lg border border-slate-700 hover:border-blue-500 hover:bg-slate-800/50 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-50">{patient.fullName}</p>
                          <p className="text-sm text-slate-400">
                            Card #{patient.cardNumber} • {patient.sex} • {patient.age || 'Age unknown'}
                          </p>
                        </div>
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Selected Patient */}
        {selectedPatient && (
          <Card className="border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Selected Patient
                </div>
                <Button
                  onClick={() => {
                    setSelectedPatient(null);
                    setFormData(prev => ({ ...prev, patientId: '' }));
                  }}
                  variant="outline"
                  size="sm"
                >
                  Change Patient
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-50 text-lg">{selectedPatient.fullName}</p>
                  <p className="text-sm text-slate-400">
                    Card #{selectedPatient.cardNumber} • {selectedPatient.sex} • {selectedPatient.age || 'Age unknown'}
                  </p>
                  {selectedPatient.phone && (
                    <p className="text-sm text-slate-400">{selectedPatient.phone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Certificate Form */}
        {selectedPatient && (
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Certificate Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Diagnosis / Medical Condition *
                  </label>
                  <Textarea
                    value={formData.diagnosis}
                    onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                    placeholder="Enter the diagnosis or medical condition..."
                    rows={3}
                    className="w-full"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    This will appear on the certificate
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Start Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Number of Days *
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="365"
                      value={formData.numberOfDays}
                      onChange={(e) => handleInputChange('numberOfDays', parseInt(e.target.value))}
                      required
                    />
                  </div>
                </div>

                {/* End Date Display */}
                <div className="p-3 bg-blue-950/20 border border-blue-500 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <p className="text-sm text-blue-300">
                      <span className="font-medium">End Date:</span> {calculateEndDate()}
                    </p>
                  </div>
                  <p className="text-xs text-blue-400 mt-1">
                    Patient will be on sick leave for {formData.numberOfDays} {formData.numberOfDays === 1 ? 'day' : 'days'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <Textarea
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    placeholder="Any additional instructions or notes..."
                    rows={3}
                    className="w-full"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate('/doctor-dashboard')}
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
                        Generating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Generate Certificate
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        )}

        {/* Instructions */}
        <Card className="border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-slate-400 space-y-2">
              <li>• Search and select the patient who needs a sick leave certificate</li>
              <li>• Enter the medical diagnosis or condition</li>
              <li>• Specify the start date and number of days for sick leave</li>
              <li>• The certificate will be automatically generated as a PDF</li>
              <li>• The PDF will open in a new tab for printing or saving</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
