"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataExportService = exports.DataExportService = void 0;
const client_1 = require("@prisma/client");
const XLSX = __importStar(require("xlsx"));
const json2csv_1 = require("json2csv");
const PDFDocument = __importStar(require("pdfkit"));
const prisma = new client_1.PrismaClient();
class DataExportService {
    /**
     * Export patients to Excel
     */
    async exportPatientsToExcel(filters) {
        const patients = await prisma.patient.findMany({
            where: filters,
            include: {
                visits: {
                    select: {
                        visitDate: true,
                        visitType: true,
                        status: true,
                    },
                    orderBy: { visitDate: 'desc' },
                    take: 1,
                },
            },
        });
        const data = patients.map(p => ({
            'Card Number': p.cardNumber,
            'Full Name': p.fullName,
            'Date of Birth': p.dateOfBirth.toISOString().split('T')[0],
            'Age': this.calculateAge(p.dateOfBirth),
            'Sex': p.sex,
            'Phone': p.phone || '',
            'Email': p.email || '',
            'Address': p.address || '',
            'Blood Group': p.bloodGroup || '',
            'Has Allergies': p.hasAllergies ? 'Yes' : 'No',
            'Allergies': p.allergies || '',
            'Last Visit': p.visits[0]?.visitDate.toISOString().split('T')[0] || 'Never',
            'Registration Date': p.createdAt.toISOString().split('T')[0],
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Patients');
        return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    }
    /**
     * Export visits to Excel
     */
    async exportVisitsToExcel(startDate, endDate) {
        const visits = await prisma.visit.findMany({
            where: {
                visitDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                patient: {
                    select: {
                        cardNumber: true,
                        fullName: true,
                        phone: true,
                    },
                },
                doctor: {
                    select: {
                        fullName: true,
                    },
                },
            },
            orderBy: { visitDate: 'desc' },
        });
        const data = visits.map(v => ({
            'Visit Date': v.visitDate.toISOString().split('T')[0],
            'Card Number': v.patient.cardNumber,
            'Patient Name': v.patient.fullName,
            'Phone': v.patient.phone || '',
            'Visit Type': v.visitType,
            'Doctor': v.doctor?.fullName || 'Not Assigned',
            'Status': v.status,
            'Chief Complaint': v.chiefComplaint || '',
            'Diagnosis': v.diagnosis || '',
            'Payment Status': v.paymentStatus,
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Visits');
        return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    }
    /**
     * Export financial report to Excel
     */
    async exportFinancialReport(startDate, endDate) {
        const payments = await prisma.payment.findMany({
            where: {
                paymentDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                visit: {
                    include: {
                        patient: {
                            select: {
                                cardNumber: true,
                                fullName: true,
                            },
                        },
                    },
                },
            },
            orderBy: { paymentDate: 'desc' },
        });
        const data = payments.map(p => ({
            'Date': p.paymentDate.toISOString().split('T')[0],
            'Receipt Number': p.receiptNumber,
            'Card Number': p.visit.patient.cardNumber,
            'Patient Name': p.visit.patient.fullName,
            'Amount': p.amount,
            'Payment Method': p.paymentMethod,
            'Service Type': p.serviceType,
            'Cashier': p.cashierName || '',
        }));
        // Add summary sheet
        const summary = {
            'Total Payments': payments.length,
            'Total Amount': payments.reduce((sum, p) => sum + p.amount, 0),
            'Cash Payments': payments.filter(p => p.paymentMethod === 'CASH').length,
            'Card Payments': payments.filter(p => p.paymentMethod === 'CARD').length,
            'Mobile Payments': payments.filter(p => p.paymentMethod === 'MOBILE').length,
        };
        const workbook = XLSX.utils.book_new();
        const summarySheet = XLSX.utils.json_to_sheet([summary]);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
        const detailSheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, detailSheet, 'Payments');
        return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    }
    /**
     * Export lab orders to Excel
     */
    async exportLabOrdersToExcel(startDate, endDate) {
        const orders = await prisma.labOrder.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                patient: {
                    select: {
                        cardNumber: true,
                        fullName: true,
                    },
                },
                doctor: {
                    select: {
                        fullName: true,
                    },
                },
                items: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        const data = orders.flatMap(order => order.items.map(item => ({
            'Order Date': order.createdAt.toISOString().split('T')[0],
            'Card Number': order.patient.cardNumber,
            'Patient Name': order.patient.fullName,
            'Doctor': order.doctor.fullName,
            'Test Name': item.testName,
            'Status': item.status,
            'Result': item.result || 'Pending',
            'Verified': item.verifiedAt ? 'Yes' : 'No',
            'Verified By': item.verifiedBy || '',
        })));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Lab Orders');
        return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    }
    /**
     * Export prescriptions to Excel
     */
    async exportPrescriptionsToExcel(startDate, endDate) {
        const prescriptions = await prisma.prescription.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                patient: {
                    select: {
                        cardNumber: true,
                        fullName: true,
                    },
                },
                doctor: {
                    select: {
                        fullName: true,
                    },
                },
                items: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        const data = prescriptions.flatMap(rx => rx.items.map(item => ({
            'Date': rx.createdAt.toISOString().split('T')[0],
            'Card Number': rx.patient.cardNumber,
            'Patient Name': rx.patient.fullName,
            'Doctor': rx.doctor.fullName,
            'Drug Name': item.drugName,
            'Dosage': item.dosage,
            'Frequency': item.frequency,
            'Duration': item.duration,
            'Quantity': item.quantity,
            'Status': item.status,
            'Dispensed': item.dispensedAt ? 'Yes' : 'No',
        })));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Prescriptions');
        return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    }
    /**
     * Export inventory to Excel
     */
    async exportInventoryToExcel() {
        const items = await prisma.inventoryItem.findMany({
            orderBy: { itemName: 'asc' },
        });
        const data = items.map(item => ({
            'Item Code': item.itemCode,
            'Item Name': item.itemName,
            'Category': item.category,
            'Unit': item.unit,
            'Quantity': item.quantity,
            'Reorder Level': item.reorderLevel,
            'Unit Price': item.unitPrice,
            'Total Value': item.quantity * item.unitPrice,
            'Expiry Date': item.expiryDate.toISOString().split('T')[0],
            'Supplier': item.supplier || '',
            'Location': item.location || '',
            'Status': item.quantity <= item.reorderLevel ? 'Low Stock' : 'OK',
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
        return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    }
    /**
     * Export to CSV
     */
    async exportToCSV(data, fields) {
        const parser = new json2csv_1.Parser({ fields });
        return parser.parse(data);
    }
    /**
     * Generate patient report PDF
     */
    async generatePatientReportPDF(patientId) {
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
            include: {
                visits: {
                    include: {
                        doctor: true,
                    },
                    orderBy: { visitDate: 'desc' },
                    take: 10,
                },
                prescriptions: {
                    include: {
                        items: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
                labOrders: {
                    include: {
                        items: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
        });
        if (!patient) {
            throw new Error('Patient not found');
        }
        return new Promise((resolve, reject) => {
            const chunks = [];
            const doc = new PDFDocument();
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            // Header
            doc.fontSize(20).text('Patient Medical Report', { align: 'center' });
            doc.moveDown();
            // Patient Info
            doc.fontSize(14).text('Patient Information', { underline: true });
            doc.fontSize(10);
            doc.text(`Card Number: ${patient.cardNumber}`);
            doc.text(`Name: ${patient.fullName}`);
            doc.text(`Date of Birth: ${patient.dateOfBirth.toISOString().split('T')[0]}`);
            doc.text(`Age: ${this.calculateAge(patient.dateOfBirth)} years`);
            doc.text(`Sex: ${patient.sex}`);
            doc.text(`Phone: ${patient.phone || 'N/A'}`);
            doc.text(`Blood Group: ${patient.bloodGroup || 'N/A'}`);
            doc.moveDown();
            // Recent Visits
            doc.fontSize(14).text('Recent Visits', { underline: true });
            doc.fontSize(10);
            patient.visits.forEach(visit => {
                doc.text(`${visit.visitDate.toISOString().split('T')[0]} - ${visit.visitType}`);
                doc.text(`  Doctor: ${visit.doctor?.fullName || 'N/A'}`);
                doc.text(`  Diagnosis: ${visit.diagnosis || 'N/A'}`);
                doc.moveDown(0.5);
            });
            doc.end();
        });
    }
    /**
     * Calculate age from date of birth
     */
    calculateAge(dateOfBirth) {
        const today = new Date();
        let age = today.getFullYear() - dateOfBirth.getFullYear();
        const monthDiff = today.getMonth() - dateOfBirth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
            age--;
        }
        return age;
    }
}
exports.DataExportService = DataExportService;
exports.dataExportService = new DataExportService();
//# sourceMappingURL=data-export.service.js.map