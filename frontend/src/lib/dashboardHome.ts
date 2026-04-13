/** Default home path after login for each staff role (matches Login redirect). */
export function getHomePathForRole(role: string | undefined): string {
  const r = (role || '').toUpperCase().replace(/-/g, '_');
  switch (r) {
    case 'RECEPTIONIST':
      return '/receptionist-dashboard';
    case 'DOCTOR':
      return '/doctor-dashboard';
    case 'NURSE':
      return '/nurse-dashboard';
    case 'PHARMACIST':
      return '/pharmacist-dashboard';
    case 'LAB_TECH':
      return '/lab-dashboard';
    case 'FINANCE':
      return '/finance-dashboard';
    case 'EMERGENCY':
      return '/emergency-dashboard';
    case 'INJECTION_ROOM':
      return '/injection-dashboard';
    case 'SUPER_ADMIN':
    case 'ADMIN':
      return '/admin-dashboard';
    case 'PATIENT':
      return '/patient-dashboard';
    default:
      return '/login';
  }
}

export function formatRoleLabel(role: string | undefined): string {
  if (!role) return 'User';
  return role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
