import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
export declare const sanitizeString: (str: string) => string;
export declare const sanitizeObject: (obj: any) => any;
export declare const validateRequest: (schema: {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const commonSchemas: {
    id: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    date: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
        limit: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        limit?: number;
        page?: number;
    }, {
        limit?: string;
        page?: string;
    }>;
    search: z.ZodObject<{
        q: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        q?: string;
    }, {
        q?: string;
    }>;
};
export declare const preventSQLInjection: (input: string) => boolean;
export declare const validateFileUpload: (file: Express.Multer.File, options?: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
}) => boolean;
//# sourceMappingURL=input-validator.d.ts.map