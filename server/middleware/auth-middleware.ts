import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload as JwtPayloadType } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload extends JwtPayloadType {
  userId: number;
}

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized' }); // Unauthorized
    }

    const token = authHeader.split(' ')[1]; //Bearer <token>
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' }); // Unauthorized
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded; // Attach user info to request object
    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error('Error in authenticateToken middleware:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
