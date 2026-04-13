import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDemoData() {
  console.log('Starting full demo data cleanup (keeping schema)...');

  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.userSession.deleteMany(),

    prisma.invoiceItem.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.financialTransaction.deleteMany(),

    prisma.labOrderItem.deleteMany(),
    prisma.labOrder.deleteMany(),
    prisma.prescriptionItem.deleteMany(),
    prisma.prescription.deleteMany(),
    prisma.ultrasoundOrder.deleteMany(),
    prisma.injectionOrder.deleteMany(),
    prisma.patientVisit.deleteMany(),

    prisma.pharmacyStock.deleteMany(),

    prisma.patient.deleteMany(),
  ]);

  console.log('Operational records cleared.');

  // Keep only super admin user accounts to preserve access.
  await prisma.user.deleteMany({
    where: {
      role: {
        not: 'SUPER_ADMIN',
      },
    },
  });

  console.log('Non-admin user accounts removed.');
  console.log('Demo cleanup completed successfully.');
}

clearDemoData()
  .catch((error) => {
    console.error('Demo cleanup failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

