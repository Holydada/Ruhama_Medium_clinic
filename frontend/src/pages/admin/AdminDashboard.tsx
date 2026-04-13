import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { adminModuleSubnav } from '../../navigation/moduleSubnavItems';
import { formatDate, formatCurrency } from '../../lib/utils';
import { api, getStoredAuth } from '../../lib/api';
import { toast } from '../../lib/toast';
import { StaffUserModal, type StaffModalUser } from '../../components/admin/StaffUserModal';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  roleRaw: string;
  department?: string;
  status: 'active' | 'on-leave' | 'inactive';
  email: string;
  phone: string;
  joinedDate: string;
}

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStaff: 0,
    activeStaff: 0,
    totalPatients: 0,
    todayRevenue: 0,
    pendingApprovals: 0,
  });
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<
    Array<{ id: string; type: string; name: string; role: string; date: string }>
  >([]);
  const [systemAlerts, setSystemAlerts] = useState<
    Array<{ id: string; type: 'warning' | 'info'; message: string; time: string }>
  >([]);
  const [recentActivities, setRecentActivities] = useState<
    Array<{ id: string; action: string; user: string; time: string }>
  >([]);
  const [staffSearch, setStaffSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ userId: string; kind: 'approve' | 'reject' } | null>(null);
  const [staffModal, setStaffModal] = useState<{ user: StaffModalUser; mode: 'view' | 'edit' } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      console.log('[AdminDashboard] Loading dashboard data...');
      
      const [systemResp, usersResp, pendingResp, logsResp] = await Promise.all([
        api.get('/admin/stats/system'),
        api.get('/admin/users', { params: { limit: '200' } }),
        api.get('/admin/users/pending'),
        api.get('/admin/audit-logs', { params: { limit: 20 } }),
      ]);

      console.log('[AdminDashboard] System stats:', systemResp.data);
      console.log('[AdminDashboard] Users response:', usersResp.data);
      console.log('[AdminDashboard] Pending users:', pendingResp.data);
      console.log('[AdminDashboard] Audit logs:', logsResp.data);

      const system = systemResp.data?.data || {};
      setStats({
        totalStaff: Number(system.users?.total || 0),
        activeStaff: Number(system.users?.active || 0),
        totalPatients: Number(system.patients?.total || 0),
        todayRevenue: Number(system.revenue?.today || 0),
        pendingApprovals: Number(system.users?.pending || 0),
      });

      const usersRows = usersResp.data?.data?.users || [];
      console.log('[AdminDashboard] Processing', usersRows.length, 'users');
      
      setStaffMembers(
        usersRows.map((u: any) => ({
          id: u.id,
          name: u.fullName || 'Unnamed User',
          role: String(u.role || 'STAFF').replace(/_/g, ' '),
          roleRaw: String(u.role || ''),
          department: u.department || '',
          status: u.isActive ? 'active' : 'inactive',
          email: u.email || '-',
          phone: u.phone || '-',
          joinedDate: u.createdAt || new Date().toISOString(),
        }))
      );

      const pendingRows = pendingResp.data?.data || [];
      setPendingApprovals(
        pendingRows.map((u: any) => ({
          id: u.id,
          type: 'Staff Registration',
          name: u.fullName || 'Unnamed User',
          role: String(u.role || 'STAFF').replace(/_/g, ' '),
          date: u.createdAt || new Date().toISOString(),
        }))
      );

      const logsRows = logsResp.data?.data?.logs || [];
      setRecentActivities(
        logsRows.map((log: any) => ({
          id: log.id,
          action: String(log.action || 'SYSTEM_EVENT').replace(/_/g, ' '),
          user: log.user?.fullName || log.user?.email || 'System',
          time: log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Unknown time',
        }))
      );

      const alerts: Array<{ id: string; type: 'warning' | 'info'; message: string; time: string }> = [];
      if (Number(system.users?.pending || 0) > 0) {
        alerts.push({
          id: 'pending-users',
          type: 'warning',
          message: `${system.users.pending} staff account(s) are waiting for approval`,
          time: 'Live',
        });
      }
      alerts.push({
        id: 'audit-live',
        type: 'info',
        message: 'Audit feed and admin metrics are synced with backend',
        time: 'Live',
      });
      setSystemAlerts(alerts);
      
      console.log('[AdminDashboard] Dashboard loaded successfully');
    } catch (error: any) {
      console.error('[AdminDashboard] Failed to load dashboard:', error);
      console.error('[AdminDashboard] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load admin dashboard.';
      toast.error(errorMessage);
      
      setSystemAlerts([
        {
          id: 'load-failed',
          type: 'warning',
          message: `Unable to load live admin dashboard data: ${errorMessage}`,
          time: 'Now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const approveUser = async (userId: string) => {
    setPendingAction({ userId, kind: 'approve' });
    try {
      console.log('[AdminDashboard] Approving user:', userId);
      const resp = await api.post(`/admin/users/${userId}/approve`);
      console.log('[AdminDashboard] Approve response:', resp.data);
      
      // Extract message from backend response
      const message = resp.data?.message || 'User approved successfully. First login OTP sent via email.';
      toast.success(message);
      await loadDashboard();
    } catch (err: unknown) {
      console.error('[AdminDashboard] Approve error:', err);
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to approve user.';
      toast.error(msg);
    } finally {
      setPendingAction(null);
    }
  };

  const rejectUser = async (userId: string, displayName: string) => {
    if (!window.confirm(`Reject and remove registration for ${displayName}? This cannot be undone.`)) return;
    setPendingAction({ userId, kind: 'reject' });
    try {
      console.log('[AdminDashboard] Rejecting user:', userId);
      const resp = await api.post(`/admin/users/${userId}/reject`);
      console.log('[AdminDashboard] Reject response:', resp.data);
      
      const message = resp.data?.message || 'Registration rejected.';
      toast.success(message);
      await loadDashboard();
    } catch (err: unknown) {
      console.error('[AdminDashboard] Reject error:', err);
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to reject user.';
      toast.error(msg);
    } finally {
      setPendingAction(null);
    }
  };

  const toModalUser = (s: StaffMember): StaffModalUser => ({
    id: s.id,
    name: s.name,
    email: s.email,
    phone: s.phone,
    roleLabel: s.role,
    roleRaw: s.roleRaw,
    department: s.department,
    joinedDate: s.joinedDate,
  });

  const deleteStaffMember = async (s: StaffMember) => {
    const selfId = getStoredAuth()?.user?.id;
    if (s.id === selfId) {
      toast.error('You cannot delete your own account.');
      return;
    }

    // Check if we have a valid token before attempting delete
    const auth = getStoredAuth();
    if (!auth?.accessToken) {
      toast.error('Session expired. Please log in again.');
      return;
    }

    if (
      !window.confirm(
        `Remove user ${s.name} (${s.email})? If they have clinical or billing history, they will be deactivated instead of deleted.`
      )
    ) {
      return;
    }
    setDeletingId(s.id);
    try {
      const resp = await api.delete(`/admin/users/${s.id}`);
      console.log('[AdminDashboard] Delete response:', resp.data);
      
      const result = resp.data?.data;
      const message = result?.message || 'User removed successfully.';

      if (result?.mode === 'deactivated') {
        toast.info(message);
      } else {
        toast.success(message);
      }

      await loadDashboard();
    } catch (err: any) {
      console.error('[AdminDashboard] Delete error:', err);
      console.error('[AdminDashboard] Error response:', err?.response?.data);
      const msg = err?.response?.data?.error || err.message || 'Failed to remove user.';
      toast.error(typeof msg === 'string' ? msg : 'Failed to remove user. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredStaff = useMemo(
    () =>
      staffMembers.filter((s) => {
        const q = staffSearch.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.role.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
        );
      }),
    [staffMembers, staffSearch]
  );

  const getStatusBadge = (status: StaffMember['status']) => {
    const variants = {
      active: { variant: 'success' as const, label: 'Active' },
      'on-leave': { variant: 'warning' as const, label: 'On Leave' },
      inactive: { variant: 'gray' as const, label: 'Inactive' },
    };
    const { variant, label } = variants[status];
    return <Badge variant={variant} size="sm">{label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-slate-400 mt-1">
              {formatDate(new Date())} • System Overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => void loadDashboard()} isLoading={isLoading}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/admin/staff')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Add Staff
            </Button>
          </div>
        </div>

        <ModuleSubnav items={adminModuleSubnav} ariaLabel="Admin sections" />

        {/* System Alerts */}
        {systemAlerts.length > 0 && (
          <div className="space-y-2">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  alert.type === 'warning'
                    ? 'bg-amber-500/5 border-amber-500/20'
                    : 'bg-sky-500/5 border-sky-500/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  {alert.type === 'warning' ? (
                    <svg className="h-6 w-6 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-sky-500 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-50">{alert.message}</p>
                    <p className="text-xs text-gray-600 dark:text-slate-400">{alert.time}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Dismiss
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Total Staff</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-slate-50 mt-1">{stats.totalStaff}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">{stats.activeStaff} active</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-slate-50 mt-1">{stats.totalPatients.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">Live patient registry</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Today's Revenue</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(stats.todayRevenue)}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">Paid transactions today</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Approvals */}
          <div className="lg:col-span-2">
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pending Approvals</CardTitle>
                    <CardDescription>{pendingApprovals.length} items need your attention</CardDescription>
                  </div>
                  <Badge variant="warning">{stats.pendingApprovals}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingApprovals.map((approval) => (
                  <div
                    key={approval.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/40 hover:bg-gray-100 dark:hover:bg-slate-900/60 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 flex items-center justify-center">
                        <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-slate-50">{approval.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="info" size="sm">{approval.type}</Badge>
                          <span className="text-xs text-gray-600 dark:text-slate-400">{approval.role}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">{formatDate(approval.date)}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={pendingAction?.userId === approval.id}
                        isLoading={pendingAction?.userId === approval.id && pendingAction.kind === 'approve'}
                        onClick={() => void approveUser(approval.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pendingAction?.userId === approval.id}
                        isLoading={pendingAction?.userId === approval.id && pendingAction.kind === 'reject'}
                        onClick={() => void rejectUser(approval.id, approval.name)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Doctors', count: staffMembers.filter((s) => s.role.includes('DOCTOR')).length, colorClass: 'text-emerald-600 dark:text-emerald-400' },
                  { name: 'Nurses', count: staffMembers.filter((s) => s.role.includes('NURSE')).length, colorClass: 'text-sky-600 dark:text-sky-400' },
                  { name: 'Pharmacists', count: staffMembers.filter((s) => s.role.includes('PHARMACY') || s.role.includes('PHARMACIST')).length, colorClass: 'text-violet-600 dark:text-violet-400' },
                  { name: 'Lab Technicians', count: staffMembers.filter((s) => s.role.includes('LAB')).length, colorClass: 'text-amber-600 dark:text-amber-400' },
                  { name: 'Receptionists', count: staffMembers.filter((s) => s.role.includes('RECEPTION')).length, colorClass: 'text-rose-600 dark:text-rose-400' },
                ].map((dept, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 rounded-xl">
                    <span className="text-sm text-gray-700 dark:text-slate-300">{dept.name}</span>
                    <span className={`text-lg font-bold ${dept.colorClass}`}>{dept.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Staff Management */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Staff Management</CardTitle>
                <CardDescription>Manage clinic staff members</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="search"
                  placeholder="Search staff..."
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-gray-900 dark:text-slate-50 placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none text-sm"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-800">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Contact</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Joined</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="border-b border-gray-200 dark:border-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-100 to-violet-100 dark:from-sky-500/20 dark:to-violet-500/20 flex items-center justify-center text-sm font-bold text-sky-700 dark:text-slate-200">
                            {staff.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm text-gray-900 dark:text-slate-200 font-medium">{staff.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="info" size="sm">{staff.role}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-xs text-gray-600 dark:text-slate-400">
                          <div>{staff.email}</div>
                          <div>{staff.phone}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 dark:text-slate-400">{formatDate(staff.joinedDate)}</td>
                      <td className="py-4 px-4">{getStatusBadge(staff.status)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View"
                            onClick={() => setStaffModal({ user: toModalUser(staff), mode: 'view' })}
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Edit"
                            onClick={() => setStaffModal({ user: toModalUser(staff), mode: 'edit' })}
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Remove user"
                            className="text-red-400 hover:text-red-300"
                            isLoading={deletingId === staff.id}
                            disabled={deletingId !== null && deletingId !== staff.id}
                            onClick={() => void deleteStaffMember(staff)}
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredStaff.length === 0 && (
                <p className="text-sm text-gray-600 dark:text-slate-400 p-4">No staff records found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>System activity log</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 rounded-xl">
                  <div className="h-2 w-2 rounded-full bg-sky-500 dark:bg-sky-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-slate-200">{activity.action}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-500">by {activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-slate-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {staffModal && (
        <StaffUserModal
          user={staffModal.user}
          mode={staffModal.mode}
          onClose={() => setStaffModal(null)}
          onUpdated={() => void loadDashboard()}
        />
      )}
    </div>
  );
};
