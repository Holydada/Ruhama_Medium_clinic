/** Canonical role string for comparisons (API may vary slightly). */
export function normalizeStaffRole(role: string | undefined): string {
  return (role ?? '').toUpperCase().replace(/-/g, '_').trim();
}
