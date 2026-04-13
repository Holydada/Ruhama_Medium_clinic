import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { toast } from '../../lib/toast';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

const schema = z.object({
  bloodPressureSystolic: z.number().min(50).max(250),
  bloodPressureDiastolic: z.number().min(30).max(150),
  temperature: z.number().min(35).max(42),
  heartRate: z.number().min(40).max(200),
  respiratoryRate: z.number().min(8).max(40),
  oxygenSaturation: z.number().min(70).max(100),
  weight: z.number().min(1).max(300).optional(),
  height: z.number().min(50).max(250).optional(),
  bmi: z.number().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Patient {
  id: string;
  cardNumber: string;
  fullName: string;
  age: number;
  gender: string;
}

interface VitalsEntryProps {
  patient: Patient;
  visitId?: string;
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
  onAfterSuccess?: () => void;
}

export const VitalsEntry = ({
  patient,
  visitId,
  onSubmit,
  onCancel,
  onAfterSuccess,
}: VitalsEntryProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const weight = watch('weight');
  const height = watch('height');

  // Calculate BMI automatically
  const calculateBMI = () => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      setValue('bmi', parseFloat(bmi.toFixed(1)));
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-sky-400' };
    if (bmi < 25) return { category: 'Normal', color: 'text-emerald-400' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-amber-400' };
    return { category: 'Obese', color: 'text-red-400' };
  };

  const getVitalStatus = (vital: string, value: number) => {
    const ranges: Record<string, { low: number; high: number }> = {
      systolic: { low: 90, high: 140 },
      diastolic: { low: 60, high: 90 },
      temperature: { low: 36.5, high: 37.5 },
      heartRate: { low: 60, high: 100 },
      respiratoryRate: { low: 12, high: 20 },
      oxygenSaturation: { low: 95, high: 100 },
    };

    const range = ranges[vital];
    if (!range) return 'normal';
    
    if (value < range.low) return 'low';
    if (value > range.high) return 'high';
    return 'normal';
  };

  const handleFormSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      if (visitId) {
        const payload: Record<string, unknown> = {
          bloodPressureSystolic: data.bloodPressureSystolic,
          bloodPressureDiastolic: data.bloodPressureDiastolic,
          temperature: data.temperature,
          heartRate: data.heartRate,
          respiratoryRate: data.respiratoryRate,
          oxygenSaturation: data.oxygenSaturation,
        };
        if (Number.isFinite(data.weight)) payload.weight = data.weight;
        if (Number.isFinite(data.height)) payload.height = data.height;
        if (Number.isFinite(data.bmi)) payload.bmi = data.bmi;
        if (data.notes?.trim()) payload.notes = data.notes.trim();
        await api.post(`/visits/${visitId}/nurse-vitals`, payload);
      } else if (onSubmit) {
        onSubmit(data);
      } else {
        toast.error('Vitals cannot be saved: no visit selected.');
        return;
      }

      setSuccess(true);
      toast.success('Vital signs saved successfully.');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to save vital signs.');
    } finally {
      setIsSubmitting(false);
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
            <h2 className="text-2xl font-bold text-slate-50 mb-2">Vitals Recorded!</h2>
            <p className="text-slate-400 mb-6">Vital signs have been saved successfully</p>
            
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                type="button"
                onClick={() => navigate('/nurse-dashboard')}
              >
                Back to nurse dashboard
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                type="button"
                onClick={() => {
                  setSuccess(false);
                  onAfterSuccess?.();
                }}
              >
                Next patient
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Vital Signs Entry</h1>
            <p className="text-slate-400 mt-1">Record patient vital signs</p>
          </div>
          <Badge variant="info">{patient.cardNumber}</Badge>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Patient Info */}
          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-sky-500/20 to-violet-500/20 flex items-center justify-center text-lg font-bold text-slate-200">
                  {patient.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-slate-50 text-lg">{patient.fullName}</p>
                  <p className="text-sm text-slate-400">
                    Card: {patient.cardNumber} • Age: {patient.age} • {patient.gender}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Time</p>
                <p className="font-semibold text-slate-50">{new Date().toLocaleTimeString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Primary Vitals */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Primary Vital Signs</CardTitle>
              <CardDescription>Core measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blood Pressure */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Blood Pressure <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="120"
                        className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 text-center text-2xl font-bold placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                        {...register('bloodPressureSystolic', { valueAsNumber: true })}
                      />
                      <p className="text-xs text-slate-500 text-center mt-1">Systolic</p>
                    </div>
                    <span className="text-3xl text-slate-400 font-bold">/</span>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="80"
                        className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 text-center text-2xl font-bold placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                        {...register('bloodPressureDiastolic', { valueAsNumber: true })}
                      />
                      <p className="text-xs text-slate-500 text-center mt-1">Diastolic</p>
                    </div>
                    <span className="text-slate-500 font-semibold">mmHg</span>
                  </div>
                  {(errors.bloodPressureSystolic || errors.bloodPressureDiastolic) && (
                    <p className="mt-2 text-sm text-red-400">Valid blood pressure required (50-250 / 30-150)</p>
                  )}
                </div>

                {/* Temperature */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Temperature <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="37.0"
                      className="block w-full px-4 py-3 pr-12 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 text-center text-2xl font-bold placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                      {...register('temperature', { valueAsNumber: true })}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">°C</span>
                  </div>
                  {errors.temperature && (
                    <p className="mt-2 text-sm text-red-400">Range: 35-42°C</p>
                  )}
                </div>

                {/* Heart Rate */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Heart Rate <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="72"
                      className="block w-full px-4 py-3 pr-16 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 text-center text-2xl font-bold placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                      {...register('heartRate', { valueAsNumber: true })}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">bpm</span>
                  </div>
                  {errors.heartRate && (
                    <p className="mt-2 text-sm text-red-400">Range: 40-200 bpm</p>
                  )}
                </div>

                {/* Respiratory Rate */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Respiratory Rate <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="16"
                      className="block w-full px-4 py-3 pr-16 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 text-center text-2xl font-bold placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                      {...register('respiratoryRate', { valueAsNumber: true })}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">/min</span>
                  </div>
                  {errors.respiratoryRate && (
                    <p className="mt-2 text-sm text-red-400">Range: 8-40 /min</p>
                  )}
                </div>

                {/* Oxygen Saturation */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    O2 Saturation <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="98"
                      className="block w-full px-4 py-3 pr-12 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 text-center text-2xl font-bold placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                      {...register('oxygenSaturation', { valueAsNumber: true })}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                  </div>
                  {errors.oxygenSaturation && (
                    <p className="mt-2 text-sm text-red-400">Range: 70-100%</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Anthropometric Measurements */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Anthropometric Measurements</CardTitle>
              <CardDescription>Weight, height, and BMI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Weight
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="70.0"
                      className="block w-full px-4 py-3 pr-12 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 text-center text-xl font-bold placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                      {...register('weight', { valueAsNumber: true })}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">kg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Height
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="170"
                      className="block w-full px-4 py-3 pr-12 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 text-center text-xl font-bold placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                      {...register('height', { valueAsNumber: true })}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">cm</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    BMI (Auto-calculated)
                  </label>
                  <div className="p-3 rounded-xl border border-slate-700 bg-slate-900/60 text-center">
                    {bmi ? (
                      <>
                        <p className={`text-2xl font-bold ${bmiInfo?.color}`}>{bmi}</p>
                        <p className="text-xs text-slate-400 mt-1">{bmiInfo?.category}</p>
                      </>
                    ) : (
                      <p className="text-slate-500 text-sm py-2">Enter weight & height</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>Any observations or concerns</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none resize-none"
                rows={3}
                placeholder="Any additional observations..."
                {...register('notes')}
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => (onCancel ? onCancel() : navigate(-1))}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Vital Signs'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
