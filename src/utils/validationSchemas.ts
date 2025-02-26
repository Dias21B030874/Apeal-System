import Joi from 'joi';

export const createAppealSchema = Joi.object({
  topic: Joi.string().required().min(3).max(100),
  text: Joi.string().required().min(10).max(1000),
});

export const completeAppealSchema = Joi.object({
  resolution: Joi.string().required().min(10).max(1000),
});

export const cancelAppealSchema = Joi.object({
  cancellationReason: Joi.string().required().min(10).max(1000),
});

export const getAppealsSchema = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  sortBy: Joi.string().valid('createdAt', 'updatedAt').default('createdAt'),
  order: Joi.string().valid('ASC', 'DESC').default('DESC'),
});