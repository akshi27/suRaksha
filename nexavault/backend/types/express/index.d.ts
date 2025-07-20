// /backend/types/express/index.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface UserPayload {
      userId: string;
      email: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
