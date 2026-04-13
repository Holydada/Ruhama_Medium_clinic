import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { adminModuleSubnav } from '../../navigation/moduleSubnavItems';
import { Button } from '../../components/ui/Button';
import { Shield } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  RECEPTIONIST: 'Receptionist',
  PHARMACIST: 'Pharmacist',
  LAB_TECH: 'Lab Technician',
  FINANCE: 'Finance',
  EMERGENCY: 'Emergency',
  INJECTION_ROOM: 'Injection Room',
  PATIENT: 'Patient Portal',
};

export const RoleManagement: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Array<{ role: string; count: number }>>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const resp = await api.get('/admin/roles/summary');
      const data = resp.data?.data || [];
      setRows(
        [...data].sort((a: { role: string }, b: { role: string }) => a.role.localeCompare(b.role))
      );
    } catch {
      toast.error('Failed to load role summary.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-1">Live user counts per role (from database)</p>
        </div>
        <Button variant="outline" onClick={() => void load()} isLoading={loading}>
          Refresh
        </Button>
      </div>

      <ModuleSubnav items={adminModuleSubnav} ariaLabel="Admin sections" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rows.map((row) => (
          <Card key={row.role} className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">
                  {ROLE_LABELS[row.role] || row.role.replace(/_/g, ' ')}
                </h3>
                <p className="text-sm text-gray-600">{row.count} user(s)</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                type="button"
                onClick={() =>
                  navigate(`/admin/staff?role=${encodeURIComponent(row.role.toLowerCase())}`)
                }
              >
                View users
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {rows.length === 0 && !loading && (
        <p className="text-sm text-gray-500 mt-4">No role data.</p>
      )}
    </div>
  );
};
