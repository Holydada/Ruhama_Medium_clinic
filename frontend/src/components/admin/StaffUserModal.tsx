import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { api } from '../../lib/api';
import { getStoredAuth } from '../../lib/api';
import { toast } from '../../lib/toast';

export type StaffModalUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleLabel: string;
  roleRaw: string;
  department?: string;
  employmentType?: string | null;
  isActive?: boolean;
  isApproved?: boolean;
  joinedDate?: string;
};

type Mode = 'view' | 'edit';

type Props = {
  user: StaffModalUser | null;
  mode: Mode | null;
  onClose: () => void;
  onUpdated: () => void;
};

export function StaffUserModal({ user, mode, onClose, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [employmentType, setEmploymentType] = useState('');

  useEffect(() => {
    if (!user || !mode) return;
    if (mode === 'edit') {
      setLoading(true);
      api
        .get(`/admin/users/${user.id}`)
        .then((resp) => {
          const u = resp.data?.data;
          if (u) {
            setFullName(u.fullName || '');
            setPhone(u.phone || '');
            setDepartment(u.department || '');
            setEmploymentType(u.employmentType || '');
          }
        })
        .catch(() => {
          setFullName(user.name);
          setPhone(user.phone === '-' ? '' : user.phone);
          setDepartment(user.department || '');
          setEmploymentType(user.employmentType || '');
        })
        .finally(() => setLoading(false));
    } else {
      setFullName(user.name);
      setPhone(user.phone === '-' ? '' : user.phone);
      setDepartment(user.department || '');
      setEmploymentType(user.employmentType || '');
    }
  }, [user, mode]);

  if (!user || !mode) return null;

  const save = async () => {
    setLoading(true);
    try {
      await api.patch(`/admin/users/${user.id}`, {
        fullName,
        phone: phone || null,
        department: department || null,
        employmentType: employmentType || null,
      });
      toast.success('User updated.');
      onUpdated();
      onClose();
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Update failed';
      toast.error(typeof msg === 'string' ? msg : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const selfId = getStoredAuth()?.user?.id;
  const isSelf = selfId === user.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" role="dialog" aria-modal>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-50">{mode === 'view' ? 'Staff profile' : 'Edit staff'}</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-200 text-sm">
            Close
          </button>
        </div>
        <div className="p-6 space-y-4">
          {mode === 'view' ? (
            <>
              <div>
                <p className="text-xs text-slate-500">Name</p>
                <p className="text-slate-100">{user.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-slate-100">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="text-slate-100">{user.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Role</p>
                <p className="text-slate-100">{user.roleLabel}</p>
              </div>
              {user.department && (
                <div>
                  <p className="text-xs text-slate-500">Department</p>
                  <p className="text-slate-100">{user.department}</p>
                </div>
              )}
              <p className="text-xs text-slate-500">
                {isSelf ? 'You are viewing your own account.' : 'Use Edit to change contact details.'}
              </p>
            </>
          ) : (
            <>
              <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
              <Select label="Employment type" value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
                <option value="">—</option>
                <option value="FULL_TIME">Full time</option>
                <option value="PART_TIME">Part time</option>
              </Select>
              <p className="text-xs text-slate-500">Email and role are not changed here. Use Staff Management for role changes.</p>
            </>
          )}
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {mode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {mode === 'edit' && (
            <Button variant="primary" onClick={() => void save()} isLoading={loading} disabled={isSelf}>
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
