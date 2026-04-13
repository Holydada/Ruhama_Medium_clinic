import { lazy } from 'react';

/** Code-split module pages (keeps initial login/Landing bundle small). */
export const ReceptionDashboard = lazy(() =>
  import('../pages/reception/ReceptionDashboard').then((m) => ({ default: m.ReceptionDashboard }))
);
export const NewPatientRegistration = lazy(() =>
  import('../pages/reception/NewPatientRegistration').then((m) => ({ default: m.NewPatientRegistration }))
);
export const RepeatVisit = lazy(() =>
  import('../pages/reception/RepeatVisit').then((m) => ({ default: m.RepeatVisit }))
);
export const PatientManagement = lazy(() =>
  import('../pages/reception/PatientManagement').then((m) => ({ default: m.PatientManagement }))
);
export const DoctorAssignment = lazy(() =>
  import('../pages/reception/DoctorAssignment').then((m) => ({ default: m.DoctorAssignment }))
);
export const PaymentCollection = lazy(() =>
  import('../pages/reception/PaymentCollection').then((m) => ({ default: m.PaymentCollection }))
);
export const UltrasoundBooking = lazy(() =>
  import('../pages/reception/UltrasoundBooking').then((m) => ({ default: m.UltrasoundBooking }))
);
export const QueueManagement = lazy(() =>
  import('../pages/reception/QueueManagement').then((m) => ({ default: m.QueueManagement }))
);
export const ServiceSelection = lazy(() =>
  import('../pages/reception/ServiceSelection').then((m) => ({ default: m.ServiceSelection }))
);
export const AppointmentScheduler = lazy(() =>
  import('../pages/reception/AppointmentScheduler').then((m) => ({ default: m.AppointmentScheduler }))
);

export const DoctorEncounterWorkspace = lazy(() =>
  import('../pages/doctor/DoctorEncounterWorkspace').then((m) => ({ default: m.DoctorEncounterWorkspace }))
);
export const DoctorDashboard = lazy(() =>
  import('../pages/doctor/DoctorDashboard').then((m) => ({ default: m.DoctorDashboard }))
);
export const ResultsViewer = lazy(() =>
  import('../pages/doctor/ResultsViewer').then((m) => ({ default: m.ResultsViewer }))
);

export const NurseDashboard = lazy(() =>
  import('../pages/nurse/NurseDashboard').then((m) => ({ default: m.NurseDashboard }))
);
export const PatientMonitoring = lazy(() =>
  import('../pages/nurse/PatientMonitoring').then((m) => ({ default: m.PatientMonitoring }))
);
export const MedicationAdministration = lazy(() =>
  import('../pages/nurse/MedicationAdministration').then((m) => ({ default: m.MedicationAdministration }))
);
export const NurseVitalsWorkspace = lazy(() =>
  import('../pages/nurse/NurseVitalsWorkspace').then((m) => ({ default: m.NurseVitalsWorkspace }))
);
export const VitalSignsForm = lazy(() =>
  import('../pages/nurse/VitalSignsForm').then((m) => ({ default: m.VitalSignsForm }))
);
export const ObservationBoard = lazy(() =>
  import('../pages/nurse/ObservationBoard').then((m) => ({ default: m.ObservationBoard }))
);
export const InjectionAdministration = lazy(() =>
  import('../pages/nurse/InjectionAdministration').then((m) => ({ default: m.InjectionAdministration }))
);
export const InjectionQueue = lazy(() =>
  import('../pages/nurse/InjectionQueue').then((m) => ({ default: m.InjectionQueue }))
);
export const NursingNotes = lazy(() =>
  import('../pages/nurse/NursingNotes').then((m) => ({ default: m.NursingNotes }))
);
export const SickLeaveForm = lazy(() =>
  import('../pages/certificates/SickLeaveForm').then((m) => ({ default: m.SickLeaveForm }))
);
export const MedicalCertificateForm = lazy(() =>
  import('../pages/certificates/MedicalCertificateForm').then((m) => ({ default: m.MedicalCertificateForm }))
);
export const PrescriptionForm = lazy(() =>
  import('../pages/doctor/PrescriptionForm').then((m) => ({ default: m.PrescriptionForm }))
);
export const LabOrderForm = lazy(() =>
  import('../pages/doctor/LabOrderForm').then((m) => ({ default: m.LabOrderForm }))
);
export const EncounterForm = lazy(() =>
  import('../pages/doctor/PatientEncounter').then((m) => ({ default: m.PatientEncounter }))
);
export const InjectionOrderForm = lazy(() =>
  import('../pages/doctor/InjectionOrderForm').then((m) => ({ default: m.InjectionOrderForm }))
);
export const ShiftHandover = lazy(() =>
  import('../pages/nurse/ShiftHandover').then((m) => ({ default: m.ShiftHandover }))
);

export const PharmacyDashboard = lazy(() =>
  import('../pages/pharmacy/PharmacyDashboard').then((m) => ({ default: m.PharmacyDashboard }))
);
export const PharmacyQueue = lazy(() =>
  import('../pages/pharmacy/PharmacyQueue').then((m) => ({ default: m.PharmacyQueue }))
);
export const StockManagement = lazy(() =>
  import('../pages/pharmacy/StockManagement').then((m) => ({ default: m.StockManagement }))
);
export const StockEntry = lazy(() =>
  import('../pages/pharmacy/StockEntry').then((m) => ({ default: m.StockEntry }))
);
export const InventoryAlerts = lazy(() =>
  import('../pages/pharmacy/InventoryAlerts').then((m) => ({ default: m.InventoryAlerts }))
);
export const PrescriptionQueue = lazy(() =>
  import('../pages/pharmacy/PrescriptionQueue').then((m) => ({ default: m.PrescriptionQueue }))
);
export const SalesReport = lazy(() =>
  import('../pages/pharmacy/SalesReport').then((m) => ({ default: m.SalesReport }))
);
export const DrugInformation = lazy(() =>
  import('../pages/pharmacy/DrugInformation').then((m) => ({ default: m.DrugInformation }))
);
export const ExpiryManagement = lazy(() =>
  import('../pages/pharmacy/ExpiryManagement').then((m) => ({ default: m.ExpiryManagement }))
);
export const BatchManagement = lazy(() =>
  import('../pages/pharmacy/BatchManagement').then((m) => ({ default: m.BatchManagement }))
);

export const LabDashboard = lazy(() =>
  import('../pages/laboratory/LabDashboard').then((m) => ({ default: m.LabDashboard }))
);
export const TestQueue = lazy(() =>
  import('../pages/laboratory/TestQueue').then((m) => ({ default: m.TestQueue }))
);
export const SampleCollection = lazy(() =>
  import('../pages/laboratory/SampleCollection').then((m) => ({ default: m.SampleCollection }))
);
export const QualityControl = lazy(() =>
  import('../pages/laboratory/QualityControl').then((m) => ({ default: m.QualityControl }))
);
export const EquipmentManagement = lazy(() =>
  import('../pages/laboratory/EquipmentManagement').then((m) => ({ default: m.EquipmentManagement }))
);
export const TestCatalog = lazy(() =>
  import('../pages/laboratory/TestCatalog').then((m) => ({ default: m.TestCatalog }))
);
export const ResultVerification = lazy(() =>
  import('../pages/laboratory/ResultVerification').then((m) => ({ default: m.ResultVerification }))
);
export const LabOrderResultEntryPage = lazy(() =>
  import('../pages/laboratory/LabOrderResultEntryPage').then((m) => ({ default: m.LabOrderResultEntryPage }))
);

export const FinanceDashboard = lazy(() =>
  import('../pages/finance/FinanceDashboard').then((m) => ({ default: m.FinanceDashboard }))
);
export const TransactionHistory = lazy(() =>
  import('../pages/finance/TransactionHistory').then((m) => ({ default: m.TransactionHistory }))
);
export const InvoiceGeneration = lazy(() =>
  import('../pages/finance/InvoiceGeneration').then((m) => ({ default: m.InvoiceGeneration }))
);
export const ExpenseTracking = lazy(() =>
  import('../pages/finance/ExpenseTracking').then((m) => ({ default: m.ExpenseTracking }))
);
export const FinancialAnalytics = lazy(() =>
  import('../pages/finance/FinancialAnalytics').then((m) => ({ default: m.FinancialAnalytics }))
);
export const AuditTrail = lazy(() =>
  import('../pages/finance/AuditTrail').then((m) => ({ default: m.AuditTrail }))
);
export const RevenueReports = lazy(() =>
  import('../pages/finance/RevenueReports').then((m) => ({ default: m.RevenueReports }))
);

export const UltrasoundDashboard = lazy(() =>
  import('../pages/ultrasound/UltrasoundDashboard').then((m) => ({ default: m.UltrasoundDashboard }))
);
export const EmergencyDashboard = lazy(() =>
  import('../pages/emergency/EmergencyDashboard').then((m) => ({ default: m.EmergencyDashboard }))
);
export const QuickRegistration = lazy(() =>
  import('../pages/emergency/QuickRegistration').then((m) => ({ default: m.QuickRegistration }))
);
export const EmergencyTriage = lazy(() =>
  import('../pages/emergency/EmergencyTriage').then((m) => ({ default: m.EmergencyTriage }))
);
export const TreatmentForm = lazy(() =>
  import('../pages/emergency/TreatmentForm').then((m) => ({ default: m.TreatmentForm }))
);
export const DispositionForm = lazy(() =>
  import('../pages/emergency/DispositionForm').then((m) => ({ default: m.DispositionForm }))
);
export const PatientQueue = lazy(() =>
  import('../pages/doctor/PatientQueue').then((m) => ({ default: m.PatientQueue }))
);
export const StaffChat = lazy(() => import('../pages/chat/StaffChat').then((m) => ({ default: m.StaffChat })));

export const AdminDashboard = lazy(() =>
  import('../pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
export const StaffManagement = lazy(() =>
  import('../pages/admin/StaffManagement').then((m) => ({ default: m.StaffManagement }))
);
export const UserApproval = lazy(() =>
  import('../pages/admin/UserApproval').then((m) => ({ default: m.UserApproval }))
);
export const AuditLogs = lazy(() =>
  import('../pages/admin/AuditLogs').then((m) => ({ default: m.AuditLogs }))
);
export const BackupRestore = lazy(() =>
  import('../pages/admin/BackupRestore').then((m) => ({ default: m.BackupRestore }))
);
export const SystemSettings = lazy(() =>
  import('../pages/admin/SystemSettings').then((m) => ({ default: m.default }))
);
export const RoleManagement = lazy(() =>
  import('../pages/admin/RoleManagement').then((m) => ({ default: m.RoleManagement }))
);
export const Reports = lazy(() => import('../pages/admin/Reports').then((m) => ({ default: m.default })));

export const Success = lazy(() => import('../pages/Success').then((m) => ({ default: m.Success })));

export const PatientDashboard = lazy(() =>
  import('../pages/patient/PatientDashboard').then((m) => ({ default: m.PatientDashboard }))
);
export const RegisterPatient = lazy(() =>
  import('../pages/patient/RegisterPatient').then((m) => ({ default: m.RegisterPatient }))
);

export const UserSettings = lazy(() =>
  import('../pages/settings/UserSettings').then((m) => ({ default: m.UserSettings }))
);

// Inventory pages
export const InventoryDashboard = lazy(() =>
  import('../pages/inventory/InventoryDashboard').then((m) => ({ default: m.InventoryDashboard }))
);
export const ReceiveDelivery = lazy(() =>
  import('../pages/inventory/ReceiveDelivery').then((m) => ({ default: m.ReceiveDelivery }))
);
export const StockLevels = lazy(() =>
  import('../pages/inventory/StockLevels').then((m) => ({ default: m.StockLevels }))
);
export const StockMovements = lazy(() =>
  import('../pages/inventory/StockMovements').then((m) => ({ default: m.StockMovements }))
);
export const StockTransfer = lazy(() =>
  import('../pages/inventory/StockTransfer').then((m) => ({ default: m.StockTransfer }))
);

// New pages
export const MedicalRecords = lazy(() =>
  import('../pages/patient/MedicalRecords').then((m) => ({ default: m.default }))
);
export const PatientHistory = lazy(() =>
  import('../pages/patient/PatientHistory').then((m) => ({ default: m.default }))
);
export const UltrasoundQueue = lazy(() =>
  import('../pages/ultrasound/UltrasoundQueue').then((m) => ({ default: m.default }))
);
export const StudyForm = lazy(() =>
  import('../pages/ultrasound/StudyForm').then((m) => ({ default: m.default }))
);
export const ReportGeneration = lazy(() =>
  import('../pages/laboratory/ReportGeneration').then((m) => ({ default: m.default }))
);
export const LabQueue = lazy(() =>
  import('../pages/laboratory/LabQueue').then((m) => ({ default: m.default }))
);
export const InvoiceManagement = lazy(() =>
  import('../pages/finance/InvoiceManagement').then((m) => ({ default: m.default }))
);
export const PaymentProcessing = lazy(() =>
  import('../pages/finance/PaymentProcessing').then((m) => ({ default: m.default }))
);
export const BillingDashboard = lazy(() =>
  import('../pages/finance/BillingDashboard').then((m) => ({ default: m.default }))
);
export const ReferralForm = lazy(() =>
  import('../pages/doctor/ReferralForm').then((m) => ({ default: m.default }))
);
export const AuditLog = lazy(() =>
  import('../pages/admin/AuditLog').then((m) => ({ default: m.default }))
);
export const PatientChart = lazy(() =>
  import('../pages/doctor/PatientChart').then((m) => ({ default: m.PatientChart }))
);

// Additional pages
export const NotificationCenter = lazy(() =>
  import('../components/notifications/NotificationCenter').then((m) => ({ default: m.default }))
);
export const StockAdjustment = lazy(() =>
  import('../pages/inventory/StockAdjustment').then((m) => ({ default: m.default }))
);
export const StoreRequest = lazy(() =>
  import('../pages/inventory/StoreRequest').then((m) => ({ default: m.default }))
);
export const DailyCloseout = lazy(() =>
  import('../pages/finance/DailyCloseout').then((m) => ({ default: m.default }))
);
export const MonthlyReport = lazy(() =>
  import('../pages/finance/MonthlyReport').then((m) => ({ default: m.default }))
);
export const ImageViewer = lazy(() =>
  import('../pages/ultrasound/ImageViewer').then((m) => ({ default: m.default }))
);
export const CertificateList = lazy(() =>
  import('../pages/certificates/CertificateList').then((m) => ({ default: m.default }))
);
export const OrderManagement = lazy(() =>
  import('../pages/doctor/OrderManagement').then((m) => ({ default: m.default }))
);
