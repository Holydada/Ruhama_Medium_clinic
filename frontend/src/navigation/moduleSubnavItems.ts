import type { SubnavItem } from '../components/layout/ModuleSubnav';

/** Single source of truth for module section links (dashboards + all sub-pages). */
export const adminModuleSubnav: SubnavItem[] = [
  { to: '/admin-dashboard', label: 'Overview' },
  { to: '/admin/staff', label: 'Staff' },
  { to: '/admin/approvals', label: 'Approvals' },
  { to: '/admin/audit', label: 'Audit' },
  { to: '/admin/backup', label: 'Backup' },
  { to: '/admin/settings', label: 'Settings' },
  { to: '/admin/roles', label: 'Roles' },
  { to: '/admin/reports', label: 'Reports' },
];

export const financeModuleSubnav: SubnavItem[] = [
  { to: '/finance-dashboard', label: 'Overview' },
  { to: '/finance/transactions', label: 'Transactions' },
  { to: '/finance/invoices', label: 'Invoices' },
  { to: '/finance/expenses', label: 'Expenses' },
  { to: '/finance/analytics', label: 'Analytics' },
  { to: '/finance/audit', label: 'Audit' },
  { to: '/finance/revenue', label: 'Revenue' },
];

export const labModuleSubnav: SubnavItem[] = [
  { to: '/lab-dashboard', label: 'Overview' },
  { to: '/lab/test-queue', label: 'Test queue' },
  { to: '/lab/samples', label: 'Samples' },
  { to: '/lab/quality', label: 'Quality' },
  { to: '/lab/equipment', label: 'Equipment' },
  { to: '/lab/catalog', label: 'Catalog' },
  { to: '/lab/verification', label: 'Verification' },
];

export const pharmacyModuleSubnav: SubnavItem[] = [
  { to: '/pharmacist-dashboard', label: 'Overview' },
  { to: '/pharmacy/stock', label: 'Stock' },
  { to: '/pharmacy/stock-entry', label: 'Stock entry' },
  { to: '/pharmacy/stock-adjustment', label: 'Adjustments' },
  { to: '/pharmacy/prescription-queue', label: 'Rx queue' },
  { to: '/pharmacy/inventory-alerts', label: 'Alerts' },
  { to: '/pharmacy/sales-report', label: 'Sales' },
  { to: '/pharmacy/drug-info', label: 'Drug info' },
  { to: '/pharmacy/expiry', label: 'Expiry' },
  { to: '/pharmacy/batches', label: 'Batches' },
];

export const receptionModuleSubnav: SubnavItem[] = [
  { to: '/receptionist-dashboard', label: 'Overview' },
  { to: '/reception/new-patient', label: 'New patient' },
  { to: '/reception/repeat-visit', label: 'Repeat visit' },
  { to: '/reception/patients', label: 'Patients' },
  { to: '/reception/doctor-assignment', label: 'Doctor' },
  { to: '/reception/payment', label: 'Payment' },
  { to: '/reception/queue', label: 'Queue' },
  { to: '/reception/services', label: 'Services' },
  { to: '/reception/appointments', label: 'Appointments' },
  { to: '/reception/ultrasound', label: 'Ultrasound' },
];

export const nurseModuleSubnav: SubnavItem[] = [
  { to: '/nurse-dashboard', label: 'Overview' },
  { to: '/nurse/triage', label: 'Triage' },
  { to: '/nurse/vitals', label: 'Vitals' },
  { to: '/nurse/injections', label: 'Injections' },
  { to: '/nurse/notes', label: 'Notes' },
  { to: '/nurse/handover', label: 'Handover' },
  { to: '/staff-chat', label: 'Staff chat' },
];

/** Injection-only staff: links must match ProtectedRoute roles for those paths. */
export const injectionRoomModuleSubnav: SubnavItem[] = [
  { to: '/injection-dashboard', label: 'Dashboard' },
  { to: '/staff-chat', label: 'Staff chat' },
];
