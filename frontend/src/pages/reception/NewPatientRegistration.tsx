import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { isAxiosError } from 'axios';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { getLang, setLang, t, type AppLang } from '../../lib/i18n';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { receptionModuleSubnav } from '../../navigation/moduleSubnavItems';

const schema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  age: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    const n = typeof val === 'number' ? val : Number(val);
    return Number.isFinite(n) ? n : undefined;
  }, z.number({ invalid_type_error: 'Enter a valid age' }).min(0, 'Age must be at least 0').max(150, 'Age must be less than 150')),
  gender: z
    .string()
    .refine((v) => v === 'male' || v === 'female', { message: 'Select gender' }),
  phone: z.string().min(10, 'Valid phone number required'),
  address: z.string().min(3, 'Address is required'),
  emergencyContact: z.string().min(10, 'Emergency contact required'),
  medicalHistory: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function apiErrorMessage(error: unknown): string {
  if (!isAxiosError(error)) return 'Registration failed. Please try again.';
  const data = error.response?.data as {
    error?:
      | string
      | {
          message?: string;
          details?: Array<{ field?: string; message?: string }>;
        };
  };
  if (!data?.error) return 'Registration failed. Please try again.';
  if (typeof data.error === 'string') return data.error;
  const first = data.error.details?.[0];
  if (first?.message) {
    return first.field ? `${first.field}: ${first.message}` : first.message;
  }
  return data.error.message ?? 'Registration failed. Please try again.';
}

export const NewPatientRegistration = () => {
  const navigate = useNavigate();
  const [lang, setLanguage] = useState<AppLang>(getLang());
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [lastVisitId, setLastVisitId] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState<'OPD' | 'ULTRASOUND'>('OPD');
  const [visitType, setVisitType] = useState<'NEW' | 'FOLLOW_UP'>('NEW');
  const [isEmergency, setIsEmergency] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState({
    hasAllergies: false,
    allergyDetails: '',
    hasDiabetes: false,
    hasHypertension: false,
    hasAsthma: false,
    hasHeartDisease: false,
    hasKidneyDisease: false,
    hasEpilepsy: false,
    currentMedications: '',
    familyHistory: '',
    surgicalHistory: '',
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // Log validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('=== FORM VALIDATION ERRORS ===');
      console.log('Errors:', errors);
      console.log('Error details:', JSON.stringify(errors, null, 2));
    }
  }, [errors]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access denied', error);
      toast.error('Camera access denied. Please allow camera access or upload a photo.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPhotoPreview(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const validateAndReadImageFile = (file: File) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast.error('Only JPG, PNG, and WEBP images are allowed.');
      return;
    }
    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error('Image too large. Please upload an image under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndReadImageFile(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Form data:', data);
    console.log('Service type:', serviceType);
    console.log('Visit type:', visitType);
    console.log('Is emergency:', isEmergency);
    console.log('Medical history state:', medicalHistory);
    
    setIsSubmitting(true);
    try {
      const now = new Date();
      const birthYear = now.getFullYear() - data.age;
      const dateOfBirth = new Date(birthYear, 0, 1).toISOString();

      const photoPayload =
        photoPreview && photoPreview.length <= 2_000_000 ? photoPreview : undefined;

      console.log('Preparing patient payload...');
      const patientPayload = {
        fullName: data.fullName,
        sex: data.gender === 'male' ? 'MALE' : 'FEMALE',
        dateOfBirth,
        phone: data.phone,
        address: data.address,
        emergencyContactPhone: data.emergencyContact,
        medicalHistory: data.medicalHistory,
        photoUrl: photoPayload,
        
        // Enhanced medical history
        hasAllergies: medicalHistory.hasAllergies,
        allergyDetails: medicalHistory.allergyDetails,
        hasDiabetes: medicalHistory.hasDiabetes,
        hasHypertension: medicalHistory.hasHypertension,
        hasAsthma: medicalHistory.hasAsthma,
        hasHeartDisease: medicalHistory.hasHeartDisease,
        hasKidneyDisease: medicalHistory.hasKidneyDisease,
        hasEpilepsy: medicalHistory.hasEpilepsy,
        currentMedications: medicalHistory.currentMedications,
        familyHistory: medicalHistory.familyHistory,
        surgicalHistory: medicalHistory.surgicalHistory,
        
        // Emergency registration
        isIncomplete: isEmergency,
        incompleteReason: isEmergency ? 'Emergency registration - complete details later' : undefined,
      };

      console.log('Patient payload:', patientPayload);
      console.log('Sending POST request to /patients...');

      const patientResp = await api.post('/patients', patientPayload);

      console.log('Patient response:', patientResp.data);

      const patientId = patientResp.data?.data?.id;
      const patientCardNumber = patientResp.data?.data?.cardNumber;

      if (!patientId) {
        throw new Error('Patient creation failed - no patient ID returned');
      }

      // Calculate ultrasound fee if applicable
      let ultrasoundFee = 0;
      if (serviceType === 'ULTRASOUND') {
        ultrasoundFee = visitType === 'FOLLOW_UP' ? 400 : 200;
      }

      console.log('Creating visit with ultrasound fee:', ultrasoundFee);

      const visitPayload = {
        patientId,
        visitType: 'NEW',
        serviceType,
        ultrasoundFee: ultrasoundFee > 0 ? ultrasoundFee : undefined,
      };

      console.log('Visit payload:', visitPayload);
      console.log('Sending POST request to /visits...');

      const visitResp = await api.post('/visits', visitPayload);

      console.log('Visit response:', visitResp.data);

      const visitId = visitResp.data?.data?.id as string | undefined;
      setLastVisitId(visitId ?? null);

      setCardNumber(patientCardNumber || 'Card generated');
      setSuccess(true);
      toast.success('Patient registered and visit created successfully.');
      console.log('=== REGISTRATION SUCCESSFUL ===');
      
    } catch (error) {
      console.error('=== REGISTRATION FAILED ===');
      console.error('Error object:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      toast.error(apiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
      console.log('=== FORM SUBMISSION ENDED ===');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card variant="elevated" className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 mb-6">
              <svg className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-50 mb-2">Registration Successful!</h2>
            <p className="text-slate-400 mb-6">Patient card has been created</p>
            
            <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-6 mb-6">
              <p className="text-sm text-slate-400 mb-2">Patient Card Number</p>
              <p className="text-3xl font-bold text-sky-400 font-mono">{cardNumber}</p>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  reset();
                  setPhotoPreview(null);
                  setSuccess(false);
                  setCardNumber('');
                  setLastVisitId(null);
                }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Register Another Patient
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  if (lastVisitId) {
                    navigate('/reception/doctor-assignment', { state: { visitId: lastVisitId } });
                  } else {
                    navigate('/reception/doctor-assignment');
                  }
                }}
              >
                Assign to Doctor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-50">{t(lang, 'newPatientRegistration')}</h1>
              <p className="text-slate-400 mt-1">{t(lang, 'registerNewPatient')}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant={isEmergency ? "primary" : "outline"}
                onClick={() => setIsEmergency(!isEmergency)}
                className={isEmergency ? "bg-red-600 hover:bg-red-700" : ""}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {isEmergency ? 'Emergency Mode ON' : 'Emergency Mode'}
              </Button>
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-300">{t(lang, 'language')}</label>
                <select
                  value={lang}
                  onChange={(e) => {
                    const next = e.target.value as AppLang;
                    setLanguage(next);
                    setLang(next);
                  }}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                >
                  <option value="en">English</option>
                  <option value="am">አማርኛ</option>
                </select>
              </div>
            </div>
          </div>
          {isEmergency && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 font-semibold">⚠️ Emergency Registration Mode</p>
              <p className="text-slate-300 text-sm mt-1">Only critical fields required. Complete details can be added later.</p>
            </div>
          )}
        </div>

        <ModuleSubnav items={receptionModuleSubnav} ariaLabel="Reception workflow" />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Personal Information */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>{t(lang, 'personalInformation')}</CardTitle>
                <CardDescription>Basic patient details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label={t(lang, 'fullName')}
                  placeholder="Enter patient's full name"
                  error={errors.fullName?.message}
                  {...register('fullName')}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label={t(lang, 'age')}
                    type="number"
                    placeholder="Age"
                    error={errors.age?.message}
                    {...register('age', { valueAsNumber: true })}
                    required
                  />

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      {t(lang, 'gender')} <span className="text-red-400">*</span>
                    </label>
                    <select
                      className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                      {...register('gender')}
                      required
                    >
                      <option value="">{t(lang, 'select')}</option>
                      <option value="male">{t(lang, 'male')}</option>
                      <option value="female">{t(lang, 'female')}</option>
                    </select>
                    {errors.gender && <p className="mt-2 text-sm text-red-400">{errors.gender.message}</p>}
                  </div>

                  <Input
                    label={t(lang, 'phone')}
                    type="tel"
                    placeholder="+251 912 345 678"
                    error={errors.phone?.message}
                    {...register('phone')}
                    required
                  />
                </div>

                <Input
                  label={t(lang, 'address')}
                  placeholder="City, Kebele, House No."
                  error={errors.address?.message}
                  {...register('address')}
                  required
                />

                <Input
                  label={t(lang, 'emergencyContact')}
                  type="tel"
                  placeholder="Emergency contact phone"
                  error={errors.emergencyContact?.message}
                  {...register('emergencyContact')}
                  required
                />
              </CardContent>
            </Card>

            {/* Photo Capture */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>{t(lang, 'patientPhoto')}</CardTitle>
                <CardDescription>Capture or upload patient photo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    {!photoPreview && !cameraActive && (
                      <div className="aspect-square bg-slate-900/80 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center">
                        <svg className="h-16 w-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-slate-400 text-sm">No photo captured</p>
                      </div>
                    )}

                    {cameraActive && (
                      <div className="relative aspect-square bg-black rounded-xl overflow-hidden">
                        <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
                      </div>
                    )}

                    {photoPreview && !cameraActive && (
                      <div className="relative aspect-square bg-slate-900 rounded-xl overflow-hidden">
                        <img src={photoPreview} alt="Patient" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 md:w-48">
                    {!cameraActive && !photoPreview && (
                      <>
                        <Button type="button" variant="primary" onClick={startCamera}>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {t(lang, 'takePhoto')}
                        </Button>
                        <label>
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                          <Button
                            type="button"
                            variant="secondary"
                            className="w-full"
                            onClick={(e) =>
                              (e.currentTarget.previousElementSibling as HTMLInputElement | null)?.click()
                            }
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            {t(lang, 'uploadFile')}
                          </Button>
                        </label>
                      </>
                    )}

                    {cameraActive && (
                      <>
                        <Button type="button" variant="primary" onClick={capturePhoto}>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          {t(lang, 'capture')}
                        </Button>
                        <Button type="button" variant="outline" onClick={stopCamera}>
                          {t(lang, 'cancel')}
                        </Button>
                      </>
                    )}

                    {photoPreview && !cameraActive && (
                      <Button type="button" variant="outline" onClick={() => setPhotoPreview(null)}>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove Photo
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Medical History */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
                <CardDescription>Comprehensive health information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={medicalHistory.hasDiabetes}
                      onChange={(e) => setMedicalHistory({...medicalHistory, hasDiabetes: e.target.checked})}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-950"
                    />
                    <span className="text-sm text-slate-300">Diabetes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={medicalHistory.hasHypertension}
                      onChange={(e) => setMedicalHistory({...medicalHistory, hasHypertension: e.target.checked})}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-950"
                    />
                    <span className="text-sm text-slate-300">Hypertension</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={medicalHistory.hasAsthma}
                      onChange={(e) => setMedicalHistory({...medicalHistory, hasAsthma: e.target.checked})}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-950"
                    />
                    <span className="text-sm text-slate-300">Asthma</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={medicalHistory.hasHeartDisease}
                      onChange={(e) => setMedicalHistory({...medicalHistory, hasHeartDisease: e.target.checked})}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-950"
                    />
                    <span className="text-sm text-slate-300">Heart Disease</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={medicalHistory.hasKidneyDisease}
                      onChange={(e) => setMedicalHistory({...medicalHistory, hasKidneyDisease: e.target.checked})}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-950"
                    />
                    <span className="text-sm text-slate-300">Kidney Disease</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={medicalHistory.hasEpilepsy}
                      onChange={(e) => setMedicalHistory({...medicalHistory, hasEpilepsy: e.target.checked})}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-950"
                    />
                    <span className="text-sm text-slate-300">Epilepsy</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={medicalHistory.hasAllergies}
                      onChange={(e) => setMedicalHistory({...medicalHistory, hasAllergies: e.target.checked})}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-950"
                    />
                    <span className="text-sm font-semibold text-slate-200">Has Allergies</span>
                  </label>
                  {medicalHistory.hasAllergies && (
                    <textarea
                      value={medicalHistory.allergyDetails}
                      onChange={(e) => setMedicalHistory({...medicalHistory, allergyDetails: e.target.value})}
                      className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none resize-none"
                      rows={2}
                      placeholder="Describe allergies (e.g., Penicillin, Peanuts)..."
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">Current Medications</label>
                  <textarea
                    value={medicalHistory.currentMedications}
                    onChange={(e) => setMedicalHistory({...medicalHistory, currentMedications: e.target.value})}
                    className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none resize-none"
                    rows={2}
                    placeholder="List current medications and dosages..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">Family History</label>
                    <textarea
                      value={medicalHistory.familyHistory}
                      onChange={(e) => setMedicalHistory({...medicalHistory, familyHistory: e.target.value})}
                      className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none resize-none"
                      rows={2}
                      placeholder="Family medical history..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">Surgical History</label>
                    <textarea
                      value={medicalHistory.surgicalHistory}
                      onChange={(e) => setMedicalHistory({...medicalHistory, surgicalHistory: e.target.value})}
                      className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none resize-none"
                      rows={2}
                      placeholder="Previous surgeries..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">Additional Notes</label>
                  <textarea
                    className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none resize-none"
                    rows={2}
                    placeholder="Any additional medical history or notes..."
                    {...register('medicalHistory')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Service Selection */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Service Selection</CardTitle>
                <CardDescription>Select the service type for this visit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Service Type <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="relative">
                      <input
                        type="radio"
                        name="serviceType"
                        value="OPD"
                        checked={serviceType === 'OPD'}
                        onChange={(e) => setServiceType(e.target.value as 'OPD')}
                        className="peer sr-only"
                      />
                      <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-700 peer-checked:border-sky-500 peer-checked:bg-sky-500/10 cursor-pointer transition-all">
                        <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center">
                          <svg className="h-6 w-6 text-slate-400 peer-checked:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-200">OPD Consultation</p>
                          <p className="text-sm text-slate-400">General consultation</p>
                        </div>
                      </div>
                    </label>

                    <label className="relative">
                      <input
                        type="radio"
                        name="serviceType"
                        value="ULTRASOUND"
                        checked={serviceType === 'ULTRASOUND'}
                        onChange={(e) => setServiceType(e.target.value as 'ULTRASOUND')}
                        className="peer sr-only"
                      />
                      <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-700 peer-checked:border-sky-500 peer-checked:bg-sky-500/10 cursor-pointer transition-all">
                        <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center">
                          <svg className="h-6 w-6 text-slate-400 peer-checked:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-200">Ultrasound</p>
                          <p className="text-sm text-slate-400">Imaging service</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {serviceType === 'ULTRASOUND' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-3">
                      Visit Type <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="relative">
                        <input
                          type="radio"
                          name="visitType"
                          value="NEW"
                          checked={visitType === 'NEW'}
                          onChange={(e) => setVisitType(e.target.value as 'NEW')}
                          className="peer sr-only"
                        />
                        <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-700 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 cursor-pointer transition-all">
                          <div>
                            <p className="font-semibold text-slate-200">One-time</p>
                            <p className="text-sm text-slate-400">First ultrasound</p>
                          </div>
                          <p className="text-2xl font-bold text-emerald-400">200 ETB</p>
                        </div>
                      </label>

                      <label className="relative">
                        <input
                          type="radio"
                          name="visitType"
                          value="FOLLOW_UP"
                          checked={visitType === 'FOLLOW_UP'}
                          onChange={(e) => setVisitType(e.target.value as 'FOLLOW_UP')}
                          className="peer sr-only"
                        />
                        <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-700 peer-checked:border-amber-500 peer-checked:bg-amber-500/10 cursor-pointer transition-all">
                          <div>
                            <p className="font-semibold text-slate-200">Follow-up</p>
                            <p className="text-sm text-slate-400">Return visit</p>
                          </div>
                          <p className="text-2xl font-bold text-amber-400">400 ETB</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>{t(lang, 'payment')}</CardTitle>
                <CardDescription>Registration and service fees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-3 bg-slate-900/80 border border-slate-700 rounded-xl">
                    <span className="text-slate-300">{t(lang, 'cardFee')}</span>
                    <span className="text-xl font-bold text-emerald-400">30 ETB</span>
                  </div>
                  
                  {serviceType === 'ULTRASOUND' && (
                    <div className="flex items-center justify-between p-3 bg-slate-900/80 border border-slate-700 rounded-xl">
                      <span className="text-slate-300">Ultrasound Fee ({visitType === 'FOLLOW_UP' ? 'Follow-up' : 'One-time'})</span>
                      <span className="text-xl font-bold text-sky-400">{visitType === 'FOLLOW_UP' ? '400' : '200'} ETB</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-sky-500/10 to-emerald-500/10 border-2 border-sky-500/30 rounded-xl">
                    <span className="text-lg font-semibold text-slate-200">Total Amount</span>
                    <span className="text-3xl font-bold text-sky-400">
                      {30 + (serviceType === 'ULTRASOUND' ? (visitType === 'FOLLOW_UP' ? 400 : 200) : 0)} ETB
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <label className="flex-1">
                    <input type="radio" name="paymentMethod" value="cash" defaultChecked className="peer sr-only" />
                    <div className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-slate-700 peer-checked:border-sky-500 peer-checked:bg-sky-500/10 cursor-pointer transition-all">
                      <svg className="h-6 w-6 text-slate-400 peer-checked:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-semibold text-slate-200">{t(lang, 'cashOnly')}</span>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/reception')}>
                {t(lang, 'cancel')}
              </Button>
              <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>
                {isSubmitting 
                  ? t(lang, 'registering') 
                  : `Register & Pay ${30 + (serviceType === 'ULTRASOUND' ? (visitType === 'FOLLOW_UP' ? 400 : 200) : 0)} ETB`
                }
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
