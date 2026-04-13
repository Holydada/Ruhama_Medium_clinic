import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { toast } from '../../lib/toast';

interface Patient {
  id: string;
  cardNumber: string;
  fullName: string;
  sex: string;
  dateOfBirth: string;
  phone?: string;
  photoUrl?: string;
}

interface PatientSearchProps {
  onSelectPatient: (patient: Patient) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const PatientSearch = ({ onSelectPatient, placeholder, autoFocus }: PatientSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Load recent patients on mount
  useEffect(() => {
    loadRecentPatients();
  }, []);

  // Search patients when query changes
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      searchPatients();
    } else {
      setPatients([]);
    }
  }, [searchQuery]);

  const loadRecentPatients = async () => {
    try {
      const resp = await api.get('/patients', {
        params: { limit: 5, page: 1 },
      });
      setRecentPatients(resp.data.data.patients || []);
    } catch (error) {
      console.error('Failed to load recent patients:', error);
    }
  };

  const searchPatients = async () => {
    setLoading(true);
    try {
      const resp = await api.get('/patients', {
        params: { search: searchQuery, limit: 10 },
      });
      setPatients(resp.data.data.patients || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Failed to search patients');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    onSelectPatient(patient);
    setSearchQuery('');
    setShowResults(false);
    setPatients([]);
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const displayPatients = searchQuery.trim().length >= 2 ? patients : recentPatients;
  const showDropdown = showResults || (searchQuery.trim().length === 0 && recentPatients.length > 0);

  return (
    <div className="relative">
      <div className="relative">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder || 'Search by name, card number, or phone...'}
          autoFocus={autoFocus}
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>
      </div>

      {showDropdown && displayPatients.length > 0 && (
        <Card className="absolute z-50 w-full mt-2 max-h-96 overflow-y-auto shadow-xl">
          <div className="p-2">
            {searchQuery.trim().length === 0 && (
              <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Recent Patients
              </div>
            )}
            {displayPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => handleSelectPatient(patient)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-800/50 transition-colors text-left"
              >
                {patient.photoUrl ? (
                  <img
                    src={patient.photoUrl}
                    alt={patient.fullName}
                    className="h-12 w-12 rounded-full object-cover border-2 border-slate-700"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600">
                    <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-100 truncate">{patient.fullName}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                      {patient.sex}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                    <span className="font-mono">{patient.cardNumber}</span>
                    <span>•</span>
                    <span>{calculateAge(patient.dateOfBirth)} years</span>
                    {patient.phone && (
                      <>
                        <span>•</span>
                        <span>{patient.phone}</span>
                      </>
                    )}
                  </div>
                </div>
                <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </Card>
      )}

      {showResults && searchQuery.trim().length >= 2 && patients.length === 0 && !loading && (
        <Card className="absolute z-50 w-full mt-2 shadow-xl">
          <div className="p-6 text-center">
            <svg
              className="mx-auto h-12 w-12 text-slate-600 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-slate-400">No patients found</p>
            <p className="text-sm text-slate-500 mt-1">Try searching by name, card number, or phone</p>
          </div>
        </Card>
      )}
    </div>
  );
};
