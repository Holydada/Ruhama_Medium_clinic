import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Search, Shield } from 'lucide-react';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { financeModuleSubnav } from '../../navigation/moduleSubnavItems';

interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  type: 'create' | 'update' | 'delete';
}

export const AuditTrail: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [entries] = useState<AuditEntry[]>([
    {
      id: '1',
      action: 'Payment Collected',
      user: 'Receptionist 1',
      timestamp: '2026-03-21 10:30:15',
      details: 'Card fee payment - 30 ETB',
      type: 'create'
    },
    {
      id: '2',
      action: 'Invoice Updated',
      user: 'Finance Manager',
      timestamp: '2026-03-21 09:15:22',
      details: 'Invoice INV-2026-001 updated',
      type: 'update'
    }
  ]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
      </div>

      <ModuleSubnav items={financeModuleSubnav} ariaLabel="Finance sections" />

      <Card className="p-4 mb-6">
        <Input
          icon={Search}
          placeholder="Search audit logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      <div className="space-y-3">
        {entries.map(entry => (
          <Card key={entry.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant={
                    entry.type === 'create' ? 'success' :
                    entry.type === 'update' ? 'info' : 'danger'
                  }>
                    {entry.type}
                  </Badge>
                  <h3 className="font-semibold text-gray-900">{entry.action}</h3>
                </div>
                <p className="text-sm text-gray-600">{entry.details}</p>
                <p className="text-xs text-gray-500 mt-2">
                  By {entry.user} at {entry.timestamp}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
