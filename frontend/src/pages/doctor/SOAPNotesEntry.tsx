import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { toast } from '../../lib/toast';
import { api } from '../../lib/api';

const schema = z.object({
  subjective: z.string().min(10, 'Subjective notes must be at least 10 characters'),
  objective: z.string().min(10, 'Objective findings must be at least 10 characters'),
  assessment: z.string().min(10, 'Assessment must be at least 10 characters'),
  plan: z.string().min(10, 'Plan must be at least 10 characters'),
  chiefComplaint: z.string().min(3, 'Chief complaint is required'),
  vitalSigns: z.object({
    bloodPressure: z.string().optional(),
    temperature: z.string().optional(),
    heartRate: z.string().optional(),
    respiratoryRate: z.string().optional(),
    oxygenSaturation: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof schema>;

interface SOAPNotesEntryProps {
  visitId: string;
  patientId: string;
  patientName: string;
  cardNumber: string;
  onSaved?: () => void;
}

export const SOAPNotesEntry = ({ visitId, patientId, patientName, cardNumber, onSaved }: SOAPNotesEntryProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await api.post(`/visits/${visitId}/soap`, {
        ...data,
        patientId,
        isDraft: false,
      });
      setSuccess(true);
      toast.success('SOAP notes saved successfully.');
      onSaved?.();
    } catch (error) {
      toast.error('Failed to save SOAP notes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonComplaints = [
    'Fever', 'Headache', 'Cough', 'Abdominal Pain', 'Chest Pain',
    'Shortness of Breath', 'Dizziness', 'Fatigue', 'Nausea', 'Back Pain'
  ];

  const quickTemplates = {
    subjective: [
      'Patient reports...',
      'Patient complains of...',
      'Patient states...',
      'Patient denies...',
    ],
    objective: [
      'Patient appears...',
      'Vital signs stable',
      'Physical examination reveals...',
      'No acute distress noted',
    ],
    assessment: [
      'Likely diagnosis:',
      'Differential diagnosis includes:',
      'Working diagnosis:',
      'Clinical impression:',
    ],
    plan: [
      'Prescribe medication',
      'Order laboratory tests',
      'Schedule follow-up',
      'Patient education provided',
    ],
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
            <h2 className="text-2xl font-bold text-slate-50 mb-2">SOAP Notes Saved!</h2>
            <p className="text-slate-400 mb-6">Clinical documentation has been recorded successfully</p>
            <div className="flex gap-3">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  setSuccess(false);
                  reset();
                }}
              >
                View Patient Chart
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => setSuccess(false)}>
                Next Patient
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">SOAP Notes Entry</h1>
            <p className="text-slate-400 mt-1">Clinical documentation for {patientName}</p>
          </div>
          <Badge variant="info">{cardNumber}</Badge>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient Info Summary */}
          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-sky-500/20 to-violet-500/20 flex items-center justify-center text-lg font-bold text-slate-200">
                  {patientName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-slate-50 text-lg">{patientName}</p>
                  <p className="text-sm text-slate-400">Card: {cardNumber} • Age: 45 • Male</p>
                </div>
              </div>
              <Button type="button" variant="outline" size="sm">
                View Full Chart
              </Button>
            </CardContent>
          </Card>

          {/* Chief Complaint */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Chief Complaint</CardTitle>
              <CardDescription>Primary reason for visit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Chief Complaint"
                placeholder="e.g., Fever for 3 days"
                error={errors.chiefComplaint?.message}
                {...register('chiefComplaint')}
                required
              />

              <div>
                <p className="text-sm font-semibold text-slate-300 mb-2">Common Complaints (Quick Select)</p>
                <div className="flex flex-wrap gap-2">
                  {commonComplaints.map((complaint) => (
                    <button
                      key={complaint}
                      type="button"
                      onClick={() => {
                        setValue('chiefComplaint', complaint, { shouldValidate: true });
                      }}
                      className="px-3 py-1.5 text-sm rounded-lg border border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all"
                    >
                      {complaint}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vital Signs */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Vital Signs</CardTitle>
              <CardDescription>Current vital signs (auto-filled by nurse if available)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Input
                  label="Blood Pressure"
                  placeholder="120/80 mmHg"
                  {...register('vitalSigns.bloodPressure')}
                />
                <Input
                  label="Temperature"
                  placeholder="37.0 °C"
                  {...register('vitalSigns.temperature')}
                />
                <Input
                  label="Heart Rate"
                  placeholder="72 bpm"
                  {...register('vitalSigns.heartRate')}
                />
                <Input
                  label="Respiratory Rate"
                  placeholder="16 /min"
                  {...register('vitalSigns.respiratoryRate')}
                />
                <Input
                  label="O2 Saturation"
                  placeholder="98 %"
                  {...register('vitalSigns.oxygenSaturation')}
                />
              </div>
            </CardContent>
          </Card>

          {/* SOAP Notes */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>SOAP Documentation</CardTitle>
              <CardDescription>Structured clinical notes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subjective */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    Subjective <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-1">
                    {quickTemplates.subjective.map((template, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setValue('subjective', template, { shouldValidate: true });
                        }}
                        className="px-2 py-1 text-xs rounded border border-slate-700 bg-slate-900/60 text-slate-400 hover:text-slate-300 hover:border-slate-600"
                      >
                        {template.slice(0, 15)}...
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none resize-none"
                  rows={4}
                  placeholder="Patient's description of symptoms, history of present illness, relevant past medical history..."
                  {...register('subjective')}
                />
                {errors.subjective && (
                  <p className="mt-2 text-sm text-red-400">{errors.subjective.message}</p>
                )}
              </div>

              {/* Objective */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    Objective <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-1">
                    {quickTemplates.objective.map((template, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setValue('objective', template, { shouldValidate: true });
                        }}
                        className="px-2 py-1 text-xs rounded border border-slate-700 bg-slate-900/60 text-slate-400 hover:text-slate-300 hover:border-slate-600"
                      >
                        {template.slice(0, 15)}...
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none resize-none"
                  rows={4}
                  placeholder="Physical examination findings, vital signs, laboratory results, imaging findings..."
                  {...register('objective')}
                />
                {errors.objective && (
                  <p className="mt-2 text-sm text-red-400">{errors.objective.message}</p>
                )}
              </div>

              {/* Assessment */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    Assessment <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-1">
                    {quickTemplates.assessment.map((template, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setValue('assessment', template, { shouldValidate: true });
                        }}
                        className="px-2 py-1 text-xs rounded border border-slate-700 bg-slate-900/60 text-slate-400 hover:text-slate-300 hover:border-slate-600"
                      >
                        {template.slice(0, 15)}...
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none resize-none"
                  rows={4}
                  placeholder="Diagnosis, differential diagnosis, clinical impression, ICD codes..."
                  {...register('assessment')}
                />
                {errors.assessment && (
                  <p className="mt-2 text-sm text-red-400">{errors.assessment.message}</p>
                )}
              </div>

              {/* Plan */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    Plan <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-1">
                    {quickTemplates.plan.map((template, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setValue('plan', template, { shouldValidate: true });
                        }}
                        className="px-2 py-1 text-xs rounded border border-slate-700 bg-slate-900/60 text-slate-400 hover:text-slate-300 hover:border-slate-600"
                      >
                        {template.slice(0, 15)}...
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none resize-none"
                  rows={4}
                  placeholder="Treatment plan, medications, tests ordered, follow-up instructions, patient education..."
                  {...register('plan')}
                />
                {errors.plan && (
                  <p className="mt-2 text-sm text-red-400">{errors.plan.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common next steps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button type="button" variant="secondary" size="sm">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Prescribe
                </Button>
                <Button type="button" variant="secondary" size="sm">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Order Lab
                </Button>
                <Button type="button" variant="secondary" size="sm">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Imaging
                </Button>
                <Button type="button" variant="secondary" size="sm">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Follow-up
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleSubmit(async (data) => {
                try {
                  setIsSubmitting(true);
                  await api.post(`/visits/${visitId}/soap`, {
                    ...data,
                    patientId,
                    isDraft: true,
                  });
                  toast.success('SOAP draft saved.');
                } catch (_error) {
                  toast.error('Failed to save draft.');
                } finally {
                  setIsSubmitting(false);
                }
              })}
            >
              Save as Draft
            </Button>
            <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save & Complete Consultation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
