import { Routes, Route } from 'react-router-dom';
import { Landing } from '../pages/Landing';
import { LoginPage } from '../pages/Login';
import { Register } from '../pages/Register';
import { ForgotPassword } from '../pages/ForgotPassword';
import { VerifyEmailPage } from '../pages/VerifyEmail';
import { VerifyEmailChange } from '../pages/VerifyEmailChange';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthenticatedShell } from './AuthenticatedShell';
import * as P from './lazyPages';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/verify-email-change" element={<VerifyEmailChange />} />
      <Route path="/register-patient" element={<P.RegisterPatient />} />

      <Route element={<AuthenticatedShell />}>
      <Route
        path="/reception"
        element={
          <ProtectedRoute roles={['RECEPTIONIST', 'SUPER_ADMIN']}>
            <P.ReceptionDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist-dashboard"
        element={
          <ProtectedRoute roles={['RECEPTIONIST', 'SUPER_ADMIN']}>
            <P.ReceptionDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reception/new-patient"
        element={
          <ProtectedRoute roles={['RECEPTIONIST', 'SUPER_ADMIN']}>
            <P.NewPatientRegistration />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reception/repeat-visit"
        element={
          <ProtectedRoute roles={['RECEPTIONIST', 'SUPER_ADMIN']}>
            <P.RepeatVisit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reception/patients"
        element={
          <ProtectedRoute roles={['RECEPTIONIST', 'SUPER_ADMIN']}>
            <P.PatientManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reception/doctor-assignment"
        element={
          <ProtectedRoute roles={['RECEPTIONIST', 'SUPER_ADMIN']}>
            <P.DoctorAssignment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reception/payment"
        element={
          <ProtectedRoute roles={['RECEPTIONIST', 'SUPER_ADMIN', 'FINANCE']}>
            <P.PaymentCollection patientName="Walk-in Patient" cardNumber="N/A" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reception/ultrasound"
        element={
          <ProtectedRoute roles={['RECEPTIONIST', 'SUPER_ADMIN']}>
            <P.UltrasoundBooking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reception/queue"
        element={
          <ProtectedRoute roles={['RECEPTIONIST', 'SUPER_ADMIN']}>
            <P.QueueManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reception/services"
        element={
          <ProtectedRoute roles={['RECEPTIONIST', 'SUPER_ADMIN']}>
            <P.ServiceSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reception/appointments"
        element={
          <ProtectedRoute roles={['RECEPTIONIST', 'SUPER_ADMIN']}>
            <P.AppointmentScheduler />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN']}>
            <P.AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/staff"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN']}>
            <P.StaffManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/approvals"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN']}>
            <P.UserApproval />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN']}>
            <P.AuditLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/backup"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN']}>
            <P.BackupRestore />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN']}>
            <P.SystemSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/roles"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN']}>
            <P.RoleManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN']}>
            <P.Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-log"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN']}>
            <P.AuditLog />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor-dashboard"
        element={
          <ProtectedRoute roles={['DOCTOR', 'SUPER_ADMIN']}>
            <P.DoctorEncounterWorkspace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/queue"
        element={
          <ProtectedRoute roles={['DOCTOR', 'SUPER_ADMIN']}>
            <P.DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/results"
        element={
          <ProtectedRoute roles={['DOCTOR', 'SUPER_ADMIN']}>
            <P.ResultsViewer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/certificates/sick-leave"
        element={
          <ProtectedRoute roles={['DOCTOR', 'SUPER_ADMIN']}>
            <P.SickLeaveForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/certificates/medical"
        element={
          <ProtectedRoute roles={['DOCTOR', 'SUPER_ADMIN']}>
            <P.MedicalCertificateForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/certificates/list/:patientId"
        element={
          <ProtectedRoute roles={['DOCTOR', 'SUPER_ADMIN']}>
            <P.CertificateList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/encounter/:visitId"
        element={
          <ProtectedRoute roles={['DOCTOR', 'SUPER_ADMIN']}>
            <P.EncounterForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/prescription"
        element={
          <ProtectedRoute roles={['DOCTOR', 'SUPER_ADMIN']}>
            <P.PrescriptionForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/lab-order"
        element={
          <ProtectedRoute roles={['DOCTOR', 'SUPER_ADMIN']}>
            <P.LabOrderForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/injection-order"
        element={
          <ProtectedRoute roles={['DOCTOR', 'SUPER_ADMIN']}>
            <P.InjectionOrderForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/referral"
        element={
          <ProtectedRoute roles={['DOCTOR', 'SUPER_ADMIN']}>
            <P.ReferralForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patient/:patientId"
        element={
          <ProtectedRoute roles={['DOCTOR', 'SUPER_ADMIN']}>
            <P.PatientChart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/orders"
        element={
          <ProtectedRoute roles={['DOCTOR', 'SUPER_ADMIN']}>
            <P.OrderManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/nurse-dashboard"
        element={
          <ProtectedRoute roles={['NURSE', 'SUPER_ADMIN']}>
            <P.NurseDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nurse/triage"
        element={
          <ProtectedRoute roles={['NURSE', 'SUPER_ADMIN']}>
            <P.PatientMonitoring />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nurse/vitals"
        element={
          <ProtectedRoute roles={['NURSE', 'SUPER_ADMIN']}>
            <P.NurseVitalsWorkspace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nurse/vital-signs-form"
        element={
          <ProtectedRoute roles={['NURSE', 'SUPER_ADMIN']}>
            <P.VitalSignsForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nurse/observation-board"
        element={
          <ProtectedRoute roles={['NURSE', 'SUPER_ADMIN']}>
            <P.ObservationBoard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/injection-dashboard"
        element={
          <ProtectedRoute roles={['NURSE', 'SUPER_ADMIN', 'INJECTION_ROOM']}>
            <P.InjectionAdministration />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nurse/injections"
        element={
          <ProtectedRoute roles={['NURSE', 'SUPER_ADMIN', 'INJECTION_ROOM']}>
            <P.InjectionAdministration />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nurse/injection-queue"
        element={
          <ProtectedRoute roles={['NURSE', 'SUPER_ADMIN', 'INJECTION_ROOM']}>
            <P.InjectionQueue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nurse/injection-administration/:orderId"
        element={
          <ProtectedRoute roles={['NURSE', 'SUPER_ADMIN', 'INJECTION_ROOM']}>
            <P.InjectionAdministration />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nurse/notes"
        element={
          <ProtectedRoute roles={['NURSE', 'SUPER_ADMIN']}>
            <P.NursingNotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nurse/handover"
        element={
          <ProtectedRoute roles={['NURSE', 'SUPER_ADMIN']}>
            <P.ShiftHandover />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pharmacist-dashboard"
        element={
          <ProtectedRoute roles={['PHARMACIST', 'SUPER_ADMIN']}>
            <P.PharmacyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pharmacy/queue"
        element={
          <ProtectedRoute roles={['PHARMACIST', 'SUPER_ADMIN']}>
            <P.PharmacyQueue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pharmacy/stock"
        element={
          <ProtectedRoute roles={['PHARMACIST', 'SUPER_ADMIN']}>
            <P.StockManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pharmacy/stock-entry"
        element={
          <ProtectedRoute roles={['PHARMACIST', 'SUPER_ADMIN']}>
            <P.StockEntry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pharmacy/stock-adjustment"
        element={
          <ProtectedRoute roles={['PHARMACIST', 'SUPER_ADMIN']}>
            <P.StockAdjustment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pharmacy/inventory-alerts"
        element={
          <ProtectedRoute roles={['PHARMACIST', 'SUPER_ADMIN']}>
            <P.InventoryAlerts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pharmacy/prescription-queue"
        element={
          <ProtectedRoute roles={['PHARMACIST', 'SUPER_ADMIN']}>
            <P.PrescriptionQueue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pharmacy/sales-report"
        element={
          <ProtectedRoute roles={['PHARMACIST', 'SUPER_ADMIN']}>
            <P.SalesReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pharmacy/drug-info"
        element={
          <ProtectedRoute roles={['PHARMACIST', 'SUPER_ADMIN']}>
            <P.DrugInformation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pharmacy/expiry"
        element={
          <ProtectedRoute roles={['PHARMACIST', 'SUPER_ADMIN']}>
            <P.ExpiryManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pharmacy/batches"
        element={
          <ProtectedRoute roles={['PHARMACIST', 'SUPER_ADMIN']}>
            <P.BatchManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lab-dashboard"
        element={
          <ProtectedRoute roles={['LAB_TECH', 'SUPER_ADMIN']}>
            <P.LabDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/laboratory/queue"
        element={
          <ProtectedRoute roles={['LAB_TECH', 'SUPER_ADMIN']}>
            <P.LabQueue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab/orders/:orderId/results"
        element={
          <ProtectedRoute roles={['LAB_TECH', 'SUPER_ADMIN']}>
            <P.LabOrderResultEntryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab/test-queue"
        element={
          <ProtectedRoute roles={['LAB_TECH', 'SUPER_ADMIN']}>
            <P.TestQueue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab/samples"
        element={
          <ProtectedRoute roles={['LAB_TECH', 'SUPER_ADMIN']}>
            <P.SampleCollection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab/quality"
        element={
          <ProtectedRoute roles={['LAB_TECH', 'SUPER_ADMIN']}>
            <P.QualityControl />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab/equipment"
        element={
          <ProtectedRoute roles={['LAB_TECH', 'SUPER_ADMIN']}>
            <P.EquipmentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab/catalog"
        element={
          <ProtectedRoute roles={['LAB_TECH', 'SUPER_ADMIN']}>
            <P.TestCatalog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab/verification"
        element={
          <ProtectedRoute roles={['LAB_TECH', 'SUPER_ADMIN']}>
            <P.ResultVerification />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab/report/:orderId"
        element={
          <ProtectedRoute roles={['LAB_TECH', 'SUPER_ADMIN']}>
            <P.ReportGeneration />
          </ProtectedRoute>
        }
      />

      <Route
        path="/finance-dashboard"
        element={
          <ProtectedRoute roles={['FINANCE', 'SUPER_ADMIN']}>
            <P.FinanceDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/transactions"
        element={
          <ProtectedRoute roles={['FINANCE', 'SUPER_ADMIN']}>
            <P.TransactionHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/invoices"
        element={
          <ProtectedRoute roles={['FINANCE', 'SUPER_ADMIN']}>
            <P.InvoiceGeneration />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/expenses"
        element={
          <ProtectedRoute roles={['FINANCE', 'SUPER_ADMIN']}>
            <P.ExpenseTracking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/analytics"
        element={
          <ProtectedRoute roles={['FINANCE', 'SUPER_ADMIN']}>
            <P.FinancialAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/audit"
        element={
          <ProtectedRoute roles={['FINANCE', 'SUPER_ADMIN']}>
            <P.AuditTrail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/revenue"
        element={
          <ProtectedRoute roles={['FINANCE', 'SUPER_ADMIN']}>
            <P.RevenueReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/billing"
        element={
          <ProtectedRoute roles={['FINANCE', 'SUPER_ADMIN']}>
            <P.BillingDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/invoice-management"
        element={
          <ProtectedRoute roles={['FINANCE', 'SUPER_ADMIN']}>
            <P.InvoiceManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/payment-processing"
        element={
          <ProtectedRoute roles={['FINANCE', 'SUPER_ADMIN']}>
            <P.PaymentProcessing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/daily-closeout"
        element={
          <ProtectedRoute roles={['FINANCE', 'SUPER_ADMIN']}>
            <P.DailyCloseout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/monthly-report"
        element={
          <ProtectedRoute roles={['FINANCE', 'SUPER_ADMIN']}>
            <P.MonthlyReport />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ultrasound-dashboard"
        element={
          <ProtectedRoute roles={['LAB_TECH', 'SUPER_ADMIN', 'DOCTOR']}>
            <P.UltrasoundDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ultrasound/queue"
        element={
          <ProtectedRoute roles={['LAB_TECH', 'SUPER_ADMIN', 'DOCTOR']}>
            <P.UltrasoundQueue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ultrasound/study/:orderId"
        element={
          <ProtectedRoute roles={['LAB_TECH', 'SUPER_ADMIN', 'DOCTOR']}>
            <P.StudyForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/emergency-dashboard"
        element={
          <ProtectedRoute roles={['EMERGENCY', 'SUPER_ADMIN', 'NURSE', 'DOCTOR']}>
            <P.EmergencyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/emergency/quick-registration"
        element={
          <ProtectedRoute roles={['EMERGENCY', 'SUPER_ADMIN', 'NURSE', 'DOCTOR']}>
            <P.QuickRegistration />
          </ProtectedRoute>
        }
      />
      <Route
        path="/emergency/triage/:caseId"
        element={
          <ProtectedRoute roles={['EMERGENCY', 'SUPER_ADMIN', 'NURSE', 'DOCTOR']}>
            <P.EmergencyTriage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/emergency/treatment/:caseId"
        element={
          <ProtectedRoute roles={['EMERGENCY', 'SUPER_ADMIN', 'DOCTOR']}>
            <P.TreatmentForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/emergency/disposition/:caseId"
        element={
          <ProtectedRoute roles={['EMERGENCY', 'SUPER_ADMIN', 'DOCTOR']}>
            <P.DispositionForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/queue"
        element={
          <ProtectedRoute roles={['DOCTOR', 'SUPER_ADMIN']}>
            <P.PatientQueue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff-chat"
        element={
          <ProtectedRoute
            roles={[
              'SUPER_ADMIN',
              'DOCTOR',
              'NURSE',
              'RECEPTIONIST',
              'PHARMACIST',
              'LAB_TECH',
              'FINANCE',
              'EMERGENCY',
              'INJECTION_ROOM',
            ]}
          >
            <P.StaffChat />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient-dashboard"
        element={
          <ProtectedRoute roles={['PATIENT']}>
            <P.PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/records/:patientId"
        element={
          <ProtectedRoute roles={['PATIENT', 'DOCTOR', 'NURSE', 'SUPER_ADMIN']}>
            <P.MedicalRecords />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/history/:patientId"
        element={
          <ProtectedRoute roles={['PATIENT', 'DOCTOR', 'NURSE', 'SUPER_ADMIN']}>
            <P.PatientHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute
            roles={[
              'SUPER_ADMIN',
              'DOCTOR',
              'NURSE',
              'RECEPTIONIST',
              'PHARMACIST',
              'LAB_TECH',
              'FINANCE',
              'EMERGENCY',
              'INJECTION_ROOM',
            ]}
          >
            <P.UserSettings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory"
        element={
          <ProtectedRoute roles={['PHARMACIST', 'SUPER_ADMIN']}>
            <P.InventoryDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory/receive"
        element={
          <ProtectedRoute roles={['PHARMACIST', 'SUPER_ADMIN']}>
            <P.ReceiveDelivery />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory/levels"
        element={
          <ProtectedRoute roles={['PHARMACIST', 'SUPER_ADMIN']}>
            <P.StockLevels />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory/movements"
        element={
          <ProtectedRoute roles={['PHARMACIST', 'SUPER_ADMIN']}>
            <P.StockMovements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory/transfer"
        element={
          <ProtectedRoute roles={['PHARMACIST', 'SUPER_ADMIN']}>
            <P.StockTransfer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory/adjustment"
        element={
          <ProtectedRoute roles={['PHARMACIST', 'SUPER_ADMIN']}>
            <P.StockAdjustment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory/store-request"
        element={
          <ProtectedRoute roles={['PHARMACIST', 'SUPER_ADMIN']}>
            <P.StoreRequest />
          </ProtectedRoute>
        }
      />

      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
