import express from 'express';
import { getPersonelById, getPersonels } from '../../controllers/personel.controller';

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

// router.get('/personels', getPersonels);
router.get('/personel/:id', getPersonelById);

export default router;
