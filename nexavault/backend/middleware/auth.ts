import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Extend Express's Request type to include user
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

/**
 * Middleware to authenticate requests using JWT tokens.
 */
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || '', (err, decoded) => {
      if (err || !decoded || typeof decoded === 'string') {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      const { userId, email } = decoded as JwtPayload;

      req.user = {
        userId: userId as string,
        email: email as string
      };

      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
