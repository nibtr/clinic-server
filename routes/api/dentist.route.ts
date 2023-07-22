import express, { Request, Response } from 'express';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dentists
 *   description: The books managing API
 * /api/dentists:
 *   post:
 *     summary: Read dentist
 *     tags: [Dentists]
 *     responses:
 *       200:
 *         description: The created book.
 *       500:
 *         description: Some server error
 *
 */
router.get('/', (_: Request, res: Response) => {
  res.status(200).send('GET /dentists');
});

export default router;
