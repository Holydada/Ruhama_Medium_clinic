import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle, XCircle, User } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { adminModuleSubnav } from '../../navigation/moduleSubnavItems';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const UserApproval: React.FC = () => {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const loadPendingUsers = async () => {
    setIsLoading(true);
    try {
      const resp = await api.get('/admin/users/pending');
      const rows = resp.data?.data || [];
      const mapped: PendingUser[] = rows.map((u: any) => ({
        id: u.id,
        name: u.fullName || 'Unnamed User',
        email: u.email,
        role: (u.role || 'STAFF').replace(/_/g, ' '),
        requestDate: (u.createdAt || new Date().toISOString()).slice(0, 10),
        status: u.isApproved ? 'approved' : 'pending',
      }));
      setUsers(mapped.filter((u) => u.status === 'pending'));
    } catch (error) {
      console.error('Failed to load pending users', error);
      toast.error('Failed to load pending users.');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPendingUsers();
  }, []);

  const handleApprove = async (id: string) => {
    setActioningId(id);
    try {
      await api.post(`/admin/users/${id}/approve`);
      toast.success('User approved. Verification email sent.');
      await loadPendingUsers();
    } catch (error: any) {
      console.error('Approval failed', error);
      toast.error(error?.response?.data?.error || 'Failed to approve user.');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActioningId(id);
    try {
      await api.post(`/admin/users/${id}/reject`);
      toast.success('User rejected.');
      await loadPendingUsers();
    } catch (error: any) {
      console.error('Rejection failed', error);
      toast.error(error?.response?.data?.error || 'Failed to reject user.');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Approval</h1>
        <Button variant="outline" onClick={() => void loadPendingUsers()} isLoading={isLoading}>
          Refresh
        </Button>
      </div>

      <ModuleSubnav items={adminModuleSubnav} ariaLabel="Admin sections" />

      <div className="space-y-4">
        {users.length === 0 && !isLoading && (
          <Card className="p-6">
            <p className="text-sm text-gray-600">No pending user approvals.</p>
          </Card>
        )}
        {users.map(user => (
          <Card key={user.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="info">{user.role}</Badge>
                    <span className="text-xs text-gray-500">Requested: {user.requestDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {user.status === 'pending' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => void handleApprove(user.id)}
                      isLoading={actioningId === user.id}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => void handleReject(user.id)}
                      isLoading={actioningId === user.id}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                {user.status !== 'pending' && (
                  <Badge variant={user.status === 'approved' ? 'success' : 'error'}>
                    {user.status}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
