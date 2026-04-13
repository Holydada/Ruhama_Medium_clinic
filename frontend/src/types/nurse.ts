/**
 * Nurse Module Type Definitions
 */

export type TriageLevel = 'CRITICAL' | 'URGENT' | 'SEMI_URGENT' | 'NON_URGENT';
export type ServiceType = 'OPD' | 'ULTRASOUND' | 'EMERGENCY' | 'INJECTION';

export interface TriageRecord {
  id: string;
  visitId: string;
  patientId: string;
  triageLevel: TriageLevel;
  chiefComplaint: string;
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  painScore?: number;
  isPregnant?: boolean;
  lmp?: string;
  allergies?: string;
  chronicIllnesses?: string;
  routedTo: ServiceType;
  alertSent: boolean;
  triageAt: string;
  triageBy: {
    id: string;
    fullName: string;
  };
  patient: {
    id: string;
    fullName: string;
    cardNumber: string;
    sex: 'MALE' | 'FEMALE';
    dateOfBirth: string;
    photoUrl?: string;
  };
  visit: {
    id: string;
    visitNumber: number;
    visitType: string;
    status: string;
    assignedDoctor?: {
      id: string;
      fullName: string;
    };
  };
}

export interface VitalSigns {
  id: string;
  visitId: string;
  patientId: string;
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  painScore?: number;
  notes?: string;
  isAbnormal: boolean;
  recordedAt: string;
  recordedBy: {
    id: string;
    fullName: string;
  };
}

export interface NursingNote {
  id: string;
  visitId: string;
  patientId: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  noteType?: string;
  attachments?: string[];
  isLocked: boolean;
  lockedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    fullName: string;
  };
}

export interface InjectionOrder {
  id: string;
  orderNumber: string;
  visitId: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  route: string;
  frequency?: string;
  duration?: string;
  status: 'PENDING' | 'ADMINISTERED' | 'CANCELLED';
  createdAt: string;
  orderedBy: {
    id: string;
    fullName: string;
  };
  patient: {
    id: string;
    fullName: string;
    cardNumber: string;
    sex: 'MALE' | 'FEMALE';
    dateOfBirth: string;
    photoUrl?: string;
    allergies?: string;
  };
  visit: {
    id: string;
    vitalSigns?: VitalSigns[];
  };
  administrations?: InjectionAdministration[];
}

export interface InjectionAdministration {
  id: string;
  orderId: string;
  patientVerified: boolean;
  medicationVerified: boolean;
  doseVerified: boolean;
  routeVerified: boolean;
  timeVerified: boolean;
  route: string;
  site: string;
  lotNumber: string;
  expiryDate: string;
  administeredAt: string;
  hasAdverseEvent: boolean;
  adverseEventType?: string;
  adverseEventSeverity?: string;
  adverseEventNotes?: string;
  notes?: string;
  administeredBy: {
    id: string;
    fullName: string;
  };
}

export interface ObservationBoardPatient {
  id: string;
  visitNumber: number;
  visitType: string;
  serviceType: ServiceType;
  triageLevel?: TriageLevel;
  status: string;
  visitDate: string;
  patient: {
    id: string;
    fullName: string;
    cardNumber: string;
    photoUrl?: string;
  };
  assignedDoctor?: {
    id: string;
    fullName: string;
  };
  triageRecords?: TriageRecord[];
  vitalSigns?: VitalSigns[];
  injectionOrders?: InjectionOrder[];
  labOrders?: any[];
}

// Form Data Types
export interface TriageFormData {
  visitId: string;
  patientId: string;
  triageLevel: TriageLevel;
  chiefComplaint: string;
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  painScore?: number;
  isPregnant?: boolean;
  lmp?: Date | null;
  allergies?: string;
  chronicIllnesses?: string;
  routedTo: ServiceType;
}

export interface VitalSignsFormData {
  visitId: string;
  patientId: string;
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  painScore?: number;
  notes?: string;
}

export interface NursingNoteFormData {
  visitId: string;
  patientId: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  noteType?: string;
  attachments?: string[];
}

export interface InjectionAdministrationFormData {
  orderId: string;
  route: string;
  site: string;
  lotNumber: string;
  expiryDate: Date;
  hasAdverseEvent?: boolean;
  adverseEventType?: string;
  adverseEventSeverity?: string;
  adverseEventNotes?: string;
  notes?: string;
}
