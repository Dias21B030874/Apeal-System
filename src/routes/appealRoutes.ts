import express from 'express';
import appealController from '../controllers/appealController';
import { validateRequest } from '../middlware/validateRequest';
import { createAppealSchema, completeAppealSchema, cancelAppealSchema, getAppealsSchema } from '../utils/validationSchemas';

const router = express.Router();

/**
 * @openapi
 * /appeals:
 *   post:
 *     summary: Создать новое обращение
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppealInput'
 *     responses:
 *       201:
 *         description: Обращение успешно создано
 */
router.post('/appeals', validateRequest(createAppealSchema), appealController.createAppeal);

/**
 * @openapi
 * /appeals/{id}/take:
 *   put:
 *     summary: Взять обращение в работу
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Обращение взято в работу
 */
router.put('/appeals/:id/take', appealController.takeAppeal);

/**
 * @openapi
 * /appeals/{id}/complete:
 *   put:
 *     summary: Завершить обработку обращения
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompleteAppealInput'
 *     responses:
 *       200:
 *         description: Обращение успешно завершено
 */
router.put('/appeals/:id/complete', validateRequest(completeAppealSchema), appealController.completeAppeal);

/**
 * @openapi
 * /appeals/{id}/cancel:
 *   put:
 *     summary: Отменить обращение
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelAppealInput'
 *     responses:
 *       200:
 *         description: Обращение успешно отменено
 */
router.put('/appeals/:id/cancel', validateRequest(cancelAppealSchema), appealController.rejectAppeal);

/**
 * @openapi
 * /appeals:
 *   get:
 *     summary: Получить список обращений
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt]
 *           default: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *     responses:
 *       200:
 *         description: Список обращений успешно получен
 */
router.get('/appeals', validateRequest(getAppealsSchema), appealController.getAppeals);

/**
 * @openapi
 * /appeals/cancel-all-in-progress:
 *   put:
 *     summary: Отменить все обращения в статусе "В работе"
 *     responses:
 *       200:
 *         description: Все обращения в статусе "В работе" успешно отменены
 */
router.put('/appeals/cancel-all-in-progress', appealController.rejectAllInProgress);

export default router;