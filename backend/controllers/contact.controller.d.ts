import { Request, Response } from 'express';
export declare const contactController: {
    submitMessage(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllMessages(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getMessageById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    respondToMessage(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateMessageStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteMessage(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=contact.controller.d.ts.map