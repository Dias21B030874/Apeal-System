import { Request, Response } from 'express';
import appealService from '../services/appealService';
import { NotFoundError, ValidationError, DatabaseError } from '../utils/errors';
import logger from '../utils/logger';

class AppealController {

  async createAppeal(req: Request, res: Response) {
    try {
      const { topic, text } = req.body;
      const appeal = await appealService.createAppeal(topic, text);
      res.status(201).json(appeal);
    } catch (error) {
      if (error instanceof DatabaseError) {
        res.status(500).json({ error: error.message });
      } 
    }
  }

  async takeAppeal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const appeal = await appealService.takeAppeal(Number(id));
      res.json(appeal);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async rejectAppeal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { cancellationReason } = req.body;
      const appeal = await appealService.rejectAppeal(Number(id), cancellationReason);
      res.json(appeal);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async completeAppeal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { resolution } = req.body;
      const appeal = await appealService.completeAppeal(Number(id), resolution);
      res.json(appeal);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getAppeals(req: Request, res: Response) {
    try {
      const { startDate, endDate, page, limit, sortBy, order } = req.query;
      const appeals = await appealService.getAppeals(
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined,
        Number(page),
        Number(limit),
        sortBy as string,
        order as string,
      );
      res.json(appeals);
    } catch (error) {
      if (error instanceof DatabaseError) {
        res.status(500).json({ error: error.message });
      } 
    }
  }

  async rejectAllInProgress(req: Request, res: Response) {
    try {
      const affectedCount = await appealService.rejectAllInProgress();
      res.json({ message: `Rejected ${affectedCount} appeals` });
    } catch (error) {
      if (error instanceof DatabaseError) {
        res.status(500).json({ error: error.message });
      } 
    }
  }

}

export default new AppealController();