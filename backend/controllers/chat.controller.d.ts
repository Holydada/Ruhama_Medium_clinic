import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class ChatController {
    getUsers(req: AuthRequest, res: Response): Promise<void>;
    getConversation(req: AuthRequest, res: Response): Promise<void>;
    sendMessage(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=chat.controller.d.ts.map