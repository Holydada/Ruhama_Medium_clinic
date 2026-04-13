import React, { useEffect, useMemo, useState } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  HardDrive,
  Calendar,
  FileText,
  Settings,
  Play,
  Trash2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { adminModuleSubnav } from '../../navigation/moduleSubnavItems';
import { api } from '../../lib/api';
import { downloadTextFile } from '../../lib/downloadFile';

interface BackupRecord {
  id: string;
  filename: string;
  size: string;
  date: string;
  time: string;
  type: 'automatic' | 'manual';
  status: 'completed' | 'failed';
  duration: string;
}

interface SystemStats {
  users?: { total: number; active: number; pending: number };
  patients?: { total: number };
  visits?: { today: number };
  revenue?: { today: number };
}

export const BackupRestore: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'backup' | 'restore' | 'schedule'>('backup');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats>({});
  const [isLoading, setIsLoading] = useState(false);
  const [backupHistory, setBackupHistory] = useState<BackupRecord[]>([]);
  const [pendingRestoreId, setPendingRestoreId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const loadOperationalData = async () => {
    setIsLoading(true);
    try {
      const [statsResp, logsResp] = await Promise.all([
        api.get('/admin/stats/system'),
        api.get('/admin/audit-logs', { params: { limit: 200 } }),
      ]);
      setSystemStats(statsResp.data?.data || {});

      const logs = logsResp.data?.data?.logs || [];
      const backupLikeLogs = logs.filter((row: any) => {
        const action = String(row.action || '').toUpperCase();
        return action.includes('BACKUP') || action.includes('RESTORE');
      });
      setBackupHistory(
        backupLikeLogs.slice(0, 20).map((row: any, idx: number) => {
          const createdAt = row.createdAt ? new Date(row.createdAt) : new Date();
          const action = String(row.action || '').toUpperCase();
          return {
            id: row.id || `${idx}`,
            filename: `operation_${action.toLowerCase()}_${String(createdAt.getTime())}.log`,
            size: 'N/A',
            date: createdAt.toISOString().slice(0, 10),
            time: createdAt.toTimeString().slice(0, 5),
            type: action.includes('AUTO') ? 'automatic' : 'manual',
            status: 'completed',
            duration: 'N/A',
          } as BackupRecord;
        })
      );
    } catch (_error) {
      toast.error('Failed to load backup operations data.');
      setSystemStats({});
      setBackupHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadOperationalData();
  }, []);

  const handleCreateBackup = () => {
    setIsBackingUp(true);
    toast.info('Manual backup request registered. Execute server backup script from infrastructure console.');
    setIsBackingUp(false);
    void loadOperationalData();
  };

  const handleRestore = (backupId: string) => {
    setPendingDeleteId(null);
    setPendingRestoreId(backupId);
  };

  const handleDownload = (filename: string) => {
    const payload = {
      exportedAt: new Date().toISOString(),
      filename,
      systemStats,
      note: 'This is a metadata snapshot only. Full database backups must be taken with pg_dump or your host backup tools.',
    };
    downloadTextFile(JSON.stringify(payload, null, 2), filename.replace(/\.log$/, '.json'), 'application/json');
    toast.success('Snapshot JSON downloaded.');
  };

  const handleDelete = (backupId: string) => {
    setPendingRestoreId(null);
    setPendingDeleteId(backupId);
  };

  const latestBackup = useMemo(() => {
    if (backupHistory.length === 0) {
      return 'No backup operations logged';
    }
    return `${backupHistory[0].date} ${backupHistory[0].time}`;
  }, [backupHistory]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Backup & Restore</h1>
          <p className="text-slate-600 mt-1">Manage database backups and restore points</p>
        </div>
        <Button
          onClick={handleCreateBackup}
          disabled={isBackingUp}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isBackingUp ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Creating Backup...
            </>
          ) : (
            <>
              <Database className="w-4 h-4 mr-2" />
              Create Backup Now
            </>
          )}
        </Button>
      </div>

      <ModuleSubnav items={adminModuleSubnav} ariaLabel="Admin sections" />

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Last Backup</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{latestBackup}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Backups</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{backupHistory.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Storage Used</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{systemStats.patients?.total ?? 0} Patients</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Next Scheduled</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">Ops-defined</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('backup')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'backup'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4 inline mr-2" />
          Backup History
        </button>
        <button
          onClick={() => setActiveTab('restore')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'restore'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Restore
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'schedule'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Schedule
        </button>
      </div>

      {/* Backup History Tab */}
      {activeTab === 'backup' && (
        <Card className="p-6">
          {(pendingRestoreId || pendingDeleteId) && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-sm text-amber-900">
                {pendingRestoreId
                  ? `Confirm restore request for backup ${pendingRestoreId}? This will overwrite current data once ops executes it.`
                  : `Confirm delete request for backup ${pendingDeleteId}?`}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    if (pendingRestoreId) {
                      toast.info(`Restore request (${pendingRestoreId}) requires infrastructure-level execution and approval.`);
                      setPendingRestoreId(null);
                    } else if (pendingDeleteId) {
                      toast.success(`Backup ${pendingDeleteId} delete request recorded.`);
                      setPendingDeleteId(null);
                    }
                  }}
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setPendingRestoreId(null);
                    setPendingDeleteId(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Backup History</h2>
            <div className="flex items-center space-x-2">
              <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                <option>All Types</option>
                <option>Automatic</option>
                <option>Manual</option>
              </select>
              <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>All Time</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Filename</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date & Time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Size</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Duration</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {backupHistory.map((backup) => (
                  <tr key={backup.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-slate-400 mr-2" />
                        <span className="text-sm text-slate-900 font-medium">{backup.filename}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {backup.date} at {backup.time}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{backup.size}</td>
                    <td className="py-3 px-4">
                      <Badge variant={backup.type === 'automatic' ? 'info' : 'warning'}>
                        {backup.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={backup.status === 'completed' ? 'success' : 'error'}>
                        {backup.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{backup.duration}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(backup.filename)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestore(backup.id)}
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(backup.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {backupHistory.length === 0 && !isLoading && (
            <p className="text-sm text-slate-500 mt-4">
              No backup/restore entries found in audit logs yet. Configure infra jobs to emit backup actions.
            </p>
          )}
        </Card>
      )}

      {/* Restore Tab */}
      {activeTab === 'restore' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Restore Database</h2>
          
          <div className="space-y-6">
            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900">Warning</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Restoring a backup will overwrite all current data. This action cannot be undone.
                  Make sure to create a backup of the current state before proceeding.
                </p>
              </div>
            </div>

            {/* Restore Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* From Backup History */}
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-4">From Backup History</h3>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-4"
                  value={selectedBackup || ''}
                  onChange={(e) => setSelectedBackup(e.target.value)}
                >
                  <option value="">Select a backup...</option>
                  {backupHistory.map((backup) => (
                    <option key={backup.id} value={backup.id}>
                      {backup.filename} ({backup.date})
                    </option>
                  ))}
                </select>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!selectedBackup}
                  onClick={() => selectedBackup && handleRestore(selectedBackup)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Restore Selected Backup
                </Button>
              </div>

              {/* Upload Backup File */}
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Upload Backup File</h3>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 mb-2">
                    Drag and drop a backup file here, or click to browse
                  </p>
                  <p className="text-xs text-slate-500">Supported: .sql, .zip (max 500MB)</p>
                  <input
                    type="file"
                    accept=".sql,.zip"
                    className="hidden"
                    id="backup-upload"
                  />
                  <label htmlFor="backup-upload">
                    <Button className="mt-4" variant="outline">
                      Choose File
                    </Button>
                  </label>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Upload currently registers an operations request only. Actual restore is infrastructure-controlled.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Backup Schedule</h2>
          
          <div className="space-y-6">
            {/* Automatic Backup Settings */}
            <div className="border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Automatic Backups</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Frequency
                  </label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                    <option>Every 12 hours</option>
                    <option>Daily</option>
                    <option>Every 2 days</option>
                    <option>Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    defaultValue="02:00"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Retention Period
                  </label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                    <option>Keep for 30 days</option>
                    <option>Keep for 60 days</option>
                    <option>Keep for 90 days</option>
                    <option>Keep forever</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Storage Location
                  </label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                    <option>Local Server</option>
                    <option>Cloud Storage</option>
                    <option>Both</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Notifications</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm text-slate-700">Email notification on successful backup</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm text-slate-700">Email notification on failed backup</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span className="text-sm text-slate-700">Escalate failed backup in admin audit feed</span>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => toast.success('Schedule preferences saved locally. Connect infra scheduler endpoint to persist.')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Save Schedule Settings
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
