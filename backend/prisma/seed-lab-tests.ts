import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LAB_TESTS = [
  // HEMATOLOGY
  { testCode: 'CBC', testName: 'Complete Blood Count (CBC)', testCategory: 'Hematology', sampleType: 'Whole Blood', price: 150, turnaroundTime: 60 },
  { testCode: 'ESR', testName: 'Erythrocyte Sedimentation Rate (ESR)', testCategory: 'Hematology', sampleType: 'Whole Blood', price: 50, turnaroundTime: 120 },
  { testCode: 'BLOOD_GROUP', testName: 'Blood Group & Rh', testCategory: 'Hematology', sampleType: 'Whole Blood', price: 80, turnaroundTime: 30 },
  { testCode: 'HGB', testName: 'Hemoglobin', testCategory: 'Hematology', sampleType: 'Whole Blood', price: 40, turnaroundTime: 30 },
  { testCode: 'HCT', testName: 'Hematocrit', testCategory: 'Hematology', sampleType: 'Whole Blood', price: 40, turnaroundTime: 30 },
  { testCode: 'WBC', testName: 'White Blood Cell Count', testCategory: 'Hematology', sampleType: 'Whole Blood', price: 50, turnaroundTime: 30 },
  { testCode: 'PLT', testName: 'Platelet Count', testCategory: 'Hematology', sampleType: 'Whole Blood', price: 50, turnaroundTime: 30 },
  
  // SEROLOGY
  { testCode: 'RPR', testName: 'RPR/VDRL (Syphilis)', testCategory: 'Serology', sampleType: 'Serum', price: 100, turnaroundTime: 120 },
  { testCode: 'HBSAG', testName: 'HBsAg (Hepatitis B Surface Antigen)', testCategory: 'Serology', sampleType: 'Serum', price: 150, turnaroundTime: 120 },
  { testCode: 'HCV', testName: 'HCV (Hepatitis C Virus)', testCategory: 'Serology', sampleType: 'Serum', price: 200, turnaroundTime: 120 },
  { testCode: 'HIV', testName: 'HIV Rapid Test', testCategory: 'Serology', sampleType: 'Serum', price: 100, turnaroundTime: 30 },
  { testCode: 'H_PYLORI', testName: 'H. pylori Antibody', testCategory: 'Serology', sampleType: 'Serum', price: 180, turnaroundTime: 120 },
  { testCode: 'RF', testName: 'Rheumatoid Factor (RF)', testCategory: 'Serology', sampleType: 'Serum', price: 120, turnaroundTime: 120 },
  { testCode: 'WIDAL_O', testName: 'Widal Test - O Antigen', testCategory: 'Serology', sampleType: 'Serum', price: 80, turnaroundTime: 120 },
  { testCode: 'WIDAL_H', testName: 'Widal Test - H Antigen', testCategory: 'Serology', sampleType: 'Serum', price: 80, turnaroundTime: 120 },
  { testCode: 'WEIL_FELIX', testName: 'Weil-Felix Test', testCategory: 'Serology', sampleType: 'Serum', price: 100, turnaroundTime: 120 },
  { testCode: 'ASO', testName: 'ASO Titer (Anti-Streptolysin O)', testCategory: 'Serology', sampleType: 'Serum', price: 120, turnaroundTime: 120 },
  { testCode: 'PICT', testName: 'PICT (Pregnancy Immunochromatographic Test)', testCategory: 'Serology', sampleType: 'Urine/Serum', price: 50, turnaroundTime: 15 },
  
  // PARASITOLOGY
  { testCode: 'BLOOD_FILM', testName: 'Blood Film for Malaria', testCategory: 'Parasitology', sampleType: 'Blood', price: 80, turnaroundTime: 60 },
  { testCode: 'STOOL_EXAM', testName: 'Stool Examination (Ova & Parasites)', testCategory: 'Parasitology', sampleType: 'Stool', price: 60, turnaroundTime: 60 },
  { testCode: 'AFB', testName: 'AFB (Acid Fast Bacilli) - TB Test', testCategory: 'Parasitology', sampleType: 'Sputum', price: 100, turnaroundTime: 180 },
  
  // URINALYSIS
  { testCode: 'URINALYSIS', testName: 'Urinalysis (Routine)', testCategory: 'Urinalysis', sampleType: 'Urine', price: 50, turnaroundTime: 30 },
  { testCode: 'URINE_CULTURE', testName: 'Urine Culture & Sensitivity', testCategory: 'Urinalysis', sampleType: 'Urine', price: 250, turnaroundTime: 2880 },
  { testCode: 'URINE_HCG', testName: 'Urine HCG (Pregnancy Test)', testCategory: 'Urinalysis', sampleType: 'Urine', price: 50, turnaroundTime: 15 },
  { testCode: 'URINE_PROTEIN', testName: 'Urine Protein', testCategory: 'Urinalysis', sampleType: 'Urine', price: 40, turnaroundTime: 30 },
  { testCode: 'URINE_GLUCOSE', testName: 'Urine Glucose', testCategory: 'Urinalysis', sampleType: 'Urine', price: 40, turnaroundTime: 30 },
  
  // CHEMISTRY
  { testCode: 'CREATININE', testName: 'Creatinine', testCategory: 'Chemistry', sampleType: 'Serum', normalRange: '0.6-1.2 mg/dL', unit: 'mg/dL', price: 80, turnaroundTime: 120 },
  { testCode: 'BLOOD_UREA', testName: 'Blood Urea Nitrogen (BUN)', testCategory: 'Chemistry', sampleType: 'Serum', normalRange: '7-20 mg/dL', unit: 'mg/dL', price: 80, turnaroundTime: 120 },
  { testCode: 'SGOT', testName: 'SGOT (AST)', testCategory: 'Chemistry', sampleType: 'Serum', normalRange: '5-40 U/L', unit: 'U/L', price: 100, turnaroundTime: 120 },
  { testCode: 'SGPT', testName: 'SGPT (ALT)', testCategory: 'Chemistry', sampleType: 'Serum', normalRange: '7-56 U/L', unit: 'U/L', price: 100, turnaroundTime: 120 },
  { testCode: 'FBS', testName: 'Fasting Blood Sugar (FBS)', testCategory: 'Chemistry', sampleType: 'Serum', normalRange: '70-100 mg/dL', unit: 'mg/dL', price: 50, turnaroundTime: 60 },
  { testCode: 'RBS', testName: 'Random Blood Sugar (RBS)', testCategory: 'Chemistry', sampleType: 'Serum', normalRange: '70-140 mg/dL', unit: 'mg/dL', price: 50, turnaroundTime: 60 },
  { testCode: 'CHOLESTEROL', testName: 'Total Cholesterol', testCategory: 'Chemistry', sampleType: 'Serum', normalRange: '<200 mg/dL', unit: 'mg/dL', price: 80, turnaroundTime: 120 },
  { testCode: 'TRIGLYCERIDE', testName: 'Triglycerides', testCategory: 'Chemistry', sampleType: 'Serum', normalRange: '<150 mg/dL', unit: 'mg/dL', price: 80, turnaroundTime: 120 },
  { testCode: 'HDL', testName: 'HDL Cholesterol', testCategory: 'Chemistry', sampleType: 'Serum', normalRange: '>40 mg/dL', unit: 'mg/dL', price: 100, turnaroundTime: 120 },
  { testCode: 'LDL', testName: 'LDL Cholesterol', testCategory: 'Chemistry', sampleType: 'Serum', normalRange: '<100 mg/dL', unit: 'mg/dL', price: 100, turnaroundTime: 120 },
  { testCode: 'ALBUMIN', testName: 'Albumin', testCategory: 'Chemistry', sampleType: 'Serum', normalRange: '3.5-5.5 g/dL', unit: 'g/dL', price: 80, turnaroundTime: 120 },
  { testCode: 'TOTAL_PROTEIN', testName: 'Total Protein', testCategory: 'Chemistry', sampleType: 'Serum', normalRange: '6.0-8.3 g/dL', unit: 'g/dL', price: 80, turnaroundTime: 120 },
  { testCode: 'ALP', testName: 'Alkaline Phosphatase (ALP)', testCategory: 'Chemistry', sampleType: 'Serum', normalRange: '30-120 U/L', unit: 'U/L', price: 100, turnaroundTime: 120 },
  { testCode: 'BILIRUBIN_TOTAL', testName: 'Bilirubin (Total)', testCategory: 'Chemistry', sampleType: 'Serum', normalRange: '0.1-1.2 mg/dL', unit: 'mg/dL', price: 80, turnaroundTime: 120 },
  { testCode: 'BILIRUBIN_DIRECT', testName: 'Bilirubin (Direct)', testCategory: 'Chemistry', sampleType: 'Serum', normalRange: '0.0-0.3 mg/dL', unit: 'mg/dL', price: 80, turnaroundTime: 120 },
  { testCode: 'URIC_ACID', testName: 'Uric Acid', testCategory: 'Chemistry', sampleType: 'Serum', normalRange: '3.5-7.2 mg/dL', unit: 'mg/dL', price: 80, turnaroundTime: 120 },
  { testCode: 'ELECTROLYTES', testName: 'Electrolytes (Na, K, Cl)', testCategory: 'Chemistry', sampleType: 'Serum', price: 150, turnaroundTime: 120 },
  { testCode: 'CALCIUM', testName: 'Calcium', testCategory: 'Chemistry', sampleType: 'Serum', normalRange: '8.5-10.5 mg/dL', unit: 'mg/dL', price: 80, turnaroundTime: 120 },
  { testCode: 'MAGNESIUM', testName: 'Magnesium', testCategory: 'Chemistry', sampleType: 'Serum', normalRange: '1.7-2.2 mg/dL', unit: 'mg/dL', price: 80, turnaroundTime: 120 },
  
  // COAGULATION
  { testCode: 'PT', testName: 'Prothrombin Time (PT)', testCategory: 'Coagulation', sampleType: 'Plasma', price: 120, turnaroundTime: 120 },
  { testCode: 'PTT', testName: 'Partial Thromboplastin Time (PTT)', testCategory: 'Coagulation', sampleType: 'Plasma', price: 120, turnaroundTime: 120 },
  { testCode: 'INR', testName: 'INR (International Normalized Ratio)', testCategory: 'Coagulation', sampleType: 'Plasma', price: 100, turnaroundTime: 120 },
];

async function seedLabTests() {
  console.log('🧪 Seeding lab tests...');
  
  for (const test of LAB_TESTS) {
    try {
      await prisma.labTest.upsert({
        where: { testCode: test.testCode },
        update: test,
        create: test,
      });
      console.log(`✅ ${test.testName}`);
    } catch (error) {
      console.error(`❌ Failed to seed ${test.testName}:`, error);
    }
  }
  
  console.log('✅ Lab tests seeded successfully!');
}

seedLabTests()
  .catch((e) => {
    console.error('Error seeding lab tests:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
