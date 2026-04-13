const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LAB_TESTS = [
  // HEMATOLOGY
  { testCode: 'CBC', testName: 'Complete Blood Count', testCategory: 'Hematology', price: 150, normalRange: 'WBC: 4-11 x10^9/L, RBC: 4.5-5.5 x10^12/L, Hgb: 13-17 g/dL (M), 12-15 g/dL (F)' },
  { testCode: 'ESR', testName: 'Erythrocyte Sedimentation Rate', testCategory: 'Hematology', price: 80, normalRange: '0-15 mm/hr (M), 0-20 mm/hr (F)' },
  { testCode: 'HB', testName: 'Hemoglobin', testCategory: 'Hematology', price: 60, normalRange: '13-17 g/dL (M), 12-15 g/dL (F)' },
  { testCode: 'PCV', testName: 'Packed Cell Volume (Hematocrit)', testCategory: 'Hematology', price: 60, normalRange: '40-54% (M), 36-46% (F)' },
  { testCode: 'PLT', testName: 'Platelet Count', testCategory: 'Hematology', price: 80, normalRange: '150-400 x10^9/L' },
  { testCode: 'WBC', testName: 'White Blood Cell Count', testCategory: 'Hematology', price: 70, normalRange: '4-11 x10^9/L' },
  { testCode: 'DIFF', testName: 'Differential Count', testCategory: 'Hematology', price: 100, normalRange: 'Neutrophils: 40-75%, Lymphocytes: 20-45%' },
  { testCode: 'RETIC', testName: 'Reticulocyte Count', testCategory: 'Hematology', price: 120, normalRange: '0.5-2.5%' },
  { testCode: 'BG', testName: 'Blood Group & Rh', testCategory: 'Hematology', price: 100, normalRange: 'A, B, AB, O; Rh+ or Rh-' },
  { testCode: 'PT', testName: 'Prothrombin Time', testCategory: 'Hematology', price: 150, normalRange: '11-13.5 seconds' },
  { testCode: 'APTT', testName: 'Activated Partial Thromboplastin Time', testCategory: 'Hematology', price: 150, normalRange: '25-35 seconds' },
  { testCode: 'INR', testName: 'International Normalized Ratio', testCategory: 'Hematology', price: 120, normalRange: '0.8-1.2' },

  // CLINICAL CHEMISTRY
  { testCode: 'FBS', testName: 'Fasting Blood Sugar', testCategory: 'Clinical Chemistry', price: 80, normalRange: '70-100 mg/dL' },
  { testCode: 'RBS', testName: 'Random Blood Sugar', testCategory: 'Clinical Chemistry', price: 70, normalRange: '<140 mg/dL' },
  { testCode: 'HBA1C', testName: 'Glycated Hemoglobin (HbA1c)', testCategory: 'Clinical Chemistry', price: 250, normalRange: '4-5.6%' },
  { testCode: 'OGTT', testName: 'Oral Glucose Tolerance Test', testCategory: 'Clinical Chemistry', price: 200, normalRange: 'Fasting: <100, 2hr: <140 mg/dL' },
  
  // LIPID PROFILE
  { testCode: 'LIPID', testName: 'Lipid Profile (Complete)', testCategory: 'Clinical Chemistry', price: 300, normalRange: 'See individual components' },
  { testCode: 'CHOL', testName: 'Total Cholesterol', testCategory: 'Clinical Chemistry', price: 100, normalRange: '<200 mg/dL' },
  { testCode: 'TG', testName: 'Triglycerides', testCategory: 'Clinical Chemistry', price: 100, normalRange: '<150 mg/dL' },
  { testCode: 'HDL', testName: 'HDL Cholesterol', testCategory: 'Clinical Chemistry', price: 100, normalRange: '>40 mg/dL (M), >50 mg/dL (F)' },
  { testCode: 'LDL', testName: 'LDL Cholesterol', testCategory: 'Clinical Chemistry', price: 100, normalRange: '<100 mg/dL' },
  { testCode: 'VLDL', testName: 'VLDL Cholesterol', testCategory: 'Clinical Chemistry', price: 100, normalRange: '2-30 mg/dL' },

  // LIVER FUNCTION TESTS
  { testCode: 'LFT', testName: 'Liver Function Test (Complete)', testCategory: 'Clinical Chemistry', price: 350, normalRange: 'See individual components' },
  { testCode: 'ALT', testName: 'Alanine Aminotransferase (SGPT)', testCategory: 'Clinical Chemistry', price: 100, normalRange: '7-56 U/L' },
  { testCode: 'AST', testName: 'Aspartate Aminotransferase (SGOT)', testCategory: 'Clinical Chemistry', price: 100, normalRange: '10-40 U/L' },
  { testCode: 'ALP', testName: 'Alkaline Phosphatase', testCategory: 'Clinical Chemistry', price: 100, normalRange: '44-147 U/L' },
  { testCode: 'TBIL', testName: 'Total Bilirubin', testCategory: 'Clinical Chemistry', price: 80, normalRange: '0.1-1.2 mg/dL' },
  { testCode: 'DBIL', testName: 'Direct Bilirubin', testCategory: 'Clinical Chemistry', price: 80, normalRange: '0-0.3 mg/dL' },
  { testCode: 'IBIL', testName: 'Indirect Bilirubin', testCategory: 'Clinical Chemistry', price: 80, normalRange: '0.2-0.8 mg/dL' },
  { testCode: 'TP', testName: 'Total Protein', testCategory: 'Clinical Chemistry', price: 80, normalRange: '6.0-8.3 g/dL' },
  { testCode: 'ALB', testName: 'Albumin', testCategory: 'Clinical Chemistry', price: 80, normalRange: '3.5-5.5 g/dL' },
  { testCode: 'GLOB', testName: 'Globulin', testCategory: 'Clinical Chemistry', price: 80, normalRange: '2.0-3.5 g/dL' },
  { testCode: 'GGT', testName: 'Gamma-Glutamyl Transferase', testCategory: 'Clinical Chemistry', price: 120, normalRange: '8-61 U/L' },

  // RENAL FUNCTION TESTS
  { testCode: 'RFT', testName: 'Renal Function Test (Complete)', testCategory: 'Clinical Chemistry', price: 300, normalRange: 'See individual components' },
  { testCode: 'CREAT', testName: 'Creatinine', testCategory: 'Clinical Chemistry', price: 80, normalRange: '0.7-1.3 mg/dL (M), 0.6-1.1 mg/dL (F)' },
  { testCode: 'BUN', testName: 'Blood Urea Nitrogen', testCategory: 'Clinical Chemistry', price: 80, normalRange: '7-20 mg/dL' },
  { testCode: 'UREA', testName: 'Urea', testCategory: 'Clinical Chemistry', price: 80, normalRange: '15-40 mg/dL' },
  { testCode: 'UA', testName: 'Uric Acid', testCategory: 'Clinical Chemistry', price: 80, normalRange: '3.5-7.2 mg/dL (M), 2.6-6.0 mg/dL (F)' },
  { testCode: 'EGFR', testName: 'Estimated GFR', testCategory: 'Clinical Chemistry', price: 100, normalRange: '>60 mL/min/1.73m²' },

  // ELECTROLYTES
  { testCode: 'ELEC', testName: 'Electrolytes Panel', testCategory: 'Clinical Chemistry', price: 250, normalRange: 'See individual components' },
  { testCode: 'NA', testName: 'Sodium', testCategory: 'Clinical Chemistry', price: 80, normalRange: '136-145 mmol/L' },
  { testCode: 'K', testName: 'Potassium', testCategory: 'Clinical Chemistry', price: 80, normalRange: '3.5-5.1 mmol/L' },
  { testCode: 'CL', testName: 'Chloride', testCategory: 'Clinical Chemistry', price: 80, normalRange: '98-107 mmol/L' },
  { testCode: 'CA', testName: 'Calcium', testCategory: 'Clinical Chemistry', price: 80, normalRange: '8.5-10.5 mg/dL' },
  { testCode: 'MG', testName: 'Magnesium', testCategory: 'Clinical Chemistry', price: 100, normalRange: '1.7-2.2 mg/dL' },
  { testCode: 'PHOS', testName: 'Phosphorus', testCategory: 'Clinical Chemistry', price: 100, normalRange: '2.5-4.5 mg/dL' },

  // THYROID FUNCTION TESTS
  { testCode: 'TFT', testName: 'Thyroid Function Test (Complete)', testCategory: 'Endocrinology', price: 500, normalRange: 'See individual components' },
  { testCode: 'TSH', testName: 'Thyroid Stimulating Hormone', testCategory: 'Endocrinology', price: 200, normalRange: '0.4-4.0 mIU/L' },
  { testCode: 'T3', testName: 'Triiodothyronine (T3)', testCategory: 'Endocrinology', price: 200, normalRange: '80-200 ng/dL' },
  { testCode: 'T4', testName: 'Thyroxine (T4)', testCategory: 'Endocrinology', price: 200, normalRange: '5-12 µg/dL' },
  { testCode: 'FT3', testName: 'Free T3', testCategory: 'Endocrinology', price: 250, normalRange: '2.3-4.2 pg/mL' },
  { testCode: 'FT4', testName: 'Free T4', testCategory: 'Endocrinology', price: 250, normalRange: '0.8-1.8 ng/dL' },

  // CARDIAC MARKERS
  { testCode: 'TROP', testName: 'Troponin I', testCategory: 'Clinical Chemistry', price: 300, normalRange: '<0.04 ng/mL' },
  { testCode: 'CK', testName: 'Creatine Kinase', testCategory: 'Clinical Chemistry', price: 150, normalRange: '30-200 U/L (M), 25-170 U/L (F)' },
  { testCode: 'CKMB', testName: 'CK-MB', testCategory: 'Clinical Chemistry', price: 200, normalRange: '<5% of total CK' },
  { testCode: 'LDH', testName: 'Lactate Dehydrogenase', testCategory: 'Clinical Chemistry', price: 120, normalRange: '140-280 U/L' },

  // SEROLOGY & IMMUNOLOGY
  { testCode: 'CRP', testName: 'C-Reactive Protein', testCategory: 'Serology', price: 150, normalRange: '<10 mg/L' },
  { testCode: 'HSCRP', testName: 'High Sensitivity CRP', testCategory: 'Serology', price: 200, normalRange: '<3 mg/L' },
  { testCode: 'RF', testName: 'Rheumatoid Factor', testCategory: 'Serology', price: 180, normalRange: '<20 IU/mL' },
  { testCode: 'ASO', testName: 'Anti-Streptolysin O', testCategory: 'Serology', price: 150, normalRange: '<200 IU/mL' },
  { testCode: 'WIDAL', testName: 'Widal Test (Typhoid)', testCategory: 'Serology', price: 120, normalRange: 'Negative' },
  { testCode: 'VDRL', testName: 'VDRL (Syphilis)', testCategory: 'Serology', price: 150, normalRange: 'Non-reactive' },
  { testCode: 'HIV', testName: 'HIV Screening Test', testCategory: 'Serology', price: 200, normalRange: 'Negative' },
  { testCode: 'HBSAG', testName: 'Hepatitis B Surface Antigen', testCategory: 'Serology', price: 200, normalRange: 'Negative' },
  { testCode: 'HCVAB', testName: 'Hepatitis C Antibody', testCategory: 'Serology', price: 250, normalRange: 'Negative' },
  { testCode: 'TOXO', testName: 'Toxoplasma IgG/IgM', testCategory: 'Serology', price: 300, normalRange: 'Negative' },
  { testCode: 'RUBELLA', testName: 'Rubella IgG/IgM', testCategory: 'Serology', price: 300, normalRange: 'Negative' },
  { testCode: 'CMV', testName: 'Cytomegalovirus IgG/IgM', testCategory: 'Serology', price: 300, normalRange: 'Negative' },

  // MICROBIOLOGY
  { testCode: 'MALARIA', testName: 'Malaria Rapid Test', testCategory: 'Microbiology', price: 100, normalRange: 'Negative' },
  { testCode: 'MALARIAFILM', testName: 'Malaria Blood Film', testCategory: 'Microbiology', price: 120, normalRange: 'No parasites seen' },
  { testCode: 'HPYLORI', testName: 'H. Pylori Test', testCategory: 'Microbiology', price: 200, normalRange: 'Negative' },
  { testCode: 'BLOODCX', testName: 'Blood Culture & Sensitivity', testCategory: 'Microbiology', price: 400, normalRange: 'No growth' },
  { testCode: 'URINECX', testName: 'Urine Culture & Sensitivity', testCategory: 'Microbiology', price: 350, normalRange: 'No growth' },
  { testCode: 'STOOLCX', testName: 'Stool Culture & Sensitivity', testCategory: 'Microbiology', price: 350, normalRange: 'No growth' },
  { testCode: 'SPUTUMCX', testName: 'Sputum Culture & Sensitivity', testCategory: 'Microbiology', price: 350, normalRange: 'No growth' },

  // URINALYSIS
  { testCode: 'URINE', testName: 'Urinalysis (Complete)', testCategory: 'Urinalysis', price: 100, normalRange: 'See individual parameters' },
  { testCode: 'URINEDIP', testName: 'Urine Dipstick', testCategory: 'Urinalysis', price: 50, normalRange: 'Negative for protein, glucose, blood' },
  { testCode: 'URINEMICRO', testName: 'Urine Microscopy', testCategory: 'Urinalysis', price: 80, normalRange: 'WBC <5/hpf, RBC <3/hpf' },
  { testCode: 'UPROT', testName: 'Urine Protein', testCategory: 'Urinalysis', price: 80, normalRange: 'Negative' },
  { testCode: 'UGLUC', testName: 'Urine Glucose', testCategory: 'Urinalysis', price: 60, normalRange: 'Negative' },
  { testCode: 'UKET', testName: 'Urine Ketones', testCategory: 'Urinalysis', price: 60, normalRange: 'Negative' },
  { testCode: 'UPREG', testName: 'Urine Pregnancy Test', testCategory: 'Urinalysis', price: 80, normalRange: 'Negative (if not pregnant)' },
  { testCode: '24HPROT', testName: '24-Hour Urine Protein', testCategory: 'Urinalysis', price: 200, normalRange: '<150 mg/24hr' },

  // STOOL EXAMINATION
  { testCode: 'STOOL', testName: 'Stool Examination (Complete)', testCategory: 'Parasitology', price: 100, normalRange: 'No parasites, normal consistency' },
  { testCode: 'STOOLDP', testName: 'Stool for Ova & Parasites', testCategory: 'Parasitology', price: 80, normalRange: 'No ova or parasites seen' },
  { testCode: 'STOOLOB', testName: 'Stool Occult Blood', testCategory: 'Parasitology', price: 100, normalRange: 'Negative' },
  { testCode: 'STOOLFAT', testName: 'Stool for Fat Globules', testCategory: 'Parasitology', price: 80, normalRange: 'Negative' },

  // HORMONES
  { testCode: 'PREG', testName: 'Pregnancy Test (Beta-hCG)', testCategory: 'Endocrinology', price: 150, normalRange: '<5 mIU/mL (non-pregnant)' },
  { testCode: 'BHCG', testName: 'Beta-hCG (Quantitative)', testCategory: 'Endocrinology', price: 200, normalRange: 'Varies by gestational age' },
  { testCode: 'PROLAC', testName: 'Prolactin', testCategory: 'Endocrinology', price: 250, normalRange: '2-18 ng/mL (F), 2-15 ng/mL (M)' },
  { testCode: 'FSH', testName: 'Follicle Stimulating Hormone', testCategory: 'Endocrinology', price: 250, normalRange: 'Varies by phase/age' },
  { testCode: 'LH', testName: 'Luteinizing Hormone', testCategory: 'Endocrinology', price: 250, normalRange: 'Varies by phase/age' },
  { testCode: 'TESTO', testName: 'Testosterone', testCategory: 'Endocrinology', price: 300, normalRange: '300-1000 ng/dL (M), 15-70 ng/dL (F)' },
  { testCode: 'ESTRAD', testName: 'Estradiol', testCategory: 'Endocrinology', price: 300, normalRange: 'Varies by phase/age' },
  { testCode: 'PROGEST', testName: 'Progesterone', testCategory: 'Endocrinology', price: 250, normalRange: 'Varies by phase' },
  { testCode: 'CORTISOL', testName: 'Cortisol', testCategory: 'Endocrinology', price: 250, normalRange: '5-25 µg/dL (AM)' },

  // TUMOR MARKERS
  { testCode: 'PSA', testName: 'Prostate Specific Antigen', testCategory: 'Tumor Markers', price: 300, normalRange: '<4 ng/mL' },
  { testCode: 'CEA', testName: 'Carcinoembryonic Antigen', testCategory: 'Tumor Markers', price: 350, normalRange: '<3 ng/mL (non-smoker)' },
  { testCode: 'CA125', testName: 'Cancer Antigen 125', testCategory: 'Tumor Markers', price: 350, normalRange: '<35 U/mL' },
  { testCode: 'CA199', testName: 'Cancer Antigen 19-9', testCategory: 'Tumor Markers', price: 350, normalRange: '<37 U/mL' },
  { testCode: 'AFP', testName: 'Alpha-Fetoprotein', testCategory: 'Tumor Markers', price: 300, normalRange: '<10 ng/mL' },

  // VITAMINS & MINERALS
  { testCode: 'VITD', testName: 'Vitamin D (25-OH)', testCategory: 'Clinical Chemistry', price: 300, normalRange: '30-100 ng/mL' },
  { testCode: 'VITB12', testName: 'Vitamin B12', testCategory: 'Clinical Chemistry', price: 250, normalRange: '200-900 pg/mL' },
  { testCode: 'FOLATE', testName: 'Folic Acid', testCategory: 'Clinical Chemistry', price: 250, normalRange: '2.7-17 ng/mL' },
  { testCode: 'IRON', testName: 'Serum Iron', testCategory: 'Clinical Chemistry', price: 150, normalRange: '60-170 µg/dL (M), 50-150 µg/dL (F)' },
  { testCode: 'FERRITIN', testName: 'Ferritin', testCategory: 'Clinical Chemistry', price: 200, normalRange: '20-250 ng/mL (M), 10-120 ng/mL (F)' },
  { testCode: 'TIBC', testName: 'Total Iron Binding Capacity', testCategory: 'Clinical Chemistry', price: 150, normalRange: '250-450 µg/dL' },

  // SPECIAL TESTS
  { testCode: 'AMYLASE', testName: 'Amylase', testCategory: 'Clinical Chemistry', price: 150, normalRange: '30-110 U/L' },
  { testCode: 'LIPASE', testName: 'Lipase', testCategory: 'Clinical Chemistry', price: 150, normalRange: '0-160 U/L' },
  { testCode: 'G6PD', testName: 'G6PD Screening', testCategory: 'Hematology', price: 200, normalRange: 'Normal activity' },
  { testCode: 'SICKLECELL', testName: 'Sickle Cell Test', testCategory: 'Hematology', price: 150, normalRange: 'Negative' },
  { testCode: 'COOMBSDIR', testName: 'Direct Coombs Test', testCategory: 'Hematology', price: 180, normalRange: 'Negative' },
  { testCode: 'COOMBSINDIR', testName: 'Indirect Coombs Test', testCategory: 'Hematology', price: 180, normalRange: 'Negative' },
];

async function seedLabTests() {
  try {
    console.log('🧪 Seeding Lab Tests into MySQL Database...\n');

    // Check if tests already exist
    const existingCount = await prisma.labTest.count();
    console.log(`📊 Current lab tests in database: ${existingCount}`);

    if (existingCount > 0) {
      console.log('\n⚠️  Lab tests already exist. Do you want to:');
      console.log('   1. Skip seeding (keep existing tests)');
      console.log('   2. Add new tests only (skip duplicates)');
      console.log('   3. Clear all and reseed');
      console.log('\n💡 Running option 2: Add new tests only...\n');
    }

    let added = 0;
    let skipped = 0;
    let errors = 0;

    for (const test of LAB_TESTS) {
      try {
        // Check if test already exists
        const existing = await prisma.labTest.findFirst({
          where: { testCode: test.testCode }
        });

        if (existing) {
          console.log(`⏭️  Skipped: ${test.testCode} - ${test.testName} (already exists)`);
          skipped++;
        } else {
          await prisma.labTest.create({
            data: {
              testCode: test.testCode,
              testName: test.testName,
              testCategory: test.testCategory,
              price: test.price,
              normalRange: test.normalRange,
              isActive: true
            }
          });
          console.log(`✅ Added: ${test.testCode} - ${test.testName} (${test.testCategory}) - ${test.price} Birr`);
          added++;
        }
      } catch (error) {
        console.error(`❌ Error adding ${test.testCode}:`, error.message);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 SEEDING SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Tests added: ${added}`);
    console.log(`⏭️  Tests skipped: ${skipped}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📦 Total tests in database: ${await prisma.labTest.count()}`);
    console.log('='.repeat(60));

    // Show test categories summary
    console.log('\n📋 TESTS BY CATEGORY:');
    const categories = {};
    const allTests = await prisma.labTest.findMany({
      select: { testCategory: true }
    });
    
    allTests.forEach(test => {
      categories[test.testCategory] = (categories[test.testCategory] || 0) + 1;
    });

    Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} tests`);
    });

    console.log('\n🎉 Lab tests seeding completed successfully!');
    console.log('💡 You can now create lab orders with these tests.\n');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
seedLabTests()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
