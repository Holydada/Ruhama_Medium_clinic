import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { api, getStoredAuth } from '../../lib/api';
import { calculateAge } from '../../lib/utils';
import { LabOrderForm } from './LabOrderForm';
import { PrescriptionForm } from './PrescriptionForm';
import { InjectionOrder } from './InjectionOrder';
import { UltrasoundOrder } from './UltrasoundOrder';
import { SOAPNotesEntry } from './SOAPNotesEntry';
import { getLang, setLang, t, type AppLang } from '../../lib/i18n';

const DOCTOR_SUBNAV = [
  { to: '/doctor-dashboard', label: 'Encounters' },
  { to: '/doctor/queue', label: 'Queue overview' },
  { to: '/doctor/results', label: 'Lab & imaging results' },
  { to: '/ultrasound-dashboard', label: 'Ultrasound' },
  { to: '/staff-chat', label: 'Staff chat' },
];

type EncounterTab = 'soap' | 'lab' | 'prescription' | 'injection' | 'ultrasound';

interface VisitRow {
  id: string;
  status: string;
  visitDate: string;
  patient: {
    id: string;
    fullName: string;
    cardNumber: string;
    sex: string;
    dateOfBirth: string;
    photoUrl?: string | null;
  };
}

interface SearchPatient {
  id: string;
  cardNumber: string;
  fullName: string;
  age: number;
  sex: string;
  phone: string;
  photoUrl?: string;
  lastVisit?: string;
  visitCount: number;
}

export const DoctorEncounterWorkspace = () => {
  const [searchParams] = useSearchParams();
  const [lang, setLanguage] = useState<AppLang>(getLang());
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [activeVisitId, setActiveVisitId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<EncounterTab>('lab');
  const [isLoading, setIsLoading] = useState(false);
  const [timeline, setTimeline] = useState<
    Array<{ id: string; action: string; at: string; actor: string; tableName?: string }>
  >([]);
  const [startingConsultId, setStartingConsultId] = useState<string | null>(null);
  
  // Patient search state
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'phone' | 'card'>('card');
  const [searchResults, setSearchResults] = useState<SearchPatient[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const loadVisits = async () => {
    setIsLoading(true);
    try {
      const me = getStoredAuth()?.user;
      const params: Record<string, string> = {
        limit: '50',
        serviceType: 'OPD',
      };
      if (me?.role !== 'SUPER_ADMIN') {
        params.doctorId = me?.id || '';
      }
      const resp = await api.get('/visits', { params });
      const rows: VisitRow[] = resp.data?.data?.visits || [];
      const active = rows.filter((v) => ['IN_QUEUE', 'IN_CONSULTATION', 'REGISTERED'].includes(v.status));
      setVisits(active);
      if (!activeVisitId && active.length > 0) {
        setActiveVisitId(active[0].id);
      }
    } catch (error) {
      console.error('Failed to load doctor visit queue', error);
      setVisits([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadVisits();
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'soap' || tab === 'lab' || tab === 'prescription' || tab === 'injection' || tab === 'ultrasound') {
      setActiveTab(tab as EncounterTab);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadTimeline = async () => {
      if (!activeVisitId) return;
      try {
        const resp = await api.get(`/visits/${activeVisitId}/timeline`);
        const rows = resp.data?.data || [];
        setTimeline(
          rows.map((r: any) => ({
            id: r.id,
            action: String(r.action || '').replace(/_/g, ' '),
            at: new Date(r.createdAt).toLocaleString(),
            actor: r.user?.fullName || r.user?.role || 'System',
            tableName: r.tableName,
          }))
        );
      } catch (_error) {
        setTimeline([]);
      }
    };
    void loadTimeline();
  }, [activeVisitId]);

  const activeVisit = useMemo(
    () => visits.find((v) => v.id === activeVisitId) || visits[0],
    [visits, activeVisitId]
  );

  /** Lab orders need a consultation context; when the doctor opens Lab, move visit into consultation if still queued. */
  useEffect(() => {
    if (activeTab !== 'lab' || !activeVisit) return;
    if (!['REGISTERED', 'IN_QUEUE'].includes(activeVisit.status)) return;
    let cancelled = false;
    void (async () => {
      try {
        await api.patch(`/visits/${activeVisit.id}/status`, { status: 'IN_CONSULTATION' });
        if (!cancelled) await loadVisits();
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeTab, activeVisit?.id, activeVisit?.status]);

  const patient = activeVisit
    ? {
        id: activeVisit.patient.id,
        cardNumber: activeVisit.patient.cardNumber,
        fullName: activeVisit.patient.fullName,
        age: calculateAge(activeVisit.patient.dateOfBirth),
        gender: activeVisit.patient.sex,
      }
    : null;

  const getStatusLabel = (status: string) => {
    if (status === 'IN_CONSULTATION') return 'In Consultation';
    if (status === 'IN_QUEUE') return 'In Queue';
    if (status === 'REGISTERED') return 'Registered';
    return status;
  };

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
      
      console.log('[DoctorEncounterWorkspace] Searching with params:', params);
      
      const resp = await api.get('/patients', { params });
      const patients = resp.data?.data?.patients || [];
      
      console.log('[DoctorEncounterWorkspace] Found patients:', patients.length);
      
      const mapped: SearchPatient[] = patients.map((p: any) => {
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
          sex: p.sex,
          phone: p.phone || '-',
          photoUrl: p.photoUrl || undefined,
          lastVisit,
          visitCount: p.visits?.length || 0,
        };
      });
      
      setSearchResults(mapped);
      
      if (mapped.length === 0) {
        // Silent - no notification needed
      }
    } catch (error) {
      console.error('[DoctorEncounterWorkspace] Search failed:', error);
      setSearchResults([]);
      // Silent - no notification needed
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPatient = async (patient: SearchPatient) => {
    console.log('[DoctorEncounterWorkspace] handleSelectPatient called with:', patient);
    
    // Find if this patient is already in the doctor's queue
    const existingVisit = visits.find(v => v.patient.id === patient.id);
    
    if (existingVisit) {
      console.log('[DoctorEncounterWorkspace] Patient found in queue, selecting visit:', existingVisit.id);
      // Patient is already in queue, just select them
      closeSearch();
      setActiveVisitId(existingVisit.id);
      setActiveTab('lab');
      console.log('[DoctorEncounterWorkspace] Patient selected, forms should now be visible');
    } else {
      console.log('[DoctorEncounterWorkspace] Patient not in queue');
      alert('This patient is not in your queue yet. They need to be assigned to you by reception first.');
      closeSearch();
    }
  };

  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">{t(lang, 'doctorEncounterWorkspace')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-300">{t(lang, 'language')}</label>
          <select
            value={lang}
            onChange={(e) => {
              const next = e.target.value as AppLang;
              setLanguage(next);
              setLang(next);
            }}
            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
          >
            <option value="en">English</option>
            <option value="am">አማርኛ</option>
          </select>
          <Button variant="outline" size="sm" onClick={() => void loadVisits()} isLoading={isLoading}>
            {t(lang, 'refreshQueue')}
          </Button>
        </div>
      </div>

      <ModuleSubnav items={DOCTOR_SUBNAV} ariaLabel="Doctor navigation" />

      {/* Patient Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card variant="elevated" className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Search Patient</CardTitle>
                  <p className="text-sm text-slate-400 mt-1">Find patient by card number, name, or phone</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeSearch}
                >
                  ✕
                </Button>
              </div>
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
                <div className="flex-1 relative">
                  <input
                    type="text"
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
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                    autoFocus
                  />
                </div>
                <Button 
                  variant="primary" 
                  onClick={handleSearch} 
                  disabled={isSearching || !searchQuery.trim()}
                  isLoading={isSearching}
                >
                  🔍 Search
                </Button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-300">
                      Found {searchResults.length} patient(s)
                    </h3>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {searchResults.map((patient) => (
                      <div
                        key={patient.id}
                        onClick={() => handleSelectPatient(patient)}
                        className="flex items-center gap-4 p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500 transition-all cursor-pointer"
                      >
                        {/* Photo */}
                        <div className="h-14 w-14 rounded-xl bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {patient.photoUrl ? (
                            <img 
                              src={patient.photoUrl} 
                              alt={patient.fullName} 
                              className="h-full w-full object-cover" 
                            />
                          ) : (
                            <span className="text-xs font-semibold text-slate-300">
                              {patient.fullName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </span>
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
                            <span>{patient.age}y • {patient.sex === 'MALE' ? 'Male' : 'Female'}</span>
                            <span>📱 {patient.phone}</span>
                            <span>🔄 {patient.visitCount} visits</span>
                          </div>
                        </div>

                        {/* Action Indicator */}
                        <div className="flex-shrink-0">
                          <span className="text-slate-400">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {searchQuery && searchResults.length === 0 && !isSearching && (
                <div className="text-center py-8">
                  <p className="text-lg font-bold text-slate-50 mb-2">No Patient Found</p>
                  <p className="text-slate-400">
                    No patient found with the search criteria. Try a different search term.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t(lang, 'assignedPatientQueue')}</CardTitle>
            <Button variant="primary" size="sm" onClick={() => setShowSearch(true)}>
              Change Patient
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {visits.length === 0 && <p className="text-sm text-slate-400">{t(lang, 'noActiveAssignedPatients')}</p>}
          {visits.map((visit) => (
            <button
              key={visit.id}
              type="button"
              onClick={() => setActiveVisitId(visit.id)}
              className={`w-full text-left rounded-xl border p-3 transition ${
                activeVisit?.id === visit.id
                  ? 'border-sky-500 bg-sky-500/10'
                  : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center">
                      {visit.patient.photoUrl ? (
                        <img
                          src={visit.patient.photoUrl}
                          alt={visit.patient.fullName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-semibold text-slate-300">
                          {visit.patient.fullName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{visit.patient.fullName}</p>
                      <p className="text-xs text-slate-400">Card: {visit.patient.cardNumber}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={visit.status === 'IN_CONSULTATION' ? 'warning' : 'info'}>
                    {getStatusLabel(visit.status)}
                  </Badge>
                  {visit.status !== 'IN_CONSULTATION' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async (e) => {
                        e.stopPropagation();
                        setStartingConsultId(visit.id);
                        try {
                          await api.patch(`/visits/${visit.id}/status`, { status: 'IN_CONSULTATION' });
                          await loadVisits();
                        } finally {
                          setStartingConsultId(null);
                        }
                      }}
                      isLoading={startingConsultId === visit.id}
                    >
                      {t(lang, 'start')}
                    </Button>
                  )}
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {activeVisit && patient && (
        <>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Encounter sections">
            <Button
              type="button"
              variant={activeTab === 'soap' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('soap')}
              aria-pressed={activeTab === 'soap'}
            >
              SOAP
            </Button>
            <Button
              type="button"
              variant={activeTab === 'lab' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('lab')}
              aria-pressed={activeTab === 'lab'}
            >
              {t(lang, 'labOrder')}
            </Button>
            <Button
              type="button"
              variant={activeTab === 'prescription' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('prescription')}
              aria-pressed={activeTab === 'prescription'}
            >
              Prescription
            </Button>
            <Button
              type="button"
              variant={activeTab === 'injection' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('injection')}
              aria-pressed={activeTab === 'injection'}
            >
              Injection
            </Button>
            <Button
              type="button"
              variant={activeTab === 'ultrasound' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('ultrasound')}
              aria-pressed={activeTab === 'ultrasound'}
            >
              Ultrasound
            </Button>
          </div>

          {activeTab === 'soap' && (
            <SOAPNotesEntry
              visitId={activeVisit.id}
              patientId={patient.id}
              patientName={patient.fullName}
              cardNumber={patient.cardNumber}
              onSaved={async () => {
                const resp = await api.get(`/visits/${activeVisit.id}/timeline`);
                const rows = resp.data?.data || [];
                setTimeline(
                  rows.map((r: any) => ({
                    id: r.id,
                    action: String(r.action || '').replace(/_/g, ' '),
                    at: new Date(r.createdAt).toLocaleString(),
                    actor: r.user?.fullName || r.user?.role || 'System',
                    tableName: r.tableName,
                  }))
                );
              }}
            />
          )}
          {activeTab === 'lab' && (
            <LabOrderForm patient={patient} visitId={activeVisit.id} embedded />
          )}
          {activeTab === 'prescription' && (
            <PrescriptionForm
              patientId={patient.id}
              patientName={patient.fullName}
              cardNumber={patient.cardNumber}
              visitId={activeVisit.id}
            />
          )}
          {activeTab === 'injection' && (
            <InjectionOrder
              patientId={patient.id}
              patientName={patient.fullName}
              visitId={activeVisit.id}
            />
          )}
          {activeTab === 'ultrasound' && (
            <UltrasoundOrder
              patientId={patient.id}
              patientName={patient.fullName}
              cardNumber={patient.cardNumber}
              visitId={activeVisit.id}
            />
          )}

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>{t(lang, 'encounterTimeline')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {timeline.length === 0 && (
                <p className="text-sm text-slate-400">{t(lang, 'noTimelineEvents')}</p>
              )}
              {timeline.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2"
                >
                  <p className="text-sm font-semibold text-slate-100">{event.action}</p>
                  <p className="text-xs text-slate-400">
                    {event.at} • {event.actor}{event.tableName ? ` • ${event.tableName}` : ''}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
