import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    statusCode: number;
    code: string;
    isOperational: boolean;
    details?: any;
    constructor(statusCode: number, code: string, message: string, isOperational?: boolean, details?: any);
}
export declare const globalErrorHandler: (err: Error | AppError, req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
export declare const errors: {
    notFound: (resource: string) => AppError;
    unauthorized: (message?: string) => AppError;
    forbidden: (message?: string) => AppError;
    badRequest: (message: string, details?: any) => AppError;
    conflict: (message: string) => AppError;
    validation: (message: string, details?: any) => AppError;
    internal: (message?: string) => AppError;
};
//# sourceMappingURL=global-error-handler.d.ts.map