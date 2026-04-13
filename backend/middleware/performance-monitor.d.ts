import { Request, Response, NextFunction } from 'express';
export declare const performanceMonitor: {
    getHealthCheck(): {
        status: string;
        uptime: number;
        timestamp: string;
        memory: NodeJS.MemoryUsage;
    };
    getMetrics(): {
        requests: number;
        errors: number;
        avgResponseTime: number;
    };
};
export declare const cache: Map<any, any>;
export declare function performanceMiddleware(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=performance-monitor.d.ts.map