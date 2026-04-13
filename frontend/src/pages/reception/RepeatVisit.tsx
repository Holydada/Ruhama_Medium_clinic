import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../lib/utils';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { receptionModuleSubnav } from '../../navigation/moduleSubnavItems';

interface Patient {
  id: string;
  cardNumber: string;
  fullName: string;
  age: number;
  gender: string;
  phone: string;
  photo?: string;
  lastVisit: string;
  visitCount: number;
}

export const RepeatVisit = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'phone' | 'card'>('card');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [serviceType, setServiceType] = useState<'OPD' | 'ULTRASOUND'>('OPD');
  const [visitType, setVisitType] = useState<'REPEAT' | 'FOLLOW_UP'>('REPEAT');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Build search params based on search type
      const params: any = { limit: 20 };
      
      if (searchBy === 'card') {
        params.cardNumber = searchQuery.trim();
      } else if (searchBy === 'name') {
        params.fullName = searchQuery.trim();
      } else if (searchBy === 'phone') {
        params.phone = searchQuery.trim();
      }
      
      console.log('[RepeatVisit] Searching with params:', params);
      
      const resp = await api.get('/patients', { params });
      const patients = resp.data?.data?.patients || [];
      
      console.log('[RepeatVisit] Found patients:', patients.length);
      
      const mapped: Patient[] = patients.map((p: any) => {
        const lastVisit = p.visits?.[0]?.visitDate || p.registrationDate || new Date().toISOString();
        const age = Math.max(
          0,
          new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear()
        );
        return {
          id: p.id,
          cardNumber: p.cardNumber,
          fullName: p.fullName,
          age,
          gender: p.sex === 'MALE' ? 'Male' : 'Female',
          phone: p.phone || '-',
          lastVisit,
          visitCount: p.visits?.length || 0,
          photo: p.photoUrl || undefined,
        };
      });
      setSearchResults(mapped);
      if (mapped.length === 0) {
        toast.info('No matching patient found.');
      }
    } catch (error) {
      console.error('[RepeatVisit] Search failed:', error);
      setSearchResults([]);
      toast.error('Patient search failed.');
    } finally {
      setIsSearching(false);
    }
  };

  const calculateFee = (lastVisit: string): number => {
    const daysSinceLastVisit = Math.floor(
      (Date.now() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceLastVisit <= 30 ? 0 : 30;
  };

  const handleCheckIn = async (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const confirmCheckIn = async () => {
    if (!selectedPatient) return;

    try {
      let ultrasoundFee = 0;
      if (serviceType === 'ULTRASOUND') {
        ultrasoundFee = visitType === 'FOLLOW_UP' ? 400 : 200;
      }

      await api.post('/visits', {
        patientId: selectedPatient.id,
        visitType,
        serviceType,
        ultrasoundFee: ultrasoundFee > 0 ? ultrasoundFee : undefined,
      });
      toast.success(`${selectedPatient.fullName} checked in successfully.`);
      setSelectedPatient(null);
      setSearchResults([]);
      setSearchQuery('');
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Check-in failed';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Repeat Visit</h1>
            <p className="text-slate-400 mt-1">Check-in returning patients</p>
          </div>
          <Button variant="outline" onClick={() => window.history.back()}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Button>
        </div>

        <ModuleSubnav items={receptionModuleSubnav} ariaLabel="Reception workflow" />

        {/* Search Card */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Search Patient</CardTitle>
            <CardDescription>Find patient by card number, name, or phone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Type Selector */}
            <div className="flex gap-2">
              {[
                { id: 'card', label: 'Card Number', icon: '🎫' },
                { id: 'name', label: 'Name', icon: '👤' },
                { id: 'phone', label: 'Phone', icon: '📱' },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSearchBy(type.id as any)}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    searchBy === type.id
                      ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg'
                      : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <span className="mr-2">{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder={
                    searchBy === 'card'
                      ? 'Enter card number (e.g., RH20240001)'
                      : searchBy === 'name'
                      ? 'Enter patient name'
                      : 'Enter phone number'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  icon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
              </div>
              <Button variant="primary" onClick={handleSearch} isLoading={isSearching}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>Found {searchResults.length} patient(s)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {searchResults.map((patient) => {
                const fee = calculateFee(patient.lastVisit);
                const daysSinceLastVisit = Math.floor(
                  (Date.now() - new Date(patient.lastVisit).getTime()) / (1000 * 60 * 60 * 24)
                );

                return (
                  <div
                    key={patient.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 transition-all"
                  >
                    {/* Photo */}
                    <div className="h-16 w-16 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {patient.photo ? (
                        <img src={patient.photo} alt={patient.fullName} className="h-full w-full object-cover" />
                      ) : (
                        <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-slate-50">{patient.fullName}</h3>
                        <Badge variant="info" size="sm">
                          {patient.cardNumber}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>{patient.age} years • {patient.gender}</span>
                        <span>📱 {patient.phone}</span>
                        <span>🔄 {patient.visitCount} visits</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm text-slate-400">Last visit:</span>
                        <span className="text-sm font-medium text-slate-300">
                          {formatDate(patient.lastVisit)} ({daysSinceLastVisit} days ago)
                        </span>
                      </div>
                    </div>

                    {/* Fee & Action */}
                    <div className="text-right space-y-2">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Visit Fee</p>
                        {fee === 0 ? (
                          <Badge variant="success" size="lg">
                            FREE
                          </Badge>
                        ) : (
                          <p className="text-2xl font-bold text-amber-400">{fee} ETB</p>
                        )}
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleCheckIn(patient)}
                      >
                        Check In
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Service Selection Modal */}
        {selectedPatient && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card variant="elevated" className="max-w-2xl w-full">
              <CardHeader>
                <CardTitle>Select Service for {selectedPatient.fullName}</CardTitle>
                <CardDescription>Choose the service type and visit category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Service Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Service Type <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="relative">
                      <input
                        type="radio"
                        name="serviceTypeModal"
                        value="OPD"
                        checked={serviceType === 'OPD'}
                        onChange={(e) => setServiceType(e.target.value as 'OPD')}
                        className="peer sr-only"
                      />
                      <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-700 peer-checked:border-sky-500 peer-checked:bg-sky-500/10 cursor-pointer transition-all">
                        <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center">
                          <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-200">OPD</p>
                          <p className="text-sm text-slate-400">Consultation</p>
                        </div>
                      </div>
                    </label>

                    <label className="relative">
                      <input
                        type="radio"
                        name="serviceTypeModal"
                        value="ULTRASOUND"
                        checked={serviceType === 'ULTRASOUND'}
                        onChange={(e) => setServiceType(e.target.value as 'ULTRASOUND')}
                        className="peer sr-only"
                      />
                      <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-700 peer-checked:border-sky-500 peer-checked:bg-sky-500/10 cursor-pointer transition-all">
                        <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center">
                          <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-200">Ultrasound</p>
                          <p className="text-sm text-slate-400">Imaging</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Visit Type for Ultrasound */}
                {serviceType === 'ULTRASOUND' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-3">
                      Ultrasound Type <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="relative">
                        <input
                          type="radio"
                          name="visitTypeModal"
                          value="REPEAT"
                          checked={visitType === 'REPEAT'}
                          onChange={(e) => setVisitType(e.target.value as 'REPEAT')}
                          className="peer sr-only"
                        />
                        <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-700 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 cursor-pointer transition-all">
                          <div>
                            <p className="font-semibold text-slate-200">One-time</p>
                            <p className="text-sm text-slate-400">First ultrasound</p>
                          </div>
                          <p className="text-2xl font-bold text-emerald-400">200 ETB</p>
                        </div>
                      </label>

                      <label className="relative">
                        <input
                          type="radio"
                          name="visitTypeModal"
                          value="FOLLOW_UP"
                          checked={visitType === 'FOLLOW_UP'}
                          onChange={(e) => setVisitType(e.target.value as 'FOLLOW_UP')}
                          className="peer sr-only"
                        />
                        <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-700 peer-checked:border-amber-500 peer-checked:bg-amber-500/10 cursor-pointer transition-all">
                          <div>
                            <p className="font-semibold text-slate-200">Follow-up</p>
                            <p className="text-sm text-slate-400">Return visit</p>
                          </div>
                          <p className="text-2xl font-bold text-amber-400">400 ETB</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-sky-500/10 to-emerald-500/10 border-2 border-sky-500/30 rounded-xl">
                  <span className="text-lg font-semibold text-slate-200">Total Amount</span>
                  <span className="text-3xl font-bold text-sky-400">
                    {calculateFee(selectedPatient.lastVisit) + (serviceType === 'ULTRASOUND' ? (visitType === 'FOLLOW_UP' ? 400 : 200) : 0)} ETB
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedPatient(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={confirmCheckIn}
                  >
                    Confirm Check-in
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Results */}
        {searchQuery && searchResults.length === 0 && !isSearching && (
          <Card variant="elevated">
            <CardContent className="text-center py-12">
              <svg className="h-16 w-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-slate-50 mb-2">No Patient Found</h3>
              <p className="text-slate-400 mb-4">
                No patient found with the search criteria. Try a different search term.
              </p>
              <Button variant="primary" onClick={() => window.location.href = '/reception/new-patient'}>
                Register New Patient
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card variant="bordered">
          <CardContent className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0">
              <svg className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-1">30-Day Free Follow-up Policy</h4>
              <p className="text-sm text-slate-400">
                Patients returning within 30 days of their last visit are not charged the card fee. 
                After 30 days, the standard 30 ETB fee applies.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
