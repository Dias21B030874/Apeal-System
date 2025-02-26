import { Op } from "sequelize";
import Appeal from "../models/appeal";
import logger from '../utils/logger';
import { NotFoundError, ValidationError, DatabaseError } from '../utils/errors';

class AppealService {

  async createAppeal(topic: string, text: string) {
    try {
      const appeal = await Appeal.create({ topic, text });
      logger.info(`Appeal created: ${appeal.id}`);
      return appeal;
    } catch (error) {
      logger.error(`Error creating appeal: ${error}`);
      throw new DatabaseError('Failed to create appeal');
    }
  }

  async takeAppeal(id: number) {
    try {
      const appeal = await Appeal.findByPk(id);
      if (!appeal) {
        throw new NotFoundError('Appeal not found');
      }
      if (appeal.status !== 'Новое') {
        throw new ValidationError('Appeal is not in "Новое" status');
      }
      appeal.status = 'В работе';
      await appeal.save();
      logger.info(`Appeal ${id} taken to work`);
      return appeal;
    } catch (error) {
      logger.error(`Error taking appeal ${id}: ${error}`);
      throw error;
    }
  }

  async rejectAppeal(id: number, cancellationReason: string) {
    try {
      const appeal = await Appeal.findByPk(id);
      if (!appeal) {
        throw new NotFoundError('Appeal not found');
      }
      if (appeal.status !== 'Новое' && appeal.status !== 'В работе') {
        throw new ValidationError('Appeal cannot be rejected in its current status');
      }
      appeal.status = 'Отменено';
      appeal.cancellationReason = cancellationReason;
      await appeal.save();
      logger.info(`Appeal ${id} rejected with reason: ${cancellationReason}`);
      return appeal;
    } catch (error) {
      logger.error(`Error rejecting appeal ${id}: ${error}`);
      throw error;
    }
  }

  async completeAppeal(id: number, resolution: string) {
    try {
      const appeal = await Appeal.findByPk(id);
      if (!appeal) {
        throw new NotFoundError('Appeal not found');
      }
      if (appeal.status !== 'В работе') {
        throw new ValidationError('Appeal is not in "В работе" status');
      }
      appeal.status = 'Завершено';
      appeal.resolution = resolution;
      await appeal.save();
      logger.info(`Appeal ${id} completed with resolution: ${resolution}`);
      return appeal;
    } catch (error) {
      logger.error(`Error completing appeal ${id}: ${error}`);
      throw error;
    }
  }

  async getAppeals(startDate?: Date, endDate?: Date, page: number = 1, limit: number = 10, sortBy: string = 'createdAt', order: string = 'DESC') {
    try {
      const offset = (page - 1) * limit;

      const where: any = {};
      if (startDate && endDate) {
        where.createdAt = {
          [Op.between]: [startDate, endDate],
        };
      }

      const appeals = await Appeal.findAll({
        where,
        offset,
        limit,
        order: [[sortBy, order]],
      });

      logger.info(`Fetched ${appeals.length} appeals`);
      return appeals;
    } catch (error) {
      logger.error(`Error fetching appeals: ${error}`);
      throw new DatabaseError('Failed to fetch appeals');
    }
  }

  async rejectAllInProgress() {
    try {
      const [affectedCount] = await Appeal.update(
        { status: 'Отменено' },
        { where: { status: 'В работе' } }
      );
      logger.info(`Rejected ${affectedCount} appeals in progress`);
      return affectedCount;
    } catch (error) {
      logger.error(`Error rejecting all in-progress appeals: ${error}`);
      throw new DatabaseError('Failed to reject all in-progress appeals');
    }
  }

}

export default new AppealService();