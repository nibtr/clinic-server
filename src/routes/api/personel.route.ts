import express from 'express';
import * as personelController from '../../controllers/personnel.controller';

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


router.get('/personels', personelController.getPersonnels);

export default router;
