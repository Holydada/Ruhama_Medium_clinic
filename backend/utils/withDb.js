"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withDb = withDb;
const client_1 = require("@prisma/client");
/**
 * Maps common Prisma errors to stable API-facing messages.
 * Controllers already catch Error.message; this keeps DB failures readable.
 */
async function withDb(fn) {
    try {
        return await fn();
    }
    catch (e) {
        if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            switch (e.code) {
                case 'P2002':
                    throw new Error('A record with this unique value already exists');
                case 'P2003':
                    throw new Error('Invalid reference: related record was not found');
                case 'P2025':
                    throw new Error('Record not found');
                default:
                    throw new Error(e.message || 'Database error');
            }
        }
        throw e;
    }
}
//# sourceMappingURL=withDb.js.map