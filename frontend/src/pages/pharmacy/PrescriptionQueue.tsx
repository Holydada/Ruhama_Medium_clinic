import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { pharmacyModuleSubnav } from '../../navigation/moduleSubnavItems';
import { getLang, setLang, t, type AppLang } from '../../lib/i18n';

interface QueuePrescription {
  id: string;
  prescriptionNumber: string;
  patientName: string;
  cardNumber: string;
  doctorName: string;
  createdAt: string;
  medicationsCount: number;
}

export const PrescriptionQueue = () => {
  const [lang, setLanguage] = useState<AppLang>(getLang());
  const [rows, setRows] = useState<QueuePrescription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [dispenseTarget, setDispenseTarget] = useState<QueuePrescription | null>(null);
  const [dispenseForm, setDispenseForm] = useState({
    labelPrinted: false,
    substitutionMade: false,
    substitutionReason: '',
    counselProvided: false,
    notes: '',
  });

  const loadQueue = async () => {
    setIsLoading(true);
    try {
      const resp = await api.get('/prescriptions/queue');
      const queue = resp.data?.data || [];
      const mapped: QueuePrescription[] = queue.map((p: any) => ({
        id: p.id,
        prescriptionNumber: p.prescriptionNumber || p.id,
        patientName: p.patient?.fullName || 'Unknown Patient',
        cardNumber: p.patient?.cardNumber || 'N/A',
        doctorName: p.doctor?.fullName || 'Unknown Doctor',
        createdAt: p.createdAt || new Date().toISOString(),
        medicationsCount: p.items?.length || 0,
      }));
      setRows(mapped);
    } catch (error) {
      console.error('Failed to load prescription queue', error);
      toast.error('Failed to load prescription queue.');
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadQueue();
  }, []);

  const dispense = async (id: string) => {
    setActioningId(id);
    try {
      await api.post(`/prescriptions/${id}/dispense`, {
        labelPrinted: dispenseForm.labelPrinted,
        substitutionMade: dispenseForm.substitutionMade,
        substitutionReason: dispenseForm.substitutionReason,
        counselProvided: dispenseForm.counselProvided,
        notes: dispenseForm.notes,
      });
      toast.success('Prescription dispensed successfully.');
      setDispenseTarget(null);
      setDispenseForm({
        labelPrinted: false,
        substitutionMade: false,
        substitutionReason: '',
        counselProvided: false,
        notes: '',
      });
      await loadQueue();
    } catch (error) {
      console.error('Failed to dispense prescription', error);
      toast.error('Failed to dispense prescription.');
    } finally {
      setActioningId(null);
    }
  };

  const cancel = async (id: string) => {
    setActioningId(id);
    try {
      await api.post(`/prescriptions/${id}/cancel`);
      toast.info('Prescription cancelled.');
      await loadQueue();
    } catch (error) {
      console.error('Failed to cancel prescription', error);
      toast.error('Failed to cancel prescription.');
    } finally {
      setActioningId(null);
    }
  };

  const printDispenseLabel = (row: QueuePrescription) => {
    const html = `
      <html>
        <head>
          <title>Dispense Label ${row.prescriptionNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .label { width: 360px; border: 1px solid #111; padding: 12px; border-radius: 6px; }
            .title { font-weight: 700; font-size: 16px; margin-bottom: 10px; }
            .line { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; border-bottom: 1px dashed #ddd; }
            .line:last-child { border-bottom: none; }
            .value { font-weight: 600; }
            .note { margin-top: 10px; font-size: 11px; color: #555; }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="title">Pharmacy Dispense Label</div>
            <div class="line"><span>Prescription</span><span class="value">${row.prescriptionNumber}</span></div>
            <div class="line"><span>Patient</span><span class="value">${row.patientName}</span></div>
            <div class="line"><span>Card Number</span><span class="value">${row.cardNumber}</span></div>
            <div class="line"><span>Doctor</span><span class="value">${row.doctorName}</span></div>
            <div class="line"><span>Items</span><span class="value">${row.medicationsCount}</span></div>
            <div class="line"><span>Date</span><span class="value">${new Date().toLocaleString()}</span></div>
            <div class="note">Verify label content with final dispensed medication before handover.</div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    const popup = window.open('', '_blank', 'width=640,height=760');
    if (!popup) {
      toast.error('Popup blocked. Please allow popups to print labels.');
      return;
    }
    popup.document.open();
    popup.document.write(html);
    popup.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Prescription Queue</h1>
            <p className="text-slate-400 mt-1">{t(lang, 'pendingPrescriptionsReady')}</p>
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
            <Button variant="outline" onClick={() => void loadQueue()} isLoading={isLoading}>
              {t(lang, 'refresh')}
            </Button>
          </div>
        </div>

        <ModuleSubnav items={pharmacyModuleSubnav} ariaLabel="Pharmacy sections" />

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>{t(lang, 'queueItems')} ({rows.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rows.length === 0 && !isLoading && (
              <p className="text-sm text-slate-400">No pending prescriptions in queue.</p>
            )}
            {rows.map((row) => (
              <div
                key={row.id}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-100">{row.patientName}</p>
                      <Badge variant="info" size="sm">{row.cardNumber}</Badge>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      {row.prescriptionNumber} - {row.doctorName} - {row.medicationsCount} medication(s)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setDispenseTarget(row)}
                      isLoading={actioningId === row.id}
                    >
                      {t(lang, 'dispense')}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => void cancel(row.id)}
                      isLoading={actioningId === row.id}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        {dispenseTarget && (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Dispense Safety Checklist - {dispenseTarget.prescriptionNumber}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={dispenseForm.labelPrinted}
                    onChange={(e) => setDispenseForm((prev) => ({ ...prev, labelPrinted: e.target.checked }))}
                  />
                  Label printed and verified
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={dispenseForm.counselProvided}
                    onChange={(e) => setDispenseForm((prev) => ({ ...prev, counselProvided: e.target.checked }))}
                  />
                  Counseling provided to patient
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={dispenseForm.substitutionMade}
                    onChange={(e) => setDispenseForm((prev) => ({ ...prev, substitutionMade: e.target.checked }))}
                  />
                  Substitution made
                </label>
              </div>
              {dispenseForm.substitutionMade && (
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Substitution reason</label>
                  <textarea
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                    value={dispenseForm.substitutionReason}
                    onChange={(e) =>
                      setDispenseForm((prev) => ({ ...prev, substitutionReason: e.target.value }))
                    }
                    rows={2}
                    placeholder="Clinical/stock reason for substitution"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm text-slate-300 mb-1">Dispensing notes</label>
                <textarea
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  value={dispenseForm.notes}
                  onChange={(e) => setDispenseForm((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  placeholder="Optional notes"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => printDispenseLabel(dispenseTarget)}
                >
                  Print Label
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => void dispense(dispenseTarget.id)}
                  isLoading={actioningId === dispenseTarget.id}
                >
                  Confirm Dispense
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDispenseTarget(null)}>
                  {t(lang, 'close')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

