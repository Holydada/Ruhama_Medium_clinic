/**
 * Maps common Prisma errors to stable API-facing messages.
 * Controllers already catch Error.message; this keeps DB failures readable.
 */
export declare function withDb<T>(fn: () => Promise<T>): Promise<T>;
//# sourceMappingURL=withDb.d.ts.map