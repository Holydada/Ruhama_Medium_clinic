/**
 * Nurse Module Utility Functions
 */

export const calculateBMI = (weight: number, height: number): number => {
  if (!weight || !height) return 0;
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
};

export const isVitalAbnormal = (vital: string, value: number): boolean => {
  if (!value) return false;
  
  const ranges = {
    heartRate: { min: 60, max: 100 },
    respiratoryRate: { min: 12, max: 20 },
    temperature: { min: 36.1, max: 37.2 },
    oxygenSaturation: { min: 95, max: 100 },
    systolicBP: { min: 90, max: 140 },
    diastolicBP: { min: 60, max: 90 },
  };
  
  const range = ranges[vital as keyof typeof ranges];
  if (!range) return false;
  
  return value < range.min || value > range.max;
};

export const parseBP = (bp: string): { systolic: number; diastolic: number } | null => {
  if (!bp) return null;
  const match = bp.match(/^(\d+)\/(\d+)$/);
  if (!match) return null;
  return {
    systolic: parseInt(match[1]),
    diastolic: parseInt(match[2]),
  };
};

export const getTriageLevelColor = (level: string): string => {
  const colors = {
    CRITICAL: 'text-red-500 bg-red-500/20 border-red-500',
    URGENT: 'text-orange-500 bg-orange-500/20 border-orange-500',
    SEMI_URGENT: 'text-yellow-500 bg-yellow-500/20 border-yellow-500',
    NON_URGENT: 'text-green-500 bg-green-500/20 border-green-500',
  };
  return colors[level as keyof typeof colors] || 'text-slate-400 bg-slate-400/20';
};

export const getTriageLevelText = (level: string): string => {
  const texts = {
    CRITICAL: 'Critical (Level 1)',
    URGENT: 'Urgent (Level 2)',
    SEMI_URGENT: 'Semi-Urgent (Level 3)',
    NON_URGENT: 'Non-Urgent (Level 4)',
  };
  return texts[level as keyof typeof texts] || level;
};

export const validateVitalSigns = (vitals: any): string[] => {
  const errors: string[] = [];
  
  if (vitals.heartRate && (vitals.heartRate < 30 || vitals.heartRate > 200)) {
    errors.push('Heart rate must be between 30-200 bpm');
  }
  
  if (vitals.respiratoryRate && (vitals.respiratoryRate < 8 || vitals.respiratoryRate > 40)) {
    errors.push('Respiratory rate must be between 8-40 breaths/min');
  }
  
  if (vitals.temperature && (vitals.temperature < 32 || vitals.temperature > 45)) {
    errors.push('Temperature must be between 32-45°C');
  }
  
  if (vitals.oxygenSaturation && (vitals.oxygenSaturation < 70 || vitals.oxygenSaturation > 100)) {
    errors.push('Oxygen saturation must be between 70-100%');
  }
  
  if (vitals.weight && (vitals.weight < 1 || vitals.weight > 300)) {
    errors.push('Weight must be between 1-300 kg');
  }
  
  if (vitals.height && (vitals.height < 30 || vitals.height > 250)) {
    errors.push('Height must be between 30-250 cm');
  }
  
  if (vitals.painScore && (vitals.painScore < 0 || vitals.painScore > 10)) {
    errors.push('Pain score must be between 0-10');
  }
  
  if (vitals.bloodPressure) {
    const bp = parseBP(vitals.bloodPressure);
    if (!bp) {
      errors.push('Blood pressure must be in format: 120/80');
    } else {
      if (bp.systolic < 60 || bp.systolic > 250) {
        errors.push('Systolic BP must be between 60-250 mmHg');
      }
      if (bp.diastolic < 30 || bp.diastolic > 150) {
        errors.push('Diastolic BP must be between 30-150 mmHg');
      }
    }
  }
  
  return errors;
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const getInjectionSites = () => [
  { value: 'LEFT_DELTOID', label: 'Left Deltoid' },
  { value: 'RIGHT_DELTOID', label: 'Right Deltoid' },
  { value: 'LEFT_DORSOGLUTEAL', label: 'Left Dorsogluteal' },
  { value: 'RIGHT_DORSOGLUTEAL', label: 'Right Dorsogluteal' },
  { value: 'LEFT_VASTUS_LATERALIS', label: 'Left Vastus Lateralis' },
  { value: 'RIGHT_VASTUS_LATERALIS', label: 'Right Vastus Lateralis' },
  { value: 'LEFT_VENTROGLUTEAL', label: 'Left Ventrogluteal' },
  { value: 'RIGHT_VENTROGLUTEAL', label: 'Right Ventrogluteal' },
  { value: 'ABDOMEN', label: 'Abdomen' },
  { value: 'LEFT_THIGH', label: 'Left Thigh' },
  { value: 'RIGHT_THIGH', label: 'Right Thigh' },
];

export const getInjectionRoutes = () => [
  { value: 'IV', label: 'Intravenous (IV)' },
  { value: 'IM', label: 'Intramuscular (IM)' },
  { value: 'SC', label: 'Subcutaneous (SC)' },
  { value: 'ID', label: 'Intradermal (ID)' },
];
