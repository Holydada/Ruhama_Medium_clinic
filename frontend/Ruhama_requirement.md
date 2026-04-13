                                Ruhama metekiya medium Clear requirement analysis





Actors on the system: patient

                     -One doctor as a super admin to see all features                based on time:-there are full time and part-time workers

                     -receptionist

                     -pharmacy

                     -finance

                     -laboratory

                     -injection room worker

                     -emergency

                     -OPD

 















1.patient registration by receptionist{

      -the receptionist must have an account on the system that will must be verified by a super admin(clinic owner) to logged in and use the features.

      -the receptionist registers(create a new card) for a new patient or a patient that visits again after a 1 month(this action is performed after checking registered patients list)

\-the receptionist must have a feature to select that patient for repeated visit that visits the clinic before reaching 1 month limit.

\-there are some patients that visit the clinic for ultrasound . so there must be a feature(form or another thing) for a receptionist to handle this thing with card price.

\-there must be a feature to assign a doctor for a patient by a receptionist based on his/her interest or by a patient desire.

\-for the receptionist the system must show list of available doctors, Show full‑time / part‑time doctor, Show availability. and also the receptionist have 4 options to select as a service the one is  assign a doctor for a patient and send to OPD(Doctor room), for ultrasound(one time=200 birr and follow up=400), Emergency and Injection.

\-there must be a feature for a  receptionist to take the patient photo and attach with its information's to send for an assigned doctor.

\-so after a  receptionist send the data to the doctor, there must be a feature to see a new patient coming for a service as a notification message for a doctor





Note:-the card price for the new card is 30 birr and 0 birr for repeated card if the patient come before 30 days after he got a treatment.



 Patient Master Profile{

            Full Name, Sex, Age / Date of Birth, Phone Number, Address, Kebele, Wereda ,Patient Photo, Medical history basic info



     }



Card / Registration Data{

          Card Number

          Registration Date

          Registered By (staff name)



}









\-card and ultrasound finance only received by a reception

\-ultrasound one time=200 birr follow up=400 birr



}





2.Doctor(OPD) module{



       -there is one super doctor that can log in to the system as an admin to see the overall things and as a doctor to treat a patient

       -other doctors must be registered on the system as a doctor and receives notification message on the dashboard when new patient is coming to visit from the reception

\-when the doctor wants to write patient problem pop up  different  sickness issues when i clicks the field to write

 





👨‍⚕️ C. Doctor (Super Admin) Workflow

Doctor sees:



New patient notifications

Patient full details

Patient card history

Past prescriptions

Lab results

Previous ultrasound results



Doctor actions:



Add diagnosis

Add prescription

Request lab test

Request ultrasound

Refer to emergency

Refer to injection room

Approve repeat visit

View financial summary (super admin only)









5.4 Doctor Encounters

Fields: EncounterID, VisitID, NotesSOAP, DiagnosisCodes (free text + optional code), Orders\[], Prescriptions\[], FollowUpDate, Status.

Acceptance:



Orders and Rx become child records immediately visible to departments.







🔴 C. OPD / Doctor Consultation Module

Actions



View today’s patient queue

Open patient chart (history, results, prescriptions, vitals)

Write consultation notes (SOAP)

Enter diagnosis

Issue Lab orders

Issue Ultrasound orders

Issue Injection orders

Write prescriptions

Schedule follow-up

Refer to Emergency

End encounter



Relationships



Doctor is the central node → communicates with all departments:



Lab receives doctor’s lab orders

Ultrasound receives U/S orders

Pharmacy receives Rx

Injection room receives injection orders





Finance gets billing automatically from doctor orders

Patient history updates

OPD feeds data into reporting module









4.2 Doctor Consultation (OPD)

Goal: Diagnose, order tests, prescribe, refer to departments, complete encounter.



Main Flow:



Doctor opens Today’s Queue.

Opens patient chart (demographics, history, allergies, vitals, previous encounters, labs, U/S, Rx).

Adds SOAP notes, ICD‑like diagnosis (free text allowed).

Creates Orders: Lab, Ultrasound, Injection.

Creates Prescription with dosage \& duration.

Marks encounter Completed (or Follow‑up Needed with date).

System notifies Lab/Pharmacy/Ultrasound/Injection as relevant.

Acceptance Criteria:



Orders visible to target department immediately.

Rx visible at Pharmacy with stock check.

Encounter timeline preserved.



🏥 H. OPD Workflow



Doctor sees OPD queue

Doctor clicks patient

Writes diagnosis

Issues prescription

Issues lab requests

OPD visit completed









}



3.Nurse module{

 

🏥 Nurse Module — Ruhama Metekiya Medium Clinic (Boditi)

Scope

Supports triage, vital signs, nursing notes, procedure documentation, injection room administration, observation/monitoring, handover/shift, consumables tracking, and real‑time worklists fed from Reception and OPD orders. Works with your rules (e.g., OPD orders trigger billing; nurse marks administration/completion).

Roles Covered



Nurse (General) – triage, vitals, nursing notes, procedures, observation.

Injection Room Nurse – verify orders, administer meds, record AEs, track consumables.

Emergency Nurse – fast triage, stabilization documentation, frequent vitals \& alerts.





Implementation tip: Use a single NURSE role + feature flags for sub‑modules (TRIAGE, INJECTION, EMERGENCY).



Out of scope for nurse: patient registration, card pricing (handled by Reception \& Finance), prescribing (Doctor), stock issue (Pharmacy), charging (Finance auto‑generated from orders).



1\) Permissions Matrix



Nurse



Read: patient demographics, photo (from Reception), card history, allergies, active orders, labs, Rx.

Create/Update: triage, vitals, nursing notes, procedures, injection administrations, observation charts.

Cannot: edit doctor notes/diagnosis, dispense meds, delete records, approve billing.





Injection Room Nurse



All Nurse permissions plus: administer injection orders, mark status, adverse events (AE), consumables usage.





Emergency Nurse



All Nurse permissions plus: priority triage, critical alerts, crash‑cart checklist.









All write actions are audit‑logged with user, timestamp, device, and reason.





2\) Core Workflows

A) Triage (OPD/Emergency)



Queue intake: From Reception → “Triage Queue”.

Identify patient: Verify with photo, card number, and name.

Capture:



Vital signs: BP, HR, RR, Temp, SpO₂, Weight, Height, MUAC (optional), Pain score (0‑10).

Pregnancy (Y/N), LMP (if relevant), Allergies, Chronic illnesses, Chief complaint (free text).

Triage Category: Level 1‑5 (Critical → Non‑urgent).





Auto‑calculated: BMI, Pediatric percentiles (optional), shock index (HR/SBP).

Route:



OPD (default) OR Emergency (if critical) with immediate alert to doctor.





Notify: Assigned doctor gets real‑time notification.



Acceptance



Triage record is visible in patient timeline and doctor chart instantly.

Abnormal vitals trigger red banner \& notification.





B) Vital Signs Follow‑up



Schedule vitals frequency (e.g., q15m, q30m, q4h) per encounter.

Timers show due/overdue; abnormal values push alerts to the assigned doctor.

Chart trend displayed as mini‑sparkline.



Acceptance



Missed vitals appear in “Overdue” panel until completed or rescheduled.





C) Nursing Notes (SOAP‑N style)



Structured + free text:



Subjective (patient statements)

Objective (measurables)

Assessment (nursing assessment)

Plan/Interventions





Note templates: Wound care, fever, dehydration, pain, antenatal pre‑check.

Attach files: wound photos, reports (if allowed).



Acceptance



Notes are time‑stamped and read‑only after 15 minutes (or role override with reason).





D) Injection Room Workflow



Worklist auto‑populates from Doctor → Injection Orders.

Nurse selects order → 5 Rights Check (Right patient, medication, dose, route, time).

Pre‑admin checks: allergies, contraindications, vitals recency; require re‑vitals if > X hours.

Administer:



Route: IM/IV/SC/ID/PO, site (deltoid, dorsogluteal, vastus lateralis, etc.), lot/expiry (from Pharmacy label), dose/units.

Record: time given, administering nurse, adverse event (Y/N details).





Consumables: syringe, cannula, gloves, alcohol swab → decrement from consumables (by Finance/Store or Pharmacy integration).

Status: Order → administered (or partially\_administered/not\_administered with reason).

Notify doctor on AE; Finance already has charge from order (no extra action).



Acceptance



No administration allowed without a valid active order.

If Pharmacy flags stock not issued, system blocks and informs nurse.





E) Procedures / Dressing



Simple procedures: wound dressing, IV cannulation, nebulization, catheterization.

Document: procedure type, indication, consent (Y/N), steps, materials used, site, outcome, complications, next change date.

Auto‑schedule wound dressing follow‑up reminders.





F) Observation / Monitoring Board



Live board by location (OPD, Emergency, Injection, Observation room).

Columns: Patient, Reason, Triage Level, Vitals trend, Active orders, Next due task timer.

Color codes: critical, warning, normal.





G) Shift Handover



Start/end shift summary:



Patients under care, pending tasks, abnormal vitals, lines/cannulas in situ, wound care schedule.





Handover sign‑off between outgoing/incoming nurse (digital signature/pin).





3\) Screens (UX Blueprints)



Nurse Home



Tabs: Triage Queue, Today’s Patients, Orders Worklist, Observation Board, Handover.





Triage Form



Patient header: photo, card #, age, allergies banner.

Vitals grid with auto‑BMI; triage level radio (1‑5); chief complaint.





Orders Worklist



Filters: Injection, Procedure, status (Pending, In‑Progress, Administered, Not Administered).





Injection Administration



Order details (drug, dose, route), 5‑Right checklist, pre‑admin vitals reminder, site selector diagram, lot/expiry, AE capture, submit.





Nursing Notes



SOAP‑N template; quick phrases; attachments.





Observation Board



Table + color badges; due timers; quick vitals capture.





Handover



Auto‑compiled report + edit; sign‑off.



All screens: Amharic/English toggle, Ethiopian Calendar (EC) ↔ Gregorian date picker.













}







4.pharmacy and store module{



1\. Pharmacy Management –



           -stock owner must be registered with photo and have an account on the system(we have to think about removing,editing this stock servant when he/she leaves the work)

 

        outside{

        No ,date, age, sex, full name, drug name with dose address and phone number

     }



    prescription list(photo)-this comes from the doctor to the pharmacy  who saw the patient





drug registration{



 tin number with invoice that comes from the outside drug provider(with photo)....then manually count and goes to the store

}



 -system to track drug from the store to the pharmacy(she register minimum drug from the store and add new amount on the sheilf)

 

     finance tracking(

date, product name, quantity with unit price, total price ,stock buyer name



\-we need daily, weekly and monthly report



\-i have to think about the payment method on the pharmacy for users of the pharmacy.



)



 }









💊 E. Pharmacy Workflow

Pharmacy receives:



Prescription from doctor

Patient ID

Medication list



Pharmacy actions:



Check stock

Dispense medication

Update stock

Mark prescription as completed

Collect payment (Chapa or cash)





4.4 Pharmacy Dispensing

Main Flow:



Pharmacy sees New Prescriptions.

System checks Inventory; show availability/substitutes.

Pharmacist dispenses; records quantities; prints labels.

Collects payment (Chapa/cash) if not prepaid.

Marks Dispensed; inventory decremented; finance updated.







5.7 Pharmacy Module

Inventory: ItemID, Name, Strength, Form, SKU, BatchNo, ExpiryDate, ReorderLevel, UnitPrice, QuantityOnHand.

Prescription: RxID, EncounterID, Items\[{DrugID, Dose, Frequency, Duration, Quantity, Instructions}].

Dispense: DispenseID, RxID, Items\[{DrugID, QuantityDispensed}], PaymentStatus.

Acceptance:



Cannot dispense beyond stock; expiry warnings; label printing.







12.4 Pharmacy

Dispense cannot exceed stock; shows error \& suggested substitution.

Expired batch is not selectable for dispensing



🟣 E. Pharmacy Module

Actions

Review new prescriptions

Check stock

Dispense medication

Print labels

Update inventory (auto)

Request stock adjustments

Collect pharmacy payment

Notify doctor if prescription issues exist

Relationships

Input: Doctor’s prescription

Output: Dispense record to Finance

Pharmacy’s stock → updated in Inventory Module

Doctor sees prescription completion in timeline









🟣 E. PHARMACY MODULE — Screens \& Forms

UI Pages

Prescription Queue

Prescription Detail View

Dispensing Page

Inventory List

Stock Entry Page

Stock Adjustment Page

Forms Needed

1\) Dispense Medication Form

Drug

Quantity available

Quantity dispensing

Batch number

Price (read only)

Payment method (Chapa / Cash)

2\) Stock Adjustment Form

Item

Add/Subtract quantity

Reason

3\) New Inventory Item Form

Drug name

Strength

Form

Supplier

Pricing

Reorder level











store module{

&#x20;

&#x20;A. Inventory \& Store Module (Backend + Store UI)

1\) Scope \& Roles

Store / Inventory Officer

Registers incoming stock from suppliers (with invoice, TIN, batch, expiry).

Transfers stock from Main Store → Pharmacy (and optionally → Injection Room / Lab if you want).

Handles stock adjustments (damage, expiry, shrinkage) with reason.

Views stock reports (daily, weekly, monthly).

Pharmacist

Requests items from store (replenish pharmacy shelves).

Receives stock transfer from store.

Cannot change incoming invoice history; only see it.

Finance

Reads stock valuation data and purchase cost.

No right to modify physical quantities.

Super Admin

Full access; can configure items, categories, and approval rules.

2\) Data Model (Key Tables)

At minimum:



suppliers



SupplierID, Name, TIN, Phone, Address, ContactPerson

inventory\_items



ItemID, Name, Strength, Form, CategoryID, DefaultUnit, ReorderLevel, IsActive

inventory\_locations



LocationID, Name (e.g., MAIN\_STORE, PHARMACY, INJECTION\_ROOM)

inventory\_batches



BatchID, ItemID, SupplierID, InvoiceNo, InvoicePhotoPath, BatchNo, ExpiryDate, UnitCost, CreatedAt

inventory\_stock (per batch, per location)



StockID, BatchID, LocationID, QuantityOnHand

(This lets you track batch + location specific quantities.)

inventory\_movements (immutable ledger of all stock changes)



MovementID, ItemID, BatchID, FromLocationID (nullable), ToLocationID (nullable), Qty, MovementType, Reason, CreatedBy, CreatedAt, RefType, RefID

MovementType examples:

PURCHASE\_IN (supplier → MAIN\_STORE)

TRANSFER\_OUT / TRANSFER\_IN

DISPENSE\_OUT (Pharmacy to patient)

ADJUSTMENT\_PLUS / ADJUSTMENT\_MINUS

EXPIRED\_OUT / DAMAGED\_OUT

RefType/RefID can link to:

PurchaseInvoice, PharmacyDispense, LabOrder, InjectionOrder, etc.

purchase\_invoices



InvoiceID, SupplierID, InvoiceNo, InvoiceDate, InvoicePhotoPath, TotalAmount, CreatedBy, CreatedAt

purchase\_invoice\_items



InvoiceItemID, InvoiceID, ItemID, BatchID, Qty, UnitCost, LineTotal

stock\_adjustments



AdjustmentID, ItemID, BatchID, LocationID, QtyChange, Reason, CreatedBy, ApprovedBy, Status (Pending/Approved/Rejected), CreatedAt, ApprovedAt

This model supports full audit, batch tracking, multi‑location, and is friendly to Finance.



3\) Core Workflows

A.1 Incoming Stock from Supplier → Main Store

Actors: Store Officer

Goal: Record new stock, link to invoice \& TIN, create batches.



Steps:



Store officer opens New Purchase Invoice page.

Enters:

Supplier (select existing or create new).

Invoice number, date, TIN, upload invoice photo (InvoicePhotoPath).

Adds items:

Choose Item (from inventory\_items).

Enter:

BatchNo

ExpiryDate

Quantity

UnitCost

System creates:

purchase\_invoice\_items row

inventory\_batches row

For each line:

System:

Creates inventory\_stock at Location = MAIN\_STORE with initial quantity.

Creates inventory\_movements entry of type PURCHASE\_IN.

Finance can read purchase invoice for valuation \& reports.

Rules:



Required: Supplier, InvoiceNo, TIN (if available), InvoicePhotoPath.

Expiry date must be in the future (warning if close, block if already expired).

This does not directly affect Pharmacy shelves; that’s a separate transfer.

A.2 Transfer Stock from Store → Pharmacy

Actors: Store Officer, Pharmacist

Goal: Move limited quantities from main store to pharmacy.



Steps:



Pharmacist sees Request from Store page:

Selects items + desired quantities (request).

Creates a StoreRequest (optional table) with status Pending.

Store Officer opens Store Requests:

Views each pending request.

Chooses batches (FEFO: first expiry, first out).

Enters approved quantity per batch.

On approval:

System:

Decrements inventory\_stock at MAIN\_STORE for the chosen batch.

Increments inventory\_stock at PHARMACY for the same batch.

Logs two inventory\_movements or one movement with FromLocationID / ToLocationID.

Pharmacist sees updated pharmacy stock levels and request marked Fulfilled.

Rules:



Cannot approve more than QuantityOnHand in main store.

Must respect batch expiry priority.

Optional: require digital signature / password for large transfers.

A.3 Inventory Adjustments (Damage, Expiry, Shrinkage)

Actors: Store Officer, Pharmacist, Approver (Super Admin/Finance)

Goal: Legitimize quantity changes due to non‑normal causes.



Steps:



Officer goes to Stock Adjustment form:

Select Item, Batch, Location.

Enters:

QtyChange (positive or negative).

Reason (e.g., Expired, Broken, Theft).

System creates stock\_adjustments with status Pending.

Approver (Super Admin / Inventory Manager / Finance) reviews:

Approves / rejects.

On approval:

System:

Updates inventory\_stock by QtyChange.

Creates inventory\_movements with:

MovementType = ADJUSTMENT\_PLUS or ADJUSTMENT\_MINUS.

Adjustment cannot take stock below zero.

4\) States \& Business Rules

States:

purchase\_invoices: Draft → Submitted → Closed

stock\_adjustments: Pending → Approved/Rejected

inventory\_stock: just quantity; but derived states: OK, BelowReorderLevel, Expired, NearExpiry

Core rules:

All mutations go through inventory\_movements.

Quantity in inventory\_stock must always equal sum of movements for that location+batch.

Pharmacy cannot dispense from expired batches.

Reorder alerts when QuantityOnHand < ReorderLevel at MAIN\_STORE or PHARMACY.

5\) API \& Integration Touchpoints

From Pharmacy Module:

When dispense happens:

Call inventory service: POST /inventory/dispense with {ItemID, BatchID(optional), Qty, LocationID = PHARMACY, RefType = 'RX', RefID = RxID}.

From Injection Room / Lab:

For consumables or tests that reduce stock, similar POST /inventory/consume.

To Finance Module:

Provide stock valuation endpoints:

GET /inventory/valuation?date=...

Finance reads:

Purchase cost for margins.

Admin Module:

Manages inventory\_items, suppliers, reorder levels, categories.

&#x20;



}



}



5.injection module{



\-there are different patients who visit injection room for one time by doctor request and repeatedly for several days.

&#x20;

💉 F. Injection Room Workflow



Receives injection order from doctor

Patient arrives with card

Nurse checks prescription

Performs injection

Updates “Injection Completed”

Sends update notification to doctor







5.9 Injection Room

Fields: InjOrderID, DrugID, Dose, Route, Site, LotNo, AdministeredAt, NurseID, AdverseEventFlag.

Acceptance:



Mandatory LOT tracking; adverse event capture flow.









⚪ G. Injection Room Module

Actions



View injection orders

Check drug \& dosage

Administer injection

Record Lot Number, Site, Time

Report adverse reactions

Mark injection completed

Notify doctor



Relationships



Receives doctor orders

Uses pharmacy inventory drugs

Sends charge info → finance

Updates patient chart timeline





4.6 Injection Room

Main Flow:



Nurse sees injection orders.

Verifies drug \& dose; administers.

Logs LOT/Batch, site, time, nurse ID.

Marks Completed ⇒ Notifies doctor.



5.9 Injection Room

Fields: InjOrderID, DrugID, Dose, Route, Site, LotNo, AdministeredAt, NurseID, AdverseEventFlag.





⚪ G. Injection Room Module

Actions

View injection orders

Check drug \& dosage

Administer injection

Record Lot Number, Site, Time

Report adverse reactions

Mark injection completed

Notify doctor

Relationships

Receives doctor orders

Uses pharmacy inventory drugs

Sends charge info → finance

Updates patient chart timeline



⚪ G. INJECTION ROOM MODULE — Screens \& Forms

UI Pages

Injection Orders List

Injection Admin Detail Page

Forms Needed

1\) Injection Administration Form

Drug name (auto from doctor)

Dose

Route (IV/IM/Subcutaneous)

Site (Left arm, Right arm…)

Lot number

Expiry date

Time given

Nurse name

2\) Adverse Event Form

Reaction type

Notes

Time of event



}

6.laboratory module{

\----there is no obligation to fill the result for all test parameters for lab technician to send for a doctor



&#x20;      🧪 D. Laboratory Workflow

Lab receives:



Test request from doctor

Patient card number

Payment verification (if required)



Lab actions:



Accept test request

Conduct test

Upload result PDF/image

Update status = “Completed”

Notify doctor automatically





4.3 Laboratory Processing

Main Flow:



Lab dashboard shows Pending Orders.

Technician Accepts an order.

Mark Sample Collected (if applicable).

Enter results (numeric/range/qualitative) + attach PDF/image if available.

Set Completed ⇒ Notifies doctor \& patient (optional SMS/email).

Constraints: Some tests require payment before processing (configurable).





5.6 Laboratory Module

Catalog: TestCode, Name, SampleType, RefRange, Unit, Price, TAT.

Result Fields: ResultID, OrderID, Value (text/number), Attachments\[], AbnormalFlag, VerifiedBy, VerifiedAt.

Acceptance:



Numeric values validated against type; result locking after verify.



🟡 D. Laboratory Module

Actions



View new lab orders

Accept lab order

Mark sample collected

Record lab result

Upload file/image/PDF

Verify result

Mark completed

Trigger doctor notification



Relationships



Receives orders from doctor

Returns results to doctor

Sends charges to Finance

Uses PatientID and VisitID









5.6 Laboratory Module

Catalog: TestCode, Name, SampleType, RefRange, Unit, Price, TAT.

Result Fields: ResultID, OrderID, Value (text/number), Attachments\[], AbnormalFlag, VerifiedBy, VerifiedAt.



Acceptance:



Numeric values validated against type; result locking after verify.







11.4 Laboratory

Lab Worklist (status lanes)

Result Entry (form varies by test type)

Result Review \& Verify

Result PDF Viewer







🟡 D. Laboratory Module

Actions

View new lab orders

Accept lab order

Mark sample collected

Record lab result

Upload file/image/PDF

Verify result

Mark completed

Trigger doctor notification

Relationships

Receives orders from doctor

Returns results to doctor

Sends charges to Finance

Uses PatientID and VisitID









🟡 D. LAB MODULE — Screens \& Forms

UI Pages

Lab Worklist Page

Order Detail Page

Result Entry Form

Result Viewer Page

Forms Needed

1\) Accept Lab Order Form

Confirm receipt

Assign technician

2\) Sample Collection Form

Collection time

Sample condition

3\) Lab Result Entry Form

Numeric value fields

Text value fields

Abnormal flags

Technician comments

Upload PDF/Image

4\) Verify/Publish Result Form

Approve button

Reject button



}

7.finance module{

&#x20;

&#x20;





💰 I. Finance Workflow (Chapa integrated)

Finance handles:



Card fees

Lab payments

Pharmacy payments

Injection fees

Ultrasound fees

Doctor payments (if applicable)



Finance features:



View all payments

Approve pending Chapa transactions

Withdraw via Chapa gateway

Generate daily financial reports

Handle manual cash entries





4.8 Finance \& Cashier

Main Flow:



View All Transactions (card fees, lab, pharmacy, U/S, injection, visit fees).

Reconcile Chapa callbacks/settlements.

Withdraw/Send payouts via Chapa (owner’s configured account).

Generate Daily Closeout, Monthly and Annual reports.

Manage Refunds/Adjustments (with approval workflow).





5.11 Finance \& Billing

Transactions: TxID, Source (CardFee/Lab/Pharmacy/US/Injection/VisitFee/Refund), Amount, Currency, Method (Chapa/Cash), Status (Pending/Success/Failed/Refunded), Payer, Reference (ChapaRef or ReceiptNo), CreatedAt, ReconciledAt.

Ledger: Immutable append‑only journal with Dr/Cr lines.

Acceptance:



Daily closeout report sums by method \& source; totals reconcile with ledger.







🟫 I. Finance \& Billing Module

Actions



Record card fee payments

Record pharmacy sales

Record lab fees

Record ultrasound fees

Record injection fees

Chapa payments tracking

Cash receipts

Refund management

Daily close-out report

Monthly reports

Withdraw via Chapa (Send Money)

Ledger entry creation

Audit trail of money movements



Relationships

Every module flows into Finance:



Reception → card fee

Lab orders → lab fee

U/S → ultrasound fee

Pharmacy → medication cost

Injection → injection fee

Doctor visits → consultation fee



Finance connects with Reporting and Admin.













💰 I. Finance Workflow (Chapa integrated)

Finance handles:

Card fees

Lab payments

Pharmacy payments

Injection fees

Ultrasound fees

Doctor payments (if applicable)

Finance features:

View all payments

Approve pending Chapa transactions

Withdraw via Chapa gateway

Generate daily financial reports

Handle manual cash entries







5.11 Finance \& Billing

Transactions: TxID, Source (CardFee/Lab/Pharmacy/US/Injection/VisitFee/Refund), Amount, Currency, Method (Chapa/Cash), Status (Pending/Success/Failed/Refunded), Payer, Reference (ChapaRef or ReceiptNo), CreatedAt, ReconciledAt.

Ledger: Immutable append‑only journal with Dr/Cr lines.



Acceptance:



Daily closeout report sums by method \& source; totals reconcile with ledger.









11.9 Finance

Transactions List

Reconciliation (Chapa callbacks, cash)

Payout Requests (send/withdraw)

Daily Closeout

Monthly/Annual Reports

Refunds/Adjustments (approval)











🟫 I. Finance \& Billing Module

Actions

Record card fee payments

Record pharmacy sales

Record lab fees

Record ultrasound fees

Record injection fees

Chapa payments tracking

Cash receipts

Refund management

Daily close-out report

Monthly reports

Withdraw via Chapa (Send Money)

Ledger entry creation

Audit trail of money movements

Relationships

Every module flows into Finance:



Reception → card fee

Lab orders → lab fee

U/S → ultrasound fee

Pharmacy → medication cost

Injection → injection fee

Doctor visits → consultation fee

Finance connects with Reporting and Admin.













🟫 I. FINANCE \& BILLING MODULE — Screens \& Forms

UI Pages

Transactions List

Daily Close-out Page

Monthly Report Page

Chapa Payment Logs

Payout / Withdraw Page

Refund Page

Forms Needed

1\) Billing Entry Form

Source: Lab/Pharmacy/U/S/Visit

Amount

Status

Timestamp

2\) Transaction Edit Form (limited)

Only to add notes; amount cannot be changed

3\) Refund / Adjustment Form

Amount

Reason

Approval

4\) Payout (Withdraw) Form

Amount

Destination

Description



}

8.emergency module{

&#x20;





🚨 G. Emergency Unit Workflow



Register emergency case (bypasses normal flow)

Quick registration only: name + age + phone

Emergency doctor takes over

After stabilization → full registration

Finance updates emergency billing







4.7 Emergency Intake

Main Flow:



Minimal registration: name/unknown, approx age, sex, phone (if any).

Emergency doctor/nurse triages \& treats.

After stabilization, complete full registration \& billing.

Finance reconciles emergency costs.







5.10 Emergency Module

Fields: CaseID, TriageLevel, MinimalPatientInfo, Actions\[], Disposition (Discharged/Admitted/Referred), Billing.

Acceptance:



Minimal fields acceptable; later “complete registration” required.







🔺 H. Emergency Module

Actions



Fast minimal registration (Name, age, sex)

Triage level assignment

Emergency treatment

Convert to full visit

Send to OPD if needed

Billing updates to finance

Record emergency actions



Relationships



Linked to Patient module

Generates Visit → OPD follow-up

Sends financial data to Finance Module

May generate lab/pharmacy orders





🚨 G. Emergency Unit Workflow

Register emergency case (bypasses normal flow)

Quick registration only: name + age + phone

Emergency doctor takes over

After stabilization → full registration

Finance updates emergency billing







5.10 Emergency Module

Fields: CaseID, TriageLevel, MinimalPatientInfo, Actions\[], Disposition (Discharged/Admitted/Referred), Billing.



Acceptance:



Minimal fields acceptable; later “complete registration” required.





11.8 Emergency

Minimal Registration

Triage \& Actions

Complete Registration











🔺 H. Emergency Module

Actions

Fast minimal registration (Name, age, sex)

Triage level assignment

Emergency treatment

Convert to full visit

Send to OPD if needed

Billing updates to finance

Record emergency actions

Relationships

Linked to Patient module

Generates Visit → OPD follow-up

Sends financial data to Finance Module

May generate lab/pharmacy orders







🔺 H. EMERGENCY MODULE — Screens \& Forms

UI Pages

Emergency Quick Register

Triage Page

Treatment Page

Convert to Full Patient Page

Billing Summary

Forms Needed

1\) Quick Registration Form

Name (optional)

Age

Sex

Reason

Immediate notes

2\) Triage Form

Triage priority

Vital signs

3\) Emergency Action Form

Procedures performed

Medicines given

4\) Convert to Full Patient Form





}

9.ultrasound{

&#x20;







🟠 F. Ultrasound Module

Actions



Receive ultrasound order

Verify payment

Perform ultrasound

Upload images and report

Mark as completed

Notify doctor



Relationships



Doctor sends orders

Finance handles U/S fees

Results show in the doctor’s patient chart











📸 J. Ultrasound Department Workflow

Receives ultrasound requests

Patient pays ultrasound fee

Technician performs ultrasound

Uploads ultrasound result

Doctor gets notification





4.5 Ultrasound

Main Flow:



U/S technician sees assigned cases.

Confirms payment (if required).

Conducts scan; uploads report + images.

Marks Completed ⇒ Notifies doctor.







5.8 Ultrasound Module

Fields: USOrderID, StudyType, TechnicianID, Images\[], ReportText, Paid, CompletedAt.



Acceptance:



PDF report generation; image viewer; doctor receives notification.







11.6 Ultrasound

U/S Queue

Capture Images / Upload Report

Report Preview \& Publish



🟠 F. Ultrasound Module

Actions

Receive ultrasound order

Verify payment

Perform ultrasound

Upload images and report

Mark as completed

Notify doctor

Relationships

Doctor sends orders

Finance handles U/S fees

Results show in the doctor’s patient chart



🟠 F. ULTRASOUND MODULE — Screens \& Forms

UI Pages

U/S Worklist

U/S Order Detail

Report Entry Page

Image Upload Page

Forms Needed

1\) Ultrasound Report Form

Findings

Impression

Notes

Upload images

2\) Verify \& Publish Form



}

10.chat module between workers{

&#x20;  -there must be a feature for all workers on the clinic to have a real time chat between them by selecting the person the wants to talk.

&#x20;   -there must be a notification when the message is replied.

&#x20;   -all others chat features like inserting their profile photo, knowing who is available(online) or not ,sending photo, pdf, audio or other things

&#x20;  -if you can you can add video call option between them



}

11.the whole staff registration and management module{

&#x20;      -every staff must be registered by using registration option and after registration their account must be approved by super admin before they access their admin dashboard.

\-there must be an access control for super admin

\-there must be a feature for a doctor (super admin) to assign a role for one staff temporarily

\-there must be a feature to register when new doctor or staff wants to join and work on that clinic. it includes detailed(super quality) form and document attachment method(photo of paper document)



}





👨‍⚕️ . Super Admin Doctor’s Special Powers



Add/remove receptionist

Approve receptionist accounts

Add/edit services (lab tests, fees, card fee, ultrasound fee)

Add/edit users (pharmacy, lab, finance)

View all reports

View all patient histories

Manage system settings

View Chapa logs

Generate monthly \& yearly reports







&#x20;Admin \& Settings (Super Admin Doctor)



Approve receptionist/staff accounts.

Manage Services \& Prices (card fee, test catalogs, U/S fees).

Manage Users \& Roles, rosters (full‑time/part‑time).

System configurations (payment modes, SMS/email templates).

Access audit \& security logs.







🔶 2. Doctor Payroll / Commission Module (Semi‑optional)

Doctors in Ethiopia (especially part‑time specialists) often receive:



Fixed salary (full‑time)

Commission per patient visit

Commission per ultrasound

Commission per procedure

If needed, the system can include:



Doctor revenue report

Commission calculation rules

Payout summary

👉 Many clinics do this manually using Excel.

So it’s optional.









Authentication \& Authorization



Email/phone + password; optional 2FA (v1.1).

Password hashing (bcrypt 10+).

Role‑based authorization middleware; per‑route permissions.

Account states: Pending Approval, Active, Suspended, Archived.

Receptionist must be approved by Super Admin to log in.













4\. Non‑functional Requirements

Security

Performance

Scalability

Usability

Availability

Maintainability

Localization

5\. System Architecture

Backend (Node + Express)

Frontend (React)

Database (MySQL)

API structure

Role‑based access control

6\. Database Design

ER diagram

Table definitions

Relationships

7\. API Documentation

Endpoints

Sample requests

Validation

8\. Wireframes

Complete page list

Layout descriptions







 

7\. Non‑Functional Requirements

7.1 Security

HTTPS everywhere; HSTS; TLS 1.2+.

OWASP Top 10 mitigations (input validation, CSRF, XSS, SQLi via parameterized queries).

Role checks on every protected route.

Audit log (who/what/when/where).

File uploads virus‑scanned; type/size restrictions.

PHI (patient health info) stored encrypted at rest (volumes or column‑level for PII).

Secrets in environment variables (managed via vault).

7.2 Performance

Core screens TTFB ≤ 300ms (API) under 100 concurrent users.

Lab/Pharmacy dashboards should paginate and use server‑side filtering.

WebSocket push for near‑real‑time notifications.

7.3 Availability \& Reliability

99.5% uptime target.

Graceful degradation for SMS/Email (queue retry).

Daily backups (RPO ≤ 24h), tested restores quarterly (RTO ≤ 4h).

7.4 Scalability

Stateless API horizontally scalable; DB read replicas optional.

Caching for catalog \& settings (in‑memory).

7.5 Usability

Clean, accessible UI (WCAG AA), bilingual ready (EN first, Amharic optional terms).

Keyboard‑friendly, mobile‑responsive (reception/doctor/finance screens optimized for laptop; patient slip printable A5).

7.6 Maintainability

Monorepo (client + server), linting, Prettier, conventional commits.

Modular services (auth, patients, visits, orders, billing, inventory).

7.7 Compliance \& Audit

Respect local data protection norms; store logs for ≥ 1 year.

Provide data export (CSV/PDF) for patient and financial summaries.



















⭐ 3. HOW ALL MODULES RELATE TO EACH OTHER (FULL CONNECTION MAP)

PATIENT

   ↓

RECEPTION → FINANCE (Card Fee)

   ↓ assigns doctor

DOCTOR (OPD)

   ↓ orders

 ┌──────────────┬──────────────────┬───────────────┐

 │              │                  │               │

LAB          ULTRASOUND        INJECTION        PHARMACY

 │              │                  │               │

 ↓ result       ↓ report           ↓ completion    ↓ dispense

DOCTOR ←────────────── RESULTS FEEDBACK ───────────→ FINANCE

   ↓

FOLLOW UP / DISCHARGE

   ↓

REPORTING

   ↓

ADMIN (settings, control)

⭐ 4. FULL ACTION-LEVEL FLOW OF A PATIENT THROUGH ALL MODULES

1\. Patient arrives

→ Reception Module



2\. Registration

→ Patient Module

→ Finance Module (card fee)



3\. Assigned to a Doctor

→ Doctor’s Queue

→ Notification Module



4\. Consultation

Doctor creates:



lab orders

ultrasound orders

injection orders

prescriptions

Each order travels to its module.



5\. Department Processing

Lab → result

U/S → images + report

Injection → administered status

Pharmacy → medication dispensed

Each department triggers:



doctor → notification

finance → billing

reporting → analytics

6\. Financial Clearance

Finance receives:



card fee

lab fee

medication fee

ultrasound fee

injection fee

consultation fee

7\. Follow-up or Discharge

Doctor decides follow-up or discharge.



8\. History stored

All data stored permanently.



⭐ 5. RELATIONSHIP SUMMARY TABLE

Module	Reads From	Writes To	Related Modules

Patient	Admin, Reception	Doctor, Finance	ALL

Reception	Patient	Visit, Finance	OPD, Admin

Doctor	Patient, Visit	Orders, Rx, Follow-up	Lab, U/S, Pharmacy, Injection

Lab	Doctor Orders	Lab Results	Doctor, Finance

Ultrasound	Doctor Orders	Reports	Doctor, Finance

Pharmacy	Prescriptions	Dispense, Inventory	Finance

Injection	Doctor Orders	Injection Log	Doctor, Finance

Emergency	Patient	Emergency Notes	Finance, OPD

Finance	ALL	Ledger, Receipts	Admin, Reporting

Inventory	Admin, Pharmacy	Stock Updates	Pharmacy, Injection

Admin	ALL	Users, Pricing	EVERY MODULE

Reporting	ALL	NONE	Admin

⭐ Conclusion

Brother, what I’ve given you now is the complete, full, industrial-level functional workflow, covering:



✔ Every module

✔ Every action

✔ Every relationship

✔ The data flow

✔ Cross-module interactions



This is the level senior system architects and health software companies use when building hospital/clinic systems.











⭐ 3. UI NEEDED FOR INTER‑MODULE INTERACTIONS

Here are the interfaces needed when modules interact:



🔄 1. Reception → Doctor

Notification Panel

“New patient assigned”

Patient details popup

🔄 2. Doctor → Lab

Order Form (Doctor)

Lab Worklist Queue (Lab)

🔄 3. Doctor → Ultrasound

Ultrasound Request Form

U/S Technician Worklist

🔄 4. Doctor → Injection Room

Injection Orders Form

Injection Room Queue

🔄 5. Doctor → Pharmacy

Prescription Form

Pharmacy Worklist

🔄 6. Lab/Pharmacy/U/S/Injection → Doctor

Results / Report Viewer

Results automatically appear in doctor's patient chart

🔄 7. Every Department → Finance

Billing Events Page

View charges from all modules

Auto-generated transaction cards











      Dashboards (5 main dashboards)

Screens:

12\. Super Admin Dashboard

13\. Doctor Dashboard

14\. Reception Dashboard

15\. Lab Dashboard

16\. Pharmacy Dashboard

17\. Ultrasound Dashboard

18\. Injection Room Dashboard

19\. Finance Dashboard

20\. Emergency Dashboard

21\. Inventory Dashboard

22\. Admin Dashboard

Each dashboard contains:



Today’s statistics

Counts

Quick actions

Alerts

Module shortcuts







&#x20;         Information that i have gathered from the clinic manual papers







MODULE: PHARMACY / PRESCRIPTION \& DISPENSING

Source: “Ruhama Medium Clinic — PRESCRIPTION” pad.

Form: Prescription (Doctor → Pharmacy)

Header



Name

Sex (select)

Age

Card No.

Patient Type: ☐ Inpatient ☐ Outpatient

Diagnosis (free text)



Prescription Lines (repeatable rows)



Drug name

Strength

Dose

Frequency

Duration

Quantity

Price (for dispenser use)



Signatures/Footers



Prescriber Full Name

Prescriber Qualification

Prescriber Signature

Prescriber Date

Dispenser (name/signature area on the right)





Dispensing checklist (pharmacy UI)



Link to prescription

Select batch/lot

Check expiry (FEFO)

Quantity issued

Substitution note (if any)

Dispenser name/signature/date



&#x20; MODULE: LABORATORY

A) Lab Request + Paper Panel Results (Checklist Sheet)

Header



Name

Age

Sex



Test Groups \& Common Items (checkbox style from sheet)



Hematology: CBC, ESR, Blood Group

Serology: RPR/VDRL, HBsAg, HCV, H. pylori, Rheumatoid Factor, Widal O \& H, Weil‑Felix, ASO Titer, PICT

Parasitology: Blood Film, Stool Examination, AFB

Urinalysis: Urine analysis (routine)

Chemistry: Creatinine, Blood Urea, SGOT(AST), SGPT(ALT), Glucose, Cholesterol, Triglyceride, Albumin, Total Protein, ALP, Bilirubin(Total), Bilirubin(Direct), Uric Acid

Miscellaneous: Urine HCG (pregnancy)



Result Entry (per test)



Result value

Units (if applicable)

Result flag/normality (optional)

Result date

Technician/Verifier





B) CBC Result (Device Ticket from Hematology Analyzer)

Header



Sample ID

Patient Name (if present on ticket)

Sex

Age

Sample Type (e.g., Whole Blood)

Run Date/Time

Report Date/Time

Operator

Verifier

Remarks

Device Model (seen: AC 310)



Parameters (examples visible on screen/ticket)



WBC, Lymph%, Mid%, Gran%, Lymph#, Mid#, Gran#

RBC, HGB, HCT, MCV, MCH, MCHC

RDW‑SD, RDW‑CV

PLT, MPV, PDW, PCT, P‑LCR

(include others printed on the ticket)

Each parameter has: Value, Unit, Reference Range, Flag (L/H/\*)



MODULE: CERTIFICATES

A) Medical Sick Leave Form

Fields (as printed)



Name

Age

Sex

Card Number

Date

Date of Examination

Diagnosis

Sick Leave Given (e.g., “3 days”)

Dr’s Name

Signature

Signature Date





B) General/Migrant Medical Check‑Up Requirement Form

Section 1 — Personal Data



Name

Age

Sex

Date of Birth

Nationality

Passport No.

Marital Status: ☐ Single ☐ Married ☐ Divorced ☐ Widowed

Job Title (present on the sheet)



Section 2 — Vital Data



Blood Pressure

Weight (kg)

Height (cm)

ECG: ☐ Normal ☐ Abnormal

Pulse: ☐ Regular ☐ Irregular

Vision: Left / Right values (e.g., 6/6)

Vision status: ☐ Normal ☐ Abnormal

Colour Vision: ☐ Normal ☐ Abnormal



Section 3 — Clinical Examination



General: ☐ Normal ☐ Abnormal (+notes)

ENT: ☐ Normal ☐ Abnormal (+notes)

Cardiovascular (CVS): ☐ Normal ☐ Abnormal (+notes)

Respiratory: ☐ Normal ☐ Abnormal (+notes)

Abdomen: ☐ Normal ☐ Abnormal (+notes)

Liver/Spleen palpable: ☐ Yes/Abnormal ☐ Normal (+notes)

Musculoskeletal/Neurological: ☐ Normal ☐ Abnormal (+notes)

Chest X‑Ray: ☐ Normal ☐ Abnormal (+notes)



Section 4 — Laboratory Investigation (grid on paper)



Stool: Ova, Amoeba, Flagyl (if listed), RBC, WBC → Normal/Abnormal + Result

Urine: Sugar, Albumin, Pregnancy Test, Blood → Result

Serology: HBsAg, HCV, HIV, VDRL, PPD/NHM → Result



Final Result \& Declarations



RESULT: ☐ FIT ☐ UNFIT

Patient Declaration: Signature, Date

Doctor Declaration: Signature, Date

Hospital Stamp (attachment)



MODULE: STORE / INVENTORY \& FINANCE DOCUMENTS

A) Supplier Invoice (Wholesale paper with batch table)

Invoice Header



Supplier Name

Supplier TIN

Supplier Address/Phone

Invoice No.

Invoice Date

Buyer (Clinic) Name

Buyer TIN (if printed)

Prepared By

Approved By

Received By

Stamp/Seal (attachment)



Invoice Lines (table on paper)



Item/Drug Name

Batch Number

MFG Date

EXP Date

Unit of Measure

Quantity

Unit Price (ETB)

Line Total



B) GRN — Goods Receipt Note (to connect with invoice)

Fields



Supplier Invoice No.

Supplier Invoice Photo (file)

Received By

GRN Status: ☐ Draft ☐ Checked ☐ Approved ☐ Posted

Lines (per received item):



Item/Drug Name

Batch Number

Expiry Date

Lot Number (if separate)

UoM

Quantity Received

Quantity Accepted

Quantity Rejected

Notes/Discrepancy



C) POS / Cash Receipt (Narrow till receipt)

Header



Receipt No.

Terminal/POS ID (if printed)

Date \& Time

Seller (Store) Name

Seller TIN

Buyer Name (optional)

Cashier



Lines



Item Name

Quantity

Unit Price

Line Total



Totals



Subtotal

Discount (optional)

Tax/VAT (optional)

Total

Payment Type: Cash / Card / Mobile / Other

Note/Reference





Quick mapping (how these forms connect)



Prescription → Pharmacy Dispense (use Rx lines + batch selection).

Lab Request (Checklist) → Device CBC Result (link by request or sample ID).

Supplier Invoice → GRN (verify lines, capture batch/expiry, attach photo).

POS Receipt (use for pharmacy OTC sales or store retail).









 

