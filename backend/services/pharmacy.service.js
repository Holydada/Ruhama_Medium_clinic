"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyService = void 0;
const database_1 = __importDefault(require("../config/database"));
const withDb_1 = require("../utils/withDb");
class PharmacyService {
    // Drug Management
    async createDrug(data) {
        if (!data?.drugName || !String(data.drugName).trim()) {
            throw new Error('drugName is required');
        }
        return (0, withDb_1.withDb)(() => database_1.default.drug.create({
            data: {
                ...data,
                drugName: String(data.drugName).trim(),
                isActive: true,
            },
        }));
    }
    async getDrugs(params) {
        const where = {};
        if (params.search) {
            where.OR = [
                { drugName: { contains: params.search, mode: 'insensitive' } },
                { genericName: { contains: params.search, mode: 'insensitive' } },
                { brandName: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        if (params.category) {
            where.drugCategory = params.category;
        }
        if (params.isActive !== undefined) {
            where.isActive = params.isActive;
        }
        const page = params.page && params.page > 0 ? params.page : 1;
        const limitRaw = params.limit && params.limit > 0 ? params.limit : 500;
        const limit = Math.min(limitRaw, 1000);
        const skip = (page - 1) * limit;
        const [drugs, total] = await Promise.all([
            database_1.default.drug.findMany({
                where,
                skip,
                take: limit,
                orderBy: { drugName: 'asc' },
            }),
            database_1.default.drug.count({ where }),
        ]);
        return {
            drugs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    // Stock Management
    async addStock(data) {
        if (!Number.isFinite(data.quantityInStock) || data.quantityInStock <= 0) {
            throw new Error('quantityInStock must be greater than 0');
        }
        if (!Number.isFinite(data.unitPrice) || data.unitPrice < 0 || !Number.isFinite(data.sellingPrice) || data.sellingPrice < 0) {
            throw new Error('unitPrice and sellingPrice must be non-negative numbers');
        }
        const exp = new Date(data.expiryDate);
        if (Number.isNaN(exp.getTime())) {
            throw new Error('expiryDate is invalid');
        }
        const drug = await database_1.default.drug.findUnique({ where: { id: data.drugId }, select: { id: true, isActive: true } });
        if (!drug) {
            throw new Error('Drug not found');
        }
        if (!drug.isActive) {
            throw new Error('Cannot add stock for an inactive drug');
        }
        return (0, withDb_1.withDb)(() => database_1.default.pharmacyStock.create({
            data: {
                ...data,
                expiryDate: exp,
                receivedDate: new Date(),
                status: 'AVAILABLE',
            },
            include: {
                drug: true,
            },
        }));
    }
    async getStock(params) {
        const page = params.page || 1;
        const limit = params.limit || 50;
        const skip = (page - 1) * limit;
        const where = {};
        if (params.search) {
            where.drug = {
                OR: [
                    { drugName: { contains: params.search, mode: 'insensitive' } },
                    { genericName: { contains: params.search, mode: 'insensitive' } },
                ],
            };
        }
        if (params.status) {
            where.status = params.status;
        }
        if (params.lowStock) {
            where.quantityInStock = {
                lte: database_1.default.pharmacyStock.fields.reorderLevel,
            };
        }
        const [stocks, total] = await Promise.all([
            database_1.default.pharmacyStock.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    drug: true,
                },
            }),
            database_1.default.pharmacyStock.count({ where }),
        ]);
        return {
            stocks,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getStockById(id) {
        const stock = await database_1.default.pharmacyStock.findUnique({
            where: { id },
            include: {
                drug: true,
            },
        });
        if (!stock) {
            throw new Error('Stock not found');
        }
        return stock;
    }
    async updateStock(id, data) {
        if (data.quantityInStock !== undefined && (!Number.isFinite(data.quantityInStock) || data.quantityInStock < 0)) {
            throw new Error('quantityInStock must be a non-negative number');
        }
        const updateData = {
            ...(data.quantityInStock !== undefined && { quantityInStock: data.quantityInStock }),
            ...(data.status !== undefined && { status: data.status }),
        };
        if (Object.keys(updateData).length === 0) {
            throw new Error('No fields to update');
        }
        return (0, withDb_1.withDb)(() => database_1.default.pharmacyStock.update({
            where: { id },
            data: updateData,
            include: {
                drug: true,
            },
        }));
    }
    async getLowStockAlerts() {
        const alerts = await database_1.default.pharmacyStock.findMany({
            where: {
                OR: [
                    {
                        quantityInStock: {
                            lte: database_1.default.pharmacyStock.fields.reorderLevel,
                        },
                    },
                    {
                        status: 'LOW',
                    },
                ],
            },
            include: {
                drug: true,
            },
            orderBy: { quantityInStock: 'asc' },
        });
        return alerts;
    }
    async getExpiringStock(daysThreshold = 90, limit) {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
        const take = limit && limit > 0 ? Math.min(limit, 1000) : 500;
        const expiringStock = await database_1.default.pharmacyStock.findMany({
            where: {
                expiryDate: {
                    lte: thresholdDate,
                },
                status: {
                    not: 'EXPIRED',
                },
            },
            include: {
                drug: true,
            },
            orderBy: { expiryDate: 'asc' },
            take,
        });
        return expiringStock;
    }
    // Dispensing
    async dispenseStock(data) {
        if (!Number.isFinite(data.quantity) || data.quantity <= 0) {
            throw new Error('Dispense quantity must be greater than 0');
        }
        const stock = await database_1.default.pharmacyStock.findUnique({
            where: { id: data.stockId },
        });
        if (!stock) {
            throw new Error('Stock not found');
        }
        if (stock.quantityInStock < data.quantity) {
            throw new Error('Insufficient stock');
        }
        const newQuantity = stock.quantityInStock - data.quantity;
        let newStatus = stock.status;
        if (newQuantity === 0) {
            newStatus = 'OUT_OF_STOCK';
        }
        else if (newQuantity <= stock.reorderLevel) {
            newStatus = 'LOW';
        }
        const updatedStock = await (0, withDb_1.withDb)(() => database_1.default.pharmacyStock.update({
            where: { id: data.stockId },
            data: {
                quantityInStock: newQuantity,
                status: newStatus,
            },
            include: {
                drug: true,
            },
        }));
        return updatedStock;
    }
}
exports.PharmacyService = PharmacyService;
//# sourceMappingURL=pharmacy.service.js.map