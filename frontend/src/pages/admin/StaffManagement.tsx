import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Search, Lock, Unlock, Users, Trash2 } from 'lucide-react';
import { toast } from '../../lib/toast';
import { api } from '../../lib/api';
import { getStoredAuth } from '../../lib/api';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { adminModuleSubnav } from '../../navigation/moduleSubnavItems';
import { useEffect } from 'react';
import { StaffUserModal, type StaffModalUser } from '../../components/admin/StaffUserModal';

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  roleRaw: string;
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastLogin: string;
  specialization?: string;
}

const ROLE_OPTIONS = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'DOCTOR', label: 'Doctor' },
  { value: 'NURSE', label: 'Nurse' },
  { value: 'RECEPTIONIST', label: 'Receptionist' },
  { value: 'PHARMACIST', label: 'Pharmacist' },
  { value: 'LAB_TECH', label: 'Lab Technician' },
  { value: 'FINANCE', label: 'Finance' },
  { value: 'EMERGENCY', label: 'Emergency' },
  { value: 'INJECTION_ROOM', label: 'Injection Room' },
] as const;

export const StaffManagement: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [roleEditTarget, setRoleEditTarget] = useState<Staff | null>(null);
  const [selectedRoleForUpdate, setSelectedRoleForUpdate] = useState('');
  const [staffModal, setStaffModal] = useState<{ user: StaffModalUser; mode: 'view' | 'edit' } | null>(null);

  const loadStaff = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | boolean> = { limit: '200' };
      if (filterRole !== 'all') {
        params.role = filterRole.toUpperCase();
      }
      if (filterStatus !== 'all') {
        params.isActive = filterStatus === 'active';
      }
      const resp = await api.get('/admin/users', { params });
      const rows = resp.data?.data?.users || [];
      setStaff(
        rows.map((u: any) => ({
          id: u.id,
          name: u.fullName,
          email: u.email,
          phone: u.phone || '',
          role: (u.role || 'RECEPTIONIST').toLowerCase(),
          roleRaw: u.role || 'RECEPTIONIST',
          department: u.department || 'N/A',
          status: u.isActive ? 'active' : 'inactive',
          joinDate: (u.createdAt || '').slice(0, 10),
          lastLogin: u.lastLogin ? String(u.lastLogin).slice(0, 16).replace('T', ' ') : 'Never',
          specialization: undefined,
        }))
      );
    } catch (_error) {
      toast.error('Failed to load staff list.');
      setStaff([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadStaff();
  }, [filterRole, filterStatus]);

  useEffect(() => {
    const r = searchParams.get('role');
    if (!r) return;
    setFilterRole(r.toLowerCase());
  }, [searchParams]);

  const getRoleBadgeVariant = (role: string): 'success' | 'info' | 'warning' | 'error' | 'gray' => {
    switch (role) {
      case 'doctor': return 'success';
      case 'nurse': return 'info';
      case 'pharmacist': return 'warning';
      case 'admin': return 'error';
      default: return 'gray';
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'suspended': return 'error';
      default: return 'warning';
    }
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm);
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: staff.length,
    active: staff.filter(s => s.status === 'active').length,
    doctors: staff.filter(s => s.role === 'doctor').length,
    nurses: staff.filter(s => s.role === 'nurse').length
  };

  const handleToggleStatus = async (member: Staff) => {
    const next = member.status !== 'active';
    setActioningId(member.id);
    try {
      await api.patch(`/admin/users/${member.id}/status`, { isActive: next });
      toast.success(`Staff member ${next ? 'activated' : 'deactivated'}.`);
      await loadStaff();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to update staff status.');
    } finally {
      setActioningId(null);
    }
  };

  const handlePromoteRole = async (member: Staff, role: string) => {
    setActioningId(member.id);
    try {
      await api.patch(`/admin/users/${member.id}/role`, { role });
      toast.success('Staff role updated successfully.');
      await loadStaff();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to update staff role.');
    } finally {
      setActioningId(null);
    }
  };

  const openRoleEditor = (member: Staff) => {
    setRoleEditTarget(member);
    setSelectedRoleForUpdate(member.roleRaw);
  };

  const toModalUser = (member: Staff): StaffModalUser => ({
    id: member.id,
    name: member.name,
    email: member.email,
    phone: member.phone || '-',
    roleLabel: member.role.replace(/_/g, ' '),
    roleRaw: member.roleRaw,
    department: member.department === 'N/A' ? '' : member.department,
    joinedDate: member.joinDate,
  });

  const deleteStaff = async (member: Staff) => {
    const selfId = getStoredAuth()?.user?.id;
    if (member.id === selfId) {
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
        `Remove ${member.name}? Accounts with clinical or billing history will be deactivated instead of deleted.`
      )
    )
      return;
    setActioningId(member.id);
    try {
      const resp = await api.delete(`/admin/users/${member.id}`);
      const result = resp.data?.data;
      const message = result?.message || 'User removed.';
      
      if (result?.mode === 'deactivated') {
        toast.info(message);
      } else {
        toast.success(message);
      }
      
      await loadStaff();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(typeof msg === 'string' ? msg : 'Delete failed. Please try again.');
      console.error('Delete user error:', e);
    } finally {
      setActioningId(null);
    }
  };

  const submitRoleUpdate = async () => {
    if (!roleEditTarget || !selectedRoleForUpdate) return;
    await handlePromoteRole(roleEditTarget, selectedRoleForUpdate);
    setRoleEditTarget(null);
    setSelectedRoleForUpdate('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage clinic staff and permissions</p>
        </div>
        <Button variant="outline" onClick={() => void loadStaff()} isLoading={isLoading}>
          Refresh
        </Button>
      </div>

      <ModuleSubnav items={adminModuleSubnav} ariaLabel="Admin sections" />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">✓</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Doctors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.doctors}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xl">👨‍⚕️</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nurses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.nurses}</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              <span className="text-pink-600 text-xl">👩‍⚕️</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      {roleEditTarget && (
        <Card className="p-4 mb-6 border-amber-300 bg-amber-50">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-amber-900">Update Staff Role</p>
              <p className="text-xs text-amber-800">
                {roleEditTarget.name} ({roleEditTarget.email})
              </p>
            </div>
            <Select
              label="New Role"
              value={selectedRoleForUpdate}
              onChange={(e) => setSelectedRoleForUpdate(e.target.value)}
            >
              {ROLE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="primary" onClick={() => void submitRoleUpdate()} isLoading={actioningId === roleEditTarget.id}>
                Confirm Role Change
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setRoleEditTarget(null);
                  setSelectedRoleForUpdate('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            icon={Search}
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            label="Role"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="receptionist">Receptionist</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="lab_tech">Lab Technician</option>
            <option value="finance">Finance</option>
            <option value="emergency">Emergency</option>
            <option value="injection_room">Injection Room</option>
          </Select>

          <Select
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </Select>
        </div>
      </Card>

      {/* Staff Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{member.name}</div>
                    {member.specialization && (
                      <div className="text-xs text-gray-500">{member.specialization}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.email}</div>
                    <div className="text-xs text-gray-500">{member.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getRoleBadgeVariant(member.role)}>
                      {member.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {member.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(member.status)}>
                      {member.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {member.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStaffModal({ user: toModalUser(member), mode: 'view' })}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStaffModal({ user: toModalUser(member), mode: 'edit' })}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRoleEditor(member)}
                        isLoading={actioningId === member.id}
                      >
                        Role
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void handleToggleStatus(member)}
                        isLoading={actioningId === member.id}
                      >
                        {member.status === 'active' ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200"
                        onClick={() => void deleteStaff(member)}
                        isLoading={actioningId === member.id}
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
      </Card>

      {filteredStaff.length === 0 && (
        <Card className="p-12 text-center mt-6">
          <p className="text-gray-500">No staff members found</p>
        </Card>
      )}

      {staffModal && (
        <StaffUserModal
          user={staffModal.user}
          mode={staffModal.mode}
          onClose={() => setStaffModal(null)}
          onUpdated={() => void loadStaff()}
        />
      )}
    </div>
  );
};
