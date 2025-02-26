import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { NotFoundError, ValidationError } from '../utils/errors';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message }); 
    return; 
  }
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message }); 
    return; 
  }

  console.error(err.stack);

  res.status(500).json({ error: 'Something went wrong!' });
};