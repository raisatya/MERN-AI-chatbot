import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.auth_token;
    if (!token || token.jwt === null) throw new NotAuthorizedError();

    next();
}