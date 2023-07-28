import express from 'express';
import dentistRoute from './api/dentist.route';
// API routes (/api/...)
const router = express.Router();

router.use('/dentists', dentistRoute);

export default router;