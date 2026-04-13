import { useState, useEffect } from 'react';
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
  sex: string;
  phone: string;
  registrationDate: string;
  visitCount: number;
}

export const PatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [archiveConfirm, setArchiveConfirm] = useState<Patient | null>(null);
  const [archiveReason, setArchiveReason] = useState('');

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const resp = await api.get('/patients', {
        params: {
          search: searchQuery || undefined,
          limit: 50,
        },
      });
      const data = resp.data?.data?.patients || [];
      const mapped: Patient[] = data.map((p: any) => ({
        id: p.id,
        cardNumber: p.cardNumber,
        fullName: p.fullName,
        sex: p.sex === 'MALE' ? 'Male' : 'Female',
        phone: p.phone || '-',
        registrationDate: p.registrationDate || p.createdAt,
        visitCount: p.visits?.length || 0,
      }));
      setPatients(mapped);
    } catch (error) {
      console.error('Failed to load patients', error);
      toast.error('Failed to load patients');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPatients();
  }, []);

  const handleArchive = async (patient: Patient) => {
    const trimmedReason = archiveReason.trim();
    
    if (!trimmedReason) {
      toast.error('Please provide a reason for archiving');
      return;
    }
    
    if (trimmedReason.length < 5) {
      toast.error('Archive reason must be at least 5 characters');
      return;
    }

    try {
      await api.put(`/patients/${patient.id}/archive`, {
        reason: trimmedReason,
      });
      toast.success(`${patient.fullName} archived successfully. Patient will be hidden from all lists.`);
      setArchiveConfirm(null);
      setArchiveReason('');
      void loadPatients();
    } catch (error: any) {
      console.error('Archive error:', error);
      let errorMessage = 'Failed to archive patient';
      
      if (error?.response?.data?.error) {
        const err = error.response.data.error;
        errorMessage = typeof err === 'string' ? err : err.message || errorMessage;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Patient Management</h1>
            <p className="text-slate-400 mt-1">View and manage registered patients</p>
          </div>
        </div>

        <ModuleSubnav items={receptionModuleSubnav} ariaLabel="Reception workflow" />

        {/* Search */}
        <Card variant="elevated">
          <CardContent className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search by name, card number, or phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && loadPatients()}
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
            <Button variant="primary" onClick={loadPatients} isLoading={isLoading}>
              Search
            </Button>
          </CardContent>
        </Card>

        {/* Patient List */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Registered Patients</CardTitle>
            <CardDescription>{patients.length} patient(s) found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Card #</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Full Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Gender</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Phone</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Registered</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Visits</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4 text-sm font-mono text-sky-400">{patient.cardNumber}</td>
                      <td className="py-4 px-4 text-sm text-slate-200 font-medium">{patient.fullName}</td>
                      <td className="py-4 px-4 text-sm text-slate-300">{patient.sex}</td>
                      <td className="py-4 px-4 text-sm text-slate-300">{patient.phone}</td>
                      <td className="py-4 px-4 text-sm text-slate-400">{formatDate(patient.registrationDate)}</td>
                      <td className="py-4 px-4">
                        <Badge variant={patient.visitCount > 0 ? 'info' : 'default'}>
                          {patient.visitCount}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setArchiveConfirm(patient)}
                          className="text-amber-400 hover:text-amber-300"
                          title="Archive patient (hide from all lists)"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Archive Confirmation Modal */}
        {archiveConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card variant="elevated" className="max-w-md w-full">
              <CardHeader>
                <CardTitle className="text-amber-400">Archive Patient</CardTitle>
                <CardDescription>Patient will be hidden from all lists</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <p className="text-slate-200 mb-2">
                    Archive <span className="font-bold">{archiveConfirm.fullName}</span>?
                  </p>
                  <p className="text-sm text-slate-400">
                    Card: {archiveConfirm.cardNumber}
                  </p>
                  <p className="text-sm text-amber-400 mt-2">
                    ℹ️ Patient data will be preserved but hidden from all lists. Contact administrator to restore.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Reason for archiving <span className="text-red-400">*</span>
                    <span className="text-slate-400 font-normal ml-2">
                      ({archiveReason.trim().length}/5 characters minimum)
                    </span>
                  </label>
                  <textarea
                    value={archiveReason}
                    onChange={(e) => setArchiveReason(e.target.value)}
                    className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none resize-none"
                    rows={3}
                    placeholder="e.g., Patient moved to another city, Duplicate record, etc."
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setArchiveConfirm(null);
                      setArchiveReason('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1 bg-amber-600 hover:bg-amber-700"
                    onClick={() => handleArchive(archiveConfirm)}
                  >
                    Archive
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
