import { Request, Response, NextFunction } from 'express';

export type ControllerSignature = (req: Request, res: Response, next: NextFunction) => void;
