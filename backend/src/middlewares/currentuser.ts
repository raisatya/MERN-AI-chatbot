import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface UserPayLoad {
    id: string;
    name: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayLoad;
        }
    }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
    if(!req.cookies.currentUser) {
        return next();
    }

    const token = req.cookies.currentUser;

    if (!token || token.jwt === null) {
        
    }

      try {
        const payload = jwt.verify(
          token.jwt,
          process.env.JWT_SECRET!
        ) as UserPayLoad;
        req.currentUser = payload;
      } catch (error) {
        console.log(error);
      }

    next();
}