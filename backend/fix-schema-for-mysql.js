const fs = require('fs');
const path = require('path');

console.log('Fixing Prisma schema for MySQL compatibility...\n');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Fix 1: Replace String[] with String (JSON or Text)
console.log('1. Converting String[] arrays to JSON strings...');
schema = schema.replace(/attachments\s+String\[\]/g, 'attachments String? @db.Text');
schema = schema.replace(/proceduresPerformed\s+String\[\]/g, 'proceduresPerformed String? @db.Text');
schema = schema.replace(/medicationsGiven\s+String\[\]/g, 'medicationsGiven String? @db.Text');
schema = schema.replace(/secondaryDiagnoses\s+String\[\]/g, 'secondaryDiagnoses String? @db.Text');

// Fix 2: Add onDelete and onUpdate for self-relations
console.log('2. Adding onDelete and onUpdate for self-relations...');

// User self-relations
schema = schema.replace(
  /@relation\("UserApprovals", fields: \[approvedById\], references: \[id\]\)/g,
  '@relation("UserApprovals", fields: [approvedById], references: [id], onDelete: NoAction, onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\("AdminClinicalPersona", fields: \[clinicalPersonaUserId\], references: \[id\]\)/g,
  '@relation("AdminClinicalPersona", fields: [clinicalPersonaUserId], references: [id], onDelete: NoAction, onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\("StaffSupervision", fields: \[supervisedByUserId\], references: \[id\]\)/g,
  '@relation("StaffSupervision", fields: [supervisedByUserId], references: [id], onDelete: NoAction, onUpdate: NoAction)'
);

// Fix 3: Add onUpdate: NoAction for relations with onDelete: Cascade
console.log('3. Adding onUpdate: NoAction for Cascade relations...');
schema = schema.replace(
  /@relation\(fields: \[userId\], references: \[id\], onDelete: Cascade\)/g,
  '@relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\(fields: \[patientId\], references: \[id\], onDelete: Cascade\)/g,
  '@relation(fields: [patientId], references: [id], onDelete: Cascade, onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\(fields: \[visitId\], references: \[id\], onDelete: Cascade\)/g,
  '@relation(fields: [visitId], references: [id], onDelete: Cascade, onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\(fields: \[prescriptionId\], references: \[id\], onDelete: Cascade\)/g,
  '@relation(fields: [prescriptionId], references: [id], onDelete: Cascade, onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\(fields: \[orderId\], references: \[id\], onDelete: Cascade\)/g,
  '@relation(fields: [orderId], references: [id], onDelete: Cascade, onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\(fields: \[invoiceId\], references: \[id\], onDelete: Cascade\)/g,
  '@relation(fields: [invoiceId], references: [id], onDelete: Cascade, onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\(fields: \[requestId\], references: \[id\], onDelete: Cascade\)/g,
  '@relation(fields: [requestId], references: [id], onDelete: Cascade, onUpdate: NoAction)'
);

// Fix 4: Add onUpdate: NoAction for all other relations without it
console.log('4. Adding onUpdate: NoAction for remaining relations...');
schema = schema.replace(
  /@relation\("PatientPortalAccount", fields: \[patientLinkId\], references: \[id\]\)/g,
  '@relation("PatientPortalAccount", fields: [patientLinkId], references: [id], onDelete: NoAction, onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\("RegisteredBy", fields: \[registeredById\], references: \[id\]\)/g,
  '@relation("RegisteredBy", fields: [registeredById], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\("AssignedDoctor", fields: \[assignedDoctorId\], references: \[id\]\)/g,
  '@relation("AssignedDoctor", fields: [assignedDoctorId], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\(fields: \[appointmentId\], references: \[id\]\)(?!,)/g,
  '@relation(fields: [appointmentId], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\("DoctorAppointments", fields: \[doctorId\], references: \[id\]\)/g,
  '@relation("DoctorAppointments", fields: [doctorId], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\("DoctorSchedules", fields: \[doctorId\], references: \[id\]\)/g,
  '@relation("DoctorSchedules", fields: [doctorId], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\("DoctorTimeOffs", fields: \[doctorId\], references: \[id\]\)/g,
  '@relation("DoctorTimeOffs", fields: [doctorId], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\("PatientAuditLogs", fields: \[changedById\], references: \[id\]\)/g,
  '@relation("PatientAuditLogs", fields: [changedById], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\("PrescribedBy", fields: \[doctorId\], references: \[id\]\)/g,
  '@relation("PrescribedBy", fields: [doctorId], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\("DispensedBy", fields: \[dispensedById\], references: \[id\]\)/g,
  '@relation("DispensedBy", fields: [dispensedById], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\("OrderedBy", fields: \[orderedById\], references: \[id\]\)/g,
  '@relation("OrderedBy", fields: [orderedById], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\("VerifiedBy", fields: \[verifiedById\], references: \[id\]\)/g,
  '@relation("VerifiedBy", fields: [verifiedById], references: [id], onUpdate: NoAction)'
);

// Fix remaining relations without onUpdate
schema = schema.replace(
  /@relation\(fields: \[patientId\], references: \[id\]\)(?!,)/g,
  '@relation(fields: [patientId], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\(fields: \[visitId\], references: \[id\]\)(?!,)/g,
  '@relation(fields: [visitId], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\(fields: \[doctorId\], references: \[id\]\)(?!,)/g,
  '@relation(fields: [doctorId], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\(fields: \[userId\], references: \[id\]\)(?!,)/g,
  '@relation(fields: [userId], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\(fields: \[collectedById\], references: \[id\]\)/g,
  '@relation(fields: [collectedById], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\(fields: \[issuedById\], references: \[id\]\)/g,
  '@relation(fields: [issuedById], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\(fields: \[triageById\], references: \[id\]\)/g,
  '@relation(fields: [triageById], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\(fields: \[recordedById\], references: \[id\]\)/g,
  '@relation(fields: [recordedById], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\(fields: \[createdById\], references: \[id\]\)/g,
  '@relation(fields: [createdById], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\(fields: \[administeredById\], references: \[id\]\)/g,
  '@relation(fields: [administeredById], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\(fields: \[registeredById\], references: \[id\]\)/g,
  '@relation(fields: [registeredById], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\(fields: \[requestedById\], references: \[id\]\)/g,
  '@relation(fields: [requestedById], references: [id], onUpdate: NoAction)'
);

schema = schema.replace(
  /@relation\(fields: \[convertedVisitId\], references: \[id\]\)/g,
  '@relation(fields: [convertedVisitId], references: [id], onUpdate: NoAction)'
);

// Write the fixed schema
fs.writeFileSync(schemaPath, schema, 'utf8');

console.log('\n✅ Schema fixed successfully!');
console.log('Now run: npx prisma generate');
