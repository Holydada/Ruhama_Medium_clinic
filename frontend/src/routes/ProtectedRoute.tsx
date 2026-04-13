import { Navigate } from 'react-router-dom';
import { getStoredAuth } from '../lib/api';
import { normalizeStaffRole } from '../lib/staffRole';
import { ForbiddenPage } from '../pages/ForbiddenPage';

export const ProtectedRoute = ({
  children,
  roles,
}: {
  children: JSX.Element;
  roles: string[];
}) => {
  const auth = getStoredAuth();
  const userRole = auth?.user?.role;
  
  // Only log on actual issues, not every render
  if (!auth?.accessToken || !userRole) {
    console.warn('[ProtectedRoute] No auth or role - redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  const normalized = normalizeStaffRole(userRole);
  const allowed = roles.some((r) => normalizeStaffRole(r) === normalized);
  
  if (!allowed) {
    console.warn('[ProtectedRoute] Access denied:', {
      userRole: normalized,
      requiredRoles: roles.map(normalizeStaffRole),
    });
    return <ForbiddenPage />;
  }
  
  return children;
};
