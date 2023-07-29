import express from 'express';
import { getDentists } from '../../controllers/dentist.controller';
import authorizeUser from '../middlewares/auth';

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
router.get('/', authorizeUser('dentist'), getDentists);

export default router; 
