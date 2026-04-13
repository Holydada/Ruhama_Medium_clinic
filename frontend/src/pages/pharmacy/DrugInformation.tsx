import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Search, AlertCircle } from 'lucide-react';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { pharmacyModuleSubnav } from '../../navigation/moduleSubnavItems';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

interface DrugRow {
  id: string;
  drugName: string;
  genericName: string | null;
  brandName: string | null;
  drugCategory: string | null;
  dosageForm: string | null;
  strength: string | null;
  unit: string | null;
  description: string | null;
  sideEffects: string | null;
  contraindications: string | null;
  storageConditions: string | null;
  isActive: boolean;
}

const splitList = (text: string | null | undefined): string[] => {
  if (!text?.trim()) return [];
  return text
    .split(/[,;•\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
};

export const DrugInformation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [drugs, setDrugs] = useState<DrugRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await api.get('/pharmacy/drugs', {
        params: searchTerm.trim() ? { search: searchTerm.trim() } : {},
      });
      setDrugs(resp.data?.data ?? []);
    } catch {
      toast.error('Failed to load drugs.');
      setDrugs([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const t = window.setTimeout(() => void load(), 300);
    return () => window.clearTimeout(t);
  }, [load]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Drug Information</h1>

      <ModuleSubnav items={pharmacyModuleSubnav} ariaLabel="Pharmacy sections" />

      <Card className="p-4 mb-6 mt-4">
        <Input
          icon={Search}
          placeholder="Search by drug, generic, or brand name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      {loading ? (
        <p className="text-gray-600">Loading…</p>
      ) : drugs.length === 0 ? (
        <Card className="p-6">
          <p className="text-gray-600">No drugs match your search.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {drugs.map((drug) => {
            const dosage =
              [drug.strength, drug.dosageForm, drug.unit].filter(Boolean).join(' · ') || '—';
            const sideEffects = splitList(drug.sideEffects);
            const contraindications = splitList(drug.contraindications);

            return (
              <Card key={drug.id} className="p-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{drug.drugName}</h2>
                  <p className="text-gray-600">{drug.genericName || drug.brandName || '—'}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {drug.drugCategory && <Badge variant="info">{drug.drugCategory}</Badge>}
                    {!drug.isActive && <Badge variant="warning">Inactive</Badge>}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
                    <p className="text-gray-700">{drug.description || 'No description on file.'}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Strength / form</h3>
                    <p className="text-gray-700">{dosage}</p>
                  </div>

                  {drug.storageConditions && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Storage</h3>
                      <p className="text-gray-700">{drug.storageConditions}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Side effects</h3>
                    {sideEffects.length ? (
                      <div className="flex flex-wrap gap-2">
                        {sideEffects.map((effect, idx) => (
                          <Badge key={idx} variant="warning">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Not recorded</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      Contraindications
                    </h3>
                    {contraindications.length ? (
                      <div className="flex flex-wrap gap-2">
                        {contraindications.map((contra, idx) => (
                          <Badge key={idx} variant="danger">
                            {contra}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Not recorded</p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
