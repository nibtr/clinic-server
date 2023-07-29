import express from 'express';
import dentistRoute from './api/dentist.route';
// API routes (/api/...)
const router = express.Router();

router.use('/dentist', dentistRoute);

export default router;