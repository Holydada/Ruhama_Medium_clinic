import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting production-safe database seed...');

  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@ruhama.com';
  /** Align with create-all-users.ts / list-and-reset-password.ts unless overridden in .env */
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'Test@123';
  const superAdminName = process.env.SUPER_ADMIN_NAME || 'Super Admin';

  console.log(`Creating admin with password: ${superAdminPassword}`);
  const passwordHash = await bcrypt.hash(superAdminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {
      passwordHash,
      fullName: superAdminName,
      isActive: true,
      isApproved: true,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
    create: {
      email: superAdminEmail,
      passwordHash,
      fullName: superAdminName,
      role: 'SUPER_ADMIN',
      department: 'Administration',
      employmentType: 'FULL_TIME',
      isActive: true,
      isApproved: true,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log(`Super admin is ready: ${admin.email}`);

  /** Default lab catalog — required for doctor lab orders and lab workflow (upsert by testCode). */
  const labTests: Array<{
    testCode: string;
    testName: string;
    testCategory: string;
    sampleType: string;
    unit: string;
    normalRange: string;
    price: number;
    turnaroundTime: number;
    description?: string;
  }> = [
    {
      testCode: 'CBC',
      testName: 'Complete Blood Count (CBC)',
      testCategory: 'Hematology',
      sampleType: 'Whole blood',
      unit: '—',
      normalRange: 'WBC 4–11 ×10³/µL; Hgb 12–16 g/dL (varies)',
      price: 280,
      turnaroundTime: 24,
      description: 'Full blood count with differential',
    },
    {
      testCode: 'BF',
      testName: 'Blood Film / Peripheral smear',
      testCategory: 'Hematology',
      sampleType: 'Whole blood',
      unit: '—',
      normalRange: 'Morphology as reported',
      price: 150,
      turnaroundTime: 24,
    },
    {
      testCode: 'ESR',
      testName: 'Erythrocyte Sedimentation Rate (ESR)',
      testCategory: 'Hematology',
      sampleType: 'Whole blood',
      unit: 'mm/hr',
      normalRange: '0–20 (adult)',
      price: 120,
      turnaroundTime: 24,
    },
    {
      testCode: 'RBS',
      testName: 'Random Blood Sugar',
      testCategory: 'Chemistry',
      sampleType: 'Whole blood / plasma',
      unit: 'mg/dL',
      normalRange: '70–140 (context-dependent)',
      price: 100,
      turnaroundTime: 4,
    },
    {
      testCode: 'FBS',
      testName: 'Fasting Blood Sugar',
      testCategory: 'Chemistry',
      sampleType: 'Plasma',
      unit: 'mg/dL',
      normalRange: '70–100',
      price: 120,
      turnaroundTime: 4,
    },
    {
      testCode: 'LFT',
      testName: 'Liver Function Panel (AST, ALT, ALP, Bilirubin)',
      testCategory: 'Chemistry',
      sampleType: 'Serum',
      unit: '—',
      normalRange: 'See components',
      price: 450,
      turnaroundTime: 24,
    },
    {
      testCode: 'RFT',
      testName: 'Renal Function (Creatinine, Urea/eGFR)',
      testCategory: 'Chemistry',
      sampleType: 'Serum',
      unit: '—',
      normalRange: 'Creatinine per lab ref',
      price: 380,
      turnaroundTime: 24,
    },
    {
      testCode: 'LIPID',
      testName: 'Lipid Profile',
      testCategory: 'Chemistry',
      sampleType: 'Serum',
      unit: 'mg/dL',
      normalRange: 'LDL/HDL per risk profile',
      price: 420,
      turnaroundTime: 24,
    },
    {
      testCode: 'HbA1c',
      testName: 'Glycated Hemoglobin (HbA1c)',
      testCategory: 'Chemistry',
      sampleType: 'Whole blood',
      unit: '%',
      normalRange: '<5.7 normal; 5.7–6.4 prediabetes',
      price: 550,
      turnaroundTime: 48,
    },
    {
      testCode: 'URINE_R',
      testName: 'Urinalysis (Routine)',
      testCategory: 'Urinalysis',
      sampleType: 'Urine',
      unit: '—',
      normalRange: 'Neg trace findings',
      price: 180,
      turnaroundTime: 4,
    },
    {
      testCode: 'U_CULT',
      testName: 'Urine Culture & Sensitivity',
      testCategory: 'Microbiology',
      sampleType: 'Urine',
      unit: '—',
      normalRange: 'No growth / sensitive report',
      price: 650,
      turnaroundTime: 72,
    },
    {
      testCode: 'BLOOD_CULT',
      testName: 'Blood Culture',
      testCategory: 'Microbiology',
      sampleType: 'Blood',
      unit: '—',
      normalRange: 'No growth / ID & sensitivity',
      price: 900,
      turnaroundTime: 120,
    },
    {
      testCode: 'WIDAL',
      testName: 'Widal (Typhoid serology)',
      testCategory: 'Serology',
      sampleType: 'Serum',
      unit: 'titre',
      normalRange: 'Non-reactive / per lab',
      price: 200,
      turnaroundTime: 24,
    },
    {
      testCode: 'HIV_SCR',
      testName: 'HIV Screening (rapid/serology)',
      testCategory: 'Serology',
      sampleType: 'Serum',
      unit: '—',
      normalRange: 'Non-reactive',
      price: 150,
      turnaroundTime: 4,
    },
    {
      testCode: 'CRP',
      testName: 'C-Reactive Protein (CRP)',
      testCategory: 'Serology',
      sampleType: 'Serum',
      unit: 'mg/L',
      normalRange: '<10',
      price: 320,
      turnaroundTime: 24,
    },
  ];

  for (const t of labTests) {
    await prisma.labTest.upsert({
      where: { testCode: t.testCode },
      update: {
        testName: t.testName,
        testCategory: t.testCategory,
        sampleType: t.sampleType,
        unit: t.unit,
        normalRange: t.normalRange,
        price: t.price,
        turnaroundTime: t.turnaroundTime,
        description: t.description ?? null,
        isActive: true,
      },
      create: {
        testCode: t.testCode,
        testName: t.testName,
        testCategory: t.testCategory,
        sampleType: t.sampleType,
        unit: t.unit,
        normalRange: t.normalRange,
        price: t.price,
        turnaroundTime: t.turnaroundTime,
        description: t.description ?? null,
        isActive: true,
      },
    });
  }
  console.log(`Seeded ${labTests.length} lab tests (catalog).`);

  // Link the first existing doctor as this super admin's clinical persona (doctor mode + supervision).
  const doctor = await prisma.user.findFirst({
    where: {
      role: 'DOCTOR',
      id: { not: admin.id },
    },
    orderBy: { createdAt: 'asc' },
  });
  if (doctor) {
    await prisma.user.update({
      where: { id: admin.id },
      data: { clinicalPersonaUserId: doctor.id },
    });
    await prisma.user.update({
      where: { id: doctor.id },
      data: { supervisedByUserId: admin.id },
    });
    console.log(
      `Linked doctor "${doctor.fullName}" (${doctor.email}) as clinical persona under super admin. Use "Doctor mode" in the header after login.`
    );
  } else {
    console.log('No separate doctor user found — add a DOCTOR user, then run seed again or set clinicalPersonaUserId in the database.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
