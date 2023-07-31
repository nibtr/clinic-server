import express from 'express';
import * as dentistController from '../../controllers/dentist.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dentists
 *   description: Get all dentists
 * /api/dentists:
 *   get:
 *     summary: Get all dentists
 *     tags: [Dentists]
 *     responses:
 *       200:
 *         description: List of all dentists
 *       500:
 *         description: Some server error
 *
 */
// router.get('/dentists', dentistController.getDentists);
// router.get('/dentist/:id', dentistController.getDentistById);
router.get('/sessions/:id', dentistController.getSessionById);

export default router;
