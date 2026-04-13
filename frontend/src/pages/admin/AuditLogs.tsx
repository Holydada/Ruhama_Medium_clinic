import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Search, FileText, Download } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { downloadTextFile } from '../../lib/downloadFile';
import { Button } from '../../components/ui/Button';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { adminModuleSubnav } from '../../navigation/moduleSubnavItems';

interface LogEntry {
  id: string;
  action: string;
  module: string;
  user: string;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'failed';
}

export const AuditLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAuditLogs = async () => {
    setIsLoading(true);
    try {
      const resp = await api.get('/admin/audit-logs', { params: { limit: 200 } });
      const rows = resp.data?.data?.logs || [];
      setLogs(
        rows.map((row: any) => ({
          id: row.id,
          action: row.action || 'UNKNOWN',
          module: row.resource || 'System',
          user: row.user?.email || row.user?.fullName || 'System',
          timestamp: row.timestamp
            ? String(row.timestamp).slice(0, 19).replace('T', ' ')
            : 'N/A',
          ipAddress: row.ipAddress || 'N/A',
          status: 'success',
        }))
      );
    } catch (_error) {
      toast.error('Failed to load audit logs.');
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAuditLogs();
  }, []);

  const exportCsv = () => {
    const headers = ['timestamp', 'action', 'module', 'user', 'ip'];
    const lines = [
      headers.join(','),
      ...filteredLogs.map((log) =>
        [log.timestamp, log.action, log.module, log.user, log.ipAddress]
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(',')
      ),
    ];
    downloadTextFile(lines.join('\r\n'), `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8');
    toast.success('CSV download started.');
  };

  const filteredLogs = useMemo(
    () =>
      logs.filter(
        (log) =>
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [logs, searchTerm]
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        </div>
        <Button variant="outline" type="button" onClick={exportCsv} disabled={logs.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <ModuleSubnav items={adminModuleSubnav} ariaLabel="Admin sections" />

      <Card className="p-4 mb-6">
        <Input
          icon={Search}
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{log.timestamp}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.action}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.module}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.user}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.ipAddress}</td>
                  <td className="px-6 py-4">
                    <Badge variant={log.status === 'success' ? 'success' : 'error'}>
                      {log.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {filteredLogs.length === 0 && !isLoading && (
        <Card className="p-6 mt-4">
          <p className="text-sm text-gray-600">No audit logs found.</p>
        </Card>
      )}
    </div>
  );
};
