import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import { Save, Settings } from 'lucide-react';

export default function SystemSettings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    clinicName: '',
    clinicAddress: '',
    clinicPhone: '',
    clinicEmail: '',
    currency: 'USD',
    timezone: 'UTC',
    appointmentDuration: 30,
    workingHoursStart: '08:00',
    workingHoursEnd: '17:00',
    enableSMS: false,
    enableEmail: true,
    autoBackup: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.get('/api/v1/admin/settings');
      setSettings(response.data.data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put('/api/v1/admin/settings', settings);
      toast.success('Settings updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">System Settings</h1>
          <p className="text-slate-400 mt-1">Configure clinic-wide settings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Clinic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Clinic Name
                </label>
                <Input
                  value={settings.clinicName}
                  onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Address
                </label>
                <Input
                  value={settings.clinicAddress}
                  onChange={(e) => setSettings({ ...settings, clinicAddress: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone
                  </label>
                  <Input
                    value={settings.clinicPhone}
                    onChange={(e) => setSettings({ ...settings, clinicPhone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={settings.clinicEmail}
                    onChange={(e) => setSettings({ ...settings, clinicEmail: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operational Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Working Hours Start
                  </label>
                  <Input
                    type="time"
                    value={settings.workingHoursStart}
                    onChange={(e) => setSettings({ ...settings, workingHoursStart: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Working Hours End
                  </label>
                  <Input
                    type="time"
                    value={settings.workingHoursEnd}
                    onChange={(e) => setSettings({ ...settings, workingHoursEnd: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Default Appointment Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={settings.appointmentDuration}
                  onChange={(e) => setSettings({ ...settings, appointmentDuration: parseInt(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableEmail"
                  checked={settings.enableEmail}
                  onChange={(e) => setSettings({ ...settings, enableEmail: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="enableEmail" className="text-slate-300">
                  Enable Email Notifications
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableSMS"
                  checked={settings.enableSMS}
                  onChange={(e) => setSettings({ ...settings, enableSMS: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="enableSMS" className="text-slate-300">
                  Enable SMS Notifications
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoBackup"
                  checked={settings.autoBackup}
                  onChange={(e) => setSettings({ ...settings, autoBackup: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="autoBackup" className="text-slate-300">
                  Enable Automatic Backups
                </label>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </div>
    </div>
  );
}
