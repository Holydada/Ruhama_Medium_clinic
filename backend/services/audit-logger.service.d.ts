import { Request, Response, NextFunction } from 'express';
export declare const auditLogger: {
    log(data: {
        userId?: string;
        action: string;
        resource: string;
        resourceId?: string;
        oldValues?: any;
        newValues?: any;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<void>;
};
export declare function auditMiddleware(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=audit-logger.service.d.ts.map