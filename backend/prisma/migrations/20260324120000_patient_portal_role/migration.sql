-- Patient portal: PATIENT role + optional link from users to patients
ALTER TYPE "UserRole" ADD VALUE 'PATIENT';

ALTER TABLE "users" ADD COLUMN "patient_link_id" TEXT;

CREATE UNIQUE INDEX "users_patient_link_id_key" ON "users"("patient_link_id");

ALTER TABLE "users" ADD CONSTRAINT "users_patient_link_id_fkey" FOREIGN KEY ("patient_link_id") REFERENCES "patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
